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
OptionCreator.createOptionsDomains = (function (geneMatrix, atomsForCyclisation = none){
   for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
     for (let domainIndex=0; domainIndex<geneMatrix[geneIndex].domains.length;domainIndex++){
      let domain= geneMatrix[geneIndex].domains[domainIndex]
      // add stereochemistry options for KR
      if (domain.hasOwnProperty("function")){
      if (domain.abbreviation=="KR") {if (domain.function.length>2){
        domain.default_option=domain.function.slice(3)
      }
      else{domain.default_option="undetermined stereochemisty"}
      domain.domainOptions=['Stereoselectivity: A1', 'Stereoselectivity: A2', 'Stereoselectivity: B1', 'Stereoselectivity: B2', 'Stereoselectivity: C1', 'Stereoselectivity: C2']
    }
  }
//add substrate specifities for NRPS
if (domain.abbreviation=="A") {
  domain.domainOptions=Object.values(aminoacids)
  domain.default_option=domain.predictions[0][1].replace(
  "-", '').toLowerCase()
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
         domain.domainOptions = addStringToArray("Cyclization at ", atomsForCyclisation.replaceAll(
           "[", "")
           .replaceAll("]", "")
           .replaceAll(" ", "")
           .split(","));
         domain.domainOptions.push("Linear product");
         domain.default_option = null;
       }
     }
   }

})
OptionCreator.createOptionsTailoringEnzymes = (function (geneMatrix, c_atoms = null, n_atoms = null, o_atoms = null, double_CC_bonds = null, peptide_bonds = null){
  let tailoringEnzymes_Reactions = {
    "p450": {
      "Hydroxylation": c_atoms,
      "Epoxidation": double_CC_bonds,
      "Oxidative bond formation": c_atoms.concat(n_atoms, o_atoms)},
    "reductase": {
      "Double bond reduction": double_CC_bonds
    },
    "protease": {
      "Proteolytic cleavage": peptide_bonds
    },
    "methyltransferase": {"Methylation": c_atoms.concat(n_atoms, o_atoms)},
    "o-methyltransferase": { "O-methylation": o_atoms },
    "n-methyltransferase": { "C-methylation": c_atoms },
    "c-methyltransferase": { "N-methylation": n_atoms }
    }

  for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
    if (geneMatrix[geneIndex].tailoringEnzymeStatus == true){
      let tailoringArrayKeys = Object.keys(tailoringEnzymes_Reactions[geneMatrix[geneIndex].tailoringEnzymeType])
      let tayloringArrayFiltered = {}
      for (const [key,value] of Object.entries(tailoringEnzymes_Reactions[geneMatrix[geneIndex].tailoringEnzymeType])) {
        if (JSON.stringify(value) === '[""]'){
            continue
          }
        tayloringArrayFiltered[key] = value
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


