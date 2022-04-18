import { useContractFunction, useEthers } from "@usedapp/core"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers"
//import { Contract } from "@ethersproject/contracts"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import {Contract} from '@usedapp/core/node_modules/@ethersproject/contracts'
import { useState, useEffect } from "react"


export const useStakeTokens = (tokenAddress: string) => {
    // address
    // abi
    // chainId
    const { chainId } = useEthers()
    //? tokenFarm contract
    const { abi } = TokenFarm
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokanFarm"][0] : constants.AddressZero
    console.log("Hello hello hello ")
    console.log(tokenFarmAddress)
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)
    //? ERC20 contract
    const erc20ABI = ERC20.abi
    const erc20Interface = new utils.Interface(erc20ABI)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)
    
    // approve
    // stake tokens
    const { send: approveErc20Send, state: approveAndStakeErc20State } =
        useContractFunction(erc20Contract, "approve", {
            transactionName: "approve ERC20 transfer.",
        })
    
    const approveAndStake = (amount: string) => {
        setAmountToStake(amount)
        return approveErc20Send(tokenFarmAddress, amount)
    }

    const { send: stakeSend, state: stakeState } =
        useContractFunction(tokenFarmContract, "stakeTokens", {
            transactionName: "Stake tokens",
        })
    const [amountToStake, setAmountToStake] = useState("0")
    
    useEffect(() => {
        if (approveAndStakeErc20State.status === "Success") {
            // stake function
            stakeSend(amountToStake, tokenAddress)
        }
    }, [approveAndStakeErc20State, amountToStake, tokenAddress])

    const [state, setState] = useState(approveAndStakeErc20State)
    
    useEffect(() => {
        if (approveAndStakeErc20State.status === "Success") {
            setState(stakeState)
        } else {
            setState(approveAndStakeErc20State)
        }
    }, [approveAndStakeErc20State, stakeState])
    

    return ({approveAndStake, state})
}