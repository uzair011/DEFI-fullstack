import { useEthers } from "@usedapp/core"

import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants } from "ethers"
import brownieConfig from "../brownie-config.json"
  
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

    return (<div>hello </div>)


}