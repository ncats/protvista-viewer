import { css } from 'lit-element';

export default css`
  protvista-tooltip a {
    text-decoration: underline;
    color: #fff;
  }
  .track-content {
    width: 80vw;
  }

  .nav-container,
  .category__track {
    display: flex;
    margin-bottom: 0.1rem;
  }

  .category {
    display: none;
    margin-bottom: 0.1rem;
  }

  .category-label,
  .track-label,
  .action-buttons,
  .credits {
    width: 20vw;
    padding: 0.5em;
  }

  .action-buttons {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
  }

  .category-label {
    background-color: #23364e;
    color: white;
    cursor: pointer;
  }

  .category-label::before {
    content: ' ';
    display: inline-block;
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 5px solid #fff;
    margin-right: 5px;
    -webkit-transition: all 0.1s;
    /* Safari */
    -o-transition: all 0.1s;
    transition: all 0.1s;
  }

  .category-label.open::before {
    content: ' ';
    display: inline-block;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #333;
    margin-right: 5px;
  }

  .track-label {
    background-color: #bdc3ca;
  }

  .track-instructions {    
    margin-left: 10px;
    font-size: small;
    background-color: white;
  }

  protvista-track {
    border-top: 1px solid #d9faff;
  }

  .feature {
    cursor: pointer;
  }
  
  .two-column-list {
    display: flex;
    flex-direction: row;
  }

  .one-column {
    display: flex;
    flex-direction: column;
    width: 50%;
  }
  
  .polar, 
  .neutral,
  .basic,
  .acidic,
  .hydrophobic {
    margin-left: 5px;
    font-weight: 900;
  }
  
  .polar { color: green; }
  .neutral { color: purple; }
  .basic { color: blue; }
  .acidic { color: red; }
  .hydrophobic { color: black; }
`;
