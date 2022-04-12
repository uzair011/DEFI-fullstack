import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
    container: {
        display: "inline-grid",
        gridTemplateColunms: "auto auto auto",
        gap: theme.spacing(1),
        alignItems: "center"
    },
    tokenImage: {
        width: "32px"
    },
    amount: {
        fontWeight: 700
    }
}))
export interface BalanceMsgProps{
    label: string,
    amount: number,
    tokenImageSrc: string 
}

export const BalanceMsg = ({ label, amount, tokenImageSrc }: BalanceMsgProps) => {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            <div>{label}</div>
            <div className={classes.amount}>{amount}</div>
            <img className={classes.tokenImage} src={tokenImageSrc} alt="token logo" />
        </div>
    )
}
