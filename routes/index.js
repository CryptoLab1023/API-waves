const express = require("express");
const router = express.Router();
const WavesAPI = require("waves-api");
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

router.post("/issue", (req, res) => {
  const issueData = {
    name: req.body.name,
    description: 'Some words about it',
    quantity: req.body.quantity,
    precision: 5,
    reissuable: false,
    fee: 100000000,
    timestamp: Date.now()
  };
  const keyPair = {
    privateKey: req.body.privateKey,
    publicKey: req.body.publicKey,
  };
  Waves.API.Node.v1.assets.issue(issueData, keyPair).then((responseData) => {
    console.log(responseData);
  });
})

router.post("/tranfer", (req, res) => {
  const transferData = {
    recipient: req.body.recipient,
    assetId: 'WAVES',
    amount: 10000000,
    feeAssetId: 'WAVES',
    fee: 100000,
    attachment: '',
    timestamp: Date.now()
  };
  const keyPair = {
    privateKey: req.body.privateKey,
    publicKey: req.body.publicKey,
  };
  Waves.API.Node.v1.assets.transfer(transferData, keyPair).then((responseData) => {
    console.log(responseData);
  });
})

router.post("/reissue", (req, res) => {
  const reissueData = {
    assetId: req.body.assetId,
    quantity: req.body.quantity,
    reissuable: false,
    fee: 100000000,
    timestamp: Date.now()
  };
  const keyPair = {
    privateKey: req.body.privateKey,
    publicKey: req.body.publicKey,
  };
  Waves.API.Node.v1.assets.reissue(reissueData, keyPair).then((responseData) => {
    console.log(responseData);
  });
})

router.post("/burn", (req, res) => {
  const burnData = {
    assetId: req.body.assetId,
    quantity: req.body.quantity,
    fee: 100000,
    timestamp: Date.now()
  };
  const keyPair = {
    privateKey: req.body.privateKey,
    publicKey: req.body.publicKey,
  };
  Waves.API.Node.v1.assets.burn(burnData, keyPair).then((responseData) => {
    console.log(responseData);
  });
})

router.post("/lease", (req, res) => {
  const leaseData = {
    recipient: req.body.recipient,
    amount: req.body.amount, // 10 Waves
    fee: 100000, // 0.001 Waves
    timestamp: Date.now()
  };
  const keyPair = {
    privateKey: req.body.privateKey,
    publicKey: req.body.publicKey,
  };
  Waves.API.Node.v1.leasing.lease(leaseData, keyPair).then((responseData) => {
    console.log(responseData);
  });
})

router.post("/cancelLease", (req, res) => {
  const cancelLeasingData = {
    transactionId: req.body.transactionId,
    fee: 100000,
    timestamp: Date.now()
  };
  const keyPair = {
    privateKey: req.body.privateKey,
    publicKey: req.body.publicKey,
  };
  Waves.API.Node.v1.leasing.cancelLeasing(cancelLeasingData, keyPair).then((responseData) => {
    console.log(responseData);
  });
})

router.post("/createAlias", (req, res) => {
  const createAliasData = {
    // That's a kind of a nickname you attach to your address
    alias: req.body.alias,
    fee: 100000,
    timestamp: Date.now()
  };
  const keyPair = {
    privateKey: req.body.privateKey,
    publicKey: req.body.publicKey,
  };
  Waves.API.Node.v1.aliases.createAlias(createAliasData, keyPair).then((responseData) => {
    console.log(responseData);
  });
})


module.exports = router;
