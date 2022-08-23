function createOptions(geneMatrix){
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
console.log(domain.identifier)
//add substrate specifities for NRPS
if (domain.abbreviation=="A") {
  domain.domainOptions=Object.values(aminoacids)
  domain.default_option=domain.predictions[0][1].replace(
  "-", '')
  .toLowerCase()
  console.log(domain)


}

//add substrate specifities for PKS

if (domain.abbreviation=="AT") {
domain.domainOptions=Object.keys(nameToStructure)
domain.default_option=domain.predictions[1][1].replace(
"-", '')
.toLowerCase()


}
// add options to Dropdown
     }
   }

}
