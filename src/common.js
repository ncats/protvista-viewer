export function mapIO(component, input) {
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
            component.ticktock = !component.ticktock;
            output.color = (component.ticktock ? '#ddd' : '#eee');
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
            component.ticktock2 = !component.ticktock2;
            output.color = (component.ticktock2 ? '#ddd' : '#eee');
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
