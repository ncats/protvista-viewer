
export const transformData = (data) => {
    let transformedData = [];
    const features = data;
    if (features && features.length > 0) {
        transformedData = features.map((feature) => {
            return {
                ...feature,
                tooltipContent: feature.name || feature.accession,
                // protvistaFeatureId: 1,
            };
        });
        transformedData = renameProperties(transformedData);
    }

    const cSpine = convertToDiscontinuousElement(transformedData.filter(each => each.type == 'R-Spine'), 'R-Spine');
    const rSpine = convertToDiscontinuousElement(transformedData.filter(each => each.type == 'C-Spine'), 'C-Spine');
    const rSpineShell = convertToDiscontinuousElement(transformedData.filter(each => each.type == 'R-Spine Shell'), 'R-Spine Shell');
    transformedData = transformedData.filter(each => !['R-Spine', 'C-Spine', 'R-Spine Shell'].includes(each.type));
    transformedData.push(cSpine);
    transformedData.push(rSpine);
    transformedData.push(rSpineShell);
    return transformedData;
};

let ticktock = false;
let ticktock2 = false;

const renameProperties = (features) => {
    return features.map((input) => {

        const output: any = {
            ...input,
            accession: input.name,
            start: input.startResidue,
            end: input.endResidue
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
                ticktock = !ticktock;
                output.color = (ticktock ? '#ddd' : '#eee');
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
                ticktock2 = !ticktock2;
                output.color = (ticktock2 ? '#ddd' : '#eee');
                output.shape = 'roundRectangle';
                break;
            case 'Gatekeeper':
            case 'CMGC Insert':
            case 'Motif':
                output.color = 'brown';
                break;
        }
        return output;
    });
};


const convertToDiscontinuousElement = (elements, accession) => {
    if (elements && elements.length > 0) {
        return {
            shape: elements[0].shape,
            color: elements[0].color,
            accession: accession,
            type: accession,
            start: Math.min(...elements.map(e => e.start)),
            end: Math.max(...elements.map(e => e.end)),
            tooltipContent: `Residues: ${elements.map(each => each.start).join(', ')}`,
            locations: [{
                fragments: elements.map(each => {
                    return {start: each.start, end: each.end}
                })
            }]
        };
    }
    return null;
};