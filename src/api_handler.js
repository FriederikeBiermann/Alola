
class APIService {
    constructor(port) {
        this.port = port;
    }

    async fetchFromRaichu(details_data, regionName, geneMatrix, cluster_type, BGC) {
        historyStack.push(JSON.parse(JSON.stringify({ geneMatrix, BGC })));

        let bgcHandler = this.getBGCHandler(cluster_type);
        if (bgcHandler) {
            await bgcHandler.fetch(details_data, regionName, geneMatrix, BGC);
        } else {
            this.showError("This type of BGC is not implemented yet.");
        }

        this.updateButtonStates();
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

    updateButtonStates() {
        // Implementation of updateButtonStates
    }
}

class BGCHandler {
    constructor(port) {
        this.port = port;
    }

    async fetch(details_data, regionName, geneMatrix, BGC) {
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

        updateProteins(geneMatrix, BGC);
        addDragDrop();
        addArrowClick(geneMatrix);
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
        molecularMass(mass);
    }
}

class RiPPHandler extends BGCHandler {
    async fetch(details_data, regionName, geneMatrix, BGC) {
        svgHandler.setClusterType('ripp');
        updateRiPPs(geneMatrix, BGC);

        let data_string = JSON.stringify({
            rippPrecursor: rippPrecursor,
            cyclization: cyclization,
            tailoring: findTailoringReactions(geneMatrix),
            rippPrecursorName: rippPrecursorGene,
            rippFullPrecursor: rippFullPrecursor
        });

        let url = `${this.port}api/alola/ripp?antismash_input=${encodeURIComponent(data_string)}`;
        const response = await fetch(url);
        const raichu_output = await response.json();

        this.updateUI(raichu_output, geneMatrix, BGC);

        if (!raichu_output.hasOwnProperty("Error")) {
            this.processRaichuOutput(raichu_output, geneMatrix);
        }
    }

    processRaichuOutput(raichu_output, geneMatrix) {
        OptionCreator.createOptionsDomains(geneMatrix, JSON.parse(raichu_output.atomsForCyclisation.replaceAll("'", '"')));
        OptionCreator.createOptionsTailoringEnzymes(geneMatrix, raichu_output.tailoringSites);
        this.updateIntermediates(raichu_output);
    }

    updateIntermediates(raichu_output) {
        if (document.getElementById("innerIntermediateContainer_tailoredProduct")) {
            svgHandler.updateIntermediateContainer("innerIntermediateContainer_tailoredProduct", raichu_output.structureForTailoring, "intermediate_drawing_tailored");
            svgHandler.updateIntermediateContainer("innerIntermediateContainer_precursor", raichu_output.rawPeptideChain, "intermediate_drawing_precursor");
            if (document.getElementById("wildcardProtease").checked || proteaseOptions) {
                svgHandler.updateIntermediateContainer("innerIntermediateContainer_cleavedProduct_space", raichu_output.svg, "intermediate_drawing_cleavage", "cleavedProduct");
            }
        }
    }
}

class TerpeneHandler extends BGCHandler {
    async fetch(details_data, regionName, geneMatrix, BGC) {
        svgHandler.setClusterType('terpene');
        updateTerpenes(geneMatrix, BGC);

        let data_string = JSON.stringify({
            gene_name_precursor: "terpene-cyclase",
            substrate: terpeneSubstrate,
            cyclization: splitArrayIntoPairs(cyclization),
            tailoring: findTailoringReactions(geneMatrix),
            terpene_cyclase_type: "Class_1"
        });

        let url = `${this.port}api/alola/terpene?antismash_input=${encodeURIComponent(data_string)}`;
        const response = await fetch(url);
        const raichu_output = await response.json();

        this.updateUI(raichu_output, geneMatrix, BGC);

        if (!raichu_output.hasOwnProperty("Error")) {
            this.processRaichuOutput(raichu_output, geneMatrix);
        }
    }

    processRaichuOutput(raichu_output, geneMatrix) {
        let atomsForCyclisation = JSON.parse(raichu_output.atomsForCyclisation.replaceAll("'", '"'));
        let tailoringSites = JSON.parse(raichu_output.tailoringSites.replaceAll("'", '"'));
        terpeneCyclaseOptions = OptionCreator.createOptionsTerpeneCyclase(atomsForCyclisation, tailoringSites);
        OptionCreator.createOptionsTailoringEnzymes(geneMatrix, tailoringSites);
        updateTerpenes(geneMatrix, BGC);
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

class NRPSPKSHandler extends BGCHandler {
    async fetch(details_data, regionName, geneMatrix, BGC) {
        svgHandler.setClusterType('nrpspks');
        let extracted_results = extractAntismashPredictionsFromRegion(details_data, regionName, geneMatrix);
        let data = extracted_results[0];
        let starterACP = extracted_results[1];

        let tailoringArray = findTailoringReactions(geneMatrix);
        let data_string = JSON.stringify({
            clusterRepresentation: data,
            cyclization: cyclization,
            tailoring: tailoringArray
        });

        let url = `${this.port}api/alola/nrps_pks?antismash_input=${encodeURIComponent(data_string)}`;
        const response = await fetch(url);
        const raichu_output = await response.json();

        this.updateUI(raichu_output, geneMatrix, BGC);

        if (!raichu_output.hasOwnProperty("Error")) {
            this.processRaichuOutput(raichu_output, geneMatrix, BGC, starterACP);
        }
    }

    processRaichuOutput(raichu_output, geneMatrix, BGC, starterACP) {
        OptionCreator.createOptionsDomains(geneMatrix, JSON.parse(raichu_output.atomsForCyclisation.replaceAll("'", '"')));
        OptionCreator.createOptionsTailoringEnzymes(geneMatrix, JSON.parse(raichu_output.tailoringSites.replaceAll("'", '"')));
        updateDomains(geneMatrix, BGC);
        this.updateIntermediates(raichu_output, geneMatrix, starterACP);
    }

    updateIntermediates(raichu_output, geneMatrix, starterACP) {
        let acpList = getACPList(geneMatrix);
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
