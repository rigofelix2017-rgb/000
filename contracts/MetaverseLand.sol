// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Metaverse Land NFT
 * @notice Purchasable land parcels in the PSX-VOID metaverse
 * @dev Each parcel has coordinates, size, and metadata URI
 */
contract MetaverseLand is ERC721Enumerable, Ownable, ReentrancyGuard {
    struct Parcel {
        int256 x;
        int256 z;
        uint256 size;
        string zone;
        uint256 price;
        bool isListed;
    }
    
    mapping(uint256 => Parcel) public parcels;
    uint256 public nextTokenId = 1;
    
    string private baseTokenURI;
    address public feeDistributor;
    
    event ParcelCreated(uint256 indexed tokenId, int256 x, int256 z, uint256 size, string zone);
    event ParcelListed(uint256 indexed tokenId, uint256 price);
    event ParcelPurchased(uint256 indexed tokenId, address indexed buyer, uint256 price);
    
    constructor(
        string memory _baseTokenURI,
        address _feeDistributor
    ) ERC721("VOID Metaverse Land", "VOIDLAND") {
        baseTokenURI = _baseTokenURI;
        feeDistributor = _feeDistributor;
    }
    
    function createParcel(
        int256 x,
        int256 z,
        uint256 size,
        string memory zone,
        uint256 price
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId++;
        
        parcels[tokenId] = Parcel({
            x: x,
            z: z,
            size: size,
            zone: zone,
            price: price,
            isListed: true
        });
        
        _safeMint(owner(), tokenId);
        
        emit ParcelCreated(tokenId, x, z, size, zone);
        emit ParcelListed(tokenId, price);
        
        return tokenId;
    }
    
    function buyParcel(uint256 tokenId) external payable nonReentrant {
        Parcel memory parcel = parcels[tokenId];
        require(parcel.isListed, "Parcel not listed");
        require(msg.value >= parcel.price, "Insufficient payment");
        
        parcels[tokenId].isListed = false;
        
        address seller = ownerOf(tokenId);
        _transfer(seller, msg.sender, tokenId);
        
        // Send funds to fee distributor for ecosystem distribution
        (bool success, ) = feeDistributor.call{value: msg.value}("");
        require(success, "Transfer failed");
        
        emit ParcelPurchased(tokenId, msg.sender, msg.value);
    }
    
    function listParcel(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        parcels[tokenId].price = price;
        parcels[tokenId].isListed = true;
        emit ParcelListed(tokenId, price);
    }
    
    function unlistParcel(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        parcels[tokenId].isListed = false;
    }
    
    function getParcelsByOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](balance);
        
        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        
        return tokenIds;
    }
    
    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }
}
