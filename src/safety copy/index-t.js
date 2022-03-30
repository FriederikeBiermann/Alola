import fetch from "node-fetch";


// import {JSDOM} from "jsdom";
/* global d3 */

// import axios from 'axios';

let data=[['module_1','starter_module','SC(=O)CC'],['module_2','elongation_module','methylmalonylcoa',['KR_B2']],['module_3','elongation_module','methylmalonylcoa',['KR_A1']],['module_4','elongation_module','methylmalonylcoa',['KR_C2']],['module_5','elongation_module','methylmalonylcoa',['KR','DH','ER']],['module_6','elongation_module','methylmalonylcoa',['KR_A1']],['module_7','terminator_module','methylmalonylcoa',['KR_A1']]];
 let data_string=JSON.stringify(data);
 let url="http://127.0.0.1:8000/api/alola?antismash_input=";
async function fetchSVG(url,data_string) {
          try {

              const response = await fetch(url+data_string, {
                  method: 'GET'
              });
              const svg = await response.json();
              return (svg);
          } catch (error) {
              console.error(error);
          }
      }
async function retrieve_svg(url,data_string){
  svg= await fetchSVG(url,data_string);
  return svg
}
const svg_full_structure_json = fetchSVG(url,data_string);
console.log(svg_full_structure_json)
let svg_full_structure = svg_full_structure_json["svg"];
console.log(svg_full_structure)
let container = document.getElementById("structure_container");

container.innerHTML = svg_full_structure;
