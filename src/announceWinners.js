const cron = require("node-cron");
const Web3 = require("web3");
const HDWalletProvider = require("truffle-hdwallet-provider"); //HD Wallet provider
const network = process.env.BSC_NETWORK || "rinkeby";
const {
  bsc_mnemonic,
  bsc_rpc_provider,
  bsc_web_socket_provider,
  lottery_contract_address,
  bsc_chainId,
  bsc_signer_address,
  winner_cron_exp,
} = require("../config")[network];

const contractABI = require(`../artifacts/EinsteinLottery.json`);
const contractAddress = lottery_contract_address;

const web3 = new Web3(new HDWalletProvider(bsc_mnemonic, bsc_rpc_provider));
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function announceWinners() {
  for (let i = 1; i <= 5;) {
    try {
      let poolId = i;
      let gameNumber = await contract.methods.poolGameCounter(poolId).call();
      const receipt = await contract.methods
        .announceWinners(poolId, gameNumber)
        .send({ from: bsc_signer_address, chainId: bsc_chainId });
      console.log(receipt);
      i++;
    } catch (error) {
      console.log(error);
    }
  }
}

async function createGames() {
  for (let i = 1; i <= 5;) {
    try {
      let poolId = i;
      let startTime = Math.floor(
        new Date(new Date().setHours(5, 0, 0, 0)).getTime() / 1000
      );
      let endTime = Math.floor(
        new Date(new Date().setHours(28, 59, 59, 999)).getTime() / 1000
      );
      const receipt = await contract.methods
        .createGame(poolId, startTime, endTime)
        .send({ from: bsc_signer_address, chainId: bsc_chainId });
      console.log(receipt);
      i++;
    } catch (error) {
      console.log(error);
    }
  }
}

cron.schedule(winner_cron_exp, async () => {
  console.log("Announcing winners...");
  await announceWinners();
  console.log("Creating games...");
  await createGames();
});
