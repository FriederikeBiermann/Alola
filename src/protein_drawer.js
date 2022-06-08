/* Copyright 2017 Satria A. Kautsar */
//Colour dicts to match antiSMASH domain colouring
colour_fill_dict = {'ACP':'#81bef7', 'PKS_AT':'#f78181', 'PKS_KS(Modular-KS)':'#81f781',
                    'PKS_KR':'#80f680', 'PKS_DH':'#f7be81', 'PKS_ER':'#81f7f3',
                    'PKS_TE':'#f5c4f2', 'KR*':'#80f680'}
colour_outline_dict = {'PKS_ACP':'#3d79d6', 'PKS_AT':'#df5d5d', 'PKS_KS':'#5fc65f',
                       'PKS_KR':'#5fbb87', 'PKS_DH':'#ca9862', 'PKS_ER':'#61bbad',
                       'PKS_TE':'#a25ba0', 'KR*':'#5fbb87'}
var Proteiner = {
    version: "1.0.0",
    required: [
      "jquery",
      "svg.js==2.7.1"
    ],
    tooltip_id: "Proteiner-tooltip-1234567890",
    tooltip_id_protein: "Proteiner-tooltip-123"
};

Proteiner.drawClusterSVG = (function(cluster, height = 70) {
  var container = document.createElement("div");
  document.getElementById('protein_container').innerHTML = "";
  var scale = (function(val) { return parseInt(val / (1000 / height)); })

  // draw line
  //draw.line(0, parseInt(height / 2), scale(cluster.end - cluster.start), parseInt(height / 2)).stroke({width: 2});
  var width = scale(cluster.end - cluster.start);

  if (cluster.hasOwnProperty("orfs")) {
    // draw proteins
    for (var i in cluster.orfs) {
      var orf = cluster.orfs[i];
      var orf_color = "white";//"gray";
      if (orf.hasOwnProperty("color")) {
        orf_color = orf.color;
      }
      var innerContainer= document.createElement('div');
      innerContainer.id="innerProteinContainer"+orf.locus_tag
      var innerDropdownContainer=document.createElement('div');
      innerDropdownContainer.id="innerDropdownContainer"+orf.locus_tag
      var innerDropdownButton=document.createElement('button');
      innerDropdownButton.id="innerDropdownButton"+orf.locus_tag
      var innerDropdownContent=document.createElement('div');
      innerDropdownContent.id="innerDropdownContent"+orf.locus_tag
      innerContainer.style.width=String(scale(orf.end - orf.start))+"px"
      document.getElementById('protein_container').appendChild(innerContainer).setAttribute("draggable","true");
      document.getElementById('innerProteinContainer'+orf.locus_tag).setAttribute("class","box");
      document.getElementById('innerProteinContainer'+orf.locus_tag).appendChild(innerDropdownContainer);
      document.getElementById("innerDropdownContainer"+orf.locus_tag).setAttribute("class","dropdown");
      document.getElementById('innerDropdownContainer'+orf.locus_tag).appendChild(innerDropdownButton);
      document.getElementById("innerDropdownButton"+orf.locus_tag).setAttribute("class","dropbtn");
      document.getElementById('innerDropdownContainer'+orf.locus_tag).appendChild(innerDropdownContent);
      document.getElementById("innerDropdownContent"+orf.locus_tag).setAttribute("class","dropdown-content");
      innerDropdownContent.innerHTML=""
      let geneIndex=0
      for (geneIndex=0; geneIndex<geneMatrix.length;geneIndex++){
        if (geneMatrix[geneIndex].id==orf.locus_tag){
          for (let optionIndex=0; optionIndex<geneMatrix[geneIndex].options.length;optionIndex++){
            let optionContent="<button  onclick='changeSelectedpProteinOption(geneMatrix,"+geneIndex+",\x22"+geneMatrix[geneIndex].options[optionIndex]+"\x22);'  >"+geneMatrix[geneIndex].options[optionIndex]+"</button>";


            innerDropdownContent.innerHTML +=optionContent
            
        }
      break}

      }

      var draw = SVG(innerDropdownButton).size(String(scale(orf.end - orf.start)+10)+"px", height).group();
      points=Proteiner.getproteinPoints(orf, cluster, height, scale)

      var pol = draw.rect(Math.abs(points["4"].x-points["0"].x)+10,Math.abs(points["4"].y-points["0"].y)+20)
                  .rx("10")
                  .ry("10")
                  .fill(orf_color)
                  .stroke({width: 2})
                  .addClass("Proteiner-orf");
      pol.node.id= orf["locus_tag"]+"_protein";
      $(pol.node).mouseover({orf: orf}, function(handler){
        var start = handler.data.orf.start;
        var end = handler.data.orf.end;
        Proteiner.showToolTip("ORF: " + handler.data.orf.locus_tag + "<br/>", handler);
        $(handler.target).css("stroke-width", "3px");
        $(handler.target).css("stroke", "#E11839");
        handler.stopPropagation();
      });
      $(pol.node).mouseleave(function(handler){
        $(handler.target).css("stroke-width", "2px");
        $(handler.target).css("stroke", "black");
        $("#" + Proteiner.tooltip_id).css("display", "none");
      });

      if (orf.hasOwnProperty("domains")) {

        // draw domains
        for (var j in orf.domains) {

          var domain = orf.domains[j];
          var color = "gray";
          if (domain.hasOwnProperty("type")) {
            if (colour_fill_dict.hasOwnProperty(domain.type)){
              color = colour_fill_dict[domain.type];
            }
            else{color="#025699"}

          }
          else{color="#025699"}
          points=Proteiner.getDomainPoints(domain, orf, cluster, height, scale)

          let x=0;
          if (points["0"].x>points["4"].x){
            x=points["4"].x

          }
          else{
            x=points["0"].x
          }
          var dom = draw.rect(Math.abs(points["4"].x-points["0"].x),Math.abs(points["4"].y-points["0"].y)+20)
                      .x(x+5)
                      .y(points["0"].y)
                      .rx("10")
                      .ry("10")
                      .fill(color)
                      .stroke({width: 2})
                      .addClass("Proteiner-domain");

          dom.node.id= orf["locus_tag"]+"_domain_"+domain.sequence;
          $(dom.node).mouseover({domain: domain}, function(handler){
            $("#" + Proteiner.tooltip_id).css("display", "none")
            var start = handler.data.domain.start;
            var end = handler.data.domain.end;
            let contentTooltip=""
            for (let domainIndex=0; domainIndex<geneMatrix[geneIndex].domains.length;domainIndex++){

              if (geneMatrix[geneIndex].domains[domainIndex].start==handler.data.domain.start){
                for (let optionIndex=0; optionIndex<geneMatrix[geneIndex].domains[domainIndex].domainOptions.length; optionIndex++){

                contentTooltip +='<a href="#">'+geneMatrix[geneIndex].domains[domainIndex].domainOptions[optionIndex]+'</a>';
              }
            break}}
            Proteiner.showToolTip("Domain: " + handler.data.domain.abbreviation + " (" + handler.data.domain.type + ")" + "<br/>" + start + " - " + end, handler);
            $(handler.target).css("stroke-width", "3px");
            $(handler.target).css("stroke", "#E11839"

);
            handler.stopPropagation();
          });
          $(dom.node).mouseleave(function(handler){
            $(handler.target).css("stroke-width", "2px");
            $(handler.target).css("stroke", "black");

          });
        }
      }
    }
  }

  $(draw.node).parent().mouseover({domain: domain}, function(handler){
    var bgc_desc = "<b>BGC: " + recordData[0].seq_id+" region "+regionName + "</b>";
    if (cluster.hasOwnProperty("desc")) {
      bgc_desc += "<br /> " + cluster["desc"];
    }
    Proteiner.showToolTip(bgc_desc, handler);
  });
  $(draw.node).parent().mouseleave(function(handler){
    $("#" + Proteiner.tooltip_id).css("display", "none");
  });

  $(container).find("svg").attr("width", width + "px");
  return $(container).find("svg")[0];
});

Proteiner.getOrfPoints = (function(orf, cluster, height, scale){
  var x_points = [
    scale(orf.start),
    (orf.strand === 0) ?
      (scale(orf.start) + scale(orf.end - orf.start))
      : ((scale(orf.end - orf.start) > (height / 2)) ?
          (scale(orf.start) + Math.max(scale(orf.end - orf.start - ((orf.end - orf.start) / 4)), (scale(orf.end - orf.start) - parseInt(height / 2))))
          : scale(orf.start)),
    (scale(orf.start) + scale(orf.end - orf.start))
  ];
  var y_points = [
    (orf.strand === 0) ?
      ((height / 2) - (height / 3))
      : ((height / 2) - (height / 3)) - (height / 5),
    ((height / 2) - (height / 3)),
    (height / 2),
    ((height / 2) + (height / 3)),
    (orf.strand === 0) ?
      ((height / 2) + (height / 3))
      : ((height / 2) + (height / 3)) + (height / 5)
  ];

  return { x: x_points, y: y_points };

});

Proteiner.getproteinPoints = (function(orf, cluster, height, scale) {
  var points = [];
  var pts = Proteiner.getOrfPoints(orf, cluster, height, scale);

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
    points = Proteiner.flipHorizontal(points, scale(orf.start), (scale(orf.start) + scale(orf.end - orf.start)));
  }

  return points;
});

Proteiner.getDomainPoints = (function(domain, orf, cluster, height, scale) {
  var points = [];
  var protein_pts = Proteiner.getproteinPoints(orf, cluster, height, scale);
  if (orf.strand < 0) {
    protein_pts = Proteiner.flipHorizontal(protein_pts, scale(orf.start), (scale(orf.start) + scale(orf.end - orf.start)));
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
    var m = Math.abs(protein_pts[5].y - protein_pts[4].y) / Math.abs(protein_pts[5].x - protein_pts[4].x);
    return (m * (x - protein_pts[4].x));
  }

  for (var i in protein_pts) {
    var apt = protein_pts[i];
    var new_point = {};
    new_point.x = apt.x < domain_x.start ? domain_x.start : (apt.x > domain_x.end ? domain_x.end : apt.x);
    new_point.y = (new_point.x < protein_pts[1].x) ?
                    Math.min(Math.max(apt.y, protein_pts[0].y), protein_pts[7].y)
                    :((new_point.x == protein_pts[1].x) ?
                      apt.y
                      :(i < 4 ?
                        (protein_pts[3].y + getY(new_point.x))
                        :(protein_pts[3].y - getY(new_point.x))));

    // apply margin
    if (i < 4) { // upper
      new_point.y += (height / 20);
    } else { // lower
      new_point.y -= (height / 20);
    }

    points.push(new_point);
  }

  if (orf.strand < 0) {
    points = Proteiner.flipHorizontal(points, scale(orf.start), (scale(orf.start) + scale(orf.end - orf.start)));
  }

  return points;
});

Proteiner.flipHorizontal = (function(points, leftBound, rightBound) {
  var new_points = [];

  for(var i in points) {
    var point = points[i];
    if ((point.x < leftBound) || (point.x > rightBound)) {
      console.log("Error flipping points : " + (point.x + " " + leftBound + " " + rightBound));
    } else {
      new_points.push({ x: rightBound - (point.x - leftBound), y: point.y });
    }
  }

  return new_points;
});
Proteiner.toPointCoordinates= (function(points) {

  coordinates=[points["0"].x,points["0"].y,(points["4"].x-points["0"].x),(points["4"].y-points["0"].y)]
  coordinates_string=points["0"].x.toString()+","+points["0"].y.toString()+","+(points["4"].x-points["0"].x).toString()+","+(points["4"].y-points["0"].y).toString()

  return coordinates
});
Proteiner.toPointString = (function(points) {
  points_string = "";

  for(var i in points) {
    var point = points[i];
    if (i > 0) {
      points_string += ", ";
    }
    points_string += parseInt(point.x) + "," + parseInt(point.y);
  }

  return points_string;
});

Proteiner.getRandomCluster = (function() {
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
    var pos1 = random(i * ((cl_end - cl_start) / num_orfs), (i + 1) * ((cl_end - cl_start) / num_orfs));
    var pos2 = random(i * ((cl_end - cl_start) / num_orfs), (i + 1) * ((cl_end - cl_start) / num_orfs));
    if (Math.abs(pos1 - pos2) < 200) {
      continue;
    }
    var orf_start = Math.min(pos1, pos2);
    var orf_end = Math.max(pos1, pos2);
    var orf_strand = Math.random() > 0.5? 1 : -1;//random(-1, 2);
    var orf_type = Math.random() > 0.5? "biosynthetic" : "others";
    var orf_domains = [];
    var num_domains = random(0, 4);
    for (var j = 0; j < num_domains; j++) {
      var dpos1 = random(j * ((orf_end - orf_start) / num_domains), (j + 1) * ((orf_end - orf_start) / num_domains));
      var dpos2 = random(j * ((orf_end - orf_start) / num_domains), (j + 1) * ((orf_end - orf_start) / num_domains));
      var dom_start = Math.min(dpos1, dpos2);
      var dom_end = Math.max(dpos1, dpos2);
      orf_domains.push({
        code: "RAND_DOM_" + i + "_" + j,
        start: dom_start,
        end: dom_end,
        bitscore: random(30, 300),
        color: "rgb(" + random(0, 256) + "," + random(0, 256) + "," + random(0, 256) + ")",
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

  var cluster = { start: cl_start, end: cl_end, orfs: orfs, desc: 'Randomly generated Cluster'};
  return cluster;
});

Proteiner.drawRandomClusterSVG = (function() {
  return Proteiner.drawClusterSVG(Proteiner.getRandomCluster());
});

Proteiner.showToolTip = (function(html, handler){
  var divTooltip =""
if (html.includes("<a") ){ divTooltip =$("#" + Proteiner.tooltip_id_protein);}
else{divTooltip = $("#" + Proteiner.tooltip_id);}


  if (divTooltip.length < 1) {
    divTooltip = $("<div id='" + Proteiner.tooltip_id+ "'>");
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
  if (html.includes("a") ){

    divTooltip.addClass("dropdown-content");


  }
});
