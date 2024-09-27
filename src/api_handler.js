class APIService {
    constructor(port) {
        this.port = port;
    }

    async fetchFromRaichu(geneMatrixHandler) {
        let bgcHandler = this.getBGCHandler(geneMatrixHandler.cluster_type);
        let raichu_output;
        if (bgcHandler) {
            raichu_output = await bgcHandler.fetch(geneMatrixHandler);
        } else {
            this.showError("This type of BGC is not implemented yet.");
            raichu_output = { "Error": "This type of BGC is not implemented yet." };
        }
        return raichu_output;
    }

    getBGCHandler(cluster_type) {
        switch (cluster_type) {
            case 'ripp':
                return new RiPPHandler(this.port);
            case 'terpene':
                return new TerpeneHandler(this.port);
            case 'nrpspks':
                return new NRPSPKSHandler(this.port);
            default:
                return null;
        }
    }

    showError(message) {
        let module_container = document.getElementById("module_container");
        module_container.innerHTML = `<strong>${message}</strong>`;
    }
}

class BGCFetcher {
    constructor(port) {
        this.port = port;
    }

    async fetch(geneMatrixHandler) {
        // To be implemented by subclasses
    }

    updateUI(raichu_output, geneMatrix, BGC) {
        if (raichu_output.hasOwnProperty("Error")) {
            this.showError(raichu_output.Error);
            return;
        }

        svgHandler.updateStructure(raichu_output);
        svgHandler.updateDownloadLinks(raichu_output);
        this.setupSmilesButton(raichu_output.smiles);
        this.updateMolecularMass(raichu_output.mass);
        this.updateSumFormula(raichu_output.sum_formula);
    }

    showError(message) {
        let module_container = document.getElementById("module_container");
        module_container.innerHTML = `<strong>${message}</strong>`;
    }

    setupSmilesButton(smiles) {
        let smiles_button = document.getElementById("smiles_button");
        smiles_button.addEventListener("click", () => navigator.clipboard.writeText(smiles));
    }

    updateMolecularMass(mass) {
        let roundedMass = mass.toFixed(4);
        document.getElementById("molecular_mass_value").innerHTML = `${roundedMass} Da`;
    }
    
    updateSumFormula(sum_formula) {
        document.getElementById("sum_formula_value").innerHTML = `${sum_formula}`;
    }
}

class RiPPHandler extends BGCFetcher {
    async fetch(geneMatrixHandler) {
        svgHandler.setClusterType('ripp');

        let data_string = JSON.stringify({
            rippPrecursor: geneMatrixHandler.rippPrecursor,
            cyclization: geneMatrixHandler.cyclization,
            tailoring: geneMatrixHandler.tailoringArray,
            rippPrecursorName: geneMatrixHandler.rippPrecursorGene,
            rippFullPrecursor: geneMatrixHandler.rippFullPrecursor
        });

        let url = `${this.port}api/alola/ripp?antismash_input=${encodeURIComponent(data_string)}`;
        const response = await fetch(url);
        const raichu_output = await response.json();

        this.updateUI(raichu_output, geneMatrixHandler.geneMatrix, geneMatrixHandler.BGC);

        if (!raichu_output.hasOwnProperty("Error")) {
            this.processRaichuOutput(raichu_output, geneMatrixHandler);
        }
    }

    processRaichuOutput(raichu_output, geneMatrixHandler) {
        geneMatrixHandler.geneMatrix = OptionCreator.createOptionsDomains(geneMatrixHandler.geneMatrix, JSON.parse(raichu_output.atomsForCyclisation.replaceAll("'", '"')));
        geneMatrixHandler.geneMatrix = OptionCreator.createOptionsTailoringEnzymes(geneMatrixHandler.geneMatrix, raichu_output.tailoringSites);
        this.updateIntermediates(raichu_output);
    }

    updateIntermediates(raichu_output) {
        if (document.getElementById("innerIntermediateContainer_tailoredProduct")) {
            svgHandler.updateIntermediateContainer("innerIntermediateContainer_tailoredProduct", raichu_output.structureForTailoring, "intermediate_drawing_tailored");
            svgHandler.updateIntermediateContainer("innerIntermediateContainer_precursor", raichu_output.rawPeptideChain, "intermediate_drawing_precursor");
            if (document.getElementById("wildcardProtease").checked || geneMatrixHandler.proteaseOptions) {
                svgHandler.updateIntermediateContainer("innerIntermediateContainer_cleavedProduct_space", raichu_output.svg, "intermediate_drawing_cleavage", "cleavedProduct");
            }
        }
    }
}

class TerpeneHandler extends BGCFetcher {
    async fetch(geneMatrixHandler) {
        svgHandler.setClusterType('terpene');

        let data_string = JSON.stringify({
            gene_name_precursor: "terpene-cyclase",
            substrate: geneMatrixHandler.terpeneSubstrate,
            cyclization: this.splitArrayIntoPairs(geneMatrixHandler.cyclization),
            tailoring: geneMatrixHandler.tailoringArray,
            terpene_cyclase_type: "Class_1"
        });

        let url = `${this.port}api/alola/terpene?antismash_input=${encodeURIComponent(data_string)}`;
        const response = await fetch(url);
        const raichu_output = await response.json();

        this.updateUI(raichu_output, geneMatrixHandler.geneMatrix, geneMatrixHandler.BGC);

        if (!raichu_output.hasOwnProperty("Error")) {
            this.processRaichuOutput(raichu_output, geneMatrixHandler);
        }
        return raichu_output;
    }

    splitArrayIntoPairs(array) {
        const pairs = [];
        for (let i = 0; i < array.length; i += 2) {
            if (i + 1 >= array.length) {
                break;
            }
            pairs.push([array[i], array[i + 1]]);
        }
        return pairs;
    }

    processRaichuOutput(raichu_output, geneMatrixHandler) {
        let atomsForCyclisation = JSON.parse(raichu_output.atomsForCyclisation.replaceAll("'", '"'));
        let tailoringSites = JSON.parse(raichu_output.tailoringSites.replaceAll("'", '"'));
        console.log(JSON.stringify(raichu_output));
        geneMatrixHandler.terpeneCyclaseOptions = OptionCreator.createOptionsTerpeneCyclase(atomsForCyclisation, tailoringSites);
        geneMatrixHandler.geneMatrix = OptionCreator.createOptionsTailoringEnzymes(geneMatrixHandler.geneMatrix, tailoringSites);
        this.updateIntermediates(raichu_output);
    }

    updateIntermediates(raichu_output) {
        if (document.getElementById("innerIntermediateContainer_tailoredProduct")) {
            svgHandler.updateIntermediateContainer("innerIntermediateContainer_cyclizedProduct", raichu_output.cyclizedStructure, "intermediate_drawing_cyclisation_terpene", "cyclized_drawing" );
            svgHandler.updateIntermediateContainer("innerIntermediateContainer_precursor", raichu_output.precursor, "intermediate_drawing_precursor", "precursor_drawing");
            svgHandler.updateIntermediateContainer("innerIntermediateContainer_tailoredProduct", raichu_output.structureForTailoring, "intermediate_drawing_tailored");
        }
    }
}

class NRPSPKSHandler extends BGCFetcher {
    async fetch(geneMatrixHandler) {
        svgHandler.setClusterType('nrpspks');
        let [data, starterACP] = geneMatrixHandler.extractAntismashPredictionsFromRegion();

        let data_string = JSON.stringify({
            clusterRepresentation: data,
            cyclization: geneMatrixHandler.cyclization.length === 0 ? "None" : geneMatrixHandler.cyclization,
            tailoring: geneMatrixHandler.tailoringArray
        });
        let url = `${this.port}api/alola/nrps_pks?antismash_input=${encodeURIComponent(data_string)}`;
        const response = await fetch(url);
        const raichu_output = await response.json();
        this.updateUI(raichu_output, geneMatrixHandler.geneMatrix, geneMatrixHandler.BGC);

        if (!raichu_output.hasOwnProperty("Error")) {
            this.processRaichuOutput(raichu_output, geneMatrixHandler, starterACP);
        }
        return raichu_output;
    }

    processRaichuOutput(raichu_output, geneMatrixHandler, starterACP) {
        geneMatrixHandler.geneMatrix = OptionCreator.createOptionsDomains(geneMatrixHandler.geneMatrix, JSON.parse(raichu_output.atomsForCyclisation.replaceAll("'", '"')));
        geneMatrixHandler.geneMatrix = OptionCreator.createOptionsTailoringEnzymes(geneMatrixHandler.geneMatrix, JSON.parse(raichu_output.tailoringSites.replaceAll("'", '"')));
    }


}