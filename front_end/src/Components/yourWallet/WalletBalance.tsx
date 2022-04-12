import { Token } from "../Main"
import {useEthers, useTokenBalance} from "@usedapp/core"
import { formatUnits } from "ethers/lib/utils"
import { BalanceMsg } from "../../Components/BalanceMsg"


export interface WalletBalanceProps {
    token: Token
}

export const WalletBalance = ({ token }: WalletBalanceProps) => {
    const {  name, address,image } = token
    const { account } = useEthers()
    const tokenBalance = useTokenBalance(address, account)

    console.log("balance:"+ tokenBalance?.toString())
    const formatedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0

    return (
        <BalanceMsg
            label={`Your unstaked ${name} balance`}
            tokenImageSrc={image}
            amount={formatedTokenBalance} />)
}