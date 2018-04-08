const express = require("express");
const ejs = require("ejs");
const WavesAPI = require("waves-api");
const app = express();
const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);

const newConfig = {

  // The byte allowing to distinguish networks (mainnet, testnet, devnet, etc)
  networkByte: Waves.constants.TESTNET_BYTE,

  // Node and Matcher addresses, no comments here
  nodeAddress: 'https://testnode2.wavesnodes.com',
  matcherAddress: 'https://testnode2.wavesnodes.com/matcher',

  // If a seed phrase length falls below that value an error will be thrown
  minimumSeedLength: 50

};

Waves.config.set(newConfig);

const seed = Waves.Seed.create();

console.log(seed.phrase); // random 'hole law front bottom then mobile fabric under horse drink other member work twenty boss'
console.log(seed.address); // random '3Mr5af3Y7r7gQej3tRtugYbKaPr5qYps2ei'
console.log(seed.keyPair); // random { privateKey: 'HkFCbtBHX1ZUF42aNE4av52JvdDPWth2jbP88HPTDyp4', publicKey: 'AF9HLq2Rsv2fVfLPtsWxT7Y3S9ZTv6Mw4ZTp8K8LNdEp' }

let amount;

// if we have database can be extracted the signature
// When staring the second voting, extract the signature from db
// Waves.API.Node.v1.blocks.get(signature).then((block) => console.log(block));
// in this case I use the first block cuz I dont have any data of signature
Waves.API.Node.v1.blocks.first().then((firstBlock) => {

  // confirmation sender and amount from the transaction block
  for (i = 0; i < firstBlock.transactions.length; i++) {
    console.log(firstBlock)
    let recipient = firstBlock.transactions[i].recipient;
    console.log("recipient", recipient);
    amount = firstBlock.transactions[i].amount / 2;
    console.log("amount", amount);

    const transferData = {
      recipient: recipient,
      assetId: 'WAVE',
      amount: amount,
      feeAssetId: 'WAVES',
      fee: 100000,
      attachment: '',
      timestamp: Date.now()
    };

    Waves.API.Node.v1.assets.transfer(transferData, seed.keyPair).then((responseData) => {
      console.log(responseData);
    });
  }

  // => transfer rest amount to correct answer address SCAM or not SCAM
  var result = Waves.API.Node.v1.addresses.balance(seed.address).then((balance) => {
    console.log(balance);
    const transferData = {
      recipient: " / address chosing correct answer / ",
      assetId: 'WAVE',
      amount: balance.balance,
      feeAssetId: 'WAVES',
      fee: 100000,
      attachment: '',
      timestamp: Date.now()
    };

    Waves.API.Node.v1.assets.transfer(transferData, seed.keyPair).then((responseData) => {
      console.log(responseData);
    });

    // use the correct answers signature
    for (i = 0; i < firstBlock.transactions.length; i++) {
      // choose address of the correct answer block.
      let recipient = firstBlock.transactions[i].recipient;
      console.log("recipient", recipient);
      console.log(balance.balance, amount)
      let return_amount = balance * firstBlock.transactions[i].amount / (balance - amount);
      console.log("amount", return_amount);

      const transferData = {
        recipient: recipient,
        assetId: 'WAVE',
        amount: amount,
        feeAssetId: 'WAVES',
        fee: 100000,
        attachment: '',
        timestamp: Date.now()
      };

      Waves.API.Node.v1.assets.transfer(transferData, seed.keyPair).then((responseData) => {
        console.log(responseData);
      });
    }
  });
});


var server = app.listen(8080, function() {
  console.log("Server is running!");
});
