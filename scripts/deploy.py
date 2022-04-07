from scripts.helpful_scripts import get_account, get_contract
from brownie import DappToken, TokenFarm, network, config
from web3 import Web3
import yaml, json, os, shutil

KEPT_BALANCE = Web3.toWei(100, "ether")


def deploy_token_farm_and_dapp_token(front_end_update=False):
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
    if update_the_frontend:
        update_the_frontend()
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


def update_the_frontend():
    # send the build folder too..
    copy_folders_to_front_end("./build", "./front_end/src/chain-info")
    # sending the forntend to our config in JSON format.
    with open("brownie-config.yaml", "r") as brownie_config:
        # ? yaml => allows to load yaml to config_dictionany
        config_dictionary = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open("./front_end/src/brownie-config.json", "w") as brownie_config_json:
            json.dump(config_dictionary, brownie_config_json)
    print("Front end updated...")


def copy_folders_to_front_end(source, destination):
    # check if the destination folder is exist or not
    if os.path.exists(destination):
        shutil.rmtree(destination)
    shutil.copytree(source, destination)


def main():
    deploy_token_farm_and_dapp_token(front_end_update=True)
