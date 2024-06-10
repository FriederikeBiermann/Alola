let port = "http://127.0.0.1:8000/"
let regionIndex = 0;
let reversed = false;
let recordIndex = 0;
let regionName = "";
let viewPortHeight = window.innerHeight;
let viewPortWidth = window.innerWidth;
if (window.matchMedia("(orientation: portrait)").matches) {
    viewPortHeight = window.innerWidth;
    viewPortWidth = window.innerHeight;
}
var recordData = [];
var details_data = {};
let BGC ={};
let fetching = false;
let tailoringEnzymes = {"MACROLACTAM_SYNTHETASE":"M_SY", "ATP-GRASP":"ATP-G", "YCAO":"YcaO", "LANTHIBIOTIC_DEHYDRATASE":"L-DH", "RADICAL_SAM": "rSAM", "SPLICEASE": "SPL", "ARGINASE": "ARG", "AGMATINASE": "AGM", "OXIDOREDUCTASE": "OXRE","METHYLTRANSFERASE": "MT", "C_METHYLTRANSFERASE": "C-MT", "N_METHYLTRANSFERASE": "N-MT", "O_METHYLTRANSFERASE": "O-MT", "P450": "P450", "ISOMERASE": "ISO", "PRENYLTRANSFERASE": "Pren-T", "ACETYLTRANSFERASE": "Acet-T", "ACYLTRANSFERASE": "Acyl-T", "AMINOTRANSFERASE": "AMT", "OXIDASE": "OX", "REDUCTASE": "RED", "ALCOHOLE_DEHYDROGENASE": "AL-DH", "DEHYDRATASE":"DH", "DECARBOXYLASE":"DC", "MONOAMINE_OXIDASE": "MAO", "HALOGENASE": "HAL", "PEPTIDASE": "PEP", "PROTEASE": "PROT"};
let tailoringEnzymesSynonyms = {"ARGINASE": ["arginase"], "AGMATINASE": ["agmatinase"], "RADICAL_SAM": ["rSAM", "Radical_SAM", "radical_SAM", "R_SAM"], "YCAO": ["ycao","Ycao","YcaO"], "LANTHIBIOTIC_DEHYDRATASE": ["lanthibiotic dehydratase","serine/threoninedehydratase", "serine dehydratase", "threonine dehydratase"],"ATP-GRASP": ["ATP-grasp","atp-grasp","atp grasp", "ATP grasp"], "MACROLACTAM_SYNTHETASE": ["ATP dependent macrolactam synthetase"]};
let tailoringEnzymesWithTwoAtoms = ["OXIDATIVE_BOND_SYNTHASE", "SPLICEASE","LANTHIPEPTIDE_CYCLASE", "LANTHIONINE_SYNTHETASE", "OXIDATIVE_BOND_SYNTHASE"]
let tailoringEnzymesWithSubstrate = ["HALOGENASE", "PRENYLTRANSFERASE"];
let terpeneSubstrates = ["DIMETHYLALLYL_PYROPHOSPHATE", "GERANYL_PYROPHOSPHATE", "FARNESYL_PYROPHOSPHATE", "GERANYLGERANYL_PYROPHOSPHATE", "SQUALENE", "PHYTOENE"]
let pksStarterSubstrates = ["propionyl_coa","acetyl_coa","benzoyl_coa","methyl_butyryl_coa_3","methyl_butyryl_coa_2","trans_cyclopentane_dicarboxyl_coa","cyclohexane_carboxyl_coa","hydroxy_malonyl_coa_2", "hydroxy_malonyl_coa_2r", "hydroxy_malonyl_coa_2s","chloroethyl_malonyl_coa", "isobutyryl_coa","glycine","hydroxy_propenoyl_coa_3_23e","hydroxy_buteno yl_coa_3_23e","dihydroxy_butanolyl_coa_2r3","trihydroxy_propanolyl_coa_233","o_methylacetyl_coa","hydroxy_propenoyl_coa_3_23z","oxomalonyl_coa_2","methyl_hydroxy_propenoyl_coa_2_3_23z","dihydroxy_butanolyl_coa_23","dihydroxy_butanolyl_coa_2s3s","heptatrienoyl_coa","hydroxypropionyl_coa_2r","dihydroxy_propanolyl_coa_33","lactyl_coa","phenylacetyl_coa","methoxyformyl_coa"];
let cluster_type = "nrpspks";
let terpeneStatus = 0;
let terpeneSubstrate = "";
let RiPPStatus = 0;
let rippPrecursor = "";
let rippFullPrecursor = "";
let rippPrecursorGene = 0;
let proteaseOptions = null;
let cyclization = [];
window.rippSelection = "";
let  terpeneCyclaseOptions = [];

// Mapping of chemical compound names to their corresponding structures

let nameToStructure = {
    "methylmalonyl_coa": "CC(C(O)=O)C(S)=O",
    "malonyl_coa": "OC(=O)CC(S)=O",
    'methoxymalonyl_acp': "SC(=O)C(C(=O)O)OC)O",
    'ethylmalonyl_coa': "CC(CC(O)=O)C(S)=O",
    
};
let aminoacids= {
    "ala": 'alanine',
    "arg": "arginine",
    "asn": "asparagine",
    "asp": "aspartic acid",
    "cys": "cysteine",
    "gln": "glutamine",
    "glu": "glutamic acid",
    "gly": "glycine",
    "his": "histidine",
    "ile": "isoleucine",
    "leu": "leucine",
    "lys": "lysine",
    "met": "methionine",
    "phe": "phenylalanine",
    "pro": "proline",
    "ser": "serine",
    "thr": "threonine",
    "trp": "tryptophan",
    "tyr": "tyrosine",
    "val": "valine",
    "3-me-glu": "4-methylglutamicacid",
    "4ppro": "**Unknown**",
    "aad": "2-aminoadipicacid",
    'abu': "2-aminobutyricacid",
    'aeo': '2-amino-9,10-epoxy-8-oxodecanoidacid',
    'ala-b': 'beta-alanine',
    'ala-d': 'd-alanine',
    'allo-thr': "allo-threonine",
    'b-ala': 'beta-alanine',
    'beta-ala': 'beta-alanine',
    'bmt': "4-butenyl-4-methylthreonine",
    'cap': "capreomycidine",
    'bht': "**Unknown**",
    'dab': "2,4-diaminobutyricacid",
    'dhb': "2,3-dihydroxybenzoicacid",
    'dhpg': "3,5-dihydroxyphenylglycine",
    'dht': "dehydrobutyrine",
    'dpg': "3,5-dihydroxyphenylglycine",
    'hiv': "2-hydroxyisovalerate",
    'hiv-d': "d-2-hydroxyisovalerate",
    'hmp-d': "**Unknown**",
    'horn': "**Unknown**",
    'hpg': "4-hydroxyphenylglycine",
    'hyv': "4-hydroxyvaline",
    'hyv-d': "**Unknown**",
    'iva': "isovaline",
    'lys-b': "beta-lysine",
    'orn': "ornithine",
    'oh-orn': "N5-hydroxyornithine",
    'phg': "phenylglycine",
    'pip': "pipecolic acid",
    'sal': "salicylic acid",
    'tcl': "**Unknown**",
    'vol': "valinol",
    'ldap': "**Unknown**",
    'meval': "tert-leu",
    'alle': "allo-isoleucine",
    'alaninol': "alaninol",
    'n-(1,1-dimethyl-1-allyl)trp': "**Unknown**",
    'd-lyserg': "d-lysergicacid",
    'ser-thr': "**Unknown**",
    'mephe': "**Unknown**",
    'haorn': "**Unknown**",
    'hasn': "**Unknown**",
    'hforn': "**Unknown**",
    's-nmethoxy-trp': "**Unknown**",
    'alpha-hydroxy-isocaproic-acid': "**Unknown**",
    'mehoval': "**Unknown**",
    '2-oxo-isovaleric-acid': "alpha-ketoisovalericacid",
    'aoda': "**Unknown**",
    'x': "**Unknown**",
    'foh-orn': 'N5-formyl-N5-hydroxyornithine'
};
let items = document.querySelectorAll('.test-container .box');
var dragSrcEl = null;
let geneMatrix = [];
let moduleMatrix = [];
let wildcardSubstrate = "glycine";
let wildcardModule = "elongation_module_nrps";
let nameWildcardModule = "Custom_gene_";
let nameWildcardEnzyme = "Custom_tailoring_gene_";
let wildcardEnzyme = "";
let biosyntheticCoreEnzymes = ["alpha/beta fold hydrolase","acyl carrier protein","phosphopantetheine-binding protein","sdr family oxidoreductase", "type i polyketide synthase", "type ii polyketide synthase", "type iii polyketide synthase", "polyketide synthase", "thioesterase domain-containing protein", "non-ribosomal peptide synthetase", "non-ribosomal peptide synthetase"]

const uploadButton = document.getElementById('uploadButton');
const fileInput = document.getElementById('fileInput');

// allowing users to select a file for upload by setting up a click event listener on the 'uploadButton' element.
uploadButton.addEventListener('click', (event) => {
    fileInput.click();
});

// Event listener for the 'fileInput': When a file is selected,
// retrieve the selected file and pass it to the 'readFile' function for processing.
fileInput.addEventListener('change', (event) => {
    const input_file = event.target.files[0];
    readFile(input_file);
});

// Enable drag-and-drop file copying for a designated drop area ('regionsBar').
const dropArea = document.getElementById('regionsBar');

dropArea.addEventListener('dragover', (event) => {
    event.stopPropagation();
    event.preventDefault();
    // Style the drag-and-drop as a "copy file" operation.
    event.dataTransfer.dropEffect = 'copy';
});

dropArea.addEventListener('drop', (event) => {
    event.stopPropagation();
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    const input_file = fileList[0];
    readFile(input_file);

});

// Capture selected text in a textarea on mouseup mouseleave ,storing it in 'window.rippSelection'.
document.querySelector('textarea').addEventListener('mouseup', function () {
    window.rippSelection = this.value.substring(this.selectionStart, this.selectionEnd);
});
document.querySelector('textarea').addEventListener('mouseleave', function () {
    window.rippSelection = this.value.substring(this.selectionStart, this.selectionEnd); 
});
appendWildcardButtons(Object.keys(tailoringEnzymes));
appendButtonsToDropdownTerpene(terpeneSubstrates);

// Dynamically appends buttons to a dropdown element based on an array of entries, each triggering 'addTerpene' on click.
function appendButtonsToDropdownTerpene(entries) {
    const dropdown = document.getElementById("dropdownContentTerpene");

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const button = document.createElement("button");
        button.classList.add("wildcardsubstrate");
        button.textContent = entry;
        button.onclick = function () {
            addTerpene(entry);};
        dropdown.appendChild(button);
    }
}

// Splits an array into pairs and logs the result.
function splitArrayIntoPairs(array) {
    const pairs = [];
    for (let i = 0; i < array.length; i += 2) {
        if (i + 1 >= array.length) {
            break;
        }
        pairs.push([array[i], array[i + 1]]);
    }
    console.log(pairs)
    return pairs;
}

// Dynamically appending buttons to a dropdown element based on an array of entries, each triggering 'setWildcardTailoring' on click.
function appendWildcardButtons(entries) {
        // Get a reference to the dropdown element with the id "dropdownWildcard".
        const dropdown = document.getElementById("dropdownWildcard");
        // Iterate over each entry in the 'entries' array.
        entries.forEach(entry => {
            // Create a new button element
            const btn = document.createElement("button");
            // Set the text content of the button to the current entry.
            btn.textContent = entry;
            // Add a CSS class "wildcardsubstrate" to the button.
            btn.classList.add("wildcardsubstrate");
            // Set the onclick event handler for the button.
            btn.onclick = () => setWildcardTailoring(entry);
            // Append the button to the dropdown element.
            dropdown.appendChild(btn);
        });

}

function reformatSVGToBoundary(svg) {
        // Get the bounding box of the SVG
        const bbox = svg.getBBox();
        // Get the width and height of the bounding box
        const width = bbox.width;
        const height = bbox.height;
        // Get the x and y coordinates of the top-left corner of the bounding box
        const bboxX = bbox.x;
        const bboxY = bbox.y;
        // Set the new viewBox attribute to fit the bounding box exactly
        svg.setAttribute("viewBox", `${bboxX} ${bboxY} ${width} ${height}`);
        // Set the width and height attributes to match the bounding box
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);
}
// Creates a file input element, restricts file type to .js, attaches an event listener for file selection, and triggers a click to open the file selection dialog.
function selectFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.js';
    input.addEventListener('change', handleFileSelection, false);
    input.click();
}
// Handles the file selection event, retrieves the selected file, and if present, calls 'readFile'.
function handleFileSelection(event) {
    const file = event.target.files[0];

    if (file) {readFile(file)
    }
}
// Asynchronously loads the content of "example_regions.js
async function loadExampleFile() {
    const response = await fetch("./example_regions.js");
    const content = await response.text();

    // Convert the text content to a Blob so that it can be read using FileReader
    const blob = new Blob([content], { type: "text/javascript" });

    // Use the readFile function to read the Blob
    readFile(blob);
}

// Function to read the content of a file and process it
function readFile(file) {
    // Create a FileReader object
    const reader = new FileReader();

    // Event listener for when the file is loaded
    reader.addEventListener('load', (event) => {
        // Split the result by "var " to extract specific data
        const result = event.target.result.split("var ")

        // Check if the result has the expected structure
        if (result.length != 5){
            // If not, display an error message
            const dropArea = document.getElementById('regionsBar');
            dropArea.innerHTML = "Input file not antiSMASH output"
        }
        else{
            // Process the data if the structure is as expected
            var recordDataString = result[1].replace("recordData = ", "").trim().slice(0, -1)
            recordData = JSON.parse(recordDataString);
            
            // Parse details_data and call the reload_site_with_genecluster function
            details_data = JSON.parse(result[3].trim().replace("details_data = ", "").trim().slice(0, -1));
            reload_site_with_genecluster()
    }});

    // Event listener for progress tracking during file reading
    reader.addEventListener('progress', (event) => {
        if (event.loaded && event.total) {
            // Calculate and display the progress percentage
            const percent = (event.loaded / event.total) * 100;
            const dropArea = document.getElementById('regionsBar');
            dropArea.innerHTML = `Progress: ${Math.round(percent)}`  ;
        }
    });

    // Read the contents of the file as text
    reader.readAsText(file)
    }

// Function to convert a string representation of an array to an actual array
function stringToArray(string){
    // Remove opening '[' and closing ']', spaces, and single quotes from the input string
    return string
        .replaceAll("[", "")
        .replaceAll("]", "")
        .replaceAll(" ", "")
        .replaceAll("'", "")
        // Split the string into an array using commas
        .split(",")             
}
// Function to find a button by its text content
function findButtonbyTextContent(text) {
    var buttons = document.querySelectorAll('button');
    for (var i = 0, l = buttons.length; i < l; i++) {
        if (buttons[i].firstChild.nodeValue == text)
            return buttons[i];
    }
}

/**
 * Adds a string in front of every element in the array.
 * 
 * @param {string} string - The string to be added.
 * @param {Array} array - The array to which the string will be prepended.
 * @returns {Array} - A new array with the specified string added in front of each element.
 */
function addStringToArray(string, array) {
    return array.map(function (value) {
        return string + value;
    });
}

/**
 * Removes all instances of an item in array.
 * 
 * @param {Array} arr - The array from which instances of the item will be removed.
 * @param {*} item - The item to be removed from the array.
 * @returns {Array} - The cleaned up array with all instances of the item removed.
 */
function removeAllInstances(arr, item) {
    for (var i = arr.length; i--;) {
        if (arr[i] === item) arr.splice(i, 1);
    }
}
/**
 * Handles the drag start by making the element transparent and movable.
 * 
 * @param {Event} e - The drag start event.
 * @input {HTMLElement} element - The element that is being grabbed.
 * @fires dragstart - Fires when the element is grabbed.
 */
function handleDragStart(e) {
    this.style.opacity = '0.4';
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}
/**
 * Handles the dragover event during a drag-and-drop operation.
 * 
 * @param {Event} e - The dragover event.
 */
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}
/**
 * Handles the dragenter event during a drag-and-drop operation.
 */
function handleDragEnter() {
    this.classList.add('over');
}
/**
 * Handles the dragleave event during a drag-and-drop operation.
 */
function handleDragLeave() {
    this.classList.remove('over');
}
/**
 * Handles the drop event during a drag-and-drop operation.
 * After the drop, the position of the genes is exchanged in the geneMatrix, and all visualizations are updated.
 * If the "Real time calculation" button is checked, data will be automatically fetched from Raichu again.
 * 
 * @param {Event} e - The drop event.
 * @returns {boolean} - Returns false to prevent the browser's default behavior.
 */
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // Stops the browser from redirecting.
    }

    // Check if the dragged element is different from the drop target
    if (dragSrcEl != this) {
        // Change position in geneMatrix
        geneMatrix.sort((a, b) => a.position - b.position);

        const locusTagDragged = dragSrcEl.id.substring(21);
        const locusTagTarget = this.id.substring(21);

        let positionDragged = 1;
        let geneIndexDragged = 1;
        let positionTarget = 1;
        let geneIndexTarget = 1;

        // Find positions and indices of the dragged and target elements in the geneMatrix
        for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
            if (geneMatrix[geneIndex].id == locusTagDragged) {
                positionDragged = geneMatrix[geneIndex].position;
                geneIndexDragged = geneIndex;
            }
            if (geneMatrix[geneIndex].id == locusTagTarget) {
                positionTarget = geneMatrix[geneIndex].position;
                geneIndexTarget = geneIndex;
            }
        }

        // Move protein back
        if (positionTarget > positionDragged) {
            for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
                if (geneMatrix[geneIndex].position >= positionDragged &&
                    geneMatrix[geneIndex].position <= positionTarget) {
                    geneMatrix[geneIndex].position -= 1;
                }
            }
            geneMatrix[geneIndexDragged].position = positionTarget;
        }

        // Move protein forward
        if (positionTarget < positionDragged) {
            for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
                if (geneMatrix[geneIndex].position <= positionDragged &&
                    geneMatrix[geneIndex].position >= positionTarget) {
                    geneMatrix[geneIndex].position += 1;
                }
            }
            geneMatrix[geneIndexDragged].position = positionTarget;
        }

        // Sort geneMatrix based on position
        geneMatrix.sort((a, b) => a.position - b.position);

        // Update visualizations
        updateProteins(geneMatrix, BGC);
        if (RiPPStatus == 0) {
            updateDomains(geneMatrix, BGC);
        } else {
            updateRiPPs(geneMatrix, BGC);
        }

        addArrowClick(geneMatrix);

        // Fetch data from Raichu if "Real time calculation" button is checked
        if (document.getElementById("real-time-button").checked) {
            fetchFromRaichu(details_data, regionName, geneMatrix, cluster_type, BGC);
        }
    }

    // Return false to prevent the browser's default behavior
    return false;
}
/**
 * Handles the dragend event during a drag-and-drop operation.
 */
function handleDragEnd() {
    this.style.opacity = '1'; // Reset the opacity of the dragged element to 1
    items.forEach(function (item) {
        item.classList.remove('over'); // Remove the 'over' class from all elements in the items collection
    });
}
/**
 * Sets up drag-and-drop functionality for elements with the class '.protein-container .box'.
 */
function addDragDrop() {
    items = document.querySelectorAll('.protein-container .box'); // Select all elements with the specified classes
    items.forEach(function (item) {
        // Add event listeners for drag-related events
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragover', handleDragOver, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
    });
}

/**
 * Finds an atom in an SVG, highlights it with the given coloring.
 * If the selected option is atom selector, the function triggers hoverin/out_atom events.
 * 
 * @param {string} atom - The atom selector.
 * @param {string} color - The desired color for highlighting.
 * @param {number} width - The width for the stroke to highlight even more.
 * @fires hoverin_atom - Fires when the mouse hovers over the highlighted atom.
 * @fires hoverout_atom - Fires when the mouse leaves the highlighted atom.
 */
function highlight_atom_in_SVG(atom, color, width) {
    if (RiPPStatus) {
        // Highlight atom in SVG for RiPPs
        let nameAtom = "atom_" + atom;
        let group = document.getElementById(nameAtom);
        group.setAttribute('style', "fill:" + color + "; stroke:" + color + "; stroke-width:" + width);

    } else if (atom.toString().includes("_")) {
        // Highlight atom in SVG for other cases
        let links = document.querySelectorAll('a[*|href=\x22' + atom + '\x22]');
        for (let linkIndex = 0; linkIndex < links.length; linkIndex++) {
            let link = links[linkIndex];
            if (
                link.parentElement.parentElement.parentElement.parentElement == document.getElementById("intermediate_drawing_tailoring") ||
                link.parentElement.parentElement.parentElement.parentElement == document.getElementById("intermediate_drawing_cyclisation") ||
                link.parentElement.parentElement.parentElement.parentElement == document.getElementById("intermediate_drawing_precursor") ||
                link.parentElement.parentElement.parentElement.parentElement == document.getElementById("intermediate_drawing_tailored")
            ) {
                let text = link.childNodes[3];
                text.setAttribute('style', "fill:" + color + "; stroke:" + color + "; stroke-width:" + width);

                // Trigger hoverin/out_atom events
                text.addEventListener('mouseenter', function () {
                    document.dispatchEvent(new CustomEvent('hoverin_atom', { detail: atom }));
                });
                text.addEventListener('mouseleave', function () {
                    document.dispatchEvent(new CustomEvent('hoverout_atom', { detail: atom }));
                });
            }
        }
    }
}
/**
 * Highlights an atom in SVG with a red color.
 * 
 * @param {string} atom - The atom selector.
 */
function hover_in_atom(atom) {
    highlight_atom_in_SVG(atom, "#E11839", "5");
}
/**
 * Makes carbon atoms transparent, other atoms back to black.
 * 
 * @param {string} atom - The atom selector.
 */
function hover_out_atom(atom) {
    if (atom.indexOf("C") >= 0) {
        // Make carbon atoms transparent
        highlight_atom_in_SVG(atom, "none", "0");
    } else {
        // Make other atoms black
        highlight_atom_in_SVG(atom, "black", "0");
    }
}

/**
 * Formats the SVGs of the spaghetti diagram to look nice and removes the ACP.
 * 
 * @param {string} svg - The SVG content to be formatted.
 * @returns {string} - The formatted SVG content.
 */
function formatSVG_intermediates(svg) {
    // Convert the SVG to a string, perform replacements, and store the result in the 'svg' variable.
    svg = svg.toString()
        // Replace white fills with 'none'
        .replaceAll("#ffffff", "none")
        // Replace magenta fills with 'none'
        .replaceAll("#ff00ff", "none")
        // Replace red fills with black
        .replaceAll("#ff0000", "#000000")
        // Replace green fills with black
        .replaceAll("#00ff00", "#000000");

    // Perform additional replacements for transparency and styling.
    svg = svg.toString()
        // Replace the transformation in the 'g' element with a style attribute for black fill
        .replaceAll("<g transform='translate", "<g style='fill: black' transform='translate")
        // Replace the style attribute in the PCP (Polyketide Chain) 'g' element with transparent fill
        .replaceAll("<!-- PCP -->    <g style='fill: black'", "<!-- PCP -->    <g style='fill: transparent'")
        // Replace the style attribute in the ACP (Amino Acid Chain) 'g' element with transparent fill
        .replaceAll("<!-- ACP -->    <g style='fill: black'", "<!-- ACP -->    <g style='fill: transparent'");

    // Return the modified SVG content.
    return svg;
}
/**
 * Formats the SVG to look nice.
 * 
 * @param {string} svg - The SVG content to be formatted.
 * @returns {string} - The formatted SVG content.
 */
function formatSVG(svg) {
    // Convert the SVG to a string and perform replacements, then store the result in the 'svg' variable.
    svg = svg.toString()
        // Replace white fills with 'none'.
        .replaceAll("#ffffff", "none")
        // Replace black fills with white.
        .replaceAll("#000000", "#ffffff")
        // Add fill attribute to elements with stroke attribute set to white.
        .replaceAll("stroke: #ffffff", "stroke: #ffffff; fill: #ffffff")
        // Replace the transformation in the 'g' element with a style attribute for white fill.
        .replaceAll("<g transform='translate", "<g style='fill: #ffffff' transform='translate");

    // Perform additional replacements for transparency and styling.
    svg = svg.toString()
        // Replace the style attribute in the PCP (Polyketide Chain) 'g' element with transparent fill.
        .replaceAll("<!-- PCP -->    <g style='fill: #ffffff'", "<!-- PCP -->    <g style='fill: transparent'")
        // Replace the style attribute in the ACP (Amino Acid Chain) 'g' element with transparent fill.
        .replaceAll("<!-- ACP -->    <g style='fill: #ffffff'", "<!-- ACP -->    <g style='fill: transparent'");

    // Return the modified SVG content.
    return svg;
}

// Fuctions to save the SVG of the biosynthetic model
function PrintSVGCluster(){

}
// Function to capture and download the biosynthetic model as a PNG
function PrintDiv() {
    /**
     * Download biosynthetic_model
     * Transforms biosynthetic_model div to remove hidden areas, transforms it to canvas, and download a PNG of it
     * @fires   save_biosynthetic_model_button
     */
    (async () => {
        // Get references to the div elements
        let div = document.getElementById("outerDomainExplorer");
        let outer_div = document.getElementById("Domain_explorer");

        // Set class to indicate that saving is in progress
        div.setAttribute("class", "outerDomainExplorer_while_saving");

        // Use html2canvas to capture the content of the div as a canvas
        const canvas = await html2canvas(div, { scale: 5 });

        // Reset the class to its original state
        div.setAttribute("class", "outerDomainExplorer");

        // Convert canvas content to a data URL representing the PNG image
        var myImage = canvas.toDataURL();

        // Download the PNG image
        downloadURI(myImage, "biosynthetic_model.png");
    })();
}
// Function to download a URI as a file
function downloadURI(uri, name) {
    /**
     * Creates a link to download the PNG
     * @fires   PrintDiv
     */
    // Create a link element
    var link = document.createElement("a");

    // Set the download attribute and the URL
    link.download = name;
    link.href = uri;
    
    // Append the link to the document
    document.body.appendChild(link);
    // Trigger a click on the link to start the download
    link.click();
    //After creating the link, delete the dynamic link
    clearDynamicLink(link);
}

//functions for zooming
function zoom_in() {
    /**
   * Zooms into the structure in the structure explorer.
   * Gets actual dimensions, removes automatic sizing, and then resizes the SVG.
   * @fires   onclick-> zoom button
   */
    // Get the SVG element for the structure
    let drawing = document.getElementById("final_drawing");

    // Get the computed styles for the SVG element
    let drawingStyles = window.getComputedStyle(drawing);

    // Get the height and width of the SVG
    let height = drawingStyles.height;
    let width = drawingStyles.width;

    // Calculate new dimensions with a slight increase
    let stringWidth = (parseInt(width) + 30).toString() + "px";
    let stringHeight = (parseInt(height) + 30).toString() + "px";

    // Remove automatic sizing constraints    
    drawing.style["max-width"] = "";
    drawing.style["max-height"] = "";

    // Resize the SVG with the new dimensions
    drawing.style["width"] = stringWidth;
    drawing.style["height"] = stringHeight;
}

function zoom_out() {
    /**
     * Zooms out of structure in structure explorer.
     *
     * - Gets the actual dimensions of the drawing.
     * - Removes the automatic sizing.
     * - Resizes the SVG by reducing its dimensions.
     * 
     * @fires   onclick-> zoom button
     */

    // Get the reference to the drawing element with the ID "final_drawing"
    let drawing = document.getElementById("final_drawing");

    // Get the computed styles of the drawing element
    let drawingStyles = window.getComputedStyle(drawing);

    // Retrieve the current height and width of the drawing
    let height = drawingStyles.height;
    let width = drawingStyles.width;

    // Calculate the new dimensions for zooming out (subtracting 30 pixels)
    let stringWidth = (parseInt(width) - 30).toString() + "px";
    let stringHeight = (parseInt(height) - 30).toString() + "px";

    // Remove the maximum width and height constraints
    drawing.style["max-width"] = "";
    drawing.style["max-height"] = "";

    // Apply the new dimensions to the drawing, effectively zooming out
    drawing.style["width"] = stringWidth;
    drawing.style["height"] = stringHeight;
}

/**
 * Adds click events to every gene arrow.
 *
 * @fires onsiteload
 * @param {Object[]} geneMatrix - The matrix containing information about genes.
 * @yield {Event} - New click events for every arrow.
 */
function addArrowClick(geneMatrix) {

    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {

        // Generate IDs for arrow, protein, and RIPP button elements
        const arrow_id = "#" + geneMatrix[geneIndex].id.replace(".", "_") + "_gene_arrow";
        const protein_id = "#" + geneMatrix[geneIndex].id.replace(".", "_") + "_protein";
        const ripp_button_id = "#" + geneMatrix[geneIndex].id.replace(".", "_") + "_ripp_button";

        // Get references to the arrow, protein, and RIPP button elements
        let arrow_1 = document.querySelector(arrow_id);
        let ripp_button = document.querySelector(ripp_button_id);

        // Clone and replace the arrow to ensure click events work correctly
        arrow_1.replaceWith(arrow_1.cloneNode(true));
        let arrow = document.querySelector(arrow_id);
        let protein = document.querySelector(protein_id);

        // Get the original color of the arrow
        const originalColorArrow = getComputedStyle(arrow).fill;

        // Add click event to the arrow
        arrow.addEventListener(
            'click',
            function () { // anonyme Funktion (Handle arrow click event)
                setDisplayedStatus(geneMatrix[geneIndex].id, geneMatrix);
                updateProteins(geneMatrix, BGC);
                addArrowClick(geneMatrix);
                if (RiPPStatus == 0){ 
                    updateDomains(geneMatrix, BGC);
                }  else{ 
                    updateRiPPs(geneMatrix, BGC)
                }
                
                // Change color on click based on gene properties
                const currentColor = getComputedStyle(arrow).fill;
                if (geneMatrix[geneIndex].ko == true) {
                    arrow.style.fill = "#E11839";
                } else {
                    arrow.style.fill = originalColorArrow;
                }
                // Perform additional actions based on conditions
                if (document.getElementById("real-time-button").checked) {
                    fetchFromRaichu(details_data, regionName, geneMatrix,cluster_type, BGC);
                }
            },
            false
        );

        // Add mouseenter event to the arrow
        arrow.addEventListener(
            'mouseenter',
            function () { // anonyme Funktion (Handle mouseenter event for arrow)
                displayTextInGeneExplorer(geneMatrix[geneIndex].id);
                changeProteinColorON("#" + geneMatrix[geneIndex].id.replace(".","_") + "_protein", geneIndex);
                if (!geneMatrix[geneIndex].ko) {
                    arrow.style.fill = "#E11839";
                }
            },
            false
        );
        // Add mouseleave event to the arrow
        arrow.addEventListener(
            'mouseleave',
            function () { // anonyme Funktion (Handle mouseleave event for arrow)
                changeProteinColorOFF("#" + geneMatrix[geneIndex].id.replace(".","_") + "_protein", geneIndex);
                if (!geneMatrix[geneIndex].ko) {
                    arrow.style.fill = originalColorArrow;
                }
            },
            false
        );
        // Add mouseenter and mouseleave events to RIPP button if present
        if (ripp_button){
        ripp_button.addEventListener(
            'mouseenter',
            function () { // anonyme Funktion
                displayTextInGeneExplorer(geneMatrix[geneIndex].id);
                changeProteinColorON("#" + geneMatrix[geneIndex].id.replace(".", "_") + "_protein", geneIndex);
                if (!geneMatrix[geneIndex].ko) {
                    arrow.style.fill = "#E11839";
                }
            },
            false
        );

        ripp_button.addEventListener(
            'mouseleave',
            function () { // anonyme Funktion
                changeProteinColorOFF("#" + geneMatrix[geneIndex].id.replace(".", "_") + "_protein", geneIndex);
                if (!geneMatrix[geneIndex].ko) {
                    arrow.style.fill = originalColorArrow;
                }
            },
            false
        );
    }
        // Check if the gene is displayed
        if (geneMatrix[geneIndex].displayed == true) {
            // Add click and mouseenter/mouseleave events to protein
            protein.addEventListener(
                'click',
                function () { // anonyme Funktion (Handle protein click event)
                    setDisplayedStatus(geneMatrix[geneIndex].id, geneMatrix);
                    updateProteins(geneMatrix, BGC);
                    if (RiPPStatus == 0){ 
                        updateDomains(geneMatrix, BGC)
                    }  else{ 
                        updateRiPPs(geneMatrix, BGC);
                    }
                    // Change color on click based on gene properties
                    const currentColor = getComputedStyle(arrow).fill;
                    if (geneMatrix[geneIndex].ko == true) {
                        arrow.style.fill = "#E11839";
                    } else {
                        arrow.style.fill = originalColorArrow;
                    }

                    // Perform additional actions based on conditions
                    addArrowClick(geneMatrix);
                    if (document.getElementById("real-time-button")
                        .checked) {
                        fetchFromRaichu(details_data, regionName,
                            geneMatrix, cluster_type, BGC);
                    }
                },
                false
            );
            protein.addEventListener(
                'mouseenter',
                function () { // anonyme Funktion
                    displayTextInGeneExplorer(geneMatrix[geneIndex].id);
                    changeProteinColorON("#" + geneMatrix[geneIndex].id.replace(".","_") +
                        "_gene_arrow", geneIndex);
                },
                false
            );
            protein.addEventListener(
                'mouseleave',
                function () { // anonyme Funktion
                    changeProteinColorOFF("#" + geneMatrix[geneIndex].id.replace(".","_") +
                        "_gene_arrow", geneIndex);
                },
                false
            );
            if (geneMatrix[geneIndex].tailoringEnzymeStatus == true) {
                const tailoringEnzymeObject = document.querySelector("#tailoringEnzyme_" + geneMatrix[geneIndex].id.replace(".", "_"));
                arrow.addEventListener(
                    'mouseenter',
                    function () { // anonyme Funktion

                        changeProteinColorON("#tailoringEnzyme_" + geneMatrix[geneIndex].id, geneIndex);
                    },
                    false
                );
                arrow.addEventListener(
                    'mouseleave',
                    function () { // anonyme Funktion
                        changeProteinColorOFF("#tailoringEnzyme_" + geneMatrix[geneIndex].id, geneIndex);
                    },
                    false
                );
                protein.addEventListener(
                    'mouseenter',
                    function () { // anonyme Funktion

                        changeProteinColorON("#tailoringEnzyme_" + geneMatrix[geneIndex].id, geneIndex)
                    },
                    false
                );
                protein.addEventListener(
                    'mouseleave',
                    function () { // anonyme Funktion
                        changeProteinColorOFF("#tailoringEnzyme_" + geneMatrix[geneIndex].id, geneIndex)
                    },
                    false
                );

                tailoringEnzymeObject.addEventListener(
                    'mouseenter',
                    function () { // anonyme Funktion
                        displayTextInGeneExplorer(geneMatrix[geneIndex].id);
                        changeProteinColorON("#" + geneMatrix[geneIndex].id.replace(".","_") +
                            "_gene_arrow", geneIndex); changeProteinColorON("#" + geneMatrix[geneIndex].id.replace(".","_") +
                                "_protein", geneIndex)
                    },
                    false
                );
                tailoringEnzymeObject.addEventListener(
                    'mouseleave',
                    function () { // anonyme Funktion
                        changeProteinColorOFF("#" + geneMatrix[geneIndex].id.replace(".","_") +
                            "_gene_arrow", geneIndex); changeProteinColorOFF("#" + geneMatrix[geneIndex].id.replace(".","_") +
                                "_protein", geneIndex)
                    },
                    false
                );
            }
            if (RiPPStatus == 0 && (geneMatrix[geneIndex].hasOwnProperty(
                "modules") || biosyntheticCoreEnzymes.includes(geneMatrix[geneIndex].orffunction) || geneMatrix[geneIndex].type.includes("biosynthetic"))){ // there are no typical domains in ripp clusters
            for (let domainIndex = 0; domainIndex < geneMatrix[geneIndex].domains
                .length; domainIndex++) {
                domain = geneMatrix[geneIndex].domains[domainIndex]
                domainId_2 = "#" + geneMatrix[geneIndex].id.replace(".","_") + "_domain_" + domain
                    .sequence;
                const domainObject_2 = document.querySelector(domainId_2);
                domainId = "#domain" + geneMatrix[geneIndex].domains[
                    domainIndex].identifier.replace(".", "_")
                
                const domainObject = document.querySelector(domainId);
                const originalColorDomain = getComputedStyle(domainObject).fill;
                const originalColorDomain_2 = getComputedStyle(domainObject_2).fill;
                domainObject.addEventListener(
                    'click',
                    function () { // anonyme Funktion
                        const currentColor = getComputedStyle(domainObject).fill;
                        if (!(geneMatrix[geneIndex].domains[domainIndex].ko == true)) {
                            domainObject.style.fill = "#E11839";
                            domainObject_2.style.fill = "#E11839";
                        } else {
                            domainObject.style.fill = originalColorDomain;
                            domainObject_2.style.fill = originalColorDomain;
                        }
                        addArrowClick(geneMatrix);
                        setKoStatus(geneIndex, domainIndex, geneMatrix)
                    },
                    false);
                domainObject.addEventListener(
                    'mouseenter',
                    function () { // anonyme Funktion
                        if (!(geneMatrix[geneIndex].domains[domainIndex].ko == true)) {
                            domainObject_2.style.fill = "#E11839";
                            domainObject.style.fill = "#E11839";
                        }
                        displayTextInGeneExplorer(geneMatrix[geneIndex].id);
                        changeProteinColorON("#" + geneMatrix[geneIndex].id.replace(".","_") +
                            "_protein", geneIndex);
                        changeProteinColorON("#" + geneMatrix[geneIndex].id.replace(".","_") +
                            "_gene_arrow", geneIndex);
                    },
                    false
                );
                domainObject.addEventListener(
                    'mouseleave',
                    function () { // anonyme Funktion
                        if (!(geneMatrix[geneIndex].domains[domainIndex].ko == true)) {
                            domainObject.style.fill = originalColorDomain;
                            domainObject_2.style.fill = originalColorDomain_2;
                        }
                        changeProteinColorOFF("#" + geneMatrix[geneIndex].id.replace(".","_") +
                            "_gene_arrow", geneIndex);
                        changeProteinColorOFF("#" + geneMatrix[geneIndex].id.replace(".","_") +
                            "_protein", geneIndex)
                    },
                    false
                );
                
                
                domainObject_2.addEventListener(
                    'click',
                    function () { // anonyme Funktion
                        if (!(geneMatrix[geneIndex].domains[domainIndex].ko == true)) {
                            domainObject.style.fill = "#E11839";
                            domainObject_2.style.fill = "#E11839";
                        } else {
                            domainObject.style.fill = originalColorDomain;
                            domainObject_2.style.fill = originalColorDomain;
                        }
                        setKoStatus(geneIndex, domainIndex, geneMatrix);
                    },
                    false);
                domainObject_2.addEventListener(
                    'mouseenter',
                    function () { // anonyme Funktion
                        if (!(geneMatrix[geneIndex].domains[domainIndex].ko == true)) {
                            domainObject_2.style.fill = "#E11839";
                            domainObject.style.fill = "#E11839";
                        }
                        displayTextInGeneExplorer(geneMatrix[geneIndex].id);
                        changeProteinColorON("#" + geneMatrix[geneIndex].id.replace(".","_") +
                            "_protein", geneIndex);
                        changeProteinColorON("#" + geneMatrix[geneIndex].id.replace(".","_") +
                            "_gene_arrow", geneIndex);
                    },
                    false
                );
                domainObject_2.addEventListener(
                    'mouseleave',
                    function () { // anonyme Funktion
                        if (!(geneMatrix[geneIndex].domains[domainIndex].ko == true)) {
                            domainObject_2.style.fill = originalColorDomain_2;
                            domainObject.style.fill = originalColorDomain;
                        }
                        changeProteinColorOFF("#" + geneMatrix[geneIndex].id.replace(".","_") +
                            "_gene_arrow", geneIndex);
                        changeProteinColorOFF("#" + geneMatrix[geneIndex].id.replace(".","_") +
                            "_protein", geneIndex)
                    },
                    false
                );
            }}
        }
    }
}

function changeColor(arrowId) {
    /**
    * Change color of an arrow.
   * @fires hoverArrow
   *@input arrowID
   *@yield other color of arrow
   */
    const arrow = document.querySelector(arrowId.replace(".", "_"));
    if (arrow.getAttribute("fill") == "#E11838") {
        arrow.setAttribute('fill', '#ffffff');
    }
    else {
        arrow.setAttribute('fill', "#E11838");
    }
}
function changeDomainColor(domain, domainId) {
    /**
    * Change color of domain.
   * @fires domainArrow
   *@input domain, domainId -> the domain is needed to change the color back to right domain
   *@yield other color of arrow
   */
    const domainObject = document.querySelector(domainId.replace(".", "_"));
    if (domainObject.getAttribute("fill") == "#E11839") {
        if (domain.hasOwnProperty("type")) {
            if (colour_fill_dict.hasOwnProperty(domain.type)) {
                color = colour_fill_dict[domain.type];
                domainObject.setAttribute('fill', color);
            }
            else {
                domainObject.setAttribute('fill', "#025699");
            }
        }
        else {
            domainObject.setAttribute('fill', "#025699");
        }
    }
    else {
        domainObject.setAttribute('fill', "#E11839");
    }
}
function changeProteinColorON(ProteinId, geneIndex) {
    /**
    * Change color of protein.
   * @fires arrowclick
   *@input ProteinId, geneIndex -> find the protein svg as well as corresponding gene
   *@yield other color of protein
   */
    if (geneMatrix[geneIndex].displayed === true) {
        const arrow = document.querySelector(ProteinId.replace(".", "_"));
        arrow.setAttribute('style', "fill: #E11839");
    }
}
function changeProteinColorOFF(ProteinId, geneIndex) {
    /**
    * Change color of protein.
   * @fires arrowclick
   *@input ProteinId, geneIndex -> find the protein svg as well as corresponding gene
   *@yield other color of protein
   */
    if (geneMatrix[geneIndex].displayed === true) {
        const arrow = document.querySelector(ProteinId.replace(".", "_"));
        arrow.removeAttribute("style");
    }
}

function fetchFromRaichuTerpene(){
    updateTerpenes(geneMatrix, BGC)
    let data_string = JSON.stringify({"gene_name_precursor": "terpene-cyclase", "substrate": terpeneSubstrate, "cyclization": splitArrayIntoPairs(cyclization),"tailoring": findTailoringReactions(geneMatrix), "terpene_cyclase_type": "Class_1"})
    let url = port +"api/alola/terpene?antismash_input=";
    let container = document.getElementById("structure_container")
    container.innerHTML = ""
    updateProteins(geneMatrix, BGC);
    addDragDrop();
    fetch(url + encodeURIComponent(data_string))
        .then(response => {
            const handler = response.json();
            return handler
        })
        .then((raichu_output) => {
            if (raichu_output.hasOwnProperty("Error")) {
                let module_container = document.getElementById("module_container")
                module_container.innerHTML = "<strong>" + raichu_output.Error + "</strong>"
                return 0
            }
            terpeneCyclaseOptions = OptionCreator.createOptionsTerpeneCyclase(atomsForCyclisation = JSON.parse(raichu_output.atomsForCyclisation.replaceAll("'", '"')), tailoringSites = JSON.parse(raichu_output.tailoringSites.replaceAll("'", '"')))
            // format output
            //add protase Options
            OptionCreator.createOptionsTailoringEnzymes(geneMatrix, tailoringSites = JSON.parse(raichu_output.tailoringSites.replaceAll("'", '"')))
            updateTerpenes(geneMatrix, BGC)
            addArrowClick(geneMatrix);
            // add final drawing
            let container = document.getElementById("structure_container");
            let smiles_button = document.getElementById("smiles_button");
            var url = "data:image/svg+xml;charset=utf-8," +
                encodeURIComponent(raichu_output.svg);
            document.getElementById("save_complete_cluster_svg")
                .href = url
            document.getElementById("save_complete_cluster_svg")
                .setAttribute("download", raichu_output.smiles + "_cluster.svg");
            var url = "data:image/svg+xml;charset=utf-8," +
                encodeURIComponent(raichu_output.svg);
            document.getElementById("save_svg")
                .href = url
            document.getElementById("save_svg")
                .setAttribute("download", raichu_output.smiles + ".svg");
            container.innerHTML = formatSVG(raichu_output.svg);
            drawing = document.getElementById("final_drawing")
            drawing.style["max-width"] = "100%"
            drawing.style["max-height"] = "100%"
            smiles_button.addEventListener("click", function(){ navigator.clipboard.writeText(raichu_output.smiles)});
            if ((typeof (document.getElementById("innerIntermediateContainer_tailoredProduct")) != 'undefined' && document.getElementById("innerIntermediateContainer_tailoredProduct") != null)) {
                let cyclized_product = document.getElementById("innerIntermediateContainer_cyclizedProduct");
                cyclized_product.setAttribute("style", "width:15vw")
                cyclized_product.innerHTML = formatSVG_intermediates(raichu_output.cyclizedStructure);
                let intermediate_svg = document.getElementById("cyclized_drawing")
                let bbox = intermediate_svg.getBBox();
                let viewBox = [bbox.x, bbox.y, bbox.width, bbox.height].join(" ");

                intermediate_svg.setAttribute("viewBox", viewBox)

                intermediate_svg.setAttribute('id', "intermediate_drawing_cyclisation_terpene");
                intermediate_svg.setAttribute('class', "intermediate_drawing_cyclisation");
                // add precursor
                let precursor = document.getElementById("innerIntermediateContainer_precursor");
                precursor.setAttribute("style", "width:15vw")
                precursor.innerHTML = formatSVG_intermediates(raichu_output.precursor);
                let precursor_svg = document.getElementById("precursor_drawing")
                let precursor_bbox = intermediate_svg.getBBox();
                let precursor_viewBox = [precursor_bbox.x, precursor_bbox.y, precursor_bbox.width, precursor_bbox.height].join(" ");

                precursor_svg.setAttribute("viewBox", precursor_viewBox)

                precursor_svg.setAttribute('id', "intermediate_drawing_precursor");
                precursor_svg.setAttribute('class', "intermediate_drawing_precursor");
                //add cleavage
                let tailored_product = document.getElementById("innerIntermediateContainer_tailoredProduct");
                tailored_product.setAttribute("style", "width:15vw")
                tailored_product.innerHTML = formatSVG_intermediates(raichu_output.structureForTailoring)
                let tailored_svg = document.getElementById("intermediate_drawing")
                let tailored_bbox = intermediate_svg.getBBox();
                let tailored_viewBox = [tailored_bbox.x, tailored_bbox.y, tailored_bbox.width, tailored_bbox.height].join(" ");

                tailored_svg.setAttribute("viewBox", tailored_viewBox)

                tailored_svg.setAttribute('id', "intermediate_drawing_tailored");
                tailored_svg.setAttribute('class', "intermediate_drawing_tailored");
            }

        })
}
function fetchFromRaichuRiPP() {
    updateRiPPs(geneMatrix, BGC)
    let data_string = JSON.stringify({"rippPrecursor":rippPrecursor, "cyclization": cyclization, "tailoring": findTailoringReactions(geneMatrix), "rippPrecursorName": rippPrecursorGene, "rippFullPrecursor": rippFullPrecursor})
    let url = port +"api/alola/ripp?antismash_input=";
    let container = document.getElementById("structure_container")
    container.innerHTML = ""
    updateProteins(geneMatrix, BGC);
    addDragDrop();
    fetch(url + encodeURIComponent(data_string))
        .then(response => {
            const handler = response.json();
            return handler
        })
        .then((raichu_output) => {
            if (raichu_output.hasOwnProperty("Error")) {
                let module_container = document.getElementById("module_container")
                module_container.innerHTML = "<strong>" + raichu_output.Error + "</strong>"
                return 0
            }
            proteaseOptions = raichu_output.aminoAcidsForCleavage
            OptionCreator.createOptionsDomains(geneMatrix, atomsForCyclisation = JSON.parse(raichu_output.atomsForCyclisation.replaceAll("'", '"')))
            // format output
            //add protase Options
            OptionCreator.createOptionsTailoringEnzymes(geneMatrix, tailoringSites = raichu_output.tailoringSites)
            updateRiPPs(geneMatrix, BGC)
            addArrowClick(geneMatrix);
            // add final drawing
            let container = document.getElementById("structure_container");
            let smiles_button = document.getElementById("smiles_button");
            var url = "data:image/svg+xml;charset=utf-8," +
                encodeURIComponent(raichu_output.completeClusterSvg);
            document.getElementById("save_complete_cluster_svg")
                .href = url
            document.getElementById("save_complete_cluster_svg")
                .setAttribute("download", raichu_output.smiles + "_cluster.svg");
            var url = "data:image/svg+xml;charset=utf-8," +
                encodeURIComponent(raichu_output.svg);
            document.getElementById("save_svg")
                .href = url
            document.getElementById("save_svg")
                .setAttribute("download", raichu_output.smiles + ".svg");
            container.innerHTML = formatSVG(raichu_output.svg);
            drawing = document.getElementById("final_drawing")
            drawing.style["max-width"] = "100%"
            drawing.style["max-height"] = "100%"
            smiles_button.addEventListener("click", function () { navigator.clipboard.writeText(raichu_output.smiles) });
            if ((typeof (document.getElementById("innerIntermediateContainer_tailoredProduct")) != 'undefined' && document.getElementById("innerIntermediateContainer_tailoredProduct") != null)) {
                let tailoringEnzymes_intermediate = document.getElementById("innerIntermediateContainer_tailoredProduct");
                tailoringEnzymes_intermediate.setAttribute("style", "width:25vw")
                tailoringEnzymes_intermediate.innerHTML = formatSVG_intermediates(raichu_output.structureForTailoring);
                let intermediate_svg = document.getElementById("intermediate_drawing")
                reformatSVGToBoundary(intermediate_svg)

                intermediate_svg.setAttribute('id', "intermediate_drawing_tailoring");
                intermediate_svg.setAttribute('class', "intermediate_drawing_protease");
                // add precursor
                let precursor = document.getElementById("innerIntermediateContainer_precursor");
                precursor.setAttribute("style", "width:25vw")
                precursor.innerHTML = formatSVG_intermediates(raichu_output.rawPeptideChain);
                let precursor_svg = document.getElementById("precursor_drawing")
                reformatSVGToBoundary(precursor_svg)

                precursor_svg.setAttribute('id', "intermediate_drawing_precursor");
                precursor_svg.setAttribute('class', "intermediate_drawing_precursor");
                //add cleavage
                let cleavage = document.getElementById("innerIntermediateContainer_cleavedProduct");
                cleavage.setAttribute("style", "width:25vw")
                cleavage.innerHTML = formatSVG_intermediates(raichu_output.svg).replaceAll("final_drawing" ,"cleavedProduct");
                let cleavage_svg = document.getElementById("cleavedProduct")
                reformatSVGToBoundary(cleavage_svg)
                cleavage_svg.setAttribute('id', "intermediate_drawing_cleavage");
                cleavage_svg.setAttribute('class', "intermediate_drawing_cleavage");
            }

        })
}
async function fetchFromRaichu(details_data, regionName, geneMatrix, cluster_type, BGC) {
    /**
 * Transforms and transfers all needed data through the api to the backend (raichu) and handles the output.
 * @fires refresh_structure or if real time calculation is enabled every time the input data is altered
 * @param {object} details_data - input from regions.js file
 * @param {string} regionName - "e.g. r1c3 -> region and cluster number"
 * @param {array} geneMatrix - THE collection on data of the different genes
 * @param {string} cluster_type - type of cluster for extraction from gene name
 * @param {string} BGC - the BGC that is being worked on
 * @returns {Promise<void>}
 */
        if (RiPPStatus == 1) {
            fetchFromRaichuRiPP();
        }
        else if (terpeneStatus == 1){
            fetchFromRaichuTerpene();

        }
        else if (details_data.nrpspks.hasOwnProperty(regionName)) {
            let data = "";
            let starterACP = "";
            
                let extracted_results = extractAntismashPredictionsFromRegion(details_data, regionName, geneMatrix);
                data = extracted_results[0];
                starterACP = extracted_results[1];
                // add tailoring reactions
                let tailoringArray = findTailoringReactions(geneMatrix);
                let data_string = JSON.stringify({"clusterRepresentation": data, "cyclization": cyclization, "tailoring": tailoringArray});
                let url = port +"api/alola/nrps_pks?antismash_input=";
                let container = document.getElementById("structure_container");
                container.innerHTML = "";
                updateProteins(geneMatrix, BGC);
                addDragDrop();
            const response = await fetch(url + encodeURIComponent(data_string)); // use await to handle asynchronous request
                const raichu_output = await response.json();
                if (raichu_output.hasOwnProperty("Error")) {
                    let module_container = document.getElementById("module_container");
                    module_container.innerHTML = "<strong>" + raichu_output.Error + "</strong>";
                    return 0;
                }
                OptionCreator.createOptionsDomains(geneMatrix, atomsForCyclisation = JSON.parse(raichu_output.atomsForCyclisation.replaceAll("'", '"')));
                OptionCreator.createOptionsTailoringEnzymes(geneMatrix, tailoringSites = JSON.parse(raichu_output.tailoringSites.replaceAll("'", '"')));
                updateDomains(geneMatrix, BGC);
                addArrowClick(geneMatrix);
                let acpList = getACPList(geneMatrix);
                let intermediates = raichu_output.hangingSvg;
                // structure for tailoring container
                if (typeof document.getElementById("innerIntermediateContainer_tailoring_enzymes") !== 'undefined' && document.getElementById("innerIntermediateContainer_tailoring_enzymes") !== null) {
                    let innerIntermediateContainer_tailoring_enzymes = document.getElementById("innerIntermediateContainer_tailoring_enzymes");
                    innerIntermediateContainer_tailoring_enzymes.setAttribute("style", "width:150px");
                    innerIntermediateContainer_tailoring_enzymes.innerHTML = formatSVG_intermediates(raichu_output.structureForTailoring);
                    let structure_for_tailoring = document.getElementById("tailoring_drawing");
                    let bbox_structure_for_tailoring = structure_for_tailoring.getBBox();
                    let viewBox_structure_for_tailoring = [bbox_structure_for_tailoring.x, bbox_structure_for_tailoring.y, bbox_structure_for_tailoring.width, bbox_structure_for_tailoring.height].join(" ");
                structure_for_tailoring.setAttribute("viewBox", viewBox_structure_for_tailoring);
                structure_for_tailoring.setAttribute('id', "intermediate_drawing_tailoring");
                structure_for_tailoring.setAttribute('class', "intermediate_drawing_tailoring");
            }
            //hanging svgs for spaghetti diagram
            let carrier_x = 0
            var widths = intermediates.map(
                function (element) { return element[3]; }
            );
            max_width = Math.max(...widths)
            for (let intermediateIndex = 0; intermediateIndex <
                intermediates.length; intermediateIndex++) {
                intermediate = intermediates[intermediateIndex][0];
                carrier_x = intermediates[intermediateIndex][1]
                if (starterACP < 1) {
                    starterACP = 1
                }
                let intermediate_container = document.getElementById(
                    'innerIntermediateContainer' + acpList[
                    intermediateIndex + starterACP - 1].replace(".","_") )
                intermediate_container.setAttribute("style", "width:5vw;")
                intermediate_container.innerHTML = formatSVG_intermediates(intermediate);
                let intermediate_svg = document.getElementById("intermediate_drawing")
                let bbox = intermediate_svg.getBBox();
                let viewBox = [bbox.x, bbox.y, max_width, intermediates[intermediateIndex][4]].join(" ");

                intermediate_svg.setAttribute("viewBox", viewBox)
                intermediate_svg.setAttribute("width", max_width)
                intermediate_svg.setAttribute('id', "intermediate_drawing" + intermediateIndex);
                intermediate_svg.setAttribute('class', "intermediate_drawing");
                if (0.05* viewPortWidth <= max_width){
                    intermediate_svg.setAttribute('style', "right: " + (((carrier_x - bbox.x) / max_width) * 5 -700/viewPortHeight) + "vw;");
                }
                else{
                    intermediate_svg.setAttribute('style', "right: " + (carrier_x - bbox.x - 13000/viewPortHeight)+ "px;");
                }

            }
            // add final drawing
            container = document.getElementById("structure_container");
            let smiles_container = document.getElementById("smiles_button");
            var url_complete_cluster = "data:image/svg+xml;charset=utf-8," +
                encodeURIComponent(raichu_output.completeClusterSvg);
            document.getElementById("save_complete_cluster_svg")
                .href = url_complete_cluster
            document.getElementById("save_complete_cluster_svg")
                .setAttribute("download", raichu_output.smiles + "_cluster.svg");
            var url_svg = "data:image/svg+xml;charset=utf-8," +
                encodeURIComponent(raichu_output.svg);
            document.getElementById("save_svg")
                .href = url_svg
            document.getElementById("save_svg")
                .setAttribute("download", raichu_output.smiles + ".svg");
            container.innerHTML = formatSVG(raichu_output.svg);
            drawing = document.getElementById("final_drawing")
            drawing.style["max-width"] = "100%"
            drawing.style["max-height"] = "100%"
            smiles_container.addEventListener("click", (event) => { navigator.clipboard.writeText(raichu_output.smiles)})}
    else{
    let module_container = document.getElementById("module_container");
    module_container.innerHTML = "<strong>" + "This type of BGC is not implemented yet."+ "</strong>";
    }}

function updateSelectedOptionsAfterTailoring(optionArray, geneMatrix, index) {
    /**
    * Change color of domain.
   * @fires fetchFromRaichu
   *@input optionArray-> an array of the selected options
   *@output corrected option array after transformation
   */

    let position_array = []
    for (let tailoringEnzyme of optionArray) {
        position_array = position_array.concat(tailoringEnzyme[1])
    }

    position_array.sort(function (a, b) {
        return Number(a.split("_")[1]) - Number(b.split("_")[1]);

    });
    let updated_positon_array = []
    for (let option of position_array) {
        let splittedOption = option.split("_")
        let position = Number(splittedOption[1])
        let atom = splittedOption[0]
        updated_positon_array.push(atom + "_" + (position + index).toString());
        index++
    }
    let mappingDictionary = {};
    position_array.forEach((key, i) => mappingDictionary[key] = updated_positon_array[i])
    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        if (geneMatrix[geneIndex].tailoringEnzymeStatus == true) {
            for (let option of geneMatrix[geneIndex].selected_option) {
                option = mappingDictionary[option]
            }
        }
    }
    return geneMatrix
}
function updateOptionArray(optionArray, index) {
    /**
    * Change color of domain.
   * @fires fetchFromRaichu
   *@input optionArray-> an array of the selected options, index= how much the options should be moved forwards
   *@output corrected option array for transformation

   */
    let position_array = []
    for (let tailoringEnzyme of optionArray) {
        position_array = position_array.concat(tailoringEnzyme[1])
    }
    position_array.sort(function (a, b) {
        return Number(a.split("_")[1]) - Number(b.split("_")[1]);

    });
    let updated_positon_array = []
    for (let option of position_array) {
        let splittedOption = option.split("_")
        let position = Number(splittedOption[1])
        let atom = splittedOption[0]
        updated_positon_array.push(atom + "_" + (position + index).toString())
        index++
    }
    let mappingDictionary = {};
    position_array.forEach((key, i) => mappingDictionary[key] = updated_positon_array[i])
    for (let tailoringEnzyme of optionArray) {
        let positions = tailoringEnzyme[1]
        let new_positions = []
        for (let position of positions) {
            new_positions.push(mappingDictionary[position])

        }
        tailoringEnzyme.pop()
        tailoringEnzyme.push(new_positions)
    }

    return optionArray
}
function findTailoringReactions(geneMatrix) {
    /**
   * Format an array of all tailoring Arrays of a gene cluster -> just formats all genes already annotated as tailoring enzymes.
   * @fires   fetchFromRaichu, fetchFromRaichuRiPP, fetchFromRaichuTerpene
   * @input geneMatrix
   * @output array of all tayloring enzymes and their corresponding genes
   */
    tailoringArray = []
    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        let enzymeType = geneMatrix[geneIndex].tailoringEnzymeType
        if (geneMatrix[geneIndex].tailoringEnzymeStatus == false) {
            continue }
        for (var [firstparameter, atoms] of Object.entries(geneMatrix[geneIndex].selected_option)){
            let enzymeReactionArray;
            let substrate
            let enzymeNameReaction
            if (tailoringEnzymesWithSubstrate.includes(enzymeType)){
                substrate = firstparameter
                enzymeNameReaction = enzymeType
            }
            else{
                enzymeNameReaction = firstparameter
            }
              // put atoms for bond formation in pairs
            if (tailoringEnzymesWithTwoAtoms.includes(enzymeNameReaction)) {
                atoms =atoms.flat(1)
                if (atoms.length%2 == 1) {
                    atoms.pop()
                }
                let pairedAtoms = [];
                while (atoms.length) pairedAtoms.push(atoms.splice(0, 2));
                atoms = pairedAtoms
            }
            if (tailoringArray.length > 0) {
                for (const enzyme of tailoringArray) {
                    enzymeReactionArray = enzyme.find(item => item.name === enzymeNameReaction)
                    if (enzymeReactionArray) break
                }
            }
            if (enzymeReactionArray) {
                if (atoms.length > 0) {
                    enzymeReactionArray[1].push(atoms);
                }
            }

            else {
                if (atoms.length > 0) {
                    tailoringArray.push([geneMatrix[geneIndex].id, enzymeNameReaction, atoms]);
                }
           }
        }
    }
        return tailoringArray}

function removePaddingBGC(BGC) {
    /**
   * removes the space before the first orf and after last orf
   *@input BGC
   *@output BGC withour padding

   */
    let BGC_with_padding = JSON.parse(JSON.stringify(BGC));
    if (BGC_with_padding.orfs.length != 0) {
        if (BGC_with_padding.orfs[0].start != 0) {
            for (let orfIndex = 0; orfIndex < BGC_with_padding.orfs.length; orfIndex++) {
                BGC_with_padding.orfs[orfIndex].start = BGC_with_padding.orfs[
                    orfIndex].start - BGC.start
                BGC_with_padding.orfs[orfIndex].end = BGC_with_padding.orfs[
                    orfIndex].end - BGC.start
            }
        }
    }
    return BGC_with_padding
}
function removeSpaceBetweenProteins(BGC) {
    /**
   * removes the space between orfs
   *@input BGC
   *@output BGC withour padding

   */
    let margin = 100;
    let BGC_without_space = JSON.parse(JSON.stringify(BGC));
    for (let orfIndex = 0; orfIndex < BGC_without_space.orfs.length; orfIndex++) {
        let orf_length = BGC_without_space.orfs[orfIndex].end -
            BGC_without_space.orfs[orfIndex].start
        BGC_without_space.orfs[orfIndex].start = 0
        BGC_without_space.orfs[orfIndex].end = BGC_without_space.orfs[orfIndex]
            .start + orf_length

    }
    return BGC_without_space;
}
function updateProteins(geneMatrix, BGC) {
    /**
   * update Proteins to geneMAtrix to remove for instance ko genes and then calls the proteiner to draw the proteins
   *@input BGC,geneMatrix
   */
    let proteinsForDisplay = JSON.parse(JSON.stringify(BGC));
    delete proteinsForDisplay.orfs
    proteinsForDisplay.orfs = []
    geneMatrix.sort((a, b) => {
        return a.position - b.position;
    });
    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        if (geneMatrix[geneIndex].displayed == true) {
            proteinsForDisplay.orfs.push(BGC.orfs[geneMatrix[geneIndex].position_in_BGC -
                1]);
        }
    }
    $("#protein_container")
        .html(Proteiner.drawClusterSVG(removePaddingBGC(
            removeSpaceBetweenProteins(proteinsForDisplay)), height =
        viewPortHeight*0.07));
    addDragDrop();
}
function getACPList(geneMatrix) {
    /**
   * Get list of ACP/PCP to attach the intermediates to it.
   *@input geneMatrix
   * @output acp List
   */
    let acpList = []
    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        if (geneMatrix[geneIndex].ko == false && geneMatrix[geneIndex].domains.length !=
            0 && (geneMatrix[geneIndex].hasOwnProperty(
                "modules") || biosyntheticCoreEnzymes.includes(geneMatrix[geneIndex].orffunction) || geneMatrix[geneIndex].type.includes("biosynthetic"))) {
            for (let domainIndex = 0; domainIndex < geneMatrix[geneIndex].domains
                .length; domainIndex++) {
                if (geneMatrix[geneIndex].domains[domainIndex].ko == false || geneMatrix[geneIndex].domains[domainIndex].ko == "None") {
                    if ((geneMatrix[geneIndex].domains[domainIndex].type.includes(
                        "ACP") || geneMatrix[geneIndex].domains[domainIndex]
                            .type.includes("PP") || geneMatrix[geneIndex].domains[domainIndex]
                                .type.includes("PCP")) && !(geneMatrix[geneIndex].domains[domainIndex]
                                    .type.includes("ACPS"))) {
                        acpList.push(geneMatrix[geneIndex].domains[domainIndex]
                            .identifier)

                    }
                }
            }
        }
    }
    return acpList;
}
// only display proteins with domains in domain explorer
function updateDomains(geneMatrix, BGC) {
    /**
   * update Proteins to geneMAtrix to remove for instance ko genes and paint ko domains red and then calls the domainer to draw the domains
   *@input BGC,geneMatrix
   */
    let domainsForDisplay = JSON.parse(JSON.stringify(BGC));
    delete domainsForDisplay.orfs
    domainsForDisplay.orfs = []
    geneMatrix.sort((a, b) => {
        return a.position - b.position;
    });
    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        if (geneMatrix[geneIndex].displayed == true && geneMatrix[geneIndex].domains
            .length != 0) {
            domainsForDisplay.orfs.push(BGC.orfs[geneMatrix[geneIndex].position_in_BGC -
                1]);
        }
    }
    $("#Domain_container")
        .html(Domainer.drawClusterSVG(removePaddingBGC(
            removeSpaceBetweenProteins(domainsForDisplay)), height = viewPortHeight * 0.09));
    addDragDrop();
}
function updateRiPPs(geneMatrix, BGC) {
    /**
   * update Proteins to geneMAtrix to remove for instance ko genes and paint ko domains red and then calls the domainer to draw the domains
   *@input BGC,geneMatrix
   */
    let genesForDisplay = JSON.parse(JSON.stringify(BGC));
    delete genesForDisplay.orfs
    genesForDisplay.orfs = []
    geneMatrix.sort((a, b) => {
        return a.position - b.position;
    });
    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        if (geneMatrix[geneIndex].displayed == true && geneMatrix[geneIndex].domains
            .length != 0) {
            genesForDisplay.orfs.push(BGC.orfs[geneMatrix[geneIndex].position_in_BGC -
                1]);
        }
    }
    $("#Domain_container")
        .html(RiPPer.drawCluster(genesForDisplay, geneMatrix, proteaseOptions), height =
            viewPortHeight * 0.05, proteaseOptions);
    addDragDrop();
}
function updateTerpenes(geneMatrix, BGC) {
    /**
   * update Proteins to geneMAtrix to remove for instance ko genes and paint ko domains red and then calls the domainer to draw the domains
   *@input BGC,geneMatrix
   */
    let genesForDisplay = JSON.parse(JSON.stringify(BGC));
    delete genesForDisplay.orfs
    genesForDisplay.orfs = []
    geneMatrix.sort((a, b) => {
        return a.position - b.position;
    });
    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        if (geneMatrix[geneIndex].displayed == true && geneMatrix[geneIndex].domains
            .length != 0) {
            genesForDisplay.orfs.push(BGC.orfs[geneMatrix[geneIndex].position_in_BGC -
                1]);
        }
    }
    $("#Domain_container")
        .html(Terpener.drawCluster(genesForDisplay, geneMatrix), height =
            viewPortHeight * 0.05);
    addDragDrop();
}
function setKoStatus(geneIndex, domainIndex, geneMatrix) {
    /**
    * Knocks out domains.
   * @fires clickondomain
   *@input geneIndex, domainIndex, geneMatrix -> gene matrix+ indices
   *@yield changes status in gene matrix + if the real time calculation is checked also fetch from raichu to update structures
   */
    if (geneMatrix[geneIndex].domains[domainIndex].ko === false || geneMatrix[geneIndex].domains[domainIndex].ko == "") {
        geneMatrix[geneIndex].domains[domainIndex].ko = true;
    }
    else {
        geneMatrix[geneIndex].domains[domainIndex].ko = false;
    }
    if (document.querySelector('input[type=checkbox]')
        .checked) {
        fetchFromRaichu(details_data, regionName, geneMatrix, cluster_type, BGC)
    }
}
function setDisplayedStatus(id, geneMatrix) {
    /**
    * knocks out genes.
   * @fires clickongene
   *@input id of gene, gene matrix
   *@yield changes status in gene matrix + if the real time calculation is checked also fetch from raichu to update structures
   */
    id.slice(-11, -1);
    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        if (geneMatrix[geneIndex].id === id) {
            if (geneMatrix[geneIndex].displayed === false) {
                geneMatrix[geneIndex].displayed = true;
                geneMatrix[geneIndex].ko = false;
            }
            else {
                geneMatrix[geneIndex].displayed = false;
                geneMatrix[geneIndex].ko = true;
            }
        }
    }
}
function createButtonsForEachRegion() {
    let listRegions = [];
    let listTypes = [];

    for (const record of recordData) {
        for (let index = 0; index < record.regions.length; index++) {
            listRegions.push(record.regions[index].anchor);
            listTypes.push(record.regions[index].type);
        }
    }

    let regionsBar = document.getElementById("regionsBar");
    let innerHTML = "";

    for (let index = 0; index < listRegions.length; index++) {
        let region = listRegions[index];
        let type = listTypes[index];
        innerHTML += `<button type='button' id ='buttonRegion_${region}' class= 'regionButton' onclick=changeRegionTo("${region}")><strong>${region.toUpperCase()} <br /> ${type}</strong></button>`;
    }

    regionsBar.innerHTML = innerHTML;
}

function getClusterType(regionIndex){
let type = recordData[recordIndex].regions[regionIndex].type;
    if (type.includes("PKS") || type.includes("NRPS") || type.includes("Fatty_acid")){
        document.getElementById("add_module_button").style.display = "block";
        return "nrpspks"
    }
    if (type.includes("Terpene")) {
        return "terpene"
    }
    if (type.includes("peptide")) {
        return "peptide"
    }
    if (RiPPStatus == 1){
        return "ripp"
    }
    return "misc"
}
function getRegionName(regionIndex, recordIndex){
    return recordData[recordIndex].regions[regionIndex].anchor
}
function getFirstRegion(recordData){
    let record_index = 0
    for (const record of recordData) {

        for (let region_index = 0; region_index < record.regions.length; region_index++) {
            return [region_index, record_index]
        }
        record_index++
    }

}
function changeRegion(direction){
  regionIndex += direction
  runAlola(regionIndex, recordIndex, details_data, recordData)
}
function changeRegionTo(regionName){
  [regionIndex, recordIndex] = selectRegion(recordData, regionName)
  runAlola(regionIndex, recordIndex, details_data, recordData)
}
function selectRegion(recordData, regionName) {
    /**
    * Select the index of region from name
   * @fires fetchFromRaichu
   *@input name of region
   *@output index of region
   */
    let record_index = 0
    for (const record of recordData) {
        
        for (let region_index = 0; region_index < record.regions.length; region_index++) {
            if (record.regions[region_index].anchor == regionName) {
                return [region_index, record_index]
            }
        }
        record_index++
    }
}
function openForm() {
    /**
    *opens wildcard dialog

   */
    //
    document.getElementById("popupForm").style.display = "block";
}
function closeForm() {
    document.getElementById("popupForm").style.display = "none";
}
function openTailoringForm() {
    /**
    *opens wildcard dialog

   */
    //
    document.getElementById("popupFormTailoring").style.display = "block";
}
function closeTailoringForm() {
    document.getElementById("popupFormTailoring").style.display = "none";
}
function showImpressum() {
    var popup = document.getElementById("popupImpressum");
    if (popup.style.display == "block"){
        popup.style.display = "none";
    }
    else { popup.style.display = "block";}   
}

document.getElementById('openAlolaManual').addEventListener('click', function() {
    window.location.href = ('./Alola_Manual_new.html');
});
    

function openNRPSForm() {
    document.getElementById("popupFormNRPS").style.display = "block";
}
function closeNRPSForm() {
    document.getElementById("popupFormNRPS").style.display = "none";
}
function openRiPPForm() {
    document.getElementById("popupFormRiPP").style.display = "block";


}
function closeRiPPForm() {
    document.getElementById("popupFormRiPP").style.display = "none";
}
function openFormTerpene(){
    document.getElementById("popupFormTerpene").style.display = "block";
}
function closeFormTerpene() {
    document.getElementById("popupFormTerpene").style.display = "none";
}
function addRiPPPrecursorOptions(geneMatrix){
    let innerHTML = ""
    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        id = geneMatrix[geneIndex].id.replace(".", "_")
        innerHTML += "<button class='wildcardsubstrate' type='button' id='" + id + "_ripp_button' onclick='setRiPPPrecursor(\x22" + geneIndex + "\x22)'>" + id + "</button>"
    }

    document.getElementById("ripp_precursor_selection").innerHTML=innerHTML
}
function addRiPP(geneMatrix,rippSelection){
    RiPPStatus = 1;
    terpeneStatus = 0;
    terpeneCyclaseOptions = [];
    cyclization = [];
    geneIndex = rippPrecursorGene
    geneMatrix[geneIndex].ripp_status = true;
    let translation = ""
    // for antismash 7.0 files
    if (BGCForDisplay["orfs"][geneIndex].hasOwnProperty("translation")){
        translation = BGCForDisplay["orfs"][geneIndex].translation}
    // for antismash 6.0 files
    else {
        var regExString = new RegExp("(?:QUERY=)((.[\\s\\S]*))(?:&amp;LINK_LOC)", "ig"); //set ig flag for global search and case insensitive
        var translationSearch = regExString.exec(BGCForDisplay["orfs"][geneIndex].description);
        translation = translationSearch[1]; //is the matched group if found
    }
    //add protase Options
    let aminoacidsWithNumer = []
    for (let aminoAcidIndex = 0; aminoAcidIndex< translation.length; aminoAcidIndex ++){
        aminoacidsWithNumer.push(translation[aminoAcidIndex]+String(aminoAcidIndex+1))
    }
     terpeneCyclaseOptions = []
     terpeneCyclaseOptions = addStringToArray("Proteolytic cleavage at ",  terpeneCyclaseOptions.concat(aminoacidsWithNumer));
    rippFullPrecursor = translation
    if (rippSelection.length>0){
        rippPrecursor = rippSelection;
    }
    else{
        rippPrecursor = translation.slice(-5)// default only last 5 amino acids
    }
    fetchFromRaichu(details_data, regionName, geneMatrix, cluster_type, BGC);
    window.rippSelection = ""
    let textarea = document.querySelector('textarea');
    textarea.value = "";
}
function addTerpene(substrate){
    terpeneStatus = 1;
    terpeneSubstrate = substrate;
    cyclization = []
}
function setRiPPPrecursor(geneIndex) {
    rippPrecursorGene = geneIndex;
    let textarea = document.querySelector('textarea');
    let translation = "";
    // for antismash 7.0 files
    if (BGCForDisplay["orfs"][geneIndex].hasOwnProperty("translation")) {
        translation = BGCForDisplay["orfs"][geneIndex].translation;
    }
    // for antismash 6.0 files
    else {
        var regExString = new RegExp("(?:QUERY=)((.[\\s\\S]*))(?:&amp;LINK_LOC)", "ig"); //set ig flag for global search and case insensitive
        var translationSearch = regExString.exec(BGCForDisplay["orfs"][geneIndex].description);
        translation = translationSearch[1]; //is the matched group if found
    }
    textarea.value = translation;
}
function openPKSForm() {
    document.getElementById("popupFormPKS").style.display = "block";
}
function closePKSForm() {
    document.getElementById("popupFormPKS").style.display = "none";
}
function displayGenes(BGC) {
    // display BGC in BGC explorer
    let BGCForDisplay = JSON.parse(JSON.stringify(BGC));
    for (let geneIndex = 0; geneIndex < BGCForDisplay["orfs"].length; geneIndex++) {
        delete BGCForDisplay["orfs"][geneIndex]["domains"];
    }
    $("#arrow_container")
        .html(Arrower.drawClusterSVG(removePaddingBGC(BGCForDisplay), height =
            viewPortHeight * 0.05));
    return BGCForDisplay
}
function setColorOfDropDown(button) {
    let targets = document.getElementsByClassName("wildcardsubstrate");
    for (let index = 0; index < targets.length; index++) {

        let target = targets[index]
        target.removeAttribute("style");
    }
    button.setAttribute("style", "background-color: #E11839")
}
//everything to do with the wildcard modules
function setWildcardSubstrate(substrate) {
    wildcardSubstrate = substrate
    let button = findButtonbyTextContent(substrate)
    setColorOfDropDown(button)
}
function setWildcardTailoring(enzyme) {
    wildcardEnzyme = enzyme
    let button = findButtonbyTextContent(enzyme)
    setColorOfDropDown(button)
}
function setWildcardModule(moduleType) {
    wildcardModule = moduleType;

    return wildcardModule
}
/**
 * Adds a wildcard module to the gene matrix and the raw data (BGC).
 * This function modifies the gene matrix, BGC, and related data structures.
 * It adds a custom gene with a wildcard tailoring enzyme, updating various properties.
 * @fires wildcarddialog -> related UI element triggering the function
 * @input geneMatrix - The existing gene matrix data structure
 * @output Modifies geneMatrix, BGC, and related data structures
 */
function addWildcardTailoring(geneMatrix) {
    // Calculate the end position of the last gene in the BGC
    let endLastGene = 0;
    if (BGC.orfs.length > 0) {
        endLastGene = BGC.orfs[BGC.orfs.length - 1].end;
    }

    // Update BGC end position and wildcard enzyme name
    BGC.end += 900;
    nameWildcardEnzyme += "_I";

    // Create a new wildcard gene object
    let wildcard_gene = {
        antismashArray: [],
        default_option: [],
        start: endLastGene,
        end: endLastGene +900,
        locus_tag: nameWildcardEnzyme,
        displayed: true,
        tailoringEnzymeStatus: true,
        tailoringEnzymeType: wildcardEnzyme,
        tailoringEnzymeAbbreviation: tailoringEnzymes[wildcardEnzyme],
        orffunction:wildcardEnzyme,
        type: "",
        domains: [],
        strand: 1,
        description: "Custom Gene",
        id: nameWildcardEnzyme,
        ko: false,
        options: [],
        position: geneMatrix.length + 1,
        position_in_BGC: geneMatrix.length + 1,
        selected_option: [],
        modules: []
    };

    // Add the wildcard gene to geneMatrix, BGC, and details_data  
    geneMatrix.push(wildcard_gene);
    BGC.orfs.push(wildcard_gene);
    if (details_data.hasOwnProperty(cluster_type)) {
        details_data[cluster_type][regionName].orfs.push(wildcard_gene);
    } else {
        details_data[regionName].orfs.push(wildcard_gene);
    }

    // Update the UI and related components
    displayGenes(BGC);
    updateProteins(geneMatrix, BGC);
    if (RiPPStatus == 0) { 
        updateDomains(geneMatrix, BGC); 
    } else { 
        updateRiPPs(geneMatrix, BGC);
    }
    addArrowClick(geneMatrix);
    fetchFromRaichu(details_data, regionName, geneMatrix, cluster_type, BGC);
}

function addWildcard(geneMatrix) {
    /**
    *adds a wildcard module to the gene Matrix+ to the raw data (BGC)
   * @fires wildcarddialog
   *@input geneMatrix)
   *@output different BGC, geneMatrix
   */
    let defaultCDomain = {
        "type": "Condensation",
        "start": 4,
        "end": 302,
        "predictions": [],
        "napdoslink": "http://napdos.ucsd.edu/cgi-bin/process_request.cgi?query_type=aa&amp;ref_seq_file=all_C_public_12062011.faa&amp;Sequence=%3EC_domain_from_antiSMASH%0DFYPLTNAQKRIWYTEKFYPNTSISNLAGFGKLISEDGVQAHYVEKAIQEFVRRYESMRIRLRLDDEGEPVQYVSEYRPLSIGHTDIRQAGCSADELSKWGREEAGKPLALYDQDLFRFSVHTISENEVWFYANVHHIISDGISMTILGNAITDIYLELSGGTSEEQTEIPSFIEHVLTEQEYVQSKRFKKDRDFWNGQFETVPELVSLKRSQADAGLDAKRFSQEIPHDLYGRIHSFCEEHKVSVLSLFQSALITYLYKVTGRDDVVTGTFMGNRTNAKEKQMLGMFVSTVPVRTSVD",
        "blastlink": "http://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Proteins&amp;PROGRAM=blastp&amp;BLAST_PROGRAMS=blastp&amp;QUERY=FYPLTNAQKRIWYTEKFYPNTSISNLAGFGKLISEDGVQAHYVEKAIQEFVRRYESMRIRLRLDDEGEPVQYVSEYRPLSIGHTDIRQAGCSADELSKWGREEAGKPLALYDQDLFRFSVHTISENEVWFYANVHHIISDGISMTILGNAITDIYLELSGGTSEEQTEIPSFIEHVLTEQEYVQSKRFKKDRDFWNGQFETVPELVSLKRSQADAGLDAKRFSQEIPHDLYGRIHSFCEEHKVSVLSLFQSALITYLYKVTGRDDVVTGTFMGNRTNAKEKQMLGMFVSTVPVRTSVD&amp;LINK_LOC=protein&amp;PAGE_TYPE=BlastSearch",
        "sequence": "FYPLTNAQKRIWYTEKFYPNTSISNLAGFGKLISEDGVQAHYVEKAIQEFVRRYESMRIRLRLDDEGEPVQYVSEYRPLSIGHTDIRQAGCSADELSKWGREEAGKPLALYDQDLFRFSVHTISENEVWFYANVHHIISDGISMTILGNAITDIYLELSGGTSEEQTEIPSFIEHVLTEQEYVQSKRFKKDRDFWNGQFETVPELVSLKRSQADAGLDAKRFSQEIPHDLYGRIHSFCEEHKVSVLSLFQSALITYLYKVTGRDDVVTGTFMGNRTNAKEKQMLGMFVSTVPVRTSVD",
        "dna_sequence": "ATG",
        "abbreviation": "C",
        "html_class": "jsdomain-condensation",
        "identifier": nameWildcardModule + "_C",
        "domainOptions": [],
        "default_option": [],
        "selected_option": [],
        "ko": false,
        "module": nameWildcardModule,
        "function": "C"
    }
    let defaultADomain = {
        "type": "AMP-binding",
        "start": 465,
        "end": 867,
        "predictions": [
            [
                "consensus",
                Object.keys(aminoacids).find(key => aminoacids[key] === wildcardSubstrate)

            ]
        ],
        "napdoslink": "",
        "blastlink": "http://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Proteins&amp;PROGRAM=blastp&amp;BLAST_PROGRAMS=blastp&amp;QUERY=FEEKVKSLSDKPAVVYEGRTLSYRTLHEQSGRIAGRLLQAGISADSPVAVLLGRSERVIAAILGILKAGGAYVPIDPDFPADRIQYILEDSGAKAVLTEAGIQAPAADAERIDFNEAVQYETAADGVSTQSDRLAYIIYTSGTTGRPKGVMIEHRQVHHLVQSLQQEIYQCGEQTLRMALLAPFHFDASVKQIFASLLLGQTLYIVPKTTVTNGSALLDYYRQNRIEATDGTPAHLQMMVAAGDVSGIELRHMLIGGEGLSAAVAEQLMTLFHQSGRTPRLTNVYGPTETCVDASVHQMSADNGMNQQAAYVPIGKPLGNARLYILDKHQRLQPDGTAGELYIAGDGVGRGYLNLPDLTAEKFLQDPFNGNGRMYRTGDMARWLPDGTIEYIGREDDQVKVR&amp;LINK_LOC=protein&amp;PAGE_TYPE=BlastSearch",
        "sequence": "FEE",
        "dna_sequence": "ATGGTCATTCTCTCGAATTTCATGAAAGAACCATTCAATCGTTCAGTGACAGCTTTAAAGGGCACCTCTTGAAAATCATAGATCACTGCCTGGCCCAAGACGGACCTGAGCTTACGCCTAGCGATCTTGGCGATGATGATCTGACGCTTGATGAACTTGATAAATTAATGGAAATTCTCTAA",
        "abbreviation": "A",
        "html_class": "jsdomain-adenylation",
        "identifier": nameWildcardModule + "_A",
        "domainOptions": [
            "arginine",
            "histidine",
            "lysine",
            "asparticacid",
            "glutamicacid",
            "serine",
            "threonine",
            "asparagine",
            "glutamine",
            "cysteine",
            "selenocysteine",
            "glycine",
            "proline",
            "alanine",
            "valine",
            "isoleucine",
            "leucine",
            "methionine",
            "phenylalanine",
            "tyrosine",
            "tryptophan"
        ],
        "default_option": wildcardSubstrate,
        "selected_option": [],
        "ko": false,
        "module": nameWildcardModule,
        "function": "A",
        "substrate": wildcardSubstrate
    }
    let defaultPCPDomain = {
        "type": "PCP",
        "abbreviation": "PCP",
        "start": 976,
        "end": 1045,
        "predictions": [],
        "napdoslink": "",
        "blastlink": "http://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Proteins&amp;PROGRAM=blastp&amp;BLAST_PROGRAMS=blastp&amp;QUERY=EETLAVIWQEVLGMDKAGIYDHFFESGGHSLKAMTLLTKIHKQMGVEIPLQYLFEHPTIAALADYAENR&amp;LINK_LOC=protein&amp;PAGE_TYPE=BlastSearch",
        "sequence": "E",
        "dna_sequence": "ATG",
        "html_class": "jsdomain-transport",
        "identifier": nameWildcardModule + "_PCP",
        "domainOptions": [],
        "default_option": [],
        "selected_option": [],
        "ko": false,
        "module": nameWildcardModule,
        "function": "PCP"
    }
    let defaultACPDomain = {
        "type": "ACP",
        "abbreviation": "ACP",
        "start": 2200,
        "end": 2300,
        "predictions": [],
        "napdoslink": "",
        "blastlink": "http://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Proteins&amp;PROGRAM=blastp&amp;BLAST_PROGRAMS=blastp&amp;QUERY=EETLAVIWQEVLGMDKAGIYDHFFESGGHSLKAMTLLTKIHKQMGVEIPLQYLFEHPTIAALADYAENR&amp;LINK_LOC=protein&amp;PAGE_TYPE=BlastSearch",
        "sequence": "E",
        "dna_sequence": "ATG",
        "html_class": "jsdomain-transport",
        "identifier": nameWildcardModule + "_ACP",
        "domainOptions": [],
        "default_option": [],
        "selected_option": [],
        "ko": false,
        "module": nameWildcardModule,
        "function": "ACP"
    }
    let defaultTEDomain = {
        "type": "Thioesterase",
        "start": 2350,
        "end": 2550,
        "predictions": [],
        "napdoslink": "",
        "blastlink": "http://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Proteins&amp;PROGRAM=blastp&amp;BLAST_PROGRAMS=blastp&amp;QUERY=TLFAFPPVLGYGLMYQPLAKQLSGYKICAFDFIEEDNRIERYTELINQLQPEGPVKLFGYSAGCTLAFETAKRLEAGGREVERLIMVDSYKKQGVSDLEGRTVESDVQALMKVNRDNEALNNEAVKEGLAKKTNAFYSYFVHTVSTGRVNADIDLLTSEPDFAMPPWLASWEEATTGEYRVKKGCGTHAEMLQGE&amp;LINK_LOC=protein&amp;PAGE_TYPE=BlastSearch",
        "sequence": "TLFAFPPVLGYGLMYQPLAKQLSGYKICAFDFIEEDNRIERYTELINQLQPEGPVKLFGYSAGCTLAFETAKRLEAGGREVERLIMVDSYKKQGVSDLEGRTVESDVQALMKVNRDNEALNNEAVKEGLAKKTNAFYSYFVHTVSTGRVNADIDLLTSEPDFAMPPWLASWEEATTGEYRVKKGCGTHAEMLQGE",
        "dna_sequence": "",
        "abbreviation": "TE",
        "html_class": "jsdomain-terminal",
        "identifier": nameWildcardModule + "_TE",
        "domainOptions": [
            "O_131",
            "O_4",
            "O_61",
            "N_125",
            "Linear product"
        ],
        "default_option": [
            "Linear product"
        ],
        "selected_option": [],
        "ko": false,
        "module": nameWildcardModule,
        "function": "TE",

    }
    let defaultEDomain = {
        "type": "Epimerization",
        "start": 3122,
        "end": 3421,
        "predictions": [],
        "napdoslink": "",
        "blastlink": "http://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Proteins&amp;PROGRAM=blastp&amp;BLAST_PROGRAMS=blastp&amp;QUERY=EGEAALTPIQRWFFEKNFTDKHHWNQSVMLHAKDGFDPEITEKTLHVLTVHHDALRMIYREQKPYYRGLEDASVELNVFELNGPAEDHEDRIEREADRLQSSISLETGHLLKAGLFRAEDGDHLLLAIHHLVVDGVSWRILLEDFTSVYTQLKQGNEPALPPKTHSFAEFAERIKEYANTKAFLKEADYWRELEEKEVCTQLPKDRQSGDQRMRHTRTVSFSLTPEQTEQLTTNVHEAYHTEMNDILLTALGLALKEWTGEDTIGVHLEGHGREDILDGLNITRTVGWFTSMYPMILEM&amp;LINK_LOC=protein&amp;PAGE_TYPE=BlastSearch",
        "sequence": "EGEAALTPIQRWFFEKNFTDKHHWNQSVMLHAKDGFDPEITEKTLHVLTVHHDALRMIYREQKPYYRGLEDASVELNVFELNGPAEDHEDRIEREADRLQSSISLETGHLLKAGLFRAEDGDHLLLAIHHLVVDGVSWRILLEDFTSVYTQLKQGNEPALPPKTHSFAEFAERIKEYANTKAFLKEADYWRELEEKEVCTQLPKDRQSGDQRMRHTRTVSFSLTPEQTEQLTTNVHEAYHTEMNDILLTALGLALKEWTGEDTIGVHLEGHGREDILDGLNITRTVGWFTSMYPMILEM",
        "dna_sequence": "",
        "abbreviation": "E",
        "html_class": "jsdomain-epimerase",
        "identifier": nameWildcardModule + "_E",
        "domainOptions": [],
        "default_option": [],
        "selected_option": [],
        "ko": false,
        "module": nameWildcardModule,
        "function": "E"
    }
    let defaultERDomain = {
        "type": "PKS_ER",
        "start": 1800,
        "end": 2100,
        "predictions": [],
        "napdoslink": "",
        "blastlink": "http://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Proteins&amp;PROGRAM=blastp&amp;BLAST_PROGRAMS=blastp&amp;QUERY=EGEAALTPIQRWFFEKNFTDKHHWNQSVMLHAKDGFDPEITEKTLHVLTVHHDALRMIYREQKPYYRGLEDASVELNVFELNGPAEDHEDRIEREADRLQSSISLETGHLLKAGLFRAEDGDHLLLAIHHLVVDGVSWRILLEDFTSVYTQLKQGNEPALPPKTHSFAEFAERIKEYANTKAFLKEADYWRELEEKEVCTQLPKDRQSGDQRMRHTRTVSFSLTPEQTEQLTTNVHEAYHTEMNDILLTALGLALKEWTGEDTIGVHLEGHGREDILDGLNITRTVGWFTSMYPMILEM&amp;LINK_LOC=protein&amp;PAGE_TYPE=BlastSearch",
        "sequence": "EGEAALTPIQRWFFEKNFTDKHHWNQSVMLHAKDGFDPEITEKTLHVLTVHHDALRMIYREQKPYYRGLEDASVELNVFELNGPAEDHEDRIEREADRLQSSISLETGHLLKAGLFRAEDGDHLLLAIHHLVVDGVSWRILLEDFTSVYTQLKQGNEPALPPKTHSFAEFAERIKEYANTKAFLKEADYWRELEEKEVCTQLPKDRQSGDQRMRHTRTVSFSLTPEQTEQLTTNVHEAYHTEMNDILLTALGLALKEWTGEDTIGVHLEGHGREDILDGLNITRTVGWFTSMYPMILEM",
        "dna_sequence": "",
        "abbreviation": "ER",
        "html_class": "jsdomain-epimerase",
        "identifier": nameWildcardModule + "_ER",
        "domainOptions": [],
        "default_option": [],
        "selected_option": [],
        "ko": false,
        "module": nameWildcardModule,
        "function": "ER"
    }
    let defaultKRDomain = {
        "type": "PKS_KR",
        "start": 1000,
        "end": 1300,
        "predictions": [
            [
                "KR activity",
                "active"
            ],
            ["KR stereochemistry", "B2"
            ]
        ],
        "napdoslink": "",
        "blastlink": "http://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Proteins&amp;PROGRAM=blastp&amp;BLAST_PROGRAMS=blastp&amp;QUERY=GTILVTGGTAGLGAEVARWLAGRGAEHLALVSRRGPDTEGVGDLTAELTRLGARVSVHACDVSSREPVRELVHGLIEQGDVVRGVVHAAGLPQQVAINDMDEAAFDEVVAAKAGGAVHLDELCSDAELFLLFSSGAGVWGSARQGAYAAGNAFLDAFARHRRGRGLPATSVAWGLWA&amp;LINK_LOC=protein&amp;PAGE_TYPE=BlastSearch",
        "sequence": "G",
        "dna_sequence": "GTG",
        "abbreviation": "KR",
        "html_class": "jsdomain-mod-kr",
        "identifier": nameWildcardModule + "_KR",
        "domainOptions": [
            "A1",
            "A2",
            "B1",
            "B2",
            "C1",
            "C2"
        ],
        "default_option": "A1",
        "selected_option": [],
        "ko": false,
        "module": nameWildcardModule,
        "function": "KR"
    }
    let defaultATDomain = {
        "type": "PKS_AT",
        "start": 110,
        "end": 404,
        "predictions": [
            [
                "consensus",
                "pk"
            ],
            [
                "PKS signature",
                "Malonyl-CoA"
            ],
            [
                "Minowa",
                "prop"
            ]
        ],
        "napdoslink": "",
        "blastlink": "http://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Proteins&amp;PROGRAM=blastp&amp;BLAST_PROGRAMS=blastp&amp;QUERY=VFPGQGAQWAGMAGELLGESRVFAAAMDACARAFEPVTDWTLAQVLDSPEQSRRVEVVQPALFAVQTSLAALWRSFGVTPDAVVGHSIGELAAAHVCGAAGAADAARAAALWSREMIPLVGNGDMAAVALSADEIEPRIARWDDDVVLAGVNGPRSVLLTGSPEPVARRVQELSAEGVRAQVINVSMAAHSAQVDDIAEGMRSALAWFAPGGSEVPFYASLTGGAVDTRELVADYWRRSFRLPVRFDEAIRSALEVGPGTFVEASPHPVLAAALQQTLDAEGSSAAVVPTLQRG&amp;LINK_LOC=protein&amp;PAGE_TYPE=BlastSearch",
        "sequence": "V",
        "dna_sequence": "GTG",
        "abbreviation": "AT",
        "html_class": "jsdomain-acyltransferase",
        "identifier": nameWildcardModule + "_AT",
        "domainOptions": [
            "methylmalonylcoa",
            "propionylcoa",
            "malonylcoa"
        ],
        "default_option": "malonylcoa",
        "selected_option": [],
        "ko": false,
        "module": nameWildcardModule,
        "function": "AT",
        "substrate": wildcardSubstrate
    }
    let defaultKSDomain = {
        "type": "PKS_KS(Modular-KS)",
        "start": 559,
        "end": 983,
        "predictions": [],
        "napdoslink": "http://napdos.ucsd.edu/cgi-bin/process_request.cgi?query_type=aa&amp;ref_seq_file=all_KS_public_12062011.faa&amp;Sequence=%3EKS_domain_from_antiSMASH%0DVAVVAMACRLPGGVSTPEEFWELLSEGRDAVAGLPTDRGWDLDSLFHPDPTRSGTAHQRGGGFLTEATAFDPAFFGMSPREALAVDPQQRLMLELSWEVLERAGIPPTSLQASPTGVFVGLIPQEYGPRLAEGGEGVEGYLMTGTTTSVASGRIAYTLGLEGPAISVDTACSSSLVAVHLACQSLRRGESSLAMAGGVTVMPTPGMLVDFSRMNSLAPDGRCKAFSAGANGFGMAEGAGMLLLERLSDARRNGHPVLAVLRGTAVNSDGASNGLSAPNGRAQVRVIQQALAESGLGPADIDAVEAHGTGTRLGDPIEARALFEAYGRDREQPLHLGSVKSNLGHTQAAAGVAGVIKMVLAMRAGTLPRTLHASERSKEIDWSSGAISLLDEPEPWPAGARPRRAGVSSFGISGTNAHAIIEEAP",
        "blastlink": "http://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Proteins&amp;PROGRAM=blastp&amp;BLAST_PROGRAMS=blastp&amp;QUERY=VAVVAMACRLPGGVSTPEEFWELLSEGRDAVAGLPTDRGWDLDSLFHPDPTRSGTAHQRGGGFLTEATAFDPAFFGMSPREALAVDPQQRLMLELSWEVLERAGIPPTSLQASPTGVFVGLIPQEYGPRLAEGGEGVEGYLMTGTTTSVASGRIAYTLGLEGPAISVDTACSSSLVAVHLACQSLRRGESSLAMAGGVTVMPTPGMLVDFSRMNSLAPDGRCKAFSAGANGFGMAEGAGMLLLERLSDARRNGHPVLAVLRGTAVNSDGASNGLSAPNGRAQVRVIQQALAESGLGPADIDAVEAHGTGTRLGDPIEARALFEAYGRDREQPLHLGSVKSNLGHTQAAAGVAGVIKMVLAMRAGTLPRTLHASERSKEIDWSSGAISLLDEPEPWPAGARPRRAGVSSFGISGTNAHAIIEEAP&amp;LINK_LOC=protein&amp;PAGE_TYPE=BlastSearch",
        "sequence": "P",
        "dna_sequence": "GTG",
        "abbreviation": "KS",
        "html_class": "jsdomain-ketosynthase",
        "identifier": nameWildcardModule + "_KS",
        "domainOptions": [],
        "default_option": [],
        "selected_option": [],
        "ko": false,
        "module": nameWildcardModule,
        "function": "KS"
    }
    let defaultDHDomain = {
        "type": "PKS_DH",
        "start": 1400,
        "end": 1700,
        "predictions": [],
        "napdoslink": "",
        "blastlink": "http://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Proteins&amp;PROGRAM=blastp&amp;BLAST_PROGRAMS=blastp&amp;QUERY=HPLLLAAVDVPGHGGAVFTGRLSTDEQPWLAEHVVGGRTLVPGSVLVDLALAAGEDVGLPVLEELVLQRPLVLAGAGALLRMSVGAPDESGRRTIDVHAAEDVADLADAQWSQHATGTLAQGVAAGPRDTEQWPPEDAVRIPLDDHYDGLAEQGYEYGPSFQAL&amp;LINK_LOC=protein&amp;PAGE_TYPE=BlastSearch",
        "sequence": "HPLLLAAVDVPGHGGAVFTGRLSTDEQPWLAEHVVGGRTLVPGSVLVDLALAAGEDVGLPVLEELVLQRPLVLAGAGALLRMSVGAPDESGRRTIDVHAAEDVADLADAQWSQHATGTLAQGVAAGPRDTEQWPPEDAVRIPLDDHYDGLAEQGYEYGPSFQAL",
        "dna_sequence": "GAAGCCCTGTCCGCCGAGGACGGGCACGACGACGTGGGCCAGCGCCTGGAGTCGCTGCTGCGCCGGTGGAACAGCAGGCGGGCGGACGCCCCGAGCACGTCCGCGATCAGCGAGGACGCCAGTGACGACGAGCTGTTCTCGATGCTCGACCAGCGGTTCGGCGGGGGAGAGGACCTGTAG",
        "abbreviation": "DH",
        "html_class": "jsdomain-mod-dh",
        "identifier": nameWildcardModule + "_DH",
        "domainOptions": [],
        "default_option": [],
        "selected_option": [],
        "ko": false,
        "module": nameWildcardModule,
        "function": "DH"
    }

    nameWildcardModule += "I"



    let domainArray = []
    let longDomainArray = []
    if (wildcardModule == "starter_module_nrps") {
        longDomainArray.push(defaultADomain, defaultPCPDomain)

    }
    if (wildcardModule == "elongation_module_nrps") {
        if (document.getElementById("wildcardE")
            .checked) {
            domainArray.push(["E"]);
            longDomainArray.push(defaultADomain, defaultCDomain, defaultEDomain, defaultPCPDomain);
        }

        else { longDomainArray.push(defaultADomain, defaultCDomain, defaultPCPDomain) }
    }
    if (wildcardModule == "terminator_module_nrps") {
        if (document.getElementById("wildcardE")
            .checked) {
            domainArray.push(["E"]);
            longDomainArray.push(defaultADomain, defaultCDomain, defaultEDomain, defaultPCPDomain, defaultTEDomain);
        }

        else { longDomainArray.push(defaultADomain, defaultCDomain, defaultPCPDomain, defaultTEDomain) }
    }


    if (wildcardModule == "starter_module_pks") {
        if (document.getElementById("wildcardKR")
            .checked) {
            domainArray.push(["KR"]);

            if (document.getElementById("wildcardDH")
                .checked) {
                domainArray.push(["DH"])
                if (document.getElementById("wildcardER")
                    .checked) {
                    domainArray.push(["ER"])
                    longDomainArray.push(defaultATDomain, defaultKRDomain, defaultDHDomain, defaultERDomain, defaultACPDomain);
                }
                else { longDomainArray.push(defaultATDomain, defaultKRDomain, defaultDHDomain, defaultACPDomain); }
            }
            else { longDomainArray.push(defaultATDomain, defaultKRDomain, defaultACPDomain); }
        }
        else { longDomainArray.push(defaultATDomain, defaultACPDomain) }

        wildcardModule = [nameWildcardModule, wildcardModule, nameToStructure[wildcardSubstrate]]
    }

    if (wildcardModule == "elongation_module_pks") {
        if (document.getElementById("wildcardKR")
            .checked) {
            domainArray.push(["KR"]);

            if (document.getElementById("wildcardDH")
                .checked) {
                domainArray.push(["DH"])
                if (document.getElementById("wildcardER")
                    .checked) {
                    domainArray.push(["ER"])
                    longDomainArray.push(defaultATDomain, defaultKSDomain, defaultKRDomain, defaultDHDomain, defaultERDomain, defaultACPDomain);
                }
                else { longDomainArray.push(defaultATDomain, defaultKSDomain, defaultKRDomain, defaultDHDomain, defaultACPDomain); }
            }
            else { longDomainArray.push(defaultATDomain, defaultKSDomain, defaultKRDomain, defaultACPDomain); }

        }

        else { longDomainArray.push(defaultATDomain, defaultKSDomain, defaultACPDomain) }
        wildcardModule = [nameWildcardModule, wildcardModule, nameToStructure[wildcardSubstrate]]
    }
    if (wildcardModule == "terminator_module_pks") {
        if (document.getElementById("wildcardKR")
            .checked) {
            domainArray.push(["KR"]);

            if (document.getElementById("wildcardDH")
                .checked) {
                domainArray.push(["DH"])
                if (document.getElementById("wildcardER")
                    .checked) {
                    domainArray.push(["ER"])
                    longDomainArray.push(defaultATDomain, defaultKSDomain, defaultKRDomain, defaultDHDomain, defaultERDomain, defaultACPDomain, defaultTEDomain);
                }
                else { longDomainArray.push(defaultATDomain, defaultKSDomain, defaultKRDomain, defaultDHDomain, defaultACPDomain, defaultTEDomain); }
            }
            else { longDomainArray.push(defaultATDomain, defaultKSDomain, defaultKRDomain, defaultACPDomain, defaultTEDomain); }

        }

        else { longDomainArray.push(defaultATDomain, defaultKSDomain, defaultACPDomain, defaultTEDomain) }

        wildcardModule = [nameWildcardModule, wildcardModule, nameToStructure[wildcardSubstrate]]
    }
    else { wildcardModule = [nameWildcardModule, wildcardModule, wildcardSubstrate] }


    let endLastGene = 0
    if (BGC.orfs.length > 0){
        endLastGene = BGC.orfs[BGC.orfs.length - 1].end
    }
    BGC.end += 7254
    let wildcard_gene = {
        antismashArray: domainArray,
        default_option: [],
        start: endLastGene,
        end: endLastGene+7254,
        locus_tag: nameWildcardModule,
        displayed: true,
        type: "biosynthetic",
        domains: longDomainArray,
        strand: 1,
        description: "Custom Gene",
        id: nameWildcardModule,

        ko: false,

        options: [],

        position: geneMatrix.length + 1,

        position_in_BGC: geneMatrix.length + 1,

        selected_option: [],
        modules: [{
            "start": 1,
            "end": 4000,
            "complete": true,
            "iterative": false,
            "monomer": wildcardSubstrate,
            "moduleIdentifier": nameWildcardModule + "_0",
            "domains":
                longDomainArray
            ,
            "numberOfDomains": longDomainArray.length,
            "lengthVisualisation": 0
        }]
    }
    geneMatrix.push(wildcard_gene)
    BGC.orfs.push(wildcard_gene)
    if (details_data.hasOwnProperty(cluster_type)) {
        details_data[cluster_type][regionName].orfs.push(wildcard_gene)
    }
    else {
        details_data[regionName].orfs.push(wildcard_gene)
    }
    displayGenes(BGC)
    updateProteins(geneMatrix, BGC)
    if (RiPPStatus == 0){ updateDomains(geneMatrix, BGC)}  else{ updateRiPPs(geneMatrix, BGC)}
    addArrowClick(geneMatrix)
    fetchFromRaichu(details_data, regionName, geneMatrix, cluster_type, BGC)

}
function changeCyclization(atom){
    cyclization.push(atom)
}
function changeSelectedOption(geneMatrix, geneIndex, moduleIndex, domainIndex, option, optionIndex) {
    /**
    * Change the option in geneMatrix.
   * @fires clickondomaindropdown
   *@input geneMatrix, geneIndex,moduleIndex, domainIndex, option -> find the exact thing to change
   *@yield Selected option correct+ cyclization option correct.
   */
    geneMatrix[geneIndex].modules[
        moduleIndex].domains[
        domainIndex].selected_option = option
    $('[id^=\x22' + geneIndex + '_' + moduleIndex + '_' + domainIndex + '\x22]').removeAttr('style');
    let button = document.getElementById(geneIndex + '_' + moduleIndex + '_' + domainIndex + "_" + optionIndex)
    button.setAttribute("style", "background-color: #E11839")
    if (geneMatrix[geneIndex].modules[
        moduleIndex].domains[
        domainIndex].abbreviation.includes("TE")) {
        if (option == "Linear product") {
            cyclization = "None"
        }
        else { cyclization = option }

    }

    if (document.querySelector('input[type=checkbox]')
        .checked) {
        fetchFromRaichu(details_data, regionName, geneMatrix, cluster_type, BGC)
    }
    /// todo: set all tailoring options + cyclization option to empty + cleavage options -> to default
}
function changeSelectedOptionTailoring(geneMatrix, geneIndex, reactionOption, atomOption) {
    /**
    * Change the option in geneMatrix -> more than one option can be selected
   * @fires clickondomaindropdown
   *@input geneMatrix, geneIndex,moduleIndex, domainIndex, option -> find the exact thing to change
   *@yield Selected option correct+ cyclization option correct.
   */
    let button = document.getElementById(geneIndex + "_" + reactionOption.replaceAll(" ", "_") + atomOption)
    if (atomOption.includes(",")) {
        atomOption = atomOption.split(",")}
    else {
        atomOption = [atomOption]
    }

    if (geneMatrix[geneIndex].selected_option[reactionOption].includes(atomOption)) {
        button.setAttribute("style", "background-color: white")
        var atomOptions = geneMatrix[geneIndex].selected_option[reactionOption].filter((item) => item !== atomOption);
        geneMatrix[geneIndex].selected_option[reactionOption] = atomOptions;
    }
    else {
        geneMatrix[geneIndex].selected_option[reactionOption].push(atomOption);
        button.setAttribute("style", "background-color: #E11839")
    }
    if (document.querySelector('input[type=checkbox]')
        .checked) {
        fetchFromRaichu(details_data, regionName, geneMatrix, cluster_type, BGC)
    }

}
function changeSelectedOptionCleavageSites(option){
    cleavageSites = [option]
    let translation = ""
    // for antismash 7.0 files
    if (BGCForDisplay["orfs"][rippPrecursorGene].hasOwnProperty("translation")) {
        translation = BGCForDisplay["orfs"][rippPrecursorGene].translation
    }
    // for antismash 6.0 files
    else {
        var regExString = new RegExp("(?:QUERY=)((.[\\s\\S]*))(?:&amp;LINK_LOC)", "ig"); //set ig flag for global search and case insensitive
        var translationSearch = regExString.exec(BGCForDisplay["orfs"][rippPrecursorGene].description);
        translation = translationSearch[1]; //is the matched group if found
    }
    let cleavageNumber = parseInt(option.replace(/\D/g, ''));
    rippPrecursor = translation.slice(-cleavageNumber);//

     if (document.querySelector('input[type=checkbox]')
        .checked) {
        fetchFromRaichu(details_data, regionName, geneMatrix, cluster_type, BGC)
    }
}
function displayTextInGeneExplorer(geneId) {
    /**
    * Displays the description of the gene in the gene explorer.
   * @fires hovergene
   *@input geneID
   *@yield changes text in gene explorer
   */
    for (let geneIndex = 0; geneIndex < BGCForDisplay["orfs"].length; geneIndex++)
        if (BGCForDisplay["orfs"][geneIndex].locus_tag == geneId) {
            gene_container.innerHTML = BGCForDisplay["orfs"][geneIndex].description
        }
}
function createGeneMatrix(BGC, regionName) {
    /**
    * extract the information and predictions from region.js+ creates a easier to handle matrix (object) from it that can be modified easier
   * @fires onpageload
   *@input details_data -> from region.js input, regionIndex
   *@output geneMatrix
   */
    var geneMatrix = [];
    for (let geneIndex = 0; geneIndex < BGC["orfs"].length; geneIndex++) {
        let domains = []
        if (BGC["orfs"][geneIndex].hasOwnProperty("domains")) {
            domains = JSON.parse(JSON.stringify(BGC["orfs"][geneIndex].domains))
            for (let domainIndex = 0; domainIndex < domains.length; domainIndex++) {
                domains[domainIndex]["identifier"] = BGC["orfs"][geneIndex].locus_tag +
                    "_" + (domainIndex + 1)
                        .toString()
                domains[domainIndex]["domainOptions"] = [];
                domains[domainIndex]["default_option"] = [];
                domains[domainIndex]["selected_option"] = [];
                domains[domainIndex]["ko"] = "None";
            }
        }
        else {
            domains = []
        }
        let orfFunction = findFuctionOrf(BGC["orfs"][geneIndex].description)
        let tailoringEnzymeStatus = findTailoringEnzymeStatus(orfFunction)
        if (BGC["orfs"][geneIndex].hasOwnProperty(
            "modules") || biosyntheticCoreEnzymes.includes(orfFunction) || BGC["orfs"][geneIndex].type == "biosynthetic" ){
            tailoringEnzymeStatus = false
        }

        geneMatrix.push({
            "id": BGC["orfs"][geneIndex].locus_tag,
            "orffunction": orfFunction,
            "tailoringEnzymeStatus": tailoringEnzymeStatus[0],
            "tailoringEnzymeType": tailoringEnzymeStatus[1],
            "tailoringEnzymeAbbreviation": tailoringEnzymeStatus[2],
            "position_in_BGC": geneIndex + 1,
            "position": geneIndex + 1,
            "ko": false,
            "displayed": true,
            "default_option": [],
            "selected_option": [],
            "options": [],
           "ripp_status": false,
            "domains": domains,
            "type": BGC["orfs"][geneIndex].type
      }
        );
    }
    addModulesGeneMatrix(geneMatrix, regionName)
    return geneMatrix
}
function findFuctionOrf(orfDescription) {
    /**
    * Finds the annotated function of orf in description
   * @fires createGeneMatrix
   *@input orfdescription (from regions.js)
   *@output function of orf
   */
    let positionBegin = orfDescription.search("\n \n") + 5;
    let positionEnd = orfDescription.search("Locus tag") - 14;
    let orfFunction = orfDescription.slice(positionBegin, positionEnd).toLowerCase();
    return orfFunction
}
function findTailoringEnzymeStatus(orfFunction) {
    /**
    *checks if annotated function is associated with tailoring enzyme
   * @fires createGeneMatrix
   *@input orfFunction
   *@output tayloringstatus
   */
    let tailoringEnzymeStatus = false;
    for (const enzymeName in tailoringEnzymes) {
        tailoringEnzymeStatus = orfFunction.toUpperCase().replaceAll("-", "_").search(enzymeName) == -1 ?
            false : true;
        if (tailoringEnzymeStatus == true) {
            return [tailoringEnzymeStatus, enzymeName.trim(), tailoringEnzymes[enzymeName]];
        }

    }

     // If not found in the main dictionary, search in the synonyms dictionary (tailoringEnzymesSynonyms)
     for (const mainEnzymeName in tailoringEnzymesSynonyms) {
        const synonyms = tailoringEnzymesSynonyms[mainEnzymeName];
        for (const synonym of synonyms) {
            tailoringEnzymeStatus = orfFunction.toUpperCase().replaceAll("-", "_").search(synonym.toUpperCase()) == -1 ?
                false : true;
            if (tailoringEnzymeStatus == true) {
                return [tailoringEnzymeStatus, mainEnzymeName.trim(), tailoringEnzymes[mainEnzymeName]];
            }
        }
     }
    return [tailoringEnzymeStatus, "", ""]

}

function runAlola(regionIndex, recordIndex, details_data, recordData){
    BGC = {};
 reversed = false;
  RiPPStatus = 0;
    terpeneStatus = 0;
  rippPrecursor = "";
    document.getElementById("add_module_button").style.display = "none";
  cyclization = "None";
  regionName = getRegionName(regionIndex, recordIndex);
  cluster_type = getClusterType(regionIndex);
    document.getElementById("BGCHeading").innerHTML = `BGC explorer: ${regionName.toUpperCase()} - ${recordData[recordIndex].regions[regionIndex].type} BGC`;
    document.getElementById('model_gene_container').innerHTML = "";
  document.getElementById('module_container').innerHTML = "";
  document.getElementById('domain_container').innerHTML = "";
    document.getElementById('structure_container').innerHTML = "";

  moduleMatrix = []
  BGC = Object.keys(recordData[recordIndex].regions[regionIndex])
      .reduce(function (obj, k) {
          if (k == "start" || k == "end" || k == "orfs") obj[k] = recordData[
              recordIndex].regions[regionIndex][k];
          return obj;
      }, {});
  for (const [key_1, value_1] of Object.entries(details_data)) {
      if (value_1.id == regionName) {
          for (let orf_index = 0; orf_index < value_1.orfs.length; orf_index++) {
              orf = value_1.orfs[orf_index]
              for (let BGC_orf_index = 0; BGC_orf_index < BGC.orfs.length; BGC_orf_index++) {
                  if (orf.id == BGC.orfs[BGC_orf_index].locus_tag) {
                      BGC.orfs[BGC_orf_index]["domains"] = orf.domains
                  }
              }
          }
      }
      else if (value_1.hasOwnProperty([regionName])) {
          for (let orf_index = 0; orf_index < value_1[regionName].orfs.length; orf_index++) {
              orf = value_1[regionName].orfs[orf_index]
              for (let BGC_orf_index = 0; BGC_orf_index < BGC.orfs.length; BGC_orf_index++) {
                  if (orf.id == BGC.orfs[BGC_orf_index].locus_tag) {
                      BGC.orfs[BGC_orf_index]["domains"] = orf.domains
                  }
              }
          }
      }
  }
  geneMatrix = createGeneMatrix(BGC, regionName)
  BGCForDisplay = displayGenes(BGC)
  addRiPPPrecursorOptions(geneMatrix)
  //remove all checkboxes
  $('input[type=checkbox]').removeAttr('checked');
    updateProteins(geneMatrix, BGC)
    updateDomains(geneMatrix,BGC)
    addArrowClick(geneMatrix)
    if (recordData[recordIndex].regions[regionIndex].type.includes("terpene")){
        openFormTerpene()
    }
    fetchFromRaichu(details_data, regionName, geneMatrix, cluster_type, BGC)

}

function reverseBGC(regionIndex, recordIndex, details_data, recordData){
    if (reversed == true){
        runAlola(regionIndex,recordIndex,details_data, recordData)
    }
    else{
    reversed = true;
    BGC = {};
    RiPPStatus = 0;
    terpeneStatus = 0;
  rippPrecursor = "";
    document.getElementById("add_module_button").style.display = "none";
  cyclization = "None";
  regionName = getRegionName(regionIndex, recordIndex);
  cluster_type = getClusterType(regionIndex);
    document.getElementById("BGCHeading").innerHTML = `BGC explorer: ${regionName.toUpperCase()} - ${recordData[recordIndex].regions[regionIndex].type} BGC - reversed`;
    document.getElementById('model_gene_container').innerHTML = "";
  document.getElementById('module_container').innerHTML = "";
  document.getElementById('domain_container').innerHTML = "";
    document.getElementById('structure_container').innerHTML = "";
    document.getElementById('protein_container').innerHTML = "";
    document.getElementById('gene_container').innerHTML = "";
  geneMatrix = {};
  moduleMatrix = [];
  BGC = JSON.parse(JSON.stringify(Object.keys(recordData[recordIndex].regions[regionIndex])
      .reduce(function (obj, k) {
          if (k == "start" || k == "end" || k == "orfs") obj[k] = recordData[
              recordIndex].regions[regionIndex][k];
          return obj;
      }, {})));
  for (const [key_1, value_1] of Object.entries(details_data)) {
      if (value_1.id == regionName) {
          for (let orf_index = 0; orf_index < value_1.orfs.length; orf_index++) {
              orf = value_1.orfs[orf_index]
              for (let BGC_orf_index = 0; BGC_orf_index < BGC.orfs.length; BGC_orf_index++) {
                  if (orf.id == BGC.orfs[BGC_orf_index].locus_tag) {
                      BGC.orfs[BGC_orf_index]["domains"] = JSON.parse(JSON.stringify(orf.domains))
                  }
              }
          }
      }
      else if (value_1.hasOwnProperty([regionName])) {
          for (let orf_index = 0; orf_index < value_1[regionName].orfs.length; orf_index++) {
              orf = value_1[regionName].orfs[orf_index]
              for (let BGC_orf_index = 0; BGC_orf_index < BGC.orfs.length; BGC_orf_index++) {
                  if (orf.id == BGC.orfs[BGC_orf_index].locus_tag) {
                      BGC.orfs[BGC_orf_index]["domains"] = JSON.parse(JSON.stringify(orf.domains))
                  }
              }
          }
      }
  }

for (let orf_index = 0; orf_index < BGC.orfs.length; orf_index++) {
    let new_start = BGC.end - BGC.orfs[orf_index].end + BGC.start
    let new_end = BGC.end - BGC.orfs[orf_index].start + BGC.start
    let new_strand = -(BGC.orfs[orf_index].strand)

    BGC.orfs[orf_index].start = new_start;
    BGC.orfs[orf_index].end = new_end;
    BGC.orfs[orf_index].strand = new_strand;

}
    // Reverse the BGC.orfs array
    let reversedOrfsArray = [];
    for (let i = BGC.orfs.length-1 ; i >= 0; i--) {
        reversedOrfsArray.push({ ...BGC.orfs[i] });   
}


BGC.orfs = reversedOrfsArray;
geneMatrix = createGeneMatrix(BGC, regionName)
BGCForDisplay = displayGenes(BGC)
addRiPPPrecursorOptions(geneMatrix)
//remove all checkboxes
$('input[type=checkbox]').removeAttr('checked');
updateProteins(geneMatrix, BGC)
updateDomains(geneMatrix,BGC)
addArrowClick(geneMatrix)
if (recordData[recordIndex].regions[regionIndex].type.includes("terpene")){
    openFormTerpene()
}
fetchFromRaichu(details_data, regionName, geneMatrix, cluster_type, BGC)

}}

function addModulesGeneMatrix(geneMatrix, regionIndex) {
    /**
    *add the moodules from region js to geneMatrix (not custom modules)
   * @fires createGeneMatrix
   *@input geneMatrix
   *@output modified geneMatrix
   */
    //

    //iterate through all domains to assign them to correct module
    if (details_data.hasOwnProperty("nrpspks")) {
        region = details_data.nrpspks[regionIndex];
    }
    else {
        region = details_data[regionIndex];
    }
    if (region){
    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        for (let orfIndex = 0; orfIndex < region.orfs.length; orfIndex++) {
            if (geneMatrix[geneIndex].id == region.orfs[orfIndex].id) {
                let modules = []
                if (region.orfs[orfIndex].hasOwnProperty("modules")) {
                    modules = JSON.parse(JSON.stringify(region.orfs[orfIndex].modules))
                    for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
                        module = modules[moduleIndex]
                        let domainArray = []
                        geneMatrix[geneIndex]["modules"] = modules
                        nameModule = geneMatrix[geneIndex].id + "_" +
                            moduleIndex
                        geneMatrix[geneIndex].modules[moduleIndex][
                            "moduleIdentifier"
                        ] = nameModule
                        if (geneMatrix[geneIndex].hasOwnProperty("domains")) {
                            for (let domainIndex = 0; domainIndex < geneMatrix[
                                geneIndex].domains.length; domainIndex++) {
                                if (module.end >= geneMatrix[geneIndex].domains[
                                    domainIndex].start && geneMatrix[
                                        geneIndex].domains[domainIndex].start >=
                                    module.start || module.start >= geneMatrix[
                                        geneIndex].domains[domainIndex].start &&
                                    geneMatrix[geneIndex].domains[domainIndex].start >=
                                    module.end) {
                                    domainArray.push(geneMatrix[geneIndex].domains[
                                        domainIndex]);
                                    geneMatrix[geneIndex].domains[domainIndex][
                                        "module"
                                    ] = nameModule;
                                }
                                if (module.end > geneMatrix[geneIndex].domains[
                                    domainIndex].start && geneMatrix[
                                        geneIndex].domains[domainIndex].start <
                                    module.start && !(geneMatrix[geneIndex].domains[
                                        domainIndex].hasOwnProperty(
                                            "module"))) {
                                    domainArray.push(geneMatrix[geneIndex].domains[
                                        domainIndex]);
                                    geneMatrix[geneIndex].domains[domainIndex][
                                        "module"
                                    ] = nameModule;
                                    geneMatrix[geneIndex].modules[moduleIndex][
                                        "start"
                                    ] = geneMatrix[geneIndex].domains[
                                        domainIndex].start;
                                }
                                if (moduleIndex == modules.length - 1 &&
                                    domainIndex == geneMatrix[geneIndex].domains
                                        .length - 1 && !(geneMatrix[geneIndex].domains[domainIndex].hasOwnProperty("module"))) {
                                    domainArray.push(geneMatrix[geneIndex].domains[domainIndex]);
                                    geneMatrix[geneIndex].domains[domainIndex]["module"] = nameModule;
                                    geneMatrix[geneIndex].modules[moduleIndex]["end"] = geneMatrix[geneIndex].domains[domainIndex].end;
                                }
                            }
                            geneMatrix[geneIndex].modules[moduleIndex].domains = domainArray;
                            geneMatrix[geneIndex].modules[moduleIndex].numberOfDomains = domainArray.length;
                            geneMatrix[geneIndex].modules[moduleIndex].lengthVisualisation = 0;
                        }
                    }
                }
            }
        }
    }}
    return geneMatrix;
}
function extractAntismashPredictionsFromRegion(details_data, regionIndex,
    geneMatrix) {
    /**
    * extract the information and predictions from region.js+ combines this information with geneMatrix
   * @fires fetchFromRaichu
   *@input details_data -> from region.js input, regionIndex,
       geneMatrix
   *@output formatted data for Raichu/Backend
   */
    let outputForRaichu = []
    let region = []
    geneMatrix.modules = []
    if (details_data.hasOwnProperty("nrpspks")) {
        region = details_data.nrpspks[regionIndex];
    }
    else {
        region = details_data[regionIndex];
    }
    geneMatrix.sort((a, b) => {
        return a.position - b.position;
    });
    moduleMatrix = []
    let acpCounter = 0;
    let starterACP = 1;
    let substrate = "";
    let domainArray = [];
    let typesInModule = [];
    let domains = []
    let moduleType = "PKS";
    let moduleSubtype = "PKS_TRANS";
    let moduleIndex = 0;
    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        if (geneMatrix[geneIndex].ko == false && (geneMatrix[geneIndex].hasOwnProperty(
            "modules") || biosyntheticCoreEnzymes.includes(geneMatrix[geneIndex].orffunction) || geneMatrix[geneIndex].type.includes("biosynthetic")) ) {
            for (let orfIndex = 0; orfIndex < region.orfs.length; orfIndex++) {
                let orf = region.orfs[orfIndex];
                if (geneMatrix[geneIndex].id == orf.id) {
                    // acp stat helps connecting modules that are within the same module but on different genes

                    for (let domainIndex = 0; domainIndex < orf.domains.length; domainIndex++) {
                        let domain = orf.domains[domainIndex];
                        if (!(geneMatrix[geneIndex].domains[domainIndex].ko ==
                            false || geneMatrix[geneIndex].domains[domainIndex].ko == "None")){
                                domains.push(domain.type)
                            }
                        else{

                            let active = "True";
                            let used = "True";
                            let gene = orf.id;
                            let type = "None";
                            let subtype = "None";
                                type = domain.abbreviation;
                                if (domain.abbreviation == "") {
                                    type = domain.type;
                                }
                                if (domain.type == "Heterocyclization") {
                                    type = "CYC"
                                }
                                if (domain.abbreviation == "KR") {
                                    if (geneMatrix[geneIndex].domains[
                                        domainIndex].selected_option.length == 0) {
                                        if (domain.predictions.length != 0) {
                                            let domainActivity = domain.predictions[
                                                0][1]
                                            if (domainActivity ==
                                                "inactive" && (geneMatrix[geneIndex].domains[domainIndex].ko ==
                                                    true || geneMatrix[geneIndex].domains[domainIndex].ko == "None")) {
                                                geneMatrix[geneIndex].domains[domainIndex].ko = true;
                                                active = "False"
                                            }
                                            if (domain.predictions[1][1] !=
                                                "(unknown)") {
                                                subtype = domain.predictions[1][1];
                                            }
                                            else { subtype = "None" }
                                        }
                                        else { subtype = "None" }
                                    }
                                    else {
                                        subtype = geneMatrix[geneIndex].domains[domainIndex].selected_option
                                    }
                                }
                                if (domain.abbreviation == "KS") {
                                    if (geneMatrix[geneIndex].domains[
                                        domainIndex].selected_option.length == 0) {
                                        if (domain.predictions.length != 0) {
                                            if (domain.predictions[0][1] !=
                                                "(unknown)") {
                                                subtype = domain.predictions[0][1].toUpperCase().replaceAll("-", "_").replaceAll("/", "_");
                                            }
                                            else { subtype = "MISCELLANEOUS" }
                                        }
                                    }
                                    else {
                                        subtype = TRANS_AT_KS_SUBTYPES[geneMatrix[geneIndex].domains[domainIndex].selected_option]
                                    }
                                }
                            
                                if (domain.abbreviation == "AT") {
                                    moduleType = "PKS"
                                    moduleSubtype = "PKS_CIS"
                                    if (moduleIndex == 0){
                                        if (domain.hasOwnProperty("predictions")) {
                                            if (domain.predictions.length != 0) {
                                                if (domain.predictions[1][1] !=
                                                    "(unknown)" && pksStarterSubstrates.includes(domain.predictions[1][1])) {
                                                    substrate = domain.predictions[1][1].replace("-",'_').toUpperCase()
                                                }
                                                else {
                                                    substrate = "acetyl_coa".toUpperCase()
                                                }

                                    }}
                                    else {
                                        substrate = "acetyl_coa".toUpperCase()
                                    }
                                }
                                    else {
                                    if (domain.hasOwnProperty("predictions")) {
                                        if (domain.predictions.length != 0) {
                                            if (domain.predictions[1][1] !=
                                                "(unknown)") {
                                                substrate = domain.predictions[
                                                    1][1].replace("-",
                                                        '_')
                                                    .toUpperCase()
                                            }
                                            else {
                                                substrate = "malonyl_coa".toUpperCase()
                                            }
                                        }
                                    }
                                    else {
                                        substrate = "malonyl_coa".toUpperCase()
                                    }} 

                                    if (!(geneMatrix[geneIndex].domains[domainIndex].selected_option.length == 0)) {
                                        substrate = geneMatrix[geneIndex].domains[domainIndex].selected_option.toUpperCase()
                                    }
                                }
                            if (domain.abbreviation == "DH" || domain.abbreviation == "DHt") {
                                type = "DH"
                            }

                                if (domain.abbreviation == "A") {
                                    if (domain.hasOwnProperty("predictions")) {
                                        if (domain.predictions.length != 0) {
                                            if (domain.predictions[0][1] !=
                                                "unknown" && domain.predictions[0][1] !="X") {
                                                substrate = aminoacids[
                                                    domain.predictions[
                                                        0][1].toLowerCase()]
                                                if (substrate === undefined) {
                                                            substrate = "glycine"}
                                            }
                                            else {
                                                substrate = "glycine"
                                            }
                                        }
                                        else {
                                            substrate = "glycine"
                                        }
                                    }
                                    else {
                                        substrate = "glycine"
                                    }
                                    geneMatrix[geneIndex].domains[domainIndex].substrate = substrate
                                    // overrule by user selected option

                                    if (!(geneMatrix[geneIndex].domains[domainIndex].selected_option.length == 0)) {
                                        substrate = geneMatrix[geneIndex].domains[domainIndex].selected_option
                                    }
                                }
                                if (["A", "C", "PCP", "E"].includes(domain.abbreviation)){
                                    moduleType = "NRPS";
                                    moduleSubtype = "None";
                                }
                                if (["AT", "KS", "ACP", "KR"].includes(domain.abbreviation)){
                                    moduleType = "PKS";
                                    if (moduleSubtype == "None"){
                                    moduleSubtype = "PKS_TRANS";
                                    }
                                }
                                // select right kind of acp/pcp depending on module type
                                if ((domain.type.includes("ACP") || domain.type
                                    .includes("PP") || domain.type.includes("PCP")) && !(geneMatrix[geneIndex].domains[domainIndex]
                                        .type.includes("ACPS")) && moduleType == "NRPS") {
                                    type = "PCP";
                                    acpCounter += 1;
                                }
                                if ((domain.type.includes("ACP") || domain.type
                                    .includes("PP") || domain.type.includes("PCP")) && !(geneMatrix[geneIndex].domains[domainIndex]
                                        .type.includes("ACPS")) && moduleType == "PKS") {
                                    type = "ACP";
                                    acpCounter += 1;
                                }
                                geneMatrix[geneIndex].domains[domainIndex].function = type
                                // to avoid duplicate domains
                            if (typesInModule.includes(type) || (type == "TD" && typesInModule.includes("TE")) || (type == "TE" && typesInModule.includes("TD"))) {
                                    active = "False";
                                    geneMatrix[geneIndex].domains[domainIndex].ko = true
                                };
                                domainArray.push([gene, type, subtype, "None", active, used]);
                                typesInModule.push (type);
                                // create new module everytime an ACP or PCP occurs, except if last domain was already ACP
                                if ((type == "ACP" || type == "PCP") && domainArray.length == 1) {
                                    active = "False";
                                    geneMatrix[geneIndex].domains[domainIndex].ko = true;
                                }
                                if ((type == "ACP" || type == "PCP")&& domainArray.length>1)
                                {
                                    if (substrate === "" && moduleType == "PKS") {
                                        substrate = "MALONYL_COA";
                                    }
                                    if (substrate === "" && moduleType == "NRPS") {
                                        substrate = "glycine";
                                    }
                                    // remove falsely assigned domains for prediciton
                                    let domainArrayFiltered =  []
                                    if (moduleType == "NRPS"){
                                        domainArrayFiltered = domainArray.filter(domain => domain[1] != "AT" && domain[1] != "KS" && domain[1] != "KR"
                                            && domain[1] != "ER" && domain[1] != "DH" && domain[1] != "ACP");
                                    }
                                    if (moduleType == "PKS") {
                                        domainArrayFiltered = domainArray.filter(domain => domain[1] != "A" && domain[1] != "C" && domain[1] != "E"&& domain[1] != "PCP");
                                    }
                                    // create module arrays
                                    let moduleArray = [moduleType, moduleSubtype, substrate, domainArrayFiltered]
                                    if (moduleArray.length != 0) {
                                        outputForRaichu.push(moduleArray)
                                        domains = domains.concat(domainArray.map(function (x) {
                                            return x[1];
                                        }));
                                        // add merged modules to gene matrix
                                        moduleMatrix.push({
                                            "id": moduleIndex,
                                            "domains": domains,
                                            "numberOfDomains": domains.length,
                                            "moduleType": moduleType
                                        })
                                        moduleIndex++
                                    }
                                    domainArray = [];
                                    domains = []
                                    typesInModule = [];
                                    moduleType = "PKS";
                                    moduleSubtype = "PKS_TRANS";

                                }
                        }
                    }

                }
            }
        }}
        // put everything into last module thats left

        if (domainArray.length!=0){
            // set everything that already exists to false
            let newDomainArray = []
            typesInModule = outputForRaichu[outputForRaichu.length - 1][3].map(function (x) {
                return x[1];
            });
            moduleType = outputForRaichu[outputForRaichu.length - 1][0]
            moduleSubtype = outputForRaichu[outputForRaichu.length - 1][1]
            for (domain of domainArray){
                let newDomain = []
                if (typesInModule.includes(domain[1]) || (domain[1] == "TD" && typesInModule.includes("TE")) || (domain[1] == "TE" && typesInModule.includes("TD"))){
                    newDomain = domain.slice(0, 4);
                    newDomain.push("False");
                    newDomain.push(domain[5]);
                }
                else{
                    newDomain = domain;
                }
                newDomainArray.push(newDomain);
                typesInModule.push(domain[1]);
            }

        // remove falsely assigned domains for prediciton
        let domainArrayFiltered = []
        if (moduleType == "NRPS") {
            domainArrayFiltered = newDomainArray.filter(domain => domain[1] != "AT" && domain[1] != "KS" && domain[1] != "KR"
                && domain[1] != "ER" && domain[1] != "DH");
        }
        if (moduleType == "PKS") {
            domainArrayFiltered = newDomainArray.filter(domain => domain[1] != "A" && domain[1] != "C" && domain[1] != "E");
        }
        // create module arrays
            if (domainArrayFiltered.length != 0) {
                outputForRaichu[outputForRaichu.length - 1][3] = outputForRaichu[outputForRaichu.length - 1][3].concat(domainArrayFiltered);
            domains = domains.concat(domainArray.map(function (x) {
                return x[1];
            }))
            // add merged modules to gene matrix
            moduleMatrix[moduleMatrix.length - 1].domains = moduleMatrix[moduleMatrix.length - 1].domains.concat(domains);
            moduleMatrix[moduleMatrix.length - 1].numberOfDomains += domains.length;

        }
    }
    return [outputForRaichu, starterACP, geneMatrix]
}
function reload_site_with_genecluster(){
    createButtonsForEachRegion();
    [regionIndex, recordIndex] = getFirstRegion(recordData);
    runAlola(regionIndex, recordIndex, details_data, recordData);
}
function create_empty_BGC(){
    regionIndex = 0
    recordData = [
        {
            "length": 6283062,
            "seq_id": "Custom_BGC",
            "regions": [
                {
                    "start": 0,
                    "end": 1,
                    "idx": 1,
                    "type": "NRPS",
                    "anchor": "r1c1",
                    "orfs": []
                }]}]
    details_data = {"nrpspks":{"r1c1":{"id":"r1c1", "orfs":[]}}}
    runAlola(regionIndex, recordIndex, details_data, recordData)
}