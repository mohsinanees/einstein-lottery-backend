const db = require("quick.db");

async function initDB() {
    let lastBlockNumber;
    let winnerCheck;
    let nftCheck;
    let voucherCheck;
    let gamesCheck;

    try {
        lastBlockNumber = await db.get("lastBlockNumber");
        winnerCheck = await db.get("winner");
        if (!winnerCheck && !lastBlockNumber) {
            throw new Error("Missing lastBlockNumber or winner data");
        }
    } catch (error) {
        let winner = {};
        for (let i = 1; i <= 5; i++) {
            winner[i] = {};
        }
        db.set("lastBlockNumber", 0);
        db.set("winner", winner);
        lastBlockNumber = 0;
    }

    try {
        nftCheck = await db.get("nft");
        if (!nftCheck) {
            throw new Error("Missing NFT data");
        }
    } catch (error) {
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

    try {
        voucherCheck = await db.get("voucher");
        if (!voucherCheck) {
            throw new Error("Missing Voucher data");
        }
    } catch (error) {
        let voucher = {};
        db.set("voucher", voucher);
    }

    try {
        gamesCheck = await db.get("games");
        if (!gamesCheck) {
            throw new Error("Missing games data");
        }
    } catch (error) {
        let game = {};
        db.set("game", game);
    }

    return lastBlockNumber;
}

async function setItem(key, value) {
    await db.set(key, value);
}

async function getItem(key) {
    return await db.get(key);
}

async function push(key, value) {
    await db.push(key, value);
}

module.exports = { initDB, setItem, getItem, push };