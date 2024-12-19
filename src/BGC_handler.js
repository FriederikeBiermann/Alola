class GeneMatrixHandler {
    constructor(BGC, details_data, regionName, cluster_type, regionIndex, recordData) {
        this.BGC = BGC;
        this.details_data = details_data;
        this.regionName = regionName;
        this.cluster_type = cluster_type;
        this.geneMatrix = this.createGeneMatrix();
        this.historyStack = new HistoryStack();
        this.updateHistory(this.geneMatrix, this.BGC);
        this.terpeneSubstrate = "";
        this.terpeneDoubleBondIsomerization = [];
        this.terpeneMethylShift = [];
        this.cyclization = [];
        this.rippPrecursor = "";
        this.rippFullPrecursor = "";
        this.rippPrecursorGene = 0;
        this.moduleMatrix = [];
        this.proteaseOptions = [];
        this.regionIndex = regionIndex;
        this.recordData = recordData;
        this.starterACP = "";
        this.tailoringArray = this.findTailoringReactions();
        this.addUndoRedoListeners();
        uiHandler.createWildcardButtons("PKS", this);
        uiHandler.createWildcardButtons("NRPS", this);
        uiHandler.createTailoringEnzymeForm(this)
        uiHandler.appendButtonsToDropdownTerpene(this)
        this.addRiPPPrecursorListener(); 
        this.cleavageSites = [];
        this.terpeneCyclaseOptions = [];
    }

    getDefaultOrientation() {
        let strandCounter = 0;
        for (let geneIndex = 0; geneIndex < this.BGC.orfs.length; geneIndex++) {
            const strand = this.BGC.orfs[geneIndex].strand;
            if (typeof strand === 'number') {
                strandCounter += strand;
            } else {
                console.warn(`Invalid strand value at index ${geneIndex}:`, strand);
            }
        }
        return strandCounter > 0;
    }

    addRiPPPrecursorListener() {
        const textarea = document.querySelector('#popupFormRiPP textarea');
        if (textarea) {
            ['mouseup', 'mouseleave'].forEach(eventType => {
                textarea.addEventListener(eventType, () => {
                    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
                    this.updateRiPPPrecursor(selectedText, textarea.value);
                });
            });
        }
    }

    updateRiPPPrecursor(selectedText, fullText) {
        this.rippPrecursor = selectedText;
        this.rippFullPrecursor = fullText;
        console.log('RiPP Precursor updated:', this.rippPrecursor);
        console.log('Full RiPP Precursor sequence:', this.rippFullPrecursor);
    }

    setRiPPPrecursor(geneIndex) {
        this.rippPrecursorGene = geneIndex;
        console.log(`RiPP precursor set to gene at index ${geneIndex}`);

        // Fetch and display the gene sequence
        const geneSequence = this.getTranslation(geneIndex);
        uiHandler.displayRiPPPrecursorSequence(geneSequence);
    }

    createGeneMatrix() {
        let geneMatrix = [];
        for (let geneIndex = 0; geneIndex < this.BGC.orfs.length; geneIndex++) {
            let domains = this.processDomains(this.BGC.orfs[geneIndex]);
            let orfFunction = this.findFunctionOrf(this.BGC.orfs[geneIndex].description);
            let tailoringEnzymeStatus = this.findTailoringEnzymeStatus(orfFunction);

            geneMatrix.push(this.createGeneObject(this.BGC.orfs[geneIndex], domains, orfFunction, tailoringEnzymeStatus, geneIndex));
        }
        return this.addModulesGeneMatrix(geneMatrix);
    }

    processDomains(orf) {
        if (!orf.hasOwnProperty("domains")) return [];
        return JSON.parse(JSON.stringify(orf.domains)).map((domain, index) => ({
            ...domain,
            identifier: `${orf.locus_tag}_${index + 1}`,
            domainOptions: [],
            default_option: [],
            selected_option: [],
            ko: false
        }));
    }

    findFunctionOrf(orfDescription) {
        let positionBegin = orfDescription.search("\n \n") + 5;
        let positionEnd = orfDescription.search("Locus tag") - 14;
        return orfDescription.slice(positionBegin, positionEnd).toLowerCase();
    }

    findTailoringEnzymeStatus(orfFunction) {
        for (const [enzymeName, abbreviation] of Object.entries(TAILORING_ENZYMES)) {
            if (orfFunction.toUpperCase().replaceAll("-", "_").includes(enzymeName)) {
                return [true, enzymeName.trim(), abbreviation];
            }
        }
        for (const [mainEnzymeName, synonyms] of Object.entries(TAILORING_ENZYMES_SYNONYMS)) {
            if (synonyms.some(synonym => orfFunction.toUpperCase().replaceAll("-", "_").includes(synonym.toUpperCase()))) {
                return [true, mainEnzymeName.trim(), tailoringEnzymes[mainEnzymeName]];
            }
        }
        return [false, "", ""];
    }

    setRippPrecursor(geneIndex) {
        this.rippPrecursorGene = geneIndex;
        let translation = this.getTranslation(geneIndex);
        return translation;
    }

    addRiPP() {
        this.cluster_type = "ripp";
        this.geneMatrix[this.rippPrecursorGene].ripp_status = true;

        let translation = this.getTranslation(this.rippPrecursorGene);

        // Generate protease options
        let aminoacidsWithNumber = translation.split('').map((aa, index) => aa + (index + 1));
        this.proteaseOptions = aminoacidsWithNumber.map(aa => "Proteolytic cleavage at " + aa);
        this.rippPrecursor = this.rippPrecursor.length > 0 ? this.rippPrecursor : this.rippFullPrecursor.slice(-5);
        this.reloadGeneClusterForce()
    }
    
    getTranslation(geneIndex) {
        if (this.BGC.orfs[geneIndex].hasOwnProperty("translation")) {
            return this.BGC.orfs[geneIndex].translation;
        } else {
            let regExString = new RegExp("(?:QUERY=)((.[\\s\\S]*))(?:&amp;LINK_LOC)", "ig");
            let translationSearch = regExString.exec(this.BGC.orfs[geneIndex].description);
            return translationSearch[1];
        }
    }

    addTerpene(substrate) {
        this.cluster_type = "terpene";
        this.terpeneSubstrate = substrate;
        this.cyclization = [];
        this.terpeneCyclaseOptions = OptionCreator.createOptionsTerpeneCyclase([], { "METHYL_MUTASE": [], "DOUBLE_BOND_ISOMERASE": []})
    }

    changeCyclization(atom) {
        this.cyclization.push(atom)
        this.removeTailoringEnzymes();
        this.reloadGeneCluster();
    }

    changeDoubleBondIsomerization(atom) {
        if (atom.includes(",")) {
            atom = atom.split(",")
        }
        this.terpeneDoubleBondIsomerization.push(atom)
        this.removeTailoringEnzymes();
        this.reloadGeneCluster();
    }

    changeMethylShift(atom) {   
        if (atom.includes(",")) {
            atom = atom.split(",")
        }
        this.terpeneMethylShift.push(atom)
        this.removeTailoringEnzymes();
        this.reloadGeneCluster();
    }

    changeSelectedOptionTailoring( geneIndex, reactionOption, atomOption) {
        /**
        * Change the option in geneMatrix -> more than one option can be selected
    * @fires clickondomaindropdown
    *@input geneIndex,moduleIndex, domainIndex, option -> find the exact thing to change
    *@yield Selected option correct+ cyclization option correct.
    */
        let button = document.getElementById(geneIndex + "_" + reactionOption.replaceAll(" ", "_") + atomOption)
        if (atomOption.includes(",")) {
            atomOption = atomOption.split(",")
        }
        else {
            atomOption = [atomOption]
        }

        if (this.geneMatrix[geneIndex].selected_option[reactionOption].includes(atomOption)) {
            button.setAttribute("style", "background-color: white")
            var atomOptions = this.geneMatrix[geneIndex].selected_option[reactionOption].filter((item) => item !== atomOption);
            this.geneMatrix[geneIndex].selected_option[reactionOption] = atomOptions;
        }
        else {
            this.geneMatrix[geneIndex].selected_option[reactionOption].push(atomOption);
            button.setAttribute("style", "background-color: #E11839")
        }
        this.reloadGeneCluster();

    }

    changeSelectedOptionCleavageSites(option) {
        this.cleavageSites = [option]
        let cleavageNumber = parseInt(option.replace(/\D/g, ''));
        this.rippPrecursor = this.rippFullPrecursor.slice(-cleavageNumber);//
        this.removeTailoringEnzymes();
        this.reloadGeneCluster();
    }

    //TODO: put into uiHandler
    addArrowClick() {
        this.geneMatrix.forEach((gene, geneIndex) => {
            const elements = this.getGeneElements(gene);
            const originalColor = TYPE_COLORS[gene.type];

            this.setupArrowListeners(elements.arrow, gene, geneIndex, originalColor);
            this.setupProteinListeners(elements.protein, gene, geneIndex, originalColor);
            this.setupRippButtonListeners(elements.rippButton, gene, geneIndex, elements.arrow, originalColor);

            if (gene.displayed) {
                this.setupDisplayedGeneElements(gene, geneIndex, elements, originalColor);
            }
        });
    }

    getGeneElements(gene) {
        const getId = (suffix) => `#${gene.id.replace(".", "_")}${suffix}`;
        return {
            arrow: document.querySelector(getId("_gene_arrow")),
            protein: document.querySelector(getId("_protein")),
            rippButton: document.querySelector(getId("_ripp_button"))
        };
    }

    setupArrowListeners(arrow, gene, geneIndex, originalColor) {
        if (!arrow) return;

        const newArrow = arrow.cloneNode(true);
        arrow.parentNode.replaceChild(newArrow, arrow);

        newArrow.addEventListener('click', () => this.handleArrowClick(gene, newArrow, originalColor));
        newArrow.addEventListener('mouseenter', () => this.handleArrowMouseEnter(gene, newArrow, geneIndex));
        newArrow.addEventListener('mouseleave', () => this.handleArrowMouseLeave(gene, newArrow, geneIndex, originalColor));
    }

    setupProteinListeners(protein, gene, geneIndex, originalColor) {
        if (!protein) return;

        protein.addEventListener('click', () => this.handleProteinClick(gene, geneIndex, originalColor));
        protein.addEventListener('mouseenter', () => this.handleProteinMouseEnter(gene, geneIndex));
        protein.addEventListener('mouseleave', () => this.handleProteinMouseLeave(gene, geneIndex));
    }

    setupRippButtonListeners(rippButton, gene, geneIndex, arrow, originalColor) {
        if (!rippButton) return;

        rippButton.addEventListener('mouseenter', () => this.handleRippButtonMouseEnter(gene, arrow, geneIndex));
        rippButton.addEventListener('mouseleave', () => this.handleRippButtonMouseLeave(gene, arrow, geneIndex, originalColor));
    }

    setupDisplayedGeneElements(gene, geneIndex, elements, originalColor) {
        if (gene.tailoringEnzymeStatus) {
            this.setupTailoringEnzymeListeners(gene, geneIndex, elements);
        }

        if (this.cluster_type !== "ripp" && this.shouldSetupDomains(gene)) {
            this.setupDomainListeners(gene, geneIndex);
        }
    }

    shouldSetupDomains(gene) {
        return gene.modules || BIOSYNTHETIC_CORE_ENZYMES.includes(gene.orffunction) || gene.type == "biosynthetic";
    }

    setupTailoringEnzymeListeners(gene, geneIndex, elements) {
        const tailoringEnzyme = document.querySelector(`#tailoringEnzyme_${gene.id.replace(".", "_")}`);
        if (!tailoringEnzyme) return;

        const mouseEnterHandler = () => this.handleTailoringEnzymeMouseEnter(gene, geneIndex);
        const mouseLeaveHandler = () => this.handleTailoringEnzymeMouseLeave(gene, geneIndex);

        elements.arrow.addEventListener('mouseenter', mouseEnterHandler);
        elements.arrow.addEventListener('mouseleave', mouseLeaveHandler);
        elements.protein.addEventListener('mouseenter', mouseEnterHandler);
        elements.protein.addEventListener('mouseleave', mouseLeaveHandler);
        tailoringEnzyme.addEventListener('mouseenter', mouseEnterHandler);
        tailoringEnzyme.addEventListener('mouseleave', mouseLeaveHandler);
    }

    setupDomainListeners(gene, geneIndex) {
        gene.domains.forEach((domain, domainIndex) => {
            const domainElements = this.getDomainElements(gene, domain);
            this.addDomainListeners(domainElements, gene, geneIndex, domainIndex);
        });
    }

    getDomainElements(gene, domain) {
        const getId = (suffix) => `#${gene.id.replace(".", "_")}${suffix}`;
        return {
            domain: document.querySelector(`#domain${domain.identifier.replace(".", "_")}`),
            domain2: document.querySelector(getId(`_domain_${domain.sequence}`))
        };
    }

    addDomainListeners(elements, gene, geneIndex, domainIndex) {
        const { domain, domain2 } = elements;
        if (!domain || !domain2) return;

        const originalColor = getComputedStyle(domain).fill;
        const originalColor2 = getComputedStyle(domain2).fill;

        const clickHandler = () => this.handleDomainClick(gene, geneIndex, domainIndex, domain, domain2, originalColor, originalColor2);
        const mouseEnterHandler = () => this.handleDomainMouseEnter(gene, domainIndex, domain, domain2);
        const mouseLeaveHandler = () => this.handleDomainMouseLeave(gene, domainIndex, domain, domain2, originalColor, originalColor2);

        domain.addEventListener('click', clickHandler);
        domain.addEventListener('mouseenter', mouseEnterHandler);
        domain.addEventListener('mouseleave', mouseLeaveHandler);

        domain2.addEventListener('click', clickHandler);
        domain2.addEventListener('mouseenter', mouseEnterHandler);
        domain2.addEventListener('mouseleave', mouseLeaveHandler);
    }

    // Event handlers
    handleArrowClick(gene, arrow, originalColor) {
        this.setDisplayedStatus(gene.id);
        this.removeTailoringEnzymes();
        arrow.style.fill = gene.ko ? "#E11839" : originalColor;
        this.reloadGeneCluster();

    }

    handleArrowMouseEnter(gene, arrow, geneIndex) {
        uiHandler.displayTextInGeneExplorer(gene.id, this.BGC);
        uiHandler.changeProteinColorON(`#${gene.id.replace(".", "_")}_protein`, geneIndex);
        if (!gene.ko) {
            arrow.style.fill = "#E11839";
        }
    }

    handleArrowMouseLeave(gene, arrow, geneIndex, originalColor) {
        uiHandler.changeProteinColorOFF(`#${gene.id.replace(".", "_")}_protein`, geneIndex);
        if (!gene.ko) {
            arrow.style.fill = originalColor;
        }
    }

    handleProteinClick(gene, geneIndex, originalColor) {
        this.handleArrowClick(gene, document.querySelector(`#${gene.id.replace(".", "_")}_gene_arrow`), originalColor);
    }

    handleProteinMouseEnter(gene, geneIndex) {
        uiHandler.displayTextInGeneExplorer(gene.id, this.BGC);
        uiHandler.changeProteinColorON(`#${gene.id.replace(".", "_")}_gene_arrow`, geneIndex);
    }

    handleProteinMouseLeave(gene, geneIndex) {
        uiHandler.changeProteinColorOFF(`#${gene.id.replace(".", "_")}_gene_arrow`, geneIndex);
    }

    handleRippButtonMouseEnter(gene, arrow, geneIndex) {
        uiHandler.displayTextInGeneExplorer(gene.id, this.BGC);
        uiHandler.changeProteinColorON(`#${gene.id.replace(".", "_")}_protein`, geneIndex);
        if (!gene.ko) {
            arrow.style.fill = "#E11839";
        }
    }

    handleRippButtonMouseLeave(gene, arrow, geneIndex, originalColor) {
        uiHandler.changeProteinColorOFF(`#${gene.id.replace(".", "_")}_protein`, geneIndex);
        if (!gene.ko) {
            arrow.style.fill = originalColor;
        }
    }

    handleTailoringEnzymeMouseEnter(gene, geneIndex) {
        uiHandler.displayTextInGeneExplorer(gene.id, this.BGC);
        uiHandler.changeProteinColorON(`#${gene.id.replace(".", "_")}_gene_arrow`, geneIndex);
        uiHandler.changeProteinColorON(`#${gene.id.replace(".", "_")}_protein`, geneIndex);
    }

    handleTailoringEnzymeMouseLeave(gene, geneIndex) {
        uiHandler.changeProteinColorOFF(`#${gene.id.replace(".", "_")}_gene_arrow`, geneIndex);
        uiHandler.changeProteinColorOFF(`#${gene.id.replace(".", "_")}_protein`, geneIndex);
    }

    handleDomainClick(gene, geneIndex, domainIndex, domain, domain2, originalColor, originalColor2) {
        const isKo = gene.domains[domainIndex].ko;
        const newColor = isKo ? originalColor : "#E11839";
        domain.style.fill = newColor;
        domain2.style.fill = newColor;
        this.setKoStatus(geneIndex, domainIndex);
        this.addArrowClick(); // Re-initialize to update all elements
    }

    handleDomainMouseEnter(gene, geneIndex, domain, domain2) {
        if (!gene.domains[geneIndex].ko) {
            domain.style.fill = "#E11839";
            domain2.style.fill = "#E11839";
        }
        uiHandler.displayTextInGeneExplorer(gene.id, this.BGC);
        uiHandler.changeProteinColorON(`#${gene.id.replace(".", "_")}_protein`, geneIndex);
        uiHandler.changeProteinColorON(`#${gene.id.replace(".", "_")}_gene_arrow`, geneIndex);
    }

    handleDomainMouseLeave(gene, geneIndex, domain, domain2, originalColor, originalColor2) {
        if (!gene.domains[geneIndex].ko) {
            domain.style.fill = originalColor;
            domain2.style.fill = originalColor2;
        }
        uiHandler.changeProteinColorOFF(`#${gene.id.replace(".", "_")}_gene_arrow`, geneIndex);
        uiHandler.changeProteinColorOFF(`#${gene.id.replace(".", "_")}_protein`, geneIndex);
    }

    toggleKoStatus(geneIndex, domainIndex) {
    /**
    * Knocks out domains.
   * @fires clickondomain
   *@input geneIndex, domainIndex-> indices
   *@yield changes status in gene matrix + if the real time calculation is checked also fetch from raichu to update structures
   */
        if (this.geneMatrix[geneIndex].domains[domainIndex].ko === false || this.geneMatrix[geneIndex].domains[domainIndex].ko == "") {
        this.geneMatrix[geneIndex].domains[domainIndex].ko = true;
    }
    else {
        this.geneMatrix[geneIndex].domains[domainIndex].ko = false;
    }}

    setKoStatus(geneIndex, domainIndex) {
        this.toggleKoStatus(geneIndex, domainIndex);
        this.removeTailoringEnzymes();
        this.reloadGeneCluster();

    }

    setDisplayedStatus(id) {
        this.toggleDisplayedStatus(id);
    }

    toggleDisplayedStatus(id) {
        /**
         * Toggles the displayed status and knockout (ko) status for a gene and its corresponding ORF.
         * @fires clickongene
         * @input id of gene, gene matrix
         * @yield Updates gene matrix status and optionally fetches updates from Raichu if real-time calculation is enabled.
         */


        // Update geneMatrix
        for (let gene of this.geneMatrix) {
            if (gene.id === id) {
                gene.displayed = !gene.displayed;
                gene.ko = !gene.ko;
                break; // Exit loop once match is found
            }
        }

        // Update BGC orfs
        for (let orf of this.BGC.orfs) {
            if (orf.locus_tag === id) {
                orf.ko = !(orf.ko ?? false); // Ensures proper toggling even if orf.ko doesn't exist
                break; // Exit loop once match is found
            }
        }
    }




    findTailoringReactions() {
    /**
   * Format an array of all tailoring Arrays of a gene cluster -> just formats all genes already annotated as tailoring enzymes.
   * @fires   fetchFromRaichu, fetchFromRaichuRiPP, fetchFromRaichuTerpene
   * @input geneMatrix
   * @output array of all tayloring enzymes and their corresponding genes
   */
    let tailoringArray = []
    for (let geneIndex = 0; geneIndex < this.geneMatrix.length; geneIndex++) {
        let enzymeType = this.geneMatrix[geneIndex].tailoringEnzymeType
        if (this.geneMatrix[geneIndex].tailoringEnzymeStatus == false) {
            continue
        }
        for (var [firstparameter, atoms] of Object.entries(this.geneMatrix[geneIndex].selected_option)) {
            let enzymeReactionArray;
            let substrate = "None";
            let enzymeNameReaction;
            if (TAILORING_ENZYMES_WITH_SUBSTRATE.includes(enzymeType)) {
                substrate = firstparameter
                enzymeNameReaction = enzymeType
            }
            else {
                enzymeNameReaction = firstparameter
            }
            // put atoms for bond formation in pairs
            if (TAILORING_ENZYMES_WITH_TWO_ATOMS.includes(enzymeNameReaction)) {
                atoms = atoms.flat(1)
                if (atoms.length % 2 == 1) {
                    atoms.pop()
                }
                let pairedAtoms = [];
                while (atoms.length) pairedAtoms.push(atoms.splice(0, 2));
                atoms = pairedAtoms
            }
            if (tailoringArray.length > 0) {
                for (const enzyme of tailoringArray) {
                    enzymeReactionArray = enzyme.find(item => item.name === enzymeNameReaction)
                    if (enzymeReactionArray) break
                }
            }
            if (enzymeReactionArray) {
                if (atoms.length > 0) {
                    enzymeReactionArray[1].push(atoms);
                }
            }

            else {
                if (atoms.length > 0) {
                    tailoringArray.push([this.geneMatrix[geneIndex].id, enzymeNameReaction, atoms, substrate]);
                }
            }
        }
    }
    this.tailoringArray = tailoringArray
    return tailoringArray
}

    createGeneObject(orf, domains, orfFunction, tailoringEnzymeStatus, geneIndex) {
        return {
            id: orf.locus_tag,
            index: geneIndex,
            orffunction: orfFunction,
            tailoringEnzymeStatus: tailoringEnzymeStatus[0],
            tailoringEnzymeType: tailoringEnzymeStatus[1],
            tailoringEnzymeAbbreviation: tailoringEnzymeStatus[2],
            position_in_BGC: geneIndex + 1,
            position: geneIndex + 1,
            ko: false,
            displayed: true,
            default_option: [],
            selected_option: [],
            options: [],
            ripp_status: false,
            domains: domains,
            type: orf.type
        };
    }

    addModulesGeneMatrix(geneMatrix) {
        let region = this.details_data.hasOwnProperty("nrpspks") ? this.details_data.nrpspks[this.regionName] : this.details_data[this.regionName];

        if (region) {
            geneMatrix.forEach((gene, geneIndex) => {
                let orf = region.orfs.find(orf => orf.id === gene.id);
                if (orf && orf.hasOwnProperty("modules")) {
                    gene.modules = JSON.parse(JSON.stringify(orf.modules)).map((module, moduleIndex) => {
                        let nameModule = `${gene.id}_${moduleIndex}`;
                        module.moduleIdentifier = nameModule;

                        if (gene.hasOwnProperty("domains")) {
                            let domainArray = gene.domains.filter(domain =>
                                (module.end >= domain.start && domain.start >= module.start) ||
                                (module.start >= domain.start && domain.start >= module.end) ||
                                (moduleIndex === orf.modules.length - 1 && !domain.hasOwnProperty("module"))
                            );

                            domainArray.forEach(domain => domain.module = nameModule);

                            module.domains = domainArray;
                            module.numberOfDomains = domainArray.length;
                            module.lengthVisualisation = 0;
                        }

                        return module;
                    });
                }
            });
        }
        else{
            console.log("No region found in details data", geneMatrix);
        }

        return geneMatrix;
    }

    createWildcardGene(wildcardModule, wildcardSubstrate) {
        let endLastGene = this.BGC.orfs.length > 0 ? this.BGC.orfs[this.BGC.orfs.length - 1].end : 0;
        let nameWildcardModule = `Custom_gene_${this.BGC.orfs.length + 1}`;

        let domains = this.createWildcardDomains(wildcardModule, wildcardSubstrate, nameWildcardModule);

        let newGene = {
            antismashArray: domains.domainArray,
            default_option: [],
            start: endLastGene,
            end: endLastGene + 7254,
            locus_tag: nameWildcardModule,
            displayed: true,
            type: "biosynthetic",
            domains: domains.longDomainArray,
            strand: 1,
            description: "Custom Gene",
            id: nameWildcardModule,
            ko: false,
            options: [],
            position: this.BGC.orfs.length + 1,
            position_in_BGC: this.BGC.orfs.length + 1,
            selected_option: [],
            modules: [{
                start: 1,
                end: 4000,
                complete: true,
                iterative: false,
                monomer: wildcardSubstrate,
                moduleIdentifier: `${nameWildcardModule}_0`,
                domains: domains.longDomainArray,
                numberOfDomains: domains.domainArray.length,
                lengthVisualisation: 0
            }]
        };

        this.BGC.orfs.push(newGene);
        this.geneMatrix.push(this.createGeneObject(newGene, domains.longDomainArray, "Custom Gene", [false, "", ""], this.BGC.orfs.length - 1));
        this.updateDetailsData(newGene);
        this.reloadGeneCluster();

        return newGene;
    }

    createWildcardTailoringGene(wildcardEnzyme) {
        let endLastGene = this.BGC.orfs.length > 0 ? this.BGC.orfs[this.BGC.orfs.length - 1].end : 0;
        let nameWildcardEnzyme = `Custom_tailoring_gene_${this.BGC.orfs.length + 1}`;

        let newGene = {
            antismashArray: [],
            default_option: [],
            start: endLastGene,
            end: endLastGene + 900,
            locus_tag: nameWildcardEnzyme,
            displayed: true,
            tailoringEnzymeStatus: true,
            tailoringEnzymeType: wildcardEnzyme,
            tailoringEnzymeAbbreviation: TAILORING_ENZYMES[wildcardEnzyme],
            orffunction: wildcardEnzyme,
            type: "",
            domains: [],
            strand: 1,
            description: "Custom Gene",
            id: nameWildcardEnzyme,
            ko: false,
            options: [],
            position: this.BGC.orfs.length + 1,
            position_in_BGC: this.BGC.orfs.length + 1,
            selected_option: [],
            modules: []
        };

        this.BGC.orfs.push(newGene);
        this.geneMatrix.push(this.createGeneObject(newGene, [], wildcardEnzyme, [true, wildcardEnzyme, TAILORING_ENZYMES[wildcardEnzyme]], this.BGC.orfs.length - 1));
        this.updateDetailsData(newGene);
        this.reloadGeneCluster();

        return newGene;
    }

    createWildcardDomains(wildcardModule, wildcardSubstrate, nameWildcardModule) {
        let domainArray = [];
        let longDomainArray = [];

        const defaultDomains = {
            C: this.createDefaultCDomain(nameWildcardModule),
            A: this.createDefaultADomain(wildcardSubstrate, nameWildcardModule),
            PCP: this.createDefaultPCPDomain(nameWildcardModule),
            ACP: this.createDefaultACPDomain(nameWildcardModule),
            TE: this.createDefaultTEDomain(nameWildcardModule),
            E: this.createDefaultEDomain(nameWildcardModule),
            ER: this.createDefaultERDomain(nameWildcardModule),
            KR: this.createDefaultKRDomain(nameWildcardModule),
            AT: this.createDefaultATDomain(wildcardSubstrate, nameWildcardModule),
            KS: this.createDefaultKSDomain(nameWildcardModule),
            DH: this.createDefaultDHDomain(nameWildcardModule)
        };

        const pushDomain = (domain) => {
            domainArray.push(domain);
            longDomainArray.push(defaultDomains[domain]);
        };

        switch (wildcardModule) {
            case "starter_module_nrps":
                pushDomain('A');
                pushDomain('PCP');
                break;
            case "elongation_module_nrps":
                pushDomain('C');
                pushDomain('A');
                if (document.getElementById("wildcardE").checked) {
                    pushDomain('E');
                }
                pushDomain('PCP');
                break;
            case "terminator_module_nrps":
                pushDomain('C');
                pushDomain('A');
                if (document.getElementById("wildcardE").checked) {
                    pushDomain('E');
                }
                pushDomain('PCP');
                pushDomain('TE');
                break;
            case "starter_module_pks":
                pushDomain('AT');
                pushDomain('ACP');
                break;
            case "elongation_module_pks":
            case "terminator_module_pks":
                pushDomain('KS');
                pushDomain('AT');
                if (document.getElementById("wildcardKR").checked) {
                    pushDomain('KR');
                    if (document.getElementById("wildcardDH").checked) {
                        pushDomain('DH');
                        if (document.getElementById("wildcardER").checked) {
                            pushDomain('ER');
                        }
                    }
                }
                pushDomain('ACP');
                if (wildcardModule === "terminator_module_pks") {
                    pushDomain('TE');
                }
                break;
        }

        return { domainArray, longDomainArray };
    }


    createDefaultCDomain(nameWildcardModule) {
        return this.createDefaultDomain("Condensation", "C", nameWildcardModule, 4, 302);
    }

    createDefaultADomain(wildcardSubstrate, nameWildcardModule) {
        let domain = this.createDefaultDomain("AMP-binding", "A", nameWildcardModule, 465, 867);
        domain.predictions = [["consensus", Object.keys(AMINO_ACIDS).find(key => AMINO_ACIDS[key] === wildcardSubstrate)]];
        domain.domainOptions = Object.values(AMINO_ACIDS);
        domain.default_option = wildcardSubstrate;
        domain.substrate = wildcardSubstrate;
        return domain;
    }

    createDefaultPCPDomain(nameWildcardModule) {
        return this.createDefaultDomain("PCP", "PCP", nameWildcardModule, 976, 1045);
    }

    createDefaultACPDomain(nameWildcardModule) {
        return this.createDefaultDomain("ACP", "ACP", nameWildcardModule, 2200, 2300);
    }

    createDefaultTEDomain(nameWildcardModule) {
        let domain = this.createDefaultDomain("Thioesterase", "TE", nameWildcardModule, 2350, 2550);
        return domain;
    }

    createDefaultEDomain(nameWildcardModule) {
        return this.createDefaultDomain("Epimerization", "E", nameWildcardModule, 3122, 3421);
    }

    createDefaultERDomain(nameWildcardModule) {
        return this.createDefaultDomain("PKS_ER", "ER", nameWildcardModule, 1800, 2100);
    }

    createDefaultKRDomain(nameWildcardModule) {
        let domain = this.createDefaultDomain("PKS_KR", "KR", nameWildcardModule, 1000, 1300);
        domain.predictions = [["KR activity", "active"], ["KR stereochemistry", "B2"]];
        domain.domainOptions = ["A1", "A2", "B1", "B2", "C1", "C2"];
        domain.default_option = "A1";
        return domain;
    }

    createDefaultATDomain(wildcardSubstrate, nameWildcardModule) {
        let domain = this.createDefaultDomain("PKS_AT", "AT", nameWildcardModule, 110, 404);
        domain.predictions = [["consensus", "pk"], ["PKS signature", wildcardSubstrate], ["Minowa", "prop"]];
        domain.domainOptions = PKS_SUBSTRATES;
        domain.default_option = wildcardSubstrate;
        domain.substrate = wildcardSubstrate;
        return domain;
    }

    createDefaultKSDomain(nameWildcardModule) {
        return this.createDefaultDomain("PKS_KS(Modular-KS)", "KS", nameWildcardModule, 559, 983);
    }

    createDefaultDHDomain(nameWildcardModule) {
        return this.createDefaultDomain("PKS_DH", "DH", nameWildcardModule, 1400, 1700);
    }

    createDefaultDomain(type, abbreviation, nameWildcardModule, start, end) {
        return {
            type: type,
            start: start,
            end: end,
            predictions: [],
            napdoslink: "",
            blastlink: "",
            sequence: "",
            dna_sequence: "",
            abbreviation: abbreviation,
            html_class: `jsdomain-${abbreviation.toLowerCase()}`,
            identifier: `${nameWildcardModule}_${abbreviation}`,
            domainOptions: [],
            default_option: [],
            selected_option: [],
            ko: false,
            module: nameWildcardModule,
            function: abbreviation
        };
    }

    updateDetailsData(wildcard_gene) {
        if (this.cluster_type !== "nrpspks") {
            return;
        }
        if (this.details_data.hasOwnProperty("nrpspks")) {
            this.details_data["nrpspks"][this.regionName].orfs.push(wildcard_gene);
        } else {
            this.details_data[this.regionName].orfs.push(wildcard_gene);
        }
    }

    getTranslation(geneIndex) {
        if (this.BGC.orfs[geneIndex].hasOwnProperty("translation")) {
            return this.BGC.orfs[geneIndex].translation;
        } else {
            let regExString = new RegExp("(?:QUERY=)((.[\\s\\S]*))(?:&amp;LINK_LOC)", "ig");
            let translationSearch = regExString.exec(this.BGC.orfs[geneIndex].description);
            return translationSearch[1];
        }
    }

    generateRiPPOptions(translation) {
        let aminoacidsWithNumber = translation.split('').map((aa, index) => aa + (index + 1));
        return aminoacidsWithNumber.map(aa => "Proteolytic cleavage at " + aa);
    }

    getGeneMatrix() {
        return this.geneMatrix;
    }

    getBGC() {
        return this.BGC;
    }

    getDetailsData() {
        return this.details_data;
    }

    getRegionName() {
        return this.regionName;
    }

    getClusterType() {
        return this.cluster_type;
    }

    getACPList() {
        let acpList = [];
        for (let geneIndex = 0; geneIndex < this.geneMatrix.length; geneIndex++) {
            if (this.geneMatrix[geneIndex].ko == false && this.geneMatrix[geneIndex].domains.length != 0 &&
                (BIOSYNTHETIC_CORE_ENZYMES.includes(this.geneMatrix[geneIndex].orffunction) ||
                this.geneMatrix[geneIndex].type == "biosynthetic")) {
                for (let domainIndex = 0; domainIndex < this.geneMatrix[geneIndex].domains.length; domainIndex++) {
                    if (this.geneMatrix[geneIndex].domains[domainIndex].ko == false || this.geneMatrix[geneIndex].domains[domainIndex].ko == "None") {
                        if ((this.geneMatrix[geneIndex].domains[domainIndex].type.includes("ACP") ||
                            this.geneMatrix[geneIndex].domains[domainIndex].type.includes("PP") ||
                            this.geneMatrix[geneIndex].domains[domainIndex].type.includes("PCP")) &&
                            !(this.geneMatrix[geneIndex].domains[domainIndex].type.includes("ACPS"))) {
                            acpList.push(this.geneMatrix[geneIndex].domains[domainIndex].identifier);
                        }
                    }
                }
            }
        }
        return acpList;
    }

    extractAntismashPredictionsFromRegion() {
        let antismashExtractor = new AntismashExtractor(this.details_data, this.regionName, this.geneMatrix);
        const [outputForRaichu, starterACP, updatedGeneMatrix] = antismashExtractor.extractAntismashPredictions();
        if (outputForRaichu.length == 0) {
            return null
        }
        this.moduleMatrix = antismashExtractor.moduleMatrix;
        this.geneMatrix = updatedGeneMatrix;
        this.starterACP = starterACP;

        return [outputForRaichu, starterACP]
    }

    removeTailoringEnzymes() {
    /**
     * Set the selected_option property of each gene in the geneMatrix to an empty array
     * only if the tailoringEnzymeStatus is true.
     * @input geneMatrix
     */
    for (let geneIndex = 0; geneIndex < this.geneMatrix.length; geneIndex++) {
        if (this.geneMatrix[geneIndex].tailoringEnzymeStatus === true) {
            this.geneMatrix[geneIndex].selected_option = [];
        }
    }}

    changeSelectedOption(geneIndex, moduleIndex, domainIndex, option, optionIndex) {
            /**
            * Change the option in geneMatrix.
           * @fires clickondomaindropdown
           *@input geneMatrix, geneIndex,moduleIndex, domainIndex, option -> find the exact thing to change
           *@yield Selected option correct+ cyclization option correct.
           */
            this.geneMatrix[geneIndex].modules[
                moduleIndex].domains[
                domainIndex].selected_option = option
            $('[id^=\x22' + geneIndex + '_' + moduleIndex + '_' + domainIndex + '\x22]').removeAttr('style');
            let button = document.getElementById(geneIndex + '_' + moduleIndex + '_' + domainIndex + "_" + optionIndex)
            button.setAttribute("style", "background-color: #E11839")
        if (this.geneMatrix[geneIndex].modules[
                moduleIndex].domains[
                domainIndex].abbreviation.includes("TE")) {
                if (option == "Linear product") {
                    this.cyclization = "None"
                }
                else { this.cyclization = option }

            }
            this.removeTailoringEnzymes();
            this.reloadGeneCluster();
            /// todo: set all tailoring options + cyclization option to empty + cleavage options -> to default
        }

    handleGenePositionUpdate(locusTagDragged, locusTagTarget) {
        this.geneMatrix.sort((a, b) => a.position - b.position);

        let positionDragged, geneIndexDragged, positionTarget, geneIndexTarget;

        for (let geneIndex = 0; geneIndex < this.geneMatrix.length; geneIndex++) {
            if (this.geneMatrix[geneIndex].id == locusTagDragged) {
                positionDragged = this.geneMatrix[geneIndex].position;
                geneIndexDragged = geneIndex;
            }
            if (this.geneMatrix[geneIndex].id == locusTagTarget) {
                positionTarget = this.geneMatrix[geneIndex].position;
                geneIndexTarget = geneIndex;
            }
        }

        if (positionTarget > positionDragged) {
            for (let geneIndex = 0; geneIndex < this.geneMatrix.length; geneIndex++) {
                if (this.geneMatrix[geneIndex].position >= positionDragged &&
                    this.geneMatrix[geneIndex].position <= positionTarget) {
                    this.geneMatrix[geneIndex].position -= 1;
                }
            }
            this.geneMatrix[geneIndexDragged].position = positionTarget;
        } else if (positionTarget < positionDragged) {
            for (let geneIndex = 0; geneIndex < this.geneMatrix.length; geneIndex++) {
                if (this.geneMatrix[geneIndex].position <= positionDragged &&
                    this.geneMatrix[geneIndex].position >= positionTarget) {
                    this.geneMatrix[geneIndex].position += 1;
                }
            }
            this.geneMatrix[geneIndexDragged].position = positionTarget;
        }

        this.geneMatrix.sort((a, b) => a.position - b.position);
    }

    async reloadGeneCluster() {
        if (document.querySelector('input[type=checkbox]')
            .checked) {
            this.reloadGeneClusterForce();
        }
    }

    async reloadGeneClusterForce() {
            this.tailoringArray = this.findTailoringReactions();
            uiHandler.updateUI(this);
            let raichu_output = await apiService.fetchFromRaichu(this);
            uiHandler.updateUI(this);
            if (this.cluster_type === "nrpspks") {
                svgHandler.updateIntermediates(raichu_output, this, this.starterACP);
            }
        if (this.cluster_type === "terpene") {
            if (document.getElementById("innerIntermediateContainer_tailoredProduct")) {
                svgHandler.updateIntermediateContainer("innerIntermediateContainer_cyclizedProduct", raichu_output.cyclizedStructure, "intermediate_drawing_cyclisation_terpene", "cyclized_drawing");
                svgHandler.updateIntermediateContainer("innerIntermediateContainer_precursor", raichu_output.precursor, "intermediate_drawing_precursor_terpene", "precursor_drawing");
                svgHandler.updateIntermediateContainer("innerIntermediateContainer_tailoredProduct", raichu_output.structureForTailoring, "intermediate_drawing_tailoring_terpene");
            }
        }
        if (this.cluster_type === "ripp") {
            if (document.getElementById("innerIntermediateContainer_tailoredProduct")) {
                svgHandler.updateIntermediateContainer("innerIntermediateContainer_tailoredProduct", raichu_output.structureForTailoring, "intermediate_drawing_tailoring_ripp");
                svgHandler.updateIntermediateContainer("innerIntermediateContainer_precursor", raichu_output.rawPeptideChain, "intermediate_drawing_precursor", "precursor_drawing");
                if (document.getElementById("wildcardProtease").checked) {
                    svgHandler.updateIntermediateContainer("innerIntermediateContainer_cleavedProduct_space", raichu_output.svg, "intermediate_drawing_cleavage", "cleavedProduct");
                }
            }
        }

            uiHandler.addDragDrop(
            );
            this.updateHistory(this.geneMatrix, this.BGC);
    }

    addUndoRedoListeners() {
        const buttonConfigs = [
            { id: 'undoButton', handler: () => this.undo() },
            { id: 'redoButton', handler: () => this.redo() }
        ];

        buttonConfigs.forEach(config => {
            const button = document.getElementById(config.id);
            if (button) {
                // Remove old listeners and replace with a new button
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);

                // Add new listener
                newButton.addEventListener('click', config.handler);
            } else {
                console.warn(`${config.id} not found`);
            }
        });
    }

    updateHistory() {
        this.historyStack.push({
            geneMatrix: JSON.parse(JSON.stringify(this.geneMatrix)),
            BGC: JSON.parse(JSON.stringify(this.BGC))
        });
        this.historyStack.updateButtonStates();
    }

    async undo() {
        const previousState = this.historyStack.undo();
        if (previousState) {
            this.geneMatrix = previousState.geneMatrix;
            this.BGC = previousState.BGC;
            this.reloadGeneClusterForce();
        }
        this.historyStack.updateButtonStates();
    }

    async redo() {
        const nextState = this.historyStack.redo();
        if (nextState) {
            this.geneMatrix = nextState.geneMatrix;
            this.BGC = nextState.BGC;
            this.reloadGeneClusterForce();
        }
        this.historyStack.updateButtonStates();
    }

}

class HistoryStack {
    constructor() {
        this.undoStack = [];
        this.redoStack = [];
        this.is_undo = false;
        this.updateButtonStates();
    }

    push(state) {
        if (!this.is_undo) {
            this.redoStack = []; // Clear redo stack when a new action is performed
        }
        this.undoStack.push(JSON.parse(JSON.stringify(state)));
        this.is_undo = false;
    }

    undo() {
        if (this.undoStack.length > 1) {
            const currentState = this.undoStack.pop();
            const previousState = this.undoStack.pop();
            this.redoStack.push(currentState);
            this.is_undo = true;
            return previousState;
        }
        return null;
    }

    redo() {
        if (this.redoStack.length > 0) {
            const state = this.redoStack.pop();
            this.is_undo = true; 
            return state;
        }
        return null;
    }

    canUndo() {
        return this.undoStack.length > 1;
    }

    canRedo() {
        return this.redoStack.length > 0;
    }

    updateButtonStates() {
        const undoButton = document.getElementById('undoButton');
        const redoButton = document.getElementById('redoButton');
        if (!this.canUndo()) {
            undoButton.setAttribute('data-tooltip', 'No job to revert!');
            undoButton.classList.add('disabled');
        } else {
            undoButton.setAttribute('data-tooltip', 'Click to revert your last action.');
            undoButton.classList.remove('disabled');
        }
        if (!this.canRedo()) {
            redoButton.setAttribute('data-tooltip', 'No job to reapply!');
            redoButton.classList.add('disabled');
        } else {
            redoButton.setAttribute('data-tooltip', 'Click to reapply an action you have undone.');
            redoButton.classList.remove('disabled');
        }
    }
}

class ClusterTypeHandler {
    getClusterType(regionIndex, recordIndex, recordData) {
        let type = recordData[recordIndex].regions[regionIndex].type;
        if (type.includes("PKS") || type.includes("NRPS") || type.includes("Fatty_acid")) {
            return "nrpspks";
        }
        if (type.includes("Terpene") || type.includes("terpene")) {
            return "terpene";
        }
        if (type.includes("peptide")) {
            return "peptide";
        }
        if (type === "ripp") {
            return "ripp";
        }
        return "misc";
    }
}

class RegionHandler {
    getFirstRegion(recordData) {
        for (let recordIndex = 0; recordIndex < recordData.length; recordIndex++) {
            if (recordData[recordIndex].regions.length > 0) {
                return [0, recordIndex];
            }
        }
        return [0, 0];
    }

    selectRegion(recordData, regionName) {
        /**
        * Select the index of region from name
       * @fires fetchFromRaichu
       *@input name of region
       *@output index of region
       */
        let record_index = 0
        for (const record of recordData) {

            for (let region_index = 0; region_index < record.regions.length; region_index++) {
                if (record.regions[region_index].anchor == regionName) {
                    return [region_index, record_index]
                }
            }
            record_index++
        }
    }

    getRegionName(regionIndex, recordIndex, recordData) {
        return recordData[recordIndex].regions[regionIndex].anchor;
    }

    getBGC(recordIndex, regionIndex, recordData, details_data) {
        let BGC = {
            start: recordData[recordIndex].regions[regionIndex].start,
            end: recordData[recordIndex].regions[regionIndex].end,
            orfs: JSON.parse(JSON.stringify(recordData[recordIndex].regions[regionIndex].orfs))
        };

        let regionName = this.getRegionName(regionIndex, recordIndex, recordData);
        let regionData = details_data.hasOwnProperty("nrpspks") ? details_data.nrpspks[regionName] : details_data[regionName];

        if (regionData) {
            BGC.orfs.forEach(orf => {
                let detailedOrf = regionData.orfs.find(o => o.id === orf.locus_tag);
                if (detailedOrf) {
                    orf.domains = detailedOrf.domains;
                }
            });
        }

        return BGC;
    }

    getReversedBGC(regionIndex, recordIndex, details_data, recordData) {
        let BGC = this.getBGC(regionIndex, recordIndex, recordData, details_data);

        BGC.orfs = BGC.orfs.map(orf => {
            let newStart = BGC.end - orf.end + BGC.start;
            let newEnd = BGC.end - orf.start + BGC.start;
            let newStrand = -orf.strand;

            return { ...orf, start: newStart, end: newEnd, strand: newStrand };
        }).reverse();

        return BGC;
    }

    


}

class AntismashExtractor {
    constructor(details_data, regionName, geneMatrix) {
        this.details_data = details_data;
        this.regionName= regionName;
        this.geneMatrix = geneMatrix;
        this.moduleMatrix = [];
    }

    //TODO: rework function
    extractAntismashPredictions() {
    /**
    * extract the information and predictions from region.js+ combines this information with geneMatrix
   * @fires fetchFromRaichu
   *@input details_data -> from region.js input, regionIndex,
       geneMatrix
   *@output formatted data for Raichu/Backend
   */
    let outputForRaichu = [];
    console.log("Region Index:", this.regionName);
    let region = [];
    this.geneMatrix.modules = [];
        if (this.details_data.hasOwnProperty("nrpspks")) {
        region = this.details_data.nrpspks[this.regionName];
    }
    else {
        region = this.details_data[this.regionName];
    }
        if (!region) {
            console.log("Region not found for index:", this.regionName);
            return [outputForRaichu, 1]; // Return empty output and default starterACP
        }
    this.geneMatrix.sort((a, b) => {
        return a.position - b.position;
    });
    let moduleMatrix = []
    let acpCounter = 0;
    let starterACP = 1;
    let substrate = "";
    let domainArray = [];
    let typesInModule = [];
    let domains = []
    let moduleType = "PKS";
    let moduleSubtype = "PKS_TRANS";
    let moduleIndex = 0;
    for (let geneIndex = 0; geneIndex < this.geneMatrix.length; geneIndex++) {
        if (this.geneMatrix[geneIndex].ko == false && (BIOSYNTHETIC_CORE_ENZYMES.includes(this.geneMatrix[geneIndex].orffunction) || this.geneMatrix[geneIndex].type == "biosynthetic")) {
            for (let orfIndex = 0; orfIndex < region.orfs.length; orfIndex++) {
                let orf = region.orfs[orfIndex];
                if (this.geneMatrix[geneIndex].id == orf.id) {
                    // acp stat helps connecting modules that are within the same module but on different genes

                    for (let domainIndex = 0; domainIndex < orf.domains.length; domainIndex++) {
                        let domain = orf.domains[domainIndex];
                        if (!(this.geneMatrix[geneIndex].domains[domainIndex].ko ==
                            false || this.geneMatrix[geneIndex].domains[domainIndex].ko == "None")) {
                            domains.push(domain.type)
                        }
                        else {

                            let active = "True";
                            let used = "True";
                            let gene = orf.id;
                            let type = "None";
                            let subtype = "None";
                            type = domain.abbreviation;
                            if (domain.abbreviation == "") {
                                type = domain.type;
                            }
                            if (domain.type == "Heterocyclization") {
                                type = "CYC"
                            }
                            if (domain.abbreviation == "KR") {
                                if (this.geneMatrix[geneIndex].domains[
                                    domainIndex].selected_option.length == 0) {
                                    if (domain.predictions.length != 0) {
                                        let domainActivity = domain.predictions[
                                            0][1]
                                        if (domainActivity ==
                                            "inactive" && (this.geneMatrix[geneIndex].domains[domainIndex].ko ==
                                                true || this.geneMatrix[geneIndex].domains[domainIndex].ko == "None")) {
                                            this.geneMatrix[geneIndex].domains[domainIndex].ko = true;
                                            active = "False"
                                        }
                                        if (domain.predictions[1][1] !=
                                            "(unknown)") {
                                            subtype = domain.predictions[1][1];
                                        }
                                        else { subtype = "None" }
                                    }
                                    else { subtype = "None" }
                                }
                                else {
                                    subtype = this.geneMatrix[geneIndex].domains[domainIndex].selected_option
                                }
                            }
                            if (domain.abbreviation == "KS") {
                                if (this.geneMatrix[geneIndex].domains[
                                    domainIndex].selected_option.length == 0) {
                                    if (domain.predictions.length != 0) {
                                        if (domain.predictions[0][1] !=
                                            "(unknown)") {
                                            subtype = domain.predictions[0][1].toUpperCase().replaceAll("-", "_").replaceAll("/", "_");
                                        }
                                        else { subtype = "MISCELLANEOUS" }
                                    }
                                }
                                else {
                                    subtype = TRANS_AT_KS_SUBTYPES[this.geneMatrix[geneIndex].domains[domainIndex].selected_option]
                                }
                            }

                            if (domain.abbreviation == "AT") {
                                moduleType = "PKS"
                                moduleSubtype = "PKS_CIS"
                                if (moduleIndex == 0) {
                                    if (domain.hasOwnProperty("predictions")) {
                                        if (domain.predictions.length != 0) {
                                            if (domain.predictions[1][1] !=
                                                "(unknown)" && PKS_STARTER_SUBSTRATES.includes(domain.predictions[1][1])) {
                                                substrate = domain.predictions[1][1].replace("-", '_').toUpperCase()
                                            }
                                            else {
                                                substrate = "acetyl_coa".toUpperCase()
                                            }

                                        }
                                    }
                                    else {
                                        substrate = "acetyl_coa".toUpperCase()
                                    }
                                }
                                else {
                                    if (domain.hasOwnProperty("predictions")) {
                                        if (domain.predictions.length != 0) {
                                            if (domain.predictions[1][1] !=
                                                "(unknown)") {
                                                substrate = domain.predictions[
                                                    1][1].replace("-",
                                                        '_')
                                                    .toUpperCase()
                                            }
                                            else {
                                                substrate = "malonyl_coa".toUpperCase()
                                            }
                                        }
                                    }
                                    else {
                                        substrate = "malonyl_coa".toUpperCase()
                                    }
                                }

                                if (!(this.geneMatrix[geneIndex].domains[domainIndex].selected_option.length == 0)) {
                                    substrate = this.geneMatrix[geneIndex].domains[domainIndex].selected_option.toUpperCase()
                                }
                            }
                            if (domain.abbreviation == "DH" || domain.abbreviation == "DHt") {
                                type = "DH"
                            }

                            if (domain.abbreviation == "cMT" || domain.abbreviation == "CMT") {
                                type = "AMT"
                            }

                            if (domain.abbreviation == "A" || domain.abbreviation == "CAL") {
                                if (domain.hasOwnProperty("predictions")) {
                                    if (domain.predictions.length != 0) {
                                        if (domain.predictions[0][1] !=
                                            "unknown" && domain.predictions[0][1] != "X") {
                                            substrate = AMINO_ACIDS[
                                                domain.predictions[
                                                    0][1].toLowerCase()]
                                            if (substrate === undefined) {
                                                substrate = "**Unknown**"
                                            }
                                        }
                                        else {
                                            substrate = "**Unknown**"
                                        }
                                    }
                                    else {
                                        substrate = "**Unknown**"
                                    }
                                }
                                else {
                                    substrate = "**Unknown**"
                                }
                                this.geneMatrix[geneIndex].domains[domainIndex].substrate = substrate
                                // overrule by user selected option

                                if (!(this.geneMatrix[geneIndex].domains[domainIndex].selected_option.length == 0)) {
                                    substrate = this.geneMatrix[geneIndex].domains[domainIndex].selected_option
                                }
                            }
                            if (["A", "C", "PCP", "E", "CAL"].includes(domain.abbreviation)) {
                                moduleType = "NRPS";
                                moduleSubtype = "None";
                            }
                            if (["AT", "KS", "ACP", "KR"].includes(domain.abbreviation)) {
                                moduleType = "PKS";
                                if (moduleSubtype == "None") {
                                    moduleSubtype = "PKS_TRANS";
                                }
                            }


                            // select right kind of acp/pcp depending on module type
                            if ((domain.type.includes("ACP") || domain.type
                                .includes("PP") || domain.type.includes("PCP")) && !(this.geneMatrix[geneIndex].domains[domainIndex]
                                    .type.includes("ACPS")) && moduleType == "NRPS") {
                                type = "PCP";
                                acpCounter += 1;
                            }
                            if ((domain.type.includes("ACP") || domain.type
                                .includes("PP") || domain.type.includes("PCP")) && !(this.geneMatrix[geneIndex].domains[domainIndex]
                                    .type.includes("ACPS")) && moduleType == "PKS") {
                                type = "ACP";
                                acpCounter += 1;
                            }
                            this.geneMatrix[geneIndex].domains[domainIndex].function = type
                            // to avoid duplicate domains
                            if (typesInModule.includes(type) || (type == "TD" && typesInModule.includes("TE")) || (type == "TE" && typesInModule.includes("TD")) || (type == "A" && typesInModule.includes("CAL")) || (type == "CAL" && typesInModule.includes("A"))) {
                                active = "False";
                                this.geneMatrix[geneIndex].domains[domainIndex].ko = true
                            };
                            domainArray.push([gene, type, subtype, "None", active, used]);
                            
                            // create new module everytime an ACP or PCP occurs, except if last domain was already ACP
                            if ((type == "ACP" || type == "PCP") && domainArray.length == 1) {
                                active = "False";
                                this.geneMatrix[geneIndex].domains[domainIndex].ko = true;
                            }
                            if (active != "False") { typesInModule.push(type); }
                            
                            if ((type == "ACP" || type == "PCP") && domainArray.length > 1) {
                                if (substrate === "" && moduleType == "PKS") {
                                    substrate = "MALONYL_COA";
                                }
                                if (substrate === "" && moduleType == "NRPS") {
                                    substrate = "**Unknown**";
                                }
                                // remove falsely assigned domains for prediciton
                                let domainArrayFiltered = []
                                if (moduleType == "NRPS") {
                                    domainArrayFiltered = domainArray.filter(domain => domain[1] != "AT" && domain[1] != "KS" && domain[1] != "KR"
                                        && domain[1] != "ER" && domain[1] != "DH" && domain[1] != "ACP");
                                }
                                if (moduleType == "PKS") {
                                    domainArrayFiltered = domainArray.filter(domain => domain[1] != "A" && domain[1] != "C" && domain[1] != "E" && domain[1] != "PCP");
                                }
                                // make sure amino acids are never a pks substrate
                                if (Object.values(AMINO_ACIDS).includes(substrate) && substrate !== "glycine") {
                                    moduleType = "NRPS";
                                    moduleSubtype = "None";
                                }

                                // create module arrays
                                let moduleArray = [moduleType, moduleSubtype, substrate, domainArrayFiltered]
                                if (moduleArray.length != 0) {
                                    outputForRaichu.push(moduleArray)
                                    domains = domains.concat(domainArray.map(function (x) {
                                        return x[1];
                                    }));
                                    // add merged modules to gene matrix
                                    moduleMatrix.push({
                                        "id": moduleIndex,
                                        "domains": domains,
                                        "numberOfDomains": domains.length,
                                        "moduleType": moduleType
                                    })
                                    moduleIndex++
                                }
                                domainArray = [];
                                domains = []
                                typesInModule = [];
                                moduleType = "PKS";
                                moduleSubtype = "PKS_TRANS";
                                substrate = ""

                            }
                        }
                    }

                }
            }
        }
    }
    // put everything into last module thats left

    if (domainArray.length != 0) {
        // set everything that already exists to false
        let newDomainArray = []
        if (outputForRaichu.length != 0) {
        typesInModule = outputForRaichu[outputForRaichu.length - 1][3].map(function (x) {
            return x[1];
        });
        moduleType = outputForRaichu[outputForRaichu.length - 1][0]
        moduleSubtype = outputForRaichu[outputForRaichu.length - 1][1]
        for (let domain of domainArray) {
            let newDomain = []
            if (typesInModule.includes(domain[1]) || (domain[1] == "TD" && typesInModule.includes("TE")) || (domain[1] == "TE" && typesInModule.includes("TD")) || (domain[1] == "CAL" && typesInModule.includes("A")) || (domain[1] == "A" && typesInModule.includes("CAL"))) {
                newDomain = domain.slice(0, 4);
                newDomain.push("False");
                newDomain.push(domain[5]);
            }
            else {
                newDomain = domain;
            }
            newDomainArray.push(newDomain);
            typesInModule.push(domain[1]);
        }

        // remove falsely assigned domains for prediciton
        let domainArrayFiltered = []
        if (moduleType == "NRPS") {
            domainArrayFiltered = newDomainArray.filter(domain => domain[1] != "AT" && domain[1] != "KS" && domain[1] != "KR"
                && domain[1] != "ER" && domain[1] != "DH");
        }
        if (moduleType == "PKS") {
            domainArrayFiltered = newDomainArray.filter(domain => domain[1] != "A" && domain[1] != "C" && domain[1] != "E");
        }
        // create module arrays
        if (domainArrayFiltered.length != 0) {
            outputForRaichu[outputForRaichu.length - 1][3] = outputForRaichu[outputForRaichu.length - 1][3].concat(domainArrayFiltered);
            domains = domains.concat(domainArray.map(function (x) {
                return x[1];
            }))
            // add merged modules to gene matrix
            moduleMatrix[moduleMatrix.length - 1].domains = moduleMatrix[moduleMatrix.length - 1].domains.concat(domains);
            moduleMatrix[moduleMatrix.length - 1].numberOfDomains += domains.length;

        }}
        else{
            domains = domains.concat(domainArray.map(function (x) {
                return x[1];
            }));
            moduleMatrix.push({
                "id": moduleIndex,
                "domains": domains,
                "numberOfDomains": domains.length,
                "moduleType": moduleType
                                    });
        }
    }

    this.moduleMatrix = moduleMatrix;
    return [outputForRaichu, starterACP, this.geneMatrix]
}}
