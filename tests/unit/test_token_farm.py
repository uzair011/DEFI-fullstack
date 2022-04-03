from brownie import network, exceptions
from scripts.helpful_scripts import LOCAL_BLOCKCHAIN_ENVS, get_account, get_contract
from scripts.deploy import deploy_token_farm_and_dapp_token
import pytest


def set_price_feed_contract():
    #! arrannge
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVS:
        pytest.skip("Only for local testing...")
    account = get_account()
    non_owner = get_account(index=1)  # to check the functions not for the owner.
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()
    #! act
    price_feed_address = get_contract("eth_usd_price_feed")
    token_farm.setPriceFeedContract(
        dapp_token.address, price_feed_address, {"from": account}
    )
    #! assert
    assert token_farm.tokenPriceFeedMapping(dapp_token.address) == price_feed_address
    with pytest.raises(exceptions.VirtualMachineError):
        token_farm.setPriceFeedContract(
            dapp_token.address, price_feed_address, {"from": account}
        )
