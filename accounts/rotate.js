const HELP = "Usage example: \n\nnode rotate {account} {new-guard}";
const Pact = require("pact-lang-api");
const NETWORK_ID = "testnet04";
const CHAIN_ID = "1";
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;

const KEY_PAIR = {
  publicKey: "a5613bcbea7c5addcb55e8d59fab2b0ab9a792684977e2d3f682cce6f7d328e9",
  secretKey: "f1031a628eb9a0467460130b406c5a6f95399d2d17585b341deb94e4182d36ff"
};

const creationTime = () => Math.round(new Date().getTime() / 1000);

if (process.argv.length !== 4) {
  console.info(HELP);
  process.exit(1);
}

if (KEY_PAIR.publicKey === "" || KEY_PAIR.secretKey === "") {
  console.error("Please set a key pair");
  process.exit(1);
}

rotate(process.argv[2], process.argv[3]);

async function rotate(account, newKey) {
  const cmd = {
    networkId: NETWORK_ID,
    keyPairs: [
      Object.assign(KEY_PAIR, {
        clist: [
          Pact.lang.mkCap(
            "GAS",
            "Capability to allow buying gas",
            "coin.GAS",
            []
          ).cap,
          Pact.lang.mkCap(
            "Rotate",
            "Capability to allow rotating account guard",
            "coin.ROTATE",
            [account]
          ).cap
        ]
      })
    ],
    pactCode: `(coin.rotate  "${account}" (read-keyset "new-keyset"))`,
    envData: {
      "new-keyset": {
        keys: [newKey],
        pred: "keys-all"
      }
    },
    meta: {
      creationTime: creationTime(),
      ttl: 28000,
      gasLimit: 600,
      chainId: CHAIN_ID,
      gasPrice: 0.0000001,
      sender: account
    }
  };
  console.log(cmd);

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
