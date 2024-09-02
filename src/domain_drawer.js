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
Domainer.drawClusterSVG = (function (cluster, height = 90) {
    var container = document.getElementById('domain_container')
    var line_svg = SVG(container)
        .size('100%', height)
        .group();
    container.innerHTML = "";
    var scale = (function (val) {
        return parseInt(val / (1000 / height));
    })
    //draw line
    line_svg.line(0, parseInt(height / 2), scale(cluster.end - cluster.start),
        parseInt(height / 2))
        .stroke({
            color: "white",
            width: 2
        });
    var width = scale(cluster.end - cluster.start);
    let indentSteps = height/6
    let indent = 0
    if (cluster.hasOwnProperty("orfs")) {
        // draw domains
        for (var i in cluster.orfs) {
            var orf = cluster.orfs[i];
            if (orf.hasOwnProperty("domains")) {
                // draw domains
                for (var j in orf.domains) {
                    var numberOfDomains = orf.domains.length
                    var domain = orf.domains[j];
                    var color = "";
                    var opacity = "1"
                    if (domain.hasOwnProperty("type")) {
                        if (colour_fill_dict.hasOwnProperty(domain.type)) {
                            color = colour_fill_dict[domain.type];
                        }
                        else {
                            color = "#0486F1"
                        }
                        if (colour_outline_dict.hasOwnProperty(domain.type)) {
                            outline = colour_outline_dict[domain.type];
                        }
                        else {
                            outline = "#025AA1";
                        }
                    }
                    else {
                        color = "#0486F1";
                        outline = "#025AA1"
                    }
                    let geneIndex = 0
                    let domainIdentifier = ""
                    let size = height/ 2
                    let gene_size = 0
                    let points = ""
                    let abbreviation = ""
                    for (geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
                        if (geneMatrix[geneIndex].id == orf.locus_tag) {
                            if (!(geneMatrix[geneIndex].hasOwnProperty(
                                "modules")) ) {
                                if (biosyntheticCoreEnzymes.includes(geneMatrix[geneIndex].orffunction) || geneMatrix[geneIndex].type.includes("biosynthetic")){
                                geneMatrix[geneIndex].modules = [{
                                    domains: geneMatrix[
                                        geneIndex].domains
                                }]
                            }
                        else{
                            continue
                        }}

                            for (let moduleIndex = 0; moduleIndex <
                                geneMatrix[geneIndex].modules.length; moduleIndex++
                            ) {
                                let moduleLength = 0

                                for (let domainIndex = 0; domainIndex <
                                    geneMatrix[geneIndex].modules[
                                        moduleIndex].domains.length; domainIndex++
                                ) {
                                    if (geneMatrix[geneIndex].modules[
                                        moduleIndex].domains[
                                        domainIndex].start ==
                                        domain.start) {

                                        domainIdentifier = geneMatrix[
                                            geneIndex].modules[
                                            moduleIndex].domains[
                                            domainIndex].identifier.replace(".", "_")

                                        points = Domainer.getDomainPoints(
                                            domain, orf, cluster,
                                            height, scale)
                                        // declare color if ko
                                        if (geneMatrix[geneIndex].modules[
                                            moduleIndex].domains[
                                            domainIndex].ko == true) { opacity = "0.5" }
                                        //declare size of balls
                                        if (geneMatrix[geneIndex].modules[
                                            moduleIndex].domains[
                                            domainIndex].type.includes(
                                                "term") || geneMatrix[
                                                    geneIndex].modules[
                                                    moduleIndex].domains[
                                                    domainIndex].type.includes(
                                                        "ACP") || geneMatrix[
                                                            geneIndex].modules[
                                                            moduleIndex].domains[
                                                            domainIndex].type.includes(
                                                                "PP") || geneMatrix[
                                                                    geneIndex].modules[
                                                                    moduleIndex].domains[
                                                                    domainIndex].type.includes(
                                                                        "PCP") || geneMatrix[
                                                                            geneIndex].modules[
                                                                            moduleIndex].domains[
                                                                            domainIndex].type.includes(
                                                                                "docking")) {
                                            size = height/4;

                                        }
                                        else {
                                            abbreviation = domain.abbreviation
                                        }
                                        // add size for module length
                                        geneMatrix[geneIndex].modules[
                                            moduleIndex].lengthVisualisation +=
                                            size
                                        let cleanedLength = geneMatrix[
                                            geneIndex].modules[
                                            moduleIndex].domains.length
                                        let cleanedDomainIndex =
                                            domainIndex
                                        if (JSON.stringify(geneMatrix[
                                            geneIndex].modules[
                                            moduleIndex].domains)
                                            .includes("Nterm")) {
                                            cleanedLength--
                                            cleanedDomainIndex--
                                        }
                                        if (JSON.stringify(geneMatrix[
                                            geneIndex].modules[
                                            moduleIndex].domains)
                                            .includes("Cterm")) {
                                            cleanedLength--
                                        }
                                        if (JSON.stringify(geneMatrix[
                                            geneIndex].modules[
                                            moduleIndex].domains)
                                            .includes("Thioesterase")) {
                                            cleanedLength--
                                        }
                                        // declare indent for spaghetti diagram
                                        if (cluster_type != "nrps") {
                                            if ((cleanedDomainIndex == 2 ||
                                                cleanedDomainIndex ==
                                                cleanedLength - 2) &&
                                                cleanedLength > 4) {
                                                indent = indentSteps
                                            }
                                            else if ((cleanedDomainIndex ==
                                                3 || cleanedDomainIndex ==
                                                cleanedLength - 3) &&
                                                cleanedLength > 4) {
                                                indent = indentSteps * 2
                                            }
                                            else {
                                                indent = 0
                                            }
                                        }
                                        else {
                                            indent = 0
                                        }

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
                                            "innerIntermediateContainer" +
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
                                            'innerdomainContainer' +
                                            domainIdentifier)
                                            .appendChild(
                                                innerIntermediateContainer
                                            );
                                        document.getElementById(
                                            "innerIntermediateContainer" +
                                            domainIdentifier)
                                            .setAttribute("class",
                                                "intermediateContainer"
                                            );
                                        document.getElementById(
                                            "innerDropdownContainer" +
                                            domainIdentifier)
                                            .setAttribute("class",
                                                "dropdown");
                                        document.getElementById(
                                            'innerDropdownContainer' +
                                            domainIdentifier)
                                            .appendChild(
                                                innerDropdownButton);
                                        document.getElementById(
                                            "innerDropdownButton" +
                                            domainIdentifier)
                                            .setAttribute("class",
                                                "dropbtn");
                                        document.getElementById(
                                            'innerDropdownContainer' +
                                            domainIdentifier)
                                            .appendChild(
                                                innerDropdownContent);
                                        document.getElementById(
                                            "innerDropdownContent" +
                                            domainIdentifier)
                                            .setAttribute("class",
                                                "dropdown-content");
                                        innerDropdownContent.innerHTML =
                                            ""
                                        geneMatrix[geneIndex].modules[
                                            moduleIndex].domains[
                                            domainIndex].domainOptions = geneMatrix[geneIndex].modules[
                                                moduleIndex].domains[
                                                domainIndex].domainOptions.sort((a, b) => a.localeCompare(b)).sort(function (a, b) {
                                                    return a.length - b.length;
                                                });

                                        for (let optionIndex = 0; optionIndex <
                                            geneMatrix[geneIndex].modules[
                                                moduleIndex].domains[
                                                domainIndex].domainOptions
                                                .length; optionIndex++) {
                                            let option = geneMatrix[geneIndex].modules[
                                                moduleIndex].domains[
                                                domainIndex].domainOptions[
                                                optionIndex].toString();
                                            if (hasNumbers(option) == true) {
                                                short_option = option.split(" ")[option.split(" ").length - 1]
                                            }
                                            else {
                                                short_option = option
                                            }


                                            let optionContent =
                                                "<button id=" + geneIndex + '_' + moduleIndex + "_" +
                                                domainIndex + "_" + optionIndex + " onclick='changeSelectedOption(geneMatrix," +
                                                geneIndex + ',' + moduleIndex + "," +
                                                domainIndex + ",\x22" +
                                                short_option +
                                                "\x22," + optionIndex + ");'  onmouseenter='hover_in_atom(\x22" + short_option + "\x22);' onmouseout='hover_out_atom(\x22" + short_option + "\x22);'>" +
                                                option.replaceAll("_", " ") +
                                                "</button>";
                                            //format default option differently

                                            if (short_option == geneMatrix[geneIndex].modules[
                                                moduleIndex].domains[
                                                domainIndex].default_option
                                            ) {
                                                optionContent =
                                                    "<button id=de" + geneIndex + '_' + moduleIndex + "_" +
                                                    domainIndex + "_" + optionIndex + " style= \x22background-color:lightgrey; \x22 onclick='changeSelectedOption(geneMatrix," +
                                                    geneIndex + ',' + moduleIndex + "," +
                                                    domainIndex +
                                                    ",\x22" +
                                                    short_option +
                                                    "\x22," + optionIndex + ");'   onmouseenter='hover_in_atom(\x22" + short_option + "\x22);' onmouseout='hover_out_atom(\x22" + short_option + "\x22);'>" +
                                                    option +
                                                    "</button>";
                                            }
                                            if (short_option == geneMatrix[geneIndex].modules[
                                                moduleIndex].domains[
                                                domainIndex].selected_option
                                            ) {
                                                optionContent =
                                                    "<button id=" + geneIndex + '_' + moduleIndex + "_" +
                                                    domainIndex + "_" + optionIndex + " style= \x22background-color:#E11839; \x22 onclick='changeSelectedOption(geneMatrix," +
                                                    geneIndex + ',' + moduleIndex + "," +
                                                    domainIndex +
                                                    ",\x22," +
                                                    short_option +
                                                    "\x22," + optionIndex + ");'   onmouseenter='hover_in_atom(\x22" + short_option + "\x22);' onmouseout='hover_out_atom(\x22" + short_option + "\x22);'>" +
                                                    option +
                                                    "</button>";
                                            }
                                            innerDropdownContent.innerHTML +=
                                                optionContent

                                        }


                                        break

                                    }
                                }
                                // create module visualization
                                var innerModuleContainer = document.createElement(
                                    'div');
                                innerModuleContainer.id =
                                    "innerModuleContainer" + geneIndex +
                                    "_" + moduleIndex;
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
                                .x(2)
                                .y(height - indent - (size + 2))
                                .rx("200%")
                                .ry("200%")
                                .fill(color)
                                .opacity(opacity)
                                .stroke({
                                    width: 2, color: outline
                                });
                            if (size > height/4) {
                                var text = draw.text(domain.abbreviation).x(size / 2 - 1 + 2).y(height - indent - (size / 2 + 1) - 7)
                            }

                            dom.node.id = "domain" + domainIdentifier.replace(".", "_")
                            $(dom.node)
                                .mouseover({
                                    domain: domain
                                }, function (handler) {
                                    $("#" + Domainer.tooltip_id)
                                        .css("display", "none")
                                    var start = handler.data.domain
                                        .start;
                                    var end = handler.data.domain.end;
                                    let contentTooltip = ""
                                    Domainer.showToolTip("Domain: " +
                                        handler.data.domain.abbreviation +
                                        " (" + handler.data.domain
                                            .type + ")" + "<br/>" +
                                        start + " - " + end,
                                        handler);
                                    $(handler.target)
                                        .css("stroke-width", "3px");

                                    handler.stopPropagation();
                                });
                            $(dom.node)
                                .mouseleave(function (handler) {
                                    $(handler.target)
                                        .css("stroke-width", "2px");

                                    $("#" + Domainer.tooltip_id)
                                        .css("display", "none")
                                });
                        }
                    }
                }
            }
        }
    }
    $(line_svg)
        .mouseover({
            domain: domain
        }, function (handler) {
            var bgc_desc = "<b>BGC: " + recordData[0].seq_id +
                " region " + regionName + "</b>";
            if (cluster.hasOwnProperty("desc")) {
                bgc_desc += "<br /> " + cluster["desc"];
            }
            Domainer.showToolTip(bgc_desc, handler);
        });
    $(line_svg)
        .mouseleave(function (handler) {
            $("#" + Domainer.tooltip_id)
                .css("display", "none");
        });
    $(container)
        .find("svg")
        .attr("width", width + "px");
    Domainer.drawModules(moduleMatrix, height, scale)
    Domainer.drawGenes(geneMatrix, height, scale)
    Domainer.leaveSpaceForTailoring(height*2, scale)
    Domainer.drawTailoringEnzymes(cluster, geneMatrix, height, scale)
    return $(container)
        .find("svg")[0];
});
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
Domainer.drawTailoringEnzymes = (function (cluster, geneMatrix, height = 90, scale) {
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
                    for (let atomOptionIndex = 0; atomOptionIndex <
                        atomOptions.length; atomOptionIndex++) {
                        let atomOption = atomOptions[atomOptionIndex]
                        if (atomOption.includes(",")) {
                            let atomOptionParts = atomOption.split(",");
                            let atomOption1 = atomOptionParts[0].replaceAll(" ", "");
                            let atomOption2 = atomOptionParts[1].replaceAll(" ", "");
                            innerDropdownContainer_folded_1.innerHTML += "<button id=" + geneIndex + "_" + reactionOption.replaceAll(" ", "") + atomOption.toString().replaceAll(" ", "")
                                + " onclick='changeSelectedOptionTailoring(geneMatrix," + geneIndex + ",\x22" + reactionOption + "\x22, \x22" + atomOption.toString().replaceAll(" ", "") + "\x22);'onmouseenter='hover_in_atom(\x22" + atomOption1 + "\x22);hover_in_atom(\x22" + atomOption2 + "\x22);' onmouseout='hover_out_atom(\x22" + atomOption1 + "\x22);hover_out_atom(\x22" + atomOption2 + "\x22);'>" + atomOption.replaceAll(" ", "") + "</button>";

                        }
                        else{
                        innerDropdownContainer_folded_1.innerHTML += "<button id=" + geneIndex + "_" + reactionOption.replaceAll(" ", "") + atomOption.toString().replaceAll(" ", "")
                            + " onclick='changeSelectedOptionTailoring(geneMatrix," + geneIndex + ",\x22" + reactionOption + "\x22, \x22" + atomOption.toString().replaceAll(" ", "") + "\x22);'onmouseenter='hover_in_atom(\x22" + atomOption.replaceAll(" ", "") + "\x22);' onmouseout='hover_out_atom(\x22" + atomOption.replaceAll(" ", "") + "\x22);'>" + atomOption.replaceAll(" ", "") + "</button>";
                        }
                    }
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


});
Domainer.drawGenes = (function (geneMatrix, height = 90, scale) {
    document.getElementById('model_gene_container')
        .innerHTML = ""
    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        let geneSize = 0
        let lengthVisualisation = 0
        if (geneMatrix[geneIndex].ko == false && (geneMatrix[geneIndex].hasOwnProperty(
            "modules") || biosyntheticCoreEnzymes.includes(geneMatrix[geneIndex].orffunction) || geneMatrix[geneIndex].type.includes("biosynthetic"))) {
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
            console.log(bubble_size, domain, domains)
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
