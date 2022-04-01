import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

const contract_name = 'MyTokenERC721'
const prefix = contract_name + '_'

task(prefix + "mint", "mint new tokens")
    .addParam("address", "Contract address")
    .addParam("ownerAddress", "Address of token owner")
    .addParam("url", "Token image url")
    .setAction(async (taskArgs, hre) => {
        const [acc1] = await hre.ethers.getSigners()
        const factory = await hre.ethers.getContractFactory(contract_name);
        const contract = await factory.attach(taskArgs.address)
        await contract.connect(acc1).mint(taskArgs.ownerAddress, taskArgs.url)
    });
