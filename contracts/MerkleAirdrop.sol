// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleAirdrop {
    IERC20 public token;
    bytes32 public merkleRoot;
    mapping(address => bool) public claimed;

    event Claimed(address indexed account, uint256 amount);

    constructor(IERC20 _token, bytes32 _merkleRoot) {
        token = _token;
        merkleRoot = _merkleRoot;
    }

    function claim(uint256 amount, bytes32[] calldata merkleProof) external {
        require(!claimed[msg.sender], "Airdrop already claimed.");
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        require(MerkleProof.verify(merkleProof, merkleRoot, leaf), "Invalid proof.");

        claimed[msg.sender] = true;
        require(token.transfer(msg.sender, amount), "Transfer failed.");
        emit Claimed(msg.sender, amount);
    }

    function setMerkleRoot(bytes32 _merkleRoot) external {
        merkleRoot = _merkleRoot;
    }

    function withdrawTokens() external {
        uint256 balance = token.balanceOf(address(this));
        require(token.transfer(msg.sender, balance), "Transfer failed.");
    }
}
