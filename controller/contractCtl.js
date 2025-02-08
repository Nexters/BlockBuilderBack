require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

const contractData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../contract/artifacts/VoteService.json"),
    "utf8"
  )
);
console.log(process.env.RPC_URL);
console.log(process.env.PRIVATE_KEY);

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// 기존에 배포된 컨트랙트를 process.env.CA에서 로드
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

// 스마트 컨트랙트 배포 함수
const deployContract = async (req, res) => {
  try {
    const factory = new ethers.ContractFactory(
      contractData.abi,
      contractData.data.bytecode,
      wallet
    );
    console.log("factory", factory);
    console.log("deploy2", wallet.address);
    const contract = await factory.deploy(wallet.address);
    console.log("deploy3", contract);
    result = await contract.waitForDeployment();
    ca = result.target;
    console.log(result);

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
    const { eoa, question, option1, option2 } = req.body;

    if (!eoa || !question || !option1 || !option2) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!contractInstance) {
      return res
        .status(500)
        .json({ error: "Contract instance not initialized" });
    }

    console.log("Sending transaction to create topic...");
    const tx = await contractInstance.createTopic(
      eoa,
      question,
      option1,
      option2
    );
    const receipt = await tx.wait(); // 트랜잭션 확인

    console.log("Transaction receipt:", receipt);

    // 이벤트에서 topicNo 추출
    const event = receipt.logs.find(
      (log) => log.fragment.name === "TopicCreated"
    );
    if (!event) {
      return res
        .status(500)
        .json({ error: "TopicCreated event not found in receipt" });
    }
    console.log("event", event);

    const topicNo = Number(event.args[0]);

    console.log("New Topic Created - TopicNo:", topicNo);

    const txResult = {
      topicNo: topicNo,
      to: receipt.to,
      from: receipt.from,
      txhash: receipt.hash,
      scanlink: `https://sepolia.etherscan.io/tx/${receipt.hash}`,
      result: receipt,
    };

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
      option1: topic.option1,
      option2: topic.option2,
      option1VoteCount: topic.option1VoteCount.toString(),
      option2VoteCount: topic.option2VoteCount.toString(),
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
      option1VoteCount: result[0].toString(),
      option2VoteCount: result[1].toString(),
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
