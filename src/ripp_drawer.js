var RiPPer = {
    version: "1.0.0",
    required: [
        "jquery",
        "svg.js==2.7.1"
    ],
    tooltip_id: "RiPPer-tooltip-1234567890",
    tooltip_id_domain: "RiPPer-tooltip-123"
};

RiPPer.drawCluster = (function (cluster, geneMatrix, height = 90){
    var container = document.getElementById('domain_container')
    var scale = (function (val) {
        return parseInt(val / (1000 / height));
    })
    document.getElementById('domain_container').innerHTML = "";
    document.getElementById('model_gene_container').innerHTML = "";
    RiPPer.drawHeadings(height)
    RiPPer.leaveSpace(300, "precursor", scale)
    RiPPer.drawTailoringEnzymes(geneMatrix, height, scale)
    RiPPer.leaveSpace(300, "tailoredProduct", scale)
    RiPPer.drawProtease(height,scale)
    RiPPer.leaveSpace(300, "cleavedProduct", scale)
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

RiPPer.drawProtease = (function ( height = 90, scale) {
    var container = document.getElementById('domain_container')
    let size = 50
    let indent = 0
    let color = "lightgrey"
    let outline = "black"
    var line_svg = SVG(container)
        .size('100%', 90)
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

            for (let optionIndex = 0; optionIndex <
                proteaseOptions
                    .length; optionIndex++) {
                let option = proteaseOptions[
                    optionIndex].toString();
                if (hasNumbers(option) == true) {
                    short_option = option.split(" ")[option.split(" ").length - 1]
                }
                else {
                    short_option = option
                }


                let optionContent =
                    "<button id=" + geneIndex + "_" + short_option + "onclick='changeSelectedOptionCleavageSites('\x22" +
                short_option +
                        "\x22');'   onmouseenter='hover_in_atom(\x22" + short_option + "\x22);' onmouseout='hover_out_atom(\x22" + short_option + "\x22);'>" +
                    option +
                    "</button>";
                //format default option differently
                if (option == "No proteolytic cleavage"
                ) {
                    optionContent =
                        "<button id=" + geneIndex + "_" + short_option + " style= \x22background-color:lightgrey; \x22 onclick='changeSelectedOptionCleavageSites('\x22" +
                        short_option +
                        "\x22');'   onmouseenter='hover_in_atom(\x22" + short_option + "\x22);' onmouseout='hover_out_atom(\x22" + short_option + "\x22);'>" +
                        option +
                        "</button>";
                }
                //format active option differently

                if (cleavageSites.includes(short_option)
                ) {
                    optionContent =
                        "<button id=" + geneIndex + "_" + short_option + " style= \x22background-color:#E11839; \x22 onclick='changeSelectedOptionCleavageSites('\x22" +
                        short_option +
                        "\x22');'   onmouseenter='hover_in_atom(\x22" + short_option + "\x22);' onmouseout='hover_out_atom(\x22" + short_option + "\x22);'>" +
                        option +
                        "</button>";
                }
                innerDropdownContent.innerHTML +=
                    optionContent

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
            if (size > 25) {
                var text = draw.text(abbreviation).x(size / 2 - 1 + 2).y(height - indent - (size / 2 + 1) - 7)
            }

            dom.node.id = "protease"

        });
RiPPer.drawTailoringEnzymes = (function ( geneMatrix, height = 90, scale) {
    var container = document.getElementById('domain_container')
    let size = 50
    let indent = 0
    let color = "lightgrey"
    let outline = "black"
    var line_svg = SVG(container)
        .size('100%', 90)
        .group();
    for (geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        let gene = geneMatrix[geneIndex]
        if (gene.tailoringEnzymeStatus == true) {
            let domainIdentifier = "tailoringEnzyme" + geneMatrix[geneIndex].id.replace(".", "_")
            // declare color if ko
            let abbreviation = gene.tailoringEnzymeType

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
            geneMatrix[geneIndex].options = geneMatrix[geneIndex].options.sort((a, b) => a.localeCompare(b)).sort(function (a, b) {
                return a.length - b.length;
            });

            for (let optionIndex = 0; optionIndex <
                geneMatrix[geneIndex].options
                    .length; optionIndex++) {
                let option = geneMatrix[geneIndex].options[
                    optionIndex].toString();
                if (hasNumbers(option) == true) {
                    short_option = option.split(" ")[option.split(" ").length - 1]
                }
                else {
                    short_option = option
                }


                let optionContent =
                    "<button id=" + geneIndex + "_" + short_option + " onclick='changeSelectedOptionTailoring(geneMatrix," +
                    geneIndex + ",\x22" +
                    short_option +
                    "\x22," + optionIndex + ");'  onmouseenter='hover_in_atom(\x22" + short_option + "\x22);' onmouseout='hover_out_atom(\x22" + short_option + "\x22);'>" +
                    option +
                    "</button>";
                //format default option differently
                if (geneMatrix[geneIndex].options[
                    optionIndex] ==
                    geneMatrix[geneIndex].default_option
                ) {
                    optionContent =
                        "<button id=" + geneIndex + "_" + short_option + " style= \x22background-color:lightgrey; \x22 onclick='changeSelectedOptionTailoring(geneMatrix," +
                        geneIndex +
                        ",\x22" +
                        short_option +
                        "\x22," + optionIndex + ");'   onmouseenter='hover_in_atom(\x22" + short_option + "\x22);' onmouseout='hover_out_atom(\x22" + short_option + "\x22);'>" +
                        option +
                        "</button>";
                }
                //format active option differently

                if (toString(geneMatrix[geneIndex].selected_option).includes(short_option)
                ) {
                    optionContent =
                        "<button id=" + geneIndex + "_" + short_option + " style= \x22background-color:#E11839; \x22 onclick='changeSelectedOptionTailoring(geneMatrix," +
                        geneIndex +
                        ",\x22" +
                        short_option +
                        "\x22," + optionIndex + ");'   onmouseenter='hover_in_atom(\x22" + short_option + "\x22);' onmouseout='hover_out_atom(\x22" + short_option + "\x22);'>" +
                        option +
                        "</button>";
                }
                innerDropdownContent.innerHTML +=
                    optionContent

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
            if (size > 25) {
                var text = draw.text(abbreviation.replaceAll("methyltransferase", "MT")).x(size / 2 - 1 + 2).y(height - indent - (size / 2 + 1) - 7)
            }

            dom.node.id = "tailoringEnzyme_" + geneMatrix[geneIndex].id

        }
    }


});
RiPPer.drawHeadings = (function (height) {
    height = 30
    document.getElementById('module_container')
        .innerHTML = ""
    var innerModuleContainer = document.createElement('div');
    innerModuleContainer.id = "innerModuleContainer" + "_" +
        "precursorPeptide"
    document.getElementById('module_container')
        .appendChild(innerModuleContainer);
    size = 300
    var draw = SVG(innerModuleContainer)
        .size(String(size) + "px", height)
        .group();
    var dom = draw.rect(size, height)
        .x(0)
        .y(0)
        .fill("white")
        .stroke("white")
        .stroke({
            width: 2
        })
    dom.node.id = "module_" + "precursorPeptide"

    var text_module = draw.text("Precursor peptide:").x(size / 3.5).y(height / 2 - 7)
        .fill("black")
        .stroke({ width: 1 })
    //tailoring enzyme
    var innerModuleContainer = document.createElement('div');
    innerModuleContainer.id = "innerModuleContainer" + "_" +
        "tailoringEnzyme"
    document.getElementById('module_container')
        .appendChild(innerModuleContainer);
    size = 300
    var draw = SVG(innerModuleContainer)
        .size(String(size) + "px", height)
        .group();
    var dom = draw.rect(size, height)
        .x(0)
        .y(0)
        .fill("white")
        .stroke("white")
        .stroke({
            width: 2
        })
    dom.node.id = "module_" + "tailoringEnzyme"

    var text_module = draw.text("Tailoring enzymes:").x(size / 3.5).y(height / 2 - 7)
        .fill("black")
        .stroke({ width: 1 })
    //protease
    var innerModuleContainer = document.createElement('div');
    innerModuleContainer.id = "innerModuleContainer" + "_" +
        "protease"
    document.getElementById('module_container')
        .appendChild(innerModuleContainer);
    size = 300
    var draw = SVG(innerModuleContainer)
        .size(String(size) + "px", height)
        .group();
    var dom = draw.rect(size, height)
        .x(0)
        .y(0)
        .fill("white")
        .stroke("white")
        .stroke({
            width: 2
        })
    dom.node.id = "module_" + "protease"

    var text_module = draw.text("Proteolytic cleavage:").x(size / 3.5).y(height / 2 - 7)
        .fill("black")
        .stroke({ width: 1 })
});

