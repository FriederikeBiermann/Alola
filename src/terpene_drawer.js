var Terpener = {
    version: "1.0.0",
    required: [
        "jquery",
        "svg.js==2.7.1"
    ],
    tooltip_id: "Terpener-tooltip-1234567890",
    tooltip_id_domain: "Terpener-tooltip-123"
};

Terpener.drawArrow = function (width, height, label = null) {
    const arrowContainer = document.createElement('div');
    arrowContainer.style.display = 'inline-flex';
    arrowContainer.style.flexDirection = 'column';
    arrowContainer.style.alignItems = 'center';
    arrowContainer.style.justifyContent = 'center';
    arrowContainer.style.width = width + 'px';
    arrowContainer.style.height = '100%';

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.style.overflow = "visible";

    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arrow.setAttribute("d", `M0,${height / 2} L${width},${height / 2} M${width - 10},${height / 2 - 5} L${width},${height / 2} L${width - 10},${height / 2 + 5}`);
    arrow.setAttribute("stroke", "#000000");
    arrow.setAttribute("stroke-width", "2");
    arrow.setAttribute("fill", "none");
    svg.appendChild(arrow);

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


Terpener.leaveSpace = function (width, id, scale, includeArrow = false, arrowLabel = null) {
    // Create outer container acting as a fixed scaling boundary
    const domainContainer = document.getElementById('domain_container');
    const clusterHeight = domainContainer ? domainContainer.clientHeight || 90 : 90;

    var container = document.createElement('div');
    container.style.display = 'inline-flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'stretch';
    container.style.justifyContent = 'center';
    container.style.boxSizing = 'border-box';
    container.style.width = String(width) + "px";
    // Use explicit pixel height to prevent auto-expansion that breaks scaling calculations
    container.style.height = clusterHeight + 'px';
    container.style.overflow = 'hidden';
    container.setAttribute('data-scaling-boundary', 'true');

    // Inner wrapper (flex item)
    var innerContainer = document.createElement('div');
    innerContainer.id = id;
    innerContainer.style.position = 'relative';
    innerContainer.style.flex = '1';
    innerContainer.style.width = '100%';
    innerContainer.style.height = '100%';
    innerContainer.style.overflow = 'hidden';
    innerContainer.setAttribute('data-scaling-boundary', 'true');

    // Intermediate container that will hold the SVG content
    var innerIntermediateContainer = document.createElement('div');
    innerIntermediateContainer.id = "innerIntermediateContainer_" + id;
    innerIntermediateContainer.setAttribute("class", "intermediateContainerTailoring");
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
        const arrowWidth = 50; // adjustable
        const arrowHeight = 30; // adjustable
        const arrow = Terpener.drawArrow(arrowWidth, arrowHeight, arrowLabel);
        // Arrow should not influence scaling of SVGs -> no data-scaling-boundary
        arrow.style.flex = '0 0 auto';
        container.appendChild(arrow);
    }

    domainContainer.appendChild(container);
};


Terpener.drawCluster = function (geneMatrix, height = 90, space = 300, terpeneCyclaseOptions, geneMatrixHandler) {
    var container = document.getElementById('domain_container');
    // container.style.display = 'flex';
    // container.style.alignItems = 'stretch';
    container.style.height = height + 'px';

    var scale = function (val) {
        return parseInt(val / (1000 / height));
    };

    document.getElementById('domain_container').innerHTML = "";
    document.getElementById('model_gene_container').innerHTML = "";

    Terpener.drawHeadings(height, space);

    // Precursor section
    Terpener.leaveSpace(space, "precursor", scale);

    // Arrow between Precursor and Cyclization
    Terpener.leaveSpace(50, "arrow1", scale, true, "Cyclization");

    // Cyclization section
    Terpener.drawCyclase(height, scale, terpeneCyclaseOptions, geneMatrixHandler);
    Terpener.leaveSpace(space, "cyclizedProduct", scale);

    // Arrow between Cyclization and Tailoring
    Terpener.leaveSpace(50, "arrow2", scale, true, "Tailoring");

    // Tailoring section
    Terpener.drawTailoringEnzymes(geneMatrix, height, scale, geneMatrixHandler);
    Terpener.leaveSpace(space, "tailoredProduct", scale);

    return $(container).find("svg")[0];
};
Terpener.drawCyclase = (function (height = 90, scale, terpeneCyclaseOptions, geneMatrixHandler) {
    console.log(terpeneCyclaseOptions)
    var container = document.getElementById('domain_container')
    let size = height /2
    let indent = 0
    let color = "lightgrey"
    let outline = "black"
    var line_svg = SVG(container)
        .size('100%', height)
        .group();

            let domainIdentifier =  "Cyclase"
            let abbreviation = "Cycl"

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

    reaction_options = Object.keys(terpeneCyclaseOptions)
    for (let reactionOptionIndex = 0; reactionOptionIndex <
        reaction_options.length; reactionOptionIndex++) {
        let reactionOption = reaction_options[reactionOptionIndex].toString();
        let reactionOptionContent = "<button class=dropdown_button_folded id=button" + geneIndex + "_" + reactionOption.replaceAll(" ", "_") + ">" + reactionOption + "</button>";
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
        let atomOptions = terpeneCyclaseOptions[reactionOption]
        console.log(atomOptions)
        if (atomOptions.length > 0) {
            createButtons(atomOptions, geneIndex, reactionOption, innerDropdownContainer_folded_1, geneMatrixHandler, svgHandler)
            
        }}


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

            dom.node.id = "terpeneCyclase"

        function createButtons(atomOptions, geneIndex, reactionOption, container, geneMatrixHandler, svgHandler) {
            atomOptions.forEach(atomOption => {
                if (Array.isArray(atomOption)) {
                    atomOption = atomOption.join(", ");}
                const button = document.createElement('button');
                const atomOptionCleaned = atomOption.replace(/\s/g, '');

                button.id = `${geneIndex}_${reactionOption.replace(/\s/g, '_')}${atomOptionCleaned}`;
                button.textContent = atomOptionCleaned;

                if (reactionOption.includes("Cyclization")) {
                    button.onclick = () => geneMatrixHandler.changeCyclization(atomOptionCleaned);
                } 
                
                else if (reactionOption.includes("DOUBLE_BOND_ISOMERASE")) {
                    button.onclick = () => geneMatrixHandler.changeDoubleBondIsomerization(atomOptionCleaned);
                }

                else if (reactionOption.includes("Methyl_shift")) {
                    button.onclick = () => geneMatrixHandler.changeMethylShift(atomOptionCleaned);
                } 

                else if (reactionOption.includes("Water_quenching")) {
                    button.onclick = () => geneMatrixHandler.changeWaterQuenching(atomOptionCleaned);
                }

                else {
                    button.onclick = () => geneMatrixHandler.changeSelectedOptionTailoring(geneIndex, reactionOption, atomOptionCleaned);
                }

                const atomOptionsForReaction = atomOption.includes(",")
                    ? atomOption.split(",").map(opt => opt.replaceAll(" ", ""))
                    : [atomOption.replaceAll(" ", "")];

                button.addEventListener('mouseenter', () => {
                    atomOptionsForReaction.forEach(option => svgHandler.hoverInAtom(option));
                });

                button.addEventListener('mouseout', () => {
                    atomOptionsForReaction.forEach(option => svgHandler.hoverOutAtom(option));
                });

                container.appendChild(button);
            });
        }

        });
Terpener.drawTailoringEnzymes = (function (geneMatrix, height = 90, scale, geneMatrixHandler) {
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

Terpener.drawHeadings = (function (height, space = 600) {
    headingHeigth = height/3
    document.getElementById('module_container')
        .innerHTML = ""
    var innerModuleContainer = document.createElement('div');
    innerModuleContainer.id = "innerModuleContainer" + "_" +
        "precursor"
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
    dom.node.id = "module_" + "precursor"

    var text_module = draw.text("Precursor:").x(size / 3.5).y(headingHeigth / 2 - 7)
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
    dom.node.id = "module_" + "cyclase"

    var text_module = draw.text("Cyclization:").x(size / 3.5).y(headingHeigth / 2 - 7)
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
    dom.node.id = "module_" + "tailoringEnzyme"

    var text_module = draw.text("Tailoring enzymes:").x(size / 3.5).y(headingHeigth / 2 - 7)
        .fill("black")
        .stroke({ width: 1 })

});

