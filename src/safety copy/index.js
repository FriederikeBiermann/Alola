function updateProteins(geneMatrix){
  let proteinsForDisplay= JSON.parse(JSON.stringify(exampleBGC));
  console.log(proteinsForDisplay.orfs[0])
  delete proteinsForDisplay.orfs
  proteinsForDisplay.orfs = []
  geneMatrix.sort((a, b) => {
      return a.position - b.position;
  });
  console.log(geneMatrix)
  console.log(proteinsForDisplay.orfs[0])
  for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
    if (geneMatrix[geneIndex].displayed==true){
      console.log("test1",exampleBGC.orfs[geneMatrix[geneIndex].position_in_BGC-1])
      proteinsForDisplay.orfs.push(exampleBGC.orfs[geneMatrix[geneIndex].position_in_BGC-1]);

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

  function test(){
    console.log("test")
  }

//create record for diplaying BGC in BGC explorer
var exampleBGC = Object.keys(recordData[0].regions[0]).reduce(function(obj, k) {
  if (k== "start" || k== "end" || k=="orfs") obj[k] = recordData[0].regions[0][k];
  return obj;
}, {});

for (const [key_1, value_1] of Object.entries(details_data)) {
  console.log(key_1)
  for (const [key_2, value_2] of Object.entries(value_1)) {
    console.log(value_2.orfs)
    for (let orf_index =0; orf_index<value_2.orfs.length; orf_index++){
      orf=value_2.orfs[orf_index]
      for (let exampleBGC_orf_index =0; exampleBGC_orf_index<exampleBGC.orfs.length; exampleBGC_orf_index++){
      if (orf.id==exampleBGC.orfs[exampleBGC_orf_index].locus_tag){
      exampleBGC.orfs[exampleBGC_orf_index]["domains"]=orf.domains
    }}
}}}


var geneMatrix=[];
for (let geneIndex = 0; geneIndex < exampleBGC["orfs"].length; geneIndex++) {
geneMatrix.push({"id":exampleBGC["orfs"][geneIndex].locus_tag,
"position_in_BGC":geneIndex+1,
"position":geneIndex+1,
"ko":false,
"displayed":true});
}
console.log(geneMatrix)
// display BGC in BGC explorer
let BGCForDisplay= JSON.parse(JSON.stringify(exampleBGC));

for (let geneIndex = 0; geneIndex < BGCForDisplay["orfs"].length; geneIndex++) {
  delete BGCForDisplay["orfs"][geneIndex]["domains"];
}

updateProteins(geneMatrix)
$("#arrow_container").html(Arrower.drawClusterSVG(BGCForDisplay));
//add click event to every gene arrow
for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
arrow_id="#"+geneMatrix[geneIndex].id+"_gene_arrow"

const arrow = document.querySelector(arrow_id);
console.log(arrow_id)
arrow.addEventListener (
   'click',
   function() {           // anonyme Funktion
    setDisplayedStatus(geneMatrix[geneIndex].id, geneMatrix);updateProteins(geneMatrix)
   },
   false
);
}

//fetching svg an displaying it
//let svg=["test",{"test":"test"}]
let data=[['module_1','starter_module','SC(=O)CC'],['module_2','elongation_module','methylmalonylcoa',['KR_B2']],['module_3','elongation_module','methylmalonylcoa',['KR_A1']],['module_4','elongation_module','methylmalonylcoa',['KR_C2']],['module_5','elongation_module','methylmalonylcoa',['KR','DH','ER']],['module_6','elongation_module','methylmalonylcoa',['KR_A1']],['module_7','terminator_module','methylmalonylcoa',['KR_A1']]];
let data_string=JSON.stringify(data);
let url="http://127.0.0.1:8000/api/alola?antismash_input=";
fetch(url+data_string)
.then(response => {const thing=response.json();
return thing})
      .then((data) => {let container = document.getElementById("structure_container");

      container.innerHTML = data.svg;})
// async function fetchMoviesJSON() {
//         const response = await fetch(url+data_string);
//         const svg = await response.json();
//         return svg;
//       }
//       fetchMoviesJSON().then(svg => {
//         svg;
//       });
//
// console.log(svg)
// useEffect(() => {
//   async function getData() {
//     const response = await fetch(
//       url+data_string
//     )
//     let actualData = await response.json();
//
//     console.log(actualData)
//   }
//   getData()
// }, [])
// const svg_full_structure_json = fetchSVG(url,data_string);
// console.log(svg_full_structure_json)
// let svg_full_structure = svg_full_structure_json["svg"];
// console.log(svg_full_structure)
// let container = document.getElementById("structure_container");
//
// container.innerHTML = svg_full_structure;
