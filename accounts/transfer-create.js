const HELP = `Usage example: \n\nnode transfer-create.js k:{public-key} amount -- Replace {public-key} with an actual key`;

const Pact = require("pact-lang-api");
const NETWORK_ID = "testnet04";
const CHAIN_ID = "1";
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;
const KEY_PAIR = {
  publicKey: "",
  secretKey: ""
};

const creationTime = () => Math.round(new Date().getTime() / 1000);

if (process.argv.length !== 4) {
  console.log(process.argv);
  console.info(HELP);
  process.exit(1);
}

if (KEY_PAIR.publicKey === "" || KEY_PAIR.secretKey === "") {
  console.error("Please set a key pair");
  process.exit(1);
}

transferCreate(KEY_PAIR.publicKey, process.argv[2], process.argv[3]);

async function transferCreate(sender, newAccount, amount) {
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
            "Transfer",
            "Capability to allow coin transfer",
            "coin.TRANSFER",
            [sender, newAccount, { decimal: amount }]
          ).cap
        ]
      })
    ],
    pactCode: `(coin.transfer-create  "${sender}" "${newAccount}" (read-keyset "account-keyset") ${amount})`,
    envData: {
      "account-keyset": {
        keys: [
          // Drop the k:
          newAccount.substr(2)
        ],
        pred: "keys-all"
      }
    },
    meta: {
      creationTime: creationTime(),
      ttl: 28000,
      gasLimit: 600,
      chainId: CHAIN_ID,
      gasPrice: 0.0000001,
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
