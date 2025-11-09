// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Fee Distributor
 * @notice Distributes ecosystem fees according to the VOID model
 * @dev 30% xVOID, 15% PSX Treasury, 10% CREATE DAO, 10% CDN, 5% Vault
 */
contract FeeDistributor is Ownable, ReentrancyGuard {
    address public xVoidVault;
    address public psxTreasury;
    address public createDAO;
    address public cdnPartners;
    address public vaultReserve;
    
    uint256 public constant XVOID_SHARE = 3000;      // 30%
    uint256 public constant PSX_SHARE = 1500;        // 15%
    uint256 public constant CREATE_SHARE = 1000;     // 10%
    uint256 public constant CDN_SHARE = 1000;        // 10%
    uint256 public constant VAULT_SHARE = 500;       // 5%
    // Note: Creators get 35-45% directly, not through distributor
    
    uint256 public totalDistributed;
    
    event FeesDistributed(
        uint256 xVoidAmount,
        uint256 psxAmount,
        uint256 createAmount,
        uint256 cdnAmount,
        uint256 vaultAmount
    );
    
    constructor(
        address _xVoidVault,
        address _psxTreasury,
        address _createDAO,
        address _cdnPartners,
        address _vaultReserve
    ) {
        xVoidVault = _xVoidVault;
        psxTreasury = _psxTreasury;
        createDAO = _createDAO;
        cdnPartners = _cdnPartners;
        vaultReserve = _vaultReserve;
    }
    
    receive() external payable {
        distributeFees();
    }
    
    function distributeFees() public nonReentrant {
        uint256 amount = address(this).balance;
        require(amount > 0, "No fees to distribute");
        
        uint256 xVoidAmount = (amount * XVOID_SHARE) / 10000;
        uint256 psxAmount = (amount * PSX_SHARE) / 10000;
        uint256 createAmount = (amount * CREATE_SHARE) / 10000;
        uint256 cdnAmount = (amount * CDN_SHARE) / 10000;
        uint256 vaultAmount = (amount * VAULT_SHARE) / 10000;
        
        (bool xvSuccess, ) = xVoidVault.call{value: xVoidAmount}("");
        require(xvSuccess, "xVOID transfer failed");
        
        (bool psxSuccess, ) = psxTreasury.call{value: psxAmount}("");
        require(psxSuccess, "PSX transfer failed");
        
        (bool createSuccess, ) = createDAO.call{value: createAmount}("");
        require(createSuccess, "CREATE transfer failed");
        
        (bool cdnSuccess, ) = cdnPartners.call{value: cdnAmount}("");
        require(cdnSuccess, "CDN transfer failed");
        
        (bool vaultSuccess, ) = vaultReserve.call{value: vaultAmount}("");
        require(vaultSuccess, "Vault transfer failed");
        
        totalDistributed += amount;
        
        emit FeesDistributed(xVoidAmount, psxAmount, createAmount, cdnAmount, vaultAmount);
    }
    
    function updateAddresses(
        address _xVoidVault,
        address _psxTreasury,
        address _createDAO,
        address _cdnPartners,
        address _vaultReserve
    ) external onlyOwner {
        xVoidVault = _xVoidVault;
        psxTreasury = _psxTreasury;
        createDAO = _createDAO;
        cdnPartners = _cdnPartners;
        vaultReserve = _vaultReserve;
    }
}
