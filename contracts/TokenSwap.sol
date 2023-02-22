// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "./IToken.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract TokenSwap {

    //@dev Contract deployer
    address owner;


    // @dev Mapping of Token contract to depositors to amount deposited
    mapping(address => mapping(address => uint)) TokenBalPerAdd;
    mapping(address => bool) hasLiquidity;
    address[] alltokens;

    //@dev Handling getting the aggregators for a token unsing known base pairs
    address[] AllBasePairs;
    mapping(address => bool) isBasePair;
    mapping(address => mapping(address => address)) BasePairToQuotePairToAggAdd;

    //@dev  Using USDT as our base pair to route every other token
    address USDTBasePairAdd = 0xdAC17F958D2ee523a2206206994597C13D831ec7;
    address WETHBasePairAddress = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;



    constructor() {
        owner = msg.sender;
    }


    modifier onlyOwner{
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }



    // @notice Add liquidity function
    function addLiquidity(address _tokenA, address _tokenB, uint _amountA, uint _amountB) public {
        require(_tokenA != address(0) && _tokenB != address(0), "Address 0 is not avalid token address");
        require(_amountA != 0 && _amountB != 0 , "Cant add 0 liquidity");
        TokenBalPerAdd[_tokenA][msg.sender] += _amountA;
        TokenBalPerAdd[_tokenB][msg.sender] += _amountB;
        IToken(_tokenA).transferFrom(msg.sender, address(this), _amountA);
        IToken(_tokenB).transferFrom(msg.sender, address(this), _amountB);
        hasLiquidity[_tokenA] = true;
        hasLiquidity[_tokenB] = true;
        for(uint i = 0; i < alltokens.length; i++){
            if (_tokenA == alltokens[i]){
                alltokens[i] = _tokenA;
            }else {
                alltokens.push(_tokenA);
            }
            if (_tokenB == alltokens[i]){
                alltokens[i] = _tokenA;
            }else {
                alltokens.push(_tokenB);
            }
        }
    }

    // @notice Remove liquidity function
    function removeLiquidity(address _tokenA, address _tokenB, uint _amountA, uint _amountB) public {
        require(TokenBalPerAdd[_tokenA][msg.sender] >= _amountA && TokenBalPerAdd[_tokenB][msg.sender] >= _amountB);
        require(IToken(_tokenA).balanceOf(address(this)) >= _amountA && IToken(_tokenB).balanceOf(address(this)) >= _amountB, "Please try again shortly" );
        IToken(_tokenA).transfer(msg.sender, _amountA);
        IToken(_tokenB).transfer(msg.sender, _amountB);
    }

    // @notice Returns a list of address of all Liquidity tokens availiable
    function LiqTokAvail() public view returns(address[] memory _alltokens){
        return alltokens;
    }
    

    function addBasePair(address _basePair) public onlyOwner{
        for (uint i = 0; i < AllBasePairs.length; i++){
            if (_basePair == AllBasePairs[i]){
                AllBasePairs[i] = _basePair;
            }else {
                AllBasePairs.push(_basePair);
            }
        }
        isBasePair[_basePair] = true;
    }


    function getBasePairs() public view returns(address[] memory _basePairs){
        _basePairs = AllBasePairs;
    }


    function setAggAdd(address _basePair, address _quotePair, address _aggAdd) public onlyOwner {
        require(_basePair != address(0) && _aggAdd != address(0), "Base pair or aggregator address cant be address 0");
        BasePairToQuotePairToAggAdd[_basePair][_quotePair] = _aggAdd;
    }



    // function swap(address _tokenfrom, address _tokento, uint256 _amount) public returns (uint AmountToRecieve){

    //     // AAVE/ETH = 0x6Df09E975c830ECae5bd4eD9d90f3A95a4f88012

    //     address PriceFeedAdd = 0x6Df09E975c830ECae5bd4eD9d90f3A95a4f88012;

    //     (,int256 price, , ,  ) = AggregatorV3Interface(PriceFeedAdd).latestRoundData();


    //     if (_tokenfrom > _tokento) {
    //         AmountToRecieve = _amount * uint256(price);
    //     }else {
    //         AmountToRecieve = _amount * (1 / uint256(price));
    //     }

    //     AmountToRecieve = _amount * uint256(price);

    //     require (PriceFeedAdd > _tokenfrom, "Your address is smaller than required");


    //     IToken(_tokenfrom).transferFrom(msg.sender, address(this), _amount);
    //     IToken(_tokento).transfer(msg.sender, AmountToRecieve);
    // }

}