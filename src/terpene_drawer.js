var Terpener = {
    version: "1.0.0",
    required: [
        "jquery",
        "svg.js==2.7.1"
    ],
    tooltip_id: "Terpener-tooltip-1234567890",
    tooltip_id_domain: "Terpener-tooltip-123"
};

Terpener.drawCluster = (function (cluster, geneMatrix, height = 90 , space = 300){
    var container = document.getElementById('domain_container')
    var scale = (function (val) {
        return parseInt(val / (1000 / height));
    })
    document.getElementById('domain_container').innerHTML = "";
    document.getElementById('model_gene_container').innerHTML = "";
    Terpener.drawHeadings(height, space)
    Terpener.leaveSpace(space, "precursor", scale)
    Terpener.drawCyclase(height, scale)
    Terpener.leaveSpace(space, "cyclizedProduct", scale)
    Terpener.drawTailoringEnzymes(geneMatrix, height, scale)
    Terpener.leaveSpace(space, "tailoredProduct", scale)
    return $(container)
        .find("svg")[0];
})
Terpener.leaveSpace = (function (width, id, scale) {
    var innerIntermediateContainer = document.createElement('div');
    var innerContainer = document.createElement('div');
    innerContainer.id = id
    innerIntermediateContainer.id = "innerIntermediateContainer_"+id
    innerIntermediateContainer.setAttribute("class", "intermediateContainerTailoring")
    document.getElementById('domain_container').appendChild(innerContainer);
    innerContainer.appendChild(innerIntermediateContainer);
    innerContainer.style.width = String(width) + "px";
})

Terpener.drawCyclase = (function ( height = 90, scale) {
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
        if (atomOptions) {
            for (let atomOptionIndex = 0; atomOptionIndex <
                atomOptions.length; atomOptionIndex++) {
                console.log(typeof (atomOptions[atomOptionIndex]))
                let atomOption = atomOptions[atomOptionIndex]
                if (!reactionOption.includes("Cyclization")) {
                if (atomOption.includes("=")) {
                    let [atomOption_1, atomOption_2] = atomOption.split("=")
                    innerDropdownContainer_folded_1.innerHTML += "<button id=" + geneIndex + "_" + reactionOption.replaceAll(" ", "_") + atomOption
                        + " onclick='changeSelectedOptionTailoring(geneMatrix," + geneIndex + ",\x22" + reactionOption + "\x22, \x22" + atomOption + "\x22);'onmouseenter='hover_in_atom(\x22" + atomOption_1 + "\x22);hover_in_atom(\x22" + atomOption_2 + "\x22);' onmouseout='hover_out_atom(\x22" + atomOption_1 + "\x22);hover_out_atom(\x22" + atomOption_2 + "\x22);'>" + atomOption + "</button>";

                }
                else {
                    innerDropdownContainer_folded_1.innerHTML += "<button id=" + geneIndex + "_" + reactionOption.replaceAll(" ", "_") + atomOption
                        + " onclick='changeSelectedOptionTailoring(geneMatrix," + geneIndex + ",\x22" + reactionOption + "\x22, \x22" + atomOption + "\x22);'onmouseenter='hover_in_atom(\x22" + atomOption + "\x22);' onmouseout='hover_out_atom(\x22" + atomOption + "\x22);'>" + atomOption + "</button>";
                }
            }
            else{
                    innerDropdownContainer_folded_1.innerHTML += "<button id=" + geneIndex + "_" + reactionOption.replaceAll(" ", "_") + atomOption
                        + " onclick='changeCyclization(\x22" + atomOption + "\x22);'onmouseenter='hover_in_atom(\x22" + atomOption + "\x22);' onmouseout='hover_out_atom(\x22" + atomOption + "\x22);'>" + atomOption + "</button>";

            }
        }}}


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

        });
Terpener.drawTailoringEnzymes = (function (geneMatrix, height = 90, scale) {
    var container = document.getElementById('domain_container')
    let size = height/2
    let indent = 0
    let color = "lightgrey"
    let outline = "black"
    var line_svg = SVG(container)
        .size('100%', height)
        .group();
    console.log(geneMatrix)
    for (geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        let gene = geneMatrix[geneIndex]
        console.log(gene.tailoringEnzymeStatus)
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
                let atomOptions = options[reactionOption]
                if (atomOptions) {
                    for (let atomOptionIndex = 0; atomOptionIndex <
                        atomOptions.length; atomOptionIndex++) {
                        let atomOption = atomOptions[atomOptionIndex].replaceAll("'", "")
                        if (!reactionOption.includes("Cyclization")){
                        
                            let [atomOption_1, atomOption_2] = atomOption.split("=")
                            innerDropdownContainer_folded_1.innerHTML += "<button id=" + geneIndex + "_" + reactionOption.replaceAll(" ", "_") + atomOption
                                + " onclick='changeSelectedOptionTailoring(geneMatrix," + geneIndex + ",\x22" + reactionOption + "\x22, \x22" + atomOption + "\x22);'onmouseenter='hover_in_atom(\x22" + atomOption_1 + "\x22);hover_in_atom(\x22" + atomOption_2 + "\x22);' onmouseout='hover_out_atom(\x22" + atomOption_1 + "\x22);hover_out_atom(\x22" + atomOption_2 + "\x22);'>" + atomOption + "</button>";
                        }

                        else {
                            if (atomOption.includes(",")) {
                                let atomOptionParts = atomOption.split(",");
                                let atomOption1 = atomOptionParts[0].replaceAll(" ", "");
                                let atomOption2 = atomOptionParts[1].replaceAll(" ", "");
                                innerDropdownContainer_folded_1.innerHTML += "<button id=" + geneIndex + "_" + reactionOption.replaceAll(" ", "") + atomOption.toString().replaceAll(" ", "")
                                    + " onclick='changeSelectedOptionTailoring(geneMatrix," + geneIndex + ",\x22" + reactionOption + "\x22, \x22" + atomOption.toString().replaceAll(" ", "") + "\x22);'onmouseenter='hover_in_atom(\x22" + atomOption1 + "\x22);hover_in_atom(\x22" + atomOption2 + "\x22);' onmouseout='hover_out_atom(\x22" + atomOption1 + "\x22);hover_out_atom(\x22" + atomOption2 + "\x22);'>" + atomOption.replaceAll(" ", "") + "</button>";

                            }
                            else {
                                innerDropdownContainer_folded_1.innerHTML += "<button id=" + geneIndex + "_" + reactionOption.replaceAll(" ", "") + atomOption.toString().replaceAll(" ", "")
                                    + " onclick='changeSelectedOptionTailoring(geneMatrix," + geneIndex + ",\x22" + reactionOption + "\x22, \x22" + atomOption.toString().replaceAll(" ", "") + "\x22);'onmouseenter='hover_in_atom(\x22" + atomOption.replaceAll(" ", "") + "\x22);' onmouseout='hover_out_atom(\x22" + atomOption.replaceAll(" ", "") + "\x22);'>" + atomOption.replaceAll(" ", "") + "</button>";
                            }                        }
                }
                }

                // "<button id=" + geneIndex + "_" + short_option + " onclick='changeSelectedOptionTailoring(geneMatrix," +
                // geneIndex + ",\x22" +
                // short_option +
                // "\x22," + optionIndex + ");'  onmouseenter='hover_in_atom(\x22" + short_option + "\x22);' onmouseout='hover_out_atom(\x22" + short_option + "\x22);'>" +
                // option +
                // "</button>";
                //format default option differently
                // if (  geneMatrix[geneIndex].options[
                //         optionIndex] ==
                //       geneMatrix[geneIndex].default_option
                // ) {
                //     optionContent =
                //         "<button id="+geneIndex  + "_"+short_option+" style= \x22background-color:lightgrey; \x22 onclick='changeSelectedOptionTailoring(geneMatrix," +
                //         geneIndex +
                //         ",\x22" +
                //           short_option+
                //         "\x22,"+optionIndex+");'   onmouseenter='hover_in_atom(\x22"+ short_option +"\x22);' onmouseout='hover_out_atom(\x22"+short_option +"\x22);'>" +
                //           option +
                //         "</button>";
                // }
                // //format active option differently

                // if (  toString(geneMatrix[geneIndex].selected_option).includes(short_option)
                // ) {
                //     optionContent =
                //         "<button id="+geneIndex  + "_"+short_option+" style= \x22background-color:#E11839; \x22 onclick='changeSelectedOptionTailoring(geneMatrix," +
                //         geneIndex +
                //         ",\x22" +
                //           short_option+
                //         "\x22,"+optionIndex+");'   onmouseenter='hover_in_atom(\x22"+ short_option +"\x22);' onmouseout='hover_out_atom(\x22"+short_option +"\x22);'>" +
                //           option +
                //         "</button>";
                // }
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
                var text = draw.text(abbreviation.replaceAll("methyltransferase", "MT").replaceAll("reductase", "RED")).x(size / 2 - 1 + 2).y(height - indent - (size / 2 + 1) - 7)
            }
            dom.node.id = "tailoringEnzyme_" + geneMatrix[geneIndex].id
        }
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

