var RiPPer = {
    version: "1.0.0",
    required: [
        "jquery",
        "svg.js==2.7.1"
    ],
    tooltip_id: "RiPPer-tooltip-1234567890",
    tooltip_id_domain: "RiPPer-tooltip-123"
};

RiPPer.drawArrow = function (width, height, label = null) {
    const arrowContainer = document.createElement('div');
    arrowContainer.style.display = 'inline-flex';
    arrowContainer.style.flexDirection = 'column';
    arrowContainer.style.alignItems = 'center';
    arrowContainer.style.justifyContent = 'center';
    // Width may be passed as pixels; convert if numeric and treat ~10vw target when flagged
    if (typeof width === 'string' && width.endsWith('vw')) {
        arrowContainer.style.width = width;
    } else {
        arrowContainer.style.width = width + 'px';
    }
    // Constrain arrow container height to content; we'll center via flex within parent
    arrowContainer.style.height = height + 'px';

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", typeof width === 'string' ? width : width);
    svg.setAttribute("height", height);
    svg.style.overflow = "visible"; // Allow content to overflow for label

    // Draw arrow
    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arrow.setAttribute("d", `M0,${height / 2} L${width},${height / 2} M${width - 10},${height / 2 - 5} L${width},${height / 2} L${width - 10},${height / 2 + 5}`);
    arrow.setAttribute("stroke", "#000000");
    arrow.setAttribute("stroke-width", "2");
    arrow.setAttribute("fill", "none");
    svg.appendChild(arrow);

    // Add label if provided
    if (label) {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", width / 2);
        text.setAttribute("y", height + 20);
        text.setAttribute("text-anchor", "middle");
        text.textContent = label;
        svg.appendChild(text);
    }

    arrowContainer.appendChild(svg);
    return arrowContainer;
};

RiPPer.leaveSpace = function (width, id, scale, includeArrow = false, arrowLabel = null) {
    // Width-focused boundary: prevent child SVGs from expanding horizontally beyond this width
    const domainContainer = document.getElementById('domain_container');
    const clusterHeight = domainContainer ? domainContainer.clientHeight || 90 : 90;

    const container = document.createElement('div');
    container.style.display = 'inline-flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'stretch';
    container.style.justifyContent = 'center';
    container.style.boxSizing = 'border-box';
    // Use viewport width for arrow gaps if id indicates arrow or width equals special token
    if (id.startsWith('arrow')) {
        container.style.width = '10vw';
    } else {
        container.style.width = String(width) + 'px';
    }
    container.style.height = clusterHeight + 'px';
    container.style.overflow = 'hidden';
    container.style.flexShrink = '0'; // preserve intended width in flex layouts
    container.setAttribute('data-scaling-boundary', 'true');

    const innerContainer = document.createElement('div');
    innerContainer.id = id;
    innerContainer.style.position = 'relative';
    innerContainer.style.flex = '1';
    innerContainer.style.width = '100%';
    innerContainer.style.height = '100%';
    innerContainer.style.overflow = 'hidden';
    innerContainer.setAttribute('data-scaling-boundary', 'true');

    const innerIntermediateContainer = document.createElement('div');
    innerIntermediateContainer.id = 'innerIntermediateContainer_' + id;
    innerIntermediateContainer.setAttribute('class', 'intermediateContainerTailoring');
    innerIntermediateContainer.style.width = '100%';
    innerIntermediateContainer.style.height = '100%';
    innerIntermediateContainer.style.display = 'flex';
    innerIntermediateContainer.style.alignItems = 'center';
    innerIntermediateContainer.style.justifyContent = 'center';
    innerIntermediateContainer.style.overflow = 'hidden';
    innerIntermediateContainer.setAttribute('data-scaling-boundary', 'true');

    innerContainer.appendChild(innerIntermediateContainer);
    container.appendChild(innerContainer);

    if (includeArrow) {
        // Arrow width matches container (10vw) for visual consistency; choose a stable pixel fallback
        const arrowWidth = '10vw';
        const arrowHeight = 30; // keep modest height so midline matches roughly half of domain height
        const arrow = RiPPer.drawArrow(arrowWidth, arrowHeight, arrowLabel);
        arrow.style.flex = '0 0 auto';
        // Arrow is visual aid; do not mark as scaling boundary
        container.appendChild(arrow);
    }

    domainContainer.appendChild(container);
};

// Example usage within RiPPer.drawCluster
RiPPer.drawCluster = function (geneMatrix, proteaseOptions = null, height = 90, space = 600, cleavageSites, geneMatrixHandler) {
    var container = document.getElementById('domain_container');
    container.style.display = 'flex';
    container.style.alignItems = 'stretch';
    container.style.height = height + 'px'; // Set explicit height

    var scale = function (val) {
        return parseInt(val / (1000 / height));
    };

    document.getElementById('domain_container').innerHTML = "";
    document.getElementById('model_gene_container').innerHTML = "";

    RiPPer.drawHeadings(height);
    RiPPer.leaveSpace(space, "precursor", scale);
    RiPPer.leaveSpace(50, "arrow1", scale, true, "Tailoring"); // Arrow between precursor and tailoring enzymes
    RiPPer.drawTailoringEnzymes(geneMatrix, height, scale, geneMatrixHandler);
    RiPPer.leaveSpace(space, "tailoredProduct", scale);
    protease = give_protease(geneMatrix);
    if (document.getElementById("wildcardProtease").checked || protease) {
        
        RiPPer.leaveSpace(50, "arrow2", scale, true, "Cleavage"); // Arrow between tailored product and protease
        RiPPer.drawProtease(height, scale, proteaseOptions, cleavageSites, geneMatrixHandler, protease);
        RiPPer.leaveSpace(space, "cleavedProduct_space", scale);
    }

    return $(container).find("svg")[0];
    
    function give_protease(geneMatrix) {
        for (geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        let gene = geneMatrix[geneIndex]
        if (gene.tailoringEnzymeStatus == true && gene.ko == false) {
            if (gene.tailoringEnzymeAbbreviation == "PROT" || gene.tailoringEnzymeAbbreviation == "PEP") {
                return gene
            }
        }
    }
    return null

}};


RiPPer.drawProtease = (function (height = 90, scale, proteaseOptions, cleavageSites, geneMatrixHandler) {
    var container = document.getElementById('domain_container')
    let size = height /2
    let indent = 0
    let color = "lightgrey"
    let outline = "black"
    var line_svg = SVG(container)
        .size('100%', height)
        .group();

            let domainIdentifier =  "Protease"
            let abbreviation = "Prot"

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
            if (proteaseOptions){
                createProteaseOptions(proteaseOptions, "protease", cleavageSites, innerDropdownContent);
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

            dom.node.id = "protease"
    function createProteaseOptions(proteaseOptions, geneIndex, cleavageSites, innerDropdownContent) {

        proteaseOptions.forEach(option => {
            const button = createOptionButton(option, geneIndex, cleavageSites, geneMatrixHandler);
            innerDropdownContent.appendChild(button);
        });

        return innerDropdownContent;
    }


    function createOptionButton(option, geneIndex, cleavageSites, geneMatrixHandler) {
        const shortOption = getShortOption(option);
        const button = document.createElement('button');

        button.id = `${geneIndex}_${shortOption}`;
        button.textContent = option;

        setButtonStyle(button, option, shortOption, cleavageSites);
        addButtonEventListeners(button, shortOption, geneMatrixHandler);

        return button;
    }

    function getShortOption(option) {
        return hasNumbers(option) ? option.split(" ").pop() : option;
    }

    function hasNumbers(str) {
        return /\d/.test(str);
    }

    function setButtonStyle(button, option, shortOption, cleavageSites) {
        if (option === "No proteolytic cleavage") {
            button.style.backgroundColor = 'lightgrey';
        } else if (cleavageSites.includes(shortOption)) {
            button.style.backgroundColor = '#E11839';
        }
    }

    function addButtonEventListeners(button, shortOption, geneMatrixHandler) {
        button.addEventListener('click', () => {
            geneMatrixHandler.changeSelectedOptionCleavageSites(shortOption);
        });

        button.addEventListener('mouseenter', () => {
            svgHandler.hoverInAtom(shortOption);
        });

        button.addEventListener('mouseleave', () => {
            svgHandler.hoverOutAtom(shortOption);
        });
    }

        });
RiPPer.drawTailoringEnzymes = (function (geneMatrix, height = 90, scale, geneMatrixHandler) {
    var container = document.getElementById('domain_container')
    let size = height / 2
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
            if (gene.tailoringEnzymeAbbreviation == "PROT" || gene.tailoringEnzymeAbbreviation == "PEP") {
                continue
            }
            let points = Domainer.getArrowPoints(
                height / 4, height, height, scale)
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
            if (size > height / 4) {
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
            const atomOptions = atomOption.includes(",")
                ? atomOption.split(",").map(opt => opt.replaceAll(" ", ""))
                : [atomOption.replaceAll(" ", "")];

            button.addEventListener('mouseenter', () => {
                atomOptions.forEach(option => svgHandler.hoverInAtom(option));
            });

            button.addEventListener('mouseout', () => {
                atomOptions.forEach(option => svgHandler.hoverOutAtom(option));
            });
            innerDropdownContainer_folded_1.appendChild(button);
        });
    }

});

RiPPer.drawHeadings = (function (height, space = 600) {
    headingHeigth = height/3
    document.getElementById('module_container')
        .innerHTML = ""
    var innerModuleContainer = document.createElement('div');
    innerModuleContainer.id = "innerModuleContainer" + "_" +
        "precursorPeptide"
    document.getElementById('module_container')
        .appendChild(innerModuleContainer);
    size = space
    var draw = SVG(innerModuleContainer)
        .size(String(size) + "px", headingHeigth)
        .group();
    var dom = draw.rect(size, headingHeigth)
        .x(0)
        .y(0)
        .fill("white")
        .stroke("white")
        .stroke({
            width: 2
        })
    dom.node.id = "module_" + "precursorPeptide"

    var text_module = draw.text("Precursor peptide:").x(size / 3.5).y(headingHeigth / 2 - 7)
        .fill("black")
        .stroke({ width: 1 })
    //tailoring enzyme
    var innerModuleContainer = document.createElement('div');
    innerModuleContainer.id = "innerModuleContainer" + "_" +
        "tailoringEnzyme"
    document.getElementById('module_container')
        .appendChild(innerModuleContainer);
    size = space
    var draw = SVG(innerModuleContainer)
        .size(String(size) + "px", headingHeigth)
        .group();
    var dom = draw.rect(size, headingHeigth)
        .x(0)
        .y(0)
        .fill("white")
        .stroke("white")
        .stroke({
            width: 2
        })
    dom.node.id = "module_" + "tailoringEnzyme"

    var text_module = draw.text("Tailoring enzymes:").x(size / 3.5).y(headingHeigth / 2 - 7)
        .fill("black")
        .stroke({ width: 1 })
    //protease
    var innerModuleContainer = document.createElement('div');
    innerModuleContainer.id = "innerModuleContainer" + "_" +
        "protease"
    document.getElementById('module_container')
        .appendChild(innerModuleContainer);
    size = space
    var draw = SVG(innerModuleContainer)
        .size(String(size) + "px", headingHeigth)
        .group();
    var dom = draw.rect(size, headingHeigth)
        .x(0)
        .y(0)
        .fill("white")
        .stroke("white")
        .stroke({
            width: 2
        })
    if (document.getElementById("wildcardProtease")
        .checked) {
        dom.node.id = "module_" + "protease";
        var text_module = draw.text("Proteolytic cleavage:").x(size / 3.5).y(headingHeigth / 2 - 7)
            .fill("black")
            .stroke({ width: 1 })
    }

});

