var RiPPer = {
    version: "1.0.0",
    required: [
        "jquery",
        "svg.js==2.7.1"
    ],
    tooltip_id: "RiPPer-tooltip-1234567890",
    tooltip_id_domain: "RiPPer-tooltip-123"
};

RiPPer.drawArrow = function (baseWidth, height, label = null) {
    // Dynamically enlarge container width based on label length to avoid cropping.
    const estimatedLabelWidth = label ? (label.length * 7 + 20) : 0; // rough per-char estimate + padding
    const containerWidth = Math.max(baseWidth, estimatedLabelWidth);

    const arrowContainer = document.createElement('div');
    arrowContainer.style.display = 'inline-flex';
    arrowContainer.style.flexDirection = 'column';
    arrowContainer.style.alignItems = 'center';
    arrowContainer.style.justifyContent = 'center';
    arrowContainer.style.width = containerWidth + 'px';
    arrowContainer.style.height = '100%';
    arrowContainer.style.overflow = 'visible';
    arrowContainer.style.flexShrink = '0';

    // Use full container width for SVG so arrow centers nicely
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', containerWidth);
    svg.setAttribute('height', height + (label ? 26 : 0)); // extend height slightly if label present
    svg.style.overflow = 'visible';

    const arrowLength = containerWidth - 20; // keep margins
    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arrow.setAttribute('d', `M10,${height / 2} L${arrowLength},${height / 2} M${arrowLength - 10},${height / 2 - 5} L${arrowLength},${height / 2} L${arrowLength - 10},${height / 2 + 5}`);
    arrow.setAttribute('stroke', '#000000');
    arrow.setAttribute('stroke-width', '2');
    arrow.setAttribute('fill', 'none');
    svg.appendChild(arrow);

    if (label) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', containerWidth / 2);
        text.setAttribute('y', height + 18);
        text.setAttribute('text-anchor', 'middle');
        text.style.fontSize = '12px';
        text.textContent = label;
        svg.appendChild(text);
    }

    arrowContainer.appendChild(svg);
    return arrowContainer;
};

RiPPer.leaveSpace = function (width, id, scale, includeArrow = false, arrowLabel = null, parentCell = null) {
    const domainContainer = document.getElementById('domain_container');
    const targetParent = parentCell || domainContainer;
    // Always use 20% of viewport height for a stable cluster height baseline
    const clusterHeight = Math.round(window.innerHeight * 0.20);

    if (includeArrow) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.flexDirection = 'row';
        container.style.boxSizing = 'border-box';
        container.style.width = width + 'px';
        container.style.height = clusterHeight + 'px';
        container.style.overflow = 'visible';
        container.style.flexShrink = '0';
        // In grid mode we rely on column-gap, so omit margin-right
        const arrowHeight = 30;
        const arrow = RiPPer.drawArrow(width, arrowHeight, arrowLabel);
        container.appendChild(arrow);
        targetParent.appendChild(container);
        return container;
    }

    const container = document.createElement('div');
    container.style.display = 'inline-flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.boxSizing = 'border-box';
    container.style.width = String(width) + 'px';
    container.style.height = 'auto';
    container.style.minHeight = clusterHeight + 'px';
    container.style.overflow = 'visible';
    container.style.flexShrink = '0';
    container.setAttribute('data-scaling-boundary', 'true');

    const innerContainer = document.createElement('div');
    innerContainer.id = id;
    innerContainer.style.position = 'relative';
    innerContainer.style.flex = '0 0 auto';
    innerContainer.style.width = '100%';
    innerContainer.style.height = 'auto';
    innerContainer.style.overflow = 'visible';
    innerContainer.setAttribute('data-scaling-boundary', 'true');

    const innerIntermediateContainer = document.createElement('div');
    innerIntermediateContainer.id = 'innerIntermediateContainer_' + id;
    innerIntermediateContainer.setAttribute('class', 'intermediateContainerTailoring');
    innerIntermediateContainer.style.width = '100%';
    innerIntermediateContainer.style.height = 'auto';
    innerIntermediateContainer.style.display = 'flex';
    innerIntermediateContainer.style.alignItems = 'center';
    innerIntermediateContainer.style.justifyContent = 'center';
    innerIntermediateContainer.style.overflow = 'visible';
    innerIntermediateContainer.setAttribute('data-scaling-boundary', 'true');

    innerContainer.appendChild(innerIntermediateContainer);
    container.appendChild(innerContainer);
    targetParent.appendChild(container);
    return container;
};

// Example usage within RiPPer.drawCluster
RiPPer.drawCluster = function (geneMatrix, proteaseOptions = null, height = 90, space = 600, cleavageSites, geneMatrixHandler) {
    const container = document.getElementById('domain_container');
    // Clear lingering styles from other cluster types before applying RiPP grid layout
    if (typeof window !== 'undefined' && window.resetDomainContainerLayout) {
        window.resetDomainContainerLayout();
    }
    container.innerHTML = '';
    container.classList.add('ripp-layout');

    // Prepare grid layout: 2 rows (bubbles + pipeline), 5 columns
    container.style.display = 'grid';
    container.style.alignItems = 'start';
    container.style.overflowX = 'auto';
    container.style.overflowY = 'visible';
    container.style.height = 'auto';
    container.style.minHeight = height + 'px';
    container.style.rowGap = '4px';
    container.style.columnGap = '12px';

    const scale = val => parseInt(val / (1000 / height));

    // Dynamic sizing -----------------------------------------------------
    function computeLayout() {
        let availableWidth = container.clientWidth;
        if (!availableWidth || availableWidth < 400) {
            // fallback if not yet laid out
            availableWidth = Math.round((window.innerWidth || 1200) * 0.75);
        }
        const wrapperCount = 3; // precursor, tailored, cleaved
        const arrowCount = 2;
        const gapPx = 12; // margin-right per wrapper
        const maxArrowFrac = 0.05; // cap arrow width fraction
        let arrowBase = Math.round(availableWidth * maxArrowFrac);
        arrowBase = Math.max(50, Math.min(90, arrowBase));
        const totalGap = gapPx * wrapperCount;
        const spaceForWrappers = availableWidth - (arrowBase * arrowCount) - totalGap;
        let slotWidthPx = Math.floor(spaceForWrappers / wrapperCount);
        slotWidthPx = Math.max(180, slotWidthPx); // enforce minimum
        return { slotWidthPx, arrowBase };
    }
    const layout = computeLayout();
    // Define columns based on computed widths
    container.style.gridTemplateColumns = `${layout.slotWidthPx}px ${layout.arrowBase}px ${layout.slotWidthPx}px ${layout.arrowBase}px ${layout.slotWidthPx}px`;
    // Fixed bubble row height + auto pipeline row
    const bubbleRowHeight = 60;
    container.style.gridTemplateRows = `${bubbleRowHeight}px auto`;

    // Create grid cells
    const bubbleCells = [];
    const pipelineCells = [];
    for (let i = 0; i < 5; i++) {
        const bubbleCell = document.createElement('div');
        bubbleCell.className = 'bubble-cell';
        bubbleCell.style.display = 'flex';
        bubbleCell.style.justifyContent = 'center';
        bubbleCell.style.alignItems = 'center';
        bubbleCell.style.height = bubbleRowHeight + 'px';
        bubbleCell.style.gridRow = '1';
        bubbleCell.style.position = 'relative';
        container.appendChild(bubbleCell);
        bubbleCells.push(bubbleCell);

        const pipelineCell = document.createElement('div');
        pipelineCell.className = 'pipeline-cell';
        pipelineCell.style.display = 'flex';
        pipelineCell.style.flexDirection = 'column';
        pipelineCell.style.alignItems = 'center';
        pipelineCell.style.justifyContent = 'flex-start';
        pipelineCell.style.gridRow = '2';
        pipelineCell.style.position = 'relative';
        container.appendChild(pipelineCell);
        pipelineCells.push(pipelineCell);
    }

    function setupWrapper(wrapper, widthPx) {
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        wrapper.style.width = widthPx + 'px';
        wrapper.style.flex = '0 0 ' + widthPx + 'px';
        wrapper.style.marginRight = '12px';
        wrapper.style.boxSizing = 'border-box';
    }

    // Precursor structure in column 0
    RiPPer.leaveSpace(layout.slotWidthPx, 'precursor', scale, false, null, pipelineCells[0]);
    // Arrow 1 in column 1
    RiPPer.leaveSpace(layout.arrowBase, 'arrow1', scale, true, 'Tailoring', pipelineCells[1]);

    // Tailored product structure in column 2
    RiPPer.leaveSpace(layout.slotWidthPx, 'tailoredProduct', scale, false, null, pipelineCells[2]);

    // Arrow 2 in column 3
    const proteaseGene = (function give_protease(gm) {
        for (let i = 0; i < gm.length; i++) {
            const g = gm[i];
            if (g.tailoringEnzymeStatus && !g.ko && (g.tailoringEnzymeAbbreviation === 'PROT' || g.tailoringEnzymeAbbreviation === 'PEP')) {
                return g;
            }
        }
        return null;
    })(geneMatrix);
    RiPPer.leaveSpace(layout.arrowBase, 'arrow2', scale, true, 'Cleavage', pipelineCells[3]);

    // Cleaved product structure in column 4
    RiPPer.leaveSpace(layout.slotWidthPx, 'cleavedProduct_space', scale, false, null, pipelineCells[4]);

    // Tailoring enzyme bubbles -> bubble column 2
    RiPPer.drawTailoringEnzymes(geneMatrix, height, scale, geneMatrixHandler);
    moveBoxesToBubbleCell(bubbleCells[2]);
    // Protease bubble -> bubble column 4
    if (document.getElementById('wildcardProtease').checked || proteaseGene) {
        RiPPer.drawProtease(height, scale, proteaseOptions, cleavageSites, geneMatrixHandler, proteaseGene);
        moveSpecificBoxToCell('protease', bubbleCells[4]);
    }
    // Precursor peptide heading boxes (if any) -> bubble column 0 (heuristic by id prefix tailoringEnzyme?)
    // Currently precursor has no .box bubbles; left empty intentionally.

    // Store params for dynamic resize redraw -----------------------------
    RiPPer._lastDrawParams = { geneMatrix, proteaseOptions, height, cleavageSites, geneMatrixHandler };
    attachResizeObserver();

    // Normalize heights & arrow vertical alignment
    setTimeout(() => unifyLayoutHeights(container), 0);

    return $(container).find('svg')[0];

    function unifyLayoutHeights(root) {
        const structureIds = ['precursor','tailoredProduct','cleavedProduct_space'];
        const svgEntries = [];
        structureIds.forEach(id => {
            const c = root.querySelector(`#innerIntermediateContainer_${id}`);
            if (!c) return;
            const svg = c.querySelector('svg');
            if (!svg) return;
            try { const bbox = svg.getBBox(); svgEntries.push({container:c, svg, bbox}); } catch(_) {}
        });
        if (svgEntries.length === 0) return;
        const targetHeight = Math.max(...svgEntries.map(e => e.bbox.height));
        svgEntries.forEach(e => {
            if (e.bbox.height === 0) return;
            const scale = targetHeight / e.bbox.height;
            let g = e.svg.querySelector('g[data-unify]');
            if (!g) {
                g = document.createElementNS('http://www.w3.org/2000/svg','g');
                g.setAttribute('data-unify','true');
                while (e.svg.firstChild) g.appendChild(e.svg.firstChild);
                e.svg.appendChild(g);
            }
            g.setAttribute('transform', `scale(${scale})`);
            e.svg.setAttribute('viewBox', `${e.bbox.x} ${e.bbox.y} ${e.bbox.width} ${e.bbox.height}`);
            e.svg.style.height = targetHeight + 'px';
            e.svg.style.width = '100%';
            e.container.style.height = targetHeight + 'px';
        });
        // Keep arrow containers at their original fixed height (clusterHeight) and only recompute path centering inside its own svg
        root.querySelectorAll("div[id^='arrow']").forEach(arrowC => {
            const svg = arrowC.querySelector('svg');
            if (!svg) return;
            const path = svg.querySelector('path');
            const label = svg.querySelector('text');
            const svgH = parseInt(svg.getAttribute('height')) || 30;
            const lineY = Math.round((svgH - (label ? 26 : 0)) / 2); // center excluding label space if present
            if (path) {
                const arrowLength = parseInt(svg.getAttribute('width')) - 20;
                path.setAttribute('d', `M10,${lineY} L${arrowLength},${lineY} M${arrowLength - 10},${lineY - 5} L${arrowLength},${lineY} L${arrowLength - 10},${lineY + 5}`);
            }
            // Leave label y as originally defined in drawArrow
        });
    }

    function moveBoxesToBubbleCell(cell) {
        const boxes = Array.from(container.querySelectorAll('.box')).filter(b => b.parentElement === container);
        boxes.forEach(box => {
            cell.appendChild(box);
            box.style.marginBottom = '0';
        });
    }
    function moveSpecificBoxToCell(boxIdSuffix, cell) {
        const target = Array.from(container.querySelectorAll('.box')).find(b => b.id.includes(boxIdSuffix));
        if (target) {
            cell.appendChild(target);
            target.style.marginBottom = '0';
        }
    }

    function attachResizeObserver() {
        if (RiPPer._resizeAttached) return;
        RiPPer._resizeAttached = true;
        let timeoutId = null;
        window.addEventListener('resize', () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (!RiPPer._lastDrawParams) return;
                // Redraw cluster with stored params for responsive layout
                RiPPer.drawCluster(
                    RiPPer._lastDrawParams.geneMatrix,
                    RiPPer._lastDrawParams.proteaseOptions,
                    RiPPer._lastDrawParams.height,
                    space,
                    RiPPer._lastDrawParams.cleavageSites,
                    RiPPer._lastDrawParams.geneMatrixHandler
                );
            }, 120); // debounce
        });
    }
};


RiPPer.drawProtease = (function (height = 90, scale, proteaseOptions, cleavageSites, geneMatrixHandler) {
    var container = document.getElementById('domain_container')
    let size = height /2
    let indent = 0
    let color = "lightgrey"
    let outline = "black"

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

