class APIService {
    constructor(port) {
        this.port = port;
    }

    async fetchFromRaichu(geneMatrixHandler) {
        let bgcHandler = this.getBGCHandler(geneMatrixHandler.cluster_type);
        if (bgcHandler) {
            await bgcHandler.fetch(geneMatrixHandler);
        } else {
            this.showError("This type of BGC is not implemented yet.");
        }
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
}

class RiPPHandler extends BGCFetcher {
    async fetch(geneMatrixHandler) {
        svgHandler.setClusterType('ripp');

        let data_string = JSON.stringify({
            rippPrecursor: geneMatrixHandler.rippPrecursor,
            cyclization: geneMatrixHandler.cyclization,
            tailoring: geneMatrixHandler.findTailoringReactions(),
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
        OptionCreator.createOptionsDomains(geneMatrixHandler.geneMatrix, JSON.parse(raichu_output.atomsForCyclisation.replaceAll("'", '"')));
        OptionCreator.createOptionsTailoringEnzymes(geneMatrixHandler.geneMatrix, raichu_output.tailoringSites);
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
            tailoring: geneMatrixHandler.findTailoringReactions(),
            terpene_cyclase_type: "Class_1"
        });

        let url = `${this.port}api/alola/terpene?antismash_input=${encodeURIComponent(data_string)}`;
        const response = await fetch(url);
        const raichu_output = await response.json();

        this.updateUI(raichu_output, geneMatrixHandler.geneMatrix, geneMatrixHandler.BGC);

        if (!raichu_output.hasOwnProperty("Error")) {
            this.processRaichuOutput(raichu_output, geneMatrixHandler);
        }
    }

    splitArrayIntoPairs(arr) {
        return arr.reduce((result, value, index, array) => {
            if (index % 2 === 0) result.push(array.slice(index, index + 2));
            return result;
        }, []);
    }

    processRaichuOutput(raichu_output, geneMatrixHandler) {
        let atomsForCyclisation = JSON.parse(raichu_output.atomsForCyclisation.replaceAll("'", '"'));
        let tailoringSites = JSON.parse(raichu_output.tailoringSites.replaceAll("'", '"'));
        geneMatrixHandler.terpeneCyclaseOptions = OptionCreator.createOptionsTerpeneCyclase(atomsForCyclisation, tailoringSites);
        OptionCreator.createOptionsTailoringEnzymes(geneMatrixHandler.geneMatrix, tailoringSites);
        this.updateIntermediates(raichu_output);
    }

    updateIntermediates(raichu_output) {
        if (document.getElementById("innerIntermediateContainer_tailoredProduct")) {
            svgHandler.updateIntermediateContainer("innerIntermediateContainer_cyclizedProduct", raichu_output.cyclizedStructure, "intermediate_drawing_cyclisation_terpene");
            svgHandler.updateIntermediateContainer("innerIntermediateContainer_precursor", raichu_output.precursor, "intermediate_drawing_precursor");
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
            tailoring: geneMatrixHandler.findTailoringReactions()
        });
        let url = `${this.port}api/alola/nrps_pks?antismash_input=${encodeURIComponent(data_string)}`;
        const response = await fetch(url);
        const raichu_output = await response.json();
        console.log(raichu_output)

        this.updateUI(raichu_output, geneMatrixHandler.geneMatrix, geneMatrixHandler.BGC);

        if (!raichu_output.hasOwnProperty("Error")) {
            this.processRaichuOutput(raichu_output, geneMatrixHandler, starterACP);
        }
    }

    processRaichuOutput(raichu_output, geneMatrixHandler, starterACP) {
        OptionCreator.createOptionsDomains(geneMatrixHandler.geneMatrix, JSON.parse(raichu_output.atomsForCyclisation.replaceAll("'", '"')));
        OptionCreator.createOptionsTailoringEnzymes(geneMatrixHandler.geneMatrix, JSON.parse(raichu_output.tailoringSites.replaceAll("'", '"')));
        this.updateIntermediates(raichu_output, geneMatrixHandler, starterACP);
    }

    updateIntermediates(raichu_output, geneMatrixHandler, starterACP) {
        let acpList = geneMatrixHandler.getACPList();
        let intermediates = raichu_output.hangingSvg;
        let max_width = Math.max(...intermediates.map(element => element[3]));

        for (let intermediateIndex = 0; intermediateIndex < intermediates.length; intermediateIndex++) {
            let [intermediate, carrier_x, , , height] = intermediates[intermediateIndex];
            let acp = acpList[intermediateIndex + Math.max(starterACP, 1) - 1];
            svgHandler.updateNRPSPKSIntermediateContainer(acp, intermediate, intermediateIndex, carrier_x, max_width, height);
        }

        if (document.getElementById("innerIntermediateContainer_tailoring_enzymes")) {
            svgHandler.updateTailoringStructure(raichu_output.structureForTailoring);
        }
    }
}