
regionName="r1c3"
let cluster_type=  "nrps"
let nameToStructure={"methylmalonylcoa":"CC(C(O)=O)C(S)=O", "propionylcoa":"CCC(S)=O","malonylcoa":"OC(=O)CC(S)=O"}
let aminoacids={"arg":"arginine","his":"histidine","lys":"lysine","asp":"asparticacid","glu":"glutamicacid","ser":"serine","thr":"threonine","asn":"asparagine","gln":"glutamine","cys":"cysteine","sec":"selenocysteine","gly":"glycine","pro":"proline","ala":"alanine","val":"valine","ile":"isoleucine","leu":"leucine","met":"methionine","phe":"phenylalanine","tyr":"tyrosine","trp":"tryptophan"}
let items = document.querySelectorAll('.test-container .box')
var dragSrcEl = null;
function fetchFromRaichu(details_data, regionName,geneMatrix,cluster_type){//fetching svg an displaying it
  let data=""
  let starterACP=""
if (cluster_type=="pks"){ data=extractAntismashPredictionsFromRegionSJKS(details_data, regionName,geneMatrix)[0]
starterACP=extractAntismashPredictionsFromRegionSJKS(details_data, regionName,geneMatrix)[1]
}
else{ data=extractAntismashPredictionsFromRegionSJNRPS(details_data, regionName,geneMatrix)[0]
 starterACP=extractAntismashPredictionsFromRegionSJNRPS(details_data, regionName,geneMatrix)[1]
}
let data_string=formatInputRaichuKS(data)
let url="http://127.0.0.1:8000/api/alola?antismash_input=";
let list_hanging_svg=[]
let container = document.getElementById("structure_container")
container.innerHTML = ""
fetch(url+data_string)
.then(response => {const thing=response.json();
return thing})
      .then((data) => {let container = document.getElementById("structure_container");
      let smiles_container = document.getElementById("smiles_container");

      //list_hanging_svg=data.hanging_svg;
      var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(data.svg);
      document.getElementById("save_svg").href = url
      document.getElementById("save_svg").setAttribute("download", data.smiles+".svg");
      container.innerHTML = formatSVG(data.svg);
      smiles_container.innerHTML = data.smiles;
      acpList=obtainACPList(geneMatrix)
      for (let intermediateIndex=0; intermediateIndex<data.hanging_svg.length;intermediateIndex++){
        intermediate=data.hanging_svg[intermediateIndex]
        let intermediate_container = document.getElementById('innerIntermediateContainer'+acpList[intermediateIndex+starterACP])


        intermediate_container.innerHTML = formatSVG(intermediate);

      }

    })}
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
    updateDomains(geneMatrix)
    addArrowClick(geneMatrix)
    }  return false;
  }
function formatSVG(svg){

  svg=svg.toString().replaceAll("#ffffff","none").replaceAll("#000000","#ffffff").replaceAll("<g transform='translate","<g style='fill: #ffffff' transform='translate");
  return svg
}
function handleDragEnd(e) {
  this.style.opacity = '1';

  items.forEach(function (item) {
    item.classList.remove('over');
  });
}
function addDragDrop(){
  items = document.querySelectorAll('.protein-container .box');

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

      if (document.querySelector('input[type=checkbox]').checked) {
        fetchFromRaichu(details_data, regionName,geneMatrix)
      }
    }
function obtainACPList(geneMatrix){
  let acpList=[]
  for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
    if (geneMatrix[geneIndex].ko==false && geneMatrix[geneIndex].domains.length!=0){
      for (let domainIndex=0; domainIndex< geneMatrix[geneIndex].domains.length; domainIndex++){
        if (geneMatrix[geneIndex].domains[domainIndex].ko==false){
          if (geneMatrix[geneIndex].domains[domainIndex].type.includes("ACP")||geneMatrix[geneIndex].domains[domainIndex].type.includes("PP")){

            acpList.push(geneMatrix[geneIndex].domains[domainIndex].identifier)
          }
        }
      }

    }}
    return acpList;

}
    // only display proteins with domains in domain explorer
function updateDomains(geneMatrix){
      let domainsForDisplay= JSON.parse(JSON.stringify(BGC));

      delete domainsForDisplay.orfs
      domainsForDisplay.orfs = []
      geneMatrix.sort((a, b) => {
          return a.position - b.position;
      });

      for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        if (geneMatrix[geneIndex].displayed==true && geneMatrix[geneIndex].domains.length!=0){

          domainsForDisplay.orfs.push(BGC.orfs[geneMatrix[geneIndex].position_in_BGC-1]);

        }}

        $("#Domain_container").html(Domainer.drawClusterSVG(removePaddingBGC(removeSpaceBetweenProteins(domainsForDisplay))));
        addDragDrop();

        if (document.querySelector('input[type=checkbox]').checked) {
          fetchFromRaichu(details_data, regionName,geneMatrix)
        }
      }
function setKoStatus(geneIndex, domainIndex,geneMatrix){


          if (geneMatrix[geneIndex].domains[domainIndex].ko === false){
            geneMatrix[geneIndex].domains[domainIndex].ko= true;



          }
        else {geneMatrix[geneIndex].domains[domainIndex].ko = false;}
        if (document.querySelector('input[type=checkbox]').checked) {
          fetchFromRaichu(details_data, regionName,geneMatrix)
        }

    }
function setDisplayedStatus(id, geneMatrix) {
      id.slice(-11,-1);
      for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++){
        if (geneMatrix[geneIndex].id === id){
          if (geneMatrix[geneIndex].displayed === false){
            geneMatrix[geneIndex].displayed = true;
            geneMatrix[geneIndex].ko= false;
console.log("test2");


          }
        else {geneMatrix[geneIndex].displayed = false;
      console.log("test");
      geneMatrix[geneIndex].ko= true;}
        }
      }

      }
function selectRegion(recordData, regionName){
  for (let region_index=0; region_index<recordData[0].regions.length;region_index++){
    console.log(region_index,recordData[0].regions[region_index].anchor,recordData[0].regions.length)
    if (recordData[0].regions[region_index].anchor==regionName){

      return region_index
    }}


}

function changeColor(arrowId){
  console.log("09709")
  const arrow = document.querySelector(arrowId);

  if (arrow.getAttribute("fill")=="#E11838"){
    console.log("0359");
  arrow.setAttribute('fill', '#ffffff');
  }
  else{console.log("09356");arrow.setAttribute('fill', "#E11838");
}}
function changeDomainColor(domain,domainId){

  const domainObject = document.querySelector(domainId);


  if (domainObject.getAttribute("fill")=="#E11839"){
    if (domain.hasOwnProperty("type")) {
      if (colour_fill_dict.hasOwnProperty(domain.type)){
        color = colour_fill_dict[domain.type];
         domainObject.setAttribute('fill', color);
      }
      else{ domainObject.setAttribute('fill', "#025699");}

    }
    else{ domainObject.setAttribute('fill', "#025699");}
  }
  else{domainObject.setAttribute('fill', "#E11839");
}}
function changeProteinColorON(ProteinId,geneIndex){

    if (geneMatrix[geneIndex].displayed===true){
  const arrow = document.querySelector(ProteinId);
  arrow.setAttribute('fill', "#E11839");}}
function changeProteinColorOFF(ProteinId,geneIndex){

  if (geneMatrix[geneIndex].displayed===true){
    const arrow = document.querySelector(ProteinId);
    arrow.setAttribute('fill', '#ffffff');
  }

}
function displayTextInGeneExplorer(geneId){

  for (let geneIndex=0;geneIndex<BGCForDisplay["orfs"].length;geneIndex++)
  if (BGCForDisplay["orfs"][geneIndex].locus_tag==geneId){
    gene_container.innerHTML =BGCForDisplay["orfs"][geneIndex].description
  }
}
function formatInputRaichuKS(data){
  string_data= JSON.stringify(data);
  trimmed_data=string_data.replaceAll(',"PKS_PP"',"").replaceAll(',"C"',"").replaceAll(',"ACP"',"").replaceAll(',"PCP"',"").replaceAll(',"KS"',"").replaceAll(',"T"',"").replaceAll(',"AT"',"").replaceAll(',"TE"',"").replaceAll(',"A"',"").replaceAll('"PKS_PP",',"").replaceAll('"C",',"").replaceAll(',"ACP"',"").replaceAll(',"T"',"").replaceAll(',"PCP"',"").replaceAll('"KS",',"").replaceAll('"AT",',"").replaceAll('"TE",',"").replaceAll('"PKS_PP",',"").replaceAll('"ACP"',"").replaceAll('"KS"',"").replaceAll('"AT"',"").replaceAll('"TE"',"").replaceAll('"C"',"").replaceAll('"A"',"").replaceAll('"ACP"',"").replaceAll('"T"',"")


  return trimmed_data
}
function extractAntismashPredictionsFromRegionSJNRPS(details_data, region_index, geneMatrix){
    let outputForRaichu=[]

    let  region=[]

  if (details_data.hasOwnProperty(cluster_type)){region=details_data[cluster_type][region_index];}
 else{region=details_data[region_index];}
 geneMatrix.sort((a, b) => {
     return a.position - b.position;
 });

let acpCounter=-1
let starterStatus=0
 for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {

   if (geneMatrix[geneIndex].ko==false){

  for (let orfIndex=0; orfIndex<region.orfs.length;orfIndex++){
    let orf=region.orfs[orfIndex];

    if (geneMatrix[geneIndex].id==orf.id){

    for (let moduleIndex=0; moduleIndex<orf.modules.length;moduleIndex++){
    let  module=orf.modules[moduleIndex];

    let moduleArray=[];
    let startModule=module.start;
    let endModule=module.end;
    let nameModule="module_"+orfIndex+ "_"+moduleIndex
    let nameDomain="n"
    let domainArray=[];
    let typeModule= "starter_module_nrps";
    let substrate="glycine"


    for (let domainIndex=0; domainIndex<orf.domains.length;domainIndex++){
      let domain=orf.domains[domainIndex];
      let starterACP=""


      if (geneMatrix[geneIndex].domains[domainIndex].ko==false){
        if (startModule>=domain.start && domain.start>=endModule || endModule>=domain.start && domain.start>=startModule){


          nameDomain=domain.abbreviation

          if (domain.abbreviation==""){ nameDomain=domain.type}

          if (domain.type.includes("PCP")||domain.type.includes("PP")){
            acpCounter+=1;}



          domainArray.push(nameDomain)

          if (domain.abbreviation=="A"){if (domain.hasOwnProperty("predictions")){if (domain.predictions.length!=0){ if (domain.predictions[0][1]!="unknown"){substrate=aminoacids[domain.predictions[0][1].replace("-", '').toLowerCase()]}}}
          else{substrate="glycine"}
        }}}}


        if (domainArray.includes("A")  && !("TE" in domainArray)&& !("TD" in domainArray) && starterStatus==0){typeModule= "starter_module_nrps";

      moduleArray.push(nameModule,typeModule,substrate)

    starterACP=acpCounter;
  starterStatus=1}

        else if (domainArray.includes("C") && !(domainArray.includes("TE"))&&starterStatus==1&& !("TD" in domainArray)){typeModule= "elongation_module_nrps";
      moduleArray.push(nameModule,typeModule,substrate);

      moduleArray.push(domainArray)}

        else if ((domainArray.includes("TE")||domainArray.includes("TD"))&&starterStatus==1){typeModule= "terminator_module_nrps";
      moduleArray.push(nameModule,typeModule,substrate);
      moduleArray.push(domainArray)}
      if (moduleArray.length != 0){outputForRaichu.push(moduleArray)}



  }break}
}}

}
console.log(outputForRaichu)
return [outputForRaichu,starterACP]}
function extractAntismashPredictionsFromRegionSJKS(details_data, region_index, geneMatrix){
    let outputForRaichu=[]

    let  region=[]

  if (details_data.hasOwnProperty(cluster_type)){region=details_data[cluster_type][region_index];}
 else{region=details_data[region_index];}
 geneMatrix.sort((a, b) => {
     return a.position - b.position;
 });

let acpCounter=-1
let starterStatus=0
 for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {

   if (geneMatrix[geneIndex].ko==false){

  for (let orfIndex=0; orfIndex<region.orfs.length;orfIndex++){
    let orf=region.orfs[orfIndex];

    if (geneMatrix[geneIndex].id==orf.id){

    for (let moduleIndex=0; moduleIndex<orf.modules.length;moduleIndex++){
    let  module=orf.modules[moduleIndex];

    let moduleArray=[];
    let startModule=module.start;
    let endModule=module.end;
    let nameModule="module_"+orfIndex+ "_"+moduleIndex
    let nameDomain="n"
    let domainArray=[];
    let typeModule= "starter_module_pks";
    let substrate="malonylcoa"
    let starterSubstrate="OC(=O)CC(S)=O"

    for (let domainIndex=0; domainIndex<orf.domains.length;domainIndex++){
      let domain=orf.domains[domainIndex];
      let starterACP=""


      if (geneMatrix[geneIndex].domains[domainIndex].ko==false){
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

          if (domain.type.includes("ACP")||domain.type.includes("PP")){
            acpCounter+=1;}



          domainArray.push(nameDomain)

          if (domain.abbreviation=="AT"){if (domain.hasOwnProperty("predictions")){if (domain.predictions.length!=0){ if (domain.predictions[1][1]!="unknown"){substrate=domain.predictions[1][1].replace("-", '').toLowerCase()}}}
          else{substrate=malonylcoa}
        }}}
      }

        if (domainArray.includes("AT") && !(domainArray.includes("KS")) && !("TE" in domainArray)){typeModule= "starter_module_pks";
         starterSubstrate= nameToStructure[substrate];
      moduleArray.push(nameModule,typeModule,starterSubstrate)
    starterACP=acpCounter;
  starterStatus=1}

        if (domainArray.includes("KS") && !(domainArray.includes("TE"))&&starterStatus==1){typeModule= "elongation_module_pks";
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

        if (domainArray.includes("TE")&&starterStatus==1){typeModule= "terminator_module_pks";
      moduleArray.push(nameModule,typeModule,substrate);
      moduleArray.push(domainArray)}
      if (moduleArray.length != 0){outputForRaichu.push(moduleArray)}



  }break}
}}
}

return [outputForRaichu,starterACP]}
function createGeneMatrix(BGC){
  var geneMatrix=[];
  for (let geneIndex = 0; geneIndex < BGC["orfs"].length; geneIndex++) {
    let domains=[]
  if (BGC["orfs"][geneIndex].hasOwnProperty("domains")){domains=JSON.parse(JSON.stringify(BGC["orfs"][geneIndex].domains))
  for (let domainIndex=0; domainIndex<domains.length;domainIndex++){
    domains[domainIndex]["identifier"]=BGC["orfs"][geneIndex].locus_tag+"_"+(domainIndex+1).toString()
    domains[domainIndex]["domainOptions"]=["Test 3","Test 4"];
    domains[domainIndex]["ko"]=false;
  }}
  else{domains=[]}
  geneMatrix.push({"id":BGC["orfs"][geneIndex].locus_tag,
  "position_in_BGC":geneIndex+1,
  "position":geneIndex+1,
  "ko":false,
  "displayed":true,
  "options":["Test1","Test"],
  "domains":domains});
  }
  return geneMatrix
}
function displayGenes(BGC){
  // display BGC in BGC explorer
  let BGCForDisplay= JSON.parse(JSON.stringify(BGC));

  for (let geneIndex = 0; geneIndex < BGCForDisplay["orfs"].length; geneIndex++) {
    delete BGCForDisplay["orfs"][geneIndex]["domains"];
  }


  $("#arrow_container").html(Arrower.drawClusterSVG(removePaddingBGC(BGCForDisplay)));
  return BGCForDisplay
}
function addArrowClick (geneMatrix){
  //add click event to every gene arrow
  for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
  arrow_id=("#"+geneMatrix[geneIndex].id+"_gene_arrow").replace(".","_")
  protein_id=("#"+geneMatrix[geneIndex].id+"_protein").replace(".","_")
  let arrow_1 = document.querySelector(arrow_id);
  arrow_1.replaceWith(arrow_1.cloneNode(true));
  let arrow = document.querySelector(arrow_id);
  const protein = document.querySelector(protein_id);
  arrow.addEventListener (
     'click',
     function() {           // anonyme Funktion
       console.log("test");
      setDisplayedStatus(geneMatrix[geneIndex].id, geneMatrix);updateProteins(geneMatrix); updateDomains(geneMatrix);changeColor("#"+geneMatrix[geneIndex].id+"_gene_arrow");addArrowClick(geneMatrix);
     },
     false
  );
  arrow.addEventListener (
     'mouseenter',
     function() {           // anonyme Funktion
      displayTextInGeneExplorer(geneMatrix[geneIndex].id);changeProteinColorON("#"+geneMatrix[geneIndex].id+"_protein",geneIndex)
      console.log("#"+geneMatrix[geneIndex].id+"_protein")
     },
     false
  );
  arrow.addEventListener (
     'mouseleave',
     function() {           // anonyme Funktion
      changeProteinColorOFF("#"+geneMatrix[geneIndex].id+"_protein",geneIndex)
     },
     false
  );
    if (geneMatrix[geneIndex].displayed === true){
  protein.addEventListener (
     'click',
     function() {           // anonyme Funktion
       console.log("test");
      setDisplayedStatus(geneMatrix[geneIndex].id, geneMatrix);updateProteins(geneMatrix); updateDomains(geneMatrix);changeColor("#"+geneMatrix[geneIndex].id+"_gene_arrow");addArrowClick(geneMatrix)
     },
     false
  );
  protein.addEventListener (
     'mouseenter',
     function() {           // anonyme Funktion
      displayTextInGeneExplorer(geneMatrix[geneIndex].id);changeProteinColorON("#"+geneMatrix[geneIndex].id+"_gene_arrow",geneIndex)
      console.log("#"+geneMatrix[geneIndex].id+"_protein")
     },
     false
  );
  protein.addEventListener (
     'mouseleave',
     function() {           // anonyme Funktion
      changeProteinColorOFF("#"+geneMatrix[geneIndex].id+"_gene_arrow",geneIndex)
     },
     false
  );
  for (let domainIndex=0; domainIndex<geneMatrix[geneIndex].domains.length;domainIndex++){
   domain=geneMatrix[geneIndex].domains[domainIndex]
    domainId="#"+geneMatrix[geneIndex].id+"_domain_"+domain.sequence;

    const domainObject = document.querySelector(domainId);
    domainObject.addEventListener (
       'click',
       function() {           // anonyme Funktion
       changeDomainColor(geneMatrix[geneIndex].domains[domainIndex],"#"+geneMatrix[geneIndex].id+"_domain_"+geneMatrix[geneIndex].domains[domainIndex].sequence);changeDomainColor(geneMatrix[geneIndex].domains[domainIndex],"#domain"+geneMatrix[geneIndex].domains[domainIndex].identifier);setKoStatus(geneIndex, domainIndex,geneMatrix)},
       false);
       domainObject.addEventListener (
          'mouseenter',
          function() {           // anonyme Funktion
           changeDomainColor(geneMatrix[geneIndex].domains[domainIndex],"#"+geneMatrix[geneIndex].id+"_domain_"+geneMatrix[geneIndex].domains[domainIndex].sequence);changeDomainColor(geneMatrix[geneIndex].domains[domainIndex],"#domain"+geneMatrix[geneIndex].domains[domainIndex].identifier);displayTextInGeneExplorer(geneMatrix[geneIndex].id);changeProteinColorON("#"+geneMatrix[geneIndex].id+"_protein",geneIndex);changeProteinColorON("#"+geneMatrix[geneIndex].id+"_gene_arrow",geneIndex);
           console.log("#"+geneMatrix[geneIndex].id+"_protein")
          },
          false
       );
       domainObject.addEventListener (
          'mouseleave',
          function() {           // anonyme Funktion
           changeDomainColor(geneMatrix[geneIndex].domains[domainIndex],"#"+geneMatrix[geneIndex].id+"_domain_"+geneMatrix[geneIndex].domains[domainIndex].sequence);changeDomainColor(geneMatrix[geneIndex].domains[domainIndex],"#domain"+geneMatrix[geneIndex].domains[domainIndex].identifier);changeProteinColorOFF("#"+geneMatrix[geneIndex].id+"_gene_arrow",geneIndex);changeProteinColorOFF("#"+geneMatrix[geneIndex].id+"_protein",geneIndex)
          },
          false
       );
       domainId="#domain"+geneMatrix[geneIndex].domains[domainIndex].identifier

      const domainObject_2 = document.querySelector(domainId);
       domainObject_2.addEventListener (
          'click',
          function() {           // anonyme Funktion
          changeDomainColor(geneMatrix[geneIndex].domains[domainIndex],"#"+geneMatrix[geneIndex].id+"_domain_"+geneMatrix[geneIndex].domains[domainIndex].sequence);changeDomainColor(geneMatrix[geneIndex].domains[domainIndex],"#domain"+geneMatrix[geneIndex].domains[domainIndex].identifier);setKoStatus(geneIndex, domainIndex,geneMatrix)},
          false);
          domainObject_2.addEventListener (
             'mouseenter',
             function() {           // anonyme Funktion
              changeDomainColor(geneMatrix[geneIndex].domains[domainIndex],"#"+geneMatrix[geneIndex].id+"_domain_"+geneMatrix[geneIndex].domains[domainIndex].sequence);changeDomainColor(geneMatrix[geneIndex].domains[domainIndex],"#domain"+geneMatrix[geneIndex].domains[domainIndex].identifier);displayTextInGeneExplorer(geneMatrix[geneIndex].id);changeProteinColorON("#"+geneMatrix[geneIndex].id+"_protein",geneIndex);changeProteinColorON("#"+geneMatrix[geneIndex].id+"_gene_arrow",geneIndex);
              console.log("#"+geneMatrix[geneIndex].id+"_protein")
             },
             false
          );
          domainObject_2.addEventListener (
             'mouseleave',
             function() {           // anonyme Funktion
              changeDomainColor(geneMatrix[geneIndex].domains[domainIndex],"#"+geneMatrix[geneIndex].id+"_domain_"+geneMatrix[geneIndex].domains[domainIndex].sequence);changeDomainColor(geneMatrix[geneIndex].domains[domainIndex],"#domain"+geneMatrix[geneIndex].domains[domainIndex].identifier);changeProteinColorOFF("#"+geneMatrix[geneIndex].id+"_gene_arrow",geneIndex);changeProteinColorOFF("#"+geneMatrix[geneIndex].id+"_protein",geneIndex)
             },
             false
          );

    }}
  }
}
//create record for diplaying BGC in BGC explorer
let regionNumber=selectRegion(recordData, regionName)
console.log(regionNumber)
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
}}
else if (value_1.hasOwnProperty([regionName])){
  for (let orf_index =0; orf_index<value_1[regionName].orfs.length; orf_index++){
    orf=value_1[regionName].orfs[orf_index]

    for (let BGC_orf_index =0; BGC_orf_index<BGC.orfs.length; BGC_orf_index++){
    if (orf.id==BGC.orfs[BGC_orf_index].locus_tag){
    BGC.orfs[BGC_orf_index]["domains"]=orf.domains
  }}
}

}
}
geneMatrix=createGeneMatrix(BGC)
BGCForDisplay=displayGenes(BGC)
updateDomains(geneMatrix)
updateProteins(geneMatrix)
addArrowClick (geneMatrix)
addDragDrop()

fetchFromRaichu(details_data, regionName,geneMatrix,cluster_type)