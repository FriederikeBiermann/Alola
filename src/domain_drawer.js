/* Copyright 2017 Satria A. Kautsar */
//Colour dicts to match antiSMASH domain colouring
colour_fill_dict = {
    'ACP': '#81bef7',
    "PKS_PP": '#81bef7',
    'PKS_AT': '#f78181',
    'PKS_KS(Modular-KS)': '#81f781',
    'PKS_KS(Trans-AT-KS)': '#81f781',
    'PKS_KS(Hybrid-KS)': '#81f781',
    'PKS_KS(Enediyne-KS)': '#81f781',
    'PKS_KR': '#80f680',
    'PKS_DH': '#f7be81',
    'PKS_DH2': '#f7be81',
    'PKS_ER': '#81f7f3',
    'PKS_TE': '#f5c4f2',
    "Thioesterase": '#f5c4f2',
    'KR*': '#80f680',
    'Condensation_LCL': '#5858b6',
    'Condensation_DCL': '#5858b6',
    'Condensation_Starter': '#5858b6',
    'AMP-binding': '#bc7ff5', 'PCP': '#81bef7', 'Epimerization': '#8181f7', "TIGR01720": '#8181f7',
    "CAL_domain": '#43AA8B',
    "PKS_Docking_Nterm":"#B2B09B",
    "PKS_Docking_Cterm": "#B2B09B",
    "cMT":"#8B9556",
    "oMT": "#8B9556",
    "nMT": "#8B9556",
    "Aminotran_1_2":"#4F928B",
    "NAD_binding_4": "#957580"
}
colour_outline_dict = {
    'PKS_DH2': '#ca9862',
    'PKS_KS(Trans-AT-KS)': '#5fc65f',
    'ACP': '#3d79d6',
    'PKS_PP': '#3d79d6',
    'PKS_AT': '#df5d5d',
    'PKS_KS': '#5fc65f',
    'PKS_KS(Modular-KS)': '#5fc65f',
    'PKS_KS(Hybrid-KS)': '#5fc65f',
    'PKS_KS(Enediyne-KS)': '#5fc65f',
    'PKS_KR': '#5fbb87',
    'PKS_DH': '#ca9862',
    'PKS_ER': '#61bbad',
    'PKS_TE': '#a25ba0',
    'Thioesterase': '#a25ba0',
    'KR*': '#5fbb87',
    'Condensation_LCL': '#3E3E8E',
    'Condensation_DCL': '#3E3E8E',
    'Condensation_Starter': '#3E3E8E',
    'AMP-binding': '#922EEF', 'PCP': '#1988F0', 'Epimerization': '#5252F4', "TIGR01720": '#5252F4',
    "CAL_domain": '#296654',
    "PKS_Docking_Nterm": "#737159",
    "PKS_Docking_Cterm": "#737159",
        "cMT":"#60683C",
    "oMT": "#60683C",
    "nMT": "#60683C",
    "Aminotran_1_2": "#2B504C",
    "NAD_binding_4": "#6D545D"
}
function hasNumbers(t) {
    var regex = /\d/g;
    return regex.test(t);
}
var Domainer = {
    version: "1.0.0",
    required: [
        "jquery",
        "svg.js==2.7.1"
    ],
    tooltip_id: "Domainer-tooltip-1234567890",
    tooltip_id_domain: "Domainer-tooltip-123"
};
Domainer.drawClusterSVG = function (cluster, height = 90, geneMatrixHandler) 
{
    let moduleMatrix = geneMatrixHandler.moduleMatrix;
    let geneMatrix = geneMatrixHandler.geneMatrix;
    let recordData = geneMatrixHandler.recordData;
    const container = document.getElementById('domain_container');
    container.innerHTML = "";

    const scale = val => parseInt(val / (1000 / height));
    const width = scale(cluster.end - cluster.start);


    if (cluster.orfs) {
        drawOrfs(cluster.orfs, height, scale, geneMatrix);
    }

    finalizeSvg(container);

    Domainer.drawModules(moduleMatrix, height, scale);
    Domainer.drawGenes(geneMatrix, height, scale);
    Domainer.leaveSpaceForTailoring(height * 2, scale);
    Domainer.drawTailoringEnzymes(cluster, geneMatrix, height, scale, geneMatrixHandler);

    return container.querySelector("svg");

    function drawOrfs(orfs, height, scale, geneMatrix) {
        const indentSteps = height / 6;
        orfs.forEach(orf => {
            if (orf.domains) {
                drawDomains(orf, orf.domains, height, scale, geneMatrix, indentSteps);
            }
        });
    }

    function drawDomains(orf, domains, height, scale, geneMatrix, indentSteps) {
        domains.forEach(domain => {
            const domainData = getDomainData(domain, orf, geneMatrix);
            if (domainData) {
                createDomainElements(domainData, height, scale, indentSteps);
            }
        });
    }

    function getDomainData(domain, orf, geneMatrix) {
        const geneIndex = geneMatrix.findIndex(gene => gene.id === orf.locus_tag);
        if (geneIndex === -1) return null;

        const gene = geneMatrix[geneIndex];
        if ((!gene.modules || gene.modules.length === 0) && !shouldCreateModule(gene)) {
            return null;
        }

        if (!gene.modules || gene.modules.length === 0) {
            gene.modules = [{ domains: gene.domains }];
        }

        for (let moduleIndex = 0; moduleIndex < gene.modules.length; moduleIndex++) {
            const domainIndex = gene.modules[moduleIndex].domains.findIndex(d => d.start === domain.start);
            let domain_with_options = gene.domains.find(d => d.start === domain.start);
            if (domainIndex !== -1) {
                return { gene, moduleIndex, domainIndex, domain_with_options};
            }
        }

        return null;
    }

    function shouldCreateModule(gene) {
        return BIOSYNTHETIC_CORE_ENZYMES.includes(gene.orffunction) || gene.type.includes("biosynthetic") || gene.hasOwnProperty("modules");
    }

    function shouldIndentDomain(domainType) {
        return ['DH', 'ER'].includes(domainType);
    }

    function createDomainElements(domainData, height, scale, indentSteps) {
        const { gene, moduleIndex, domainIndex, domain_with_options } = domainData;
        const domainInfo = domain_with_options;

        const domainIdentifier = domainInfo.identifier.replace(".", "_");
        const containerElements = createContainerElements(domainIdentifier);
        const size = getDomainSize(domainInfo, height);
        const color = getDomainColor(domain_with_options);
        const opacity = domainInfo.ko ? "0.5" : "1";
        const points = Domainer.getDomainPoints(domain_with_options, gene, cluster, height, scale);
        const indent = shouldIndentDomain(domainInfo.
            abbreviation) ? indentSteps : 0;

        // Set the width of the container
        containerElements.container.style.width = `${size - 10}px`;

        // Ensure the button fills the container
        containerElements.button.style.width = '100%';
        containerElements.button.style.height = '100%';
        containerElements.button.style.padding = '0';
        containerElements.button.style.border = 'none';

        createDomainSvg(containerElements.button, size, height, color, opacity, domainInfo, points, indent);
        populateDropdownContent(containerElements.content, gene, moduleIndex, domainIndex, domainInfo);

        return containerElements;
    }
    function createContainerElements(domainIdentifier) {
        const container = document.createElement('div');
        container.id = `innerdomainContainer${domainIdentifier}`;
        container.className = "box";

        const dropdownContainer = document.createElement('div');
        dropdownContainer.id = `innerDropdownContainer${domainIdentifier}`;
        dropdownContainer.className = "dropdown";

        const button = document.createElement('button');
        button.id = `innerDropdownButton${domainIdentifier}`;
        button.className = "dropbtn";

        const content = document.createElement('div');
        content.id = `innerDropdownContent${domainIdentifier}`;
        content.className = "dropdown-content";

        const intermediateContainer = document.createElement('div');
        intermediateContainer.id = `innerIntermediateContainer${domainIdentifier}`;
        intermediateContainer.className = "intermediateContainer";

        dropdownContainer.appendChild(button);
        dropdownContainer.appendChild(content);
        container.appendChild(dropdownContainer);
        container.appendChild(intermediateContainer);

        document.getElementById('domain_container').appendChild(container);

        return { container, button, content };
    }

    function getDomainSize(domainInfo, height) {
        const smallDomainTypes = ["term", "ACP", "PP", "PCP", "docking"];
        return smallDomainTypes.some(type => domainInfo.type.includes(type)) ? height / 4 : height / 2;
    }

    function getDomainColor(domain) {
        if (domain.type) {
            return {
                fill: colour_fill_dict[domain.type] || "#0486F1",
                outline: colour_outline_dict[domain.type] || "#025AA1"
            };
        }
        return { fill: "#0486F1", outline: "#025AA1" };
    }


    function createDomainSvg(container, size, height, color, opacity, domainInfo, points, indent) {
        const draw = SVG(container).size(`${size}px`, height).group();
        const dom = draw.rect(size - 2, size - 2)
            .x(2)
            .y(height - indent - (size + 2))
            .rx("200%")
            .ry("200%")
            .fill(color.fill)
            .opacity(opacity)
            .stroke({ width: 2, color: color.outline });

        if (size > height / 4) {
            draw.text(domainInfo.abbreviation).x(size / 2 + 1).y(height - indent - (size / 2 + 1) - 7);
        }

        dom.node.id = `domain${domainInfo.identifier.replace(".", "_")}`;
        addDomainEventListeners(dom.node, domainInfo);
    }

    function addDomainEventListeners(domNode, domainInfo) {
        $(domNode).mouseover({ domain: domainInfo }, function (event) {
            $("#" + Domainer.tooltip_id).css("display", "none");
            Domainer.showToolTip(`Domain: ${domainInfo.abbreviation} (${domainInfo.type})<br/>${domainInfo.start} - ${domainInfo.end}`, event);
            $(event.target).css("stroke-width", "3px");
            event.stopPropagation();
        });

        $(domNode).mouseleave(function (event) {
            $(event.target).css("stroke-width", "2px");
            $("#" + Domainer.tooltip_id).css("display", "none");
        });
    }

    function populateDropdownContent(contentElement, gene, moduleIndex, domainIndex, domainInfo) {
        const options = domainInfo.domainOptions.sort((a, b) => a.localeCompare(b)).sort((a, b) => a.length - b.length);
        options.forEach((option, optionIndex) => {
            const shortOption = hasNumbers(option) ? option.split(" ").pop() : option;
            const button = createOptionButton(gene, moduleIndex, domainIndex, optionIndex, shortOption, option);
            contentElement.appendChild(button);
        });
    }

    function createOptionButton(gene, moduleIndex, domainIndex, optionIndex, shortOption, fullOption) {
        const button = document.createElement('button');
        button.id = `${gene.index}_${moduleIndex}_${domainIndex}_${optionIndex}`;
        button.onclick = () => geneMatrixHandler.changeSelectedOption(gene.index, moduleIndex, domainIndex, shortOption, optionIndex);
        button.onmouseenter = () => svgHandler.hoverInAtom(shortOption);
        button.onmouseout = () => svgHandler.hoverOutAtom(shortOption);
        button.textContent = fullOption.replaceAll("_", " ");

        const domainInfo = gene.modules[moduleIndex].domains[domainIndex];
        if (shortOption === domainInfo.default_option) {
            button.style.backgroundColor = "lightgrey";
            button.id = `de${button.id}`;
        } else if (shortOption === domainInfo.selected_option) {
            button.style.backgroundColor = "#E11839";
        }

        return button;
    }

    function updateModuleVisualization(gene, moduleIndex, size) {
        const moduleContainer = document.createElement('div');
        moduleContainer.id = `innerModuleContainer${gene.index}_${moduleIndex}`;
        // Add module visualization logic here
    }

    function finalizeSvg(container) {
        $(container).find("svg").each(function () {
            let currentWidth = parseFloat($(this).attr("width")); // Get current width as a number
            let newWidth = currentWidth + 3; // Add 3 to the width
            $(this).attr("width", newWidth + "px"); // Set the new width
        });
    }

    function hasNumbers(str) {
        return /\d/.test(str);
    }
};
Domainer.leaveSpaceForTailoring = (function (width, scale) {
    var innerIntermediateContainer = document.createElement('div');
    var innerContainer = document.createElement('div');
    innerContainer.id = 'innerTailoringContainer'
    innerIntermediateContainer.id = "innerIntermediateContainer_tailoring_enzymes"
    innerIntermediateContainer.setAttribute("class", "intermediateContainerTailoring")
    document.getElementById('domain_container').appendChild(innerContainer);
    innerContainer.appendChild(innerIntermediateContainer);
    innerContainer.style.width = String(width) + "px";
})
Domainer.drawTailoringEnzymes = (function (cluster, geneMatrix, height = 90, scale, geneMatrixHandler) {
    var container = document.getElementById('domain_container')
    let size = height/2
    let indent = 0
    let color = "lightgrey"
    let outline = "black"
    var line_svg = SVG(container)
        .size('100%', height)
        .group();
    for (geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        let gene = geneMatrix[geneIndex]
        if (gene.tailoringEnzymeStatus == true && gene.ko == false) {
            let domainIdentifier = "tailoringEnzyme" + geneMatrix[geneIndex].id.replace(".", "_")

            let points = Domainer.getArrowPoints(
                height/4, height, height, scale)
            let abbreviation = gene.tailoringEnzymeAbbreviation;

            // add all the neccesary domain containers
            var innerContainer = document.createElement(
                'div');
            innerContainer.id =
                "innerdomainContainer" +
                domainIdentifier
            var innerDropdownContainer =
                document.createElement(
                    'div');
            innerDropdownContainer.id =
                "innerDropdownContainer" +
                domainIdentifier

            var innerIntermediateContainer =
                document.createElement(
                    'div');
            innerIntermediateContainer.id =
                "innerIntermediateContainer_tailoring_enzymes"
            var innerDropdownButton =
                document.createElement(
                    'button');
            innerDropdownButton.id =
                "innerDropdownButton" +
                domainIdentifier
            var innerDropdownContent =
                document.createElement(
                    'div');
            innerDropdownContent.id =
                "innerDropdownContent" +
                domainIdentifier
            innerContainer.style.width =
                String(size - 10) + "px"
            document.getElementById(
                'domain_container')
                .appendChild(innerContainer);
            document.getElementById(
                'innerdomainContainer' +
                domainIdentifier)
                .setAttribute("class",
                    "box");
            document.getElementById(
                'innerdomainContainer' +
                domainIdentifier)
                .appendChild(
                    innerDropdownContainer);
            document.getElementById(
                "innerDropdownContainer" +
                domainIdentifier)
                .setAttribute("class",
                    "dropdown-tailoring");
            document.getElementById(
                'innerDropdownContainer' +
                domainIdentifier)
                .appendChild(
                    innerDropdownButton);
            document.getElementById(
                "innerDropdownButton" +
                domainIdentifier)
                .setAttribute("class",
                    "dropbtn-tailoring");
            document.getElementById(
                'innerDropdownContainer' +
                domainIdentifier)
                .appendChild(
                    innerDropdownContent);
            document.getElementById(
                "innerDropdownContent" +
                domainIdentifier)
                .setAttribute("class",
                    "dropdown-content-tailoring");
            innerDropdownContent.innerHTML =
                ""
            options = geneMatrix[geneIndex].options
            reaction_options = Object.keys(options)
            for (let reactionOptionIndex = 0; reactionOptionIndex <
                reaction_options.length; reactionOptionIndex++) {
                let reactionOption = reaction_options[reactionOptionIndex].toString();
                let reactionOptionContent = "<button class=dropdown_button_folded id=button" + geneIndex + "_" + reactionOption.replaceAll(" ", "_") + ">" + reactionOption.replaceAll("_", " ") + "</button>";
                innerDropdownContent.innerHTML += reactionOptionContent
            }
            for (let reactionOptionIndex = 0; reactionOptionIndex <
                reaction_options.length; reactionOptionIndex++) {
                let reactionOption = reaction_options[reactionOptionIndex].toString();
                // create all the folded dropdowns
                var innerDropdownContainer_folded_1 =
                    document.createElement(
                        'div');
                innerDropdownContainer_folded_1.id =
                    "innerDropdownContainer" + geneIndex + "_" + reactionOption.replaceAll(" ", "_")
                var innerDropdownContent =
                    document.createElement(
                        'div');
                innerDropdownContent.id =
                    "innerDropdownContent" +
                    domainIdentifier
                document.getElementById(
                    "button" + geneIndex + "_" + reactionOption.replaceAll(" ", "_"))
                    .appendChild(
                        innerDropdownContainer_folded_1);
                innerDropdownContainer_folded_1
                    .setAttribute("class",
                        "dropdown-tailoring-folded");
                innerDropdownContainer_folded_1
                    .appendChild(
                        innerDropdownContent);
                innerDropdownContainer_folded_1
                    .setAttribute("class",
                        "dropdown-content-tailoring-folded");
                innerDropdownContainer_folded_1.innerHTML =
                    ""
                let atomOptions = options[reactionOption]
                if (atomOptions) {
                    createButtons(atomOptions, geneIndex, reactionOption, innerDropdownContainer_folded_1, geneMatrixHandler, svgHandler);
                }

            }




            let x = 0;
            if (points["0"].x > points["4"].x) {
                x = points["4"].x
            }
            else {
                x = points["0"].x
            }
            var draw = SVG(innerDropdownButton)
                .size(String(size) + "px", height)
                .group();
            var dom = draw.rect(size - 2, size - 2)
                .x(1)
                .y(height - indent - (size + 3))
                .rx("200%")
                .ry("200%")
                .fill(color)
                .stroke({
                    width: 2, color: outline
                });
            if (size > height/4) {
                var text = draw.text(abbreviation).x(size / 2 - 1 + 2).y(height - indent - (size / 2 + 1) - 7)
            }

            dom.node.id = "tailoringEnzyme_" + geneMatrix[geneIndex].id.replace(".", "_")

        }
    }
    function createButtons(atomOptions, geneIndex, reactionOption, innerDropdownContainer_folded_1, geneMatrixHandler, svgHandler) {
        atomOptions.forEach(atomOption => {
            const button = document.createElement('button');
            const atomOptionCleaned = atomOption.replaceAll(" ", "");
            button.id = `${geneIndex}_${reactionOption.replaceAll(" ", "")}${atomOptionCleaned}`;
            button.textContent = atomOptionCleaned;

            button.addEventListener('click', () => {
                geneMatrixHandler.changeSelectedOptionTailoring(geneIndex, reactionOption, atomOptionCleaned);
            });

            if (atomOption.includes(",")) {
                const [atomOption1, atomOption2] = atomOption.split(",").map(opt => opt.replaceAll(" ", ""));

                button.addEventListener('mouseenter', () => {
                    svgHandler.hoverInAtom(atomOption1);
                    svgHandler.hoverInAtom(atomOption2);
                });

                button.addEventListener('mouseout', () => {
                    svgHandler.hoverOutAtom(atomOption1);
                    svgHandler.hoverOutAtom(atomOption2);
                });
            } else {
                button.addEventListener('mouseenter', () => svgHandler.hoverInAtom(atomOptionCleaned));
                button.addEventListener('mouseout', () => svgHandler.hoverOutAtom(atomOptionCleaned));
            }

            innerDropdownContainer_folded_1.appendChild(button);
        });
    }

});

Domainer.drawGenes = (function (geneMatrix, height = 90, scale) {
    document.getElementById('model_gene_container')
        .innerHTML = ""
    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        let geneSize = 0
        let lengthVisualisation = 0
        if (geneMatrix[geneIndex].ko == false && (geneMatrix[geneIndex].hasOwnProperty(
            "modules") || BIOSYNTHETIC_CORE_ENZYMES.includes(geneMatrix[geneIndex].orffunction) || geneMatrix[geneIndex].type.includes("biosynthetic"))) {
            if (geneMatrix[geneIndex].hasOwnProperty("domains")) {
                for (let domainIndex = 0; domainIndex < geneMatrix[
                    geneIndex].domains.length; domainIndex++) {
                    domain = geneMatrix[
                        geneIndex].domains[domainIndex].type
                    if (domain.includes(
                        "term") || domain.includes(
                            "ACP") || domain.includes(
                                "PP") || domain.includes("PCP") || domain.includes("docking")) {
                        bubble_size = height/4;
                    }
                    else {
                        bubble_size = height/2;
                    }
                    lengthVisualisation += bubble_size
                };
                geneSize = lengthVisualisation - 3
            }
        }


        if (geneSize > 0) {
            var innerModelGeneContainer = document.createElement('div');
            innerModelGeneContainer.id = "innerModelGeneContainer" + "_" +
                geneMatrix[geneIndex].id
            document.getElementById('model_gene_container')
                .appendChild(innerModelGeneContainer);
            var draw = SVG(innerModelGeneContainer)
                .size(String(geneSize) + "px", height/2)
                .group();

            var pol = draw.polygon(Domainer.toPointString(Domainer.getArrowPoints(0, geneSize, height / 2, scale)))
                .fill("white")

                .stroke("#2B2B2B")
                .stroke({
                    width: 1
                })
            if (geneSize < height / 2) {
                var text = draw.text(geneMatrix[geneIndex].id.replace(".", "_").slice(-4)).x(geneSize / 2).y(height / 4 - 7)
            }

            else { var text = draw.text(geneMatrix[geneIndex].id.replace(".", "_")).x(geneSize / 2).y(height / 4 - 7) }


            pol.node.id = "module_gene_" + geneIndex
        }
    }
// leave space for tailoring
    var innerModelGeneContainer = document.createElement('div');
    innerModelGeneContainer.id = "innerModelGeneContainer_whitespace"
    document.getElementById('model_gene_container')
        .appendChild(innerModelGeneContainer);
    innerModelGeneContainer.style.width = String(height*2.2) + "px";
    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        let gene_size = height / 2

        if (geneMatrix[geneIndex].tailoringEnzymeStatus == true) {
            var innerModelGeneContainer = document.createElement('div');
            innerModelGeneContainer.id = "innerModelGeneContainer" + "_" +
                geneMatrix[geneIndex].id
            document.getElementById('model_gene_container')
                .appendChild(innerModelGeneContainer);
            var draw = SVG(innerModelGeneContainer)
                .size(String(gene_size-2) + "px", height)
                .group();

            var pol = draw.polygon(Domainer.toPointString(Domainer.getArrowPoints(0, gene_size-3, height/2, scale)))
                .fill("white")

                .stroke("#2B2B2B")
                .stroke({
                    width: 1
                })
            if (gene_size < height * 0.75 ) { var text = draw.text(geneMatrix[geneIndex].id.slice(-4)).x(gene_size / 2).y(height / 4 - 7) }
            else { var text = draw.text(geneMatrix[geneIndex].id).x(gene_size / 2).y(height / 4 - 7) }


            pol.node.id = "module_gene_" + geneIndex
        }

    }
});
Domainer.drawModules = (function (moduleMatrix, height, scale) {
    module_height = height/3 
    document.getElementById('module_container')
        .innerHTML = ""
    for (let moduleIndex = 0; moduleIndex < moduleMatrix.length; moduleIndex++) {
        let lengthVisualisation = 0
        domains = moduleMatrix[moduleIndex].domains;
        for (domainIndex in domains) {
            domain = domains[domainIndex]
            if (domain.includes(
                "term") || domain.includes(
                    "ACP") || domain.includes(
                        "PP") || domain.includes("PCP") || domain.includes("docking")) {
                bubble_size = height/4;
            }
            else {
                bubble_size = height/2;
            }
            lengthVisualisation += bubble_size;
        };
        size = lengthVisualisation - 3;
        if (size > 0) {
            var innerModuleContainer = document.createElement('div');
            innerModuleContainer.id = "innerModuleContainer" + "_" + moduleIndex;
            document.getElementById('module_container')
                .appendChild(innerModuleContainer);
            var draw = SVG(innerModuleContainer)
                .size(String(size) + "px", module_height)
                .group();
            var dom = draw.rect(size, module_height)
                .x(0)
                .y(0)
                .fill("#2B2B2B")
                .stroke("#2B2B2B")
                .stroke({
                    width: 2
                })
            dom.node.id = "module_" + moduleIndex
            if (size >= height*0.75) {
                var text_module = draw.text("Module " + String(moduleIndex + 1)).x(size / 2).y(module_height / 2 - 7).fill("white")
            }
            else { var text_module = draw.text(String(moduleIndex + 1)).x(size / 2).y(module_height / 2 - 7).fill("white") }
        }
    }
    //tailoring enzyme
    var innerModuleContainer = document.createElement('div');
    innerModuleContainer.id = "innerModuleContainer_tailoringEnzyme";
    document.getElementById('module_container')
        .appendChild(innerModuleContainer);
    size = height * 3;
    var draw = SVG(innerModuleContainer)
        .size(String(size) + "px", module_height)
        .group();
    var dom = draw.rect(size, module_height)
        .x(0)
        .y(0)
        .fill("white")
        .stroke("white")
        .stroke({
            width: 2
        });
    dom.node.id = "module_tailoringEnzyme";

    var text_module = draw.text("Tailoring enzymes:").x(size / 3.5).y(module_height / 2 - 7)
        .fill("black")
        .stroke({ width: 1 })
});
Domainer.getOrfPoints = (function (start, end, height, scale) {
    let strand = 1
    var x_points = [
        start,
        (strand === 0) ?
            start + (end - start)
            : (((end - start) > (height / 2)) ?
                start + Math.max(end - start - ((end - start) / 4), ((end - start) - parseInt(height / 2)))
                : (start)),
        start + (end - start)
    ];
    var y_points = [
        (strand === 0) ?
            ((height / 2) - (height / 3))
            : ((height / 2) - (height / 3)) - (height / 5),
        ((height / 2) - (height / 3)),
        (height / 2),
        ((height / 2) + (height / 3)),
        (strand === 0) ?
            ((height / 2) + (height / 3))
            : ((height / 2) + (height / 3)) + (height / 5)
    ];


    return { x: x_points, y: y_points };
});
Domainer.getArrowPoints = (function (orf, height, scale) {
    var points = [];
    var pts = Domainer.getOrfPoints(orf, height, scale);
    points.push({ // blunt start
        x: pts.x[0],
        y: pts.y[1]
    });
    points.push({ // junction top
        x: pts.x[2],
        y: pts.y[1]
    });
    points.push({ // junction top-top
        x: pts.x[2],
        y: pts.y[1]
    });
    points.push({ // pointy end
        x: pts.x[2],
        y: pts.y[2]
    });
    points.push({ // junction bottom-bottom
        x: pts.x[2],
        y: pts.y[3]
    });
    points.push({ // junction bottom
        x: pts.x[1],
        y: pts.y[3]
    });
    points.push({ // blunt end
        x: pts.x[0],
        y: pts.y[3]
    });

    return points;
});
Domainer.getDomainPoints = (function (domain, orf, cluster, height, scale) {
    var points = [];
    var protein_pts = Proteiner.getproteinPoints(orf, cluster, height,
        scale);
    if (orf.strand < 0) {
        protein_pts = Proteiner.flipHorizontal(protein_pts, scale(orf.start),
            (scale(orf.start) + scale(orf.end - orf.start)));
    }
    protein_pts.splice(3, 0, protein_pts[3]); // convert into bluntish-end protein
    var domain_x = {
        start: (scale(orf.start) + scale(domain.start * 3)),
        end: (scale(orf.start) + scale(domain.end * 3))
    };
    var getY = function (x) {
        if ((protein_pts[5].x - protein_pts[4].x) == 0) {
            return 0;
        }
        var m = Math.abs(protein_pts[5].y - protein_pts[4].y) /
            Math.abs(protein_pts[5].x - protein_pts[4].x);
        return (m * (x - protein_pts[4].x));
    }
    for (var i in protein_pts) {
        var apt = protein_pts[i];
        var new_point = {};
        new_point.x = apt.x < domain_x.start ? domain_x.start : (apt.x >
            domain_x.end ? domain_x.end : apt.x);
        new_point.y = (new_point.x < protein_pts[1].x) ?
            Math.min(Math.max(apt.y, protein_pts[0].y), protein_pts[7].y) :
            ((new_point.x == protein_pts[1].x) ?
                apt.y :
                (i < 4 ?
                    (protein_pts[3].y + getY(new_point.x)) :
                    (protein_pts[3].y - getY(new_point.x))));
        // apply margin
        if (i < 4) { // upper
            new_point.y += (height / 20);
        }
        else { // lower
            new_point.y -= (height / 20);
        }
        points.push(new_point);
    }
    if (orf.strand < 0) {
        points = Proteiner.flipHorizontal(points, scale(orf.start), (
            scale(orf.start) + scale(orf.end - orf.start)));
    }
    return points;
});
Domainer.flipHorizontal = (function (points, leftBound, rightBound) {
    var new_points = [];
    for (var i in points) {
        var point = points[i];
        if ((point.x < leftBound) || (point.x > rightBound)) { }
        else {
            new_points.push({
                x: rightBound - (point.x - leftBound),
                y: point.y
            });
        }
    }
    return new_points;
});
Domainer.toPointCoordinates = (function (points) {
    coordinates = [points["0"].x, points["0"].y, (points["4"].x -
        points["0"].x), (points["4"].y - points["0"].y)]
    coordinates_string = points["0"].x.toString() + "," + points["0"].y
        .toString() + "," + (points["4"].x - points["0"].x)
            .toString() + "," + (points["4"].y - points["0"].y)
                .toString()
    return coordinates
});
Domainer.toPointString = (function (points) {
    points_string = "";
    for (var i in points) {
        var point = points[i];
        if (i > 0) {
            points_string += ", ";
        }
        points_string += parseInt(point.x) + "," + parseInt(point.y);
    }
    return points_string;
});
Domainer.getRandomCluster = (function () {
    function random(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    var cl_start = 23000;
    var cl_end = 23000 + random(5000, 50000);
    var orfs = [];
    var num_orfs = random(5, 20);
    for (var i = 0; i < num_orfs; i++) {
        var pos1 = random(i * ((cl_end - cl_start) / num_orfs), (i + 1) *
            ((cl_end - cl_start) / num_orfs));
        var pos2 = random(i * ((cl_end - cl_start) / num_orfs), (i + 1) *
            ((cl_end - cl_start) / num_orfs));
        if (Math.abs(pos1 - pos2) < 200) {
            continue;
        }
        var orf_start = Math.min(pos1, pos2);
        var orf_end = Math.max(pos1, pos2);
        var orf_strand = Math.random() > 0.5 ? 1 : -1; //random(-1, 2);
        var orf_type = Math.random() > 0.5 ? "biosynthetic" : "others";
        var orf_domains = [];
        var num_domains = random(0, 4);
        for (var j = 0; j < num_domains; j++) {
            var dpos1 = random(j * ((orf_end - orf_start) / num_domains),
                (j + 1) * ((orf_end - orf_start) / num_domains));
            var dpos2 = random(j * ((orf_end - orf_start) / num_domains),
                (j + 1) * ((orf_end - orf_start) / num_domains));
            var dom_start = Math.min(dpos1, dpos2);
            var dom_end = Math.max(dpos1, dpos2);
            orf_domains.push({
                code: "RAND_DOM_" + i + "_" + j,
                start: dom_start,
                end: dom_end,
                bitscore: random(30, 300),
                color: "rgb(" + random(0, 256) + "," + random(0,
                    256) + "," + random(0, 256) + ")",
            });
        }
        orfs.push({
            id: "RAND_ORF_" + i,
            desc: "Randomly generated ORF",
            start: orf_start,
            end: orf_end,
            strand: orf_strand,
            domains: orf_domains
        });
    }
    var cluster = {
        start: cl_start,
        end: cl_end,
        orfs: orfs,
        desc: 'Randomly generated Cluster'
    };
    return cluster;
});
Domainer.drawRandomClusterSVG = (function () {
    return Domainer.drawClusterSVG(Domainer.getRandomCluster());
});
Domainer.showToolTip = (function (html, handler) {
    var divTooltip = ""
    divTooltip = $("#" + Domainer.tooltip_id);
    if (divTooltip.length < 1) {
        divTooltip = $("<div id='" + Domainer.tooltip_id + "'>");
        divTooltip.css("background-color", "white");
        divTooltip.css("border", "1px solid black");
        divTooltip.css("color", "black");
        divTooltip.css("font-size", "small");
        divTooltip.css("padding", "0 5px");
        divTooltip.css("pointer-events", "none");
        divTooltip.css("position", "fixed");
        divTooltip.css("z-index", "99999");
        divTooltip.appendTo($(document.body));
    }
    divTooltip.html(html);
    divTooltip.css("cursor", "default");
    divTooltip.css("top", handler.clientY + "px");
    divTooltip.css("left", handler.clientX + "px");
    divTooltip.css("display", "block");
    if (html.includes("a")) {
        divTooltip.addClass("dropdown-content");
    }
});
