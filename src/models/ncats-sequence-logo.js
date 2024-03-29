import {axisLeft, axisBottom, line, scaleLinear, select} from "d3";
import ProtvistaZoomable from "protvista-zoomable";
import {getPathMap} from "./pathmap";
import ProtvistaTooltip from 'protvista-tooltip';

const NUMBER_OF_TICKS = 3;

class NcatsSequenceLogo extends ProtvistaZoomable {
    constructor() {
        super();
        this.pathmap = getPathMap();
    }

    connectedCallback() {
        super.connectedCallback();
        this.setSequence();
        this.mini = true;
        this.addEventListener("load", e => {
            this.data = e.detail.payload;
        });


        this.addEventListener('change', (e) => {
            if (e.detail?.eventtype == 'click') {
                const selectedResidueStats = e.currentTarget?.sequence[e.detail.feature?.start - 1];

                const tooltip = document.getElementById('protvista-uniprot-tooltip');
                if (!tooltip) {
                    return;
                }

                tooltip.title = `Residue ${e.detail.feature?.start}`;
                tooltip.innerHTML = selectedResidueStats.map(each => {
                    return `${each.aa}: ${each.bits.toFixed(4)} bits`
                }).join("<br/>");

                tooltip.visible = true;

                if (e.detail?.coords) {
                    const managerObj = document.getElementById('protvista-manager-obj');
                    const bounds = managerObj.getBoundingClientRect();
                    const [x, y] = e.detail.coords;

                    tooltip.x = x - (window.pageXOffset + bounds.x) + managerObj.offsetLeft;
                    tooltip.y = y - (window.pageYOffset + bounds.y) + managerObj.offsetTop;
                }
            }
        });
    }

    static get observedAttributes() {
        return ProtvistaZoomable.observedAttributes.concat(
            "highlightstart",
            "highlightend",
            "sequence",
            "height"
        );
    }

    setSequence(inSeq) {
        if (inSeq) {
            this.sequence = inSeq;
        } else {
            // this.sequence = JSON.parse(this.getAttribute('sequence'));
        }
        if (this.sequence) {
            this.setAttribute("length", this.sequence.length);
            if (!super.svg) {
                this._createSequence();
            } else {
                this.refresh();
            }
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name == 'sequence') {
            this.setSequence(newValue);
        }
    }

    get data() {
        return this.sequence;
    }

    set data(data) {
        this.setSequence(data);
    }

    _createSequence() {

        super.svg = select(this)
            .append("div")
            .attr("style", `height: ${this._height}px`)
            .attr("class", "")
            .append("svg")
            .attr("id", "")
            .attr("width", this.width)
            .attr("height", this._height);

        this.seq_bg = super.svg.append("g").attr("class", "background");

        this.seq_g = super.svg
            .append("g")
            .attr("class", "sequence")
            .attr("transform", `translate(0,${this.standardOffset()})`);

        this.line_path = super.svg
            .append("g")
            .attr("class", "linePlot")
            .attr("transform", `translate(0,${this.standardOffset()})`)
            .append("path");

        this.marginBlock = super.svg.append("rect")
            .attr("height", this._height)
            .attr("width", this.margin.left)
            .attr('fill','white');

        this.x_axis_g = super.svg.append("g").attr("class", "x axis")
            .attr("transform", `translate(${this.margin.left},${this._height - 1})`);

        if (!this.mini) {
            this.y_axis_g = super.svg.append("g").attr("class", "y axis")
                .attr("transform", `translate(${this.margin.left},-1)`)
                .attr("style", "background-color:white;");
        }


        this.trackHighlighter.appendHighlightTo(this.svg);
        this.refresh();
    }

    standardOffset() {
        return 0.75 * this._height;
    }

    get heightFactor() {
        return this._height / this.maxBits;
    }

    get maxBits() {
        return 4.322;
    }

    get yScale() {
        return scaleLinear()
            .domain([0, this.maxBits])
            .range([this.height, 0]);
    }

    refresh() {
        if (this.x_axis_g) {
            const ftWidth = this.getSingleBaseWidth();
            const sequenceOpacity = ftWidth - 10;
            const lineOpacity = 1 - sequenceOpacity;
            const first = Math.round(Math.max(0, this._displaystart - 2));
            const last = Math.round(Math.min(this.sequence.length, this._displayend + 1));

            const bases = [];
            let lineData = [];
            try {
                if (sequenceOpacity > 0) {
                    this.sequence.slice(first, last).forEach((seqObj, i) => {
                        seqObj.forEach((aaObj, j) => {
                            const last = ((j + 1) == seqObj.length);
                            bases.push({
                                start: 1 + first + i,
                                end: 1 + first + i,
                                aa: aaObj.aa,
                                bits: aaObj.bits,
                                yOffset: last ? 0 : seqObj.slice(j + 1).map(eachAA => eachAA.bits).reduce((a, c) => a + c)
                            });
                        });
                    });
                }
                if (lineOpacity > 0) {
                    lineData = this.sequence.slice(first, last).map((seqObj, i) => {
                        const retObj = {};
                        const only = (seqObj.length == 1);
                        retObj.y = only ? seqObj[0].bits : seqObj.map(eachAA => eachAA.bits).reduce((a, c) => a + c);
                        retObj.x = i;
                        retObj.position = 1 + first + i;
                        return retObj;
                    })
                }
            } catch (e) {
                console.log('error: ' + JSON.stringify(e));
            }

            this.xAxis = axisBottom(this.xScale).ticks(5);
            this.x_axis_g.call(this.xAxis);
            if (!this.mini) {
                this.yAxis = axisLeft(this.yScale).tickValues([1,2,3,4]);
                this.y_axis_g.call(this.yAxis);
            }

            this.bases = this.seq_g.selectAll("path.base").data(bases, d => d.start);
            this.bases.enter()
                .append("path")
                .attr("class", "base feature")
                .attr("d", d => this.pathmap.get(d.aa))
                .attr("stroke", d => this.colorByChemistry(d.aa))
                .attr("fill", d => this.colorByChemistry(d.aa))
                .attr('transform', d => {
                    return `translate(${this.getXFromSeqPosition(d.start)}, ${-this.standardOffset()
                    + (this._height - (this.heightFactor * (d.bits + d.yOffset)))}) scale(${ftWidth / this._height * this._height / 100}, ${d.bits / this.maxBits * this._height / 100})`;
                }).call(this.bindEvents, this);

            this.bases.attr('transform', d => {
                return `translate(${this.getXFromSeqPosition(d.start)}, ${-this.standardOffset()
                + (this._height - (this.heightFactor * (d.bits + d.yOffset)))}) scale(${ftWidth / this._height * this._height / 100}, ${d.bits / this.maxBits * this._height / 100})`;
            }).call(this.bindEvents, this);

            this.bases.exit().remove();

            this.line_path.data([lineData])
                .attr("d", line()
                    .x(d => this.getXFromSeqPosition(d.position) + (ftWidth / 2))
                    .y(d => (1 - d.y) * this.heightFactor + 2))
                .attr("stroke", "black")
                .attr("fill", "none");

            this.background = this.seq_bg
                .selectAll("rect.base_bg")
                .data(bases, d => d.start);

            this.background
                .enter()
                .append("rect")
                .attr("class", "base_bg feature")
                .attr("height", this._height)
                .merge(this.background)
                .attr("width", ftWidth)
                .attr("fill", d => {
                    return Math.round(d.start) % 2 ? "#ddd" : "#eee";
                })
                .attr("x", d => this.getXFromSeqPosition(d.start))
                .call(this.bindEvents, this);
            this.background.exit().remove();

            this.seq_g.style("opacity", Math.min(1, sequenceOpacity));
            this.line_path.style("opacity", Math.min(1, lineOpacity));
            this.seq_bg.style("opacity", Math.min(1, sequenceOpacity));

            this._updateHighlight();
        }
    }

    getXFromSeqPosition(position) {
        return this.margin.left + this.xScale(position);
    }

    colorByChemistry(aa) {
        switch (aa) {
            case 'G':
            case 'S':
            case 'T':
            case 'Y':
            case 'C':
                return "green"; // Polar
            case 'Q':
            case 'N':
                return "purple"; // Neutral
            case 'K':
            case 'R':
            case 'H':
                return "blue"; // Basic
            case 'D':
            case 'E':
                return "red"; // Acidic
            case 'A':
            case 'V':
            case 'L':
            case 'I':
            case 'P':
            case 'W':
            case 'F':
            case 'M':
                return "black"; // Hydrophobic
        }
        return "papayawhip"; // unknown
    }

    _updateHighlight() {
        this.trackHighlighter.updateHighlight();
    }


}

export default NcatsSequenceLogo;
