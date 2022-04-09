/* eslint-disable spaced-comment*/
/// <reference types="react-scripts" />

import { useEthers } from "@usedapp/core"
import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants } from "ethers"
import brownieConfig from "../brownie-config.json"
import dapp from "../dapp.png"
import eth from "../eth.png"
import dai from "../dai.png"
import { YourWallet } from "./yourWallet"



export type Token = {
    image: string,
    address: string, 
    name: string
}
  
export const Main = () => {
    // display the token values 
    //get the address of different tokens
    //get the balance of users wallet

    //send the brownie-config to our 'src' folder.
    //send the build folder.

    const { chainId } = useEthers()
    const networkName = chainId ? helperConfig[chainId] : "dev"

    const dappTokenAddress = chainId ? networkMapping[String(chainId)]["DappToken"][0] : constants.AddressZero
    const wethTokenAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero
    const fauTokenAddress = chainId ? brownieConfig["networks"][networkName]["fau_token"] : constants.AddressZero


    const supportedTokens: Array<Token> = [
        {
            image: dapp,
            address: dappTokenAddress,
            name: "DAPP"
        }, {
            image: eth,
            address: wethTokenAddress,
            name: "WETH"
        }, {
            image: dai,
            address: fauTokenAddress,
            name: "DAI"
        }
    ]

    return (
        <>
            <h2 >Dapp Token App</h2>
            <YourWallet supportedTokens={supportedTokens} />
        </>
    )
}
