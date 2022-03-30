//Colour dicts to match antiSMASH domain colouring
colour_fill_dict = {'ACP':'#81bef7', 'AT':'#f78181', 'KS':'#81f781',
                    'KR':'#80f680', 'DH':'#f7be81', 'ER':'#81f7f3',
                    'TE':'#f5c4f2', 'KR*':'#80f680'}
colour_outline_dict = {'ACP':'#3d79d6', 'AT':'#df5d5d', 'KS':'#5fc65f',
                       'KR':'#5fbb87', 'DH':'#ca9862', 'ER':'#61bbad',
                       'TE':'#a25ba0', 'KR*':'#5fbb87'}
regionName="r1c4"
    let nameToStructure={"methylmalonylcoa":"CC(C(O)=O)C(S)=O", "propionylcoa":"CCC(S)=O","malonylcoa":"OC(=O)CC(S)=O"}
    function updateProteins(geneMatrix){
      let proteinsForDisplay= JSON.parse(JSON.stringify(BGC));
      console.log("GM",geneMatrix)
      delete proteinsForDisplay.orfs
      proteinsForDisplay.orfs = []
      geneMatrix.sort((a, b) => {
          return a.position - b.position;
      });
      console.log(geneMatrix)
      console.log(proteinsForDisplay.orfs[0])
      for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        if (geneMatrix[geneIndex].displayed==true){
          console.log("test1",BGC.orfs[geneMatrix[geneIndex].position_in_BGC-1])
          proteinsForDisplay.orfs.push(BGC.orfs[geneMatrix[geneIndex].position_in_BGC-1]);

        }}
        console.log("test2",proteinsForDisplay.orfs)
      $("#protein_container").html(Proteiner.drawClusterSVG(proteinsForDisplay));
    }
    function setDisplayedStatus(id, geneMatrix) {
      id.slice(-11,-1);
      for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++){
        if (geneMatrix[geneIndex].id === id){
          if (geneMatrix[geneIndex].displayed === false){
            geneMatrix[geneIndex].displayed = true;

          }
        else {geneMatrix[geneIndex].displayed = false;}
        }
      }

      }
function selectRegion(recordData, regionName){
  for (let BGC=0; BGC<recordData[0].regions.length;BGC++){
    if (recordData[0].regions[BGC].anchor==regionName){
      return BGC
    }}


}
function changeColor(arrowId){

  const arrow = document.querySelector(arrowId);
console.log(arrowId,arrow.getAttribute("fill"))
  if (arrow.getAttribute("fill")=='red'){
  arrow.setAttribute('fill', '#ffffff');
  }
  else{arrow.setAttribute('fill', 'red');
}}
  function extractAntismashPredictionsFromRegionSJ(details_data, region_index){
    let outputForRaichu=[]
   let  region=details_data[region_index];
  for (let orfIndex=0; orfIndex<region.orfs.length;orfIndex++){
    let orf=region.orfs[orfIndex];
    for (let moduleIndex=0; moduleIndex<orf.modules.length;moduleIndex++){
    let  module=orf.modules[moduleIndex];
    let moduleArray=[];
    let startModule=module.start;
    let endModule=module.end;
    let nameModule="module_"+orfIndex+ "_"+moduleIndex
    let nameDomain="n"
    let domainArray=[];
    let typeModule= "starter_module";
    let substrate="malonylcoa"
    let starterSubstrate="OC(=O)CC(S)=O"
    for (let domainIndex=0; domainIndex<orf.domains.length;domainIndex++){
      let domain=orf.domains[domainIndex];
        if (startModule>=domain.start && domain.start>=endModule || endModule>=domain.start && domain.start>=startModule){
          if (domain.abbreviation=="KR"){
            if (domain.predictions !=[]){

              let domainActivity=domain.predictions[0][1]
              if (domainActivity=="inactive"){continue}

              if (domain.predictions[1][1]!="(unknown)"){let domainStereochemistry=domain.predictions[1][1];

             nameDomain="KR_"+domainStereochemistry
              }

            }

          if (domain.abbreviation==""){ nameDomain=domain.type}

          domainArray.push(nameDomain)
          if (domain.abbreviation=="AT"){if (domain.predictions[1][1]!="unknown"){substrate=domain.predictions[1][1].replace("-", '').toLowerCase()}
          else{substrate=malonylcoa}
        }}}

        if (domainArray.includes("AT") && !(domainArray.includes("KS")) && !("TE" in domainArray)){typeModule= "starter_module";
         starterSubstrate= nameToStructure[substrate];
      moduleArray.push(nameModule,typeModule,starterSubstrate)}
        if (domainArray.includes("KS") && !(domainArray.includes("TE"))){typeModule= "elongation_module";
      moduleArray.push(nameModule,typeModule,substrate);
      moduleArray.push(domainArray)}
        if (domainArray.includes("TE")){typeModule= "terminator_module";
      moduleArray.push(nameModule,typeModule,substrate);
      moduleArray.push(domainArray)}
      if (moduleArray.length != 0){outputForRaichu.push(moduleArray)}



  }

}}
return outputForRaichu
}
//create record for diplaying BGC in BGC explorer
var BGC = Object.keys(recordData[0].regions[selectRegion(recordData, regionName)]).reduce(function(obj, k) {
  if (k== "start" || k== "end" || k=="orfs") obj[k] = recordData[0].regions[0][k];
  return obj;
}, {});

for (const [key_1, value_1] of Object.entries(details_data)) {
  if (value_1.id==regionName){

    for (let orf_index =0; orf_index<value_1.orfs.length; orf_index++){
      orf=value_1.orfs[orf_index]
      for (let BGC_orf_index =0; BGC_orf_index<BGC.orfs.length; BGC_orf_index++){
      if (orf.id==BGC.orfs[BGC_orf_index].locus_tag){
      BGC.orfs[BGC_orf_index]["domains"]=orf.domains
    }}
}}}


var geneMatrix=[];
for (let geneIndex = 0; geneIndex < BGC["orfs"].length; geneIndex++) {
geneMatrix.push({"id":BGC["orfs"][geneIndex].locus_tag,
"position_in_BGC":geneIndex+1,
"position":geneIndex+1,
"ko":false,
"displayed":true});
}
// display BGC in BGC explorer
let BGCForDisplay= JSON.parse(JSON.stringify(BGC));

for (let geneIndex = 0; geneIndex < BGCForDisplay["orfs"].length; geneIndex++) {
  delete BGCForDisplay["orfs"][geneIndex]["domains"];
}

updateProteins(geneMatrix)
$("#arrow_container").html(Arrower.drawClusterSVG(BGCForDisplay));
//add click event to every gene arrow
for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
arrow_id="#"+geneMatrix[geneIndex].id+"_gene_arrow"

const arrow = document.querySelector(arrow_id);

arrow.addEventListener (
   'click',
   function() {           // anonyme Funktion
    setDisplayedStatus(geneMatrix[geneIndex].id, geneMatrix);updateProteins(geneMatrix);changeColor(arrow_id)
   },
   false
);
}

//fetching svg an displaying it
//let svg=["test",{"test":"test"}]
let data=extractAntismashPredictionsFromRegionSJ(details_data, regionName)
let data_string=JSON.stringify(data);
let url="http://127.0.0.1:8000/api/alola?antismash_input=";
fetch(url+data_string)
.then(response => {const thing=response.json();
return thing})
      .then((data) => {let container = document.getElementById("structure_container");

      container.innerHTML = data.svg;})
