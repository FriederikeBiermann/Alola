/* Copyright 2017 Satria A. Kautsar */
//Colour dicts to match antiSMASH domain colouring
colour_fill_dict = {
    'ACP': '#81bef7',
    'PKS_AT': '#f78181',
    'PKS_KS(Modular-KS)': '#81f781',
    'PKS_KR': '#80f680',
    'PKS_DH': '#f7be81',
    'PKS_ER': '#81f7f3',
    'PKS_TE': '#f5c4f2',
    "Thioesterase":'#f5c4f2',
    'KR*': '#80f680',
    'Condensation_LCL':'#5858b6',
    'Condensation_DCL':'#5858b6',
    'Condensation_Starter':'#5858b6',
    'AMP-binding':'#bc7ff5', 'PCP':'#81bef7', 'Epimerization':'#8181f7',"TIGR01720":'#8181f7',
    'nMT':'#dadada'
}
colour_outline_dict = {
    'PKS_ACP': '#3d79d6',
    'PKS_AT': '#df5d5d',
    'PKS_KS': '#5fc65f',
    'PKS_KR': '#5fbb87',
    'PKS_DH': '#ca9862',
    'PKS_ER': '#61bbad',
    'PKS_TE': '#a25ba0',
    'KR*': '#5fbb87'
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
Domainer.drawClusterSVG = (function(cluster, height = 75) {
    var container = document.getElementById('domain_container')
    var line_svg = SVG(container)
        .size('100%', height)
        .group();
    document.getElementById('domain_container')
        .innerHTML = "";
    var scale = (function(val) {
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
    let indentSteps = 15
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
                    var color = "gray";
                    if (domain.hasOwnProperty("type")) {
                        if (colour_fill_dict.hasOwnProperty(domain.type)) {
                            color = colour_fill_dict[domain.type];
                        }
                        else {
                            color = "#025699"
                        }
                    }
                    else {
                        color = "#025699"
                    }
                    let geneIndex = 0
                    let domainIdentifier = ""
                    let size = 50
                    let points = ""
                    let abbreviation = ""
                    for (geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
                        if (geneMatrix[geneIndex].id == orf.locus_tag) {
                            if (!(geneMatrix[geneIndex].hasOwnProperty(
                                    "modules"))) {
                                geneMatrix[geneIndex].modules = [{
                                    domains: geneMatrix[
                                        geneIndex].domains
                                }]
                            }
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
                                            domainIndex].identifier

                                        points = Domainer.getDomainPoints(
                                                domain, orf, cluster,
                                                height, scale)
                                                // declare color if ko
                                        if (geneMatrix[geneIndex].modules[
                                                moduleIndex].domains[
                                                domainIndex].ko==true){color= "#E11839"}
                                            //declare size of balls
                                          console.log(geneMatrix[geneIndex].modules[
                                                  moduleIndex].domains[
                                                  domainIndex])
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
                                                "PP")|| geneMatrix[
                                                geneIndex].modules[
                                                moduleIndex].domains[
                                                domainIndex].type.includes(
                                                "PCP")) {
                                            size = 25;
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
                                        if (cluster_type != "nrps"){                                        if ((cleanedDomainIndex == 2 ||
                                                                                        cleanedDomainIndex ==
                                                                                        cleanedLength - 3) &&
                                                                                    cleanedLength > 3) {
                                                                                    indent = indentSteps
                                                                                }
                                                                                else if ((cleanedDomainIndex ==
                                                                                        3 || cleanedDomainIndex ==
                                                                                        cleanedLength - 4) &&
                                                                                    cleanedLength > 4) {
                                                                                    indent = indentSteps * 2
                                                                                }
                                                                                else {
                                                                                    indent = 0
                                                                                }}
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

                                        for (let optionIndex = 0; optionIndex <
                                            geneMatrix[geneIndex].modules[
                                                moduleIndex].domains[
                                                domainIndex].domainOptions
                                            .length; optionIndex++) {



                                            let optionContent =
                                                "<button  onclick='changeSelectedOption(geneMatrix," +
                                                geneIndex + ',' +moduleIndex+ ","+
                                                domainIndex + ",\x22" +
                                                geneMatrix[geneIndex].modules[
                                                    moduleIndex].domains[
                                                    domainIndex].domainOptions[
                                                    optionIndex] +
                                                "\x22);'  >" +
                                                geneMatrix[geneIndex].modules[
                                                    moduleIndex].domains[
                                                    domainIndex].domainOptions[
                                                    optionIndex] +
                                                "</button>";
                                            //format default option differently
                                            if (geneMatrix[geneIndex].modules[
                                                    moduleIndex].domains[
                                                    domainIndex].domainOptions[
                                                    optionIndex] ==
                                                geneMatrix[geneIndex].domains[
                                                    domainIndex].default_option
                                            ) {
                                                optionContent =
                                                    "<button style= \x22background-color:light-grey; \x22 onclick='changeSelectedOption(geneMatrix," +
                                                    geneIndex + ',' +moduleIndex+","+
                                                    domainIndex +
                                                    ",\x22" +
                                                    geneMatrix[geneIndex].modules[
                                                        moduleIndex].domains[
                                                        domainIndex].domainOptions[
                                                        optionIndex] +
                                                    "\x22);'  >" +
                                                    geneMatrix[geneIndex].modules[
                                                        moduleIndex].domains[
                                                        domainIndex].domainOptions[
                                                        optionIndex] +
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
                            var dom = draw.rect(size-2, size-2)
                                .x(0)
                                .y(height - indent - (size+2))
                                .rx("200%")
                                .ry("200%")
                                .fill(color)
                                .stroke({
                                    width: 2, color:"#2B2B2B"
                                });
                            dom.node.id = "domain" + domainIdentifier
                            $(dom.node)
                                .mouseover({
                                    domain: domain
                                }, function(handler) {
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
                                    $(handler.target)
                                        .css("stroke", "#E11839");
                                    handler.stopPropagation();
                                });
                            $(dom.node)
                                .mouseleave(function(handler) {
                                    $(handler.target)
                                        .css("stroke-width", "2px");
                                    $(handler.target)
                                        .css("stroke", "black");
                                    $("#" + Domainer.tooltip_id)
                                        .css("display", "none")
                                });
                        }
                    }
                }
            }
        }
    }
    $(draw.node)
        .parent()
        .mouseover({
            domain: domain
        }, function(handler) {
            var bgc_desc = "<b>BGC: " + recordData[0].seq_id +
                " region " + regionName + "</b>";
            if (cluster.hasOwnProperty("desc")) {
                bgc_desc += "<br /> " + cluster["desc"];
            }
            Domainer.showToolTip(bgc_desc, handler);
        });
    $(draw.node)
        .parent()
        .mouseleave(function(handler) {
            $("#" + Domainer.tooltip_id)
                .css("display", "none");
        });
    $(container)
        .find("svg")
        .attr("width", width + "px");
    Domainer.drawModules(geneMatrix, 20, scale)
    return $(container)
        .find("svg")[0];
});
Domainer.drawModules = (function(geneMatrix, height, scale) {
    document.getElementById('module_container')
        .innerHTML = ""
    for (let geneIndex = 0; geneIndex < geneMatrix.length; geneIndex++) {
        if (geneMatrix[geneIndex].hasOwnProperty("modules")) {
            for (let moduleIndex = 0; moduleIndex < geneMatrix[
                    geneIndex].modules.length; moduleIndex++) {
                var innerModuleContainer = document.createElement('div');
                innerModuleContainer.id = "innerModuleContainer" + "_" +
                    geneMatrix[geneIndex].id + "_" + moduleIndex
                document.getElementById('module_container')
                    .appendChild(innerModuleContainer);
                size = geneMatrix[geneIndex].modules[moduleIndex].lengthVisualisation -
                    3
                var draw = SVG(innerModuleContainer)
                    .size(String(size) + "px", height)
                    .group();
                var dom = draw.rect(size, height)
                    .x(0)
                    .y(height)
                    .fill("#2B2B2B")
                    .stroke("#2B2B2B")
                    .stroke({
                        width: 20
                    })
                dom.node.id = "module_" + moduleIndex
                geneMatrix[geneIndex].modules[moduleIndex].lengthVisualisation =
                    0
            }
        }
    }
});
Domainer.getOrfPoints = (function(orf, cluster, height, scale) {
    var x_points = [
        scale(orf.start),
        (orf.strand === 0) ?
        (scale(orf.start) + scale(orf.end - orf.start)) :
        ((scale(orf.end - orf.start) > (height / 2)) ?
            (scale(orf.start) + Math.max(scale(orf.end - orf.start -
                ((orf.end - orf.start) / 4)), (scale(orf.end -
                orf.start) - parseInt(height / 2)))) :
            scale(orf.start)),
        (scale(orf.start) + scale(orf.end - orf.start))
    ];
    var y_points = [
        (orf.strand === 0) ?
        ((height / 2) - (height / 3)) :
        ((height / 2) - (height / 3)) - (height / 5),
        ((height / 2) - (height / 3)),
        (height / 2),
        ((height / 2) + (height / 3)),
        (orf.strand === 0) ?
        ((height / 2) + (height / 3)) :
        ((height / 2) + (height / 3)) + (height / 5)
    ];
    return {
        x: x_points,
        y: y_points
    };
});
Domainer.getproteinPoints = (function(orf, cluster, height, scale) {
    var points = [];
    var pts = Domainer.getOrfPoints(orf, cluster, height, scale);
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
    if (orf.strand < 0) {
        points = Domainer.flipHorizontal(points, scale(orf.start), (
            scale(orf.start) + scale(orf.end - orf.start)));
    }
    return points;
});
Domainer.getDomainPoints = (function(domain, orf, cluster, height, scale) {
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
    var getY = function(x) {
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
Domainer.flipHorizontal = (function(points, leftBound, rightBound) {
    var new_points = [];
    for (var i in points) {
        var point = points[i];
        if ((point.x < leftBound) || (point.x > rightBound)) {
            console.log("Error flipping points : " + (point.x + " " +
                leftBound + " " + rightBound));
        }
        else {
            new_points.push({
                x: rightBound - (point.x - leftBound),
                y: point.y
            });
        }
    }
    return new_points;
});
Domainer.toPointCoordinates = (function(points) {
    coordinates = [points["0"].x, points["0"].y, (points["4"].x -
        points["0"].x), (points["4"].y - points["0"].y)]
    coordinates_string = points["0"].x.toString() + "," + points["0"].y
        .toString() + "," + (points["4"].x - points["0"].x)
        .toString() + "," + (points["4"].y - points["0"].y)
        .toString()
    return coordinates
});
Domainer.toPointString = (function(points) {
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
Domainer.getRandomCluster = (function() {
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
Domainer.drawRandomClusterSVG = (function() {
    return Domainer.drawClusterSVG(Domainer.getRandomCluster());
});
Domainer.showToolTip = (function(html, handler) {
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
