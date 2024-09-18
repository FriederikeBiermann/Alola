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
            case 'RiPP':
                return new RiPPHandler(this.port);
            case 'terpene':
                return new TerpeneHandler(this.port);
            case 'NRPSPKS':
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

        this.updateStructure(raichu_output);
        this.updateDownloadLinks(raichu_output);
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

    updateStructure(raichu_output) {
        let container = document.getElementById("structure_container");
        container.innerHTML = formatSVG(raichu_output.svg);
        let drawing = document.getElementById("final_drawing");
        drawing.style["max-width"] = "100%";
        drawing.style["max-height"] = "100%";
    }

    updateDownloadLinks(raichu_output) {
        this.setDownloadLink("save_complete_cluster_svg", raichu_output.completeClusterSvg, raichu_output.smiles + "_cluster.svg");
        this.setDownloadLink("save_enzymatic_pathway_svg", raichu_output.pathway_svg, raichu_output.smiles + "_pathway.svg");
        this.setDownloadLink("save_svg", raichu_output.svg, raichu_output.smiles + ".svg");
    }

    setDownloadLink(elementId, svgContent, filename) {
        let element = document.getElementById(elementId);
        let url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgContent);
        element.href = url;
        element.setAttribute("download", filename);
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
            this.updateIntermediateContainer("innerIntermediateContainer_tailoredProduct", raichu_output.structureForTailoring, "intermediate_drawing_tailored");
            this.updateIntermediateContainer("innerIntermediateContainer_precursor", raichu_output.rawPeptideChain, "intermediate_drawing_precursor");
            if (document.getElementById("wildcardProtease").checked || proteaseOptions) {
                this.updateIntermediateContainer("innerIntermediateContainer_cleavedProduct_space", raichu_output.svg, "intermediate_drawing_cleavage", "cleavedProduct");
            }
        }
    }

    updateIntermediateContainer(containerId, svgContent, svgId, replacementId = null) {
        let container = document.getElementById(containerId);
        container.setAttribute("style", "width:25vw");
        container.innerHTML = formatSVG_intermediates(svgContent).replaceAll("final_drawing", replacementId || "intermediate_drawing");
        let svg = document.getElementById(replacementId || "intermediate_drawing");
        this.reformatSVG(svg);
        svg.setAttribute('id', svgId);
        svg.setAttribute('class', svgId);
        if (svgId === "intermediate_drawing_tailored") {
            addDropShadowFilterToSVG(svg);
        }
    }

    reformatSVG(svg) {
        let bbox = svg.getBBox();
        let viewBox = [bbox.x, bbox.y, bbox.width, bbox.height].join(" ");
        svg.setAttribute("viewBox", viewBox);
    }
}

class TerpeneHandler extends BGCHandler {
    async fetch(details_data, regionName, geneMatrix, BGC) {
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
            this.updateIntermediateContainer("innerIntermediateContainer_cyclizedProduct", raichu_output.cyclizedStructure, "intermediate_drawing_cyclisation_terpene");
            this.updateIntermediateContainer("innerIntermediateContainer_precursor", raichu_output.precursor, "intermediate_drawing_precursor");
            this.updateIntermediateContainer("innerIntermediateContainer_tailoredProduct", raichu_output.structureForTailoring, "intermediate_drawing_tailored");
        }
    }

    updateIntermediateContainer(containerId, svgContent, svgId) {
        let container = document.getElementById(containerId);
        container.setAttribute("style", "width:15vw");
        container.innerHTML = formatSVG_intermediates(svgContent);
        let svg = document.getElementById(svgId.includes("precursor") ? "precursor_drawing" : "intermediate_drawing");
        this.reformatSVG(svg);
        svg.setAttribute('id', svgId);
        svg.setAttribute('class', svgId);
        if (svgId === "intermediate_drawing_tailored") {
            addDropShadowFilterToSVG(svg);
        }
    }

    reformatSVG(svg) {
        let bbox = svg.getBBox();
        let viewBox = [bbox.x, bbox.y, bbox.width, bbox.height].join(" ");
        svg.setAttribute("viewBox", viewBox);
    }
}

class NRPSPKSHandler extends BGCHandler {
    async fetch(details_data, regionName, geneMatrix, BGC) {
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
            this.updateIntermediateContainer(acp, intermediate, intermediateIndex, carrier_x, max_width, height);
        }

        if (document.getElementById("innerIntermediateContainer_tailoring_enzymes")) {
            this.updateTailoringStructure(raichu_output.structureForTailoring);
        }
    }

    updateIntermediateContainer(acp, intermediate, index, carrier_x, max_width, height) {
        let container = document.getElementById(`innerIntermediateContainer${acp.replace(".", "_")}`);
        container.setAttribute("style", "width:5vw;");
        container.innerHTML = formatSVG_intermediates(intermediate);
        let svg = document.getElementById("intermediate_drawing");
        let bbox = svg.getBBox();
        let viewBox = [bbox.x, bbox.y, max_width, height].join(" ");
        svg.setAttribute("viewBox", viewBox);
        svg.setAttribute("width", max_width);
        svg.setAttribute('id', `intermediate_drawing${index}`);
        svg.setAttribute('class', "intermediate_drawing");

        let rightPosition = 0.05 * viewPortWidth <= max_width
            ? (((carrier_x - bbox.x) / max_width) * 5 - 700 / viewPortHeight)
            : (carrier_x - bbox.x - 13000 / viewPortHeight);
        svg.setAttribute('style', `right: ${rightPosition}${0.05 * viewPortWidth <= max_width ? 'vw' : 'px'};`);
    }

    updateTailoringStructure(structureForTailoring) {
        let container = document.getElementById("innerIntermediateContainer_tailoring_enzymes");
        container.setAttribute("style", "width:150px");
        container.innerHTML = formatSVG_intermediates(structureForTailoring);
        let svg = document.getElementById("tailoring_drawing");
        this.reformatSVG(svg, "intermediate_drawing_tailoring", "intermediate_drawing_tailoring");
        addDropShadowFilterToSVG(svg);
    }

    reformatSVG(svg, id, className) {
        let bbox = svg.getBBox();
        let viewBox = [bbox.x, bbox.y, bbox.width, bbox.height].join(" ");
        svg.setAttribute("viewBox", viewBox);
        svg.setAttribute('id', id);
        svg.setAttribute('class', className);
    }
}
 
