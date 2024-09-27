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
    "3-me-glu": "4-methylglutamic acid",
    "4ppro": "**Unknown**",
    "aad": "2-aminoadipicacid",
    'abu': "2-aminobutyricacid",
    'aeo': "2-amino-9,10-epoxy-8-oxodecanoid acid",
    'ala-b': "beta-alanine",
    'ala-d': "d-alanine",
    'allo-thr': "allo-threonine",
    'b-ala': "beta-alanine",
    'beta-ala': "beta-alanine",
    'bmt': "4-butenyl-4-methylthreonine",
    'cap': "capreomycidine",
    'bht': "**Unknown**",
    'dab': "2,4-diaminobutyric acid",
    'dhb': "2,3-dihydroxybenzoic acid",
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

const PKS_SUBSTRATES = Object.keys(NAME_TO_STRUCTURE);

const TRANS_AT_KS_SUBTYPES = { ' Beta Keto groups.': 'BETA_OH_KETO', 'Acetyl groups as the starting building block of the polyketide.': 'ACST', 'Alpha hydroxy groups, beta keto group': 'ALPHA_OH', 'Alpha-L-groups in conjunction with beta-D-hydroxyl groups.': 'ALPHAME_BETA_D_OH', 'Alpha-hydroxyl groups in conjunction with beta-hydroxyl groups.': 'ALPHABETA_OH', 'Alpha-methyl groups in conjunction with beta-L-hydroxyl groups.': 'ALPHAME_BETA_L_OH', 'Alpha-methyl groups in conjunction with beta-hydroxyl groups.': 'ALPHAME_BETAOH', 'Alpha-methyl groups with E-configured double bonds.': 'ALPHAME_EDB', 'Alpha-methyl groups with Z-configured double bonds.': 'ALPHAME_ZDB', 'Alpha-methyl groups with beta-gamma-double bonds.': 'ALPHA_D_ME_SHDB', 'Alpha-methyl groups with double bonds.': 'ALPHAME_DB', 'Alpha-methyl groups with either a reduced bond or a beta-gamma-double bond.': 'ALPHAME', 'Amidated amino acid starters. Amide groups are introduced by a dedicated aminotransferase.': 'ST', 'Amino acids containing oxazole or thiazole rings introduced by the NRPS module upstream.': 'OXA', 'Aromatic rings as the starting building block of the polyketide.': 'ARST', 'Beta-D-hydroxyl groups.': 'BETA_D_OH', 'Beta-L-hydroxyl groups.': 'BETA_L_OH', 'Beta-gamma-double bonds.': 'SHDB', 'Beta-hydroxy E-double bond': 'BETA_OH_EDB', 'Beta-hydroxyl groups.': 'BETA_OH', 'Beta-keto groups.': 'KETO', 'Beta-methoxy groups.': 'BETA_D_OME', 'Beta-methyl groups with double bonds.': 'BETA_MEDB', 'Double bonds of various configurations.': 'DB', 'E-configured double bonds.': 'EDB', 'Either beta-exomethylene groups or reduced beta-methyl groups, depending on the module composition upstream.': 'BETA_ME', 'Exomethylene groups.': 'EXOMETHYLENE', 'Glycine introduced by the NRPS module upstream.': 'AA', 'Lactate as the starting building block of the polyketide.': 'LACST', 'Methoxycarbonyl units as the starting building block of the polyketide.': 'MEOST', 'Non-elongating KS with keto groups': 'NON_ELONGATING_OXA', 'Non-elongating KS with specifity for pyran or furan rings.': 'NON_ELONGATING_PYR', 'Non-elongating with alpha-methyl groups and E-double bonds.': 'NON_ELONGATING_ALPHAME_EDB', 'Non-elongating with beta-L-hydroxy groups.': 'NON_ELONGATING_BETA_L_OH', 'Non-elongating with beta-hydroxy groups.': 'NON_ELONGATING_BETA_OH', 'Non-elongating with double bonds.': 'NON_ELONGATING_DB', 'Phosphoglycerate-derived molecules as the starting building block of the polyketide.': 'UNST', 'Pyran or furan rings, depending on the presence of an in-trans-acting hydroxylases two modules upstream.': 'PYR', 'Reduced bonds.': 'RED', 'Shifted double bond.': 'RED_SHDB', 'Substrates with inserted oxygen, oftentimes resulting in oxidative cleaving.': 'OXI', 'This type is elongating, but the substrate specificity cannot be predicted.': 'MISCELLANEOUS', 'This type is in an out group.': 'OUT', 'This type is specific for vinylogous chain branching.': 'BR', 'When without a suffix, this type is non-elongating, but the substrate specificity cannot be predicted.': 'NON_ELONGATING', 'Z-Double bonds': 'ZDB' }

class Record {
    constructor() {
        this.geneMatrixHandler = null;
        this.clusterTypeHandler = new ClusterTypeHandler();
        


        this.regionIndex = 0;
        this.recordIndex = 0;
        this.reversed = false;
        this.regionName = "";
        this.BGC = {};
        this.cluster_type = "";
        this.wildcardModule = "";
        this.wildcardSubstrate = "";
        this.wildcardEnzyme = "";
        this.recordData = null;
        this.details_data = null;
    }

    init(recordData, details_data) {
        this.recordData = recordData;
        this.details_data = details_data;
        this.cluster_type = this.clusterTypeHandler.getClusterType(this.regionIndex, this. recordIndex, this.recordData)
        
        this.reload_site_with_genecluster();
    }

    async init_from_state(recordData, details_data, geneMatrix, BGC, regionIndex) {
        this.recordData = recordData;
        this.details_data = details_data;
        this.cluster_type = this.clusterTypeHandler.getClusterType(this.regionIndex, this.recordIndex, this.recordData)
        this.regionIndex = regionIndex;
        this.regionName = regionHandler.getRegionName(this.regionIndex, this.recordIndex, this.recordData);
        this.geneMatrixHandler = new GeneMatrixHandler(BGC, this.details_data, this.regionName, this.cluster_type, this.regionIndex, this.recordData);
        this.addButtonListeners()
        this.geneMatrixHandler.geneMatrix = geneMatrix;
        uiHandler.setGeneMatrixHandler(this.geneMatrixHandler);
        this.createButtonsForEachRegion();
        //this.addButtonListeners()
        uiHandler.updateUI(this.geneMatrixHandler);
        let raichu_output = await apiService.fetchFromRaichu(this.geneMatrixHandler);
        uiHandler.updateUI(this.geneMatrixHandler);
        uiHandler.addDragDrop();
        if (this.geneMatrixHandler.cluster_type === "nrpspks") {
            svgHandler.updateIntermediates(raichu_output, this.geneMatrixHandler, this.geneMatrixHandler.starterACP);
        }
        if (this.geneMatrixHandler.cluster_type === "terpene") {
            if (document.getElementById("innerIntermediateContainer_tailoredProduct")) {
                svgHandler.updateIntermediateContainer("innerIntermediateContainer_cyclizedProduct", raichu_output.cyclizedStructure, "intermediate_drawing_cyclisation_terpene", "cyclized_drawing");
                svgHandler.updateIntermediateContainer("innerIntermediateContainer_precursor", raichu_output.precursor, "intermediate_drawing_precursor", "precursor_drawing");
                svgHandler.updateIntermediateContainer("innerIntermediateContainer_tailoredProduct", raichu_output.structureForTailoring, "intermediate_drawing_tailored");
            }
        }


    }

    reload_site_with_genecluster() {
        this.createButtonsForEachRegion();
        [this.regionIndex, this.recordIndex] = regionHandler.getFirstRegion(this.recordData);
        this.runAlola();
    }

    addButtonListeners() {
        const resetButton = document.getElementById("reset_button");
        const reverseButton = document.getElementById("reverse_button");
        const refreshButton = document.getElementById("refresh_button");

        // Remove all existing listeners
        resetButton.replaceWith(resetButton.cloneNode(true));
        reverseButton.replaceWith(reverseButton.cloneNode(true));
        refreshButton.replaceWith(refreshButton.cloneNode(true));

        // Re-select the buttons after replacing them
        const newResetButton = document.getElementById("reset_button");
        const newReverseButton = document.getElementById("reverse_button");
        const newRefreshButton = document.getElementById("refresh_button");

        // Add new listeners
        newResetButton.addEventListener('click', () => this.runAlola());
        newReverseButton.addEventListener('click', () => this.reverseBGC());
        newRefreshButton.addEventListener('click', () => this.geneMatrixHandler.reloadGeneCluster());
    }

    createButtonsForEachRegion() {
        console.log('Creating buttons for record data:', this.recordData);

        const regionData = this.extractRegionData();
        const buttonElements = this.createButtonElements(regionData);

        this.renderButtons(buttonElements);
    }

    extractRegionData() {
        return this.recordData.flatMap(record =>
            record.regions.map(region => ({
                anchor: region.anchor,
                type: region.type
            }))
        );
    }

    createButtonElements(regionData) {
        return regionData.map(({ anchor, type }) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.id = `buttonRegion_${anchor}`;
            button.className = 'regionButton';
            button.innerHTML = `<strong>${anchor.toUpperCase()}<br>${type}</strong>`;

            button.addEventListener('click', () => this.changeRegionTo(anchor));

            return button;
        });
    }

    renderButtons(buttonElements) {
        // Clear existing content
        regionsBar = document.getElementById("regionsBar");
        regionsBar.innerHTML = '';

        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        buttonElements.forEach(button => fragment.appendChild(button));

        regionsBar.appendChild(fragment);
    }

    async runAlola() {
        this.BGC = {};
        this.reversed = false;
        this.rippPrecursor = "";
        this.cyclization = "None";
        this.regionName = regionHandler.getRegionName(this.regionIndex, this.recordIndex, this.recordData);
        let cluster_type = this.clusterTypeHandler.getClusterType(this.regionIndex, this.recordIndex, this.recordData);
       
        

        this.BGC = regionHandler.getBGC(this.recordIndex, this.regionIndex, this.recordData, this.details_data);
        this.geneMatrixHandler = new GeneMatrixHandler(this.BGC, this.details_data, this.regionName, cluster_type, this.regionIndex, this.recordData);
        this.geneMatrixHandler.createGeneMatrix()
        console.log("gene matrix", JSON.stringify(this.geneMatrixHandler.geneMatrix));
        this.addButtonListeners()
        uiHandler.setGeneMatrixHandler(this.geneMatrixHandler);
        let result = this.geneMatrixHandler.extractAntismashPredictionsFromRegion();
        //this.addButtonListeners()
        if (result){
            uiHandler.updateUI(this.geneMatrixHandler);
            uiHandler.addRiPPPrecursorOptions(this.geneMatrixHandler.geneMatrix);

            if (this.geneMatrixHandler.cluster_type === "terpene") {
                uiHandler.openFormTerpene();
            }

            let raichu_output = await apiService.fetchFromRaichu(this.geneMatrixHandler);
            uiHandler.updateUI(this.geneMatrixHandler);
            uiHandler.addDragDrop();
            if (this.geneMatrixHandler.cluster_type === "nrpspks") {
                svgHandler.updateIntermediates(raichu_output, this.geneMatrixHandler, this.geneMatrixHandler.starterACP);
            }
            if (this.geneMatrixHandler.cluster_type === "terpene") {
                if (document.getElementById("innerIntermediateContainer_tailoredProduct")) {
                    svgHandler.updateIntermediateContainer("innerIntermediateContainer_cyclizedProduct", raichu_output.cyclizedStructure, "intermediate_drawing_cyclisation_terpene", "cyclized_drawing");
                    svgHandler.updateIntermediateContainer("innerIntermediateContainer_precursor", raichu_output.precursor, "intermediate_drawing_precursor", "precursor_drawing");
                    svgHandler.updateIntermediateContainer("innerIntermediateContainer_tailoredProduct", raichu_output.structureForTailoring, "intermediate_drawing_tailored");
                }
            }

        }
        else {

            if (this.geneMatrixHandler.cluster_type === "terpene") {
                console.log("gene matrix", JSON.stringify(this.geneMatrixHandler.geneMatrix));
                uiHandler.updateUI(this.geneMatrixHandler);
                uiHandler.addDragDrop();
                uiHandler.openFormTerpene();
                
            }

        }



    }

    async reverseBGC() {
        if (this.reversed) {
            this.runAlola();
        } else {
            this.reversed = true;
            this.BGC = regionHandler.getReversedBGC(this.recordIndex, this.regionIndex, this.details_data, this.recordData);
            this.regionName = regionHandler.getRegionName(this.regionIndex, this.recordIndex, this.recordData);
            let cluster_type = this.clusterTypeHandler.getClusterType(this.regionIndex, this.recordIndex, this.recordData);
            this.geneMatrixHandler = new GeneMatrixHandler(this.BGC, this.details_data, this.regionName, cluster_type, this.regionIndex, this.recordData);
            this.geneMatrixHandler.extractAntismashPredictionsFromRegion();
            uiHandler.updateUI(this.geneMatrixHandler);
            uiHandler.addRiPPPrecursorOptions(this.geneMatrixHandler.geneMatrix);

            if (this.geneMatrixHandler.cluster_type === "terpene") {
                uiHandler.openFormTerpene();
            }

            let raichu_output = await apiService.fetchFromRaichu(this.geneMatrixHandler);
            uiHandler.updateUI(this.geneMatrixHandler);
            uiHandler.addDragDrop();
            if (this.geneMatrixHandler.cluster_type === "nrpspks") {
                svgHandler.updateIntermediates(raichu_output, this.geneMatrixHandler, this.geneMatrixHandler.starterACP);
            }


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
        uiHandler.updateUI(this.geneMatrixHandler);

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
        this.loadDataFromURL();
        document.getElementById('uploadButton').addEventListener('click', () => this.fileHandler.triggerFileInput());
        document.getElementById('fileInput').addEventListener('change', (event) => this.handleFileSelection(event));
        document.getElementById('load_example_button').addEventListener('click', () => this.fileHandler.loadExampleFile());
        document.getElementById('shareButton').addEventListener('click', () => this.shareData());
        this.fileHandler.setupDropArea();
    }

    loadDataFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedData = urlParams.get('data');
        if (encodedData) {
            try {
                const decodedData = JSON.parse(atob(encodedData));
                if (decodedData.currentBGC && decodedData.currentGeneMatrix && decodedData.regionIndex !== undefined) {
                    this.record.init_from_state(decodedData.recordData, decodedData.detailsData, decodedData.currentGeneMatrix, decodedData.currentBGC, decodedData.regionIndex);
                }
                else {
                this.record.init(decodedData.recordData, decodedData.detailsData);
                }
            } catch (error) {
                console.error('Failed to load data from URL:', error);
            }
        }
    }

    shareData() {
        const data = {
            recordData: this.record.recordData,
            detailsData: this.record.detailsData
        };
        const encodedData = btoa(JSON.stringify(data));
        const url = `${window.location.origin}${window.location.pathname}?data=${encodedData}`;

        // You can either copy to clipboard or open in a new tab
        navigator.clipboard.writeText(url).then(() => {
            alert('Share URL copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy URL: ', err);
            // Fallback: open in new tab
            window.open(url, '_blank');
        });
    }

    handleFileSelection(event) {
        const file = event.target.files[0];
        if (file) {
            this.fileHandler.readFile(file); // FileHandler will automatically call record.init after reading
        }}
    
}

class UIHandler {
    constructor() {
        this.dragSrcEl = null;

    }

    updateUI(geneMatrixHandler) {
        let geneMatrix = geneMatrixHandler.geneMatrix;
        let BGC = geneMatrixHandler.BGC;
        let recordData = geneMatrixHandler.recordData;
        let regionName = geneMatrixHandler.regionName;
        let cluster_type = geneMatrixHandler.cluster_type;
        this.displayGenes(BGC, recordData, regionName);
        this.updateProteins(geneMatrix, BGC, recordData);
        
        if (cluster_type === "ripp") {
            this.updateRiPPs(geneMatrix, BGC, geneMatrixHandler.proteaseOptions, geneMatrixHandler.cleavageSites, geneMatrixHandler);
        }

        if (cluster_type === "terpene") {
            this.updateTerpenes(geneMatrixHandler);
        }
        else{
            this.updateDomains(geneMatrixHandler);
        }
        geneMatrixHandler.addArrowClick();
    }

    addButtonListeners() {
        const buttonConfigs = [
            { id: 'impressum-button', handler: () => this.showImpressum() },
            { id: 'openAlolaManual', handler: () => { window.location.href = './Alola_Manual_new.html'; } },
            { id: 'add_module_button', handler: () => this.openWildcardModuleForm() },
            { id: 'openNRPSForm', handler: () => { this.openNRPSForm(); this.closeWildcardModuleForm(); } },
            { id: 'openPKSForm', handler: () => { this.openPKSForm(); this.closeWildcardModuleForm(); } },
            { id: 'closeMainForm', handler: () => this.closeWildcardModuleForm() },
            { id: 'add_tailoring_enzyme_button', handler: () => this.openTailoringForm() },
            { id: 'ripp_button', handler: () => this.openRiPPForm() },
            { id: 'addRiPPButton', handler: () => { this.geneMatrixHandler.addRiPP(); this.closeRiPPForm(); } },
            { id: 'cancelRiPPButton', handler: () => this.closeRiPPForm() },
            { id: 'submitTerpeneButton', handler: () => { this.geneMatrixHandler.reloadGeneCluster(); this.closeFormTerpene(); } },
            { id: 'closeTerpeneButton', handler: () => this.closeFormTerpene() }
        ];

        buttonConfigs.forEach(config => {
            const button = document.getElementById(config.id);
            if (button) {
                // Remove old listeners and replace with a new button
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);

                // Add new listener
                newButton.addEventListener('click', config.handler);
            }
        });
    }

    openWildcardModuleForm(){
            document.getElementById("popupForm").style.display = "block";
    }

    openNRPSForm() {
        document.getElementById("popupFormNRPS").style.display = "block";
    }

    openPKSForm() {
        document.getElementById("popupFormPKS").style.display = "block";
    }

    openRiPPForm() {
        document.getElementById("popupFormRiPP").style.display = "block";
    }

    closeRiPPForm() {
        document.getElementById("popupFormRiPP").style.display = "none";
    }

    openFormTerpene() {
        document.getElementById("popupFormTerpene").style.display = "block";
    }

    closeFormTerpene() {
        document.getElementById("popupFormTerpene").style.display = "none";
    }

    appendButtonsToDropdownTerpene(geneMatrixHandler) {
        const dropdown = document.getElementById("dropdownContentTerpene");
        dropdown.innerHTML = '';
        let entries = TERPENE_SUBSTRATES;
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            const button = document.createElement("button");
            button.classList.add("wildcardsubstrate");
            button.textContent = entry;
            button.onclick = function () {
                geneMatrixHandler.addTerpene(entry);
            };
            dropdown.appendChild(button);
        }
    }


    closeWildcardModuleForm() {
        document.getElementById("popupForm").style.display = "none";
    }

    closeNRPSForm() {
        document.getElementById("popupFormNRPS").style.display = "none";
    }

    closePKSForm() {
        document.getElementById("popupFormPKS").style.display = "none";
    }


    showImpressum() {
        var popup = document.getElementById("popupImpressum");
        if (popup.style.display == "block") {
            popup.style.display = "none";
        }
        else { popup.style.display = "block"; }
    }

    displayGenes(BGC, recordData, regionName) {
        this.viewPortHeight = window.innerHeight;
        this.viewPortWidth = window.innerWidth;
        if (window.matchMedia("(orientation: portrait)").matches) {
            this.viewPortHeight = window.innerWidth;
            this.viewPortWidth = window.innerHeight;
        }
        let BGCForDisplay = JSON.parse(JSON.stringify(BGC));
        for (let geneIndex = 0; geneIndex < BGCForDisplay["orfs"].length; geneIndex++) {
            delete BGCForDisplay["orfs"][geneIndex]["domains"];
        }
        $("#arrow_container").html(Arrower.drawClusterSVG(this.removePaddingBGC(BGCForDisplay), this.viewPortHeight * 0.05, recordData, regionName));
        return BGCForDisplay;}

    addRiPPPrecursorOptions(geneMatrix) {
        const precursorContainer = document.getElementById("ripp_precursor_selection");
        if (!precursorContainer) {
            console.error("RiPP precursor selection container not found");
            return;
        }

        // Clear existing content
        precursorContainer.innerHTML = '';

        // Create a document fragment to improve performance
        const fragment = document.createDocumentFragment();

        geneMatrix.forEach((gene, geneIndex) => {
            const button = document.createElement('button');
            button.className = 'wildcardsubstrate';
            button.type = 'button';

            const id = gene.id.replace(".", "_");
            button.id = `${id}_ripp_button`;
            button.textContent = id;

            // Add event listener
            button.addEventListener('click', () => this.setRiPPPrecursor(geneIndex));

            fragment.appendChild(button);
        });

        // Append all buttons at once
        precursorContainer.appendChild(fragment);
    }

    setRiPPPrecursor(geneIndex) {
        this.rippPrecursorGene = geneIndex;
        console.log(`RiPP precursor set to gene at index ${geneIndex}`);

        // Fetch and display the gene sequence
        const geneSequence = this.geneMatrixHandler.getTranslation(geneIndex);
        this.displayRiPPPrecursorSequence(geneSequence);
    }

    displayRiPPPrecursorSequence(sequence) {
        const textarea = document.querySelector('#popupFormRiPP textarea');
        if (textarea) {
            textarea.value = sequence;
        }
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

    updateDomains(geneMatrixHandler) {
        let domainsForDisplay = JSON.parse(JSON.stringify(geneMatrixHandler.BGC));
        let geneMatrix = geneMatrixHandler.geneMatrix;
        let BGC = geneMatrixHandler.BGC;
        delete domainsForDisplay.orfs;
        
        domainsForDisplay.orfs = [];
        
        geneMatrix.sort((a, b) => a.position - b.position);
        for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
            if (geneMatrix[geneIndex].displayed == true && geneMatrix[geneIndex].domains.length != 0) {
                domainsForDisplay.orfs.push(BGC.orfs[geneMatrix[geneIndex].position_in_BGC - 1]);
            }
        }
        $("#Domain_container").html(Domainer.drawClusterSVG(this.removePaddingBGC(this.removeSpaceBetweenProteins(domainsForDisplay)), this.viewPortHeight * 0.09, geneMatrixHandler));

    }

    updateRiPPs(geneMatrix, BGC, proteaseOptions, cleavageSites, geneMatrixHandler) {
        geneMatrix.sort((a, b) => a.position - b.position);
        for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
            if (geneMatrix[geneIndex].displayed == true && geneMatrix[geneIndex].domains.length != 0) {
                genesForDisplay.orfs.push(BGC.orfs[geneMatrix[geneIndex].position_in_BGC - 1]);
            }
        }
        $("#Domain_container").html(RiPPer.drawCluster(genesForDisplay, geneMatrix, proteaseOptions, this.viewPortHeight * 0.05, 600, cleavageSites, geneMatrixHandler));

    }

    updateTerpenes(geneMatrixHandler) {

        $("#Domain_container").html(Terpener.drawCluster(geneMatrixHandler.geneMatrix, 90, 300, geneMatrixHandler.terpeneCyclaseOptions, geneMatrixHandler));

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

    setGeneMatrixHandler(geneMatrixHandler) {
        this.geneMatrixHandler = geneMatrixHandler;
    }

    addDragDrop() {
        const items = document.querySelectorAll('.protein-container .box');
        items.forEach(item => {
            item.addEventListener('dragstart', this.handleDragStart.bind(this));
            item.addEventListener('dragenter', this.handleDragEnter);
            item.addEventListener('dragover', this.handleDragOver);
            item.addEventListener('dragleave', this.handleDragLeave);
            item.addEventListener('drop', this.handleDrop.bind(this));
            item.addEventListener('dragend', this.handleDragEnd);
        });
    }

    handleDragStart(e) {
        this.dragSrcEl = e.target;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }

    handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    handleDragEnter(e) {
        e.target.classList.add('over');
    }

    handleDragLeave(e) {
        e.target.classList.remove('over');
    }

    handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();

        if (this.dragSrcEl !== e.target) {
            const locusTagDragged = this.dragSrcEl.id.substring(21);
            const locusTagTarget = e.target.id.replace('_protein', '').replace('_', '.');

            if (this.geneMatrixHandler) {
                if (typeof this.geneMatrixHandler.handleGenePositionUpdate === 'function') {
                    this.geneMatrixHandler.handleGenePositionUpdate(locusTagDragged, locusTagTarget);
                } else {
                    console.error('handleGenePositionUpdate is not a function');
                }

                if (typeof this.geneMatrixHandler.reloadGeneCluster === 'function') {
                    this.geneMatrixHandler.reloadGeneCluster();
                } else {
                    console.error('reloadGeneCluster is not a function');
                }

            } else {
                console.error('geneMatrixHandler is not set');
            }
        }

        return false;
    }

    handleDragEnd(e) {
        e.target.style.opacity = '1';
        document.querySelectorAll('.protein-container .box').forEach(item => {
            item.classList.remove('over');
        });
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
    /**
    * Displays the description of the gene in the gene explorer.
    * @fires hovergene
    * @input geneID
    * @yield changes text in gene explorer
    */
    for (let geneIndex = 0; geneIndex < BGCForDisplay["orfs"].length; geneIndex++) {
        if (BGCForDisplay["orfs"][geneIndex].locus_tag === geneId) {
            let description = BGCForDisplay["orfs"][geneIndex].description;

            // Remove unwanted text sections and their contents
            const unwantedTextPatterns = [
                /NCBI BlastP on this gene.*?/gis,
                /Blast against antiSMASH-database *?/gis,
                /MiBIG Hits.*?/gis,
                /TransportDB BLAST on this gene.*?/gis,
                /AA sequence: *?/gis,
                /Copy to clipboard *?/gis,
                /Nucleotide sequence: *?/gis,
                /Copy to clipboard *?/gis,
            ];

            unwantedTextPatterns.forEach(pattern => {
                description = description.replace(pattern, '');
            });

            // Remove extra whitespace if necessary
            description = description.trim();

            // Set the cleaned description to the gene container
            gene_container.innerHTML = description;
        }
    }
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

    createTailoringEnzymeForm(geneMatrixHandler) {
        const container = document.getElementById('popupFormTailoring');
        if (!container) {
            console.error("Container 'popupFormTailoring' not found");
            return;
        }

        // Remove all existing children
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        const form = document.createElement('div');
        form.className = 'formContainer';

        // Create Tailoring Enzyme dropdown
        const tailoringEnzymes = Object.keys(TAILORING_ENZYMES); // Assuming you have a tailoringEnzymes object
        const enzymeDropdown = this.createDropdown('Tailoring Enzyme', tailoringEnzymes);
        form.appendChild(enzymeDropdown);

        // Create Submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.className = 'btn';
        submitButton.textContent = 'Submit';
        submitButton.onclick = () => {
            const selectedEnzyme = enzymeDropdown.querySelector('.dropbtn').textContent;
            geneMatrixHandler.createWildcardTailoringGene(selectedEnzyme);
            this.closeTailoringForm();
        };
        form.appendChild(submitButton);

        // Create Close button
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'btn cancel';
        closeButton.textContent = 'Close';
        closeButton.onclick = () => this.closeTailoringForm();
        form.appendChild(closeButton);

        container.appendChild(form);
    }

    closeTailoringForm() {
        document.getElementById('popupFormTailoring').style.display = "none";
    }

    openTailoringForm() {
        const form = document.getElementById('popupFormTailoring');
        if (form) {
            form.style.display = "block";
        } else {
            console.error("Tailoring form container not found");
        }
    }

    createWildcardButtons(formType, geneMatrixHandler) {
        const containerId = formType === 'NRPS' ? 'popupFormNRPS' : 'popupFormPKS';
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container '${containerId}' not found`);
            return;
        }

        // Remove all existing children
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        const form = document.createElement('form');
        form.className = 'formContainer';

        // Create Module Type dropdown
        const moduleTypes = [
            `starter_module_${formType.toLowerCase()}`,
            `elongation_module_${formType.toLowerCase()}`,
            `terminator_module_${formType.toLowerCase()}`
        ];
        const moduleDropdown = this.createDropdown('Module Type', moduleTypes);
        form.appendChild(moduleDropdown);

        // Create Substrate dropdown (initially with NRPS or PKS substrates)
        const initialSubstrates = formType === 'NRPS' ? Object.values(AMINO_ACIDS) : PKS_SUBSTRATES;
        const substrateDropdown = this.createDropdown('Substrate', initialSubstrates);
        form.appendChild(substrateDropdown);

        form.appendChild(document.createElement('br'));

        // Create checkboxes
        if (formType === 'NRPS') {
            this.createCheckbox(form, 'wildcardE', 'Epimerization');
        } else {
            this.createCheckbox(form, 'wildcardKR', 'Ketoreductase domain');
            this.createCheckbox(form, 'wildcardDH', 'Dehydratase domain');
            this.createCheckbox(form, 'wildcardER', 'Enoylreductase domain');
        }

        // Update substrate options when module type changes (for PKS only)
        if (formType === 'PKS') {
            moduleDropdown.querySelector('.dropbtn').addEventListener('click', () => {
                setTimeout(() => {
                    const selectedModule = moduleDropdown.querySelector('.dropbtn').textContent;
                    const substrates = selectedModule === 'starter_module_pks' ? PKS_STARTER_SUBSTRATES : PKS_SUBSTRATES;
                    this.updateDropdownOptions(substrateDropdown, substrates);
                }, 0);
            });
        }

        // Create Submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.className = 'btn';
        submitButton.textContent = 'Submit';
        submitButton.onclick = () => {
            const substrate = substrateDropdown.querySelector('.dropbtn').textContent;
            const moduleType = moduleDropdown.querySelector('.dropbtn').textContent;
            const checkboxValues = {};
            form.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkboxValues[checkbox.id] = checkbox.checked;
            });
            geneMatrixHandler.createWildcardGene(moduleType, substrate);
            this.closeForm(formType);
        };
        form.appendChild(submitButton);

        // Create Close button
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'btn cancel';
        closeButton.textContent = 'Close';
        closeButton.onclick = () => this.closeForm(formType);
        form.appendChild(closeButton);

        container.appendChild(form);
    }

    createDropdown(label, options) {
        console.log(JSON.stringify(options));
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown';

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'dropbtn';
        button.textContent = label;

        const content = document.createElement('div');
        content.className = 'dropdown-content';

        options.forEach(option => {
            const optionButton = document.createElement('button');
            optionButton.type = 'button';
            optionButton.className = 'wildcardsubstrate';
            optionButton.textContent = option;
            optionButton.onclick = (e) => {
                e.preventDefault();
                button.textContent = option;
            };
            content.appendChild(optionButton);
        });

        dropdown.appendChild(button);
        dropdown.appendChild(content);
        return dropdown;
    }

    updateDropdownOptions(dropdown, newOptions) {
        const content = dropdown.querySelector('.dropdown-content');
        content.innerHTML = '';
        newOptions.forEach(option => {
            const optionButton = document.createElement('button');
            optionButton.type = 'button';
            optionButton.className = 'wildcardsubstrate';
            optionButton.textContent = option;
            optionButton.onclick = (e) => {
                e.preventDefault();
                dropdown.querySelector('.dropbtn').textContent = option;
            };
            content.appendChild(optionButton);
        });
    }

    createCheckbox(form, id, label) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.name = id;
        checkbox.value = 'true';
        const checkboxLabel = document.createElement('label');
        checkboxLabel.htmlFor = id;
        checkboxLabel.textContent = ` ${label}`;
        form.appendChild(checkbox);
        form.appendChild(checkboxLabel);
        form.appendChild(document.createElement('br'));
    }

    closeForm(formType) {
        const formId = formType === 'NRPS' ? 'popupFormNRPS' : 'popupFormPKS';
        document.getElementById(formId).style.display = "none";
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
uiHandler.addButtonListeners();
let svgHandler = new SVGHandler();
let apiService = new APIService(CONFIG.PORT, svgHandler);
session.init();