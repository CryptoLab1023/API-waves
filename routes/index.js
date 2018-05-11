const express = require("express");
const router = express.Router();
const WavesAPI = require("waves-api");
const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);

/*
console.log(Waves.config);

const newConfig = {

  // The byte allowing to distinguish networks (mainnet, testnet, devnet, etc)
  networkByte: Waves.constants.TESTNET_BYTE,

  // Node and Matcher addresses, no comments here
  nodeAddress: 'https://testnode2.wavesnodes.com',
  matcherAddress: 'https://testnode2.wavesnodes.com/matcher',

  // If a seed phrase length falls below that value an error will be thrown
  minimumSeedLength: 50

    Waves.config.set(newConfig);

};

*/

/*


const owner = {↲
    phrase: 'street soup tornado loud pony pact absurd inflict pipe tuna tonight tray manage bargain width',
    ↲
    address: '3MpqP6XWZ5FtvNBYqi2eUGXwSgp8PZV7Jpw',
    ↲
    keyPair: ↲{
        privateKey: '2ga6KiGd3febVq4bRv9NwdcF1o4ULEQ3aWUnCicKwoWb',
        ↲
        publicKey: 'BWDQ2bZhMR8a69g1PTXybqiJhp5F4F1UNrTr355gYExS'
    }
}
*/
createSeed = async () => {
    const seed = Waves.Seed.create();
    return seed;
}

returnDecryptedSeed = async (phrase, password) => {
    const seed = Waves.Seed.decryptSeedPhrase(phrase, password);
    return seed;
}

returnEncryptedSeed = async (seed, password) => {
    const encrypted = seed.encrypt(password);
    return encrypted;
}


// 1. CREATING THE VOTER
// -d [password]
router.get("/api/createVoter", async (req, res) => {
    const seed = await createSeed();
    console.log(seed);
    const encryptedSeed = await returnEncryptedSeed(seed, req.body.password);
    console.log(encryptedSeed);
    res.send(encryptedSeed);
    // return the encrypted Seed !
    // necessary to preserve the address and password for voter !!
})

// 2. CREATEING THE ORACLE
// -d [password]
router.get("/api/createOracle", async (req, res) => {
    const seed = await createSeed();
    console.log(seed);
    const encryptedSeed = await returnEncryptedSeed(seed, req.body.password);
    console.log(encryptedSeed);
    res.send(encryptedSeed);
    // return the encrypted Seed !
    // necessary to preserve the address and password for oracle !!
})

// 3. DECODE THE SEED IN VOTER
// -d [encryptedPhrase]
router.get("/api/getVoterFromEncryptedSeed", async (req, res) => {
    const seed = getSeedFromEncryptedPhrase(req.body.encryptedPhrase)
    res.send( returnEncryptedSeed (seed, req.body.password));
    // validation in db and current account .then(
    // )
})

// 3. DECODE THE SEED IN ORACLE
// -d [encryptedPhrase]
router.get("/api/getOracleFromEncryptedSeed", async (req, res) => {
    const seed = getSeedFromEncryptedPhrase(req.body.encryptedPhrase)
    // validation in db and current account .then(
    res.send(returnEncryptedSeed(seed, req.body.password));
    // )
})

router.get("/api/getOwner", (req, res) => {
    return owner;
})


// 4. CREATE THE TOKEN
// curl -w '\n' 'http://localhost:8080/job/sample/configSubmit' --data-urlencode 'json={"properties": {"hudson-model-ParametersDefinitionProperty": {"parameterized": {"parameter": {"name": "FileParameter", "description": "Upload file to Jenkins.", "stapler-class": "hudson.model.FileParameterDefinition", "$class": "hudson.model.FileParameterDefinition"}}}}}' -d 'Submit=Save' -XPOST
// curl -w '\n' 'localhost:3000/issue' -XPOST --data-urlencode 'json={"name": "RyotaroToken", "ammount": 20000000000}'
// {name: , description: , amount: , encryptedPhrase: ,   }

router.post("/api/issue", (req, res) => {
    console.log(req)
    const issueData = {
        name: req.body.name,
        description: req.body.description,
        // With given options you'll have 100000.00000 tokens
        quantity: req.body.amount,
        precision: 5,
        // This flag defines whether additional emission is possible
        reissuable: false,
        fee: 100000000,
        timestamp: Date.now()
    };
    console.log(issueData);
    const keyPair = returnDecryptedSeed(req.body.encryptedPhrase).keyPair;
    // validation in DB whether matched in public address and password;
    Waves.API.Node.v1.assets.issue(issueData, keyPair).then((responseData) => {
        console.log(responseData);
        res.send(responseData);
    }).catch((error) => {
        res.send(error);
    });
})

// 5. DISTRIBUTE THE TOKEN
// the distribution ratio can be changed according to db.
// {recipientAddress: , assetId: ,amount: , }

router.post("/api/distributeEqually", (req, res) => {
    const transferData = {
        recipient: req.body.recipient,
        assetId: req.body.assetId,
        amount: req.body.amount,
        feeAssetId: 'WAVES',
        fee: 100000,
        attachment: '',
        timestamp: Date.now()
    };
    console.log(transferData);
    const keyPair = returnDecryptedSeed(req.body.encryptedPhrase).keyPair;
    // validation in DB whether matched in public address and password;
    Waves.API.Node.v1.assets.transfer(transferData, keyPair).then((responseData) => {
        console.log(responseData);
        res.send(responseData);
    }).catch((error) => {
        res.send(error);
    });
})

// 6. TRANSFER FROM VOTER TO YES OR NO ADDRESS THE VENTUARY TOKEN
// "voterRecipient=<Address>%22%3a+%7b%22assetId=<>>%22%3a+%7b%22amount=<Number>%22%3a+%7b%22privateKey=<SKey>"

router.post("/api/transferFromVoter", (req, res) => {
    const transferData = {
        recipient: req.body.recipient, //Yes or NoAddress
        assetId: req.body.assetId,
        amount: req.body.amount,
        feeAssetId: 'WAVES',
        fee: 100000,
        attachment: '',
        timestamp: Date.now()
    };
    const keyPair = returnDecryptedSeed(req.body.encryptedPhrase).keyPair;
    // validation in DB whether matched in public address and password;
    Waves.API.Node.v1.assets.transfer(transferData, keyPair).then((responseData) => {
        console.log(responseData);
        res.send(responseData);
    }).catch((error) => {
        res.send(error);
    });
})


// 7. TRANSFER FROM ORACLE TO YES OR NO ADDRESS THE VENTUARY TOKEN
router.post("/api/transferFromOracle", (req, res) => {
    const transferData = {
        recipient: req.body.recipient, //Yes or NoAddress
        assetId: req.body.assetId,
        amount: req.body.amount,
        feeAssetId: 'WAVES',
        fee: 100000,
        attachment: '',
        timestamp: Date.now()
    };
    const keyPair = returnDecryptedSeed(req.body.encryptedPhrase).keyPair;
    // validation in DB whether matched in public address and password;
    Waves.API.Node.v1.assets.transfer(transferData, keyPair).then((responseData) => {
        console.log(responseData);
        res.send(responseData);
    }).catch((error) => {
        res.send(error);
    });
})

// 8 MAKING YES ADDRESS
router.post("/api/makeFactorYes", (req, res) => {
    // if DB has no YES address
    const seed = createSeed();
    const encryptedSeed = returnEncryptedSeed(seed, req.body.password)
    res.send(encryptedSeed);
})

// 9 MAKING NO ADDRESS
router.post("/api/makeFactorNo", (req, res) => {
    // if DB has no NO address
    const seed = createSeed();
    const encryptedSeed = returnEncryptedSeed(seed, req.body.password)
    res.send(encryptedSeed);
})

// curl -sS localhost:3000/api/getBalance -XGET -d "address=3N9KC7WSaUTw3JS3wPyCgN9qxjK3eEeNWkR"
router.get("/api/getBalance", (req, res) => {
    Waves.API.Node.v1.addresses.balance(req.body.address).then((balance) => {
        console.log(balance);
    });
});

/*

createAddress = async () => {
    const seed = Waves.Seed.create();
    console.log(seed);
    console.log(seed.phrase); // 'hole law front bottom then mobile fabric under horse drink other member work twenty boss'
    console.log(seed.address); // '3Mr5af3Y7r7gQej3tRtugYbKaPr5qYps2ei'
    console.log(seed.keyPair); // { privateKey: 'HkFCbtBHX1ZUF42aNE4av52JvdDPWth2jbP88HPTDyp4', publicKey: 'AF9HLq2Rsv2fVfLPtsWxT7Y3S9ZTv6Mw4ZTp8K8LNdEp' }
}

createAddress();

*/



module.exports = router;
