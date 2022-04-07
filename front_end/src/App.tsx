import React from 'react';
import { DAppProvider, ChainId } from "@usedapp/core"
import { Header } from "./Components/Header"
import {Container} from "@material-ui/core"
import { Main } from './Components/Main';


function App() {
  return (
    
    <DAppProvider config={{
      supportedChains: [ChainId.Rinkeby, ChainId.Kovan, 1337]
    }}>
      <Header />
      <Container maxWidth="md">
        <div>HI Uzair</div>
        {/* <Main /> */}
      </Container>
   </DAppProvider>
  );
}

export default App;
