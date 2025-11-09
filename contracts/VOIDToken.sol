// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title VOID Token
 * @notice Integration engine currency for the Agency Ecosystem
 * @dev 100 billion supply, supports PSX pledging (1 PSX = 100 VOID)
 */
contract VOIDToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public constant TOTAL_SUPPLY = 100_000_000_000 * 10**18; // 100 billion
    uint256 public constant PSX_PLEDGE_ALLOCATION = 45_000_000_000 * 10**18; // 45% for pledging
    uint256 public constant AIRDROP_ALLOCATION = 7_500_000_000 * 10**18; // 7.5% for airdrops
    uint256 public constant LIQUIDITY_ALLOCATION = 47_500_000_000 * 10**18; // 47.5% for liquidity
    
    uint256 public pledgedAmount;
    uint256 public airdropClaimed;
    
    bool public tradingEnabled;
    
    mapping(address => bool) public isExcludedFromFees;
    
    event PledgeActivated(address indexed user, uint256 psxAmount, uint256 voidAmount);
    event TradingEnabled(uint256 timestamp);
    event AirdropClaimed(address indexed user, uint256 amount);
    
    constructor() ERC20("VOID", "VOID") {
        _mint(msg.sender, TOTAL_SUPPLY);
        isExcludedFromFees[msg.sender] = true;
    }
    
    function enableTrading() external onlyOwner {
        require(!tradingEnabled, "Trading already enabled");
        tradingEnabled = true;
        emit TradingEnabled(block.timestamp);
    }
    
    function setExcludedFromFees(address account, bool excluded) external onlyOwner {
        isExcludedFromFees[account] = excluded;
    }
    
    function claimAirdrop(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(recipients.length == amounts.length, "Length mismatch");
        
        uint256 totalAmount;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        require(airdropClaimed + totalAmount <= AIRDROP_ALLOCATION, "Exceeds airdrop allocation");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            _transfer(msg.sender, recipients[i], amounts[i]);
            emit AirdropClaimed(recipients[i], amounts[i]);
        }
        
        airdropClaimed += totalAmount;
    }
}
