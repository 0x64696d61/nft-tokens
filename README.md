# NFT contracts
ERC721 token and ERC1155

## Deploy to rinkeby network:
```
npx hardhat run --network rinkeby scripts/deployMyTokenErc1155.ts
npx hardhat run --network rinkeby scripts/deployMyTokenErc721.ts

```
## HardHat tasks:
mint tokens ERC721
```
npx hardhat MyTokenERC721_mint --address 0xF490f731D6298c9d1172196f69E3Ea9a6D4FAe4A --owner-address 0x7620B8FC45f0F445471Aa9534C3836d290CC6d93 --url ipfs://QmUiMGzVvv9K7qXpMfhbQQXycyhS1jFPwZMHKD1jjavfbF --network rinkeby
```

mint tokens ERC1155
```
npx hardhat MyTokenERC1155_mint --address 0x25f618018865567bf3a6BD25570e1e92f18bf07C --owner-address 0x7620B8FC45f0F445471Aa9534C3836d290CC6d93 --amount 1000 --network rinkeby
```


ERC721 contract address:
[0xF490f731D6298c9d1172196f69E3Ea9a6D4FAe4A](https://rinkeby.etherscan.io/address/0xF490f731D6298c9d1172196f69E3Ea9a6D4FAe4A
)

ERC1155 contract address:
[0x25f618018865567bf3a6BD25570e1e92f18bf07C](https://rinkeby.etherscan.io/token/0x25f618018865567bf3a6BD25570e1e92f18bf07C
)

ERC1155 token on OpenSea
https://testnets.opensea.io/assets/0x25f618018865567bf3a6bd25570e1e92f18bf07c/1

ERC721 token on OpenSea
https://testnets.opensea.io/assets/0xF490f731D6298c9d1172196f69E3Ea9a6D4FAe4A/1
