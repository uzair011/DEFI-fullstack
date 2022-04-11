/* eslint-disable spaced-comment*/
/// <reference types="react-scripts" />

import { Token } from "../Main"
import React, { useState } from "react"
import { Box } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import { Tab } from "@material-ui/core"
import {WalletBalance} from "./WalletBalance"

interface YourWalletProps {
    supportedTokens: Array<Token>
}

export const YourWallet = ({ supportedTokens }: YourWalletProps) => {

    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
    // to change the tab when we click the tab
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    return (
        <Box>
            <h1>Your Wallet</h1>
            <Box>
                <TabContext value={selectedTokenIndex.toString()}>
                    <TabList onChange={handleChange} aria-label="Stake form tabs">
                        {supportedTokens.map((token, index) => {
                            return (
                                <Tab label={token.name}
                                    value={index.toString()}
                                    key={index} />
                            )
                        })}
                    </TabList>
                    {supportedTokens.map((token, index) => {
                        return (
                            <TabPanel value={index.toString()} key={index}>
                                <div>
                                    <WalletBalance token={supportedTokens[selectedTokenIndex]}/>
                                </div>
                            </TabPanel>
                        )
                    })}
                </TabContext>
            </Box>
        </Box>)
}
