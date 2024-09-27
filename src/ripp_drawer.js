var RiPPer = {
    version: "1.0.0",
    required: [
        "jquery",
        "svg.js==2.7.1"
    ],
    tooltip_id: "RiPPer-tooltip-1234567890",
    tooltip_id_domain: "RiPPer-tooltip-123"
};

RiPPer.drawCluster = (function (cluster, geneMatrix, proteaseOptions = null, height = 90, space = 600, cleavageSites, geneMatrixHandler){
    var container = document.getElementById('domain_container')
    var scale = (function (val) {
        return parseInt(val / (1000 / height));
    })
    document.getElementById('domain_container').innerHTML = "";
    document.getElementById('model_gene_container').innerHTML = "";
    RiPPer.drawHeadings(height)
    RiPPer.leaveSpace(space, "precursor", scale)
    RiPPer.drawTailoringEnzymes(geneMatrix, height, scale, geneMatrixHandler)
    RiPPer.leaveSpace(space, "tailoredProduct", scale)
    if (document.getElementById("wildcardProtease")
        .checked || proteaseOptions) {
        RiPPer.drawProtease(height, scale, proteaseOptions, cleavageSites, geneMatrixHandler);
        RiPPer.leaveSpace(space, "cleavedProduct_space", scale);
    }

    return $(container)
        .find("svg")[0];
})
RiPPer.leaveSpace = (function (width, id, scale) {
    var innerIntermediateContainer = document.createElement('div');
    var innerContainer = document.createElement('div');
    innerContainer.id = id
    innerIntermediateContainer.id = "innerIntermediateContainer_"+id
    innerIntermediateContainer.setAttribute("class", "intermediateContainerTailoring")
    document.getElementById('domain_container').appendChild(innerContainer);
    innerContainer.appendChild(innerIntermediateContainer);
    innerContainer.style.width = String(width) + "px";
})

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
                createProteaseOptions(proteaseOptions, "protease", cleavageSites, innerDropdownContent);}


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
            const button = createOptionButton(option, geneIndex, cleavageSites);
            innerDropdownContent.appendChild(button);
        });

        return innerDropdownContent;
    }

    function createOptionButton(option, geneIndex, cleavageSites) {
        const shortOption = getShortOption(option);
        const button = document.createElement('button');

        button.id = `${geneIndex}_${shortOption}`;
        button.textContent = option;

        setButtonStyle(button, option, shortOption, cleavageSites);
        addButtonEventListeners(button, shortOption);

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

    function addButtonEventListeners(button, shortOption) {
        button.addEventListener('click', () => {
            this.geneMatrixHandler.changeSelectedOptionCleavageSites(shortOption);
        });

        button.addEventListener('mouseenter', () => {
            svgHandler.hoverInAtom(shortOption);
        });

        button.addEventListener('mouseleave', () => {
            svgHandler.hoverOutAtom(shortOption);
        });
    }

        });
RiPPer.drawTailoringEnzymes = (function (cluster, geneMatrix, height = 90, scale, geneMatrixHandler) {
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

