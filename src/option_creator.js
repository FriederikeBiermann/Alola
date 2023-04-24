TRANS_AT_KS_SUBTYPES = { 'Gcn5-related n-acetyltransferase starter': 'ACST', 'Amino acids (glycine)': 'AA', 'Beta-hydroxyl or e-configured double bonds': 'BETA_OH_EDB', 'Non-elongating (beta-hydroxyl groups)': 'NON_ELOGATING_BETA_OH', 'Non-elongating (double bond before branching events)': 'NON_ELOGATING_BETA_OH', 'Beta-o-methyl groups': 'BETA_D_OME', 'Beta-methyl double bonds': 'BETA_ME', 'Reduced or shifted double bonds': 'RED_SHDB', 'Pyran or furan rings': 'PYR', 'Alpha-methyl beta-l-hydroxyl groups': 'ALPHAME_BETA_L_OH', 'Alpha-methyl e-configured double bonds': 'ALPHAME_EDB', 'Beta-l-hydroxyl groups': 'BETA_L_OH', 'Beta-keto groups': 'KETO', 'Double bonds or double bond starter': 'DB', 'Vinylogous chain branching': 'BR', 'Non-elongating (amino acids oxazole or thiazole rings)': 'NON_ELOGATING_OXA', 'Mostly alpha-hydroxyl beta-hydroxyl groups': 'ALPHABETA_OH', 'Beta-hydroxyl groups': 'BETA_OH', 'E-configured double bonds': 'EDB', 'Double bonds': 'DB', 'Lactate starter': 'LACST', 'Non-elongating (beta-l-hydroxyl groups)': 'NON_ELOGATING_BETA_L_OH', 'Beta-exomethylene or reduced beta-methyl groups': 'BETA_ME', 'Non-elongating (double bonds)': 'NON_ELOGATING_DB', 'Reduced with alpha-methyl or alpha-methyl beta-hydroxyl or alpha-methyl beta-keto groups': 'ALPHAME', 'Reduced with alpha-methyl or shifted double bonds with alpha-methyl groups': 'ALPHAME', 'Acetyl starter': 'ACST', 'Amino acids': 'AA', 'Non-elongating (beta-hydroxyl groups introduced by bimodules)': 'NON_ELOGATING_BETA_OH', 'Acetyl or aromatic starter': 'ST', 'Methoxycarbonyl starter': 'MEOST', 'Oxygen insertion': 'OXI', 'Non-elongating (pyran or furan rings)': 'NON_ELOGATING_PYR', 'Beta-hydroxyl or beta-keto groups': 'BETA_OH_KETO', 'Non-elongating (various substrate specificities)': 'NON_ELOGATING', 'Non-elongating (hemiacetal or beta-hydroxyl groups)': 'NON_ELOGATING_BETA_OH', 'Shifted double bonds': 'SHDB', 'Amino acids (oxazole or thiazole rings)': 'OXA', 'Z-configured double bonds': 'ZDB', 'Alpha-l-methyl beta-d-hydroxyl groups': 'ALPHAME_BETA_D_OH', 'Alpha-methyl beta-hydroxyl groups': 'ALPHAME_BETAOH', 'Phosphoglycerate-derived starter': 'UNST', 'Beta-d-hydroxyl groups': 'BETA_D_OH', 'Alpha-hydroxyl beta-hydroxyl groups': 'ALPHABETA_OH', 'Beta-methyl e-configured double bonds': 'BETA_MEDB', 'Mainly acetyl starter': 'ST', 'Amide-containing starters': 'ST', 'Non-elongating (alpha-methyl e-configured double bonds)': 'NON_ELOGATING_ALPHAME_EDB', 'Aromatic starter': 'ARST', 'Alpha-hydroxyl groups': 'ALPHA_OH' }
function addStringToArray(string, array) {
  /**
 * Adds a string in front of every instance of the array

 * @input array and string that need to be attached
 * @yield new array
 */


  let new_array = array.map(function (value, index, array) {
    return string + value;
  });
  return new_array
}
var OptionCreator = {
  version: "1.0.0"
};
OptionCreator.createOptionsTerpeneCyclase = (function(atomsForCyclisation = none, tailoringSites = none){
  options = {"Cyclization": atomsForCyclisation,
    "Isomerization": tailoringSites['DOUBLE_BOND_SHIFT']}
  return options
  
})
OptionCreator.createOptionsDomains = (function (geneMatrix, atomsForCyclisation = none) {
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
  domain.domainOptions=Object.values(aminoacids)
  domain.default_option=aminoacids[domain.predictions[0][1].replace(
  "-", '').toLowerCase()]
}
//add substrate specifities for PKS

if (domain.abbreviation=="AT") {
domain.domainOptions=Object.keys(nameToStructure)
domain.default_option=domain.predictions[1][1].replace(
"-", '')
.toLowerCase()
}
       //add specifities for Trans-AT-KS

       if (domain.abbreviation == "KS" && domain.predictions.length != 0) {
         domain.domainOptions = Object.keys(TRANS_AT_KS_SUBTYPES)
         for (const [key,value] of Object.entries(TRANS_AT_KS_SUBTYPES))
         {
           if (value == domain.predictions[0][1].toUpperCase().replaceAll("-", "_").replaceAll("/", "_"))
            domain.default_option = key
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

})
OptionCreator.createOptionsTailoringEnzymes = (function (geneMatrix, tailoringSites) {
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
    'ISOMERASE': { 'DOUBLE_BOND_SHIFT': tailoringSites['DOUBLE_BOND_SHIFT'], },
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
    'PROTEASE': { 'PROTEASE': tailoringSites['PROTEASE'] }}

  for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
    if (geneMatrix[geneIndex].tailoringEnzymeStatus == true){
      let tailoringArrayKeys = Object.keys(tailoringEnzymes_Reactions[geneMatrix[geneIndex].tailoringEnzymeType])
      let tayloringArrayFiltered = {}
      for (const [key,value] of Object.entries(tailoringEnzymes_Reactions[geneMatrix[geneIndex].tailoringEnzymeType])) {
        if (JSON.stringify(value) === '[""]'){
            continue
          }
        tayloringArrayFiltered[key] = value.map(function(item){return item.toString()})
      }
      let emptyTailoringArray = {}
      for (const key of tailoringArrayKeys) {
        emptyTailoringArray[key] = []
      }
      geneMatrix[geneIndex].options = tayloringArrayFiltered;

      for (const key of tailoringArrayKeys){
          emptyTailoringArray[key]= []
      }
      if (geneMatrix[geneIndex].selected_option.length == 0){
        geneMatrix[geneIndex].selected_option = emptyTailoringArray
        geneMatrix[geneIndex].default_option = emptyTailoringArray;
    }
}}})


//add options for cyclization
