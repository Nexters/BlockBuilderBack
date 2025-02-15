require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const util = require("../util/util");
const caSvc = require("../services/caSvc");
const pool = require("../src/config/database");
const lib = require("../util/lib");

const voteCaData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../contract/artifacts/VoteService.json"),
    "utf8"
  )
);

const nftCaData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../contract/artifacts/BodoBlockNft.json"),
    "utf8"
  )
);

const ftCaData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../contract/artifacts/CustomFt.json"),
    "utf8"
  )
);

const baseProvider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);
const baseWallet = new ethers.Wallet(process.env.PRIVATE_KEY, baseProvider);

let voteCa, nftCa;
if (process.env.VOTECA) {
  voteCa = new ethers.Contract(process.env.VOTECA, voteCaData.abi, baseWallet);
  console.log(`Connected to existing contract at: ${process.env.VOTECA}`);
} else {
  console.error("⚠️ No contract address found in process.env.VOTECA");
}

if (process.env.NFTCA) {
  nftCa = new ethers.Contract(process.env.NFTCA, nftCaData.abi, baseWallet);
  console.log(`Connected to existing contract at: ${process.env.NFTCA}`);
}

const deployVoteContract = async (req, res) => {
  try {
    const factory = new ethers.ContractFactory(
      voteCaData.abi,
      voteCaData.data.bytecode,
      baseWallet
    );
    console.log(factory);
    const contract = await factory.deploy(baseWallet.address);
    result = await contract.waitForDeployment();

    res.json({
      result: result,
      contractAddress: contract.address,
      message: "Contract successfully deployed",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deployNftContract = async (req, res) => {
  try {
    const factory = new ethers.ContractFactory(
      nftCaData.abi,
      nftCaData.data.bytecode,
      baseWallet
    );

    console.log("nft", factory);

    const contract = await factory.deploy(wallet.address);
    result = await contract.waitForDeployment();

    res.json({
      result: result,
      contractAddress: contract.address,
      message: "Contract successfully deployed",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deployFTContract = async (req, res) => {
  try {
    const factory = new ethers.ContractFactory(
      ftCaData.abi,
      ftCaData.data.bytecode,
      baseWallet
    );

    const { recipient, image, name, symbol, amount } = req.body;

    if (!recipient || !image || !name || !symbol || !amount) {
      return res.status(400).json({
        error: "Recipient, image, name, symbol, and amount are required",
      });
    }

    console.log("ft", factory);

    const contract = await factory.deploy(
      baseWallet.address, // initialOwner
      recipient, // 수령자 (토큰을 받을 주소)
      image, // tokenUri (IPFS 이미지 URL)
      name, // ERC-20 토큰 이름
      symbol, // ERC-20 토큰 심볼
      amount.toString() // 18자리 소수점 적용
    );
    result = await contract.waitForDeployment();

    res.json({
      message: "Contract successfully deployed",
      receipt_link: `${process.env.SEPOLIA_ETH_SCAN_CA}${result.target}/?tab=logs`,
      name: name,
      symbol: symbol,
      image: image,
      amount: amount,
      result: result,
      contractAddress: contract.address,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const mintNft = async (req, res) => {
  try {
    const { recipient } = req.body;
    if (!recipient) {
      return res
        .status(400)
        .json({ error: "Recipient and tokenUri are required" });
    }

    const nftCa = new ethers.Contract(
      process.env.NFTCA,
      nftCaData.abi,
      baseWallet
    );
    if (!nftCa) {
      return res
        .status(500)
        .json({ error: "NFT contract instance not initialized" });
    }
    const tokenUri = await lib.ranTokUri();
    console.log("tokenUri", tokenUri);

    const tx = await nftCa.safeMint(recipient, tokenUri);
    const receipt = await tx.wait(2);

    const event = await receipt.logs.find(
      (log) => log.fragment.name === "Transfer"
    );
    if (!event) {
      return res
        .status(500)
        .json({ error: "Minting event not found in transaction receipt" });
    }

    const tokenId = event.args.tokenId.toString();
    const ipfsImg = await lib.getImageFromUri(tokenUri);
    const image_url = await lib.convertCid(ipfsImg);

    res.json({
      message: "NFT Minted Successfully",
      tokenUri: tokenUri,
      image_url: image_url,
      opensea: `https://testnets.opensea.io/assets/base_sepolia/0xf50036d01e12c011c6153e4b8228d650dfccb942/${tokenId}`,
      receipt_link: `${process.env.SEPOLIA_ETH_SCAN}${receipt.hash}`,
      tokenId,
      transactionHash: receipt.hash,
      nftCa: nftCa,
    });
  } catch (error) {
    console.error("Error minting NFT:", error);
    res.status(500).json({ error: error.message });
  }
};

const createTopic = async (req, res) => {
  let connection;
  try {
    const { eoa, question, option_one, option_two, end_time } = req.body;
    console.log(
      " eoa, question, option_one, option_two, end_time",
      eoa,
      question,
      option_one,
      option_two,
      end_time
    );
    if (!eoa || !question || !option_one || !option_two || !end_time) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!voteCa) {
      return res
        .status(500)
        .json({ error: "Contract instance not initialized" });
    }

    const formattedEndTime = new Date(end_time)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const tx = await voteCa.createTopic(eoa, question, option_one, option_two);
    console.log("tx", tx);
    const receipt = await tx.wait();
    console.log("receipt", receipt);
    console.log("receipt.logs", receipt.logs);
    const event = receipt.logs.find(
      (log) => log.fragment.name === "TopicCreated"
    );
    console.log("event", event);
    if (!event) {
      return res
        .status(500)
        .json({ error: "TopicCreated event not found in receipt" });
    }

    const topicNo = Number(event.args[0]);
    topic = await util.MakeTopic(
      question,
      option_one,
      option_two,
      topicNo,
      formattedEndTime
    );

    connection = await pool.getConnection();
    await caSvc.postTopic(connection, topic);

    const txResult = await util.MakeTxResult(topicNo, receipt);
    res.json({
      message: "Topic created successfully",
      txResult: txResult,
    });
  } catch (error) {
    console.error("Error creating topic:", error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) connection.release();
  }
};

// 투표 기능
const vote = async (req, res) => {
  let connection;
  try {
    const { eoa, topic_no, option } = req.body;
    if (!eoa || topic_no === undefined || option === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const tx = await voteCa.vote(eoa, topic_no, option);
    const receipt = await tx.wait();
    const receipt_link = `${process.env.SEPOLIA_ETH_SCAN}/${receipt.hash}`;

    const mkVote = {
      topic_no,
      eoa,
      option,
      receipt_link,
    };

    await caSvc.updateTopic(connection, req.body);
    await caSvc.postVote(connection, mkVote);
    await connection.commit();
    return res.json({
      message: "Vote submitted successfully",
      receipt,
      receipt_link,
    });
  } catch (error) {
    console.log("error", error);
    if (connection) await connection.rollback();
    console.error("DB Transaction Error:", error);
    return res.status(500).json({ error: "Database transaction failed" });
  } finally {
    connection.release();
  }
};

// 투표 목록 조회
const getTotalVote = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const result = await caSvc.getTotalTopic(connection);
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) connection.release(); // ✅ 연결 해제
  }
};

// 사용자가 특정 토픽에 투표했는지 확인
const getUserVote = async (req, res) => {
  let connection;
  try {
    let eoa = req.query.eoa;
    console.log("Eoa", eoa);
    connection = await pool.getConnection();
    const result = await caSvc.getUserTopic(connection, eoa);
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) connection.release(); // ✅ 연결 해제
  }
};

module.exports = {
  deployVoteContract,
  deployNftContract,
  createTopic,
  vote,
  mintNft,
  getTotalVote,
  getUserVote,
  deployFTContract,
};
