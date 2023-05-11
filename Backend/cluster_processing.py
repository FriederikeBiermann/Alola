import logging
import difflib
import asyncio
from typing import Any, Dict, List, Optional, Set

from pikachu.chem.structure import Structure
from pikachu.general import structure_to_smiles, svg_string_from_structure

from raichu.run_raichu import (
    build_cluster,
    TailoringRepresentation,
    get_tailoring_sites_atom_names,
)
from raichu.drawing.drawer import RaichuDrawer
from raichu.cluster.terpene_cluster import TerpeneCluster
from raichu.cluster.base_cluster import Cluster
from raichu.cluster.ripp_cluster import RiPPCluster
from raichu.cluster.modular_cluster import ModularCluster
from raichu.reactions.chain_release import find_all_o_n_atoms_for_cyclization
from raichu.tailoring_enzymes import TailoringEnzyme
from raichu.representations import (
    ModuleRepresentation,
    DomainRepresentation,
    ClusterRepresentation,
    MacrocyclizationRepresentation,
    IsomerizationRepresentation,
    MethylShiftRepresentation,
    WaterQuenchingRepresentation,
)
from raichu.smiles_handling import get_smiles, UNKNOWN_SUBSTRATE, load_smiles

# Preload known substrates once for fuzzy matching
_KNOWN_SUBSTRATES: Set[str] = set(load_smiles().keys())
if UNKNOWN_SUBSTRATE in _KNOWN_SUBSTRATES:
    _KNOWN_SUBSTRATES.remove(UNKNOWN_SUBSTRATE)


def process_svg(svg_string, svg_id):
    """
    Process and format an SVG string with a specific ID.
    :param svg_string: The raw SVG string.
    :param svg_id: The ID to be assigned to the SVG.
    :return: Formatted SVG string with the specified ID.
    """
    return (
        svg_string.replace("\n", "")
        .replace('"', "'")
        .replace("<svg", f" <svg id='{svg_id}'")
    )


class BasePathway:
    def __init__(self, antismash_input: str):
        """Initializes the BasePathway with given antiSMASH input data.

        Args:
            antismash_input (str): JSON string containing antiSMASH output data.

        Raises:
            ValueError: If the input JSON string is invalid or cannot be parsed.
        """

        self.antismash_input: Dict[str, Any] = antismash_input

        self.cluster: Optional[Cluster] = None
        self.tailoring_reactions: List[TailoringRepresentation] = [
            TailoringRepresentation(*enzyme)
            for enzyme in self.antismash_input.get("tailoring", [])
        ]
        self.cyclization: Optional[str] = self.antismash_input.get("cyclization", None)
        self.tailored_product: Optional[Structure] = None
        self.final_product: Optional[Structure] = None
        self.svg_structure_for_tailoring: Optional[str] = None
        self.svg_final: Optional[str] = None
        self.mass: Optional[float] = None
        self.sum_formula: Optional[str] = None
        self.pathway_svg: Optional[str] = None
        self.smiles: Optional[str] = None
        self.tailoring_sites: Optional[List[str]] = None
        self.atoms_for_cyclisation: Optional[List[str]] = None

        logging.info(f"Initialized BasePathway with cyclization: {self.cyclization}")

    def _draw_pathway_mass_smiles_tailoring_sites(self):
        """Generates mass, pathway SVG, SMILES, and tailoring sites for the final product.

        This method processes the final product to compute its mass, generate the SVG representations,
        and retrieve the tailoring sites and potential atoms for cyclization.

        Raises:
            ValueError: If `final_product` or `cluster` is not set before calling this method.
        """
        if not self.final_product or not self.cluster or not self.tailored_product:
            logging.error("Final product or cluster is not initialized before drawing.")
            raise ValueError("Final product and cluster must be initialized.")

        self.mass = self.final_product.get_mass()
        logging.debug(f"Computed mass: {self.mass}")

        self.sum_formula = self.final_product.get_sum_formula()
        logging.debug(f"Computed sum_formula: {self.sum_formula}")

        reactions = []

        if self.cluster.macrocyclisation_representations:
            reactions.append("cyclisation")

        if self.cluster.tailoring_representations:
            reactions.append("tailoring")

        if self.cluster.cleaved_intermediates:
            reactions.append("cleavage")

        if reactions:
            self.pathway_svg = self.cluster.draw_pathway(
                order=reactions, as_string=True
            )
            logging.debug("Generated pathway SVG.")
        else:
            self.pathway_svg = "not_able_to_draw_pathway"
            logging.warning("No pathway SVG could be generated.")

        try:
            self.smiles = structure_to_smiles(self.final_product, kekule=False)
            logging.debug(f"Generated SMILES: {self.smiles}")
        except Exception as e:
            logging.error(f"Failed to generate SMILES: {e}")
            self.smiles = "not_able_to_compute_smiles"

        self.tailoring_sites = get_tailoring_sites_atom_names(
            self.cluster.chain_intermediate
        )
        logging.debug(f"Identified tailoring sites: {self.tailoring_sites}")

        self.tailoring_sites["WATER_QUENCHING"] = sorted(
            set([[atom] for atom in
                self.tailoring_sites["C_METHYLTRANSFERASE"].flatten()
                + self.tailoring_sites["DOUBLE_BOND_REDUCTASE"].flatten()
            ])
        )

        self.atoms_for_cyclisation = [
            str(atom)
            for atom in find_all_o_n_atoms_for_cyclization(self.tailored_product)
            if str(atom) != "O_0"
        ]
        logging.debug(f"Identified atoms for cyclisation: {self.atoms_for_cyclisation}")

    def process_svg(self, svg_string: str, svg_id: str) -> str:
        """Processes and formats an SVG string by adding an ID.

        Args:
            svg_string (str): The raw SVG string.
            svg_id (str): The ID to be assigned to the SVG.

        Returns:
            str: The processed SVG string.
        """
        return (
            svg_string.replace("\n", "")
            .replace('"', "'")
            .replace("<svg", f" <svg id='{svg_id}'")
        )


class RiPPPathway(BasePathway):
    def __init__(self, antismash_input: str):
        """Initializes the RiPPPathway with given antiSMASH input data.

        Args:
            antismash_input (str): JSON string containing antiSMASH output data.
        """
        super().__init__(antismash_input)
        self.macrocyclisations: List[MacrocyclizationRepresentation] = [
            MacrocyclizationRepresentation(*cyclization)
            for cyclization in self.cyclization
            if len(cyclization) > 0
        ]

        self.cluster: RiPPCluster = RiPPCluster(
            self.antismash_input["rippPrecursorName"],
            self.antismash_input["rippFullPrecursor"],
            self.antismash_input["rippPrecursor"],
            macrocyclisations=self.macrocyclisations,
            tailoring_representations=self.tailoring_reactions,
        )
        logging.info("RiPPPathway initialized and cluster built.")

    async def process(self) -> Dict[str, Any]:
        """Processes the RiPP pathway and generates the necessary outputs.

        Returns:
            Dict[str, Any]: The response data containing SVGs, SMILES, mass, and other molecular information.
        """

        logging.info("Processing RiPP pathway.")
        self.cluster.make_peptide()
        peptide_svg = self.process_svg(
            self.cluster.draw_cluster(
                fold=10, size=7, as_string=True, draw_cs_in_pink=True
            ),
            "precursor_drawing",
        )
        if self.tailoring_reactions:
            self.cluster.do_tailoring()
        self.tailored_product = self.cluster.chain_intermediate
        svg_structure_for_tailoring = self.process_svg(
            self.cluster.draw_cluster(
                fold=10, size=7, as_string=True, draw_cs_in_pink=True
            ),
            "intermediate_drawing",
        )
        if self.macrocyclisations:
            self.cluster.do_macrocyclization()
        cyclised_product_svg = self.process_svg(
            self.cluster.draw_cluster(
                fold=5, size=7, as_string=True, draw_cs_in_pink=True
            ),
            "cyclised_drawing",
        )
        self.final_product = self.cluster.chain_intermediate
        cleaved_ripp_svg = self.process_svg(
            self.cluster.draw_product(as_string=True), "final_drawing"
        )
        self._draw_pathway_mass_smiles_tailoring_sites()

        amino_acids_for_cleavage = [
            aa.upper() + str(index)
            for index, aa in enumerate(self.antismash_input["rippPrecursor"])
        ]

        return await asyncio.sleep(
            0,
            {
                "svg": cleaved_ripp_svg,
                "smiles": self.smiles,
                "mass": self.mass,
                "sum_formula": self.sum_formula,
                "pathway_svg": self.pathway_svg,
                "atomsForCyclisation": str(self.atoms_for_cyclisation),
                "tailoringSites": self.tailoring_sites,
                "rawPeptideChain": peptide_svg,
                "cyclisedStructure": cyclised_product_svg,
                "aminoAcidsForCleavage": amino_acids_for_cleavage,
                "structureForTailoring": svg_structure_for_tailoring,
            },
        )


class NRPSPKSPathway(BasePathway):
    def __init__(self, antismash_input: str):
        """Initializes the NRPSPKSPathway with given antiSMASH input data.

        Args:
            antismash_input (str): JSON string containing antiSMASH output data.
        """
        super().__init__(antismash_input)
        self.cluster_representation = self._format_modular_cluster(
            self.antismash_input.get("clusterRepresentation", [])
        )
        # Log raw modules summary
        try:
            logging.debug(
                {
                    "event": "nrpspks.init.modules_raw",
                    "modules": [
                        {
                            "i": i,
                            "type": m.type,
                            "substrate": m.substrate,
                            "domains": len(getattr(m, "domains", []) or []),
                        }
                        for i, m in enumerate(self.cluster_representation.modules)
                    ],
                }
            )
        except Exception:
            logging.debug("Failed to log raw modules summary.")
        # Sanitize NRPS substrates: fall back to **Unknown** if a label is not recognized by RAIChU
        self._sanitize_nrps_substrates()
        try:
            logging.debug(
                {
                    "event": "nrpspks.init.modules_sanitized",
                    "modules": [
                        {
                            "i": i,
                            "type": m.type,
                            "substrate": m.substrate,
                            "domains": len(getattr(m, "domains", []) or []),
                        }
                        for i, m in enumerate(self.cluster_representation.modules)
                    ],
                }
            )
        except Exception:
            logging.debug("Failed to log sanitized modules summary.")
        self.cluster: ModularCluster = build_cluster(
            self.cluster_representation, strict=False
        )
        logging.info("NRPSPKSPathway initialized and cluster built.")

    def _sanitize_nrps_substrates(self) -> None:
        """Ensure NRPS substrates are valid; otherwise, set to UNKNOWN.

        This prevents failures when the frontend label does not match the
        backend substrate list by replacing unrecognized names with
        the canonical unknown token understood by RAIChU.
        """
        try:
            modules = getattr(self.cluster_representation, "modules", [])
        except Exception:
            modules = []

        def _canonicalize_name(name: Optional[str]) -> Optional[str]:
            if name is None:
                return None
            try:
                s = str(name).strip().strip("\"").strip("'")
            except Exception:
                return name
            # Collapse accidental double underscores and convert to spaces
            s = s.replace("__", "_").replace("_", " ")
            # If starts with d-/l- in lowercase, try uppercasing the prefix
            if s.startswith("d-"):
                return "D-" + s[2:]
            if s.startswith("l-"):
                return "L-" + s[2:]
            return s

        def _closest_known(name: str, cutoff: float = 0.82) -> Optional[str]:
            try:
                candidates = difflib.get_close_matches(name, list(_KNOWN_SUBSTRATES), n=1, cutoff=cutoff)
                return candidates[0] if candidates else None
            except Exception:
                return None

        for module in modules:
            try:
                if getattr(module, "type", None) == "NRPS":
                    substrate = getattr(module, "substrate", None)
                    if substrate is None:
                        continue
                    try:
                        # Will raise ValueError if not known
                        get_smiles(substrate)
                    except Exception:
                        # Try a canonicalized variant (e.g., D-/L- prefix normalization)
                        canonical = _canonicalize_name(substrate)
                        if canonical and canonical != substrate:
                            try:
                                get_smiles(canonical)
                                logging.info(
                                    {
                                        "event": "nrps.substrate.autocorrect",
                                        "from": substrate,
                                        "to": canonical,
                                    }
                                )
                                setattr(module, "substrate", canonical)
                                continue
                            except Exception:
                                pass
                        # Try fuzzy matching to a known substrate label
                        suggestion = _closest_known(canonical or substrate)
                        if suggestion:
                            logging.info(
                                {
                                    "event": "nrps.substrate.fuzzy_match",
                                    "from": substrate,
                                    "to": suggestion,
                                }
                            )
                            setattr(module, "substrate", suggestion)
                            continue
                        logging.warning(
                            f"Unrecognized NRPS substrate '{substrate}', falling back to {UNKNOWN_SUBSTRATE}."
                        )
                        setattr(module, "substrate", UNKNOWN_SUBSTRATE)
            except Exception:
                # Be conservative: never break the whole request on sanitation
                continue

    def _format_modular_cluster(self, raw_cluster: List[Any]) -> ClusterRepresentation:
        """Formats the raw cluster data into a ClusterRepresentation.

        Args:
            raw_cluster (List[Any]): The raw cluster data from antiSMASH.

        Returns:
            ClusterRepresentation: The formatted cluster representation.
        """
        formatted_modules = []
        for module in raw_cluster:
            formatted_domains = []
            for domain in module[3]:
                # Format fake booleans
                domain = map(lambda x: x if x != "None" else None, domain)
                domain = map(lambda x: x if x != "True" else True, domain)
                domain = map(lambda x: x if x != "False" else False, domain)
                formatted_domains += [DomainRepresentation(*domain)]
            formatted_modules += [
                ModuleRepresentation(
                    module[0],
                    None if module[1] == "None" else module[1],
                    module[2],
                    formatted_domains,
                )
            ]
        return ClusterRepresentation(formatted_modules, self.tailoring_reactions)

    async def process(self) -> Dict[str, Any]:
        """Processes the NRPS/PKS pathway and generates the necessary outputs.

        Returns:
            Dict[str, Any]: The response data containing SVGs, SMILES, mass, and other molecular information.
        """
        logging.info("Processing NRPS/PKS pathway.")
        try:
            logging.debug("compute_structures: start")
            self.cluster.compute_structures(compute_cyclic_products=False)
            logging.debug("compute_structures: done")
        except Exception as e:
            logging.error({"event": "compute_structures.error", "error": str(e)})
            raise
        try:
            logging.debug("do_tailoring: start")
            self.cluster.do_tailoring()
            logging.debug("do_tailoring: done")
        except Exception as e:
            logging.error({"event": "do_tailoring.error", "error": str(e)})
            raise
        self.tailored_product = self.cluster.chain_intermediate.deepcopy()
        self.final_product = self._perform_cyclization()
        self._draw_pathway_mass_smiles_tailoring_sites()
        self._prepare_svgs()
        return await asyncio.sleep(0, self._prepare_response())

    def _perform_cyclization(self) -> Structure:
        """Performs cyclization if specified.

        Returns:
            Structure: The final product after cyclization.

        Raises:
            ValueError: If the specified cyclization atom does not exist.
        """
        if self.cyclization and self.cyclization != "None":
            atom_cyclization = next(
                (
                    atom
                    for atom in self.tailored_product.atoms.values()
                    if str(atom) == self.cyclization
                ),
                None,
            )
            if not atom_cyclization:
                logging.error(f"Cyclization atom {self.cyclization} does not exist.")
                raise ValueError(
                    f"Atom {self.cyclization} for cyclization does not exist."
                )
            self.cluster.cyclise(atom_cyclization)
            logging.info(f"Cyclization performed on atom {self.cyclization}.")
            return self.cluster.cyclic_product
        logging.info("No cyclization performed.")
        return self.cluster.chain_intermediate

    def _prepare_svgs(self):
        """Prepares the SVG representations for the tailored and final products."""
        logging.info("Preparing SVGs.")
        structure_for_tailoring = RaichuDrawer(
            self.tailored_product,
            dont_show=True,
            add_url=True,
            make_linear=False,
            draw_Cs_in_pink=True,
        )
        structure_final_product = RaichuDrawer(
            self.final_product,
            dont_show=True,
            add_url=True,
            make_linear=False,
            draw_Cs_in_pink=True,
        )
        structure_for_tailoring.draw_structure()
        self.svg_structure_for_tailoring = self.process_svg(
            structure_for_tailoring.get_svg_string_matplotlib(), "tailoring_drawing"
        )
        structure_final_product.draw_structure()
        self.svg_final = self.process_svg(
            structure_final_product.get_svg_string_matplotlib(), "final_drawing"
        )
        logging.debug("SVGs prepared.")

    def _prepare_response(self) -> Dict[str, Any]:
        """Prepares the response data after processing.

        Returns:
            Dict[str, Any]: The response data with molecular information.
        """
        logging.info("Preparing response data.")
        return {
            "svg": self.svg_final,
            "hangingSvg": self._get_drawings(self.cluster),
            "smiles": self.smiles,
            "mass": self.mass,
            "sum_formula": self.sum_formula,
            "pathway_svg": self.pathway_svg,
            "atomsForCyclisation": str(self.atoms_for_cyclisation),
            "tailoringSites": str(
                get_tailoring_sites_atom_names(self.tailored_product)
            ),
            "completeClusterSvg": self.cluster.draw_cluster(),
            "structureForTailoring": self.svg_structure_for_tailoring,
        }

    def _get_drawings(self, cluster: Cluster) -> List[List[Any]]:
        """Generates SVG representations of the cluster's intermediates.

        Args:
            cluster (Cluster): The cluster object to generate drawings for.

        Returns:
            List[List[Any]]: A list of SVG strings and their associated data.
        """
        logging.info("Generating intermediate drawings.")
        drawings, widths = cluster.get_spaghettis()
        svg_strings = []
        for i, drawing in enumerate(drawings):
            max_x, min_x = 0, 100000000
            max_y, min_y = 0, 100000000
            drawing.set_structure_id(f"s{i}")
            padding = 0
            drawing.options.padding = 0
            carrier_domain_pos = None
            for atom in drawing.structure.graph:
                if atom.annotations.domain_type:
                    carrier_domain_pos = atom.draw.position
                    atom.draw.positioned = False
                    sulphur_pos = atom.get_neighbour("S").draw.position
                if atom.draw.positioned:
                    min_x = min(min_x, atom.draw.position.x)
                    min_y = min(min_y, atom.draw.position.y)
                    max_x = max(max_x, atom.draw.position.x)
                    max_y = max(max_y, atom.draw.position.y)
            if not carrier_domain_pos:
                logging.error("Carrier domain position not found in drawing.")
                raise ValueError("Carrier domain position not found in drawing.")

            x1, x2 = 0, max_x + padding
            y1, y2 = padding, max_y + padding
            width, height = x2, y2
            svg_style = r" <style> line {stroke: black; stroke_width: 1px;} </style> "
            svg_header = f"""<svg width="{width}" height="{height}" viewBox="{x1} {y1} {x2} {y2}" xmlns="http://www.w3.org/2000/svg">\n {svg_style}\n"""
            squiggly_svg = f'<path d="M {sulphur_pos.x} {sulphur_pos.y - 5} Q {sulphur_pos.x - 5} {sulphur_pos.y - (sulphur_pos.y - 5 - carrier_domain_pos.y)/2}, {carrier_domain_pos.x} {sulphur_pos.y - 5 - (sulphur_pos.y - 5 - carrier_domain_pos.y)/2} T {carrier_domain_pos.x} {carrier_domain_pos.y}" stroke="grey" fill="white"/>'
            svg = (
                f"{svg_header}{drawing.draw_svg()}{squiggly_svg}".replace("\n", "")
                .replace('"', "'")
                .replace("<svg", " <svg id='intermediate_drawing'")
            )
            svg_strings.append(
                [svg, carrier_domain_pos.x, carrier_domain_pos.y, width, height]
            )

        logging.debug("Intermediate drawings generated.")
        return svg_strings


class TerpenePathway(BasePathway):
    def __init__(self, antismash_input: str):
        """Initializes the TerpenePathway with given antiSMASH input data.

        Args:
            antismash_input (str): JSON string containing antiSMASH output data.
        """
        super().__init__(antismash_input)
        self.macrocyclisations: List[MacrocyclizationRepresentation] = [
            MacrocyclizationRepresentation(*cyclization)
            for cyclization in self.cyclization
            if len(cyclization) > 0
        ]
        self.precursor: str = self.antismash_input["substrate"]
        self.double_bond_isomerase: List[IsomerizationRepresentation] = [
            IsomerizationRepresentation(isomerization)
            for isomerization in self.antismash_input.get("double_bond_isomerase", [])
            if len(isomerization) > 0
        ]
        self.methyl_mutase: List[MethylShiftRepresentation] = [
            MethylShiftRepresentation(methyl_shift)
            for methyl_shift in self.antismash_input.get("methyl_mutase", [])
            if len(methyl_shift) > 0
        ]
        self.water_quenching: List[WaterQuenchingRepresentation] = [
            WaterQuenchingRepresentation(wq)
            for wq in self.antismash_input.get("water_quenching", [])
            if len(wq) > 0
        ]
        self.cluster: TerpeneCluster = TerpeneCluster(
            self.antismash_input["gene_name_precursor"],
            self.precursor,
            cyclase_type=self.antismash_input["terpene_cyclase_type"],
            macrocyclisations=self.macrocyclisations,
            double_bond_isomerisations=self.double_bond_isomerase,
            methyl_shifts=self.methyl_mutase,
            water_quenching=self.water_quenching,
            tailoring_representations=self.tailoring_reactions,
        )
        logging.info("TerpenePathway initialized and cluster built.")
        logging.debug(
            "Gene Name Precursor: %s, Precursor: %s, Terpene Cyclase Type: %s, "
            "Macrocyclisations: %s, Double Bond Isomerase: %s, Methyl Mutase: %s, Tailoring Reactions: %s",
            self.antismash_input["gene_name_precursor"],
            self.precursor,
            self.antismash_input["terpene_cyclase_type"],
            self.macrocyclisations,
            self.double_bond_isomerase,
            self.methyl_mutase,
            self.tailoring_reactions,
        )

    async def process(self) -> Dict[str, Any]:
        """Processes the Terpene pathway and generates the necessary outputs.

        Returns:
            Dict[str, Any]: The response data containing SVGs, SMILES, mass, and other molecular information.
        """

        logging.info("Processing Terpene pathway.")

        self.cluster.create_precursor()
        precursor_svg = self.process_svg(
            self.cluster.draw_product(as_string=True, draw_Cs_in_pink=True),
            "precursor_drawing",
        )

        self.cluster.do_macrocyclization()
        cyclised_product_svg = self.process_svg(
            self.cluster.draw_product(as_string=True, draw_Cs_in_pink=True),
            "cyclized_drawing",
        )

        # Perform any post-cyclization terpene modifications that are wired in the cluster
        # Methyl shift is invoked inside macrocyclization; water quenching is separate
        if self.water_quenching:
            try:
                self.cluster.do_water_quenching()
            except Exception as e:
                logging.error({"event": "terpene.water_quenching.error", "error": str(e)})

        if self.tailoring_reactions:
            self.cluster.do_tailoring()
        self.tailored_product = self.cluster.chain_intermediate
        self.final_product = self.cluster.chain_intermediate
        svg_final_product = self.process_svg(
            self.cluster.draw_product(as_string=True, draw_Cs_in_pink=True),
            "final_drawing",
        )
        svg_tailoring = self.process_svg(svg_final_product, "intermediate_drawing")
        self._draw_pathway_mass_smiles_tailoring_sites()
        cyclase = TailoringEnzyme("gene", "OXIDATIVE_BOND_SYNTHASE")
        self.atoms_for_cyclisation = str(
            [
                str(atom[0])
                for atom in cyclase.get_possible_sites(self.cluster.chain_intermediate)
                if str(atom[0]) != "O_0"
            ]
        )
        logging.debug(
            "Returning the following data: SVG Final Product: %s, SMILES: %s, Mass: %s, Sum Formula: %s, Pathway SVG: %s, "
            "Atoms for Cyclisation: %s, Tailoring Sites: %s, Precursor SVG: %s, Cyclized Structure SVG: %s, "
            "Structure for Tailoring SVG: %s",
            svg_final_product,
            self.smiles,
            self.mass,
            self.sum_formula,
            self.pathway_svg,
            self.atoms_for_cyclisation,
            str(self.tailoring_sites),
            precursor_svg,
            cyclised_product_svg,
            svg_tailoring,
        )

        return await asyncio.sleep(
            0,
            {
                "svg": svg_final_product,
                "smiles": self.smiles,
                "mass": self.mass,
                "sum_formula": self.sum_formula,
                "pathway_svg": self.pathway_svg,
                "atomsForCyclisation": self.atoms_for_cyclisation,
                "tailoringSites": str(self.tailoring_sites),
                "precursor": precursor_svg,
                "cyclizedStructure": cyclised_product_svg,
                "structureForTailoring": svg_tailoring,
            },
        )
