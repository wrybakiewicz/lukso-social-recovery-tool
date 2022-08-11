// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@lukso/lsp-smart-contracts/contracts/LSP11BasicSocialRecovery/LSP11BasicSocialRecoveryCore.sol";
import {OwnableUnset} from "@erc725/smart-contracts/contracts/custom/OwnableUnset.sol";


contract SocialRecovery is LSP11BasicSocialRecoveryCore {
    using EnumerableSet for EnumerableSet.AddressSet;

    constructor(bytes32 _initialSecretHash) {
        account = msg.sender;
        OwnableUnset._setOwner(msg.sender);
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

    function recoverOwnershipWithoutSecret(
        bytes32 recoverProcessId,
        bytes32 newHash
    ) public NotZeroBytes32(newHash) {
        _checkRequirements(recoverProcessId);

        _secretHash = newHash;
        // Starting new recovery counter
    unchecked {
        _recoveryCounter++;
    }

        address keyManager = ERC725(account).owner();
        require(
            ERC165Checker.supportsERC165Interface(keyManager, _INTERFACEID_LSP6),
            "Owner of account doesn't support LSP6 InterfaceId"
        );

        // Setting permissions for `msg.sender`
        (bytes32[] memory keys, bytes[] memory values) = LSP6Utils
        .createPermissionsKeysForController(
            ERC725(account),
            msg.sender,
            abi.encodePacked(_ALL_DEFAULT_PERMISSIONS)
        );

        LSP6Utils.setDataViaKeyManager(keyManager, keys, values);
    }

    function getSecretHash() public view returns (bytes32) {
        return _secretHash;
    }

    function updateThreshold() internal {
        uint256 guardiansCount = _guardians.length();
        uint256 newThreshold = guardiansCount % 2 == 0 ? guardiansCount / 2 : (guardiansCount + 1) / 2;
        _guardiansThreshold = newThreshold > 0 ? newThreshold : 1;
    }

    function _checkRequirements(bytes32 recoverProcessId) internal view {
        uint256 guardiansCount = _guardians.length();
        require(guardiansCount >= 2, "Minimum guardians count to recover without secret is 2");

        uint256 recoverCounter = _recoveryCounter;
        uint256 senderVotes;
        uint256 guardiansLength = _guardians.length();

    unchecked {
        for (uint256 i = 0; i < guardiansLength; i++) {
            if (
                _guardiansVotes[recoverCounter][recoverProcessId][_guardians.at(i)] ==
                msg.sender
            ) {
                senderVotes++;
            }
        }
    }
        require(senderVotes == _guardians.length(), "All guardians needs to vote for you");
    }

}
