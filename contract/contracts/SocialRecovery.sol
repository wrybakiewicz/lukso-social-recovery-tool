// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@lukso/lsp-smart-contracts/contracts/LSP11BasicSocialRecovery/LSP11BasicSocialRecoveryCore.sol";
import {OwnableUnset} from "@erc725/smart-contracts/contracts/custom/OwnableUnset.sol";


contract SocialRecovery is LSP11BasicSocialRecoveryCore {

    constructor(address _account) {
        account = _account;
        OwnableUnset._setOwner(_account);
    }

    function getSecretHash() public view returns (bytes32) {
        return _secretHash;
    }

}
