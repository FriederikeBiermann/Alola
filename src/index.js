const CONFIG = {
    PORT: "http://127.0.0.1:8000/",
    VIEW_PORT_HEIGHT: window.innerHeight,
    VIEW_PORT_WIDTH: window.innerWidth
};

const TAILORING_ENZYMES = {
    "THIOPEPTIDE_CYCLASE": "T_CYL",
    "MACROLACTAM_SYNTHETASE": "M_SY",
    "ATP-GRASP": "ATP-G",
    "YCAO": "YcaO",
    "LANTHIBIOTIC_DEHYDRATASE": "L-DH",
    "DOUBLE_BOND_ISOMERASE": "DB-I",
    "RADICAL_SAM": "rSAM",
    "SPLICEASE": "SPL",
    "ARGINASE": "ARG",
    "AGMATINASE": "AGM",
    "OXIDOREDUCTASE": "OXRE",
    "METHYLTRANSFERASE": "MT",
    "C_METHYLTRANSFERASE": "C-MT",
    "N_METHYLTRANSFERASE": "N-MT",
    "O_METHYLTRANSFERASE": "O-MT",
    "P450": "P450",
    "ISOMERASE": "ISO",
    "PRENYLTRANSFERASE": "Pren-T",
    "ACETYLTRANSFERASE": "Acet-T",
    "ACYLTRANSFERASE": "Acyl-T",
    "AMINOTRANSFERASE": "AMT",
    "OXIDASE": "OX",
    "REDUCTASE": "RED",
    "ALCOHOL_DEHYDROGENASE": "AL-DH",
    "DEHYDRATASE": "DH",
    "DECARBOXYLASE": "DC",
    "MONOAMINE_OXIDASE": "MAO",
    "REDUCTIVE_LYASE": "RL",
    "METHYL_MUTASE": "MUT",
    "HALOGENASE": "HAL",
    "HYDROLASE": "HYD",
    "PEPTIDASE": "PEP",
    "PROTEASE": "PROT"
};

const TAILORING_ENZYMES_SYNONYMS = {
    "ARGINASE": ["arginase"],
    "AGMATINASE": ["agmatinase"],
    "RADICAL_SAM": ["rSAM", "Radical_SAM", "radical_SAM", "R_SAM"],
    "YCAO": ["ycao", "Ycao", "YcaO"],
    "LANTHIBIOTIC_DEHYDRATASE": ["lanthibiotic dehydratase", "serine/threoninedehydratase", "serine dehydratase", "threonine dehydratase"],
    "ATP-GRASP": ["ATP-grasp", "atp-grasp", "atp grasp", "ATP grasp"],
    "MACROLACTAM_SYNTHETASE": ["ATP dependent macrolactam synthetase"]
};

const TAILORING_ENZYMES_WITH_TWO_ATOMS = [
    "OXIDATIVE_BOND_SYNTHASE",
    "SPLICEASE",
    "LANTHIPEPTIDE_CYCLASE",
    "LANTHIONINE_SYNTHETASE",
    "OXIDATIVE_BOND_SYNTHASE"
];

const TAILORING_ENZYMES_WITH_SUBSTRATE = [
    "HALOGENASE",
    "PRENYLTRANSFERASE",
    "ACYLTRANSFERASE"
];

const TERPENE_SUBSTRATES = [
    "DIMETHYLALLYL_PYROPHOSPHATE",
    "GERANYL_PYROPHOSPHATE",
    "FARNESYL_PYROPHOSPHATE",
    "GERANYLGERANYL_PYROPHOSPHATE",
    "SQUALENE",
    "PHYTOENE"
];

const PKS_STARTER_SUBSTRATES = [
    "propionyl_coa", "acetyl_coa", "benzoyl_coa", "methyl_butyryl_coa_3",
    "methyl_butyryl_coa_2", "trans_cyclopentane_dicarboxyl_coa",
    "cyclohexane_carboxyl_coa", "hydroxy_malonyl_coa_2",
    "hydroxy_malonyl_coa_2r", "hydroxy_malonyl_coa_2s",
    "chloroethyl_malonyl_coa", "isobutyryl_coa", "glycine",
    "hydroxy_propenoyl_coa_3_23e", "hydroxy_buteno yl_coa_3_23e",
    "dihydroxy_butanolyl_coa_2r3", "trihydroxy_propanolyl_coa_233",
    "o_methylacetyl_coa", "hydroxy_propenoyl_coa_3_23z", "oxomalonyl_coa_2",
    "methyl_hydroxy_propenoyl_coa_2_3_23z", "dihydroxy_butanolyl_coa_23",
    "dihydroxy_butanolyl_coa_2s3s", "heptatrienoyl_coa",
    "hydroxypropionyl_coa_2r", "dihydroxy_propanolyl_coa_33",
    "lactyl_coa", "phenylacetyl_coa", "methoxyformyl_coa"
];

const BIOSYNTHETIC_CORE_ENZYMES = [
    "alpha/beta fold hydrolase",
    "acyl carrier protein",
    "phosphopantetheine-binding protein",
    "sdr family oxidoreductase",
    "type i polyketide synthase",
    "type ii polyketide synthase",
    "type iii polyketide synthase",
    "polyketide synthase",
    "thioesterase domain-containing protein",
    "non-ribosomal peptide synthetase",
    "non-ribosomal peptide synthetase"
];

const TYPE_COLORS = {
    "biosynthetic-additional": "grey",
    "biosynthetic": "white",
    "other": "#2B2B2B",
    "regulatory": "#025699",
    "transport": "#025699"
};

const AMINO_ACIDS = {
    "ala": "alanine",
    "arg": "arginine",
    "asn": "asparagine",
    "asp": "aspartic acid",
    "cys": "cysteine",
    "gln": "glutamine",
    "glu": "glutamic acid",
    "gly": "glycine",
    "his": "histidine",
    "ile": "isoleucine",
    "leu": "leucine",
    "lys": "lysine",
    "met": "methionine",
    "phe": "phenylalanine",
    "pro": "proline",
    "ser": "serine",
    "thr": "threonine",
    "trp": "tryptophan",
    "tyr": "tyrosine",
    "val": "valine",
    "3-me-glu": "4-methylglutamicacid",
    "4ppro": "**Unknown**",
    "aad": "2-aminoadipicacid",
    'abu': "2-aminobutyricacid",
    'aeo': "2-amino-9,10-epoxy-8-oxodecanoidacid",
    'ala-b': "beta-alanine",
    'ala-d': "d-alanine",
    'allo-thr': "allo-threonine",
    'b-ala': "beta-alanine",
    'beta-ala': "beta-alanine",
    'bmt': "4-butenyl-4-methylthreonine",
    'cap': "capreomycidine",
    'bht': "**Unknown**",
    'dab': "2,4-diaminobutyricacid",
    'dhb': "2,3-dihydroxybenzoicacid",
    'dhpg': "3,5-dihydroxyphenylglycine",
    'dht': "dehydrobutyrine",
    'dpg': "3,5-dihydroxyphenylglycine",
    'hiv': "2-hydroxyisovalerate",
    'hiv-d': "d-2-hydroxyisovalerate",
    'hmp-d': "**Unknown**",
    'horn': "**Unknown**",
    'hpg': "4-hydroxyphenylglycine",
    'hyv': "4-hydroxyvaline",
    'hyv-d': "**Unknown**",
    'iva': "isovaline",
    'lys-b': "beta-lysine",
    'orn': "ornithine",
    'oh-orn': "N5-hydroxyornithine",
    'phg': "phenylglycine",
    'pip': "pipecolic acid",
    'sal': "salicylic acid",
    'tcl': "**Unknown**",
    'vol': "valinol",
    'ldap': "**Unknown**",
    'meval': "tert-leu",
    'alle': "allo-isoleucine",
    'alaninol': "alaninol",
    'n-(1,1-dimethyl-1-allyl)trp': "**Unknown**",
    'd-lyserg': "d-lysergicacid",
    'ser-thr': "**Unknown**",
    'mephe': "**Unknown**",
    'haorn': "**Unknown**",
    'hasn': "**Unknown**",
    'hforn': "**Unknown**",
    's-nmethoxy-trp': "**Unknown**",
    'alpha-hydroxy-isocaproic-acid': "**Unknown**",
    'mehoval': "**Unknown**",
    '2-oxo-isovaleric-acid': "alpha-ketoisovalericacid",
    'aoda': "**Unknown**",
    'x': "**Unknown**",
    'foh-orn': "N5-formyl-N5-hydroxyornithine"
};

const NAME_TO_STRUCTURE = {
    "methylmalonyl_coa": "CC(C(O)=O)C(S)=O",
    "malonyl_coa": "OC(=O)CC(S)=O",
    'methoxymalonyl_acp': "SC(=O)C(C(=O)O)OC)O",
    'ethylmalonyl_coa': "CC(CC(O)=O)C(S)=O",
}; 

class Record {
    constructor() {
        this.geneMatrixHandler = null;
        this.clusterTypeHandler = new ClusterTypeHandler();
        this.historyStack = new HistoryStack();


        this.regionIndex = 0;
        this.recordIndex = 0;
        this.reversed = false;
        this.regionName = "";
        this.BGC = {};
        

        this.historyStack = [];
        this.wildcardModule = "";
        this.wildcardSubstrate = "";
        this.wildcardEnzyme = "";
        this.recordData = null;
        this.details_data = null;
        
    }

    init(recordData, details_data) {
        this.recordData = recordData;
        this.details_data = details_data;
        this.reload_site_with_genecluster();
    }

    updateHistory() {
        this.historyStack.push({
            geneMatrix: this.geneMatrixHandler.geneMatrix,
            BGC: this.geneMatrixHandler.BGC
        });
        this.historyStack.updateButtonStates();
    }

    undo() {
        const previousState = this.historyStack.undo();
        if (previousState) {
            this.geneMatrixHandler.geneMatrix = previousState.geneMatrix;
            this.BGC = previousState.BGC;
            uiHandler.updateUI(this.geneMatrixHandler.geneMatrix, this.geneMatrixHandler.cluster_type, this.BGC, this.recordData, this.geneMatrixHandler.moduleMatrix, this.regionName);
            apiService.fetchFromRaichu(this.geneMatrixHandler);
            uiHandler.updateUI(this.geneMatrixHandler.geneMatrix, this.geneMatrixHandler.cluster_type, this.BGC, this.recordData, this.geneMatrixHandler.moduleMatrix, this.regionName);
        }
        this.historyStack.updateButtonStates();
    }

    redo() {
        const nextState = this.historyStack.redo();
        if (nextState) {
            this.geneMatrixHandler.geneMatrix = nextState.geneMatrix;
            this.BGC = nextState.BGC;
            uiHandler.updateUI(this.geneMatrixHandler.geneMatrix, this.geneMatrixHandler.cluster_type, this.BGC, this.recordData, this.geneMatrixHandler.moduleMatrix, this.regionName);
            apiService.fetchFromRaichu(this.geneMatrixHandler);
            uiHandler.updateUI(this.geneMatrixHandler.geneMatrix, this.geneMatrixHandler.cluster_type, this.BGC, this.recordData, this.geneMatrixHandler.moduleMatrix, this.regionName);
        }
        this.historyStack.updateButtonStates();
    }

    reload_site_with_genecluster() {
        uiHandler.createButtonsForEachRegion(this.recordData);
        [this.regionIndex, this.recordIndex] = regionHandler.getFirstRegion(this.recordData);
        this.runAlola();
    }

    runAlola() {
        this.BGC = {};
        this.reversed = false;
        this.rippPrecursor = "";
        this.cyclization = "None";
        this.regionName = regionHandler.getRegionName(this.regionIndex, this.recordIndex, this.recordData);
        let cluster_type = this.clusterTypeHandler.getClusterType(this.regionIndex, this.recordData);
       
        

        this.BGC = regionHandler.getBGC(this.recordIndex, this.regionIndex, this.recordData, this.details_data);
        this.geneMatrixHandler = new GeneMatrixHandler(this.BGC, this.details_data, this.regionName, cluster_type, this.regionIndex);
        this.geneMatrixHandler.extractAntismashPredictionsFromRegion();
        console.log(this.geneMatrixHandler.moduleMatrix)

        uiHandler.updateUI(this.geneMatrixHandler.geneMatrix, this.geneMatrixHandler.cluster_type, this.BGC, this.recordData, this.geneMatrixHandler.moduleMatrix, this.regionName, this.regionName);
        uiHandler.addRiPPPrecursorOptions(this.geneMatrixHandler.geneMatrix);

        if (this.geneMatrixHandler.cluster_type === "terpene") {
            uiHandler.openFormTerpene();
        }

        apiService.fetchFromRaichu(this.geneMatrixHandler);
        uiHandler.updateUI(this.geneMatrixHandler.geneMatrix, this.geneMatrixHandler.cluster_type, this.BGC, this.recordData, this.geneMatrixHandler.moduleMatrix, this.regionName, this.regionName);
        this.updateHistory()

    }

    reverseBGC() {
        if (this.reversed) {
            this.runAlola();
        } else {
            this.reversed = true;
            this.BGC = regionHandler.getReversedBGC(this.regionIndex, this.recordIndex, this.details_data, this.recordData);
            this.geneMatrixHandler.extractAntismashPredictionsFromRegion();
            uiHandler.updateUI(this.geneMatrixHandler.geneMatrix, this.geneMatrixHandler.cluster_type, this.BGC, this.recordData, this.geneMatrixHandler.moduleMatrix, this.regionName);
            apiService.fetchFromRaichu(this.geneMatrixHandler);
            uiHandler.updateUI(this.geneMatrixHandler.geneMatrix, this.geneMatrixHandler.cluster_type, this.BGC, this.recordData, this.geneMatrixHandler.moduleMatrix, this.regionName);

        }
    }


    addRiPP(rippSelection) {
        this.geneMatrixHandler.cluster_type = "ripp";
        this.terpeneCyclaseOptions = [];
        this.cyclization = [];
        this.geneMatrixHandler.geneMatrix[this.rippPrecursorGene].ripp_status = true;

        let translation = this.geneMatrixHandler.getTranslation(this.BGC, this.rippPrecursorGene);
        this.terpeneCyclaseOptions = this.geneMatrixHandler.generateRiPPOptions(translation);

        this.rippFullPrecursor = translation;
        this.rippPrecursor = rippSelection.length > 0 ? rippSelection : translation.slice(-5);

        apiService.fetchFromRaichu(this.geneMatrixHandler);
        uiHandler.updateUI(this.geneMatrixHandler.geneMatrix, this.geneMatrixHandler.cluster_type, this.BGC, this.recordData, this.geneMatrixHandler.moduleMatrix, this.regionName);

    }

    addTerpene(substrate) {
        this.geneMatrixHandler.cluster_type = "terpene";
        this.terpeneSubstrate = substrate;
        this.cyclization = [];
    }

    setRiPPPrecursor(geneIndex) {
        this.rippPrecursorGene = geneIndex;
        let translation = this.geneMatrixHandler.getTranslation(this.BGC, geneIndex);
        uiHandler.updateRiPPPrecursorTextarea(translation);
    }

    changeRegion(direction) {
        this.regionIndex += direction;
        this.runAlola();
    }

    changeRegionTo(regionName) {
        console.log(this.recordData)
        [this.regionIndex, this.recordIndex] = regionHandler.selectRegion(this.recordData, regionName);
        this.runAlola();
    }

    setWildcardSubstrate(substrate) {
        this.wildcardSubstrate = substrate;
        uiHandler.setColorOfDropDown(substrate);
    }

    setWildcardTailoring(enzyme) {
        this.wildcardEnzyme = enzyme;
        uiHandler.setColorOfDropDown(enzyme);
    }

    setWildcardModule(moduleType) {
        this.wildcardModule = moduleType;
    }

    setKoStatus(geneIndex, domainIndex) {
        this.geneMatrixHandler.toggleKoStatus(geneIndex, domainIndex);
        this.geneMatrixHandler.removeTailoringEnzymes();
        if (uiHandler.isRealTimeCalculationEnabled()) {
            apiService.fetchFromRaichu(this.geneMatrixHandler);
            uiHandler.updateUI(this.geneMatrixHandler.geneMatrix, this.geneMatrixHandler.cluster_type, this.BGC, this.recordData, this.geneMatrixHandler.moduleMatrix, this.regionName);
        }
    }

    setDisplayedStatus(id) {
        this.geneMatrixHandler.toggleDisplayedStatus(id);
    }

    updateHistory() {
        this.historyStack.push({
            geneMatrix: JSON.parse(JSON.stringify(this.geneMatrixHandler.geneMatrix)),
            BGC: JSON.parse(JSON.stringify(this.BGC))
        });
    }

    undo() {
        if (this.historyStack.length > 1) {
            this.historyStack.pop(); // Remove current state
            const previousState = this.historyStack[this.historyStack.length - 1];
            this.geneMatrixHandler.geneMatrix = previousState.geneMatrix;
            this.BGC = previousState.BGC;
            apiService.fetchFromRaichu(this.geneMatrixHandler);
            uiHandler.updateUI(this.geneMatrixHandler.geneMatrix, this.geneMatrixHandler.cluster_type, this.BGC, this.recordData, this.geneMatrixHandler.moduleMatrix, this.regionName);
            
        }
    }

    create_empty_BGC() {
        this.regionIndex = 0
        let recordData = [
            {
                "length": 6283062,
                "seq_id": "Custom_BGC",
                "regions": [
                    {
                        "start": 0,
                        "end": 1,
                        "idx": 1,
                        "type": "NRPS",
                        "anchor": "r1c1",
                        "orfs": []
                    }]
            }]
        let details_data = { "nrpspks": { "r1c1": { "id": "r1c1", "orfs": [] } } }
        this.init(recordData, details_data)
}}

class ApplicationManager {
    constructor() {
        this.record = new Record();
        this.fileHandler = new FileHandler(this.record);
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('uploadButton').addEventListener('click', () => this.fileHandler.triggerFileInput());
        document.getElementById('fileInput').addEventListener('change', (event) => this.handleFileSelection(event));
        document.getElementById('load_example_button').addEventListener('click', () => this.fileHandler.loadExampleFile());
        this.fileHandler.setupDropArea();
        
        // Add more event listeners as needed
    }


    handleFileSelection(event) {
        const file = event.target.files[0];
        if (file) {
            this.fileHandler.readFile(file); // FileHandler will automatically call record.init after reading
        }}
    
}

class UIHandler {
    constructor() {

    }

    updateUI(geneMatrix, cluster_type, BGC, recordData, moduleMatrix, regionName) {
        this.displayGenes(BGC, recordData, regionName);
        this.updateProteins(geneMatrix, BGC, recordData);
        
        if (cluster_type === "ripp") {
            this.updateRiPPs(geneMatrix, BGC);
        }
        else{
            this.updateDomains(geneMatrix, BGC, recordData, moduleMatrix);
        }
        this.addArrowClick(geneMatrix, cluster_type);
    }
    displayGenes(BGC, recordData, regionName) {
        this.viewPortHeight = window.innerHeight;
        this.viewPortWidth = window.innerWidth;
        let BGCForDisplay = JSON.parse(JSON.stringify(BGC));
        for (let geneIndex = 0; geneIndex < BGCForDisplay["orfs"].length; geneIndex++) {
            delete BGCForDisplay["orfs"][geneIndex]["domains"];
        }
        $("#arrow_container").html(Arrower.drawClusterSVG(this.removePaddingBGC(BGCForDisplay), this.viewPortHeight * 0.05, recordData, regionName));
        return BGCForDisplay;}

    createButtonsForEachRegion(recordData) {
        let listRegions = [];
        let listTypes = [];
        console.log(this.recordData)

        for (const record of recordData) {
            for (let index = 0; index < record.regions.length; index++) {
                listRegions.push(record.regions[index].anchor);
                listTypes.push(record.regions[index].type);
            }
        }

        let regionsBar = document.getElementById("regionsBar");
        let innerHTML = "";

        for (let index = 0; index < listRegions.length; index++) {
            let region = listRegions[index];
            let type = listTypes[index];
            innerHTML += `<button type='button' id ='buttonRegion_${region}' class= 'regionButton' onclick=session.record.changeRegionTo("${region}")><strong>${region.toUpperCase()} <br /> ${type}</strong></button>`;
        }

        regionsBar.innerHTML = innerHTML;
    }

    addRiPPPrecursorOptions(geneMatrix) {
        let innerHTML = "";
        for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
            let id = geneMatrix[geneIndex].id.replace(".", "_");
            innerHTML += `<button class='wildcardsubstrate' type='button' id='${id}_ripp_button' onclick='session.record.setRiPPPrecursor("${geneIndex}")'>${id}</button>`;
        }
        document.getElementById("ripp_precursor_selection").innerHTML = innerHTML;
    }

    updateProteins(geneMatrix, BGC, recordData) {
        let proteinsForDisplay = JSON.parse(JSON.stringify(BGC));
        delete proteinsForDisplay.orfs;
        proteinsForDisplay.orfs = [];
        geneMatrix.sort((a, b) => a.position - b.position);
        for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
            if (geneMatrix[geneIndex].displayed == true) {
                proteinsForDisplay.orfs.push(BGC.orfs[geneMatrix[geneIndex].position_in_BGC - 1]);
            }
        }
        $("#protein_container").html(Proteiner.drawClusterSVG(this.removePaddingBGC(this.removeSpaceBetweenProteins(proteinsForDisplay)), this.viewPortHeight * 0.07, geneMatrix, recordData));
        this.addDragDrop();
    }

    updateDomains(geneMatrix, BGC, recordData, moduleMatrix) {
        let domainsForDisplay = JSON.parse(JSON.stringify(BGC));
        delete domainsForDisplay.orfs;
        domainsForDisplay.orfs = [];
        geneMatrix.sort((a, b) => a.position - b.position);
        for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
            if (geneMatrix[geneIndex].displayed == true && geneMatrix[geneIndex].domains.length != 0) {
                domainsForDisplay.orfs.push(BGC.orfs[geneMatrix[geneIndex].position_in_BGC - 1]);
            }
        }
        $("#Domain_container").html(Domainer.drawClusterSVG(this.removePaddingBGC(this.removeSpaceBetweenProteins(domainsForDisplay)), this.viewPortHeight * 0.09, geneMatrix, recordData, moduleMatrix));
        this.addDragDrop();
    }

    updateRiPPs(geneMatrix, BGC, proteaseOptions) {
        let genesForDisplay = JSON.parse(JSON.stringify(BGC));
        delete genesForDisplay.orfs;
        genesForDisplay.orfs = [];
        geneMatrix.sort((a, b) => a.position - b.position);
        for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
            if (geneMatrix[geneIndex].displayed == true && geneMatrix[geneIndex].domains.length != 0) {
                genesForDisplay.orfs.push(BGC.orfs[geneMatrix[geneIndex].position_in_BGC - 1]);
            }
        }
        $("#Domain_container").html(RiPPer.drawCluster(genesForDisplay, geneMatrix, proteaseOptions), this.viewPortHeight * 0.05);
        this.addDragDrop();
    }
    addArrowClick(geneMatrix, cluster_type) {
        geneMatrix.forEach((gene, geneIndex) => {
            const elements = this.getGeneElements(gene);
            const originalColor = TYPE_COLORS[gene.type];

            this.setupArrowListeners(elements.arrow, gene, geneIndex, originalColor);
            this.setupProteinListeners(elements.protein, gene, geneIndex, originalColor);
            this.setupRippButtonListeners(elements.rippButton, gene, geneIndex, elements.arrow, originalColor);

            if (gene.displayed) {
                this.setupDisplayedGeneElements(gene, geneIndex, elements, originalColor, cluster_type);
            }
        });
    }

    getGeneElements(gene) {
        const getId = (suffix) => `#${gene.id.replace(".", "_")}${suffix}`;
        return {
            arrow: document.querySelector(getId("_gene_arrow")),
            protein: document.querySelector(getId("_protein")),
            rippButton: document.querySelector(getId("_ripp_button"))
        };
    }

    setupArrowListeners(arrow, gene, geneIndex, originalColor) {
        if (!arrow) return;

        const newArrow = arrow.cloneNode(true);
        arrow.parentNode.replaceChild(newArrow, arrow);

        newArrow.addEventListener('click', () => this.handleArrowClick(gene, newArrow, originalColor));
        newArrow.addEventListener('mouseenter', () => this.handleArrowMouseEnter(gene, newArrow, geneIndex));
        newArrow.addEventListener('mouseleave', () => this.handleArrowMouseLeave(gene, newArrow, geneIndex, originalColor));
    }

    setupProteinListeners(protein, gene, geneIndex, originalColor) {
        if (!protein) return;

        protein.addEventListener('click', () => this.handleProteinClick(gene, geneIndex, originalColor));
        protein.addEventListener('mouseenter', () => this.handleProteinMouseEnter(gene, geneIndex));
        protein.addEventListener('mouseleave', () => this.handleProteinMouseLeave(gene, geneIndex));
    }

    setupRippButtonListeners(rippButton, gene, geneIndex, arrow, originalColor) {
        if (!rippButton) return;

        rippButton.addEventListener('mouseenter', () => this.handleRippButtonMouseEnter(gene, arrow, geneIndex));
        rippButton.addEventListener('mouseleave', () => this.handleRippButtonMouseLeave(gene, arrow, geneIndex, originalColor));
    }

    setupDisplayedGeneElements(gene, geneIndex, elements, originalColor, cluster_type) {
        if (gene.tailoringEnzymeStatus) {
            this.setupTailoringEnzymeListeners(gene, geneIndex, elements);
        }

        if (cluster_type !== "ripp" && this.shouldSetupDomains(gene)) {
            this.setupDomainListeners(gene, geneIndex);
        }
    }

    shouldSetupDomains(gene) {
        return gene.modules || BIOSYNTHETIC_CORE_ENZYMES.includes(gene.orffunction) || gene.type.includes("biosynthetic");
    }

    setupTailoringEnzymeListeners(gene, geneIndex, elements) {
        const tailoringEnzyme = document.querySelector(`#tailoringEnzyme_${gene.id.replace(".", "_")}`);
        if (!tailoringEnzyme) return;

        const mouseEnterHandler = () => this.handleTailoringEnzymeMouseEnter(gene, geneIndex);
        const mouseLeaveHandler = () => this.handleTailoringEnzymeMouseLeave(gene, geneIndex);

        elements.arrow.addEventListener('mouseenter', mouseEnterHandler);
        elements.arrow.addEventListener('mouseleave', mouseLeaveHandler);
        elements.protein.addEventListener('mouseenter', mouseEnterHandler);
        elements.protein.addEventListener('mouseleave', mouseLeaveHandler);
        tailoringEnzyme.addEventListener('mouseenter', mouseEnterHandler);
        tailoringEnzyme.addEventListener('mouseleave', mouseLeaveHandler);
    }

    setupDomainListeners(gene, geneIndex) {
        gene.domains.forEach((domain, domainIndex) => {
            const domainElements = this.getDomainElements(gene, domain);
            this.addDomainListeners(domainElements, gene, geneIndex, domainIndex);
        });
    }

    getDomainElements(gene, domain) {
        const getId = (suffix) => `#${gene.id.replace(".", "_")}${suffix}`;
        return {
            domain: document.querySelector(`#domain${domain.identifier.replace(".", "_")}`),
            domain2: document.querySelector(getId(`_domain_${domain.sequence}`))
        };
    }

    addDomainListeners(elements, gene, geneIndex, domainIndex) {
        const { domain, domain2 } = elements;
        if (!domain || !domain2) return;

        const originalColor = getComputedStyle(domain).fill;
        const originalColor2 = getComputedStyle(domain2).fill;

        const clickHandler = () => this.handleDomainClick(gene, geneIndex, domainIndex, domain, domain2, originalColor, originalColor2);
        const mouseEnterHandler = () => this.handleDomainMouseEnter(gene, geneIndex, domain, domain2);
        const mouseLeaveHandler = () => this.handleDomainMouseLeave(gene, geneIndex, domain, domain2, originalColor, originalColor2);

        domain.addEventListener('click', clickHandler);
        domain.addEventListener('mouseenter', mouseEnterHandler);
        domain.addEventListener('mouseleave', mouseLeaveHandler);

        domain2.addEventListener('click', clickHandler);
        domain2.addEventListener('mouseenter', mouseEnterHandler);
        domain2.addEventListener('mouseleave', mouseLeaveHandler);
    }

    // Event handlers
    handleArrowClick(gene, arrow, originalColor) {
        session.record.geneMatrixHandler.setDisplayedStatus(gene.id);
        session.record.geneMatrixHandler.removeTailoringEnzymes();
        arrow.style.fill = gene.ko ? "#E11839" : originalColor;
        this.fetchFromRaichu(this.geneMatrixHandler);
    }

    handleArrowMouseEnter(gene, arrow, geneIndex, geneMatrix) {
        this.displayTextInGeneExplorer(gene.id);
        this.changeProteinColorON(`#${gene.id.replace(".", "_")}_protein`, geneIndex, geneMatrix);
        if (!gene.ko) {
            arrow.style.fill = "#E11839";
        }
    }

    handleArrowMouseLeave(gene, arrow, geneIndex, originalColor, geneMatrix) {
        this.changeProteinColorOFF(`#${gene.id.replace(".", "_")}_protein`, geneIndex, geneMatrix);
        if (!gene.ko) {
            arrow.style.fill = originalColor;
        }
    }

    handleProteinClick(gene, geneIndex, originalColor) {
        this.handleArrowClick(gene, document.querySelector(`#${gene.id.replace(".", "_")}_gene_arrow`), originalColor);
    }

    handleProteinMouseEnter(gene, geneIndex, geneMatrix) {
        this.displayTextInGeneExplorer(gene.id);
        this.changeProteinColorON(`#${gene.id.replace(".", "_")}_gene_arrow`, geneIndex, geneMatrix);
    }

    handleProteinMouseLeave(gene, geneIndex, geneMatrix) {
        this.changeProteinColorOFF(`#${gene.id.replace(".", "_")}_gene_arrow`, geneIndex, geneMatrix);
    }

    handleRippButtonMouseEnter(gene, arrow, geneIndex, geneMatrix) {
        this.displayTextInGeneExplorer(gene.id);
        this.changeProteinColorON(`#${gene.id.replace(".", "_")}_protein`, geneIndex, geneMatrix);
        if (!gene.ko) {
            arrow.style.fill = "#E11839";
        }
    }

    handleRippButtonMouseLeave(gene, arrow, geneIndex, originalColor, geneMatrix) {
        this.changeProteinColorOFF(`#${gene.id.replace(".", "_")}_protein`, geneIndex, geneMatrix);
        if (!gene.ko) {
            arrow.style.fill = originalColor;
        }
    }

    handleTailoringEnzymeMouseEnter(gene, geneIndex) {
        this.displayTextInGeneExplorer(gene.id);
        this.changeProteinColorON(`#${gene.id.replace(".", "_")}_gene_arrow`, geneIndex, geneMatrix);
        this.changeProteinColorON(`#${gene.id.replace(".", "_")}_protein`, geneIndex, geneMatrix);
    }

    handleTailoringEnzymeMouseLeave(gene, geneIndex, geneMatrix) {
        this.changeProteinColorOFF(`#${gene.id.replace(".", "_")}_gene_arrow`, geneIndex, geneMatrix);
        this.changeProteinColorOFF(`#${gene.id.replace(".", "_")}_protein`, geneIndex, geneMatrix);
    }

    handleDomainClick(gene, geneIndex, domainIndex, domain, domain2, originalColor, originalColor2) {
        const isKo = gene.domains[domainIndex].ko;
        const newColor = isKo ? originalColor : "#E11839";
        domain.style.fill = newColor;
        domain2.style.fill = newColor;
        this.setKoStatus(geneIndex, domainIndex);
        this.addArrowClick(); // Re-initialize to update all elements
    }

    handleDomainMouseEnter(gene, geneIndex, domain, domain2) {
        if (!gene.domains[geneIndex].ko) {
            domain.style.fill = "#E11839";
            domain2.style.fill = "#E11839";
        }
        this.displayTextInGeneExplorer(gene.id);
        this.changeProteinColorON(`#${gene.id.replace(".", "_")}_protein`, geneIndex);
        this.changeProteinColorON(`#${gene.id.replace(".", "_")}_gene_arrow`, geneIndex);
    }

    handleDomainMouseLeave(gene, geneIndex, domain, domain2, originalColor, originalColor2) {
        if (!gene.domains[geneIndex].ko) {
            domain.style.fill = originalColor;
            domain2.style.fill = originalColor2;
        }
        this.changeProteinColorOFF(`#${gene.id.replace(".", "_")}_gene_arrow`, geneIndex);
        this.changeProteinColorOFF(`#${gene.id.replace(".", "_")}_protein`, geneIndex);
    }

    openFormTerpene() {
        document.getElementById("popupFormTerpene").style.display = "block";
    }

    updateRiPPPrecursorTextarea(translation) {
        let textarea = document.querySelector('textarea');
        textarea.value = translation;
    }

    removePaddingBGC(BGC) {
        let BGC_with_padding = JSON.parse(JSON.stringify(BGC));
        if (BGC_with_padding.orfs.length != 0) {
            if (BGC_with_padding.orfs[0].start != 0) {
                for (let orfIndex = 0; orfIndex < BGC_with_padding.orfs.length; orfIndex++) {
                    BGC_with_padding.orfs[orfIndex].start = BGC_with_padding.orfs[orfIndex].start - BGC.start;
                    BGC_with_padding.orfs[orfIndex].end = BGC_with_padding.orfs[orfIndex].end - BGC.start;
                }
            }
        }
        return BGC_with_padding;
    }

    removeSpaceBetweenProteins(BGC) {
        let BGC_without_space = JSON.parse(JSON.stringify(BGC));
        for (let orfIndex = 0; orfIndex < BGC_without_space.orfs.length; orfIndex++) {
            let orf_length = BGC_without_space.orfs[orfIndex].end - BGC_without_space.orfs[orfIndex].start;
            BGC_without_space.orfs[orfIndex].start = 0;
            BGC_without_space.orfs[orfIndex].end = BGC_without_space.orfs[orfIndex].start + orf_length;
        }
        return BGC_without_space;
    }

    addDragDrop() {
        // Implementation of addDragDrop...
    }

    isRealTimeCalculationEnabled() {
        return document.getElementById("real-time-button").checked;
    }

    setColorOfDropDown(button) {
        let targets = document.getElementsByClassName("wildcardsubstrate");
        for (let index = 0; index < targets.length; index++) {
            let target = targets[index];
            target.removeAttribute("style");
        }
        button.setAttribute("style", "background-color: #E11839");
    }

    displayTextInGeneExplorer(geneId, BGCForDisplay) {
        // Implementation of displayTextInGeneExplorer...
    }

    changeProteinColorON(ProteinId, geneIndex, geneMatrix) {
    /**
    * Change color of protein.
   * @fires arrowclick
   *@input ProteinId, geneIndex -> find the protein svg as well as corresponding gene
   *@yield other color of protein
   */
        const arrow = document.querySelector(ProteinId.replace(".", "_"));
        arrow.setAttribute('style', "fill: #E11839");
}
    changeProteinColorOFF(ProteinId, geneIndex, geneMatrix) {
    /**
    * Change color of protein.
   * @fires arrowclick
   *@input ProteinId, geneIndex -> find the protein svg as well as corresponding gene
   *@yield other color of protein
   */
        const arrow = document.querySelector(ProteinId.replace(".", "_"));
        arrow.removeAttribute("style");
}
}

class HistoryStack {
    constructor() {
        this.undoStack = [];
        this.redoStack = [];
    }

    push(state) {
        this.undoStack.push(JSON.parse(JSON.stringify(state)));
        this.redoStack = []; // Clear redo stack when a new action is performed
    }

    undo() {
        if (this.undoStack.length > 1) {
            const currentState = this.undoStack.pop();
            this.redoStack.push(currentState);
            return this.undoStack[this.undoStack.length - 1];
        }
        return null;
    }

    redo() {
        if (this.redoStack.length > 0) {
            const state = this.redoStack.pop();
            this.undoStack.push(state);
            return state;
        }
        return null;
    }

    canUndo() {
        return this.undoStack.length > 1;
    }

    canRedo() {
        return this.redoStack.length > 0;
    }

    updateButtonStates() {
        const undoButton = document.querySelector('.redoUndo_button[onclick="session.record.undo()"]');
        const redoButton = document.querySelector('.redoUndo_button[onclick="session.record.redo()"]');

        if (!this.canUndo()) {
            undoButton.setAttribute('data-tooltip', 'No job to revert!');
            undoButton.classList.add('disabled');
        } else {
            undoButton.setAttribute('data-tooltip', 'Click to revert your last action.');
            undoButton.classList.remove('disabled');
        }

        if (!this.canRedo()) {
            redoButton.setAttribute('data-tooltip', 'No job to reapply!');
            redoButton.classList.add('disabled');
        } else {
            redoButton.setAttribute('data-tooltip', 'Click to reapply an action you have undone.');
            redoButton.classList.remove('disabled');
        }
    }
}

class FileHandler {
    constructor(record) {
        this.record = record;
        this.viewPortHeight = window.innerHeight;
        this.viewPortWidth = window.innerWidth;
        if (window.matchMedia("(orientation: portrait)").matches) {
            this.viewPortHeight = window.innerWidth;
            this.viewPortWidth = window.innerHeight;
        }
    }

    triggerFileInput() {
        document.getElementById('fileInput').click();
    }

    handleFileSelection(event) {
        const file = event.target.files[0];
        if (file) {
            this.readFile(file);
        }
    }

    getFirstRegion(recordData) {
    let record_index = 0
    for (const record of recordData) {

        for (let region_index = 0; region_index < record.regions.length; region_index++) {
            return [region_index, record_index]
        }
        record_index++
    }

}

    async loadExampleFile() {
        const response = await fetch("./example_regions.js");
        const content = await response.text();
        const blob = new Blob([content], { type: "text/javascript" });
        this.readFile(blob);
        
    }

    readFile(file) {
        const reader = new FileReader();

        reader.addEventListener('load', (event) => {
            const result = event.target.result.split("var ");

            if (result.length != 5) {
                const dropArea = document.getElementById('regionsBar');
                dropArea.innerHTML = "Input file not antiSMASH output";
            } else {
                const recordDataString = result[1].replace("recordData = ", "").trim().slice(0, -1);
                const recordData = JSON.parse(recordDataString);
                const details_data = JSON.parse(result[3].trim().replace("details_data = ", "").trim().slice(0, -1));


                this.record = new Record();
                this.record.init(recordData, details_data);
            }
        });

        reader.addEventListener('progress', (event) => {
            if (event.loaded && event.total) {
                const percent = (event.loaded / event.total) * 100;
                const dropArea = document.getElementById('regionsBar');
                dropArea.innerHTML = `Progress: ${Math.round(percent)}`;
            }
        });

        reader.readAsText(file);
    }


    setupDropArea() {
        const dropArea = document.getElementById('regionsBar');

        dropArea.addEventListener('dragover', (event) => {
            event.stopPropagation();
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
        });

        dropArea.addEventListener('drop', (event) => {
            event.stopPropagation();
            event.preventDefault();
            const fileList = event.dataTransfer.files;
            const input_file = fileList[0];
            this.readFile(input_file);
        });
    }


}

let session = new ApplicationManager();
let regionHandler = new RegionHandler();
let uiHandler = new UIHandler();
let svgHandler = new SVGHandler();
let apiService = new APIService(CONFIG.PORT, svgHandler);
session.init();