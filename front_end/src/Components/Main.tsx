import { useEthers } from "@usedapp/core"
import helperConfig from "../helper-config.json"

export const Main = () => {
    // display the token values 
    //get the address of different tokens
    //get the balance of users wallet

    //send the brownie-config to our 'src' folder.
    //send the build folder.

    const { chainId } = useEthers()
    const networkName = chainId ? helperConfig[chainId] : "dev"

}