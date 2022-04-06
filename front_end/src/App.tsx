import React from 'react';
import { DAppProvider, ChainId } from "@usedapp/core"
import { Header } from "./Components/Header"
import { Theme } from '@mui/material/styles';

declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}


function App() {
  return (
    
     <DAppProvider config={{supportedChains: [ChainId.Rinkeby, ChainId.Kovan, 1337]}}>
      <Header />
      <div>HI Uzair</div>
   </DAppProvider>
  );
}

export default App;
