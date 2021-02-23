import ProtVistaManager from "protvista-manager";
import ProtvistaTrack from "protvista-track";
import ProtVistaNavigation from "protvista-navigation";
import NcatsSequenceLogo from "./ncats-sequence-logo";
import ProtvistaTooltip from "protvista-tooltip";

class NcatsProtVistaLegend extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const style = document.createElement('style');
        style.textContent = '.legend {display: flex; flex-wrap: wrap; place-content: space-around;}' +
            '.entry{display:flex; padding-right:10px;}' +
            '.label{width:75px; display: flex; align-items: center;}';
        this.appendChild(style);

        this.container = document.createElement('div');
        this.container.className = 'legend';
        this.appendChild(this.container);

        const data = [
            NcatsProtVistaViewer.mapIO({type: 'Subdomain', name: 'A', startResidue: 1, endResidue: 9}),
            NcatsProtVistaViewer.mapIO({type: 'alpha-helix', name: 'B', startResidue: 1, endResidue: 9}),
            NcatsProtVistaViewer.mapIO({type: 'beta-strand', name: 'D', startResidue: 1, endResidue: 9}),
            NcatsProtVistaViewer.mapIO({type: 'Activation Segment', name: 'F', startResidue: 1, endResidue: 9}),
            // NcatsProtVistaViewer.mapIO({type: 'Activation Loop', name: 'E', startResidue: 1, endResidue: 9}),
            NcatsProtVistaViewer.mapIO({type: 'alphaC-beta4 Loop', name: 'C', startResidue: 1, endResidue: 9}),
            NcatsProtVistaViewer.mapIO({type: 'Catalytic Loop', name: 'G', startResidue: 1, endResidue: 9}),
            NcatsProtVistaViewer.mapIO({type: 'Glycine Loop', name: 'H', startResidue: 1, endResidue: 9}),
            NcatsProtVistaViewer.mapIO({type: 'Linker', name: 'I', startResidue: 1, endResidue: 9}),
            NcatsProtVistaViewer.mapIO({
                type: 'KeyAA',
                displayName: 'Key Amino Acid',
                name: 'J',
                startResidue: 5,
                endResidue: 5
            }),
            NcatsProtVistaViewer.mapIO({type: 'R-Spine', name: 'K', startResidue: 5, endResidue: 5}),
            NcatsProtVistaViewer.mapIO({type: 'C-Spine', name: 'L', startResidue: 5, endResidue: 5}),
            NcatsProtVistaViewer.mapIO({type: 'R-Spine Shell', name: 'M', startResidue: 1, endResidue: 9}),
            // NcatsProtVistaViewer.mapIO({type: 'N-Lobe', name: 'N', startResidue: 1, endResidue: 9}),
            // NcatsProtVistaViewer.mapIO({type: 'C-Lobe', name: 'O', startResidue: 1, endResidue: 9}),
            // NcatsProtVistaViewer.mapIO({type: 'Gatekeeper', name: 'P', startResidue: 1, endResidue: 9}),
            // NcatsProtVistaViewer.mapIO({type: 'CMGC Insert', name: 'Q', startResidue: 1, endResidue: 9}),
            NcatsProtVistaViewer.mapIO({type: 'Motif', name: 'R', startResidue: 1, endResidue: 9})
        ];

        data.forEach(row => {
            const theRow = document.createElement('div');
            theRow.className = 'entry';

            this.container.appendChild(theRow);

            const label = document.createElement('span');
            theRow.appendChild(label);
            label.className = 'label';
            label.innerText = row.displayName || row.type;

            const track = document.createElement('protvista-track');
            track.setAttribute('width', 9);
            track.setAttribute('length', 9);
            track.setAttribute('displaystart', 1);
            track.setAttribute('displayend', 9);
            theRow.appendChild(track);

            track.setAttribute('id', 'track-' + row.accession);
            track.data = [row];
            track.style = 'width:50px';
        });
    }

}

class NcatsProtVistaViewer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.manager = document.createElement("protvista-manager");
        this.navigation = document.createElement("protvista-navigation");
        this.weblogo = document.createElement('ncats-sequence-logo');
        this.tooltip = document.createElement('protvista-tooltip');
        this.tooltip.style.setProperty("--title-color", '#616161');
        this.tooltip.style.setProperty("--body-color", '#616161');
        this.maxLength = 10;
        this.navigation.setAttribute('length', this.maxLength);
        this.appendChild(this.manager);
        this.manager.appendChild(this.tooltip);
        this.manager.appendChild(this.navigation);
        this.manager.appendChild(this.weblogo);
        this.weblogo.setAttribute('height', '100');
        this.attributeChangedCallback('sequence', '', this.getAttribute("sequence"));
        this.attributeChangedCallback('annotations', '', this.getAttribute('annotations'));

        this.weblogo.addEventListener('mouseout', (event) => {
            if (!this.clicking) {
                return this.hideTooltip();
            }
        });
        this.weblogo.addEventListener("change", (event) => {
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
        document.addEventListener("click", (event) => {
            const path = event.path.map(element => element.localName || '');
            if (!path.includes('protvista-manager')) {
                this.clicking = false;
                this.hideTooltip();
            }
        });
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
                    const trackElement = this.manager.querySelector('#' + track);
                    if (trackElement) {
                        trackElement.setAttribute('length', this.maxLength);
                    }
                });
            }
        }
    }

    typeToTrack(type) {

        if (['Subdomain', 'N-Lobe', 'C-Lobe'].includes(type)) {
            return "subdomain";
        }
        if (["alpha-helix", "beta-strand", 'alphaC-beta4 Loop', 'Glycine Loop', 'Linker'].includes(type)) {
            return "structural";
        }
        if (['KeyAA', 'Motif'].includes(type)) {
            return "smallStuff";
        }
        if (['Catalytic Loop', 'Activation Loop', 'Activation Segment', 'Gatekeeper', 'CMGC Insert'].includes(type)) {
            return 'functional';
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
                trackElements.push(NcatsProtVistaViewer.mapIO(each));
            }
        });

        let temp = this.annotationMap.get('temp');

        let smallStuff = this.annotationMap.get('smallStuff');
        const cSpine = this.convertToDiscontinuousElement(temp.filter(each => each.type == 'R-Spine'), 'R-Spine');
        const rSpine = this.convertToDiscontinuousElement(temp.filter(each => each.type == 'C-Spine'), 'C-Spine');
        const rSpineShell = this.convertToDiscontinuousElement(temp.filter(each => each.type == 'R-Spine Shell'), 'R-Spine Shell');
        smallStuff.push(cSpine);
        smallStuff.push(rSpine);
        smallStuff.push(rSpineShell);

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

    static mapIO(input) {
        const output = {
            type: input.type,
            accession: input.name,
            start: input.startResidue,
            end: input.endResidue,
            displayName: input.displayName
        };
        switch (input.type) {
            case 'alpha-helix':
                output.color = 'red';
                output.shape = 'helix';
                break;
            case 'alphaC-beta4 Loop':
                output.color = 'chartreuse';
                output.shape = 'bridge';
                break;
            case 'beta-strand':
                output.color = 'green';
                output.shape = 'strand';
                break;
            case 'Activation Loop':
                output.color = 'yellow';
                break;
            case 'Activation Segment':
                output.color = 'red';
                output.shape = 'roundRectangle';
                break;
            case 'Catalytic Loop':
                output.color = 'brown';
                output.shape = 'bridge';
                break;
            case 'Glycine Loop':
                output.color = 'black';
                output.shape = 'bridge';
                break;
            case 'Subdomain':
                this.ticktock = !this.ticktock;
                output.color = (this.ticktock ? '#ddd' : '#eee');
                output.shape = 'roundRectangle';
                break;
            case 'Linker':
                output.color = 'cyan';
                output.shape = 'bridge';
                break;
            case 'KeyAA':
                output.shape = 'diamond';
                output.color = 'orange';
                break;
            case 'R-Spine':
                output.shape = 'diamond';
                output.color = 'red';
                break;
            case 'C-Spine':
                output.shape = 'diamond';
                output.color = 'blue';
                break;
            case 'R-Spine Shell':
                output.color = 'chartreuse';
                break;
            case 'N-Lobe':
            case 'C-Lobe':
                this.ticktock2 = !this.ticktock2;
                output.color = (this.ticktock2 ? '#ddd' : '#eee');
                output.shape = 'roundRectangle';
                break;
            case 'Gatekeeper':
            case 'CMGC Insert':
            case 'Motif':
                output.color = 'brown';
                break;
        }
        return output;
    }

    updateAnnotations(annotations) {
        this.compileAnnotations(annotations);
        let maxLen = 0;
        let minLen = 0;
        if (this.manager) {
            for (const track of ['subdomain', 'structural', 'functional', 'smallStuff']) {
                const elements = this.annotationMap.get(track);
                if (elements && elements.length > 0) {
                    const trackElement = document.createElement("protvista-track");
                    trackElement.setAttribute('id', track);
                    if (track == 'subdomain') {
                        trackElement.setAttribute('layout', 'non-overlapping');
                    }
                    this.manager.appendChild(trackElement);
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

window.customElements.define('protvista-manager', ProtVistaManager);
window.customElements.define('protvista-navigation', ProtVistaNavigation);
window.customElements.define('protvista-track', ProtvistaTrack);
window.customElements.define('protvista-tooltip', ProtvistaTooltip);
window.customElements.define('ncats-sequence-logo', NcatsSequenceLogo);
window.customElements.define('ncats-protvista-viewer', NcatsProtVistaViewer);
window.customElements.define('ncats-protvista-legend', NcatsProtVistaLegend);
