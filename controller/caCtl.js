require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const util = require("../util/util");
const caSvc = require("../services/caSvc");

const contractData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../contract/artifacts/VoteService.json"),
    "utf8"
  )
);
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

let contractInstance;
if (process.env.CA) {
  contractInstance = new ethers.Contract(
    process.env.CA,
    contractData.abi,
    wallet
  );
  console.log(`Connected to existing contract at: ${process.env.CA}`);
} else {
  console.error("⚠️ No contract address found in process.env.CA");
}

const deployContract = async (req, res) => {
  try {
    const factory = new ethers.ContractFactory(
      contractData.abi,
      contractData.data.bytecode,
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

const createTopic = async (req, res) => {
  try {
    const { eoa, question, option_one, option_two, end_time } = req.body;

    if (!eoa || !question || !option_one || !option_two || !end_time) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!contractInstance) {
      return res
        .status(500)
        .json({ error: "Contract instance not initialized" });
    }

    const formattedEndTime = new Date(end_time)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const tx = await contractInstance.createTopic(
      eoa,
      question,
      option_one,
      option_two
    );
    const receipt = await tx.wait();
    const event = receipt.logs.find(
      (log) => log.fragment.name === "TopicCreated"
    );
    if (!event) {
      return res
        .status(500)
        .json({ error: "TopicCreated event not found in receipt" });
    }

    console.log(event);
    const topicNo = Number(event.args[0]);

    topic = util.MakeTopic(
      question,
      option_one,
      option_two,
      topicNo,
      formattedEndTime
    );
    console.log("topic", topic);
    caSvc.postTopic(topic);

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

// 특정 토픽 가져오기
const getTopic = async (req, res) => {
  try {
    const { topicNo } = req.params;
    if (!topicNo) {
      return res.status(400).json({ error: "topicNo is required" });
    }

    const topic = await contractInstance.getTopic(topicNo);

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
  try {
    const { userAddress, topicNo, option } = req.body;
    if (!userAddress || topicNo === undefined || option === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const tx = await contractInstance.vote(userAddress, topicNo, option);
    await tx.wait();

    res.json({ message: "Vote submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 투표 결과 조회
const getVoteResult = async (req, res) => {
  try {
    const { topicNo } = req.params;
    if (!topicNo) {
      return res.status(400).json({ error: "topicNo is required" });
    }

    const result = await contractInstance.getVoteResult(topicNo);
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

    const voted = await contractInstance.hasUserVoted(topicNo, userAddress);
    res.json({ hasVoted: voted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  deployContract,
  createTopic,
  getTopic,
  vote,
  getVoteResult,
  hasUserVoted,
};
