import { Token } from "../Main"
import {useEthers, useTokenBalance} from "@usedapp/core"
import { formatUnits } from "ethers/lib/utils"


export interface WalletBalanceProps {
    token: Token
}

export const WalletBalance = ({ token }: WalletBalanceProps) => {
    const { image, address, name } = token
    const { account } = useEthers()
    const tokenBalance = useTokenBalance(address, account)
    const value = tokenBalance?.toString()
    console.log("balance:"+value)
    const formatedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0

    return (<div>{formatedTokenBalance}</div>)
}