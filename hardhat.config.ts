import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import {HardhatUserConfig} from "hardhat/config";
import "solidity-coverage";
import "./tasks/MyTokenErc721.ts";
import "./tasks/MyTokenErc1155.ts";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
    solidity: "0.8.4",
    networks: {
        // hardhat: {
        //     forking: {
        //         url: process.env.RENKEBY_URL || '',
        //     },
        // },
        rinkeby: {
            url: process.env.RENKEBY_URL || '',
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
        },
    },
    etherscan: {
        // Your API key for Etherscan https://etherscan.io
        apiKey: process.env.ETHERSCAN_KEY
    }


};
export default config;
