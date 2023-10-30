// SPDX-License-Identifier: MIT

pragma solidity 0.8.8;

import "./PriceConverter.sol";

    error FundMe__NotOwner();

/// @title A contract for crowd funding
/// @author Aleh Mikus
/// @notice This is first ever contract of this author with payments
/// @dev This implements price feeds as our library


contract FundMe {
    // Type Declarations
    using PriceConverter for uint256;

    // State vars
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;
    address private immutable i_owner;
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    AggregatorV3Interface private s_priceFeed;

    // Modifiers
    modifier onlyOwner {
        // require(msg.sender == i_owner, "Sender is not owner");
        if (msg.sender != i_owner) {revert FundMe__NotOwner();}
        _;
    }

    constructor(address priceFeedAddress){
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // to process case when someone sending eth directly to contract address, without calling fund()
    receive() external payable {
        fund();
    }
    // if msg.data is not empty fallback will be called in case
    fallback() external payable {
        fund();
    }

    function fund() public payable {
        require(msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD, "Thats not enough!!!");
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;

    }

    function withdraw() public onlyOwner {

        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool callSuccess,) = payable(msg.sender).call{
                value: address(this).balance
            }("");
        require(callSuccess, "Call failed");
    }

    function cheaperWithdraw() public payable onlyOwner{
        address[] memory funders = s_funders;
        for(uint256 funderIndex = 0; funderIndex <funders.length; funderIndex++){
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool callSuccess,) = payable(msg.sender).call{
                value: address(this).balance
            }("");
        require(callSuccess, "Call failed");
    }

    function getOwner() public view returns(address){
        return i_owner;
    }

    function getFunder(uint256 index) public view returns(address){
        return s_funders[index];
    }

    function getAddressToAmountFunded(address funder) public view returns(uint256){
        return s_addressToAmountFunded[funder];
    }
    function getPriceFeed() public view returns(AggregatorV3Interface){
        return s_priceFeed;
    }

}