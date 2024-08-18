# Frontend Using ethers.js

This solidity program demonstrates the use of smart contract functions which the user can call via signing through the Metamask provider.
## Description

This program is a simple solidity contract that contains:
- `addStudentMarks()` - Allows admin to add 1 student entry.
- `removeStudentEntry()` - Allows admin to remove 1 entry from the total entries.
 
## Getting Started

### Executing program

Git clone/Download this repository.

-  `cd` into the root directory if not already there.
-  In the terminal first run `npm install` to download all the dependencies.
-  Next type - `npx hardhat node` to start a local hardhat blockchain.
-  In another terminal type - `npx hardhat run scripts/deploy.js --network localhost`.
-  Finally, run the NextJs app using - `npm run dev`.

## Authors

Siddhant Khare
[https://sidkjr.github.io)
