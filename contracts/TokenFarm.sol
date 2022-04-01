// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenFarm is Ownable {
    // mapping token address -> staker address -> amount
    mapping(address => mapping(address => uint256)) public stakingBalance;
    mapping(address => uint256) public uniquetokenStaked; // to find how many different tokens this stake has
    mapping(address => address) public tokenPriceFeedMapping; // to map the pricefeed to the associated pricefeed.
    address[] public allowedtokens;
    ADDRESS[] public stakers;
    IERC20 public dapptoken;

    // stakeTokens
    // unstakeTokens
    // issueTokens  -> this is a reward we give to the users for using our our platform
    // addAllowedtokens
    // getEthValue

    //REWARDS
    // 100 ETH 1:1 FOR EVERY ONE ETH, WE GIVE 1 DAPP TOKEN
    // 50 ETH AND 50 DAI STAKED, WE WANT TO GIVE A REWARD OF 1 DAPP / 1 DAI

    constructor(address _dappTokenAddress) public {
        dapptoken = IERC20(_dappTokenAddress);
    }

    function setPriceFeedContract(address _token, address _priceFeed)
        public
        onlyOwner
    {
        tokenPriceFeedMapping[_token] = _priceFeed;
    }

    function issueTokens() public onlyOwner {
        // issue tokens to all the staers
        for (
            uint256 stakersIndex = 0;
            stakersIndex <= stakers.length;
            stakersIndex++
        ) {
            address recipient = stakers[stakersIndex];
            uint256 userTotalValue = getUserTotalValue(recipient);
            // send them a token reward
            //based on their total value reward.
        }
    }

    function getUserTotalValue(address _user) public view returns (uint256) {
        uint256 totalValue = 0;
        require(uniquetokenStaked[_user] > 0, "No tokens staked!");

        for (
            uint356 allowedTokensIndex = 0;
            allowedTokensIndex <= allowedtokens.length;
            allowedTokensIndex++
        ) {
            totalValue =
                totalValue +
                getUserSingleTokenValue(
                    _user,
                    allowedtokens[allowedTokensIndex]
                );
        }
    }

    function getUserSingleTokenValue(address _user, address _token)
        public
        view
        returns (uint256)
    {
        // return the value of the stake of the user (ETH or DAI)
        // if the user staked 1ETH means, we should value and return $2500
        // if the user staked 100DAI means, we should value and retun $100

        if (uniquetokenStaked[_user] <= 0) {
            return 0;
        }
        // priceOfTheToken * Stakingbalance[_token][user]
        getTokenValue(_token);
    }

    function getTokenValue(address _token) public view returns (uint256) {
        // priceFeedAddress
        address priceFeedAddress = tokenPriceFeedMapping[_token];
    }

    function staketokens(uint256 _amount, address _token) public {
        // what tokens can users stake
        // how mucn can users stake?

        require(_amount > 0, "Amount cannot be 0.");
        // check the validity of the token
        require(tokenIsAllowed(_token), "Token is currently not allowed!");
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        updateUniqueTokensStaked(msg.sender, _token);
        stakingBalance[_token][msg.sender] =
            stakingBalance[_token][msg.sender] +
            _amount;
        if (uniquetokenStaked[msg.sender] == 1) {
            stakers.push(msg.sender);
        }
    }

    function updateUniqueTokensStaked(address _user, address _token) internal {
        if (stakingBalance[_user][_token] <= 0) {
            uniquetokenStaked[_user] += uniqueTokenStaked[_user];
        }
    }

    function addAllowedtokens(address _token) public onlyOwner {
        allowedtokens.push(_token);
    }

    function tokenIsAllowed(address _token) public returns (bool) {
        for (
            uint256 allowedTokenIndex = 0;
            allowedTokenIndex < allowedtokens.length;
            allowedTokenIndex++
        ) {
            if (allowedtokens[allowedTokenIndex] == _token) {
                return true;
            }
        }
        return false;
    }
}
