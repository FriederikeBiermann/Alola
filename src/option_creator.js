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
      domain.domainOptions=['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

    }
    //add substrate specifities
 // add options to Dropdown

  }
     }
   }

}
