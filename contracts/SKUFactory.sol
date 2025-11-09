// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title SKU Factory
 * @notice Universal content distribution system (games, items, skins, etc.)
 * @dev Creators mint SKUs and earn 45% on every sale
 */
contract SKUFactory is ERC1155, Ownable, ReentrancyGuard {
    struct SKU {
        address creator;
        uint256 price;
        uint256 supply;
        uint256 minted;
        string metadataURI;
        uint256 creatorShare; // Basis points (4500 = 45%)
        bool active;
    }
    
    mapping(uint256 => SKU) public skus;
    uint256 public nextSKUId = 1;
    
    address public feeDistributor;
    uint256 public constant DEFAULT_CREATOR_SHARE = 4500; // 45%
    
    event SKUCreated(
        uint256 indexed skuId,
        address indexed creator,
        uint256 price,
        uint256 supply,
        string metadataURI
    );
    event SKUPurchased(
        uint256 indexed skuId,
        address indexed buyer,
        uint256 quantity,
        uint256 totalPrice
    );
    
    constructor(address _feeDistributor) ERC1155("") {
        feeDistributor = _feeDistributor;
    }
    
    function createSKU(
        uint256 price,
        uint256 supply,
        string memory metadataURI
    ) external returns (uint256) {
        uint256 skuId = nextSKUId++;
        
        skus[skuId] = SKU({
            creator: msg.sender,
            price: price,
            supply: supply,
            minted: 0,
            metadataURI: metadataURI,
            creatorShare: DEFAULT_CREATOR_SHARE,
            active: true
        });
        
        emit SKUCreated(skuId, msg.sender, price, supply, metadataURI);
        
        return skuId;
    }
    
    function purchaseSKU(uint256 skuId, uint256 quantity) external payable nonReentrant {
        SKU storage sku = skus[skuId];
        require(sku.active, "SKU not active");
        require(sku.minted + quantity <= sku.supply, "Exceeds supply");
        require(msg.value >= sku.price * quantity, "Insufficient payment");
        
        sku.minted += quantity;
        
        // Mint SKU to buyer
        _mint(msg.sender, skuId, quantity, "");
        
        // Calculate and distribute fees
        uint256 creatorAmount = (msg.value * sku.creatorShare) / 10000;
        uint256 ecosystemAmount = msg.value - creatorAmount;
        
        // Pay creator immediately
        (bool creatorSuccess, ) = sku.creator.call{value: creatorAmount}("");
        require(creatorSuccess, "Creator payment failed");
        
        // Send ecosystem fees to fee distributor
        (bool ecosystemSuccess, ) = feeDistributor.call{value: ecosystemAmount}("");
        require(ecosystemSuccess, "Ecosystem payment failed");
        
        emit SKUPurchased(skuId, msg.sender, quantity, msg.value);
    }
    
    function getSKU(uint256 skuId) external view returns (SKU memory) {
        return skus[skuId];
    }
    
    function uri(uint256 skuId) public view override returns (string memory) {
        return skus[skuId].metadataURI;
    }
    
    function setFeeDistributor(address _feeDistributor) external onlyOwner {
        feeDistributor = _feeDistributor;
    }
}
