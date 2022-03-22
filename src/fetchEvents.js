const cron = require('node-cron');
const Web3 = require("web3");
const db = require("quick.db");
const HDWalletProvider = require("truffle-hdwallet-provider"); //HD Wallet provider
const bsc_network = process.env.BSC_NETWORK || "rinkeby";
const matic_network = process.env.MATIC_NETWORK || "rinkeby";
const { bsc_mnemonic, bsc_rpc_provider, bsc_web_socket_provider,
    lottery_contract_address, nft_cron_exp, lottery_start_block_number } = require("../config")[bsc_network];
const { matic_mnemonic, matic_rpc_provider, matic_web_socket_provider,
    nft_contract_address, matic_signer_address } = require("../config")[matic_network];
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

async function initDB() {
    let lastBlockNumber = await db.get("lastBlockNumber");
    let winnerCheck = await db.get("winner");
    let nftCheck = await db.get("nft");
    if (!winnerCheck && !lastBlockNumber) {
        let winner = {};
        for (let i = 1; i <= 5; i++) {
            winner[i] = {};
        }
        db.set("lastBlockNumber", 0);
        db.set("winner", winner);
        lastBlockNumber = 0;
    }
    if (!nftCheck) {
        let nft = {};
        nft["available"] = {};
        nft["claimed"] = {};
        for (let i = 1; i <= 5; i++) {
            nft["available"][i] = [];
            nft["claimed"][i] = [];
        }
        for (let i = 1; i <= 10000; i++) {
            if (i % 2500 <= 1000) {
                nft["available"][1].push(i);
            }
            else if (i % 2500 <= 1600) {
                nft["available"][2].push(i);
            }
            else if (i % 2500 <= 2100) {
                nft["available"][3].push(i);
            }
            else if (i % 2500 <= 2400) {
                nft["available"][4].push(i);
            }
            else {
                nft["available"][5].push(i);
            }
        }
        db.set("nft", nft);
    }
    return lastBlockNumber;
}

nftContractSocket.events.Transfer({
    fromBlock: lottery_start_block_number,
}).on("data", async (event) => {
    await initDB();
    if (event.returnValues.from != "0x0000000000000000000000000000000000000000") {
        try {
            let tokenId = parseInt(event.returnValues.id);
            let claimedNft;
            let poolId;
            if (tokenId % 2500 <= 1000) {
                let availableNfts = await db.get(`nft.available.1`);
                if (availableNfts.includes(tokenId)) {
                    let index = availableNfts.indexOf(tokenId);
                    claimedNft = availableNfts.splice(index, 1);
                    poolId = 1;
                    db.set(`nft.available.1`, availableNfts);
                } else {
                    claimedNft = null;
                }
            }
            else if (tokenId % 2500 <= 1600) {
                let availableNfts = await db.get(`nft.available.2`);
                if (availableNfts.includes(tokenId)) {
                    let index = availableNfts.indexOf(tokenId);
                    claimedNft = availableNfts.splice(index, 1);
                    poolId = 2;
                    db.set(`nft.available.2`, availableNfts);
                } else {
                    claimedNft = null;
                }
            }
            else if (tokenId % 2500 <= 2100) {
                let availableNfts = await db.get(`nft.available.3`);
                if (availableNfts.includes(tokenId)) {
                    let index = availableNfts.indexOf(tokenId);
                    claimedNft = availableNfts.splice(index, 1);
                    poolId = 1;
                    db.set(`nft.available.3`, availableNfts);
                } else {
                    claimedNft = null;
                }
            }
            else if (tokenId % 2500 <= 2400) {
                let availableNfts = await db.get(`nft.available.4`);
                if (availableNfts.includes(tokenId)) {
                    let index = availableNfts.indexOf(tokenId);
                    claimedNft = availableNfts.splice(index, 1);
                    poolId = 1;
                    db.set(`nft.available.4`, availableNfts);
                } else {
                    claimedNft = null;
                }
            } else {
                let availableNfts = await db.get(`nft.available.5`);
                if (availableNfts.includes(tokenId)) {
                    let index = availableNfts.indexOf(tokenId);
                    claimedNft = availableNfts.splice(index, 1);
                    poolId = 1;
                    db.set(`nft.available.5`, availableNfts);
                } else {
                    claimedNft = null;
                }
            }
            if (claimedNft) {
                await db.push(`nft.claimed.${poolId}`, claimedNft[0]);
                console.log("Claimed NFTs: " + db.get(`nft.claimed.${poolId}`));
            }
        } catch (error) {
            console.log(error);
        }
    }
});

async function transferNFTs(poolId, gameNumber, winners) {
    let remainingWinners = [...winners];
    let transferredNFTs = [];
    let availableNfts = await db.get(`nft.available.${poolId}`);
    while (remainingWinners.length > 0) {
        console.log("Remaining Winners: " + remainingWinners);
        // Checking if all NFTs have been claimed in this pool
        if (availableNfts.length == 0) {
            console.log("Error: No more NFTs available, All NFTs have been claimed in Pool: " + poolId);
            break;
        }
        let winner = remainingWinners.shift();
        console.log("Remaining length: " + remainingWinners.length);
        console.log("winner: " + winner);
        let tokenId = availableNfts.shift();
        console.log("token id: " + tokenId);
        // let tokenId = availableNfts[Math.floor(Math.random() * availableNfts.length)];
        try {
            let tx = await nftContract.methods.safeTransferFrom(matic_signer_address, winner, tokenId).send({ from: matic_signer_address, gas: 1000000 });
            console.log(tx);
            transferredNFTs.push(tokenId);
            availableNfts.splice(availableNfts.indexOf(tokenId), 1);
            db.push("nft.claimed." + poolId, tokenId);
            db.set("nft.available." + poolId, availableNfts);
            db.set(`winner.${poolId}.${gameNumber}.${winner}`, tokenId);

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
        }
    }
    return transferredNFTs;
}

cron.schedule(nft_cron_exp, async () => {
    if (!isCronJobRunning) {
        isCronJobRunning = true;
        console.log('Fetching the latest winners...');
        let lastBlockNumber = await initDB();
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
                if (!db.get(`winner.${poolId}.${gameNumber}`)) {
                    let transferredNFTs = await transferNFTs(poolId, gameNumber, winners);
                    console.log("Transferred NFTs: " + transferredNFTs);
                    // db.set(`winner.${poolId}.${gameNumber}`, winners);
                } else {
                    console.log("Winners already claimed for this game");
                }
            } else {
                console.log("No winners announced currently");
            }
            try {
                let currentBlockNumber = await bscWeb3.eth.getBlockNumber();
                db.set("lastBlockNumber", currentBlockNumber);
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
});