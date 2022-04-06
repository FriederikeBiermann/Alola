
regionName="r1c3"
cluster_type=  "nrpspks"
let items = document.querySelectorAll('.test-container .box')
var dragSrcEl = null;
function removeAllInstances(arr, item) {
   for (var i = arr.length; i--;) {
     if (arr[i] === item) arr.splice(i, 1);
   }
}
function handleDragStart(e) {
  this.style.opacity = '0.4';

  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }

  e.dataTransfer.dropEffect = 'move';

  return false;
}

function handleDragEnter(e) {
  this.classList.add('over');
}

function handleDragLeave(e) {
  this.classList.remove('over');
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }

  if (dragSrcEl != this) {

// change position in geneMatrix
    geneMatrix.sort((a, b) => {
        return a.position - b.position;
    });
    const locusTagDragged = dragSrcEl.id.substring(21)
    const locusTagTarget = this.id.substring(21)
    console.log(locusTagDragged,locusTagTarget,geneMatrix)
    let positionDragged=1
    let geneIndexDragged=1
    let positionTarget=1
    let geneIndexTarget=1
    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {

        if (geneMatrix[geneIndex].id==locusTagDragged){
          positionDragged=geneMatrix[geneIndex].position;
          geneIndexDragged=geneIndex;
        }
          if (geneMatrix[geneIndex].id==locusTagTarget){
            positionTarget=geneMatrix[geneIndex].position;
           geneIndexTarget=geneIndex;}

      }
    // if we want to move protein back
    if (positionTarget>positionDragged){
      for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        if (geneMatrix[geneIndex].position>=positionDragged&&geneMatrix[geneIndex].position<=positionTarget){
          geneMatrix[geneIndex].position-=1;
        }
      }
      geneMatrix[geneIndexDragged].position=positionTarget

    }
    // if we want to move protein forward
    if (positionTarget<positionDragged){
      for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        if (geneMatrix[geneIndex].position<=positionDragged&&geneMatrix[geneIndex].position>=positionTarget){
          geneMatrix[geneIndex].position+=1;
        }
      }
      geneMatrix[geneIndexDragged].position=positionTarget

    }
    updateProteins(geneMatrix)
    }  return false;
  }




function handleDragEnd(e) {
  this.style.opacity = '1';

  items.forEach(function (item) {
    item.classList.remove('over');
  });
}
function addDragDrop(){
  items = document.querySelectorAll('.test-container .box');

  items.forEach(function(item) {

      item.addEventListener('dragstart', handleDragStart, false);
      item.addEventListener('dragenter', handleDragEnter, false);
      item.addEventListener('dragover', handleDragOver, false);
      item.addEventListener('dragleave', handleDragLeave, false);
      item.addEventListener('drop', handleDrop, false);
      item.addEventListener('dragend', handleDragEnd, false);
    });
}

function removePaddingBGC(BGC){
  let BGC_with_padding=JSON.parse(JSON.stringify(BGC));
  if (BGC_with_padding.orfs.length!=0){
  if (BGC_with_padding.orfs[0].start!=0){
  for (let orfIndex=0; orfIndex<BGC_with_padding.orfs.length; orfIndex++){
    BGC_with_padding.orfs[orfIndex].start=BGC_with_padding.orfs[orfIndex].start-BGC.start
    BGC_with_padding.orfs[orfIndex].end=BGC_with_padding.orfs[orfIndex].end-BGC.start
  }}}
  return BGC_with_padding}
  function removeSpaceBetweenProteins(BGC){
    let margin = 100;
    let BGC_without_space=JSON.parse(JSON.stringify(BGC));
    for (let orfIndex=0; orfIndex<BGC_without_space.orfs.length; orfIndex++){
      let orf_length=BGC_without_space.orfs[orfIndex].end-BGC_without_space.orfs[orfIndex].start
      BGC_without_space.orfs[orfIndex].start=0
      BGC_without_space.orfs[orfIndex].end=BGC_without_space.orfs[orfIndex].start+orf_length
      // if (orfIndex==0){BGC_without_space.orfs[orfIndex].start=0;
      // BGC_without_space.orfs[orfIndex].end=BGC_without_space.orfs[orfIndex].start+orf_length}
      // if (orfIndex!=0){BGC_without_space.orfs[orfIndex].start=BGC_without_space.orfs[orfIndex-1].end + margin
      // BGC_without_space.orfs[orfIndex].end=BGC_without_space.orfs[orfIndex].start+ margin+ orf_length}

  }
  return BGC_without_space;
  }

    let nameToStructure={"methylmalonylcoa":"CC(C(O)=O)C(S)=O", "propionylcoa":"CCC(S)=O","malonylcoa":"OC(=O)CC(S)=O"}
    function updateProteins(geneMatrix){
      let proteinsForDisplay= JSON.parse(JSON.stringify(BGC));

      delete proteinsForDisplay.orfs
      proteinsForDisplay.orfs = []
      geneMatrix.sort((a, b) => {
          return a.position - b.position;
      });

      for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        if (geneMatrix[geneIndex].displayed==true){

          proteinsForDisplay.orfs.push(BGC.orfs[geneMatrix[geneIndex].position_in_BGC-1]);

        }}

      $("#protein_container").html(Proteiner.drawClusterSVG(removePaddingBGC(removeSpaceBetweenProteins(proteinsForDisplay))));
      addDragDrop();
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
  for (let region_index=0; region_index<recordData[0].regions.length;region_index++){
    if (recordData[0].regions[region_index].anchor==regionName){
      return region_index
    }}


}
function changeColor(arrowId){

  const arrow = document.querySelector(arrowId);

  if (arrow.getAttribute("fill")=="#E11839"){
  arrow.setAttribute('fill', '#ffffff');
  }
  else{arrow.setAttribute('fill', "#E11839");
}}
function formatInputRaichuKS(data){
  string_data= JSON.stringify(data);
  trimmed_data=string_data.replaceAll(',"PKS_PP"',"").replaceAll(',"ACP"',"").replaceAll(',"KS"',"").replaceAll(',"AT"',"").replaceAll(',"TE"',"").replaceAll('"PKS_PP",',"").replaceAll(',"ACP"',"").replaceAll('"KS",',"").replaceAll('"AT",',"").replaceAll('"TE",',"").replaceAll('"PKS_PP",',"").replaceAll('"ACP"',"").replaceAll('"KS"',"").replaceAll('"AT"',"").replaceAll('"TE"',"")
  console.log(string_data,"trimmed",trimmed_data)

  return trimmed_data
}
  function extractAntismashPredictionsFromRegionSJKS(details_data, region_index){
    let outputForRaichu=[]
    console.log(details_data)
    let  region=[]
  if (details_data.hasOwnProperty(cluster_type)){region=details_data[cluster_type][region_index];}
 else{region=details_data[region_index];}
   console.log("index",region_index)

  for (let orfIndex=0; orfIndex<region.orfs.length;orfIndex++){
    let orf=region.orfs[orfIndex];

    for (let moduleIndex=0; moduleIndex<orf.modules.length;moduleIndex++){
    let  module=orf.modules[moduleIndex];
    console.log("module",module)
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
            if (domain.predictions.length!=0){

              let domainActivity=domain.predictions[0][1]
              if (domainActivity=="inactive"){continue}

              if (domain.predictions[1][1]!="(unknown)"){let domainStereochemistry=domain.predictions[1][1];

             nameDomain="KR_"+domainStereochemistry
              }
              else{nameDomain="KR"}
            }
          else{nameDomain="KR"}}
          else{nameDomain=domain.abbreviation}
          if (domain.abbreviation==""){ nameDomain=domain.type}
          console.log("domain", nameDomain)
          domainArray.push(nameDomain)
          console.log(domain,domain.predictions)
          if (domain.abbreviation=="AT"){if (domain.hasOwnProperty("predictions")){if (domain.predictions.length!=0){ console.log("34",domain);if (domain.predictions[1][1]!="unknown"){substrate=domain.predictions[1][1].replace("-", '').toLowerCase()}}}
          else{substrate=malonylcoa}
        }}}

        if (domainArray.includes("AT") && !(domainArray.includes("KS")) && !("TE" in domainArray)){typeModule= "starter_module";
         starterSubstrate= nameToStructure[substrate];
      moduleArray.push(nameModule,typeModule,starterSubstrate)}
        if (domainArray.includes("KS") && !(domainArray.includes("TE"))){typeModule= "elongation_module";
      moduleArray.push(nameModule,typeModule,substrate);
      if (domainArray.includes ("DH")&&domainArray.includes ("ER")){
removeAllInstances(domainArray,"DH")
removeAllInstances(domainArray,"ER");
domainArray.push("DH","ER")
      }
      else if (domainArray.includes("DH")){
        removeAllInstances(domainArray,"DH");
        domainArray.push("DH");
      }

      moduleArray.push(domainArray)}
      console.log( moduleArray)
        if (domainArray.includes("TE")){typeModule= "terminator_module";
      moduleArray.push(nameModule,typeModule,substrate);
      moduleArray.push(domainArray)}
      if (moduleArray.length != 0){outputForRaichu.push(moduleArray)}



  }

}console.log("xyz",outputForRaichu);
return outputForRaichu}


addDragDrop()
//create record for diplaying BGC in BGC explorer
let regionNumber=selectRegion(recordData, regionName)
let BGC = Object.keys(recordData[0].regions[regionNumber]).reduce(function(obj, k) {
  if (k== "start" || k== "end" || k=="orfs") obj[k] = recordData[0].regions[regionNumber][k];
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


$("#arrow_container").html(Arrower.drawClusterSVG(removePaddingBGC(BGCForDisplay)));
//add click event to every gene arrow
for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
arrow_id=("#"+geneMatrix[geneIndex].id+"_gene_arrow").replace(".","_")

const arrow = document.querySelector(arrow_id);

arrow.addEventListener (
   'click',
   function() {           // anonyme Funktion
    setDisplayedStatus(geneMatrix[geneIndex].id, geneMatrix);updateProteins(geneMatrix);changeColor("#"+geneMatrix[geneIndex].id+"_gene_arrow")
   },
   false
);
}
//add drag and drop for proteins



updateProteins(geneMatrix)
//fetching svg an displaying it
//let svg=["test",{"test":"test"}]
let data=extractAntismashPredictionsFromRegionSJKS(details_data, regionName)
console.log( "test",data)
//data=[['module_1','starter_module','SC(=O)CC'],['module_2','elongation_module','methylmalonylcoa',['KR_B2']],['module_3','elongation_module','methylmalonylcoa',['KR_A1']],['module_4','elongation_module','methylmalonylcoa',['KR_C2']],['module_5','elongation_module','methylmalonylcoa',['KR','DH','ER']],['module_6','elongation_module','methylmalonylcoa',['KR_A1']],['module_7','terminator_module','methylmalonylcoa',['KR_A1']]];
data_string=formatInputRaichuKS(data)
console.log( data);
//data_string='[["module_3_0","starter_module","CCC(S)=O"],["module_3_1","elongation_module","methylmalonylcoa",["KR_B2"]],["module_3_2","elongation_module","methylmalonylcoa",["KR_A1"]],["module_4_0","elongation_module","methylmalonylcoa",[]],["module_4_1","elongation_module","methylmalonylcoa",["DH","ER","KR"]],["module_5_0","elongation_module","methylmalonylcoa",["KR_A1"]],["module_5_1","terminator_module","methylmalonylcoa",["KR_A1"]]]'
let url="http://127.0.0.1:8000/api/alola?antismash_input=";
fetch(url+data_string)
.then(response => {const thing=response.json();
return thing})
      .then((data) => {let container = document.getElementById("structure_container");
      console.log(data.svg)
      container.innerHTML = data.svg;})
