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
OptionCreator.createOptionsDomains = (function (geneMatrix, atomsForCyclisation = none) {
  for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
    for (let domainIndex = 0; domainIndex < geneMatrix[geneIndex].domains.length; domainIndex++) {
      let domain = geneMatrix[geneIndex].domains[domainIndex]
      // add stereochemistry options for KR
      if (domain.hasOwnProperty("function")) {
        if (domain.abbreviation == "KR") {
          if (domain.function.length > 2) {
            domain.default_option = domain.function.slice(3)
          }
          else { domain.default_option = "undetermined stereochemisty" }
          domain.domainOptions = ['Stereoselectivity: A1', 'Stereoselectivity: A2', 'Stereoselectivity: B1', 'Stereoselectivity: B2', 'Stereoselectivity: C1', 'Stereoselectivity: C2']
        }
      }
      //add substrate specifities for NRPS
      if (domain.abbreviation == "A") {
        domain.domainOptions = Object.values(aminoacids)
        domain.default_option = domain.predictions[0][1].replace(
          "-", '').toLowerCase()
      }
      //add substrate specifities for PKS

      if (domain.abbreviation == "AT") {
        domain.domainOptions = Object.keys(nameToStructure)
        domain.default_option = domain.predictions[1][1].replace(
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
OptionCreator.createOptionsTailoringEnzymes = (function (geneMatrix, tailoringSites) {
  let tailoringEnzymes_Reactions = {
    'METHYLTRANSFERASE': { 'METHYLTRANSFERASE': tailoringSites['METHYLTRANSFERASE'] },
    'C_METHYLTRANSFERASE': { 'C_METHYLTRANSFERASE': tailoringSites['C_METHYLTRANSFERASE'] },
    'N_METHYLTRANSFERASE': { 'N_METHYLTRANSFERASE': tailoringSites['N_METHYLTRANSFERASE'] },
    'O_METHYLTRANSFERASE': { 'O_METHYLTRANSFERASE': tailoringSites['O_METHYLTRANSFERASE'] },
    'P450': {
      'HYDROXYLATION': tailoringSites['P450_HYDROXYLATION'],
      'OXIDATIVE_BOND_FORMATION': tailoringSites['P450_OXIDATIVE_BOND_FORMATION'],
      'EPOXIDATION': tailoringSites['P450_EPOXIDATION']
    },
    'REDUCTASE': {
      'DOUBLE_BOND_REDUCTION': tailoringSites['REDUCTASE_DOUBLE_BOND_REDUCTION'],
      'KETO_REDUCTION': tailoringSites['REDUCTASE_KETO_REDUCTION']
    },
    'ISOMERASE': { 'DOUBLE_BOND_SHIFT': tailoringSites['ISOMERASE_DOUBLE_BOND_SHIFT'], },
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
    'OXIDASE': { 'DOUBLE_BOND_FORMATION': tailoringSites['OXIDAS_DOUBLE_BOND_FORMATIONE'] },
    'ALCOHOLE_DEHYDROGENASE': { 'ALCOHOLE_DEHYDROGENASE': tailoringSites['ALCOHOLE_DEHYDROGENASE'] },
    'DEHYDRATASE': { 'DEHYDRATASE': tailoringSites['DEHYDRATASE'] },
    'DECARBOXYLASE': { 'DECARBOXYLASE': tailoringSites['DECARBOXYLASE'] },
    'MONOAMINE_OXIDASE': { 'MONOAMINE_OXIDASE': tailoringSites['MONOAMINE_OXIDASE'] },
    'HALOGENASE': { 'HALOGENASE': tailoringSites['HALOGENASE'] },
    'PEPTIDASE': { 'PEPTIDASE': tailoringSites['PEPTIDASE'] },
    'PROTEASE': { 'PROTEASE': tailoringSites['PROTEASE'] }

  }

  for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
    if (geneMatrix[geneIndex].tailoringEnzymeStatus == true) {
      geneMatrix[geneIndex].options = tailoringEnzymes_Reactions[geneMatrix[geneIndex].tailoringEnzymeType];
      geneMatrix[geneIndex].default_option = null;
    }
  }
})


//add options for cyclization


