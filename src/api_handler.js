class APIService {
    constructor(port) {
        this.port = port;
    }

    async fetchFromRaichu(geneMatrixHandler) {
        console.log(geneMatrixHandler.cluster_type);
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

    // Fetch data from API using the user_id for antismash loaded data
    async fetchDataForUser(user_id) {
        if (!user_id) {
            console.error("User ID is required to fetch data.");
            return;
        }

        console.log("Fetching for user ID", user_id)
        const maxRetries = 5; // Max number of retries
        const retryDelay = 2000; // Delay between retries in milliseconds (2 seconds)
        let attempt = 0;
        const timeout = 30000; // Timeout duration (30 seconds)

        const tryFetch = async () => {
            while (attempt < maxRetries) {
                try {
                    const response = await fetch(`${this.port}api/antismash/fetch_data?user_id=${user_id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log("Data fetched from API:", data);

                        // Process the data if needed
                        if (data) {
                            return data
                        }
                        return; // Exit on success
                    } else {
                        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
                    }
                } catch (error) {
                    console.error(`Attempt ${attempt + 1} failed:`, error);
                    attempt++;

                    // If time exceeds the timeout, stop retrying
                    if (Date.now() - startTime > timeout) {
                        console.error("Timed out while fetching data.");
                        break;
                    }

                    // Wait for a delay before retrying
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                }
            }

            console.error("Max retries reached. Could not fetch data.");
        };

        const startTime = Date.now();
        await tryFetch();
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
        if (raichu_output.sum_formula.includes("*")){
            this.updateEstimateMolecularMass(raichu_output.mass);
            this.updateEstimateSumFormula(raichu_output.sum_formula);
        }
        else {
            this.updateMolecularMass(raichu_output.mass);
            this.updateSumFormula(raichu_output.sum_formula);
        }

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

    updateEstimateSumFormula(sum_formula){
        document.getElementById("sum_formula_value").innerHTML = `${sum_formula.replaceAll("*","")} + R`;
    }

    updateEstimateMolecularMass(mass){
        let roundedMass = mass.toFixed(4);
        document.getElementById("molecular_mass_value").innerHTML = `>${roundedMass} Da`;

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
        return raichu_output;
    }

    processRaichuOutput(raichu_output, geneMatrixHandler) {
        geneMatrixHandler.geneMatrix = OptionCreator.createOptionsDomains(geneMatrixHandler.geneMatrix, JSON.parse(raichu_output.atomsForCyclisation.replaceAll("'", '"')));
        geneMatrixHandler.geneMatrix = OptionCreator.createOptionsTailoringEnzymes(geneMatrixHandler.geneMatrix, raichu_output.tailoringSites);
    }


}

class TerpeneHandler extends BGCFetcher {
    async fetch(geneMatrixHandler) {
        svgHandler.setClusterType('terpene');

        let data_string = JSON.stringify({
            gene_name_precursor: "terpene-cyclase",
            substrate: geneMatrixHandler.terpeneSubstrate,
            cyclization: this.splitArrayIntoPairs(geneMatrixHandler.cyclization),
            double_bond_isomerase: geneMatrixHandler.terpeneDoubleBondIsomerization,
            methyl_mutase: geneMatrixHandler.terpeneMethylShift,
            water_quenching: geneMatrixHandler.terpeneWaterQuenching,
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
            svgHandler.updateIntermediateContainer("innerIntermediateContainer_precursor", raichu_output.precursor, "intermediate_drawing_precursor_terpene", "precursor_drawing");
            svgHandler.updateIntermediateContainer("innerIntermediateContainer_tailoredProduct", raichu_output.structureForTailoring, "intermediate_drawing_tailoring_terpene");
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
