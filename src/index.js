// require("./announceWinners");
// require("./fetchEvents");
const db = require("quick.db");
const express = require("express");
const app = express();
var cors = require("cors");
const port = process.env.PORT || 3000;

console.log(port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/winners/", async (req, res) => {
  const params = req.query;
  const poolId = Number.parseInt(params.poolId);
  const gameNumber = Number.parseInt(params.gameNumber);
  try {
    if (Number.isNaN(poolId) || Number.isNaN(gameNumber)) {
      throw new Error("Invalid poolId or gameNumber");
    }
  } catch (error) {
    res.status(400).send("Bad request");
    return;
  }

  const winners = db.get(`pool.${poolId}.${gameNumber}`);

  if (winners) {
    res.status(200).send(winners);
  } else {
    res
      .status(404)
      .send("No winners found for the requested poolId and gameNumber");
  }
});

app.listen(port, () => console.log(`Lottery app listening on port ${port}!`));
