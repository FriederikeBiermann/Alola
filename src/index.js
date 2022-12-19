let regionIndex = 0
let regionName = ""
let BGC ={}
let fetching = false
let tailoringEnzymes = ["p450", " methyltransferase", "n-methyltransferase", "c-methyltransferase", "o-methyltransferase"]
let cluster_type = "nrpspks"
let nameToStructure = {
    "methylmalonyl_coa": "CC(C(O)=O)C(S)=O",
    "malonyl_coa": "OC(=O)CC(S)=O",
    'methoxymalonyl_acp': "SC(=O)C(C(=O)O)OC)O",
    'ethylmalonyl_coa': "CC(CC(O)=O)C(S)=O",
}
let aminoacids = {
    "arg": "arginine",
    "his": "histidine",
    "lys": "lysine",
    "asp": "asparticacid",
    "glu": "glutamicacid",
    "ser": "serine",
    "thr": "threonine",
    "asn": "asparagine",
    "gln": "glutamine",
    "cys": "cysteine",
    "sec": "selenocysteine",
    "gly": "glycine",
    "pro": "proline",
    "ala": "alanine",
    "val": "valine",
    "ile": "isoleucine",
    "leu": "leucine",
    "met": "methionine",
    "phe": "phenylalanine",
    "tyr": "tyrosine",
    "trp": "tryptophan",
    "sal": "salicylicacid"
}
let items = document.querySelectorAll('.test-container .box')
var dragSrcEl = null;
let cyclization = "None"
let wildcardSubstrate = "glycine"
let wildcardModule = "elongation_module_nrps"
let nameWildcardModule = "Custom_gene_"
function findButtonbyTextContent(text) {
    var buttons = document.querySelectorAll('button');
    for (var i = 0, l = buttons.length; i < l; i++) {
        if (buttons[i].firstChild.nodeValue == text)
            return buttons[i];
    }
}
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
function removeAllInstances(arr, item) {
    /**
   * Removes all instances of an item in array.

   * @input array and item that needs to be removed
   * @yield cleaned up array
   */
    for (var i = arr.length; i--;) {
        if (arr[i] === item) arr.splice(i, 1);
    }
}
function handleDragStart(e) {
    /**
   * Handles the drag start.
   * Makes Item transparent, makes it movable.

   * @input element thats grabbed
   * @fire fires when element is grabbed
   */


    this.style.opacity = '0.4';
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}
function handleDragOver(e) {
    /**
   * Handles the drag /drop

   */
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}
function handleDragEnter(e) {  /**
 * Handles the drag /drop

 */
    this.classList.add('over');
}
function handleDragLeave(e) {
    /**
   * Handles the drag /drop

   */
    this.classList.remove('over');
}
function handleDrop(e) {
    /**
   * Handles the drag /drop
  * after the drop, the position of the genes are exchanged in the geneMAtrix, then all visualisations are done again. That way, not only the visualisation is changed, but also everything
  * requested from the backend. If the "Real time calculation button is checked, it will be automatically fetched from Raichu again."
   */
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
        let positionDragged = 1
        let geneIndexDragged = 1
        let positionTarget = 1
        let geneIndexTarget = 1
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
        // if we want to move protein back
        if (positionTarget > positionDragged) {
            for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
                if (geneMatrix[geneIndex].position >= positionDragged &&
                    geneMatrix[geneIndex].position <= positionTarget) {
                    geneMatrix[geneIndex].position -= 1;
                }
            }
            geneMatrix[geneIndexDragged].position = positionTarget
        }
        // if we want to move protein forward
        if (positionTarget < positionDragged) {
            for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
                if (geneMatrix[geneIndex].position <= positionDragged &&
                    geneMatrix[geneIndex].position >= positionTarget) {
                    geneMatrix[geneIndex].position += 1;
                }
            }
            geneMatrix[geneIndexDragged].position = positionTarget
        }
        geneMatrix.sort((a, b) => {
            return a.position - b.position;
        });
        geneMatrix.sort((a, b) => {
            return a.position - b.position;
        });
        updateProteins(geneMatrix, BGC);
        updateDomains(geneMatrix, BGC);
        addArrowClick(geneMatrix);
        if (document.getElementById("real-time-button")
            .checked) {
            fetchFromRaichu(details_data, regionName, geneMatrix, cluster_type, BGC)
        }
    }
    return false;
}
function handleDragEnd(e) {
    /**
   * Handles the drag /drop

   */
    this.style.opacity = '1';
    items.forEach(function (item) {
        item.classList.remove('over');
    });
}
function addDragDrop() {
    /**
   * Handles the drag /drop

   */
    items = document.querySelectorAll('.protein-container .box');
    items.forEach(function (item) {
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragover', handleDragOver, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
    });
}
function highlight_atom_in_SVG(atom, color, width) {
    /**
   * finds atom in svg, if selected option is atom selector and highlights it with given colouring
   * @parameters color: desired color, atom: atom selector, width: width for stroke to highlight even more
  * @fire hoverin/out_atom
   */

    if (atom.toString().includes("_")) {
        let links = document.querySelectorAll('a[*|href=\x22' + atom + '\x22]');
        for (let linkIndex = 0; linkIndex < links.length; linkIndex++) {
            let link = links[linkIndex]
            if (link.parentElement.parentElement.parentElement.parentElement == document.getElementById("intermediate_drawing_tailoring")) {
                let text = link.childNodes[3]
                text.setAttribute('style', "fill:" + color + "; stroke:" + color + "; stroke-width:" + width)
            }
        }
    }

}
function hover_in_atom(atom) {
    /**
   * highlights atom in svg red

   */
    highlight_atom_in_SVG(atom, "#E11839", "5")
}
function hover_out_atom(atom) {
    /**
   * mkaes c atoms transparent, other atoms back to black.

   */

    if (atom.indexOf("C") >= 0) {
        highlight_atom_in_SVG(atom, "none", "0")
    }
    else { highlight_atom_in_SVG(atom, "black", "0") }

}
function formatSVG_intermediates(svg) {
    /**
   * formats the SVGs of spaghetti diagram to look nice + remove the ACP

   */
    svg = svg.toString()
        .replaceAll("#ffffff", "none")
        .replaceAll("#ff00ff", "none")
        .replaceAll("#ff0000", "#000000")
        .replaceAll("#00ff00", "#000000")
        //  .replaceAll("#000000", "#ffffff")
        .replaceAll("<g transform='translate",
            "<g style='fill: black' transform='translate");
    svg = svg.toString()
        .replaceAll("<!-- PCP -->    <g style='fill: black'",
            "<!-- PCP -->    <g style='fill: transparent'")
        .replaceAll("<!-- ACP -->    <g style='fill: black'",
            "<!-- ACP -->    <g style='fill: transparent'");
    return svg
}
function formatSVG(svg) {
    /**
   * formats the SVG to look nice

   */
    svg = svg.toString()
        .replaceAll("#ffffff", "none")
        .replaceAll("#000000", "#ffffff")
        .replaceAll("stroke: #ffffff", "stroke: #ffffff; fill: #ffffff")
        .replaceAll("<g transform='translate",
            "<g style='fill: #ffffff' transform='translate");
    svg = svg.toString()
        .replaceAll("<!-- PCP -->    <g style='fill: #ffffff'",
            "<!-- PCP -->    <g style='fill: transparent'")
        .replaceAll("<!-- ACP -->    <g style='fill: #ffffff'",
            "<!-- ACP -->    <g style='fill: transparent'");
    return svg
}
// fuctions to save svg of biosynthetic model
function PrintSVGCluster(){

}
function PrintDiv() {
    /**
   * Download biosynthetic_model
   * Transforms biosynthetic_model div to remove hidden areas, transforms it to canvas, and download a png of it
   * @fires   save_biosynthetic_model_button
   */
    (async () => {
        let div = document.getElementById("outerDomainExplorer")
        let outer_div = document.getElementById("Domain_explorer")
        div.setAttribute("class", "outerDomainExplorer_while_saving");


        const canvas = await html2canvas(div, { scale: 5 })

        div.setAttribute("class", "outerDomainExplorer");

        var myImage = canvas.toDataURL();

        downloadURI(myImage, "biosynthetic_model.png");
    })()
}
function downloadURI(uri, name) {
    /**
   * Creates a link to download the png
   * @fires   PrintDIV
   */
    var link = document.createElement("a");

    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    //after creating link you should delete dynamic link
    clearDynamicLink(link);
}
//functions for zooming
function zoom_in() {
    /**
   * Zooms into structure in structure explorer.
   * gets actual dimensions, removes the automatic sizing and then resizes the svg.
   * @fires   onclick-> zoom button
   */
    let drawing = document.getElementById("final_drawing")
    let drawingStyles = window.getComputedStyle(drawing)
    let height = drawingStyles.height;
    let width = drawingStyles.width;
    stringWidth = (parseInt(width) + 30).toString() + "px"
    stringHeight = (parseInt(height) + 30).toString() + "px"

    drawing.style["max-width"] = ""
    drawing.style["max-height"] = ""
    drawing.style["width"] = stringWidth
    drawing.style["height"] = stringHeight



}
function zoom_out() {
    /**
   * Zooms out of structure in structure explorer.
   *
   * gets actual dimensions, removes the automatic sizing and then resizes the svg.

   * @fires   onclick-> zoom button


   */
    let drawing = document.getElementById("final_drawing")
    let drawingStyles = window.getComputedStyle(drawing)
    let height = drawingStyles.height;
    let width = drawingStyles.width;
    stringWidth = (parseInt(width) - 30).toString() + "px"
    stringHeight = (parseInt(height) - 30).toString() + "px"

    drawing.style["max-width"] = ""
    drawing.style["max-height"] = ""
    drawing.style["width"] = stringWidth
    drawing.style["height"] = stringHeight




}
function addArrowClick(geneMatrix) {
    /**
    *add click event to every gene arrow
   * @fires onsiteload
   *@input geneMatrix
   *@yield new click events for every arrow
   */
    //

    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        arrow_id = ("#" + geneMatrix[geneIndex].id + "_gene_arrow")
            .replace(".", "_")
        protein_id = ("#" + geneMatrix[geneIndex].id + "_protein")
            .replace(".", "_")
        let arrow_1 = document.querySelector(arrow_id);
        arrow_1.replaceWith(arrow_1.cloneNode(true));
        let arrow = document.querySelector(arrow_id);
        const protein = document.querySelector(protein_id);
        arrow.addEventListener(
            'click',
            function () { // anonyme Funktion
                setDisplayedStatus(geneMatrix[geneIndex].id, geneMatrix);
                updateProteins(geneMatrix, BGC);
                updateDomains(geneMatrix, BGC);
                changeColor("#" + geneMatrix[geneIndex].id + "_gene_arrow");
                addArrowClick(geneMatrix);
                if (document.getElementById("real-time-button")
                    .checked) {
                    fetchFromRaichu(details_data, regionName, geneMatrix,
                        cluster_type, BGC)
                };
            },
            false
        );
        arrow.addEventListener(
            'mouseenter',
            function () { // anonyme Funktion
                displayTextInGeneExplorer(geneMatrix[geneIndex].id);
                changeProteinColorON("#" + geneMatrix[geneIndex].id +
                    "_protein", geneIndex)
            },
            false
        );
        arrow.addEventListener(
            'mouseleave',
            function () { // anonyme Funktion
                changeProteinColorOFF("#" + geneMatrix[geneIndex].id +
                    "_protein", geneIndex)
            },
            false
        );
        if (geneMatrix[geneIndex].displayed === true) {
            protein.addEventListener(
                'click',
                function () { // anonyme Funktion
                    setDisplayedStatus(geneMatrix[geneIndex].id, geneMatrix);
                    updateProteins(geneMatrix, BGC);
                    updateDomains(geneMatrix, BGC);
                    changeColor("#" + geneMatrix[geneIndex].id +
                        "_gene_arrow");
                    addArrowClick(geneMatrix);
                    if (document.getElementById("real-time-button")
                        .checked) {
                        fetchFromRaichu(details_data, regionName,
                            geneMatrix, cluster_type)
                    }
                },
                false
            );
            protein.addEventListener(
                'mouseenter',
                function () { // anonyme Funktion
                    displayTextInGeneExplorer(geneMatrix[geneIndex].id);
                    changeProteinColorON("#" + geneMatrix[geneIndex].id +
                        "_gene_arrow", geneIndex)
                },
                false
            );
            protein.addEventListener(
                'mouseleave',
                function () { // anonyme Funktion
                    changeProteinColorOFF("#" + geneMatrix[geneIndex].id +
                        "_gene_arrow", geneIndex)
                },
                false
            );
            if (geneMatrix[geneIndex].tailoringEnzymeStatus == true) {
                const tailoringEnzymeObject = document.querySelector("#tailoringEnzyme_" + geneMatrix[geneIndex].id)
                arrow.addEventListener(
                    'mouseenter',
                    function () { // anonyme Funktion

                        changeProteinColorON("#tailoringEnzyme_" + geneMatrix[geneIndex].id, geneIndex)
                    },
                    false
                );
                arrow.addEventListener(
                    'mouseleave',
                    function () { // anonyme Funktion
                        changeProteinColorOFF("#tailoringEnzyme_" + geneMatrix[geneIndex].id, geneIndex)
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

                        changeProteinColorON("#" + geneMatrix[geneIndex].id +
                            "_gene_arrow", geneIndex); changeProteinColorON("#" + geneMatrix[geneIndex].id +
                                "_protein", geneIndex)
                    },
                    false
                );
                tailoringEnzymeObject.addEventListener(
                    'mouseleave',
                    function () { // anonyme Funktion
                        changeProteinColorOFF("#" + geneMatrix[geneIndex].id +
                            "_gene_arrow", geneIndex); changeProteinColorOFF("#" + geneMatrix[geneIndex].id +
                                "_protein", geneIndex)
                    },
                    false
                );
            }
            for (let domainIndex = 0; domainIndex < geneMatrix[geneIndex].domains
                .length; domainIndex++) {
                domain = geneMatrix[geneIndex].domains[domainIndex]
                domainId = "#" + geneMatrix[geneIndex].id + "_domain_" + domain
                    .sequence;
                const domainObject = document.querySelector(domainId);
                domainObject.addEventListener(
                    'click',
                    function () { // anonyme Funktion
                        changeDomainColor(geneMatrix[geneIndex].domains[
                            domainIndex], "#" + geneMatrix[
                                geneIndex].id + "_domain_" + geneMatrix[
                                    geneIndex].domains[domainIndex].sequence);
                        changeDomainColor(geneMatrix[geneIndex].domains[
                            domainIndex], "#domain" + geneMatrix[
                                geneIndex].domains[domainIndex].identifier);
                        setKoStatus(geneIndex, domainIndex, geneMatrix)
                    },
                    false);
                domainObject.addEventListener(
                    'mouseenter',
                    function () { // anonyme Funktion
                        changeDomainColor(geneMatrix[geneIndex].domains[
                            domainIndex], "#" + geneMatrix[
                                geneIndex].id + "_domain_" + geneMatrix[
                                    geneIndex].domains[domainIndex].sequence);
                        changeDomainColor(geneMatrix[geneIndex].domains[
                            domainIndex], "#domain" + geneMatrix[
                                geneIndex].domains[domainIndex].identifier);
                        displayTextInGeneExplorer(geneMatrix[geneIndex].id);
                        changeProteinColorON("#" + geneMatrix[geneIndex].id +
                            "_protein", geneIndex);
                        changeProteinColorON("#" + geneMatrix[geneIndex].id +
                            "_gene_arrow", geneIndex);
                    },
                    false
                );
                domainObject.addEventListener(
                    'mouseleave',
                    function () { // anonyme Funktion
                        changeDomainColor(geneMatrix[geneIndex].domains[
                            domainIndex], "#" + geneMatrix[
                                geneIndex].id + "_domain_" + geneMatrix[
                                    geneIndex].domains[domainIndex].sequence);
                        changeDomainColor(geneMatrix[geneIndex].domains[
                            domainIndex], "#domain" + geneMatrix[
                                geneIndex].domains[domainIndex].identifier);
                        changeProteinColorOFF("#" + geneMatrix[geneIndex].id +
                            "_gene_arrow", geneIndex);
                        changeProteinColorOFF("#" + geneMatrix[geneIndex].id +
                            "_protein", geneIndex)
                    },
                    false
                );
                domainId = "#domain" + geneMatrix[geneIndex].domains[
                    domainIndex].identifier
                const domainObject_2 = document.querySelector(domainId);
                domainObject_2.addEventListener(
                    'click',
                    function () { // anonyme Funktion
                        changeDomainColor(geneMatrix[geneIndex].domains[
                            domainIndex], "#" + geneMatrix[
                                geneIndex].id + "_domain_" + geneMatrix[
                                    geneIndex].domains[domainIndex].sequence);
                        changeDomainColor(geneMatrix[geneIndex].domains[
                            domainIndex], "#domain" + geneMatrix[
                                geneIndex].domains[domainIndex].identifier); scale: 2,
                                    setKoStatus(geneIndex, domainIndex, geneMatrix)
                    },
                    false);
                domainObject_2.addEventListener(
                    'mouseenter',
                    function () { // anonyme Funktion
                        changeDomainColor(geneMatrix[geneIndex].domains[
                            domainIndex], "#" + geneMatrix[
                                geneIndex].id + "_domain_" + geneMatrix[
                                    geneIndex].domains[domainIndex].sequence);
                        changeDomainColor(geneMatrix[geneIndex].domains[
                            domainIndex], "#domain" + geneMatrix[
                                geneIndex].domains[domainIndex].identifier);
                        displayTextInGeneExplorer(geneMatrix[geneIndex].id);
                        changeProteinColorON("#" + geneMatrix[geneIndex].id +
                            "_protein", geneIndex);
                        changeProteinColorON("#" + geneMatrix[geneIndex].id +
                            "_gene_arrow", geneIndex);
                    },
                    false
                );
                domainObject_2.addEventListener(
                    'mouseleave',
                    function () { // anonyme Funktion
                        changeDomainColor(geneMatrix[geneIndex].domains[
                            domainIndex], "#" + geneMatrix[
                                geneIndex].id + "_domain_" + geneMatrix[
                                    geneIndex].domains[domainIndex].sequence);
                        changeDomainColor(geneMatrix[geneIndex].domains[
                            domainIndex], "#domain" + geneMatrix[
                                geneIndex].domains[domainIndex].identifier);
                        changeProteinColorOFF("#" + geneMatrix[geneIndex].id +
                            "_gene_arrow", geneIndex);
                        changeProteinColorOFF("#" + geneMatrix[geneIndex].id +
                            "_protein", geneIndex)
                    },
                    false
                );
            }
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
    const arrow = document.querySelector(arrowId);
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
    const domainObject = document.querySelector(domainId);
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
        const arrow = document.querySelector(ProteinId);
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
        const arrow = document.querySelector(ProteinId);
        arrow.removeAttribute("style");
    }
}
function fetchFromRaichu(details_data, regionName, geneMatrix, cluster_type, BGC) {
    /**
   *Transforms and transfers all needed data through the api to the backend (raichu) and handles the output.
   * @fires   refresh_structure or if real time calculation is enabled every time the input data is altered
   * @input details_data: input from regions.js file,, regionName: "e.g. r1c3 -> region and cluster number", geneMatrix : THE collection on data of the different genes, cluster_type: type of cluster for extraction from gene name
   * @yield Adds all SVGs  of intermediates+ final structure+ tailoring enzyme structure + adds all different options for regiospecific things + redraws everything to produce right containers
   */
    //
    let data = ""
    let starterACP = ""
    console.log(BGC)
    if (details_data.nrpspks.hasOwnProperty(regionName)){
    let extracted_results = extractAntismashPredictionsFromRegion(details_data,
        regionName, geneMatrix)
    data = extracted_results[0]
    starterACP = extracted_results[1]
    // add tailoring reactions
    let tailoringArray = findTailoringReactions(geneMatrix)

    let data_string = JSON.stringify([data, cyclization, tailoringArray])
    let url = "http://127.0.0.1:8000/api/alola?antismash_input=";
    let list_hanging_svg = []
    let container = document.getElementById("structure_container")
    container.innerHTML = ""
    fetch(url + data_string)
        .then(response => {
            const thing = response.json();
            return thing
        })
        .then((data) => {
            let container = document.getElementById("structure_container");
            let smiles_container = document.getElementById("smiles_container");
            //add options for cyclization

            for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
                for (let domainIndex = 0; domainIndex < geneMatrix[
                    geneIndex].domains.length; domainIndex++) {
                    let domain = geneMatrix[geneIndex].domains[domainIndex]
                    if (domain.abbreviation == "TE") {
                        domain.domainOptions = addStringToArray("Cyclization at ", data.atomsForCyclisation.replaceAll(
                            "[", "")
                            .replaceAll("]", "")
                            .replaceAll(" ", "")
                            .split(","));

                        domain.domainOptions.push("Linear product");

                        domain.default_option = ["Linear product"];
                    }
                }
                if (geneMatrix[geneIndex].tailoringEnzymeStatus == true) {
                    if (geneMatrix[geneIndex].tailoringEnzymeType == "p450" || geneMatrix[geneIndex].tailoringEnzymeType == "P450") {
                        geneMatrix[geneIndex].options = addStringToArray("Hydroxylation at ", data.c_atoms_for_tailoring.replaceAll(
                            "[", "")
                            .replaceAll("]", "")
                            .replaceAll(" ", "")
                            .split(","));

                        geneMatrix[geneIndex].options.push("No oxidation")
                        geneMatrix[geneIndex].default_option = ("No oxidation")
                    }
                    if (geneMatrix[geneIndex].tailoringEnzymeType == "n-methyltransferase") {
                        geneMatrix[geneIndex].options = addStringToArray("Methylation at ", data.n_atoms_for_tailoring.replaceAll(
                            "[", "")
                            .replaceAll("]", "")
                            .replaceAll(" ", "")
                            .split(","));

                        geneMatrix[geneIndex].options.push("No methylation")
                        geneMatrix[geneIndex].default_option = ("No methylation")
                    }
                    if (geneMatrix[geneIndex].tailoringEnzymeType == "c-methyltransferase") {
                        geneMatrix[geneIndex].options = addStringToArray("Methylation at ", data.c_atoms_for_tailoring.replaceAll(
                            "[", "")
                            .replaceAll("]", "")
                            .replaceAll(" ", "")
                            .split(","));

                        geneMatrix[geneIndex].options.push("No methylation")
                        geneMatrix[geneIndex].default_option = ("No methylation")
                    }
                    if (geneMatrix[geneIndex].tailoringEnzymeType == "o-methyltransferase") {
                        geneMatrix[geneIndex].options = addStringToArray("Methylation at ", data.o_atoms_for_tailoring.replaceAll(
                            "[", "")
                            .replaceAll("]", "")
                            .replaceAll(" ", "")
                            .split(","));

                        geneMatrix[geneIndex].options.push("No methylation")
                        geneMatrix[geneIndex].default_option = ("No methylation")
                    }
                    if (geneMatrix[geneIndex].tailoringEnzymeType == " methyltransferase") {
                        geneMatrix[geneIndex].options = data.o_atoms_for_tailoring.replaceAll(
                            "[", "")
                            .replaceAll("]", "")
                            .replaceAll(" ", "")
                            .split(",");
                        geneMatrix[geneIndex].options = geneMatrix[geneIndex].options.concat(data.c_atoms_for_tailoring.replaceAll(
                            "[", "")
                            .replaceAll("]", "")
                            .replaceAll(" ", "")
                            .split(","));
                        geneMatrix[geneIndex].options = addStringToArray("Methylation at ", geneMatrix[geneIndex].options.concat(data.n_atoms_for_tailoring.replaceAll(
                            "[", "")
                            .replaceAll("]", "")
                            .replaceAll(" ", "")
                            .split(",")));
                        geneMatrix[geneIndex].options.push("No methylation")
                        geneMatrix[geneIndex].default_option = ("No methylation")
                    }
                }
            }
            var url = "data:image/svg+xml;charset=utf-8," +
                encodeURIComponent(data.complete_cluster_svg);
            document.getElementById("save_complete_cluster_svg")
                .href = url
            document.getElementById("save_complete_cluster_svg")
                .setAttribute("download", data.smiles + "_cluster.svg");
            var url = "data:image/svg+xml;charset=utf-8," +
                encodeURIComponent(data.svg);
            document.getElementById("save_svg")
                .href = url
            document.getElementById("save_svg")
                .setAttribute("download", data.smiles + ".svg");
            container.innerHTML = formatSVG(data.svg);
            drawing = document.getElementById("final_drawing")
            drawing.style["max-width"] = "100%"
            drawing.style["max-height"] = "100%"
            smiles_container.innerHTML = " <button type='button' class='save_button'  onclick= navigator.clipboard.writeText('" + data.smiles + "')>" + "<strong> Copy SMILES to clipboard </strong>" + "</button>";
            acpList = obtainACPList(geneMatrix);
            let intermediates = data.hanging_svg;
            return [geneMatrix, intermediates, data]
        })
        .then((data) => {
            let geneMatrix = data[0]
            createOptions(geneMatrix);
            addDragDrop();
            updateDomains(geneMatrix, BGC);
            updateProteins(geneMatrix, BGC);
            addArrowClick(geneMatrix)
            return [data[1], data[2]];
        })
        .then((data2) => {
            intermediates = data2[0]
            data = data2[1]
            if ((typeof (document.getElementById("innerIntermediateContainer_tailoring_enzymes")) != 'undefined' && document.getElementById("innerIntermediateContainer_tailoring_enzymes") != null)) {
                let tailoringEnzymes_intermediate = document.getElementById("innerIntermediateContainer_tailoring_enzymes");
                tailoringEnzymes_intermediate.setAttribute("style", "width:150px")
                tailoringEnzymes_intermediate.innerHTML = formatSVG_intermediates(data.structure_for_tailoring);
                let intermediate_svg = document.getElementById("intermediate_drawing")
                let bbox = intermediate_svg.getBBox();
                let viewBox = [bbox.x, bbox.y, bbox.width, bbox.height].join(" ");

                intermediate_svg.setAttribute("viewBox", viewBox)

                intermediate_svg.setAttribute('id', "intermediate_drawing_tailoring");
                intermediate_svg.setAttribute('class', "intermediate_drawing_tailoring");
            }
            for (let intermediateIndex = 0; intermediateIndex <
                intermediates.length; intermediateIndex++) {
                intermediate = intermediates[intermediateIndex]
                if (starterACP < 1) {
                    starterACP = 1
                }
                let intermediate_container = document.getElementById(
                    'innerIntermediateContainer' + acpList[
                    intermediateIndex + starterACP - 1])
                intermediate_container.setAttribute("style", "width:150px")
                intermediate_container.innerHTML = formatSVG_intermediates(intermediate);
                let intermediate_svg = document.getElementById("intermediate_drawing")
                let bbox = intermediate_svg.getBBox();
                let viewBox = [bbox.x, bbox.y + 38, bbox.width, bbox.height].join(" ");

                intermediate_svg.setAttribute("viewBox", viewBox)
                intermediate_svg.setAttribute('id', "intermediate_drawing" + intermediateIndex);
                intermediate_svg.setAttribute('class', "intermediate_drawing");

            }

        })
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
   * @fires   fetchFromRaichu
   * @input geneMatrix
   * @output array of all tayloring enzymes and their corresponding genes
   */
    tailoringArray = []
    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        if (geneMatrix[geneIndex].tailoringEnzymeStatus == true) {
            let enzymeType = geneMatrix[geneIndex].tailoringEnzymeType.toUpperCase()
            let enzymeArray;
            if (tailoringArray.length > 0) {

                for (const enzyme of tailoringArray) {

                    enzymeArray = enzyme.find(item => item.name == enzymeType)
                    if (enzymeArray) break
                }
            }
            if (!enzymeArray) {
                tailoringArray.push([geneMatrix[geneIndex].id, enzymeType.replace("-", "_").trim(), [geneMatrix[geneIndex].selected_option]]);

            }
            else {
                enzymeArray[1].push(geneMatrix[geneIndex].selected_option);

            }
        }
    }
    return tailoringArray
}
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
            removeSpaceBetweenProteins(proteinsForDisplay))));
    addDragDrop();
}
function obtainACPList(geneMatrix) {
    /**
   * Get list of ACP/PCP to attach the intermediates to it.
   *@input geneMatrix
   * @output acp List
   */
    let acpList = []
    last_domain_status = 0
    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        if (geneMatrix[geneIndex].ko == false && geneMatrix[geneIndex].domains.length !=
            0) {
            for (let domainIndex = 0; domainIndex < geneMatrix[geneIndex].domains
                .length; domainIndex++) {
                if (geneMatrix[geneIndex].domains[domainIndex].ko == false || geneMatrix[geneIndex].domains[domainIndex].ko == "None") {
                    if ((geneMatrix[geneIndex].domains[domainIndex].type.includes(
                        "ACP") || geneMatrix[geneIndex].domains[domainIndex]
                            .type.includes("PP") || geneMatrix[geneIndex].domains[domainIndex]
                                .type.includes("PCP")) && !(geneMatrix[geneIndex].domains[domainIndex]
                                    .type.includes("ACPS")) && last_domain_status == 0) {
                        acpList.push(geneMatrix[geneIndex].domains[domainIndex]
                            .identifier)
                        last_domain_status = 1

                    }
                    else { last_domain_status = 0; }

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
            removeSpaceBetweenProteins(domainsForDisplay))));
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
function createButtonsForEachRegion(){
  let listRegions = []
  for (index = 0; index < recordData[0].regions.length; index++){
    listRegions.push(recordData[0].regions[index].anchor)
  }
  let regionsBar = document.getElementById("regionsBar")
  let innerHTML = ""
  for (index = 0; index < listRegions.length; index++){
    region = listRegions[index]
    innerHTML += `<button type='button' id ='buttonRegion_${region}' class= 'regionButton' onclick=changeRegionTo("${region}")><strong>${region.toUpperCase()}</strong></button>`
  regionsBar.innerHTML = innerHTML
     }
}
function getClusterType(regionIndex){
  return recordData[0].regions[regionIndex].type
}
function getRegionName(regionIndex){
    return recordData[0].regions[regionIndex].anchor
}
function changeRegion(direction){
  regionIndex += direction
  runAlola(regionIndex, details_data, recordData)
}
function changeRegionTo(regionName){
  regionIndex = selectRegion(recordData, regionName)
  runAlola(regionIndex, details_data, recordData)
}
function selectRegion(recordData, regionName) {
    /**
    * Select the index of region from name
   * @fires fetchFromRaichu
   *@input name of region
   *@output index of region
   */
    for (let region_index = 0; region_index < recordData[0].regions.length; region_index++) {
        if (recordData[0].regions[region_index].anchor == regionName) {
            return region_index
        }
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
function openNRPSForm() {
    document.getElementById("popupFormNRPS").style.display = "block";
}
function closeNRPSForm() {
    document.getElementById("popupFormNRPS").style.display = "none";
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
        .html(Arrower.drawClusterSVG(removePaddingBGC(BGCForDisplay)));
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
    let wildcardSubstrate = substrate
    let button = findButtonbyTextContent(substrate)
    setColorOfDropDown(button)
    return wildcardSubstrate
}
function setWildcardModule(moduleType) {
    wildcardModule = moduleType;

    return wildcardModule
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
        "start": 1059,
        "end": 1254,
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
        if (document.getElementById("wildcardnMT")
            .checked) { domainArray.push(["nMT"]) }
        if (document.getElementById("wildcardoMT")
            .checked) { domainArray.push(["oMT"]) }
        if (document.getElementById("wildcardcMT")
            .checked) { domainArray.push(["cMT"]) }
    }
    if (wildcardModule == "terminator_module_nrps") {
        if (document.getElementById("wildcardE")
            .checked) {
            domainArray.push(["E"]);
            longDomainArray.push(defaultADomain, defaultCDomain, defaultEDomain, defaultPCPDomain, defaultTEDomain);
        }

        else { longDomainArray.push(defaultADomain, defaultCDomain, defaultPCPDomain, defaultTEDomain) }
        if (document.getElementById("wildcardnMT")
            .checked) { domainArray.push(["nMT"]) }
        if (document.getElementById("wildcardoMT")
            .checked) { domainArray.push(["oMT"]) }
        if (document.getElementById("wildcardcMT")
            .checked) { domainArray.push(["cMT"]) }
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




    let wildcard_gene = {
        antismashArray: domainArray,
        default_option: [],
        start: 0,
        end: 7254,
        locus_tag: nameWildcardModule,
        displayed: true,

        domains: longDomainArray,
        strand: 1,
        description: "",
        id: nameWildcardModule,

        ko: false,

        options: [],

        position: geneMatrix.length + 1,

        position_in_BGC: geneMatrix.length + 1,

        selected_option: [],
        modules: [{
            "start": 0,
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
        details_data[cluster_type][region_index].orfs.push(wildcard_gene)
    }
    else {
        details_data[region_index].orfs.push(wildcard_gene)
    }
    displayGenes(BGC)
    updateProteins(geneMatrix, BGC)
    updateDomains(geneMatrix, BGC)
    addArrowClick(geneMatrix)
    fetchFromRaichu(details_data, regionName, geneMatrix, cluster_type, BGC)

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
}
function changeSelectedOptionTailoring(geneMatrix, geneIndex, option) {
    /**
    * Change the option in geneMatrix -> more than one option can be selected
   * @fires clickondomaindropdown
   *@input geneMatrix, geneIndex,moduleIndex, domainIndex, option -> find the exact thing to change
   *@yield Selected option correct+ cyclization option correct.
   */
    let button = document.getElementById(geneIndex + "_" + option)
    if (geneMatrix[geneIndex].selected_option.includes(option)) {
        button.setAttribute("style", "background-color: white")
        var optionArray = geneMatrix[geneIndex].selected_option.filter((item) => item !== option);
        geneMatrix[geneIndex].selected_option = optionArray;
    }
    else {
        geneMatrix[geneIndex].selected_option.push(option);
        button.setAttribute("style", "background-color: #E11839")
    }
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
   *@input details_data -> from region.js input, region_index
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

        geneMatrix.push({
            "id": BGC["orfs"][geneIndex].locus_tag,
            "orffunction": orfFunction,
            "tailoringEnzymeStatus": tailoringEnzymeStatus[0],
            "tailoringEnzymeType": tailoringEnzymeStatus[1],
            "position_in_BGC": geneIndex + 1,
            "position": geneIndex + 1,
            "ko": false,
            "displayed": true,
            "default_option": [],
            "selected_option": [],
            "options": [],
            "domains": domains
        });
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
    for (let tailoringEnzymesIndex = 0; tailoringEnzymesIndex < tailoringEnzymes.length; tailoringEnzymesIndex++) {
        let enzymeName = tailoringEnzymes[tailoringEnzymesIndex]
        tailoringEnzymeStatus = orfFunction.search(enzymeName) == -1 ?
            false : true;
        if (tailoringEnzymeStatus == true) {
            return [tailoringEnzymeStatus, enzymeName]
        }

    }
    return [tailoringEnzymeStatus, ""]

}
function runAlola(regionIndex, details_data, recordData){
  regionName = getRegionName(regionIndex)
  cluster_type = getClusterType(regionIndex)
  document.getElementById("BGCHeading").innerHTML = `Biosynthetic gene cluster explorer: ${regionName.toUpperCase()} - ${cluster_type} BGC`
  BGC = Object.keys(recordData[0].regions[regionIndex])
      .reduce(function (obj, k) {
          if (k == "start" || k == "end" || k == "orfs") obj[k] = recordData[
              0].regions[regionIndex][k];
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
  console.log(BGC)
  //remove all checkboxes
  $('input[type=checkbox]').removeAttr('checked');
  updateProteins(geneMatrix, BGC)
  updateDomains(geneMatrix, BGC)
  addArrowClick(geneMatrix)
  fetchFromRaichu(details_data, regionName, geneMatrix, cluster_type, BGC)
}
// adding modules+ opening the form to do so
function addModulesGeneMatrix(geneMatrix, regionName) {
    /**
    *add the moodules from region js to geneMatrix (not custom modules)
   * @fires createGeneMatrix
   *@input geneMatrix
   *@output modified geneMatrix
   */
    //
    region_index = regionName
    //iterate through all domains to assign them to correct module
    if (details_data.hasOwnProperty("nrpspks")) {
        region = details_data.nrpspks[region_index];
    }
    else {
        region = details_data[region_index];
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
function extractAntismashPredictionsFromRegion(details_data, region_index,
    geneMatrix) {
    /**
    * extract the information and predictions from region.js+ combines this information with geneMatrix
   * @fires fetchFromRaichu
   *@input details_data -> from region.js input, region_index,
       geneMatrix
   *@output formatted data for Raichu/Backend
   */
    let outputForRaichu = []
    let region = []
    if (details_data.hasOwnProperty("nrpspks")) {
        region = details_data.nrpspks[region_index];
    }
    else {
        region = details_data[region_index];
    }
    geneMatrix.sort((a, b) => {
        return a.position - b.position;
    });
    let acpCounter = 0
    let starterStatus = 0
    let starterACP = 1
    let typeModule = "";
    let substrate = "";
    let domainArray = [];
    let typesInModule = [];
    let moduleType = "PKS";
    let moduleSubtype = "PKS_TRANS";
    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        if (geneMatrix[geneIndex].ko == false) {
            for (let orfIndex = 0; orfIndex < region.orfs.length; orfIndex++) {
                let orf = region.orfs[orfIndex];
                if (geneMatrix[geneIndex].id == orf.id) {
                    // acp stat helps connecting modules that are within the same module but on different genes
                    let acpStat = 1;

                    for (let moduleIndex = 0; moduleIndex < orf.modules.length; moduleIndex++) {
                        let module = orf.modules[moduleIndex];
                        let startModule = module.start;
                        let endModule = module.end;
                        let nameModule = "module_" + orfIndex + "_" +
                            moduleIndex;
                        acpStat = 0;
                        for (let domainIndex = 0; domainIndex < orf.domains.length; domainIndex++) {
                            let domain = orf.domains[domainIndex];
                            if (geneMatrix[geneIndex].domains[domainIndex].ko ==
                                false || geneMatrix[geneIndex].domains[domainIndex].ko == "None") {
                                let nameDomain = "";
                                let active = "True";
                                let used = "True";
                                let gene = orf.id;
                                let type = "None";
                                let subtype = "None";
                                // checks if domain in module
                                if (startModule >= domain.start && domain.start >=
                                    endModule || endModule >= domain.start &&
                                    domain.start >= startModule) {
                                    type = domain.abbreviation;
                                    if (domain.abbreviation == "") {
                                        type = domain.type
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
                                            }
                                            else { subtype = "None" }
                                        }
                                        else {
                                            subtype = geneMatrix[geneIndex].domains[domainIndex].selected_option
                                        }
                                    }

                                    if ((domain.type.includes("ACP") || domain.type
                                        .includes("PP") || domain.type.includes("PCP")) && moduleType == "NRPS") {
                                        type = "PCP"
                                        acpCounter += 1;
                                        acpStat = 1;
                                    }
                                    if ((domain.type.includes("ACP") || domain.type
                                        .includes("PP") || domain.type.includes("PCP")) && moduleType == "PKS") {
                                        type = "ACP"
                                        acpCounter += 1;
                                        acpStat = 1;
                                    }


                                    if (domain.abbreviation == "AT") {
                                        moduleType = "PKS"
                                        moduleSubtype = "PKS_CIS"
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
                                        }
                                        if (!(geneMatrix[geneIndex].domains[domainIndex].selected_option.length == 0)) {
                                            substrate = geneMatrix[geneIndex].domains[domainIndex].selected_option.toUpperCase()
                                        }
                                    }

                                    geneMatrix[geneIndex].domains[domainIndex].function = type
                                    if (domain.abbreviation == "A") {
                                        if (domain.hasOwnProperty("predictions")) {
                                            if (domain.predictions.length != 0) {
                                                if (domain.predictions[0][1] !=
                                                    "unknown" && domain.predictions[0][1] !="X") {
                                                    substrate = aminoacids[
                                                        domain.predictions[
                                                            0][1].replace(
                                                                "-", '')
                                                            .toLowerCase()]
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
                                      moduleType = "NRPS"
                                      moduleSubtype = "None"
                                    }
                                    if (["AT", "KS", "ACP", "KR"].includes(domain.abbreviation)){
                                      moduleType = "PKS"
                                      if (moduleSubtype == "None"){
                                        moduleSubtype = "PKS_TRANS"
                                      }
                                    }
                                    // to avoid duplicate domains
                                    if (typesInModule.includes(type)){
                                      active = "False";
                                      geneMatrix[geneIndex].domains[domainIndex].ko = true};
                                    domainArray.push([gene, type, subtype, "None", active, used]);
                                    typesInModule.push (type);
                                }
                            }
                        }
                        if (substrate === undefined && moduleType == "PKS") {
                            substrate = "MALONYL_COA"
                        }
                        if (substrate === undefined && moduleType == "NRPS") {
                            substrate = "glycine"
                        }
                        // create module arrays
                        if (acpStat == 1) {
                            let moduleArray = [moduleType, moduleSubtype, substrate, domainArray]
                            if (moduleArray.length != 0) {
                                outputForRaichu.push(moduleArray)
                            }
                            domainArray = [];
                            typesInModule = [];
                        }

                    }
                    break
                }
            }
        }
    }
    return [outputForRaichu, starterACP, geneMatrix]
}
createButtonsForEachRegion()
runAlola(regionIndex, details_data, recordData)
