import {mapIO} from './common';

export class NcatsProtVistaLegend extends HTMLElement {
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
            mapIO(this,{type: 'Subdomain', name: 'A', startResidue: 1, endResidue: 9}),
            mapIO(this,{type: 'alpha-helix', name: 'B', startResidue: 1, endResidue: 9}),
            mapIO(this,{type: 'beta-strand', name: 'D', startResidue: 1, endResidue: 9}),
            mapIO(this,{type: 'Activation Segment', name: 'F', startResidue: 1, endResidue: 9}),
            // mapIO(this,{type: 'Activation Loop', name: 'E', startResidue: 1, endResidue: 9}),
            mapIO(this,{type: 'alphaC-beta4 Loop', name: 'C', startResidue: 1, endResidue: 9}),
            mapIO(this,{type: 'Catalytic Loop', name: 'G', startResidue: 1, endResidue: 9}),
            mapIO(this,{type: 'Glycine Loop', name: 'H', startResidue: 1, endResidue: 9}),
            mapIO(this,{type: 'Linker', name: 'I', startResidue: 1, endResidue: 9}),
            mapIO(this,{
                type: 'KeyAA',
                displayName: 'Key Amino Acid',
                name: 'J',
                startResidue: 5,
                endResidue: 5
            }),
            mapIO(this,{type: 'R-Spine', name: 'K', startResidue: 5, endResidue: 5}),
            mapIO(this,{type: 'C-Spine', name: 'L', startResidue: 5, endResidue: 5}),
            mapIO(this,{type: 'R-Spine Shell', name: 'M', startResidue: 1, endResidue: 9}),
            // mapIO(this,{type: 'N-Lobe', name: 'N', startResidue: 1, endResidue: 9}),
            // mapIO(this,{type: 'C-Lobe', name: 'O', startResidue: 1, endResidue: 9}),
            // mapIO(this,{type: 'Gatekeeper', name: 'P', startResidue: 1, endResidue: 9}),
            // mapIO(this,{type: 'CMGC Insert', name: 'Q', startResidue: 1, endResidue: 9}),
            mapIO(this,{type: 'Motif', name: 'R', startResidue: 1, endResidue: 9})
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
            track.className = 'legendTrack';
            track.setAttribute('width', 100);
            track.setAttribute('length', 100);
            track.setAttribute('displaystart', 1);
            track.setAttribute('displayend', 9);
            theRow.appendChild(track);

            track.setAttribute('id', 'track-' + row.accession);
            track.style = 'width:85px';
            // track.margin.left = track.margin.right = 0;
            track.style.paddingLeft = 0;
            track.data = [row];
        });
    }

}
