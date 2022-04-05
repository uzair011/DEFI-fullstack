from brownie import network, exceptions
from scripts.helpful_scripts import (
    LOCAL_BLOCKCHAIN_ENVS,
    get_account,
    get_contract,
    INITIAL_PRICEFEED_VALUE,
)
from scripts.deploy import deploy_token_farm_and_dapp_token
import pytest


def test_set_price_feed_contract():
    #! arrannge
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVS:
        pytest.skip("Only for local testing...")
    account = get_account()
    non_owner = get_account(index=1)  # to check the functions not for the owner.
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()
    #! act
    price_feed_address = get_contract("eth_usd_price_feed")
    # token_farm.setPriceFeedContract(
    #     dapp_token.address, price_feed_address, {"from": account}
    # )
    #! assert
    assert token_farm.tokenPriceFeedMapping(dapp_token.address) == price_feed_address
    with pytest.raises(exceptions.VirtualMachineError):
        token_farm.setPriceFeedContract(
            dapp_token.address, price_feed_address, {"from": non_owner}
        )


def test_stake_tokens(amount_staked):
    #! arrannge
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVS:
        pytest.skip("Only for local testing...")
    account = get_account()
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()
    #! act
    dapp_token.approve(token_farm.address, amount_staked, {"from": account})
    token_farm.stakeTokens(amount_staked, dapp_token.address, {"from": account})
    #! assert
    assert (
        token_farm.stakingBalance(dapp_token.address, account.address) == amount_staked
    )
    assert token_farm.uniqueTokensStaked(account.address) == 1
    assert token_farm.stakers(0) == account.address
    return token_farm, dapp_token


def test_issue_tokens(amount_staked):
    #! arrannge
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVS:
        pytest.skip("Only for local testing...")
    account = get_account()
    token_farm, dapp_token = test_stake_tokens(amount_staked)
    starting_balance = dapp_token.balanceOf(account.address)
    #! act
    token_farm.issueTokens({"from": account})
    #! assert
    # ? we are staking 1 dapp_token == in price to 1 ETH
    # ? so, we should get 2000 dapp_tokens in reward
    # ? since the price of ETH is USD 2500
    assert (
        dapp_token.balanceOf(account.address)
        == starting_balance + INITIAL_PRICEFEED_VALUE
    )


def test_get_user_total_value():  # with different tokens
    pass


def test_get_token_value():
    pass


def test_unstake_token():
    pass


def test_add_allowed_tokens():
    pass
