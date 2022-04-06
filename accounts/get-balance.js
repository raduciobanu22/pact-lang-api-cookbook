const HELP = `Usage example: \n\nnode get-balance.js k:{public-key} -- Replace {public-key} with an actual key`;

const Pact = require("pact-lang-api");
const NETWORK_ID = "testnet04";
const CHAIN_ID = "1";
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;
const KEY_PAIR = {
  publicKey: "",
  secretKey: ""
};

const creationTime = () => Math.round(new Date().getTime() / 1000);

if (process.argv.length !== 3) {
  console.log(process.argv);
  console.info(HELP);
  process.exit(1);
}

if (KEY_PAIR.publicKey === "" || KEY_PAIR.secretKey === "") {
  console.error("Please set a key pair");
  process.exit(1);
}

getBalance(process.argv[2]);

async function getBalance(account) {
  const cmd = {
    networkId: NETWORK_ID,
    keyPairs: KEY_PAIR,
    pactCode: `(coin.get-balance "${account}")`,
    envData: {},
    meta: {
      creationTime: creationTime(),
      ttl: 28000,
      gasLimit: 600,
      chainId: CHAIN_ID,
      gasPrice: 0.0000001,
      sender: KEY_PAIR.publicKey
    }
  };

  const result = await Pact.fetch.local(cmd, API_HOST);
  console.log(result);
}
