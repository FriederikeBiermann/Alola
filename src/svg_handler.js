class SVGHandler {
    constructor() {
        this.clusterType = '';
        this.addZoomButtonListeners();
    }

    updateIntermediates(raichu_output, geneMatrixHandler, starterACP) {
        let acpList = geneMatrixHandler.getACPList();
        let intermediates = raichu_output.hangingSvg;
        let max_width = Math.max(...intermediates.map(element => element[3]));

        for (let intermediateIndex = 0; intermediateIndex < intermediates.length; intermediateIndex++) {
            let [intermediate, carrier_x, , , height] = intermediates[intermediateIndex];
            let acp = acpList[intermediateIndex + Math.max(starterACP, 1) - 1];
            svgHandler.updateNRPSPKSIntermediateContainer(acp, intermediate, intermediateIndex, carrier_x, max_width, height);
        }

        // if (document.getElementById("innerIntermediateContainer_tailoring_enzymes")) {
        //     svgHandler.updateTailoringStructure(raichu_output.structureForTailoring);
        // }
    }

    addZoomButtonListeners() {
        const zoomInButton = document.getElementById('Zoom_in_button');
        const zoomOutButton = document.getElementById('Zoom_out_button');

        if (zoomInButton) {
            zoomInButton.addEventListener('click', () => this.zoomIn());
        } else {
            console.warn('Zoom in button not found');
        }

        if (zoomOutButton) {
            zoomOutButton.addEventListener('click', () => this.zoomOut());
        } else {
            console.warn('Zoom out button not found');
        }
    }

    setClusterType(type) {
        this.clusterType = type;
    }

    addDropShadowFilterToSVG(svgElement) {
        let defs = svgElement.querySelector('defs') || this.createDefs(svgElement);
        this.createFilter(defs, 'dropShadow', 'red', 3, 5, 5);
        this.createFilter(defs, 'intenseGlowShadow', '#E11839', 5, 0, 0);
    }

    createDefs(svgElement) {
        let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        svgElement.insertBefore(defs, svgElement.firstChild);
        return defs;
    }

    createFilter(defs, id, color, blurStdDeviation, dx, dy) {
        let filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
        filter.setAttribute("id", id);
        filter.setAttribute("x", "-50%");
        filter.setAttribute("y", "-50%");
        filter.setAttribute("width", "200%");
        filter.setAttribute("height", "200%");

        let feGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
        feGaussianBlur.setAttribute("in", "SourceAlpha");
        feGaussianBlur.setAttribute("stdDeviation", blurStdDeviation);

        let feOffset = document.createElementNS("http://www.w3.org/2000/svg", "feOffset");
        feOffset.setAttribute("dx", dx);
        feOffset.setAttribute("dy", dy);
        feOffset.setAttribute("result", "offsetblur");

        let feFlood = document.createElementNS("http://www.w3.org/2000/svg", "feFlood");
        feFlood.setAttribute("flood-color", color);

        let feComposite = document.createElementNS("http://www.w3.org/2000/svg", "feComposite");
        feComposite.setAttribute("in2", "offsetblur");
        feComposite.setAttribute("operator", "in");

        let feMerge = document.createElementNS("http://www.w3.org/2000/svg", "feMerge");
        let feMergeNode1 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
        let feMergeNode2 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
        feMergeNode2.setAttribute("in", "SourceGraphic");

        feMerge.appendChild(feMergeNode1);
        feMerge.appendChild(feMergeNode2);
        filter.appendChild(feGaussianBlur);
        filter.appendChild(feOffset);
        filter.appendChild(feFlood);
        filter.appendChild(feComposite);
        filter.appendChild(feMerge);

        defs.appendChild(filter);
    }

    highlightAtomInSVG(atom, color, width, shadowId = "dropShadow") {
        if (this.clusterType === "ripp") {
            this.highlightRippAtom(atom, color, width, shadowId);
        } else {
            this.highlightOtherAtom(atom, color, width, shadowId);
        }
    }

    highlightRippAtom(atom, color, width, shadowId) {
        const groupId = "atom_" + atom;
        const group = document.getElementById(groupId);
        if (group) {
            Array.from(group.children).forEach(child => {
                if (['line', 'path', 'circle'].includes(child.nodeName.toLowerCase())) {
                    child.style.stroke = color;
                    child.style.strokeWidth = width;
                    child.style.filter = `url(#${shadowId})`;
                    if (color !== "none") {
                        child.style.fill = color;
                    }
                }
            });
        }
    }

    highlightOtherAtom(atom, color, width, shadowId) {
        if (atom.toString().includes("_")) {
            let links = document.querySelectorAll(`a[*|href="${atom}"]`);
            links.forEach(link => {
                if (this.isValidParent(link.parentElement.parentElement.parentElement.parentElement)) {
                    if (link.parentElement.parentElement.parentElement.parentElement.id === "final_drawing" && color === "black") {
                        color = "white";
                    }
                    let path = link.lastElementChild;
                    path.setAttribute('style', `fill:${color}; stroke:${color}; stroke-width:${width}; filter:url(#${shadowId});`);
                    this.addHoverEvents(path, atom);
                }
            });
        }
    }

    isValidParent(parent) {
        const validIds = [
            "intermediate_drawing_tailoring",
            "intermediate_drawing_cyclisation_terpene",
            "intermediate_drawing_cyclisation",
            "intermediate_drawing_precursor",
            "intermediate_drawing_tailored",
            "final_drawing",
            "intermediate_drawing_cyclisation_terpene"
        ];
        return validIds.includes(parent.id);
    }

    addHoverEvents(element, atom) {
        element.addEventListener('mouseenter', () => {
            document.dispatchEvent(new CustomEvent('hoverin_atom', { detail: atom }));
        });
        element.addEventListener('mouseleave', () => {
            document.dispatchEvent(new CustomEvent('hoverout_atom', { detail: atom }));
        });
    }

    hoverInAtom(atom) {
        const color = "#E11839";
        const width = this.clusterType === "ripp" ? "5" : "50";
        const shadowId = this.clusterType === "ripp" ? "intenseGlowShadow" : "intenseGlowShadow";
        this.highlightAtomInSVG(atom, color, width, shadowId);
    }

    hoverOutAtom(atom) {
        if (this.clusterType === "ripp") {
            this.highlightAtomInSVG(atom, "black", "1", "none");
        } else {
            const color = atom.indexOf("C") >= 0 ? "none" : "black";
            this.highlightAtomInSVG(atom, color, "1", "none");
        }
    }

    zoomIn() {
        this.zoom(-30);
    }

    zoomOut() {
        this.zoom(30);
    }

    zoom(delta) {
        let drawing = document.getElementById("final_drawing");
        let styles = window.getComputedStyle(drawing);
        let width = parseInt(styles.width) + delta;
        let height = parseInt(styles.height) + delta;

        drawing.style.maxWidth = "";
        drawing.style.maxHeight = "";
        drawing.style.width = `${width}px`;
        drawing.style.height = `${height}px`;
    }

    formatSVGIntermediates(svg) {
        return svg.toString()
            .replaceAll("#ffffff", "none")
            .replaceAll("#ff00ff", "none")
            .replaceAll("#ff0000", "#000000")
            .replaceAll("#00ff00", "#000000")
            .replaceAll("<g transform='translate", "<g style='fill: black' transform='translate")
            .replaceAll("<!-- PCP -->    <g style='fill: black'", "<!-- PCP -->    <g style='fill: transparent'")
            .replaceAll("<!-- ACP -->    <g style='fill: black'", "<!-- ACP -->    <g style='fill: transparent'");
    }

    formatSVG(svg) {
        return svg.toString()
            .replaceAll("#ff00ff", "none")
            .replaceAll("#ffffff", "none")
            .replaceAll("#000000", "#ffffff")
            .replaceAll("stroke: #ffffff", "stroke: #ffffff; fill: #ffffff")
            .replaceAll("<g transform='translate", "<g style='fill: #ffffff' transform='translate")
            .replaceAll("<!-- PCP -->    <g style='fill: #ffffff'", "<!-- PCP -->    <g style='fill: transparent'")
            .replaceAll("<!-- ACP -->    <g style='fill: #ffffff'", "<!-- ACP -->    <g style='fill: transparent'");
    }

    formatSVGForDownload(svg) {
        return svg.toString()
            .replaceAll("#ff00ff", "none")
    }

    is_svg(svgString) {
        return svgString.includes("<svg")
    }

    updateStructure(raichu_output) {
        let container = document.getElementById("structure_container");
        container.innerHTML = this.formatSVG(raichu_output.svg);
        let drawing = document.getElementById("final_drawing");
        this.addDropShadowFilterToSVG(drawing);
        drawing.style["max-width"] = "100%";
        drawing.style["max-height"] = "100%";
    }

    updateDownloadLinks(raichu_output) {
        this.setDownloadLink("save_complete_cluster_svg", raichu_output.completeClusterSvg, raichu_output.smiles + "_cluster.svg");
        if (this.clusterType === "ripp") {
        this.setDownloadLink("save_complete_cluster_svg", raichu_output.structureForTailoring, raichu_output.smiles + "_marbles.svg");}
        if (this.clusterType === "terpene") {
            this.setDownloadLink("save_complete_cluster_svg", this.formatSVGForDownload(raichu_output.cyclizedStructure), raichu_output.smiles + "_cyclized_only.svg");
        
        }
        this.setDownloadLink("save_svg", this.formatSVGForDownload(raichu_output.svg), raichu_output.smiles + ".svg");
        this.setDownloadLink("save_enzymatic_pathway_svg", raichu_output.pathway_svg, raichu_output.smiles + "_pathway.svg");
        
        
    }

    setDownloadLink(elementId, svgContent, filename) {
        let element = document.getElementById(elementId);
        if (svgContent == null) {
            element.disabled = true;
            return
        }
        if (!(this.is_svg(svgContent))) {
            element.disabled = true
            return
        }
        element.disabled = false
        if (filename.includes("_cluster")) {
            element.innerHTML = "<strong> Save biosynthetic model withOUT tayloring enzymes(svg) </strong>";
            element.parentElement.setAttribute("data-tooltip", "Save the current biosynthetic model, excluding tailoring enzymes, as an svg image.");}
        if (filename.includes("_marbles")) {
            element.innerHTML = "<strong> Save marble representation(svg)</strong> ";
            element.parentElement.setAttribute("data-tooltip", "Save the marble representation as an svg image.");}
        if (filename.includes("_cyclized_only")) {
            element.innerHTML = "<strong> Save cyclized structure(svg)</strong> ";
            element.parentElement.setAttribute("data-tooltip", "Save the cyclized structure as an svg image.");
        }
        let url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgContent);
        element.href = url;
        element.setAttribute("download", filename);
    }

    updateIntermediateContainer(containerId, svgContent, svgId, replacementId = null) {
        console.log('Function called with parameters:', { containerId, svgContent, svgId, replacementId });

        let container = document.getElementById(containerId);
        console.log('Container element:', container);

        container.setAttribute("style", "width:25vw");
        console.log('Set container style to width:25vw');

        let formattedSVG = this.formatSVGIntermediates(svgContent);
        console.log('Formatted SVG content:', formattedSVG);

        let replacedSVG = formattedSVG.replaceAll("final_drawing", replacementId || "intermediate_drawing");
        console.log('Replaced "final_drawing" with:', replacementId || "intermediate_drawing");

        container.innerHTML = replacedSVG;
        console.log('Set container innerHTML');

        let svg = document.getElementById(replacementId || "intermediate_drawing");
        console.log('Retrieved SVG element:', svg);

        this.reformatSVG(svg);
        console.log('Reformatted SVG');

        svg.setAttribute('id', svgId);
        console.log('Set SVG id to:', svgId);

        svg.setAttribute('class', svgId);
        console.log('Set SVG class to:', svgId);

        if (svgId === "intermediate_drawing_tailored") {
            this.addDropShadowFilterToSVG(svg);
            console.log('Added drop shadow filter to SVG');
        }

        console.log('Function execution completed');
    }

    reformatSVG(svg, id = null, className = null) {
        // Remove all whitespace nodes
        svg.innerHTML = svg.innerHTML.replace(/>\s+</g, '><');

        // Remove unnecessary attributes
        svg.removeAttribute('xmlns:xlink');
        svg.removeAttribute('xml:space');
        svg.removeAttribute('version');

        // Set viewBox based on content
        let bbox = svg.getBBox();
        let viewBox = [bbox.x, bbox.y, bbox.width, bbox.height].join(" ");
        svg.setAttribute("viewBox", viewBox);

        // Remove width and height attributes
        svg.removeAttribute('width');
        svg.removeAttribute('height');

        // Set id and class if provided
        if (id) svg.setAttribute('id', id);
        if (className) svg.setAttribute('class', className);

        // Optimize path data
        let paths = svg.querySelectorAll('path');
        paths.forEach(path => {
            let d = path.getAttribute('d');
            d = d.replace(/\s+/g, ' ').trim(); // Remove extra spaces
            d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/g, '$1 $2'); // Ensure space after commands
            path.setAttribute('d', d);
        });
    }

    updateNRPSPKSIntermediateContainer(acp, intermediate, index, carrier_x, max_width, height) {
        let viewPortHeight = window.innerHeight;
        let viewPortWidth = window.innerWidth;
        if (window.matchMedia("(orientation: portrait)").matches) {
            viewPortHeight = window.innerWidth;
            viewPortWidth = window.innerHeight;
        }
        let container = document.getElementById(`innerIntermediateContainer${acp.replace(".", "_")}`);
        container.setAttribute("style", "width:5vw;");
        container.innerHTML = this.formatSVGIntermediates(intermediate);
        let svg = document.getElementById("intermediate_drawing");
        let bbox = svg.getBBox();
        let viewBox = [bbox.x, bbox.y, max_width, height].join(" ");
        svg.setAttribute("viewBox", viewBox);
        svg.setAttribute("width", max_width);
        svg.setAttribute('id', `intermediate_drawing${index}`);
        svg.setAttribute('class', "intermediate_drawing");

        let rightPosition = 0.05 * viewPortWidth <= max_width
            ? (((carrier_x - bbox.x) / max_width) * 5 - 700 / viewPortHeight)
            : (carrier_x - bbox.x - 13000 / viewPortHeight);
        svg.setAttribute('style', `right: ${rightPosition}${0.05 * viewPortWidth <= max_width ? 'vw' : 'px'};`);
    }

    updateTailoringStructure(structureForTailoring) {
        let container = document.getElementById("innerIntermediateContainer_tailoring_enzymes");
        container.setAttribute("style", "width:150px");
        container.innerHTML = this.formatSVGIntermediates(structureForTailoring);
        let svg = document.getElementById("tailoring_drawing");
        this.reformatSVG(svg, "intermediate_drawing_tailoring", "intermediate_drawing_tailoring");
        this.addDropShadowFilterToSVG(svg);
    }

    reformatSVGToBoundary(svg) {
    // Get the bounding box of the SVG
    const bbox = svg.getBBox();
    // Get the width and height of the bounding box
    const width = bbox.width;
    const height = bbox.height;
    // Get the x and y coordinates of the top-left corner of the bounding box
    const bboxX = bbox.x;
    const bboxY = bbox.y;
    // Set the new viewBox attribute to fit the bounding box exactly
    svg.setAttribute("viewBox", `${bboxX} ${bboxY} ${width} ${height}`);
    // Set the width and height attributes to match the bounding box
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
}

/**
 * Scales all SVGs by the same factor so that none overflow their containers.
 * @param {SVGElement[]} svgs - Array of SVG DOM elements
 * @param {HTMLElement[]} containers - Array of container DOM elements (same order as svgs)
 */
scaleSVGsToFitContainersUniformly(svgs, containers) {
    // Find the limiting scale for each SVG/container pair
    let maxScale = Infinity;
    svgs.forEach((svg, i) => {
        const bbox = svg.getBBox();
        const container = containers[i];
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        // Calculate scale factors for width and height
        const scaleW = containerWidth / bbox.width;
        const scaleH = containerHeight / bbox.height;
        // The limiting scale for this SVG/container
        const scale = Math.min(scaleW, scaleH);
        if (scale < maxScale) maxScale = scale;
    });
    // Apply the same scale to all SVGs
    svgs.forEach(svg => {
        // Optionally wrap content in a <g> for scaling
        let g = svg.querySelector('g[data-autoscale]');
        if (!g) {
            g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('data-autoscale', 'true');
            while (svg.firstChild) g.appendChild(svg.firstChild);
            svg.appendChild(g);
        }
        g.setAttribute('transform', `scale(${maxScale})`);
        // Optionally, set viewBox to bbox for consistent scaling
        const bbox = g.getBBox();
        svg.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.display = 'block';
    });
}

/**
 * Automatically finds the lowest-level container (closest non-SVG parent) for each SVG,
 * computes a uniform scale so none overflow their own container, and applies that scale.
 * @param {SVGElement[]} svgs
 * @returns {number} applied scale factor
 */
scaleSVGsUniformByParent(svgElements) {
    if (!svgElements || svgElements.length === 0) return 1;
    // Collect per-SVG limiting scale
    let limitingScale = Infinity;
    const svgInfo = [];
    svgElements.forEach(svg => {
        if (!svg) return;
        // Find closest non-SVG ancestor (stop at document.body)
        let container = svg.parentElement;
        while (container && container.tagName && container.tagName.toLowerCase() === 'svg') {
            container = container.parentElement;
        }
        if (!container) return;
        // Force layout measurement
        const bbox = svg.getBBox();
        const rect = container.getBoundingClientRect();
        const cWidth = rect.width;
        const cHeight = rect.height;
        if (bbox.width === 0 || bbox.height === 0 || cWidth === 0 || cHeight === 0) return; // skip invalid
        const scaleW = cWidth / bbox.width;
        const scaleH = cHeight / bbox.height;
        const scale = Math.min(scaleW, scaleH);
        if (scale < limitingScale) limitingScale = scale;
        svgInfo.push({ svg, container, bbox });
    });
    if (limitingScale === Infinity) return 1;
    // Apply uniform scale
    svgInfo.forEach(({ svg, bbox }) => {
        let g = svg.querySelector('g[data-autoscale]');
        if (!g) {
            g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('data-autoscale', 'true');
            while (svg.firstChild) g.appendChild(svg.firstChild);
            svg.appendChild(g);
        }
        g.setAttribute('transform', `scale(${limitingScale})`);
        // Update viewBox to original bbox so scaling origin is consistent
        svg.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.display = 'block';
        svg.style.overflow = 'hidden';
    });
    return limitingScale;
}

/**
 * Scales all SVGs so that the average length of paths inside groups whose id starts
 * with lineGroupPrefix (e.g. 'line2d_') becomes identical across all SVGs.
 * It chooses the largest target length that does NOT overflow any container when scaling up.
 * @param {SVGElement[]} svgs
 * @param {Object} opts
 * @param {string} opts.lineGroupPrefix - Prefix for line group ids.
 * @param {boolean} opts.useMedian - Use median instead of average per SVG.
 * @returns {{targetLength:number, scaleFactors:Map<SVGElement,number>}} metadata
 */
scaleSVGsUniformByLineLength(svgElements, opts = {}) {
    const lineGroupPrefix = opts.lineGroupPrefix || 'line2d_';
    const useMedian = opts.useMedian || false;
    if (!svgElements || svgElements.length === 0) return { targetLength: 0, scaleFactors: new Map() };

    function collectLineLengths(svg) {
        const groups = Array.from(svg.querySelectorAll(`g[id^='${lineGroupPrefix}']`));
        const lengths = [];
        groups.forEach(g => {
            const path = g.querySelector('path');
            if (path) {
                try {
                    const len = path.getTotalLength();
                    if (!isNaN(len) && len > 0) lengths.push(len);
                } catch (e) { /* ignore */ }
            }
        });
        return lengths;
    }
    function statLength(arr) {
        if (arr.length === 0) return 0;
        if (useMedian) {
            const sorted = [...arr].sort((a,b)=>a-b);
            const mid = Math.floor(sorted.length/2);
            return sorted.length % 2 ? sorted[mid] : (sorted[mid-1]+sorted[mid])/2;
        }
        return arr.reduce((a,b)=>a+b,0)/arr.length;
    }

    // Gather per-SVG line length and container constraints
    const perSvg = [];
    svgElements.forEach(svg => {
        if (!svg) return;
        const lengths = collectLineLengths(svg);
        const repLength = statLength(lengths);
        if (repLength === 0) return; // skip if no lines
        // Find container
        let container = svg.parentElement;
        while (container && container.tagName && container.tagName.toLowerCase() === 'svg') {
            container = container.parentElement;
        }
        if (!container) return;
        const bbox = svg.getBBox();
        const cRect = container.getBoundingClientRect();
        const cW = cRect.width || 0;
        const cH = cRect.height || 0;
        if (bbox.width === 0 || bbox.height === 0 || cW === 0 || cH === 0) return;
        // Max up-scale so full bbox still fits container
        const maxScaleWidth = cW / bbox.width;
        const maxScaleHeight = cH / bbox.height;
        const maxScale = Math.min(maxScaleWidth, maxScaleHeight);
        perSvg.push({ svg, repLength, maxScale, bbox });
    });
    if (perSvg.length === 0) return { targetLength: 0, scaleFactors: new Map() };

    // Feasible target length cannot exceed repLength * maxScale for any SVG
    const feasibleMaxTarget = Math.min(...perSvg.map(d => d.repLength * d.maxScale));
    const targetLength = feasibleMaxTarget; // choose largest possible for clarity

    const scaleMap = new Map();
    perSvg.forEach(d => {
        let existingScale = 1;
        const t = g.getAttribute('transform');
        const m = /scale\\(([^)]+)\\)/.exec(t);
        if (m) existingScale = parseFloat(m[1]) || 1;
        const effectiveRepLength = d.repLength / existingScale;
        const scaleNeeded = targetLength / effectiveRepLength; // may be <= maxScale by construction
        // Wrap content for scaling
        let g = d.svg.querySelector('g[data-line-uniform]');
        if (!g) {
            g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('data-line-uniform','true');
            while (d.svg.firstChild) g.appendChild(d.svg.firstChild);
            d.svg.appendChild(g);
        }
        g.setAttribute('transform', `scale(${scaleNeeded})`);
        d.svg.setAttribute('viewBox', `${d.bbox.x} ${d.bbox.y} ${d.bbox.width} ${d.bbox.height}`);
        d.svg.style.width = '100%';
        d.svg.style.height = '100%';
        d.svg.style.display = 'block';
        scaleMap.set(d.svg, scaleNeeded);
    });
    return { targetLength, scaleFactors: scaleMap };
}
}
