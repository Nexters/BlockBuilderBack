// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Script, console} from "forge-std/Script.sol";
import {BodoBlockNft} from "../src/BodoBlockNft.sol";

contract DeployBODOBLOCK is Script {
    function run() external {
        address deployer = vm.envAddress("DEPLOYER_ADDRESS");

        vm.startBroadcast();
        BodoBlockNft bodo = new BodoBlockNft(deployer);
        console.log("BodoBlockNft deployed at:", address(bodo));
        vm.stopBroadcast();
    }
}
