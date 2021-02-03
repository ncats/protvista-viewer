import ProtVistaManager from "protvista-manager";
import ProtVistaNavigation from "protvista-navigation";
import NcatsSequenceLogo from "./ncats-sequence-logo";

class App extends HTMLElement {
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
        this.manager.appendChild(this.navigation);
        this.navigation.appendChild(this.weblogo);
        this.appendChild(this.manager);
        this.attributeChangedCallback('sequence', '', this.getAttribute("sequence"));
    }

    static get observedAttributes() {
        return ["sequence"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`${name}: ${oldValue} -> ${newValue}`);
        if(name == "sequence") {
            this.sequence = newValue;
            this.weblogo.setAttribute('sequence', this.sequence);
        }
    }
}

window.customElements.define('protvista-manager', ProtVistaManager);
window.customElements.define('protvista-navigation', ProtVistaNavigation);
window.customElements.define('ncats-sequence-logo', NcatsSequenceLogo);
window.customElements.define('ncats-protvista-viewer', App);
//
// <protvista-manager>
// <protvista-navigation
// length="100"
// displaystart="0"
// displayend="75"></protvista-navigation>
//     </protvista-manager>
