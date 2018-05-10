const express = require("express");
const router = express.Router();
const WavesAPI = require("waves-api");
const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);

// console.log(Waves.config);

// const newConfig = {

//   // The byte allowing to distinguish networks (mainnet, testnet, devnet, etc)
//   networkByte: Waves.constants.TESTNET_BYTE,

//   // Node and Matcher addresses, no comments here
//   nodeAddress: 'https://testnode2.wavesnodes.com',
//   matcherAddress: 'https://testnode2.wavesnodes.com/matcher',

//   // If a seed phrase length falls below that value an error will be thrown
//   minimumSeedLength: 50

// };

// Waves.config.set(newConfig);

const owner = {↲
    phrase: 'street soup tornado loud pony pact absurd inflict pipe tuna tonight tray manage bargain width',↲
    address: '3MpqP6XWZ5FtvNBYqi2eUGXwSgp8PZV7Jpw',↲
    keyPair: ↲ {
        privateKey: '2ga6KiGd3febVq4bRv9NwdcF1o4ULEQ3aWUnCicKwoWb', ↲
        publicKey: 'BWDQ2bZhMR8a69g1PTXybqiJhp5F4F1UNrTr355gYExS'
    }
}


router.get("/getOwner", (req, res) => {
    return owner;
})

// curl -w '\n' 'http://localhost:8080/job/sample/configSubmit' --data-urlencode 'json={"properties": {"hudson-model-ParametersDefinitionProperty": {"parameterized": {"parameter": {"name": "FileParameter", "description": "Upload file to Jenkins.", "stapler-class": "hudson.model.FileParameterDefinition", "$class": "hudson.model.FileParameterDefinition"}}}}}' -d 'Submit=Save' -XPOST
// curl -w '\n' 'localhost:3000/issue' -XPOST --data-urlencode 'json={"name": "RyotaroToken", "ammount": 20000000000}'
router.post("/issue", (req, res) => {
    console.log(req)
    const issueData = {

        name: req.body.name,
        description: 'Some words about it',

        // With given options you'll have 100000.00000 tokens
        quantity: req.body.amount,
        precision: 5,

        // This flag defines whether additional emission is possible
        reissuable: false,

        fee: 100000000,
        timestamp: Date.now()

    };
    console.log(issueData);

    Waves.API.Node.v1.assets.issue(issueData, owner.keyPair).then((responseData) => {
        console.log(responseData);
    });
})


router.post("/distribute", (req, res) => {
  const transferData = {
    recipient: req.body.recipientAddress,
    assetId: req.body.assetId,
    amount: req.body.amount / req.body.addresses.length,
    feeAssetId: 'WAVES',
    fee: 100000,
    attachment: '',
    timestamp: Date.now()
  };
  const keyPair = {
    privateKey: req.body.privateKey,
    publicKey: req.body.publicKey,
  };
  for (i = 0; i < req.body.addresses; i++){
    Waves.API.Node.v1.assets.transfer(transferData, keyPair).then((responseData) => {
      console.log(responseData);
    });
  }
})


// "voterRecipient=<Address>%22%3a+%7b%22assetId=<>>%22%3a+%7b%22amount=<Number>%22%3a+%7b%22privateKey=<SKey>"
router.post("/transferFromVoter", (req, res) => {
  const transferData = {
        recipient: req.body.voterRecipient, //YesAddress
        assetId: req.body.assetId,
        amount: req.body.amount,
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

router.post("/transferFromOracle", (req, res) => {
    const transferData = {
        recipient: req.body.oracleRecipient,
        assetId: req.body.assetId,
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


router.post("/makeFactorYes", (req, res) => {
    const seed = Waves.Seed.create();
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

// curl -sS localhost:3000/getBalance -XGET -d "address=3N9KC7WSaUTw3JS3wPyCgN9qxjK3eEeNWkR"
router.get("/getBalance", (req, res) => {
    Waves.API.Node.v1.addresses.balance(req.body.address).then((balance) => {
        console.log(balance);
    });
});

createAddress = async  () => {
    const seed = Waves.Seed.create();
    console.log(seed);
    console.log(seed.phrase); // 'hole law front bottom then mobile fabric under horse drink other member work twenty boss'
    console.log(seed.address); // '3Mr5af3Y7r7gQej3tRtugYbKaPr5qYps2ei'
    console.log(seed.keyPair); // { privateKey: 'HkFCbtBHX1ZUF42aNE4av52JvdDPWth2jbP88HPTDyp4', publicKey: 'AF9HLq2Rsv2fVfLPtsWxT7Y3S9ZTv6Mw4ZTp8K8LNdEp' }
}

createAddress();






module.exports = router;
