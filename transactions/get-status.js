const HELP = "Usage example: \n\nnode get-status {request-key}";
const Pact = require("pact-lang-api");
const NETWORK_ID = "testnet04";
const CHAIN_ID = "1";
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;

if (process.argv.length !== 3) {
  console.info(HELP);
  process.exit(1);
}

getTxStatus(process.argv[2]);

async function getTxStatus(requestKey) {
  const txResult = await Pact.fetch.listen({ listen: requestKey }, API_HOST);
  console.log(txResult);
}
