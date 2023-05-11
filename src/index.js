const CONFIG = {
    PORT: "https://api-alola.bioinformatics.nl/",
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
    "aad": "2-aminoadipic acid",
    'abu': "2-aminobutyric acid",
    'aeo': "2-amino-9,10-epoxy-8-oxodecanoid acid",
    'ala-b': "beta-alanine",
    'ala-d': "d-alanine",
    'allo-thr': "allo-threonine",
    'b-ala': "beta-alanine",
    'beta-ala': "beta-alanine",
    'bmt': "4-butenyl-4-methyl threonine",
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
    'd-lyserg': "D-lysergic acid",
    'ser-thr': "**Unknown**",
    'mephe': "**Unknown**",
    'haorn': "**Unknown**",
    'hasn': "**Unknown**",
    'hforn': "**Unknown**",
    's-nmethoxy-trp': "**Unknown**",
    'alpha-hydroxy-isocaproic-acid': "**Unknown**",
    'mehoval': "**Unknown**",
    '2-oxo-isovaleric-acid': "alpha-ketoisovaleric acid",
    'aoda': "**Unknown**",
    'x': "**Unknown**",
    'foh-orn': "N5-formyl-N5-hydroxyornithine",
    'para-aminobenzoic acid': 'para-aminobenzoic acid',
    'anthranilic acid': 'anthranilic acid',
    'piperazic acid': 'piperazic acid',
    'd-pipecolic acid': 'D-pipecolic acid',
    'coumaric acid': 'coumaric acid',
    'pyrrole-2-carboxylic acid': 'pyrrole-2-carboxylic acid',
    'nicotinic acid': 'nicotinic acid',
    '(e)-4-methylhex-2-enoic acid': '(E)-4-methylhex-2-enoic acid', 
    '1-aminocyclopropane-1-carboxylic acid': '1-aminocyclopropane-1-carboxylic acid',
    '1-pyrroline-5-carboxylic acid': '1-pyrroline-5-carboxylic acid', 
    '2-(1-methylcyclopropyl)-d-glycine': '2-(1-methylcyclopropyl)-D-glycine',
    '2-amino-3-hydroxycyclopent-2-enone': '2-amino-3-hydroxycyclopent-2-enone',
    '2-amino-6-hydroxy-4-methyl-8-oxodecanoic acid': '2-amino-6-hydroxy-4-methyl-8-oxodecanoic acid',
    '2-aminoisobutyric acid': '2-aminoisobutyric acid', 
    '2-carboxy-6-hydroxyoctahydroindole': '2-carboxy-6-hydroxyoctahydroindole', 
    '2-chlorobenzoic acid': '2-chlorobenzoic acid', 
    '2-ethyl-3-aminoproprionic acid': '2-ethyl-3-aminoproprionic acid', 
    '2-hydroxy-4-methylpentanoic acid': '2-hydroxy-4-methylpentanoic acid', 
    '2-hydroxypent-4-enoic acid': '2-hydroxypent-4-enoic acid', 
    '2-ketoglutaric acid': '2-ketoglutaric acid', 
    '2-ketoisocaproic acid': '2-ketoisocaproic acid', 
    '2-ketoisovaleric acid': '2-ketoisovaleric acid', 
    '2-methylserine': '2-methylserine', 
    '2-sulfamoylacetic acid': '2-sulfamoylacetic acid', 
    '2r-hydroxy-3-methylpentanoic acid': '2R-hydroxy-3-methylpentanoic acid', 
    '2r-hydroxyisovaleric acid': '2R-hydroxyisovaleric acid', 
    '2s-amino-8-oxodecanoic acid': '2S-amino-8-oxodecanoic acid', 
    '2s-aminodecanoic acid': '2S-aminodecanoic acid', 
    '2s-aminododecanoic acid': '2S-aminododecanoic acid', 
    '2s-aminooctanoic acid': '2S-aminooctanoic acid', 
    '2s-hydroxyisocaproic acid': '2S-hydroxyisocaproic acid', 
    '2s-hydroxyisovaleric acid': '2S-hydroxyisovaleric acid', 
    '2s-methyl-3-oxobutyrine': '2S-methyl-3-oxobutyrine', 
    '3-(2-nitrocyclopropylalanine)': '3-(2-nitrocyclopropylalanine)', 
    '3-(3-pyridyl)-alanine': '3-(3-pyridyl)-alanine', 
    '3-amino-4-hydroxybenzoic acid': '3-amino-4-hydroxybenzoic acid', 
    '3-amino-6-hydroxy-2-piperidone': '3-amino-6-hydroxy-2-piperidone', 
    '3-aminoisobutyric acid': '3-aminoisobutyric acid', 
    '3-chlorotyrosine': '3-chlorotyrosine', 
    '3-hydroxy-4-methylproline': '3-hydroxy-4-methylproline', 
    '3-hydroxy-4-o-methyl-5-methyl-tyrosine': '3-hydroxy-4-o-methyl-5-methyl-tyrosine', 
    '3-hydroxy-o-methyl-5-methyltyrosine': '3-hydroxy-O-methyl-5-methyltyrosine', 
    '3-hydroxy-o-methyltyrosine': '3-hydroxy-O-methyltyrosine', 
    '3-hydroxy-para-aminobenzoic acid': '3-hydroxy-para-aminobenzoic acid', 
    '3-hydroxyasparagine': '3-hydroxyasparagine', 
    '3-hydroxyaspartic acid': '3-hydroxyaspartic acid', 
    '3-hydroxyglutamine': '3-hydroxyglutamine', 
    '3-hydroxykynurenine': '3-hydroxykynurenine', 
    '3-hydroxyleucine': '3-hydroxyleucine', 
    '3-hydroxypicolinic acid': '3-hydroxypicolinic acid', 
    '3-hydroxyquinaldic acid': '3-hydroxyquinaldic acid', 
    '3-hydroxytyrosine': '3-hydroxytyrosine', 
    '3-hydroxyvaline': '3-hydroxyvaline', 
    '3-methoxyanthranilic acid': '3-methoxyanthranilic acid', 
    '3-methoxyaspartic acid': '3-methoxyaspartic acid', 
    '3-methylasparagine': '3-methylasparagine', 
    '3-methylaspartic acid': '3-methylaspartic acid', 
    '3-methylglutamic acid': '3-methylglutamic acid', 
    '3-nitrotyrosine': '3-nitrotyrosine', 
    '3r-chloroproline': '3R-chloroproline', 
    '3r-hydroxyasparagine': '3R-hydroxyasparagine', 
    '3r-hydroxyaspartic acid': '3R-hydroxyaspartic acid', 
    '3r-hydroxyhomotyrosine': '3R-hydroxyhomotyrosine', 
    '3r-hydroxyleucine': '3R-hydroxyleucine', 
    '3r-methyl-d-aspartic acid branched': '3R-methyl-D-aspartic acid branched', 
    '3r-methylbeta-alanine': '3R-methylbeta-alanine', 
    '3r-methylglutamic acid': '3R-methylglutamic acid', 
    '3s-aminobutyric acid': '3S-aminobutyric acid', 
    '3s-cyclohex-2-enylalanine': '3S-cyclohex-2-enylalanine', 
    '3s-hydroxy-4s-methylproline': '3S-hydroxy-4S-methylproline', 
    '3s-hydroxy-6-chlorohistidine': '3S-hydroxy-6-chlorohistidine', 
    '3s-hydroxyasparagine': '3S-hydroxyasparagine', 
    '3s-hydroxyleucine': '3S-hydroxyleucine', 
    '3s-hydroxypipecolic acid': '3S-hydroxypipecolic acid', 
    '3s-hydroxyproline': '3S-hydroxyproline', 
    '3s-methyl-d-aspartic acid branched': '3S-methyl-D-aspartic acid branched', 
    '3s-methylaspartic acid': '3S-methylaspartic acid', 
    '3s-methylleucine': '3S-methylleucine', 
    '3s-methylproline': '3S-methylproline', 
    '4-acetamidopyrrole-2-carboxylic acid': '4-acetamidopyrrole-2-carboxylic acid', 
    '4-amino-2-hydroxy-3-isopropoxybenzoic acid': '4-amino-2-hydroxy-3-isopropoxybenzoic acid', 
    '4-aminobutyric acid': '4-aminobutyric acid', 
    '4-aminophenylalanine': '4-aminophenylalanine', 
    '4-chlorobenzoic acid': '4-chlorobenzoic acid', 
    '4-hydroxy-3-nitrobenzoic acid': '4-hydroxy-3-nitrobenzoic acid', 
    '4-hydroxy-d-kynurenine': '4-hydroxy-D-kynurenine', 
    '4-hydroxy-tetrahydropyridazine-3-carboxylic acid': '4-hydroxy-tetrahydropyridazine-3-carboxylic acid', 
    '4-hydroxybenzoic acid': '4-hydroxybenzoic acid', 
    '4-hydroxyglutamine': '4-hydroxyglutamine', 
    '4-hydroxyphenylpyruvic acid': '4-hydroxyphenylpyruvic acid', 
    '4-methoxytryptophan': '4-methoxytryptophan', 
    '4-methylproline': '4-methylproline', 
    '4-nitrotryptophan': '4-nitrotryptophan', 
    '4r-e-butenyl-4r-methylthreonine': '4R-E-butenyl-4R-methylthreonine', 
    '4r-hydroxyproline': '4R-hydroxyproline', 
    '4r-methylproline': '4R-methylproline', 
    '4r-propylproline': '4R-propylproline', 
    '4s-acetyl-5s-methylproline': '4S-acetyl-5S-methylproline', 
    '4s-hydroxylysine': '4S-hydroxylysine', 
    '4s-methylazetidine-2s-carboxylic acid': '4S-methylazetidine-2S-carboxylic acid', 
    '4s-methylproline': '4S-methylproline', 
    '4s-propenylproline': '4S-propenylproline', 
    '5-aminolevulinic acid': '5-aminolevulinic acid', 
    '5-chloroanthranilic acid': '5-chloroanthranilic acid', 
    '5-chlorotryptophan': '5-chlorotryptophan', 
    '5-methoxytyrosine': '5-methoxytyrosine', 
    '5-methylorsellinic acid': '5-methylorsellinic acid', 
    '5s-methylproline': '5S-methylproline', 
    '5‐chloropyrrole‐2‐carboxylic acid': '5‐chloropyrrole‐2‐carboxylic acid', 
    '5‐chloro‐1‐hydroxypyrrole‐2‐carboxylic acid': '5‐chloro‐1‐hydroxypyrrole‐2‐carboxylic acid', 
    '6-chloro-4-hydroxy-1-methyl-indole-3-carboxylic acid': '6-chloro-4-hydroxy-1-methyl-indole-3-carboxylic acid', 
    '6-chloro-4-hydroxyindole-3-carboxylic acid': '6-chloro-4-hydroxyindole-3-carboxylic acid', 
    '6-chlorotryptophan': '6-chlorotryptophan', 
    '6-hydroxy-tetrahydro-isoquinoline-3-carboxylic acid': '6-hydroxy-tetrahydro-isoquinoline-3-carboxylic acid', 
    '6-methylsalicylic acid': '6-methylsalicylic acid', 
    '6s-methyl-pipecolic acid': '6S-methyl-pipecolic acid', 
    'an acid hydrazine polyene (intermediate 14)': 'An acid hydrazine polyene (intermediate 14)', 
    'compound 4 (formed by the decarboxylative condensation of l-phe and succinyl-coa)': 'Compound 4 (formed by the decarboxylative condensation of L-Phe and succinyl-CoA)', 
    'd-alanine': 'D-alanine', 
    'd-aspartic acid branched': 'D-aspartic acid branched', 
    'd-glutamic acid branched': 'D-glutamic acid branched', 
    'd-leucine': 'D-leucine', 
    'd-phenylalanine': 'D-phenylalanine', 
    'd-phenyllactic acid': 'D-phenyllactic acid', 
    'n-(1-methyl)-tryptophan': 'N-(1-methyl)-tryptophan', 
    'n-(1-propargyl)-tryptophan': 'N-(1-propargyl)-tryptophan', 
    'n-formylglycine': 'N-formylglycine', 
    'n-hydroxyvaline': 'N-hydroxyvaline', 
    'n1-methoxytryptophan': 'N1-methoxytryptophan', 
    'n5-acetyl-n5-hydroxyornithine': 'N5-acetyl-N5-hydroxyornithine', 
    'n5-cis-anhydromevalonyl-n5-hydroxyornithine': 'N5-cis-anhydromevalonyl-N5-hydroxyornithine', 
    'n5-trans-anhydromevalonyl-n5-hydroxyornithine': 'N5-trans-anhydromevalonyl-N5-hydroxyornithine', 
    'n6-hydroxylysine': 'N6-hydroxylysine', 
    'o-methylthreonine': 'O-methylthreonine', 
    'o-methyltyrosine': 'O-methyltyrosine', 
    'r-3-hydroxy-3-methylproline': 'R-3-hydroxy-3-methylproline', 
    'r-aza-beta-tyrosine': 'R-aza-beta-tyrosine', 
    'r-beta-hydroxyphenylalanine': 'R-beta-hydroxyphenylalanine', 
    'r-beta-hydroxytyrosine': 'R-beta-hydroxytyrosine', 
    'r-beta-methylphenylalanine': 'R-beta-methylphenylalanine', 
    'r-beta-methyltryptophan': 'R-beta-methyltryptophan', 
    'r-beta-phenylalanine': 'R-beta-phenylalanine', 
    'r-beta-tyrosine': 'R-beta-tyrosine', 
    's-adenosylmethionine': 'S-adenosylmethionine', 
    's-beta-hydroxycyclohex-2s-enylalanine': 'S-beta-hydroxycyclohex-2S-enylalanine', 
    's-beta-hydroxyenduracididine': 'S-beta-hydroxyenduracididine', 
    's-beta-hydroxyphenylalanine': 'S-beta-hydroxyphenylalanine', 
    's-beta-tyrosine': 'S-beta-tyrosine', 
    'z-dehydroaminobutyric acid': 'Z-dehydroaminobutyric acid', 
    'z-dehydrotyrosine': 'Z-dehydrotyrosine', 
    'acetic acid': 'acetic acid', 
    'alpha-ketoisocaproic acid': 'alpha-ketoisocaproic acid', 
    'aspartic acid branched': 'aspartic acid branched', 
    'azetidine-2-carboxylic acid': 'azetidine-2-carboxylic acid', 
    'benzoic acid': 'benzoic acid', 
    'benzoxazolinate': 'benzoxazolinate', 
    'beta-hydroxy-3-hydroxy-o-methyl-5-methyltyrosine': 'beta-hydroxy-3-hydroxy-O-methyl-5-methyltyrosine', 
    'beta-hydroxyarginine': 'beta-hydroxyarginine', 
    'beta-hydroxyphenylalanine': 'beta-hydroxyphenylalanine', 
    'beta-hydroxytyrosine': 'beta-hydroxytyrosine', 
    'betaine': 'betaine', 
    'butyric acid': 'butyric acid', 
    'cinnamic acid': 'cinnamic acid', 
    'citrulline': 'citrulline', 
    'cysteic acid': 'cysteic acid', 
    'cysteine branched': 'cysteine branched', 
    'decanoic acid': 'decanoic acid', 
    'dehydroarginine': 'dehydroarginine', 
    'dehydrophenylalanine': 'dehydrophenylalanine', 
    'dehydrotryptophan': 'dehydrotryptophan', 
    'dehydrovaline': 'dehydrovaline', 
    'dimethylsulfoniopropionic acid': 'dimethylsulfoniopropionic acid', 
    'enduracididine': 'enduracididine', 
    'fatty acid': 'fatty acid', 
    'glycolic acid': 'glycolic acid', 
    'graminine': 'graminine', 
    'guanidinoacetic acid': 'guanidinoacetic acid', 
    'homophenylalanine': 'homophenylalanine', 
    'homoserine': 'homoserine', 
    'homotyrosine': 'homotyrosine', 
    'hydroxyphenylglycine': 'hydroxyphenylglycine', 
    'hydroxyproline': 'hydroxyproline', 
    'isoquinoline-3-carboxylic acid': 'isoquinoline-3-carboxylic acid', 
    'isovaleric acid': 'isovaleric acid', 
    'kynurenine': 'kynurenine', 
    'l-piperazic acid': 'l-piperazic acid', 
    'lactic acid': 'lactic acid', 
    'linoleic acid': 'linoleic acid', 
    'malic acid': 'malic acid', 
    'meta-tyrosine': 'meta-tyrosine', 
    'norcoronamic acid': 'norcoronamic acid', 
    'p-hydroxymandelate': 'p-hydroxymandelate', 
    'pentanoic acid': 'pentanoic acid', 
    'phenylpyruvic acid': 'phenylpyruvic acid', 
    'pyruvic acid': 'pyruvic acid', 
    'quinoxaline-2-carboxylic acid': 'quinoxaline-2-carboxylic acid', 
    'succinic semialdehyde': 'succinic semialdehyde', 
    'succinyl-hydrazinoacetic acid': 'succinyl-hydrazinoacetic acid', 
    'trans-2-crotylglycine': 'trans-2-crotylglycine' 
};

const NAME_TO_STRUCTURE = {
    "methylmalonyl_coa": "CC(C(O)=O)C(S)=O",
    "malonyl_coa": "OC(=O)CC(S)=O",
    'methoxymalonyl_coa': "SC(=O)C(C(=O)O)OC)O",
    'ethylmalonyl_coa': "CC(CC(O)=O)C(S)=O",
}; 

const PKS_SUBSTRATES = Object.keys(NAME_TO_STRUCTURE);

const TRANS_AT_KS_SUBTYPES = {
    ' Beta Keto groups.': 'BETA_OH_KETO',
    'Acetyl groups as the starting building block of the polyketide.': 'ACST',
    'Alpha hydroxy groups, beta keto group': 'ALPHA_OH',
    'Alpha-L-groups in conjunction with beta-D-hydroxyl groups.': 'ALPHAME_BETA_D_OH',
    'Alpha-hydroxyl groups in conjunction with beta-hydroxyl groups.': 'ALPHABETA_OH',
    'Alpha-methyl groups in conjunction with beta-L-hydroxyl groups.': 'ALPHAME_BETA_L_OH',
    'Alpha-methyl groups in conjunction with beta-hydroxyl groups.': 'ALPHAME_BETAOH',
    'Alpha-methyl groups with E-configured double bonds.': 'ALPHAME_EDB',
    'Alpha-methyl groups with Z-configured double bonds.': 'ALPHAME_ZDB',
    'Alpha-methyl groups with beta-gamma-double bonds.': 'ALPHA_D_ME_SHDB',
    'Alpha-methyl groups with double bonds.': 'ALPHAME_DB',
    'Alpha-methyl groups with either a reduced bond or a beta-gamma-double bond.': 'ALPHAME',
    'Amidated amino acid starters. Amide groups are introduced by a dedicated aminotransferase.': 'ST',
    'Amino acids containing oxazole or thiazole rings introduced by the NRPS module upstream.': 'OXA',
    'Aromatic rings as the starting building block of the polyketide.': 'ARST',
    'Beta-D-hydroxyl groups.': 'BETA_D_OH',
    'Beta-L-hydroxyl groups.': 'BETA_L_OH',
    'Beta-gamma-double bonds.': 'SHDB',
    'Beta-hydroxy E-double bond': 'BETA_OH_EDB',
    'Beta-hydroxyl groups.': 'BETA_OH',
    'Beta-keto groups.': 'KETO',
    'Beta-methoxy groups.': 'BETA_D_OME',
    'Beta-methyl groups with double bonds.': 'BETA_MEDB',
    'Double bonds of various configurations.': 'DB',
    'E-configured double bonds.': 'EDB',
    'Either beta-exomethylene groups or reduced beta-methyl groups, depending on the module composition upstream.': 'BETA_ME',
    'Exomethylene groups.': 'EXOMETHYLENE',
    'Glycine introduced by the NRPS module upstream.': 'AA',
    'Lactate as the starting building block of the polyketide.': 'LACST',
    'Methoxycarbonyl units as the starting building block of the polyketide.': 'MEOST',
    'Non-elongating KS with keto groups': 'NON_ELONGATING_OXA',
    'Non-elongating KS with specifity for pyran or furan rings.': 'NON_ELONGATING_PYR',
    'Non-elongating with alpha-methyl groups and E-double bonds.': 'NON_ELONGATING_ALPHAME_EDB',
    'Non-elongating with beta-L-hydroxy groups.': 'NON_ELONGATING_BETA_L_OH',
    'Non-elongating with beta-hydroxy groups.': 'NON_ELONGATING_BETA_OH',
    'Non-elongating with double bonds.': 'NON_ELONGATING_DB',
    'Phosphoglycerate-derived molecules as the starting building block of the polyketide.': 'UNST',
    'Pyran or furan rings, depending on the presence of an in-trans-acting hydroxylases two modules upstream.': 'PYR',
    'Reduced bonds.': 'RED',
    'Shifted double bond.': 'RED_SHDB',
    'Substrates with inserted oxygen, oftentimes resulting in oxidative cleaving.': 'OXI',
    'This type is elongating, but the substrate specificity cannot be predicted.': 'MISCELLANEOUS',
    'This type is in an out group.': 'OUT',
    'This type is specific for vinylogous chain branching.': 'BR',
    'When without a suffix, this type is non-elongating, but the substrate specificity cannot be predicted.': 'NON_ELONGATING',
    'Z-Double bonds': 'ZDB',
    'Alpha-methyl groups with keto groups.': 'ALPHAME_KETO',
    'Alpha-methyl groups with beta-gamma-double bonds. (unsuffixed)': 'ALPHAME_SHDB',
    'Beta-L-methoxy groups.': 'BETA_L_OME',
    'Beta-methoxy groups (unspecified stereochemistry).': 'BETA_OME',
    'Non-elongating with amino acids introduced upstream.': 'NON_ELONGATING_AA',
    'Non-elongating, acetyl starter.': 'NON_ELONGATING_ACST',
    'Non-elongating with alpha/beta-hydroxyl groups.': 'NON_ELONGATING_ALPHABETA_OH',
    'Non-elongating with alpha-methyl groups.': 'NON_ELONGATING_ALPHAME',
    'Non-elongating with alpha-methyl and beta-hydroxyl groups.': 'NON_ELONGATING_ALPHAME_BETAOH',
    'Non-elongating with alpha-methyl and beta-D-hydroxyl groups.': 'NON_ELONGATING_ALPHAME_BETA_D_OH',
    'Non-elongating with alpha-methyl and beta-L-hydroxyl groups.': 'NON_ELONGATING_ALPHAME_BETA_L_OH',
    'Non-elongating with alpha-methyl groups and double bonds.': 'NON_ELONGATING_ALPHAME_DB',
    'Non-elongating with alpha-methyl and keto groups.': 'NON_ELONGATING_ALPHAME_KETO',
    'Non-elongating with alpha-methyl and beta-gamma-double bonds.': 'NON_ELONGATING_ALPHAME_SHDB',
    'Non-elongating with alpha-methyl and Z-configured double bonds.': 'NON_ELONGATING_ALPHAME_ZDB',
    'Non-elongating with alpha-D-methyl and beta-gamma-double bonds.': 'NON_ELONGATING_ALPHA_D_ME_SHDB',
    'Non-elongating with alpha-hydroxyl groups.': 'NON_ELONGATING_ALPHA_OH',
    'Non-elongating with aromatic starters.': 'NON_ELONGATING_ARST',
    'Non-elongating with Beta-D-hydroxyl groups.': 'NON_ELONGATING_BETA_D_OH',
    'Non-elongating with Beta-D-methoxy groups.': 'NON_ELONGATING_BETA_D_OME',
    'Non-elongating with Beta-L-methoxy groups.': 'NON_ELONGATING_BETA_L_OME',
    'Non-elongating with beta-methyl groups and double bonds.': 'NON_ELONGATING_BETA_ME',
    'Non-elongating with beta-methyl and double bonds.': 'NON_ELONGATING_BETA_MEDB',
    'Non-elongating with beta-hydroxy E-double bonds.': 'NON_ELONGATING_BETA_OH_EDB',
    'Non-elongating with beta-hydroxy keto groups.': 'NON_ELONGATING_BETA_OH_KETO',
    'Non-elongating with beta-methoxy groups (unspecified stereochemistry).': 'NON_ELONGATING_BETA_OME',
    'Non-elongating specific for vinylogous chain branching.': 'NON_ELONGATING_BR',
    'Non-elongating with E-configured double bonds.': 'NON_ELONGATING_EDB',
    'Non-elongating with exomethylene groups.': 'NON_ELONGATING_EXOMETHYLENE',
    'Non-elongating with keto groups.': 'NON_ELONGATING_KETO',
    'Non-elongating, lactate starter.': 'NON_ELONGATING_LACST',
    'Non-elongating, methoxyformyl starter.': 'NON_ELONGATING_MEOST',
    'Non-elongating, substrate specificity unknown.': 'NON_ELONGATING_MISCELLANEOUS',
    'Non-elongating with inserted oxygen (oxidation).': 'NON_ELONGATING_OXI',
    'Non-elongating with reduced bonds.': 'NON_ELONGATING_RED',
    'Non-elongating with shifted double bonds.': 'NON_ELONGATING_RED_SHDB',
    'Non-elongating with beta-gamma-double bonds.': 'NON_ELONGATING_SHDB',
    'Non-elongating with amidated amino acid starters.': 'NON_ELONGATING_ST',
    'Non-elongating with propionyl starter.': 'NON_ELONGATING_UNST',
    'Non-elongating with Z-configured double bonds.': 'NON_ELONGATING_ZDB'
};

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
        this.firstOpening = true;
    }

    init(recordData, details_data) {
        this.recordData = recordData;
        this.details_data = details_data;
        this.cluster_type = this.clusterTypeHandler.getClusterType(this.regionIndex, this. recordIndex, this.recordData)
        
        this.reload_site_with_genecluster();
    }

    async init_from_state(recordData, details_data, geneMatrix, BGC, regionIndex) {
        uiHandler.resetUI();
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
                svgHandler.updateIntermediateContainer("innerIntermediateContainer_precursor", raichu_output.precursor, "intermediate_drawing_precursor_terpene", "precursor_drawing");
                svgHandler.updateIntermediateContainer("innerIntermediateContainer_tailoredProduct", raichu_output.structureForTailoring, "intermediate_drawing_tailoring_terpene");
            }
        }
        if (this.cluster_type === "ripp") {
            if (document.getElementById("innerIntermediateContainer_tailoredProduct")) {
                svgHandler.updateIntermediateContainer("innerIntermediateContainer_tailoredProduct", raichu_output.structureForTailoring, "intermediate_drawing_tailoring_ripp");
                svgHandler.updateIntermediateContainer("innerIntermediateContainer_precursor", raichu_output.rawPeptideChain, "intermediate_drawing_precursor", "precursor_drawing");
                if (document.getElementById("wildcardProtease").checked) {
                    svgHandler.updateIntermediateContainer("innerIntermediateContainer_cleavedProduct_space", raichu_output.svg, "intermediate_drawing_cleavage", "cleavedProduct");
                }
            }
        }


    }

    reload_site_with_genecluster() {
        this.createButtonsForEachRegion();
        uiHandler.resetUI();
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
        newRefreshButton.addEventListener('click', () => this.geneMatrixHandler.reloadGeneClusterForce());
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
        let regionsBar = document.getElementById("regionsBar");
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
       
        uiHandler.resetUI();
        this.addButtonListeners()

        this.BGC = regionHandler.getBGC(this.recordIndex, this.regionIndex, this.recordData, this.details_data);
        this.geneMatrixHandler = new GeneMatrixHandler(this.BGC, this.details_data, this.regionName, cluster_type, this.regionIndex, this.recordData);
        uiHandler.addRiPPPrecursorOptions(this.geneMatrixHandler);
        if (!this.geneMatrixHandler.getDefaultOrientation() && this.firstOpening) {
            this.firstOpening = false;
            const newReverseButton = document.getElementById("reverse_button");
            newReverseButton.click();
            return;
        }
        this.geneMatrixHandler.tailoringArray = this.geneMatrixHandler.findTailoringReactions();
        this.geneMatrixHandler.createGeneMatrix()
        console.log("gene matrix", JSON.stringify(this.geneMatrixHandler.geneMatrix));

        uiHandler.setGeneMatrixHandler(this.geneMatrixHandler);
        let result = this.geneMatrixHandler.extractAntismashPredictionsFromRegion();
        uiHandler.updateUI(this.geneMatrixHandler);
        uiHandler.addDragDrop();
       


        //this.addButtonListeners()
        if (result){
            

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
                    svgHandler.updateIntermediateContainer("innerIntermediateContainer_precursor", raichu_output.precursor, "intermediate_drawing_precursor_terpene", "precursor_drawing");
                    svgHandler.updateIntermediateContainer("innerIntermediateContainer_tailoredProduct", raichu_output.structureForTailoring, "intermediate_drawing_tailoring_terpene");
                }
            }
            if (this.cluster_type === "ripp") {
                if (document.getElementById("innerIntermediateContainer_tailoredProduct")) {
                    svgHandler.updateIntermediateContainer("innerIntermediateContainer_tailoredProduct", raichu_output.structureForTailoring, "intermediate_drawing_tailoring_ripp");
                    svgHandler.updateIntermediateContainer("innerIntermediateContainer_precursor", raichu_output.rawPeptideChain, "intermediate_drawing_precursor", "precursor_drawing");
                    if (document.getElementById("wildcardProtease").checked) {
                        svgHandler.updateIntermediateContainer("innerIntermediateContainer_cleavedProduct_space", raichu_output.svg, "intermediate_drawing_cleavage", "cleavedProduct");
                    }
                }
            }

        }
        else {

            if (this.geneMatrixHandler.cluster_type === "terpene") {
                uiHandler.openFormTerpene();
                
            }
            if (this.cluster_type === "ripp") {
                if (document.getElementById("innerIntermediateContainer_tailoredProduct")) {
                    svgHandler.updateIntermediateContainer("innerIntermediateContainer_tailoredProduct", raichu_output.structureForTailoring, "intermediate_drawing_tailoring_ripp");
                    svgHandler.updateIntermediateContainer("innerIntermediateContainer_precursor", raichu_output.rawPeptideChain, "intermediate_drawing_precursor", "precursor_drawing");
                    if (document.getElementById("wildcardProtease").checked) {
                        svgHandler.updateIntermediateContainer("innerIntermediateContainer_cleavedProduct_space", raichu_output.svg, "intermediate_drawing_cleavage", "cleavedProduct");
                    }
                }
            }


            else {

        }
            this.geneMatrixHandler.updateHistory(this.geneMatrixHandler.geneMatrix, this.geneMatrixHandler.BGC);



    }}

    async reverseBGC() {
        if (this.reversed) {
            this.runAlola();
        } else {
            this.reversed = true;
            this.BGC = regionHandler.getReversedBGC(this.recordIndex, this.regionIndex, this.details_data, this.recordData);
            this.regionName = regionHandler.getRegionName(this.regionIndex, this.recordIndex, this.recordData);
            let cluster_type = this.clusterTypeHandler.getClusterType(this.regionIndex, this.recordIndex, this.recordData);
            this.geneMatrixHandler = new GeneMatrixHandler(this.BGC, this.details_data, this.regionName, cluster_type, this.regionIndex, this.recordData);
            this.geneMatrixHandler.createGeneMatrix()
            this.geneMatrixHandler.extractAntismashPredictionsFromRegion();
            uiHandler.updateUI(this.geneMatrixHandler);
            uiHandler.addRiPPPrecursorOptions(this.geneMatrixHandler);

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
        this.firstOpening = true;
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
        this.checkUserId()

    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.loadDataFromURL();
        document.getElementById('uploadButton').addEventListener('click', () => this.fileHandler.triggerFileInput());
        document.getElementById('fileInput').addEventListener('change', (event) => this.handleFileSelection(event));
        document.getElementById('load_example_button').addEventListener('click', () => this.fileHandler.loadExampleFile());
        // document.getElementById('shareButton').addEventListener('click', () => this.downloadData());
        this.fileHandler.setupDropArea();
    }

    loadDataFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedData = urlParams.get('data');
        console.log('Encoded data:', encodedData);
        if (encodedData !== null) {
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

    downloadData() {
        const data = {
            recordData: this.record.recordData || 'No record data available',
            detailsData: this.record.detailsData || 'No details data available',
            currentGeneMatrix: this.record.geneMatrixHandler.GeneMatrix || null,
            currentBGC: this.record.geneMatrixHandler.BGC || null,
            regionIndex: this.record.regionIndex !== undefined ? this.record.regionIndex : null
        };

        // Convert data to JSON
        const jsonData = JSON.stringify(data);

        // Create a blob for the JSON data
        const blob = new Blob([jsonData], { type: 'application/json' });

        // Create a link element for downloading
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.json'; // Set the download file name

        // Programmatically click the link to trigger the download
        link.click();

        // Clean up the URL object
        URL.revokeObjectURL(link.href);
    }


    handleFileSelection(event) {
        const file = event.target.files[0];
        if (file) {
            this.fileHandler.readFile(file); // FileHandler will automatically call record.init after reading
        }}
    
    checkUserId(){
        // Extract 'user_id' from the URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('user_id'); // Get 'user_id' from the query string
        let data = null

        // If 'user_id' is present in the URL, fetch the data
        if (userId) {
            // Call the function with the user_id extracted from the URL
            data = apiService.fetchDataForUser(userId);
        }

    }
    
}

class UIHandler {
    constructor() {
        this.dragSrcEl = null;
        

    }

    resetUI() {
        document.getElementById("arrow_container").innerHTML = "";
        document.getElementById("gene_container").innerHTML = "";
        document.getElementById("protein_container").innerHTML = "";
        document.getElementById("domain_container").innerHTML = "";
        document.getElementById("structure_container").innerHTML = "";
        document.getElementById("molecular_mass_value").innerHTML = "";
        document.getElementById("sum_formula_value").innerHTML = "";
        document.getElementById("module_container").innerHTML = "";
        document.getElementById("model_gene_container").innerHTML = "";
        


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
        if (cluster_type === "nrpspks") {
            this.updateDomains(geneMatrixHandler);
        }
        else {
            this.displayNotImplemented();
        }
        
        geneMatrixHandler.addArrowClick();
    }

    addButtonListeners() {
        const buttonConfigs = [
            { id: 'impressum-button', handler: () => this.showImpressum() },
            { id: 'openAlolaManual', handler: () => { window.location.href = './Alola_Manual.html'; } },
            { id: 'add_module_button', handler: () => this.openWildcardModuleForm() },
            { id: 'openNRPSForm', handler: () => { this.openNRPSForm(); this.closeWildcardModuleForm(); } },
            { id: 'openPKSForm', handler: () => { this.openPKSForm(); this.closeWildcardModuleForm(); } },
            { id: 'closeMainForm', handler: () => this.closeWildcardModuleForm() },
            { id: 'add_tailoring_enzyme_button', handler: () => this.openTailoringForm() },
            { id: 'ripp_button', handler: () => this.openRiPPForm() },
            { id: 'addRiPPButton', handler: () => { this.geneMatrixHandler.addRiPP(); this.closeRiPPForm(); } },
            { id: 'cancelRiPPButton', handler: () => this.closeRiPPForm() },
            { id: 'submitTerpeneButton', handler: () => { this.geneMatrixHandler.reloadGeneCluster(); this.closeFormTerpene(); } },
            { id: 'closeTerpeneButton', handler: () => this.closeFormTerpene() },
            { id: 'save_biosynthetic_model_button', handler: () => this.PrintDiv() }
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

    PrintDiv() {
        /**
         * Download biosynthetic_model
         * Transforms biosynthetic_model div to remove hidden areas, transforms it to canvas, and download a PNG of it
         * @fires   save_biosynthetic_model_button
         */
        (async () => {
            // Get references to the div elements
            let div = document.getElementById("outerDomainExplorer");
            let outer_div = document.getElementById("Domain_explorer");
            // Set class to indicate that saving is in progress
            div.setAttribute("class", "outerDomainExplorer_while_saving");
            // Use html2canvas to capture the content of the div as a canvas
            const canvas = await html2canvas(div, { scale: 5 });
            // Reset the class to its original state
            div.setAttribute("class", "outerDomainExplorer");
            // Convert canvas content to a data URL representing the PNG image
            var myImage = canvas.toDataURL();
            // Download the PNG image
            this.downloadURI(myImage, "biosynthetic_model.png");
        })();
    }

    downloadURI(uri, name) {
        /**
         * Creates a link to download the PNG
         * @fires   PrintDiv
         */
        // Create a link element
        var link = document.createElement("a");
        // Set the download attribute and the URL
        link.download = name;
        link.href = uri;

        // Append the link to the document
        document.body.appendChild(link);
        // Trigger a click on the link to start the download
        link.click();
        // After creating the link, delete the dynamic link
        this.clearDynamicLink(link);
    }

    clearDynamicLink(link) {
        // Remove the link from the document
        document.body.removeChild(link);
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

    addRiPPPrecursorOptions(geneMatrixHandler) {
        const precursorContainer = document.getElementById("ripp_precursor_selection");
        if (!precursorContainer) {
            console.error("RiPP precursor selection container not found");
            return;
        }

        // Clear existing content
        precursorContainer.innerHTML = '';

        // Create a document fragment to improve performance
        const fragment = document.createDocumentFragment();

        geneMatrixHandler.geneMatrix.forEach((gene, geneIndex) => {
            const button = document.createElement('button');
            button.className = 'wildcardsubstrate';
            button.type = 'button';

            const id = gene.id.replace(".", "_");
            button.id = `${id}_ripp_button`;
            button.textContent = id;

            // Add event listener
            button.addEventListener('click', () => geneMatrixHandler.setRiPPPrecursor(geneIndex));
            button.addEventListener('mouseover', () => geneMatrixHandler.handleTailoringEnzymeMouseEnter(gene, geneIndex));
            button.addEventListener('mouseout', () => geneMatrixHandler.handleTailoringEnzymeMouseLeave(gene, geneIndex));
            fragment.appendChild(button);
        });

        // Append all buttons at once
        precursorContainer.appendChild(fragment);
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
        $("#Domain_container").html(RiPPer.drawCluster(geneMatrix, proteaseOptions, 90, 600, cleavageSites, geneMatrixHandler));

    }

    updateTerpenes(geneMatrixHandler) {

        $("#Domain_container").html(Terpener.drawCluster(geneMatrixHandler.geneMatrix, 90, 300, geneMatrixHandler.terpeneCyclaseOptions, geneMatrixHandler));

    }

    displayNotImplemented() {
        $("#Domain_container").innerHTML = "<h1>Not implemented yet, if gene cluster is a RiPP genecluster, press the 'RiPP BGC' button. </h1>";
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
        this.refreshDragDropListeners();
    }

    refreshDragDropListeners() {
        const items = document.querySelectorAll('.protein-container .box');
        items.forEach(item => {
            // Remove old listeners
            item.removeEventListener('dragstart', this.handleDragStart);
            item.removeEventListener('dragenter', this.handleDragEnter);
            item.removeEventListener('dragover', this.handleDragOver);
            item.removeEventListener('dragleave', this.handleDragLeave);
            item.removeEventListener('drop', this.handleDrop);
            item.removeEventListener('dragend', this.handleDragEnd);

            // Add new listeners
            item.addEventListener('dragstart', this.handleDragStart.bind(this));
            item.addEventListener('dragenter', this.handleDragEnter.bind(this));
            item.addEventListener('dragover', this.handleDragOver);
            item.addEventListener('dragleave', this.handleDragLeave);
            item.addEventListener('drop', this.handleDrop.bind(this));
            item.addEventListener('dragend', this.handleDragEnd);
        });
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

        const dropTarget = e.target.closest('.box');
        if (!dropTarget) return false;

        if (this.dragSrcEl !== dropTarget) {
            const locusTagDragged = this.dragSrcEl.id.substring(21);
            const locusTagTarget = dropTarget.id.substring(21);

            if (this.geneMatrixHandler && typeof this.geneMatrixHandler.handleGenePositionUpdate === 'function') {
                this.geneMatrixHandler.handleGenePositionUpdate(locusTagDragged, locusTagTarget);
                this.geneMatrixHandler.reloadGeneCluster();
            } else {
                console.error('geneMatrixHandler or handleGenePositionUpdate is not available');
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

    openTab(event, tabName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";
        event.currentTarget.className += " active";
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
        let record_index = 0;
        for (const record of recordData) {
            for (let region_index = 0; region_index < record.regions.length; region_index++) {
                return [region_index, record_index];
            }
            record_index++;
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
            const fileContent = event.target.result;

            try {
                // Try parsing as JSON first
                const jsonData = JSON.parse(fileContent);
                if (jsonData.recordData && jsonData.detailsData) {
                    // Initialize record using JSON data
                    this.record = new Record();
                    if (jsonData.currentGeneMatrix && jsonData.currentBGC && jsonData.regionIndex !== undefined) {
                        this.record.init_from_state(
                            jsonData.recordData,
                            jsonData.detailsData,
                            jsonData.currentGeneMatrix,
                            jsonData.currentBGC,
                            jsonData.regionIndex
                        );
                    } else {
                        this.record.init(jsonData.recordData, jsonData.detailsData);
                    }
                    console.log("File loaded as JSON.");
                    return;
                }
                if (jsonData.recordData && jsonData.resultsData) {
                    // Initialize record using JSON data for AS 8
                    
                    this.record = new Record();
                    if (jsonData.currentGeneMatrix && jsonData.currentBGC && jsonData.regionIndex !== undefined) {
                        this.record.init_from_state(
                            jsonData.recordData,
                            jsonData.resultsData,
                            jsonData.currentGeneMatrix,
                            jsonData.currentBGC,
                            jsonData.regionIndex
                        );
                    } else {
                        this.record.init(jsonData.recordData, jsonData.resultsData);
                    }
                    console.log("File loaded as JSON.");
                    return;
                }
            } catch (jsonError) {
                console.log("File is not a valid JSON file");
            }

            // If JSON parsing fails, fallback to antiSMASH format
            const result = fileContent.split("var ");
            console.log(result.length)
            if (result.length == 5) {

                const recordDataString = result[1].replace("recordData = ", "").trim().slice(0, -1);
                const recordData = JSON.parse(recordDataString);
                const detailsDataString = result[3].replace("details_data = ", "").trim().slice(0, -1);
                const detailsData = JSON.parse(detailsDataString);

                this.record = new Record();
                this.record.init(recordData, detailsData);
                console.log("File loaded in antiSMASH 7 format.");
            }
            else if (result.length == 4){
                const recordDataString = result[1].replace("recordData = ", "").trim().slice(0, -1);
                const recordData = JSON.parse(recordDataString);
                const detailsDataString = result[3].replace("resultsData = ", "").trim().slice(0, -1);
                const detailsData = JSON.parse(detailsDataString);

                this.record = new Record();
                this.record.init(recordData, detailsData);
                console.log("File loaded in antiSMASH 8 format.");

            }
            else {
                const dropArea = document.getElementById('regionsBar');
                dropArea.innerHTML = "Input file is not a valid antiSMASH output or JSON file.";
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
            const inputFile = fileList[0];
            this.readFile(inputFile);
        });
    }
}


let svgHandler = new SVGHandler();
let apiService = new APIService(CONFIG.PORT, svgHandler);
let session = new ApplicationManager();
let regionHandler = new RegionHandler();
let uiHandler = new UIHandler();
uiHandler.addButtonListeners();

session.init();
document.getElementById("defaultOpen").click();
document.getElementById('modalButton').addEventListener('click', function () {
    document.getElementById('modal').classList.add('hidden');
});
document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.querySelector('input[type=checkbox]');
    if (checkbox) {
        checkbox.checked = true; // Automatically check the checkbox for the real time calculation
    }
});

