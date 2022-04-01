import {expect} from "chai";
import {ethers, network} from "hardhat";
import {any} from "hardhat/internal/core/params/argumentTypes";

describe("MyTokenERC721", function () {
    const contractName = 'My first ERC721 NFT contract'
    const contractSymbol = 'MFT'
    const tokenUrl = 'xxx.xx'
    const tokenId = 1

    let acc1: any
    let acc2: any
    let acc3: any
    let contract: any

    beforeEach(async function () {

        [acc1, acc2, acc3] = await ethers.getSigners()

        let Contract = await ethers.getContractFactory('MyTokenERC721', acc1)
        contract = await Contract.deploy();
        await contract.deployed()
        await contract.mint(acc1.address, tokenUrl)
    })

    it("Should be deployed", async function () {
        expect(contract.address).to.be.properAddress
    })
    it("Should have getter name", async function () {
        expect(await contract.name()).to.be.equal(contractName)
    })
    it("Should have getter symbol", async function () {
        expect(await contract.symbol()).to.be.equal(contractSymbol)
    })

    it("Should be possible get tokenUrl", async function () {
        expect(await contract.tokenURI(tokenId)).to.be.equal(tokenUrl);
    })

    it("Should be possible get balance", async function () {
        await contract.mint(acc1.address, tokenUrl)

        expect(await contract.balanceOf(acc1.address)).eq(2)
    })
    describe("ownerOf method", function () {
        it("Should be possible get token owner address", async function () {
            expect(await contract.ownerOf(tokenId)).to.be.equal(acc1.address)
        })
        it("Should be reverted if token owner not exist", async function () {
            await expect(contract.ownerOf(999)).to.be.revertedWith('ERC721: owner query for nonexistent token')
        })
    })


    // test for onERC721Received required
    // it("If to refers to a smart contract, it must implement IERC721Receiver.onERC721Received, which is called upon a safe transfer.", async function () {
    //     await console.log(contract.onERC721Received(acc1.address, acc1.address, tokenId))
    // })
    describe("safeTransferFrom method", function () {
        it("Should be possible safeTransferFrom token", async function () {
            await contract['safeTransferFrom(address,address,uint256)'](acc1.address, acc2.address, tokenId);

            expect(await contract.ownerOf(1)).to.be.equal(acc2.address)
        })
        it("TO cannot be the zero address", async function () {
            await expect(contract['safeTransferFrom(address,address,uint256)'](ethers.constants.AddressZero, acc1.address, tokenId)).to.be.revertedWith('ERC721: transfer from incorrect owner')
        })
        it("tokenId token must exist", async function () {
            await expect(contract['safeTransferFrom(address,address,uint256)'](acc1.address, acc2.address, 999)).to.be.revertedWith('ERC721: operator query for nonexistent token')
        })
        it("tokenId token must be owned by from", async function () {
            await expect(contract['safeTransferFrom(address,address,uint256)'](acc2.address, acc1.address, tokenId)).to.be.revertedWith('ERC721: transfer from incorrect owner')
        })
        it("If the caller is not from, it must be have been allowed to move this token by either", async function () {
            await contract.approve(acc2.address, tokenId)
            await contract.connect(acc2)['safeTransferFrom(address,address,uint256)'](acc1.address, acc2.address, tokenId)

            expect(await contract.ownerOf(tokenId)).to.be.equal(acc2.address)
        })
    })

    describe("approve method", function () {
        it("Should be possible approve token", async function () {
            await contract.approve(acc2.address, tokenId);
            expect(await contract.getApproved(tokenId)).to.be.equal(acc2.address)
        })

        it("Emit an Approval event", async function () {
            await contract.approve(acc2.address, tokenId)

            await expect(await contract.approve(acc2.address, tokenId)).to.emit(contract, "Approval").withArgs(acc1.address, acc2.address, tokenId)
        })
    })

    describe("approved method", function () {

        it("Should be possible get approved token addresses", async function () {
            await contract.approve(acc2.address, tokenId);
            expect(await contract.getApproved(tokenId)).to.be.equal(acc2.address)
        })
        it("Should be return zero address if no approved addresses for this token", async function () {
            expect(await contract.connect(acc2).getApproved(tokenId)).to.be.equal(ethers.constants.AddressZero)
        })
    })

    describe("setApprovalForAll method", function () {
        it("The operator cannot be the caller", async function () {
            await expect(contract.setApprovalForAll(acc1.address, true)).to.be.revertedWith('ERC721: approve to caller')
        })
        it("Operator can approve all tokens to another user", async function () {
            await contract.mint(acc1.address, tokenUrl)
            await contract.setApprovalForAll(acc2.address, true)

            await expect(await contract.isApprovedForAll(acc1.address, acc2.address)).to.be.true
        })
        it("Operators can call safeTransferFrom", async function () {
            await contract.setApprovalForAll(acc2.address, tokenId)
            await contract.connect(acc2)['safeTransferFrom(address,address,uint256)'](acc1.address, acc2.address, tokenId)

            await expect(await contract.ownerOf(tokenId)).to.be.equal(acc2.address)
        })
        it("Emits an ApprovalForAll event", async function () {
            await contract.setApprovalForAll(acc2.address, tokenId)

            await expect(await contract.setApprovalForAll(acc2.address, true)).to.emit(contract, "ApprovalForAll").withArgs(acc1.address, acc2.address, true)
        })
    })

    describe("isApprovedForAll method", function () {
        it("Should be possible check approve for tokens ", async function () {
            contract.setApprovalForAll(acc2.address, true)

            expect(await contract.isApprovedForAll(acc1.address, acc2.address)).to.be.true
        })
    })

    describe("supports interface ERC165", function () {
        it("Should be support ERC165 interface", async () => {
            expect(await contract.supportsInterface("0x01ffc9a7")).to.equal(true);
        });

        it("Should NOT supported ERC165 interface", async () => {
            expect(await contract.supportsInterface("0xDDDDDDDD")).to.equal(false);
        });
    });
    describe("mint method", function () {
        let tokenType: any

        beforeEach(async function () {
            await contract.mint(acc1.address, 'myUrl')
            tokenType = await contract.tokenIds()
        })
        it("Should be support mint new tokens", async () => {
            expect(await contract.tokenURI(tokenType)).to.be.equal('myUrl');
        });
        it("Check token owner", async () => {
            expect(await contract.ownerOf(tokenType)).to.be.equal(acc1.address);
        });
    });
});
