// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title xVOID Staking Vault
 * @notice Stake VOID to earn xVOID and receive 30% of ecosystem fees
 * @dev Implements lock multipliers: 1× (no lock), 2× (3mo), 3× (6mo), 5× (24mo)
 */
contract xVOIDVault is ERC20, ReentrancyGuard, Ownable {
    IERC20 public immutable voidToken;
    
    struct Stake {
        uint256 amount;
        uint256 lockEnd;
        uint256 multiplier; // 100 = 1×, 200 = 2×, etc.
    }
    
    mapping(address => Stake) public stakes;
    
    uint256 public totalStakedVOID;
    uint256 public totalRewardsDistributed;
    
    uint256 public constant MULTIPLIER_NONE = 100;      // 1×
    uint256 public constant MULTIPLIER_3MO = 200;       // 2×
    uint256 public constant MULTIPLIER_6MO = 300;       // 3×
    uint256 public constant MULTIPLIER_24MO = 500;      // 5×
    
    uint256 public constant LOCK_3MO = 90 days;
    uint256 public constant LOCK_6MO = 180 days;
    uint256 public constant LOCK_24MO = 730 days;
    
    event Staked(address indexed user, uint256 amount, uint256 lockEnd, uint256 multiplier);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsDistributed(uint256 amount);
    
    constructor(address _voidToken) ERC20("Staked VOID", "xVOID") {
        voidToken = IERC20(_voidToken);
    }
    
    function stake(uint256 amount, uint256 lockPeriod) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        require(stakes[msg.sender].amount == 0, "Already staking");
        
        uint256 multiplier = MULTIPLIER_NONE;
        uint256 lockEnd = block.timestamp;
        
        if (lockPeriod == LOCK_3MO) {
            multiplier = MULTIPLIER_3MO;
            lockEnd = block.timestamp + LOCK_3MO;
        } else if (lockPeriod == LOCK_6MO) {
            multiplier = MULTIPLIER_6MO;
            lockEnd = block.timestamp + LOCK_6MO;
        } else if (lockPeriod == LOCK_24MO) {
            multiplier = MULTIPLIER_24MO;
            lockEnd = block.timestamp + LOCK_24MO;
        }
        
        voidToken.transferFrom(msg.sender, address(this), amount);
        
        uint256 xVoidAmount = (amount * multiplier) / 100;
        
        stakes[msg.sender] = Stake({
            amount: amount,
            lockEnd: lockEnd,
            multiplier: multiplier
        });
        
        totalStakedVOID += amount;
        _mint(msg.sender, xVoidAmount);
        
        emit Staked(msg.sender, amount, lockEnd, multiplier);
    }
    
    function unstake() external nonReentrant {
        Stake memory userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No stake");
        require(block.timestamp >= userStake.lockEnd, "Still locked");
        
        uint256 xVoidAmount = (userStake.amount * userStake.multiplier) / 100;
        
        delete stakes[msg.sender];
        totalStakedVOID -= userStake.amount;
        
        _burn(msg.sender, xVoidAmount);
        voidToken.transfer(msg.sender, userStake.amount);
        
        emit Unstaked(msg.sender, userStake.amount);
    }
    
    function distributeRewards(uint256 amount) external onlyOwner {
        require(amount > 0, "Cannot distribute 0");
        voidToken.transferFrom(msg.sender, address(this), amount);
        totalRewardsDistributed += amount;
        emit RewardsDistributed(amount);
    }
    
    function getStakeInfo(address user) external view returns (
        uint256 stakedAmount,
        uint256 xVoidBalance,
        uint256 lockEnd,
        uint256 multiplier,
        bool isLocked
    ) {
        Stake memory userStake = stakes[user];
        return (
            userStake.amount,
            balanceOf(user),
            userStake.lockEnd,
            userStake.multiplier,
            block.timestamp < userStake.lockEnd
        );
    }
}
