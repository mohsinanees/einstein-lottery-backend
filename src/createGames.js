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

async function createGame(poolId, startTime, endTime) {
  let latestGameNumber = await contract.methods.poolGameCounter(poolId).call()
  console.log("Latest Game Number: " + latestGameNumber);
  let winnerCheck = await db.getItem(`winner.${poolId}.${latestGameNumber}`);
  if (!winnerCheck) {
    throw new Error("Winners announcement pending for current game");
  }
  const receipt = await contract.methods
    .createGame(poolId, startTime, endTime)
    .send({ from: bsc_signer_address, chainId: bsc_chainId });
  console.log(receipt);
}

// Pool 1
cron.schedule("50 59 09 * * *", async () => {
  if (!isCronJobRunning1) {
    isCronJobRunning1 = true;
    const poolId = 1;
    while (true) {
      try {
        console.log("Creating latest game for Pool 1...");
        let startTime = Math.floor(
          new Date(new Date().setUTCHours(9, 0, 0, 0)).getTime() / 1000
        );
        let endTime = Math.floor(
          new Date(new Date().setUTCHours(8, 59, 0, 0)).getTime() / 1000
        );
        await createGame(poolId, startTime, endTime);
        break;
      } catch (error) {
        console.error("Error creating latest game for Pool 1: ", error);
        if (error.message.includes("Winners announcement pending for current game")) {
          await new Promise(resolve => setTimeout(resolve, 20000)); // 20 secs
        }
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
cron.schedule("50 59 11 * * *", async () => {
  if (!isCronJobRunning2) {
    isCronJobRunning2 = true;
    const poolId = 2;
    while (true) {
      try {
        console.log("Creating latest game for Pool 2...");
        let startTime = Math.floor(
          new Date(new Date().setUTCHours(11, 0, 0, 0)).getTime() / 1000
        );
        let endTime = Math.floor(
          new Date(new Date().setUTCHours(10, 59, 0, 0)).getTime() / 1000
        );
        await createGame(poolId, startTime, endTime);
        break;
      } catch (error) {
        console.error("Error creating latest game for Pool 2: ", error);
        if (error.message.includes("Winners announcement pending for current game")) {
          await new Promise(resolve => setTimeout(resolve, 20000)); // 20 secs
        }
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
cron.schedule("50 59 13 * * *", async () => {
  if (!isCronJobRunning3) {
    isCronJobRunning3 = true;
    const poolId = 3;
    while (true) {
      try {
        console.log("Creating latest game for Pool 3...");
        let startTime = Math.floor(
          new Date(new Date().setUTCHours(13, 0, 0, 0)).getTime() / 1000
        );
        let endTime = Math.floor(
          new Date(new Date().setUTCHours(12, 59, 0, 0)).getTime() / 1000
        );
        await createGame(poolId, startTime, endTime);
        break;
      } catch (error) {
        console.error("Error creating latest game for Pool 3: ", error);
        if (error.message.includes("Winners announcement pending for current game")) {
          await new Promise(resolve => setTimeout(resolve, 20000)); // 20 secs
        }
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
cron.schedule("50 59 15 * * *", async () => {
  if (!isCronJobRunning4) {
    isCronJobRunning4 = true;
    const poolId = 4;
    while (true) {
      try {
        console.log("Creating latest game for Pool 4...");
        let startTime = Math.floor(
          new Date(new Date().setUTCHours(15, 0, 0, 0)).getTime() / 1000
        );
        let endTime = Math.floor(
          new Date(new Date().setUTCHours(14, 59, 0, 0)).getTime() / 1000
        );
        await createGame(poolId, startTime, endTime);
        break;
      } catch (error) {
        console.error("Error creating latest game for Pool 4: ", error);
        if (error.message.includes("Winners announcement pending for current game")) {
          await new Promise(resolve => setTimeout(resolve, 20000)); // 20 secs
        }
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
cron.schedule("50 59 17 * * *", async () => {
  if (!isCronJobRunning5) {
    isCronJobRunning5 = true;
    const poolId = 5
    while (true) {
      try {
        console.log("Creating latest game for Pool 5...");
        let startTime = Math.floor(
          new Date(new Date().setUTCHours(17, 0, 0, 0)).getTime() / 1000
        );
        let endTime = Math.floor(
          new Date(new Date().setUTCHours(16, 59, 0, 0)).getTime() / 1000
        );
        await createGame(poolId, startTime, endTime);
        break;
      } catch (error) {
        console.error("Error creating latest game for Pool 5: ", error);
        if (error.message.includes("Winners announcement pending for current game")) {
          await new Promise(resolve => setTimeout(resolve, 20000)); // 20 secs
        }
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