import {expect} from "chai";
import {ethers, network} from "hardhat";

describe("MyTokenERC1155", function () {
    const type = 1
    const type2 = 2
    const value = 10
    const data = '0x12345678'
    let acc1: any
    let acc3: any
    let acc2: any
    let contract: any

    beforeEach(async function () {

        [acc1, acc2, acc3] = await ethers.getSigners()

        let Contract = await ethers.getContractFactory('MyTokenERC1155', acc1)
        contract = await Contract.deploy();
        await contract.deployed()
    })

    it("Should be deployed", async function () {
        expect(contract.address).to.be.properAddress
    })

    // MUST revert if `_to` is the zero address.
    // MUST revert if balance of holder for token `_id` is lower than the `_value` sent.
    // MUST emit the `TransferSingle` event to reflect the balance change (see "Safe Transfer Rules" section of the standard).
//!TODO After the above conditions are met, this function MUST check if `_to` is a smart contract (e.g. code size > 0). If so, it MUST call `onERC1155Received` on `_to` and act appropriately (see "Safe Transfer Rules" section of the standard).

    describe("safeTransferFrom method", function () {
        it("Should be reverted if TO is zero address", async function () {
            await expect(contract.safeTransferFrom(acc1.address, ethers.constants.AddressZero, type, value, data)).to.be.revertedWith('ERC1155: transfer to the zero address');
        })
        it("Should be reverted if balance of holder for token `_id` is lower than the `_value` sent", async function () {
            await contract.safeTransferFrom(acc1.address, acc2.address, type, value, data)

            await expect(contract.connect(acc2).safeTransferFrom(acc2.address, acc1.address, type, value + 1, data)).to.be.revertedWith('ERC1155: insufficient balance for transfer');
        })
        it("Should be possible transfer token", async function () {
            let balance_before = await contract.balanceOf(acc2.address, type)
            await contract.safeTransferFrom(acc1.address, acc2.address, type, value, data)

            expect(await contract.balanceOf(acc2.address, type)).to.be.equal(balance_before.add(value))
        })

        it("Should be reverted if TO is no contract(code size > 0)", async function () {
            let balance_before = await contract.balanceOf(acc2.address, type)
            console.log(await contract.Selector)
            await contract.safeTransferFrom(acc1.address, acc2.address, type, value, data)

                //  expect(await contract.safeTransferFrom(acc1.address, acc2.address, type, value, data)).to
        })


        it("Emits an TransferSingle event", async function () {
            await expect(await contract.safeTransferFrom(acc1.address, acc2.address, type, value, data)).to.emit(contract, "TransferSingle").withArgs(acc1.address, acc1.address, acc2.address, type, value)
        })


    })


    /**
     TODO After the above conditions are met, this function MUST check if `_to` is a smart contract (e.g. code size > 0). If so, it MUST call `onERC1155Received` on `_to` and act appropriately (see "Safe Transfer Rules" section of the standard).

     @notice Transfers `_values` amount(s) of `_ids` from the `_from` address to the `_to` address specified (with safety call).
     @dev Caller must be approved to manage the tokens being transferred out of the `_from` account (see "Approval" section of the standard).
     MUST revert if `_to` is the zero address.
     MUST revert if length of `_ids` is not the same as length of `_values`.
     MUST revert if any of the balance(s) of the holder(s) for token(s) in `_ids` is lower than the respective amount(s) in `_values` sent to the recipient.
     MUST emit `TransferSingle` or `TransferBatch` event(s) such that all the balance changes are reflected (see "Safe Transfer Rules" section of the standard).
     Balance changes and events MUST follow the ordering of the arrays (_ids[0]/_values[0] before _ids[1]/_values[1], etc).
     After the above conditions for the transfer(s) in the batch are met, this function MUST check if `_to` is a smart contract (e.g. code size > 0). If so, it MUST call the relevant `ERC1155TokenReceiver` hook(s) on `_to` and act appropriately (see "Safe Transfer Rules" section of the standard).
     @param _from    Source address
     @param _to      Target address
     @param _ids     IDs of each token type (order and length must match _values array)
     @param _values  Transfer amounts per token type (order and length must match _ids array)
     @param _data    Additional data with no specified format, MUST be sent unaltered in call to the `ERC1155TokenReceiver` hook(s) on `_to`
     */

    describe("safeBatchTransferFrom method", function () {
        it("Should be reverted if TO is zero address", async function () {
            await expect(contract.safeBatchTransferFrom(acc1.address, ethers.constants.AddressZero, [type, type2], [value, value], data)).to.be.revertedWith('ERC1155: transfer to the zero address');
        })
        it("Should be reverted if length of ids is not the same as length of values. ids < values", async function () {
            await expect(contract.safeBatchTransferFrom(acc1.address, acc2.address, [type], [value, value], data)).to.be.revertedWith('ERC1155: ids and amounts length mismatch');
        })
        it("Should be reverted if length of ids is not the same as length of values. ids > values", async function () {
            await expect(contract.safeBatchTransferFrom(acc1.address, acc2.address, [type, type2], [value], data)).to.be.revertedWith('ERC1155: ids and amounts length mismatch');
        })
        it("Should be reverted if any of the balance(s) of the holder(s) for token(s) in `_ids` is lower than the respective amount(s) in `_values` sent to the recipient.", async function () {
            await contract.safeTransferFrom(acc1.address, acc2.address, type, value, data)
            await contract.safeTransferFrom(acc1.address, acc2.address, type2, value, data)

            await expect(contract.connect(acc2).safeBatchTransferFrom(acc2.address, acc1.address, [type, type2], [value, value + 1], data)).to.be.revertedWith('ERC1155: insufficient balance for transfer');
        })
        it("Should be possible transfers many tokens", async function () {
            await contract.safeBatchTransferFrom(acc1.address, acc2.address, [type, type2], [value, value], data)
            let balances = await contract.balanceOfBatch([acc2.address, acc2.address], [type, type2])

            expect(value).to.be.equal(balances[0])
            expect(value).to.be.equal(balances[1])
        })
        it("Emits an TransferSingle event", async function () {
            await expect(await contract.safeBatchTransferFrom(acc1.address, acc2.address, [type, type2], [value, value], data)).to.emit(contract, "TransferBatch").withArgs(acc1.address, acc1.address, acc2.address, [type, type2], [value, value])
        })
    })

    /**
     @notice Get the balance of an account's tokens.
     @param _owner  The address of the token holder
     @param _id     ID of the token
     @return        The _owner's balance of the token type requested
     */
    it("Should be possible get address balance", async function () {
        await contract.safeTransferFrom(acc1.address, acc2.address, type, value, data)

        expect(await contract.connect(acc2).balanceOf(acc2.address, type)).to.be.equal(value)
    })

    /**
     @notice Get the balance of multiple account/token pairs
     @param _owners The addresses of the token holders
     @param _ids    ID of the tokens
     @return        The _owner's balance of the token types requested (i.e. balance for each (owner, id) pair)
     */

    it("Should be possible get multiply addresses balance", async function () {
        await contract.safeTransferFrom(acc1.address, acc2.address, type, value, data)
        await contract.safeTransferFrom(acc1.address, acc3.address, type2, value + 1, data)
        let balances = await contract.balanceOfBatch([acc2.address, acc3.address], [type, type2])

        expect(balances[0]).to.be.equal(value)
        expect(balances[1]).to.be.equal(value + 1)

    })

    /**
     @notice Enable or disable approval for a third party ("operator") to manage all of the caller's tokens.
     @dev MUST emit the ApprovalForAll event on success.
     @param _operator  Address to add to the set of authorized operators
     @param _approved  True if the operator is approved, false to revoke approval
     */

    describe("setApprovalForAll method", function () {

        it("Should be possible approve all tokens", async function () {
            await contract.setApprovalForAll(acc2.address, true)

            expect(await contract.isApprovedForAll(acc1.address, acc2.address)).to.be.true
        })
        it("Should be possible disable approve for all tokens", async function () {
            await contract.setApprovalForAll(acc2.address, true)
            await contract.setApprovalForAll(acc2.address, false)

            expect(await contract.isApprovedForAll(acc1.address, acc2.address)).to.be.false
        })
        it('Emits an ApprovalForAll event', async function () {
            expect(await contract.isApprovedForAll(acc1.address, acc2.address)).to.emit(contract, "ApprovalForAll").withArgs(acc1.address, acc2.address, true)
        });

    })

    describe("supports interface ERC165", function ()  {
        it("Should be support ERC165 interface", async () =>{
            expect(await contract.supportsInterface("0x01ffc9a7")).to.equal(true);
        });

        it("Should NOT supported ERC165 interface", async () =>{
            expect(await contract.supportsInterface("0xDDDDDDDD")).to.equal(false);
        });
    });

    describe("mint method", function ()  {
        it("Should be support mint new tokens", async () =>{
            await contract.mint(acc1.address, 1000)
            let tokenType = contract.tokenIds()
            expect(await contract.balanceOf(acc1.address, tokenType)).to.be.equal(1000);
        });
    });

});
