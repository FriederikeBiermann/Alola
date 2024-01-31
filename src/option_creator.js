// Mapping of keys and values for terpene cyclase subtypes
const TRANS_AT_KS_SUBTYPES = { ' Beta Keto groups.': 'BETA_OH_KETO', 'Acetyl groups as the starting building block of the polyketide.': 'ACST', 'Alpha hydroxy groups, beta keto group': 'ALPHA_OH', 'Alpha-L-methyl groups in conjunction with beta-D-hydroxyl groups.': 'ALPHAME_BETA_D_OH', 'Alpha-hydroxyl groups in conjunction with beta-hydroxyl groups.': 'ALPHABETA_OH', 'Alpha-methyl groups in conjunction with beta-L-hydroxyl groups.': 'ALPHAME_BETA_L_OH', 'Alpha-methyl groups in conjunction with beta-hydroxyl groups.': 'ALPHAME_BETAOH', 'Alpha-methyl groups with E-configured double bonds.': 'ALPHAME_EDB', 'Alpha-methyl groups with Z-configured double bonds.': 'ALPHAME_ZDB', 'Alpha-methyl groups with beta-gamma-double bonds.': 'ALPHA_D_ME_SHDB', 'Alpha-methyl groups with double bonds.': 'ALPHAME_DB', 'Alpha-methyl groups with either a reduced bond or a beta-gamma-double bond.': 'ALPHAME', 'Amidated amino acid starters. Amide groups are introduced by a dedicated aminotransferase.': 'ST', 'Amino acids containing oxazole or thiazole rings introduced by the NRPS module upstream.': 'OXA', 'Aromatic rings as the starting building block of the polyketide.': 'ARST', 'Beta-D-hydroxyl groups.': 'BETA_D_OH', 'Beta-L-hydroxyl groups.': 'BETA_L_OH', 'Beta-gamma-double bonds.': 'SHDB', 'Beta-hydroxy E-double bond': 'BETA_OH_EDB', 'Beta-hydroxyl groups.': 'BETA_OH', 'Beta-keto groups.': 'KETO', 'Beta-methoxy groups.': 'BETA_D_OME', 'Beta-methyl groups with double bonds.': 'BETA_MEDB', 'Double bonds of various configurations.': 'DB', 'E-configured double bonds.': 'EDB', 'Either beta-exomethylene groups or reduced beta-methyl groups, depending on the module composition upstream.': 'BETA_ME', 'Exomethylene groups.': 'EXOMETHYLENE', 'Glycine introduced by the NRPS module upstream.': 'AA', 'Lactate as the starting building block of the polyketide.': 'LACST', 'Methoxycarbonyl units as the starting building block of the polyketide.': 'MEOST', 'Non-elongating KS with keto groups': 'NON_ELONGATING_OXA', 'Non-elongating KS with specifity for pyran or furan rings.': 'NON_ELONGATING_PYR', 'Non-elongating with alpha-methyl groups and E-double bonds.': 'NON_ELONGATING_ALPHAME_EDB', 'Non-elongating with beta-L-hydroxy groups.': 'NON_ELONGATING_BETA_L_OH', 'Non-elongating with beta-hydroxy groups.': 'NON_ELONGATING_BETA_OH', 'Non-elongating with double bonds.': 'NON_ELONGATING_DB', 'Phosphoglycerate-derived molecules as the starting building block of the polyketide.': 'UNST', 'Pyran or furan rings, depending on the presence of an in-trans-acting hydroxylases two modules upstream.': 'PYR', 'Reduced bonds.': 'RED', 'Shifted double bond.': 'RED_SHDB', 'Substrates with inserted oxygen, oftentimes resulting in oxidative cleaving.': 'OXI', 'This type is elongating, but the substrate specificity cannot be predicted.': 'MISCELLANEOUS', 'This type is in an out group.': 'OUT', 'This type is specific for vinylogous chain branching.': 'BR', 'When without a suffix, this type is non-elongating, but the substrate specificity cannot be predicted.': 'NON_ELONGATING', 'Z-Double bonds': 'ZDB' };

// Utility function to add a string in front of every element in an array
function addStringToArray(string, array) {
  /**
 * Adds a string in front of every instance of the array

 * @input array and string that need to be attached
 * @yield new array
 */


  let new_array = array.map(function (value, index, array) {
    return string + value;
  });
  return new_array;
};

// Object for creating options related to terpene cyclase
var OptionCreator = {
  version: "1.0.0"
};

// Method to create options for terpene cyclase
OptionCreator.createOptionsTerpeneCyclase = (function(atomsForCyclisation = null, tailoringSites = null){
  options = {
    "Cyclization": atomsForCyclisation,
    "Isomerization": tailoringSites && tailoringSites['DOUBLE_BOND_SHIFT']
  };
  return options;
  });


OptionCreator.createOptionsDomains = (function (geneMatrix, atomsForCyclisation = null) {
  for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
    for (let domainIndex = 0; domainIndex < geneMatrix[geneIndex].domains.length; domainIndex++) {
      let domain = geneMatrix[geneIndex].domains[domainIndex];
      // add stereochemistry options for KR
      if (domain.hasOwnProperty("function")) {
        if (domain.abbreviation == "KR") {
          domain.default_option =domain.predictions[1][1];
          domain.domainOptions = ['Stereoselectivity: A1', 'Stereoselectivity: A2', 'Stereoselectivity: B1', 'Stereoselectivity: B2', 'Stereoselectivity: C1', 'Stereoselectivity: C2']
        }
      }
//add substrate specifities for NRPS
if (domain.abbreviation=="A") {
  domain.domainOptions = [...new Set(Object.values(aminoacids))];
  domain.default_option=aminoacids[domain.predictions[0][1].replace(
  "-", '').toLowerCase()];
}
//add substrate specifities for PKS

if (domain.abbreviation=="AT") {
domain.domainOptions=Object.keys(nameToStructure);
domain.default_option=domain.predictions[1][1].replace(
"-", '')
.toLowerCase();
}
       //add specifities for Trans-AT-KS

       if (domain.abbreviation == "KS" && domain.predictions.length != 0) {
         domain.domainOptions = Object.keys(TRANS_AT_KS_SUBTYPES);
         for (const [key,value] of Object.entries(TRANS_AT_KS_SUBTYPES)) {
           if (value == domain.predictions[0][1].toUpperCase().replace(/[-/]/g, "_")) {
            domain.default_option = key;
         }
      }   
    }

//add cyclisation options
       if (domain.abbreviation == "TE") {
         domain.domainOptions = addStringToArray("Cyclization at ", atomsForCyclisation);
         domain.domainOptions.push("Linear product");
         domain.default_option = null;
       }
     }
   }

});




// Create options for tailoring enzymes based on gene matrix and tailoring sites
OptionCreator.createOptionsTailoringEnzymes = (function (geneMatrix, tailoringSites) {
  // Define a mapping of tailoring enzyme types to specific reactions/sites
  let tailoringEnzymes_Reactions = {
    'METHYLTRANSFERASE': { 'METHYLTRANSFERASE': tailoringSites['METHYLTRANSFERASE'] },
    'C_METHYLTRANSFERASE': { 'C_METHYLTRANSFERASE': tailoringSites['C_METHYLTRANSFERASE'] },
    'N_METHYLTRANSFERASE': { 'N_METHYLTRANSFERASE': tailoringSites['N_METHYLTRANSFERASE'] },
    'O_METHYLTRANSFERASE': { 'O_METHYLTRANSFERASE': tailoringSites['O_METHYLTRANSFERASE'] },
    'P450': {
      'HYDROXYLATION': tailoringSites['HYDROXYLATION'],
      'OXIDATIVE_BOND_FORMATION': tailoringSites['OXIDATIVE_BOND_FORMATION'],
      'EPOXIDATION': tailoringSites['EPOXIDATION'],
      'DOUBLE_BOND_FORMATION': tailoringSites['DOUBLE_BOND_FORMATION'] 
    },
    'OXIDOREDUCTASE':{
      'DOUBLE_BOND_REDUCTION': tailoringSites['DOUBLE_BOND_REDUCTION'],
      'KETO_REDUCTION': tailoringSites['KETO_REDUCTION'],
      'HYDROXYLATION': tailoringSites['HYDROXYLATION'],
      'OXIDATIVE_BOND_FORMATION': tailoringSites['OXIDATIVE_BOND_FORMATION'],
      'EPOXIDATION': tailoringSites['EPOXIDATION'],
      'DOUBLE_BOND_FORMATION': tailoringSites['DOUBLE_BOND_FORMATION'] 
    },
    'REDUCTASE': {
      'DOUBLE_BOND_REDUCTION': tailoringSites['DOUBLE_BOND_REDUCTION'],
      'KETO_REDUCTION': tailoringSites['KETO_REDUCTION']
    },
    'ISOMERASE': { 'DOUBLE_BOND_SHIFT': tailoringSites['DOUBLE_BOND_SHIFT'] },
    'PRENYLTRANSFERASE': {
      'DIMETHYLALLYL': tailoringSites['PRENYLTRANSFERASE'],
      'GERANYL': tailoringSites['PRENYLTRANSFERASE'],
      'FARNESYL': tailoringSites['PRENYLTRANSFERASE'],
      'GERANYLGERANYL': tailoringSites['PRENYLTRANSFERASE'],
      'SQUALENE': tailoringSites['PRENYLTRANSFERASE'],
      'PHYTOENE': tailoringSites['PRENYLTRANSFERASE']
    },
    'ACETYLTRANSFERASE': { 'ACETYLTRANSFERASE': tailoringSites['ACETYLTRANSFERASE'] },
    'ACYLTRANSFERASE': { 'ACYLTRANSFERASE': tailoringSites['ACYLTRANSFERASE'] },
    'AMINOTRANSFERASE': { 'AMINOTRANSFERASE': tailoringSites['AMINOTRANSFERASE'] },
    'OXIDASE': { 'DOUBLE_BOND_FORMATION': tailoringSites['DOUBLE_BOND_FORMATION'] },
    'ALCOHOLE_DEHYDROGENASE': { 'ALCOHOLE_DEHYDROGENASE': tailoringSites['ALCOHOLE_DEHYDROGENASE'] },
    'DEHYDRATASE': { 'DEHYDRATASE': tailoringSites['DEHYDRATASE'] },
    'DECARBOXYLASE': { 'DECARBOXYLASE': tailoringSites['DECARBOXYLASE'] },
    'MONOAMINE_OXIDASE': { 'MONOAMINE_OXIDASE': tailoringSites['MONOAMINE_OXIDASE'] },
    'HALOGENASE': { 'Fl': tailoringSites['HALOGENASE'],
      'Cl': tailoringSites['HALOGENASE'],
      'I': tailoringSites['HALOGENASE'],
      'Br': tailoringSites['HALOGENASE'],
   },
    'PEPTIDASE': { 'PEPTIDASE': tailoringSites['PEPTIDASE'] },
    'PROTEASE': { 'PROTEASE': tailoringSites['PROTEASE'] }
  };

    // Iterate over geneMatrix to set options for tailoring enzymes
    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
    if (geneMatrix[geneIndex].tailoringEnzymeStatus == true){
      // Get keys for the current tailoring enzyme type
      let tailoringArrayKeys = Object.keys(tailoringEnzymes_Reactions[geneMatrix[geneIndex].tailoringEnzymeType]);
      
      // Filter and map values for the current tailoring enzyme type
      let tailoringArrayFiltered = {};
      for (const [key,value] of Object.entries(tailoringEnzymes_Reactions[geneMatrix[geneIndex].tailoringEnzymeType])) {
        if (JSON.stringify(value) === '[""]'){
            continue;
          }
        tailoringArrayFiltered[key] = value.map(function(item){return item.toString();});
      }
      
      // Create an empty array for tailoring options
      let emptyTailoringArray = {};
      for (const key of tailoringArrayKeys) {
        emptyTailoringArray[key] = []
      }

      // Set options for the current gene based on tailoring enzyme type
      geneMatrix[geneIndex].options = tailoringArrayFiltered;

      // Initialize an empty tailoring array for the current gene
      for (const key of tailoringArrayKeys){
          emptyTailoringArray[key]= [];
      }

      // Set default options for the current gene if selected options are empty
      if (geneMatrix[geneIndex].selected_option.length == 0){
        geneMatrix[geneIndex].selected_option = emptyTailoringArray;
        geneMatrix[geneIndex].default_option = emptyTailoringArray;
      }
    }
  }
});


//add options for cyclization
