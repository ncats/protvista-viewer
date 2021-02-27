import ProtVistaManager from "protvista-manager";
import ProtvistaTrack from "protvista-track";
import ProtVistaNavigation from "protvista-navigation";
import NcatsSequenceLogo from "./ncats-sequence-logo";
import ProtvistaTooltip from "protvista-tooltip";
import {NcatsProtVistaLegend} from "./legend";
import {NcatsProtVistaViewer} from "./viewer";

const loadComponent = () => {
    window.customElements.define('protvista-manager', ProtVistaManager);
    window.customElements.define('protvista-navigation', ProtVistaNavigation);
    window.customElements.define('protvista-track', ProtvistaTrack);
    window.customElements.define('protvista-tooltip', ProtvistaTooltip);
    window.customElements.define('ncats-sequence-logo', NcatsSequenceLogo);
    window.customElements.define('ncats-protvista-viewer', NcatsProtVistaViewer);
    window.customElements.define('ncats-protvista-legend', NcatsProtVistaLegend);
};
// Conditional loading of polyfill
if (window.customElements) {
    loadComponent();
} else {
    document.addEventListener("WebComponentsReady", () => {
        loadComponent();
    });
}
