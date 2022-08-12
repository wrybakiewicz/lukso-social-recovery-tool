# Web3 Social Recovery

## Info

This project is submission for **Hackathon: LUKSO Build UP! #1**  Universal Profile Tools - Social Recovery Tool task.

Live preview: [web3socialrecovery.com](https://www.web3socialrecovery.com/)

Done by **Wojciech Rybakiewicz** \
wojtek.rybakiewicz@gmail.com

#### Project contains:
- Frontend app
- Smart Contract based on LSP11BasicSocialRecovery standard
- Backend aggregating data for Frontend app

#### Description of frontend app
To interact with app user needs to have UP Browser Extension set up 

**Your Social Recovery** section - contains all features in the area of user's account social recovery
- deployment social recovery smart contract (when interacting the first time)
- adding and removing guardians
- changing secret phase
- changing threshold

**You as a Guardian** section - contains all features in the area of user interacting with someone else's social recovery contract
- viewing all guarded accounts
- viewing requirements for account recovery - recovery with secret and without secret (details below)
- viewing recovery processes for particular account
- starting new recovery process for account
- viewing guardians and their votes for particular recovery process
- voting and changing own vote in recovery process
- recovering account with secret phase or without it (if conditions fulfilled)

**View recovery** section- contains all features in the area of provided account social recovery
- contains similar features to **You as a Guardian** section but for provided address with slightly modified view

#### Additions to LSP11BasicSocialRecovery standard
- adding recoverOwnershipWithoutSecret function - that gives way to recover when user forgot it's secret. It needs 100% votes for one address from guardians and there must be >= 2 guardians 
- adding addGuardianWithThresholdUpdate and removeGuardianWithThresholdUpdate that add/remove guardians and change threshold to half of guardians number(if even) or to half + 1 of guardians number(if odd) - done for simplifying UX & save user from corner cases like 10 guardians and 1 threshold. Threshold can be overridden afterwards
- exposing secret hash to use on frontend (secret hash is already public on blockchain)
- providing secret hash in constructor - to avoid situation when user forgot to set up secret, so it's default to 0 hash
- setting guardian threshold to 1 in constructor - to avoid situation when everyone can recover account as default is 0

## Technical Details

### Backend
Backend contains of 4 AWS Lambdas that aggregates data(that can't be queried from contract) for frontend app in PostgreSQL database.
- addRecoveryContractAddress - based on transaction hash adds social recovery contract address associated with user's account
- getRecoveryContractAddressForAddress - return social recovery contract address for user address (to be able to interact on frontend with this contract)
- changeGuardianToAddress - updates guardians list for user
- getAddressesForGuardian - return all guarded accounts for address (to be able to view them on **You as a Guardian** section)

### Frontend
Frontend is React app that connects social recovery smart contract and uses backend AWS Lambdas for views that can't be queried from contract

### Contract
Contains SocialRecovery contract which is based on LSP11BasicSocialRecoveryCore. Additions are described above.