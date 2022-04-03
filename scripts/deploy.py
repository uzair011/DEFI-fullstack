from scripts.helpful_scripts import get_account, get_contract
from brownie import DappToken, TokenFarm, network, config
from web3 import Web3

KEPT_BALANCE = Web3.toWei(100, "ether")


def deploy_token_farm_and_dapp_token():
    account = get_account()
    dapp_token = DappToken.deploy({"from": account})
    token_farm = TokenFarm.deploy(
        dapp_token.address,
        {"from": account},
        publish_source=config["networks"][network.show_active()].get("verify", False),
    )
    transfer = dapp_token.transfer(
        token_farm.address, dapp_token.totalSupply() - KEPT_BALANCE, {"from": account}
    )
    transfer.wait(1)
    # our tokens -> dapp_tokens, weth_tokens, fau_tokens/DAI
    weth_token = get_contract("weth_token")
    fau_token = get_contract("fau_token")
    dictionary_of_allowed_tokens = {
        dapp_token: get_contract("dai_usd_price_feed"),
        fau_token: get_contract("dai_usd_price_feed"),
        weth_token: get_contract("eth_usd_price_feed"),
    }

    add_allowed_tokens(token_farm, dictionary_of_allowed_tokens, account)
    return token_farm, dapp_token


def add_allowed_tokens(token_farm, dictionary_of_allowed_tokens, account):
    for token in dictionary_of_allowed_tokens:
        add_transaction = token_farm.addAllowedTokens(token.address, {"from": account})
        add_transaction.wait(1)
        set_trnsaction = token_farm.setPriceFeedContract(
            token.address, dictionary_of_allowed_tokens[token], {"from": account}
        )
        set_trnsaction.wait(1)
    return token_farm


def main():
    deploy_token_farm_and_dapp_token()
