import ProtVistaManager from "protvista-manager";
import ProtvistaTrack from "protvista-track";
import ProtVistaNavigation from "protvista-navigation";
import NcatsSequenceLogo from "./ncats-sequence-logo";

class NcatsProtVistaViewer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.manager = document.createElement("protvista-manager");
        this.navigation = document.createElement("protvista-navigation");
        this.weblogo = document.createElement('ncats-sequence-logo');
        this.maxLength = 10;
        this.navigation.setAttribute('length', this.maxLength);
        this.navigation.setAttribute('displaystart', this.getAttribute('displaystart') || 0);
        this.navigation.setAttribute('displayend', this.getAttribute('displayend') || 75);
        this.appendChild(this.manager);
        this.manager.appendChild(this.navigation);
        this.manager.appendChild(this.weblogo);
        this.weblogo.setAttribute('height', '100');
        this.attributeChangedCallback('sequence', '', this.getAttribute("sequence"));
        this.attributeChangedCallback('annotations', '', this.getAttribute('annotations'));
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

        if (type == "Subdomain") {
            return "subdomain";
        }
        if (["alpha-helix", "beta-strand", 'alphaC-beta4 Loop', 'Activation Loop', 'Activation Segment', 'Catalytic Loop', 'Glycine Loop', 'Linker', 'KeyAA']
            .includes(type)) {
            return "structure";
        }
        if (["R-Spine", "C-Spine", "R-Spine Shell"].includes(type)){
            return "spine";
        }
        return null;
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
                trackElements.push(this.mapIO(track, each));
            }
        });
    }

    mapIO(track, input) {
        const output = {
            accession: input.name,
            tooltipContent: input.name,
            start: input.startResidue,
            end: input.endResidue
        };
        switch (input.type) {
            case 'alpha-helix':
                output.color = 'red';
                output.shape = 'helix';
                break;
            case 'alphaC-beta4 Loop':
                output.color = 'darkorange';
                output.shape = 'roundRectangle';
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
                output.color = 'pink';
                output.shape = 'roundRectangle';
                break;
            case 'Glycine Loop':
                output.color = 'black';
                output.shape = 'catFace';
                break;
            case 'Subdomain':
                output.color = '#' + Math.floor(Math.random() * 256 ** 3).toString(16);
                output.shape = 'roundRectangle';
                break;
            case 'Linker':
                output.color = 'magenta';
                break;
            case 'KeyAA':
                output.shape = 'diamond';
                output.color = 'black';
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
                output.shape = 'roundRectangle';
                output.color = 'chartreuse';
                break;
        }
        return output;
    }

    updateAnnotations(annotations) {
        this.compileAnnotations(annotations);
        if (this.manager) {
            let maxLen = 0;
            this.annotationMap.forEach((elements, track) => {
                if (elements.length > 0) {
                    const trackElement = document.createElement("protvista-track");
                    trackElement.setAttribute('id', track);
                    this.manager.appendChild(trackElement);
                    trackElement.data = elements;
                }
                maxLen = Math.max(maxLen, ...elements.map(each => each.end));
            });
            this.updateLength(maxLen);
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "sequence") {
            this.sequence = JSON.parse(newValue);
            if (this.sequence) {
                this.updateLength(this.sequence.length);
                if (this.weblogo) {
                    this.weblogo.setSequence(this.sequence);
                }
            }
        }
        if (name == "annotations") {
            this.annotations = JSON.parse(newValue);
            if (this.annotations && this.annotations.length > 0) {
                this.updateAnnotations(this.annotations);
            }
        }
    }
}

window.customElements.define('protvista-manager', ProtVistaManager);
window.customElements.define('protvista-navigation', ProtVistaNavigation);
window.customElements.define('protvista-track', ProtvistaTrack);
window.customElements.define('ncats-sequence-logo', NcatsSequenceLogo);
window.customElements.define('ncats-protvista-viewer', NcatsProtVistaViewer);
