var Terpener = {
    version: "1.0.0",
    required: [
        "jquery",
        "svg.js==2.7.1"
    ],
    tooltip_id: "Terpener-tooltip-1234567890",
    tooltip_id_domain: "Terpener-tooltip-123"
};

Terpener.drawArrow = function (baseWidth, height, label = null) {
    const estimatedLabelWidth = label ? (label.length * 7 + 20) : 0;
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

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', containerWidth);
    svg.setAttribute('height', height + (label ? 26 : 0));
    svg.style.overflow = 'visible';

    const arrowLength = containerWidth - 20;
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


Terpener.leaveSpace = function (width, id, scale, includeArrow = false, arrowLabel = null, parentCell = null) {
    const domainContainer = document.getElementById('domain_container');
    const targetParent = parentCell || domainContainer;
    // Always use 20% of the viewport height for cluster height (fixed layout baseline)
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
        const arrowHeight = 30;
        const arrow = Terpener.drawArrow(width, arrowHeight, arrowLabel);
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


Terpener.drawCluster = function (geneMatrix, height = 90, space = 300, terpeneCyclaseOptions, geneMatrixHandler) {
    const container = document.getElementById('domain_container');
    // Reset previous layout styles before applying terpene grid layout
    if (typeof window !== 'undefined' && window.resetDomainContainerLayout) {
        window.resetDomainContainerLayout();
    }
    container.innerHTML = '';
    container.classList.add('terpene-layout');
    container.style.display = 'grid';
    container.style.alignItems = 'start';
    container.style.overflowX = 'auto';
    container.style.overflowY = 'visible';
    container.style.height = 'auto';
    container.style.minHeight = height + 'px';
    container.style.rowGap = '4px';
    container.style.columnGap = '12px';

    const scale = val => parseInt(val / (1000 / height));

    function computeLayout() {
        let availableWidth = container.clientWidth;
        if (!availableWidth || availableWidth < 400) {
            availableWidth = Math.round((window.innerWidth || 1200) * 0.75);
        }
        const wrapperCount = 3;
        const arrowCount = 2;
        const gapPx = 12;
        const maxArrowFrac = 0.05;
        let arrowBase = Math.round(availableWidth * maxArrowFrac);
        arrowBase = Math.max(50, Math.min(90, arrowBase));
        const totalGap = gapPx * wrapperCount;
        const spaceForWrappers = availableWidth - (arrowBase * arrowCount) - totalGap;
        let slotWidthPx = Math.floor(spaceForWrappers / wrapperCount);
        slotWidthPx = Math.max(180, slotWidthPx);
        return { slotWidthPx, arrowBase };
    }
    const layout = computeLayout();
    container.style.gridTemplateColumns = `${layout.slotWidthPx}px ${layout.arrowBase}px ${layout.slotWidthPx}px ${layout.arrowBase}px ${layout.slotWidthPx}px`;
    const bubbleRowHeight = 60;
    container.style.gridTemplateRows = `${bubbleRowHeight}px auto`;

    const bubbleCells = []; const pipelineCells = [];
    for (let i=0;i<5;i++) {
        const b = document.createElement('div');
        b.className = 'bubble-cell';
        b.style.display='flex'; b.style.justifyContent='center'; b.style.alignItems='center';
        b.style.height=bubbleRowHeight+'px'; b.style.gridRow='1'; b.style.position='relative';
    b.style.zIndex='10'; // elevate bubble dropdown layer
        container.appendChild(b); bubbleCells.push(b);
        const p = document.createElement('div');
        p.className='pipeline-cell';
        p.style.display='flex'; p.style.flexDirection='column'; p.style.alignItems='center'; p.style.justifyContent='flex-start';
    p.style.gridRow='2'; p.style.position='relative'; p.style.zIndex='1';
        container.appendChild(p); pipelineCells.push(p);
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

    // Precursor structure column 0
    Terpener.leaveSpace(layout.slotWidthPx, 'precursor', scale, false, null, pipelineCells[0]);
    // Arrow Cyclization column 1
    Terpener.leaveSpace(layout.arrowBase, 'arrow1', scale, true, 'Cyclization', pipelineCells[1]);
    // Cyclized product column 2
    Terpener.leaveSpace(layout.slotWidthPx, 'cyclizedProduct', scale, false, null, pipelineCells[2]);
    // Arrow Tailoring column 3
    Terpener.leaveSpace(layout.arrowBase, 'arrow2', scale, true, 'Tailoring', pipelineCells[3]);
    // Tailored product column 4
    Terpener.leaveSpace(layout.slotWidthPx, 'tailoredProduct', scale, false, null, pipelineCells[4]);

    // Draw bubbles then move into bubble row
    Terpener.drawCyclase(height, scale, terpeneCyclaseOptions, geneMatrixHandler);
    moveSpecificBoxToBubble('Cyclase', bubbleCells[2]);
    Terpener.drawTailoringEnzymes(geneMatrix, height, scale, geneMatrixHandler);
    moveTailoringBoxesToBubble(bubbleCells[4]);

    Terpener._lastDrawParams = { geneMatrix, height, space, terpeneCyclaseOptions, geneMatrixHandler };
    attachResizeObserverTerpene();

    // Normalize heights & arrow alignment
    setTimeout(() => unifyLayoutHeightsTerpene(container), 0);

    return $(container).find('svg')[0];

    function unifyLayoutHeightsTerpene(root) {
        const structureIds = ['precursor','cyclizedProduct','tailoredProduct'];
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
        // Keep arrow containers at original fixed height; just ensure path centered within its own svg height
        root.querySelectorAll("div[id^='arrow']").forEach(arrowC => {
            const svg = arrowC.querySelector('svg');
            if (!svg) return;
            const path = svg.querySelector('path');
            const label = svg.querySelector('text');
            const svgH = parseInt(svg.getAttribute('height')) || 30;
            const lineY = Math.round((svgH - (label ? 26 : 0)) / 2);
            if (path) {
                const arrowLength = parseInt(svg.getAttribute('width')) - 20;
                path.setAttribute('d', `M10,${lineY} L${arrowLength},${lineY} M${arrowLength - 10},${lineY - 5} L${arrowLength},${lineY} L${arrowLength - 10},${lineY + 5}`);
            }
            // Leave label position as initially drawn
        });
    }

    function moveSpecificBoxToBubble(suffix, cell) {
        const target = Array.from(container.querySelectorAll('.box')).find(b => b.id.includes(suffix));
        if (target) { cell.appendChild(target); target.style.marginBottom='0'; }
    }
    function moveTailoringBoxesToBubble(cell) {
        const tailoringBoxes = Array.from(container.querySelectorAll('.box')).filter(b => b.id.includes('tailoringEnzyme'));
        tailoringBoxes.forEach(b => { cell.appendChild(b); b.style.marginBottom='0'; });
    }
    function attachResizeObserverTerpene() {
        if (Terpener._resizeAttached) return;
        Terpener._resizeAttached = true;
        let timeoutId = null;
        window.addEventListener('resize', () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (!Terpener._lastDrawParams) return;
                Terpener.drawCluster(
                    Terpener._lastDrawParams.geneMatrix,
                    Terpener._lastDrawParams.height,
                    space,
                    Terpener._lastDrawParams.terpeneCyclaseOptions,
                    Terpener._lastDrawParams.geneMatrixHandler
                );
            }, 120);
        });
    }
};
Terpener.drawCyclase = (function (height = 90, scale, terpeneCyclaseOptions, geneMatrixHandler) {
    console.log(terpeneCyclaseOptions)
    var container = document.getElementById('domain_container')
    let size = height /2
    let indent = 0
    let color = "lightgrey"
    let outline = "black"

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
            document.getElementById('innerdomainContainer' + domainIdentifier).style.position='relative';
            document.getElementById('innerdomainContainer' + domainIdentifier).style.zIndex='20';
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
            // Elevate terpene cyclase dropdown above other layout layers
            innerDropdownContent.style.position = 'absolute';
            innerDropdownContent.style.zIndex = '1000';
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
    // Elevate folded submenu for cyclase options and append its content correctly
    innerDropdownContainer_folded_1.style.position='absolute';
    innerDropdownContainer_folded_1.style.zIndex='1001';
    innerDropdownContent.style.position='absolute';
    innerDropdownContent.style.zIndex='1002';
    innerDropdownContainer_folded_1.appendChild(innerDropdownContent);
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
            document.getElementById('innerdomainContainer' + domainIdentifier).style.position='relative';
            document.getElementById('innerdomainContainer' + domainIdentifier).style.zIndex='20';
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
            innerDropdownContent.style.position = 'absolute';
            innerDropdownContent.style.zIndex = '1000';
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
            innerDropdownContainer_folded_1.style.position='absolute';
            innerDropdownContainer_folded_1.style.zIndex='1001';
            innerDropdownContent.style.position='absolute';
            innerDropdownContent.style.zIndex='1002';
            innerDropdownContainer_folded_1.appendChild(innerDropdownContent);
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

