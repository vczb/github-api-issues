import {createGlobalStyle} from 'styled-components';

export default createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }
  html, body, #root{
    min-heigth: 100%;
  }

  body{
    background: #0D2635;
    font-size: 14px;
    -webkit-font-smoothing: antialiased !important;
  }
  body, input,button{
    color: #222;
    font-size: 14px;
    font-family: Arial, Helvetica, sans-serif;
  }
  button{
    cursor: pointer;
  }
`;
