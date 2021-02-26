import {mapIO} from "./common";

export class NcatsProtVistaViewer extends HTMLElement {
    constructor() {
        super();
    }

    refresh() {
        this.updateAnnotations(this.annotations);
    }

    createStyle(){
        const style = document.createElement('style');
        style.textContent = '' +
            '.trackLabel{min-width:100px; max-width:100px; align-self:center; text-align:end; font-size:small;} ' +
            '.trackContainer{display:flex;}';
        return style;
    }

    createManager(){
        return document.createElement("protvista-manager");
    }

    createNavigation(){
        const navigation = document.createElement("protvista-navigation");
        navigation.setAttribute('length', this.maxLength);
        navigation.margin.left = 30;
        return navigation;
    }

    createWebLogo(){
        const weblogo = document.createElement('ncats-sequence-logo');
        weblogo.setAttribute('height', '100');

        weblogo.addEventListener('mouseout', (event) => {
            if (!this.clicking) {
                return this.hideTooltip();
            }
        });
        weblogo.addEventListener("change", (event) => {
            if (event.detail.displaystart || event.detail.displayend) { // zoom event
                this.clicking = false;
                return this.hideTooltip();
            }
            if (event.detail.feature) {
                if (event.detail.eventtype == "click") {
                    this.clicking = true;
                    return this.showLogoTooltip(event);
                }
                if (event.detail.eventtype == "mouseover") {
                    if (!this.clicking) {
                        return this.showLogoTooltip(event);
                    }
                }
            }
        });
        return weblogo;
    }

    createTooltip(){
        const tooltip = document.createElement('protvista-tooltip');
        tooltip.style.setProperty("--title-color", '#616161');
        tooltip.style.setProperty("--body-color", '#616161');
        return tooltip;
    }

    wrapElement(labelText, trackElement){
        const container = document.createElement('div');
        container.className = "trackContainer";
        const label = document.createElement('div');
        label.className = 'trackLabel';
        if(labelText.length > 0) {
            label.innerText = labelText;
        }else{
            label.innerHTML = '&nbsp;';
        }
        container.appendChild(label);
        container.appendChild(trackElement);
        return container;
    }

    connectedCallback() {
        this.maxLength = 10;
        this.appendChild(this.createStyle());

        this.manager = this.createManager();
        this.appendChild(this.manager);

        this.navigation = this.createNavigation();
        this.manager.appendChild(this.wrapElement('', this.navigation));

        this.weblogo = this.createWebLogo();
        this.manager.appendChild(this.wrapElement('Ortholog Variants', this.weblogo));

        this.tooltip = this.createTooltip();
        this.manager.appendChild(this.tooltip);

        this.attributeChangedCallback('sequence', '', this.getAttribute("sequence"));
        this.attributeChangedCallback('annotations', '', this.getAttribute('annotations'));

        document.addEventListener("click", (event) => {
            const path = event.path.map(element => element.localName || '');
            if (!path.includes('protvista-manager')) {
                this.clicking = false;
                this.hideTooltip();
            }
        });

        window.onresize = refresh;
    }

    static get observedAttributes() {
        return ["sequence", "annotations"];
    }

    updateLength(length) {
        if (length > this.maxLength) {
            this.maxLength = length;
        }
        if (this.maxLength > 0) {
            if (this.navigation) {
                this.navigation.setAttribute('length', this.maxLength);
            }
            if (this.annotationMap) {
                this.annotationMap.forEach((elements, track) => {
                    const trackElement = this.manager.querySelector('#' + this.name2id(track));
                    if (trackElement) {
                        trackElement.setAttribute('length', this.maxLength);
                    }
                });
            }
        }
    }

    get nameSubdomains() {return 'Subdomains';}
    get nameSecondary() {return 'Secondary Structure';}
    get nameFunctional() {return 'Functional Regions';}
    get nameMotifs() {return 'Motifs';}
    name2id(name) { return name.replace(' ', '_');}

    typeToTrack(type) {

        if (['Subdomain', 'N-Lobe', 'C-Lobe'].includes(type)) {
            return "Subdomains";
        }
        if (["alpha-helix", "beta-strand", 'alphaC-beta4 Loop', 'Glycine Loop', 'Linker'].includes(type)) {
            return "Secondary Structure";
        }
        if (['KeyAA', 'Motif'].includes(type)) {
            return "Motifs";
        }
        if (['Catalytic Loop', 'Activation Loop', 'Activation Segment', 'Gatekeeper', 'CMGC Insert'].includes(type)) {
            return 'Functional Regions';
        }
        if (["R-Spine", "C-Spine", "R-Spine Shell"].includes(type)) {
            return 'temp';
        }
        return 'undetermined';
    }

    compileAnnotations(annotations) {
        this.annotationMap = new Map();

        annotations.forEach(each => {
            const track = this.typeToTrack(each.type);
            if (track) {
                let trackElements = [];
                if (this.annotationMap.has(track)) {
                    trackElements = this.annotationMap.get(track);
                } else {
                    this.annotationMap.set(track, trackElements);
                }
                trackElements.push(mapIO(this, each));
            }
        });

        let temp = this.annotationMap.get('temp');

        let motifs = this.annotationMap.get(this.nameMotifs);
        const cSpine = this.convertToDiscontinuousElement(temp.filter(each => each.type == 'R-Spine'), 'R-Spine');
        const rSpine = this.convertToDiscontinuousElement(temp.filter(each => each.type == 'C-Spine'), 'C-Spine');
        const rSpineShell = this.convertToDiscontinuousElement(temp.filter(each => each.type == 'R-Spine Shell'), 'R-Spine Shell');
        motifs.push(cSpine);
        motifs.push(rSpine);
        motifs.push(rSpineShell);

        this.annotationMap.delete('temp');
    }

    convertToDiscontinuousElement(elements, accession) {
        return {
            shape: elements[0].shape,
            color: elements[0].color,
            accession: accession,
            tooltipContent: `Residues: ${elements.map(each => each.start).join(', ')}`,
            locations: [{
                fragments: elements.map(each => {
                    return {start: each.start, end: each.end}
                })
            }]
        };
    }

    convertToCopiedElements(elements) {
        return {
            shape: elements[0].shape,
            color: elements[0].color,
            accession: elements[0].accession,
            start: elements[0].start,
            end: elements[0].end,
            locations: elements.map(each => {
                return {
                    fragments: [{start: each.start, end: each.end}]
                }
            })
        };
    }


    updateAnnotations(annotations) {
        this.compileAnnotations(annotations);
        let maxLen = 0;
        let minLen = 0;
        if (this.manager) {
            for (const track of [this.nameSubdomains, this.nameSecondary, this.nameFunctional, this.nameMotifs]) {
                const elements = this.annotationMap.get(track);
                if (elements && elements.length > 0) {
                    const trackElement = document.createElement("protvista-track");
                    trackElement.setAttribute('id', this.name2id(track));
                    if (track == this.nameSubdomains) {
                        trackElement.setAttribute('layout', 'non-overlapping');
                    }
                    this.manager.appendChild(this.wrapElement(track, trackElement));
                    trackElement.data = elements;

                    trackElement.addEventListener('mouseout', (event) => {
                        if (!this.clicking) {
                            this.hideTooltip();
                        }
                    });
                    trackElement.addEventListener("change", (event) => {
                        if (event.detail.displaystart || event.detail.displayend) { // zoom event
                            this.clicking = false;
                            return this.hideTooltip();
                        }
                        if (event.detail.feature && event.detail.feature.accession) {
                            if (event.detail.eventtype == "click") {
                                this.clicking = true;
                                return this.showTrackTooltip(event)
                            }
                            if (event.detail.eventtype == "mouseover") {
                                if (!this.clicking) {
                                    return this.showTrackTooltip(event);
                                }
                            }
                        }
                    });
                }
            }
            maxLen = Math.max(...this.annotations.map(each => each.endResidue));
            minLen = Math.min(...this.annotations.map(each => each.startResidue));
            this.updateLength(maxLen);
        }
        return {displayStart: minLen, displayEnd: maxLen};
    }

    hideTooltip() {
        const tooltips = document.querySelectorAll("protvista-tooltip");
        tooltips.forEach(tooltip => tooltip.visible = false);
    }

    showTrackTooltip(event) {
        const details = event.detail.feature;
        if (details) {
            this.showTooltip(details.accession, details.tooltipContent || `start: ${details.start}<br/>end: ${details.end}`, event);
        }
    }

    showLogoTooltip(event) {
        const proportions = this.sequence[event.detail.feature.start - 1];
        const tooltipContent = proportions.map(each => {
            return `${each.aa}: ${each.bits.toFixed(4)} bits`
        }).join("<br/>");
        this.showTooltip(`Residue ${event.detail.feature.start}`, tooltipContent, event);
    }

    showTooltip(title, content, event) {
        const path = event.path.map(element => element.localName || '');
        const bounds = event.detail.target.getBoundingClientRect();
        const xOffset = bounds.x + bounds.width / 2;
        let yOffset = bounds.y + bounds.height / 2;
        if (path.includes('ncats-sequence-logo')) {
            const rowBounds = event.target.getBoundingClientRect();
            yOffset = rowBounds.y + 85;
        }
        const manBounds = this.manager.getBoundingClientRect();
        this.tooltip.title = title;
        this.tooltip.innerHTML = content;
        this.tooltip.x = xOffset - manBounds.x;
        this.tooltip.y = yOffset - manBounds.y;
        this.tooltip.visible = true;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        let displayEnd = 75;
        let displayStart = 0;
        if (name == "sequence") {
            this.sequence = JSON.parse(newValue);
            if (this.sequence) {
                this.updateLength(this.sequence.length);
                if (this.weblogo) {
                    this.weblogo.setSequence(this.sequence);
                }
                displayEnd = this.sequence.length;
            }
        }
        if (name == "annotations") {
            this.annotations = JSON.parse(newValue);
            if (this.annotations && this.annotations.length > 0) {
                const obj = this.updateAnnotations(this.annotations);
                displayEnd = obj.displayEnd;
                displayStart = obj.displayStart;
            }
        }
        if (this.manager) {
            this.manager.setAttribute("displayend", displayEnd);
            this.manager.setAttribute("displaystart", displayStart);
        }
    }
}
