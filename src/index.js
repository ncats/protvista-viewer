import ProtVistaManager from "protvista-manager";
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
        this.navigation.setAttribute('length', '100');
        this.navigation.setAttribute('displaystart', '0');
        this.navigation.setAttribute('displayend', '75');
        this.appendChild(this.manager);
        this.manager.appendChild(this.navigation);
        this.navigation.appendChild(this.weblogo);
        this.weblogo.setAttribute('height', '100');
        this.attributeChangedCallback('sequence', '', this.getAttribute("sequence"));
    }

    static get observedAttributes() {
        return ["sequence"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(name == "sequence") {
            this.sequence = JSON.parse(newValue);
            if(this.sequence) {
                if (this.navigation) {
                    this.navigation.setAttribute('length', this.sequence.length);
                }
                if (this.weblogo) {
                    this.weblogo.setSequence(this.sequence);
                }
            }
        }
    }
}

window.customElements.define('protvista-manager', ProtVistaManager);
window.customElements.define('protvista-navigation', ProtVistaNavigation);
window.customElements.define('ncats-sequence-logo', NcatsSequenceLogo);
window.customElements.define('ncats-protvista-viewer', NcatsProtVistaViewer);
