const cron = require("node-cron");
var moment = require('moment-timezone');
moment().tz("Europe/London").format();
const Web3 = require("web3");
const db = require("./db");
const HDWalletProvider = require("truffle-hdwallet-provider"); //HD Wallet provider
const env = process.env.NODE_ENV || "development";
const {
  bsc_mnemonic,
  bsc_rpc_provider,
  lottery_contract_address,
  bsc_chainId,
  bsc_signer_address,
} = require("../config")[env];

const contractABI = require(`../artifacts/EinsteinLottery.json`);
const contractAddress = lottery_contract_address;

const web3 = new Web3(new HDWalletProvider(bsc_mnemonic, bsc_rpc_provider));
const contract = new web3.eth.Contract(contractABI, contractAddress);

var isCronJobRunning1 = false;
var isCronJobRunning2 = false;
var isCronJobRunning3 = false;
var isCronJobRunning4 = false;
var isCronJobRunning5 = false;

async function announceWinners(poolId, latestGameNumber) {
  await db.initDB();
  let gameNumber;
  console.log("latest Game Number: " + latestGameNumber);
  if (latestGameNumber > 0) {
    let winnerCheck = await db.getItem(`winner.${poolId}.${latestGameNumber}`);
    if (winnerCheck) {
      throw new Error("Winners already announced for Pool: " + poolId + " Game Number: " + latestGameNumber);
    } else {
      gameNumber = latestGameNumber;
    }
    const receipt = await contract.methods
      .announceWinners(poolId, gameNumber)
      .send({ from: bsc_signer_address, chainId: bsc_chainId });
    console.log(receipt);
  } else {
    throw new Error("No Game found in the Pool: " + poolId);
  }
}

// Pool 1
cron.schedule("10 59 09 * * *", async () => {
  if (!isCronJobRunning1) {
    isCronJobRunning1 = true;
    // Announce winners for current game
    const poolId = 1;
    const latestGameNumber = await contract.methods.poolGameCounter(poolId).call();
    while (true) {
      try {
        console.log("Announcing winners for Pool 1...");
        await announceWinners(poolId, latestGameNumber);
        break;
      } catch (error) {
        console.error("Error announcing winners for Pool 1: ", error);
        if (error.message.includes("No game participants")) {
          await db.setItem(`winner.${poolId}.${latestGameNumber}`, "N/A")
          break;
        }
        if (error.message.includes("Winners already announced")) {
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 10000)); // wait for 10 secs
      }
    }
    isCronJobRunning1 = false;
  } else {
    console.log("Cron job for Pool 1 is already running.");
  }
}, {
  scheduled: true,
  timezone: "Europe/London",
});

// Pool 2
cron.schedule("10 59 11 * * *", async () => {
  if (!isCronJobRunning2) {
    isCronJobRunning2 = true;
    // Announce winners for current game
    const poolId = 2;
    const latestGameNumber = await contract.methods.poolGameCounter(poolId).call();
    while (true) {
      try {
        console.log("Announcing winners for Pool 2...");
        await announceWinners(poolId, latestGameNumber);
        break;
      } catch (error) {
        console.error("Error announcing winners for Pool 2: ", error);
        if (error.message.includes("No game participants")) {
          await db.setItem(`winner.${poolId}.${latestGameNumber}`, "N/A")
          break;
        }
        if (error.message.includes("Winners already announced")) {
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 10000)); // wait for 10 secs
      }
    }
    isCronJobRunning2 = false;
  } else {
    console.log("Cron job for Pool 2 is already running.");
  }
}, {
  scheduled: true,
  timezone: "Europe/London",
});

// Pool 3
cron.schedule("10 59 13 * * *", async () => {
  if (!isCronJobRunning3) {
    isCronJobRunning3 = true;
    // Announce winners for current game
    const poolId = 3;
    const latestGameNumber = await contract.methods.poolGameCounter(poolId).call();
    while (true) {
      try {
        console.log("Announcing winners for Pool 3...");
        await announceWinners(poolId, latestGameNumber);
        break;
      } catch (error) {
        console.error("Error announcing winners for Pool 3: ", error);
        if (error.message.includes("No game participants")) {
          await db.setItem(`winner.${poolId}.${latestGameNumber}`, "N/A")
          break;
        }
        if (error.message.includes("Winners already announced")) {
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 10000)); // wait for 10 secs
      }
    }
    isCronJobRunning3 = false;
  } else {
    console.log("Cron job for Pool 3 is already running.");
  }
}, {
  scheduled: true,
  timezone: "Europe/London",
});

// Pool 4
cron.schedule("10 59 15 * * *", async () => {
  if (!isCronJobRunning4) {
    isCronJobRunning4 = true;
    // Announce winners for current game
    const poolId = 4;
    const latestGameNumber = await contract.methods.poolGameCounter(poolId).call();
    while (true) {
      try {
        console.log("Announcing winners for Pool 4...");
        await announceWinners(poolId, latestGameNumber);
        break;
      } catch (error) {
        console.error("Error announcing winners for Pool 4: ", error);
        if (error.message.includes("No game participants")) {
          await db.setItem(`winner.${poolId}.${latestGameNumber}`, "N/A")
          break;
        }
        if (error.message.includes("Winners already announced")) {
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 10000)); // wait for 10 secs
      }
    }
    isCronJobRunning4 = false;
  } else {
    console.log("Cron job for Pool 4 is already running.");
  }
}, {
  scheduled: true,
  timezone: "Europe/London",
});

// Pool 5
cron.schedule("10 59 17 * * *", async () => {
  if (!isCronJobRunning5) {
    isCronJobRunning5 = true;
    // Announce winners for current game
    const poolId = 5;
    const latestGameNumber = await contract.methods.poolGameCounter(poolId).call();
    while (true) {
      try {
        console.log("Announcing winners for Pool 5...");
        await announceWinners(poolId, latestGameNumber);
        break;
      } catch (error) {
        console.error("Error announcing winners for Pool 5: ", error);
        if (error.message.includes("No game participants")) {
          await db.setItem(`winner.${poolId}.${latestGameNumber}`, "N/A")
          break;
        }
        if (error.message.includes("Winners already announced")) {
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 10000)); // wait for 10 secs
      }
    }
    isCronJobRunning5 = false;
  } else {
    console.log("Cron job for Pool 5 is already running.");
  }
}, {
  scheduled: true,
  timezone: "Europe/London",
});