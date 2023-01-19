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


