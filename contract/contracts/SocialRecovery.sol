// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@lukso/lsp-smart-contracts/contracts/LSP11BasicSocialRecovery/LSP11BasicSocialRecoveryCore.sol";
import {OwnableUnset} from "@erc725/smart-contracts/contracts/custom/OwnableUnset.sol";


contract SocialRecovery is LSP11BasicSocialRecoveryCore {
    using EnumerableSet for EnumerableSet.AddressSet;

    constructor(address _account, bytes32 _initialSecretHash) {
        account = _account;
        OwnableUnset._setOwner(_account);
        _secretHash = _initialSecretHash;
        _guardiansThreshold = 1;
    }

    function addGuardianWithThresholdUpdate(address newGuardian) public onlyOwner {
        addGuardian(newGuardian);
        updateThreshold();
    }

    function removeGuardianWithThresholdUpdate(address guardian) public onlyOwner {
        require(_guardians.contains(guardian), "Provided address is not a guardian");
        _guardians.remove(guardian);
        updateThreshold();
    }

    function getSecretHash() public view returns (bytes32) {
        return _secretHash;
    }

    function updateThreshold() internal {
        uint256 threshold = _guardians.length();
        uint256 newThreshold = threshold % 2 == 0 ? threshold / 2 : (threshold + 1) / 2;
        _guardiansThreshold = newThreshold > 0 ? newThreshold : 1;
    }

}
