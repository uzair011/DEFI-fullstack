import { Token } from "../Main"
import {useEthers, useTokenBalance, useNotifications} from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { Button, Input, CircularProgress, Snackbar } from "@material-ui/core"
import React, { useState, useEffect } from "react"
import { useStakeTokens } from "../../hooks"
import { utils } from "ethers"
import Alert from "@material-ui/lab/Alert"

export interface StakeFormProps{
    token: Token
}

export const StakeForm = ({ token }: StakeFormProps) => {
    const { address: tokenAddress, name } = token
    const { account } = useEthers()
    const tokenBalance = useTokenBalance(tokenAddress, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    const { notifications } = useNotifications()


    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)
        console.log(newAmount)
    }
        //! T H I S  L I N E
    const {approveAndStake, state: approveAndStakeErc20State} = useStakeTokens(tokenAddress)

    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString())
        return approveAndStake(amountAsWei.toString())   
    }
    const isMining = approveAndStakeErc20State.status === "Mining"

    // for the alert boxes
    const [showERC20ApprovelSuccess, setShowERC20ApprovelSuccess] = useState(false)
    const [showStakeTokensSuccess, setShowStakeTokensSuccess] = useState(false)

    const handleCloseSnack = () => {
        setShowERC20ApprovelSuccess(false)
        setShowStakeTokensSuccess(false)
    }

    // for notifications...
    useEffect(() => {
        if (notifications.filter(
            (notification) => 
                notification.type === "transactionSucceed" && 
                notification.transactionName === "approve ERC20 transfer.").length > 0) {
            setShowERC20ApprovelSuccess(true)
            setShowStakeTokensSuccess(false)
        }
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" && 
                notification.transactionName === "Stake tokens").length > 0) {
                    setShowERC20ApprovelSuccess(false)
                    setShowStakeTokensSuccess(true)                    
        }
    },[notifications, showERC20ApprovelSuccess, showStakeTokensSuccess])


    return (
        <>
            <div>
                <Input onChange={ handleInputChange } />
                <Button onClick={handleStakeSubmit} color="secondary" size="large" disabled={isMining}>
                    { isMining ? <CircularProgress size={27}/> : "STAKE"}
                </Button>
            </div>
            <Snackbar
                open={ showERC20ApprovelSuccess }
                autoHideDuration={5000}
            onClose={ handleCloseSnack }>
                <Alert
                onClose={ handleCloseSnack } severity="success">
                    ERC-20 token transfer approved. now approve the second transaction.
                </Alert>
            </Snackbar>
            <Snackbar
                open={ showStakeTokensSuccess }
                autoHideDuration={5000}
            onClose={ handleCloseSnack }>
                <Alert
                onClose={ handleCloseSnack } severity="success">
                    Tokens staked!
                </Alert>
            </Snackbar>
        </>)
}