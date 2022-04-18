import React from 'react';
import { DAppProvider, ChainId, Kovan } from "@usedapp/core"
import { Header } from "./Components/Header"
import {Container} from "@material-ui/core"
import { Main } from './Components/Main';


function App() {
  return (
    
    <DAppProvider config={{
      // supportedChains: [ChainId.Rinkeby, ChainId.Kovan, 1337]
      //supportedChains: [ChainId.Rinkeby]
      networks: [Kovan],
      notifications: {
        expirationPeriod: 1000,
        checkInterval:1000
      }

    }}>
      <Header />
      <Container maxWidth="md">
        <Main />
      </Container>
    </DAppProvider>
  );
}

export default App;
