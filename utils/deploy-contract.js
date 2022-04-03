const Pact = require("pact-lang-api");
const fs = require("fs");
const path = require("path");

const NETWORK_ID = "testnet04";
const CHAIN_ID = "1";
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;
const CONTRACT_PATH = path.join(__dirname, "/pact/hello-world.pact");

const KEY_PAIR = {
  //publicKey: "my-public-key",
  //secretKey: "my-private-key"
  publicKey: "a8225963cf8b1e13c9d27b567f889e34c6d8e2f3e70990d842a19782f1a3c399",
  secretKey: "582bcf88dda53aed78b9ae9000ea67bfd44e0c1bd3d8e3d2ae3a3dbc4fb65a88"
};

const creationTime = () => Math.round(new Date().getTime() / 1000) - 15;

deployContract();

async function deployContract() {
  const pactCode = fs.readFileSync(CONTRACT_PATH, "utf8");

  const cmd = {
    networkId: NETWORK_ID,
    keyPairs: KEY_PAIR,
    pactCode: pactCode,
    envData: {},
    meta: {
      creationTime: creationTime(),
      ttl: 28000,
      gasLimit: 65000,
      chainId: CHAIN_ID,
      gasPrice: 0.000001,
      sender: KEY_PAIR.publicKey
    }
  };
  const response = await Pact.fetch.send(cmd, API_HOST);
  console.log(`Request key: ${response.requestKeys[0]}`);
  console.log("Transaction pending...");
  const txResult = await Pact.fetch.listen(
    { listen: response.requestKeys[0] },
    API_HOST
  );
  console.log("Transaction mined!");
  console.log(txResult);
}
