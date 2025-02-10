require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const util = require("../util/util");
const caSvc = require("../services/caSvc");
const pool = require("../src/config/database");

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
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const baseProvider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);
const baseWallet = new ethers.Wallet(process.env.PRIVATE_KEY, baseProvider);

let voteCa, nftCa;
if (process.env.VOTECA) {
  voteCa = new ethers.Contract(process.env.VOTECA, voteCaData.abi, wallet);
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
      wallet
    );

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

const deployNftContract = async (req, res) => {
  try {
    const factory = new ethers.ContractFactory(
      nftCaData.abi,
      nftCaData.data.bytecode,
      wallet
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

const mintNft = async (req, res) => {
  console.log("req", req.body);
  try {
    const { recipient, tokenUri } = req.body;
    console.log(recipient, tokenUri);
    if (!recipient || !tokenUri) {
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
    // NFT 민팅 트랜잭션 실행
    const tx = await nftCa.safeMint(recipient, tokenUri);
    console.log("tx", tx);

    const receipt = await tx.wait();
    console.log("receipt", receipt);

    const event = await receipt.logs.find(
      (log) => log.fragment.name === "Transfer"
    );
    console.log("receipt.logs", receipt.logs);
    console.log("receipt.logs", receipt.status, receipt.status == 1);
    if (!event) {
      return res
        .status(500)
        .json({ error: "Minting event not found in transaction receipt" });
    }
    console.log("event", event);

    const tokenId = event.args.tokenId.toString();
    console.log(`✅ NFT Minted - Token ID: ${tokenId}`);

    res.json({
      message: "NFT Minted Successfully",
      opensea: `https://testnets.opensea.io/assets/base_sepolia/0xf50036d01e12c011c6153e4b8228d650dfccb942/${tokenId}`,
      receipt_link: `${process.env.SEPOLIA_ETH_SCAN}/${receipt.hash}`,
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
  try {
    const { eoa, question, option_one, option_two, end_time } = req.body;

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
    const receipt = await tx.wait();
    const event = receipt.logs.find(
      (log) => log.fragment.name === "TopicCreated"
    );
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

    let connection;
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
  }
};

const getTopic = async (req, res) => {
  try {
    const { topicNo } = req.params;
    if (!topicNo) {
      return res.status(400).json({ error: "topicNo is required" });
    }

    const topic = await voteCa.getTopic(topicNo);

    res.json({
      topicNo: topic.topicNo.toString(),
      question: topic.question,
      option_one: topic.option_one,
      option_two: topic.option_two,
      option_oneVoteCount: topic.option_oneVoteCount.toString(),
      option_twoVoteCount: topic.option_twoVoteCount.toString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 투표 기능
const vote = async (req, res) => {
  const { eoa, topic_no, option } = req.body;
  if (!eoa || topic_no === undefined || option === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    await caSvc.updateTopic(connection, req.body);

    let txResult, receipt_link;
    try {
      const tx = await voteCa.vote(eoa, topic_no, option);
      txResult = await tx.wait();
      receipt_link = `${process.env.SEPOLIA_ETH_SCAN}/${txResult.hash}`;
    } catch (error) {
      console.error("Blockchain TX Error:", error);
      await connection.rollback();
      return res.status(500).json({ error: "Blockchain transaction failed" });
    }

    const mkVote = {
      topic_no,
      eoa,
      option,
      receipt_link,
    };
    await caSvc.postVote(connection, mkVote);
    await connection.commit();

    return res.json({
      message: "Vote submitted successfully",
      txResult,
      receipt_link,
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("DB Transaction Error:", error);
    return res.status(500).json({ error: "Database transaction failed" });
  } finally {
    if (connection) connection.release();
  }
};

// 투표 결과 조회
const getVoteResult = async (req, res) => {
  try {
    const { topicNo } = req.params;
    if (!topicNo) {
      return res.status(400).json({ error: "topicNo is required" });
    }

    const result = await voteCa.getVoteResult(topicNo);
    res.json({
      option_oneVoteCount: result[0].toString(),
      option_twoVoteCount: result[1].toString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 사용자가 특정 토픽에 투표했는지 확인
const hasUserVoted = async (req, res) => {
  try {
    const { topicNo, userAddress } = req.params;
    if (!topicNo || !userAddress) {
      return res
        .status(400)
        .json({ error: "topicNo and userAddress are required" });
    }

    const voted = await voteCa.hasUserVoted(topicNo, userAddress);
    res.json({ hasVoted: voted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 투표 목록 조회
const getTotalVote = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const result = await caSvc.getTotalTopic(connection);
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 사용자가 특정 토픽에 투표했는지 확인
const getUserVote = async (req, res) => {
  try {
    let eoa = req.query.eoa;
    console.log("Eoa", eoa);
    const connection = await pool.getConnection();
    const result = await caSvc.getUserTopic(connection, eoa);
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  deployVoteContract,
  deployNftContract,
  createTopic,
  getTopic,
  vote,
  mintNft,
  getVoteResult,
  hasUserVoted,
  getTotalVote,
  getUserVote,
};
