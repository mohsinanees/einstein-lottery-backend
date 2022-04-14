const db = require("./db");
const express = require("express");
const app = express();
var cors = require("cors");
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const { default: Web3 } = require("web3");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/winners/", async (req, res) => {
  const params = req.query;
  let poolId;
  let gameNumber;
  try {
    if (!params.poolId || !params.gameNumber) {
      throw new Error("Missing poolId or gameNumber");
    }
    poolId = Number.parseInt(params.poolId);
    gameNumber = Number.parseInt(params.gameNumber);
    if (Number.isNaN(poolId) || Number.isNaN(gameNumber)) {
      throw new Error("Invalid poolId or gameNumber");
    }
  } catch (error) {
    res.status(400).send("Bad request: " + error);
    return;
  }
  console.warn("Fetching winners for Pool " + poolId + " Game " + gameNumber);
  const winners = await db.getItem(`winner.${poolId}.${gameNumber}`);

  if (winners) {
    res.status(200).send(winners);
  } else {
    res
      .status(200)
      .json({});
  }
});

app.get("/get/voucher/", async (req, res) => {
  const params = req.query;
  let address;
  try {
    if (!params.address) {
      throw new Error("Missing address");
    }
    address = params.address;
    if (!Web3.utils.isAddress(address)) {
      throw new Error("Invalid address");
    }
  } catch (error) {
    res.status(400).send("Bad request: " + error);
    return;
  }
  console.warn("Fetching voucher for address " + address);
  const voucher = await db.getItem(`voucher.${address}`);
  if (voucher) {
    res.status(200).send(voucher);
  } else {
    res.status(404).send("No voucher found for the requested address");
  }
})

app.post("/store/voucher/", async (req, res) => {
  const params = req.body;
  let voucher;
  try {
    if (!params.voucher) {
      throw new Error("Missing voucher");
    } else {
      if (typeof params.voucher !== 'string') {
        voucher = params.voucher;
      } else {
        voucher = JSON.parse(params.voucher);
      }
    }
    if (!voucher.recipient) {
      throw new Error("Missing recipient from voucher");
    }
    if (!voucher.amount) {
      throw new Error("Missing amount from voucher");
    }
    if (!voucher.nonce) {
      throw new Error("Missing nonce from voucher");
    }
    if (!voucher.expiry) {
      throw new Error("Missing expiry from voucher");
    }
    if (!voucher.signature) {
      throw new Error("Missing signature from voucher");
    }
  } catch (error) {
    res.status(400).send("Bad request: " + error);
    return;
  }
  const recipient = voucher.recipient;
  db.setItem(`voucher.${recipient}`, voucher);
  res.status(200).send("Voucher stored successfully against the address: " + recipient);
});

app.listen(port, () => console.log(`Lottery app listening on port ${port}!`));
