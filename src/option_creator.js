function addStringToArray(string, array) {
  return array.map(value => string + value);
}

var OptionCreator = {
  version: "1.0.0"
};
OptionCreator.createOptionsTerpeneCyclase = (function(atomsForCyclisation = undefined, tailoringSites = undefined){
  const options = {"Cyclization": atomsForCyclisation,
    "DOUBLE_BOND_ISOMERASE": tailoringSites['DOUBLE_BOND_ISOMERASE'],
    "Methyl_shift" : tailoringSites['METHYL_MUTASE']};
  return options
  
})

OptionCreator.createOptionsDomains = (function (geneMatrix, atomsForCyclisation = undefined) {
  let AT_index = 0;
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
if (domain.abbreviation=="A" || domain.abbreviation == "CAL") {
  domain.domainOptions = [...new Set(Object.values(AMINO_ACIDS))];
  // Use the same lookup strategy as elsewhere: keep hyphens, just lowercase
  const predKey = (domain.predictions && domain.predictions[0] && domain.predictions[0][1])
    ? domain.predictions[0][1].toLowerCase()
    : undefined;
  domain.default_option = (predKey && AMINO_ACIDS[predKey]) ? AMINO_ACIDS[predKey] : "**Unknown**";
AT_index += 1;
}
//add substrate specifities for PKS
if (domain.abbreviation=="AT") {
  if (AT_index>0){domain.domainOptions=Object.keys(NAME_TO_STRUCTURE);
    domain.default_option=domain.predictions[1][1].replace(
    "-", '')
    .toLowerCase();}
  else{domain.domainOptions=PKS_STARTER_SUBSTRATES;
    domain.default_option=domain.predictions[1][1].replace(
    "-", '')
    .toLowerCase();}
  AT_index += 1;
  }

//add specifities for Trans-AT-KS

if (domain.abbreviation == "KS" && domain.predictions.length != 0) {  
  domain.domainOptions = Object.keys(TRANS_AT_KS_SUBTYPES);
  for (const [key,value] of Object.entries(TRANS_AT_KS_SUBTYPES))
  {
    if (value == domain.predictions[0][1].toUpperCase().replaceAll("-", "_").replaceAll("/", "_"))
    domain.default_option = key;
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
return geneMatrix;
})
OptionCreator.createOptionsTailoringEnzymes = (function (geneMatrix, tailoringSites) {
  let tailoringEnzymes_Reactions = {
    'SPLICEASE': { 'SPLICEASE': tailoringSites['SPLICEASE'] },
    'ARGINASE': { 'ARGINASE': tailoringSites['ARGINASE'] },
    'AGMATINASE': { 'ARGINASE': tailoringSites['ARGINASE'] },
    'METHYLTRANSFERASE': { 'METHYLTRANSFERASE': tailoringSites['METHYLTRANSFERASE'] },
    'C_METHYLTRANSFERASE': { 'C_METHYLTRANSFERASE': tailoringSites['C_METHYLTRANSFERASE'] },
    'N_METHYLTRANSFERASE': { 'N_METHYLTRANSFERASE': tailoringSites['N_METHYLTRANSFERASE'] },
    'O_METHYLTRANSFERASE': { 'O_METHYLTRANSFERASE': tailoringSites['O_METHYLTRANSFERASE'] },
    
    'P450': {
      'HYDROXYLASE': tailoringSites['HYDROXYLASE'],
      'OXIDATIVE_BOND_SYNTHASE': tailoringSites['OXIDATIVE_BOND_SYNTHASE'],
      'EPOXIDASE': tailoringSites['EPOXIDASE'],
      'DEHYDROGENASE': tailoringSites['DEHYDROGENASE'] 
    },

    'LANTHIBIOTIC_DEHYDRATASE': {
      'THREONINE_SERINE_DEHYDRATASE': tailoringSites ['THREONINE_SERINE_DEHYDRATASE'],
    },

    'RADICAL_SAM': {
      'METHYLTRANSFERASE': tailoringSites['METHYLTRANSFERASE'],
      'AMINO_ACID_EPIMERASE': tailoringSites['AMINO_ACID_EPIMERASE'],
      'OXIDATIVE_BOND_SYNTHASE': tailoringSites ['OXIDATIVE_BOND_SYNTHASE'],
      'LANTHIPEPTIDE_CYCLASE': tailoringSites['LANTHIPEPTIDE_CYCLASE'],
      'LANTHIONINE_SYNTHETASE': tailoringSites['LANTHIONINE_SYNTHETASE'],
      
    },
    'MACROLACTAM_SYNTHETASE': { 'MACROLACTAM_SYNTHETASE': tailoringSites['MACROLACTAM_SYNTHETASE'] },
    'THIOPEPTIDE_CYCLASE': { 'THIOPEPTIDE_CYCLASE': tailoringSites['THIOPEPTIDE_CYCLASE'] },

    'ATP-GRASP' : {
      'OMEGA_AMIDE': tailoringSites['OMEGA_AMIDE'],
      'OMEGA_ESTER': tailoringSites['OMEGA_ESTER'],
      'OMEGA_THIOESTER': tailoringSites['OMEGA_THIOESTER'],

    },

    'YCAO': {
      'PEPTIDASE': tailoringSites['PEPTIDASE'],
      'THIOAMIDATION': tailoringSites['THIOAMIDATION'],
      'CYCLODEHYDRASE': tailoringSites['CYCLODEHYDRASE'],
      'MACROLACTAMIDINATION': tailoringSites['MACROLACTAMIDINATION'],
    },

    'OXIDOREDUCTASE':{
      'DOUBLE_BOND_REDUCTASE': tailoringSites['DOUBLE_BOND_REDUCTASE'],
      'KETO_REDUCTION': tailoringSites['KETO_REDUCTION'],
      'HYDROXYLASE': tailoringSites['HYDROXYLASE'],
      'OXIDATIVE_BOND_SYNTHASE': tailoringSites['OXIDATIVE_BOND_SYNTHASE'],
      'EPOXIDASE': tailoringSites['EPOXIDASE'],
      'DEHYDROGENASE': tailoringSites['DEHYDROGENASE'] 
    },
    'REDUCTASE': {
      'DOUBLE_BOND_REDUCTASE': tailoringSites['DOUBLE_BOND_REDUCTASE'],
      'KETO_REDUCTION': tailoringSites['KETO_REDUCTION']
    },
    'ISOMERASE': { 'DOUBLE_BOND_ISOMERASE': tailoringSites['DOUBLE_BOND_ISOMERASE'], },
    'PRENYLTRANSFERASE': {
      'DIMETHYLALLYL': tailoringSites['PRENYLTRANSFERASE'],
      '3_METHYL_1_BUTENYL': tailoringSites['PRENYLTRANSFERASE'],
      'GERANYL': tailoringSites['PRENYLTRANSFERASE'],
      'FARNESYL': tailoringSites['PRENYLTRANSFERASE'],
      'GERANYLGERANYL': tailoringSites['PRENYLTRANSFERASE'],
      'SQUALENE': tailoringSites['PRENYLTRANSFERASE'],
      'PHYTOENE': tailoringSites['PRENYLTRANSFERASE']
    },
    'ACETYLTRANSFERASE': { 'ACETYLTRANSFERASE': tailoringSites['ACETYLTRANSFERASE'] },
    'ACYLTRANSFERASE': { 
      'PALAMITIC_ACID': tailoringSites['ACYLTRANSFERASE'],
      'STREARIC_ACID' : tailoringSites['ACYLTRANSFERASE'],
      'DIHYDROXYSTEARIC_ACID' : tailoringSites['ACYLTRANSFERASE'],
      'OLEIC_ACID' : tailoringSites['ACYLTRANSFERASE'],
      'RICINOLEIC_ACID' : tailoringSites['ACYLTRANSFERASE'],
      'LINOLEIC_ACID' : tailoringSites['ACYLTRANSFERASE'],
      'LINOLENIC_ACID' : tailoringSites['ACYLTRANSFERASE'],
      'BEHENIC_ACID' : tailoringSites['ACYLTRANSFERASE'],
    },
    'AMINOTRANSFERASE': { 'AMINOTRANSFERASE': tailoringSites['AMINOTRANSFERASE'] },
    'OXIDASE': { 'DEHYDROGENASE': tailoringSites['DEHYDROGENASE'] },
    'ALCOHOL_DEHYDROGENASE': { 'ALCOHOL_DEHYDROGENASE': tailoringSites['ALCOHOL_DEHYDROGENASE'] },
    'DEHYDRATASE': { 'DEHYDRATASE': tailoringSites['DEHYDRATASE'] },
    'DECARBOXYLASE': { 'DECARBOXYLASE': tailoringSites['DECARBOXYLASE'] },
    'MONOAMINE_OXIDASE': { 'MONOAMINE_OXIDASE': tailoringSites['MONOAMINE_OXIDASE'] },
    'HALOGENASE': { 'F': tailoringSites['HALOGENASE'],
      'Cl': tailoringSites['HALOGENASE'],
      'I': tailoringSites['HALOGENASE'],
      'Br': tailoringSites['HALOGENASE'],
   },
    'METHYL_MUTASE': {'METHYL_MUTASE': tailoringSites['METHYL_MUTASE']},
    'REDUCTIVE_LYASE' : {'REDUCTIVE_LYASE': tailoringSites['REDUCTIVE_LYASE']}, 
    'HYDROLASE': { 'HYDROLASE': tailoringSites['HYDROLASE'] },
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
}}
return geneMatrix;
})


//add options for cyclization

