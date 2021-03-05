# ncats-protvista-viewer

This component combines various custom and 
<a href="https://ebi-webcomponents.github.io/nightingale/#/">ProtVista Nightingale</a> components 
to provide the user with a interactive view of aligned protein sequences. An example is shown on 
<a href="https://pharos.ncats.nih.gov/targets/ULK4#variants">Pharos</a>
where the sequence variant data and protein annotations come from <a href="http://prokino.uga.edu/">ProKinO</a>.

### To Install
```
npm install ncats-protvista-viewer
```

### To Configure
Check out ./test.html for an example of how to set the appropriate attributes to visualize your data.

### Data Format
`sequence`: Nested arrays with calculated values for the degree of conservation (in bits) 
for each residue, where each residue is an array of objects representing the proportion of
each amino acid. Amino acids are represented in single letter abbreviations, and bits are floating point numbers. 
Totals for all amino acids at each residue maxes out at log_2 20 = 4.322 bits. 

```sequence = [[{aa: Amino_Acid_Abbreviation, bits: Float}]]```

`annotations`: An array of features to show on the lower protvista-tracks. `startResidue` and `endResidue` are the start and
end residues. `name` is the name that will show on hover. `type` is one of the following values that will determine the 
style in which the feature is display.
```     
    alpha-helix
    alphaC-beta4 Loop
    beta-strand
    Activation Loop
    Activation Segment
    Catalytic Loop
    Glycine Loop
    Subdomain
    Linker
    KeyAA
    R-Spine
    C-Spine
    R-Spine Shell
    N-Lobe
    C-Lobe
    Gatekeeper
    CMGC Insert
    Motif
```

### Easy Customizations
* see mapIO in common.js to change the display for each type
* see typeToTrack in viewer.js to change how different annotation types are sorted into tracks

### Using the component in Angular SSR
* The component only runs in the browser, so load it only in the browser.
* Set your attributes then too, this is an example for the .js file
```        
if (isPlatformBrowser(this.platformID)) {
    import("ncats-protvista-viewer").then(() => {
        if (this.hasVariants()) {
            this.weblogo.nativeElement.setAttribute('sequence', JSON.stringify(this.target.sequence_variants.residue_info));
        }
        if (this.hasAnnotations()) {
            this.weblogo.nativeElement.setAttribute('annotations', JSON.stringify(this.target.sequence_annotations));
        }
    });
}
```
* while the html is like this
```
<ncats-protvista-viewer class="container" #weblogo></ncats-protvista-viewer>
```
