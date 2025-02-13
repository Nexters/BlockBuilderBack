// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract CustomFt is ERC20, ERC20Burnable, ERC20Pausable, Ownable, ERC20Permit {
    
    string public tokenUri;
    
    constructor(address initialOwner, address recipient, string memory tokenUri_, string memory name_, string memory symbol_, uint256 amount)
        ERC20(name_, symbol_)
        Ownable(initialOwner)
        ERC20Permit("BODOBLOCK")
    {   
        _mint(recipient, amount * 10 ** decimals());
        tokenUri = tokenUri_;
    }

    function getTokenUri() public view returns (string memory){
        return tokenUri;
    }

    function setTokenUri(string memory tokenUri_) public  returns (string memory ) {
        tokenUri = tokenUri_;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}
