const cron = require('node-cron');
var moment = require('moment-timezone');
moment().tz("Europe/London").format();
const Web3 = require("web3");
const db = require("./db");
const HDWalletProvider = require("truffle-hdwallet-provider"); //HD Wallet provider
const env = process.env.NODE_ENV || "development";
const { bsc_mnemonic, bsc_rpc_provider, bsc_web_socket_provider,
    lottery_contract_address, winner_cron_exp, lottery_start_block_number,
    matic_mnemonic, matic_rpc_provider, matic_web_socket_provider,
    nft_contract_address, matic_signer_address } = require("../config")[env];
const lotteryContractABI = require(`../artifacts/EinsteinLottery.json`);
const lotteryContractAddress = lottery_contract_address;
const nftContractABI = require(`../artifacts/EinsteinNFT.json`);
const nftContractAddress = nft_contract_address;

const bscWeb3 = new Web3(
    new HDWalletProvider(bsc_mnemonic, bsc_rpc_provider),
);
const bscWeb3Socket = new Web3(
    new Web3.providers.WebsocketProvider(bsc_web_socket_provider)
);
const maticWeb3 = new Web3(
    new HDWalletProvider(matic_mnemonic, matic_rpc_provider),
);
const maticWeb3Socket = new Web3(
    new Web3.providers.WebsocketProvider(matic_web_socket_provider)
);
const lotteryContract = new bscWeb3.eth.Contract(lotteryContractABI, lotteryContractAddress);
const lotteryContractSocket = new bscWeb3Socket.eth.Contract(lotteryContractABI, lotteryContractAddress);
const nftContract = new maticWeb3.eth.Contract(nftContractABI, nftContractAddress);
const nftContractSocket = new maticWeb3Socket.eth.Contract(nftContractABI, nftContractAddress);

let isCronJobRunning = false;

nftContractSocket.events.Transfer({
    fromBlock: lottery_start_block_number,
}).on("data", async (event) => {
    await db.initDB();
    if (event.returnValues.from != "0x0000000000000000000000000000000000000000") {
        try {
            let tokenId = parseInt(event.returnValues.id);
            let claimedNft;
            let poolId;
            if (tokenId % 2500 <= 1000) {
                let availableNfts = await db.getItem(`nft.available.1`);
                if (availableNfts.includes(tokenId)) {
                    let index = availableNfts.indexOf(tokenId);
                    claimedNft = availableNfts.splice(index, 1);
                    poolId = 1;
                    await db.setItem(`nft.available.1`, availableNfts);
                } else {
                    claimedNft = null;
                }
            }
            else if (tokenId % 2500 <= 1600) {
                let availableNfts = await db.getItem(`nft.available.2`);
                if (availableNfts.includes(tokenId)) {
                    let index = availableNfts.indexOf(tokenId);
                    claimedNft = availableNfts.splice(index, 1);
                    poolId = 2;
                    await db.setItem(`nft.available.2`, availableNfts);
                } else {
                    claimedNft = null;
                }
            }
            else if (tokenId % 2500 <= 2100) {
                let availableNfts = await db.getItem(`nft.available.3`);
                if (availableNfts.includes(tokenId)) {
                    let index = availableNfts.indexOf(tokenId);
                    claimedNft = availableNfts.splice(index, 1);
                    poolId = 1;
                    await db.setItem(`nft.available.3`, availableNfts);
                } else {
                    claimedNft = null;
                }
            }
            else if (tokenId % 2500 <= 2400) {
                let availableNfts = await db.getItem(`nft.available.4`);
                if (availableNfts.includes(tokenId)) {
                    let index = availableNfts.indexOf(tokenId);
                    claimedNft = availableNfts.splice(index, 1);
                    poolId = 1;
                    await db.setItem(`nft.available.4`, availableNfts);
                } else {
                    claimedNft = null;
                }
            } else {
                let availableNfts = await db.getItem(`nft.available.5`);
                if (availableNfts.includes(tokenId)) {
                    let index = availableNfts.indexOf(tokenId);
                    claimedNft = availableNfts.splice(index, 1);
                    poolId = 1;
                    await db.setItem(`nft.available.5`, availableNfts);
                } else {
                    claimedNft = null;
                }
            }
            if (claimedNft) {
                await db.push(`nft.claimed.${poolId}`, claimedNft[0]);
                console.log("Claimed NFTs: " + await db.getItem(`nft.claimed.${poolId}`));
            }
        } catch (error) {
            console.log(error);
        }
    }
});

async function transferNFTs(poolId, gameNumber, winners) {
    let remainingWinners = [...winners];
    let transferredNFTs = [];
    let availableNfts = await db.getItem(`nft.available.${poolId}`);
    while (remainingWinners.length > 0) {
        console.log("Remaining Winners: " + remainingWinners);
        console.log("Remaining length: " + remainingWinners.length);
        // Checking if all NFTs have been claimed in this pool
        if (availableNfts.length == 0) {
            console.log("Error: No more NFTs available, All NFTs have been claimed in Pool: " + poolId);
            break;
        }
        let winner = remainingWinners.shift();
        console.log("winner: " + winner);
        let tokenId;
        while (true) {
            tokenId = availableNfts.shift();
            // tokenId = availableNfts[Math.floor(Math.random() * availableNfts.length - 1)];
            let tokenOwner = await nftContract.methods.ownerOf(tokenId).call();
            if (tokenOwner !== matic_signer_address) {
                console.log("Different Token Owner detected, pushing to DB")
                console.log("Token Owner: " + tokenOwner + " Token ID: " + tokenId);
                availableNfts.splice(availableNfts.indexOf(tokenId), 1);
                await db.push("nft.claimed." + poolId, tokenId);
                await db.setItem("nft.available." + poolId, availableNfts);
            } else {
                break;
            }
        }
        console.log("New Token ID: " + tokenId);
        console.log("Transferring Token ID: " + tokenId + " to " + winner);
        try {
            let receipt = await nftContract.methods.safeTransferFrom(matic_signer_address, winner, tokenId).send({ from: matic_signer_address, gas: 1000000 });
            console.log(receipt);
            transferredNFTs.push(tokenId);
            availableNfts.splice(availableNfts.indexOf(tokenId), 1);
            await db.push("nft.claimed." + poolId, tokenId);
            await db.setItem("nft.available." + poolId, availableNfts);
            await db.setItem(`winner.${poolId}.${gameNumber}.${winner}`, tokenId);

            // Iterate until all winners have been transferred NFTs
            if (transferredNFTs.length == winners.length) {
                console.log("Pool ID: " + poolId);
                console.log("Game Number: " + gameNumber);
                console.log("Winners: " + JSON.stringify(winners));
                console.log("Transferred NFTs: " + transferredNFTs);
            }
        } catch (error) {
            console.log(error);
            remainingWinners.unshift(winner);
            availableNfts.unshift(tokenId);
            await db.setItem("nft.available." + poolId, availableNfts);
        }
    }
    return transferredNFTs;
}

cron.schedule(winner_cron_exp, async () => {
    if (!isCronJobRunning) {
        isCronJobRunning = true;
        console.log('Fetching the latest winners...');
        let lastBlockNumber = await db.initDB();
        if (lastBlockNumber == 0) {
            lastBlockNumber = lottery_start_block_number;
        }
        console.log("lastBlockNumber: ", lastBlockNumber);
        try {
            const events = await lotteryContractSocket.getPastEvents("WinnersAnnounced", {
                fromBlock: lastBlockNumber,
                toBlock: "latest",
            });

            if (events.length > 0) {
                let poolId = events[0].returnValues.poolId;
                let gameNumber = events[0].returnValues.gameNumber;
                let winners = events[0].returnValues.winners;
                if (!(await db.getItem(`winner.${poolId}.${gameNumber}`))) {
                    let transferredNFTs = await transferNFTs(poolId, gameNumber, winners);
                    console.log("Transferred NFTs: " + transferredNFTs);
                } else {
                    console.log("Winners already claimed for Pool: " + poolId + " Game Number: " + gameNumber);
                }
            } else {
                console.log("No winners announced currently");
            }
            try {
                let currentBlockNumber = await bscWeb3.eth.getBlockNumber();
                await db.setItem("lastBlockNumber", currentBlockNumber);
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
        isCronJobRunning = false;
    } else {
        console.log("Cron job is already running");
    }

}, {
    scheduled: true,
    timezone: "Europe/London"
});