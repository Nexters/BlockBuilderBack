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
} else {
  console.error("⚠️ No contract address found in process.env.VOTECA");
}

if (process.env.NFTCA) {
  nftCa = new ethers.Contract(process.env.NFTCA, nftCaData.abi, baseWallet);
}

const deployVoteContract = async (req, res) => {
  try {
    const factory = new ethers.ContractFactory(
      voteCaData.abi,
      voteCaData.data.bytecode,
      baseWallet
    );

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

    const { recipient, name, symbol } = req.body;

    if (!recipient || !name || !symbol) {
      return res.status(400).json({
        error: "Recipient, name, symbol are required",
      });
    }

    const image = process.env.IMAGE;
    const amount = 1000;

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
      contractAddress: result.target,
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

    const tokenId = await nftCa.getUserTokenId();
    const ownerAddress = process.env.OWNER;

    // 재시도 함수 정의
    const executeTransaction = async (retryCount = 0, maxRetries = 10) => {
      try {
        // 매번 최신 nonce 가져오기
        let nonce = await baseProvider.getTransactionCount(
          baseWallet.address,
          "pending"
        );

        const tx = await nftCa.customSafeTransferFrom(
          ownerAddress,
          recipient,
          tokenId,
          {
            nonce: nonce,
            gasLimit: ethers.parseUnits("10000000", 0),
          }
        );

        return await tx.wait();
      } catch (error) {
        // 재시도 횟수 초과 시 에러 발생
        if (retryCount >= maxRetries) {
          throw new Error(
            `Transaction failed after ${maxRetries} attempts: ${error.message}`
          );
        }

        // 실패 원인에 따라 대기 시간 조정 (exponential backoff)
        const waitTime = 1000 * Math.pow(2, retryCount);
        console.log(
          `Transaction attempt ${
            retryCount + 1
          } failed. Retrying in ${waitTime}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));

        // 재귀적으로 재시도
        return executeTransaction(retryCount + 1, maxRetries);
      }
    };

    // 트랜잭션 실행 (최대 3번 재시도)
    const receipt = await executeTransaction();
    const tokenUri = await nftCa.tokenURI(tokenId);
    const image_url = await lib.getImageUrlFromMapping(tokenUri);

    res.json({
      message: "NFT Minted Successfully",
      tokenUri: tokenUri,
      image_url: image_url,
      opensea: `https://testnets.opensea.io/assets/base_sepolia/${process.env.NFTCA}/${tokenId}`,
      receipt_link: `${process.env.SEPOLIA_ETH_SCAN}${receipt.hash}`,
      tokenId: tokenId.toString(),
      transactionHash: receipt.hash,
    });
  } catch (error) {
    console.error("Error minting NFT:", error);
    res.status(500).json({ error: error.message });
  }
};

// const mintNft = async (req, res) => {
//   let retryCount = 0;
//   const maxRetries = 3;

//   const attemptMint = async () => {
//     try {
//       const { recipient } = req.body;
//       if (!recipient) {
//         return res
//           .status(400)
//           .json({ error: "Recipient and tokenUri are required" });
//       }

//       const nftCa = new ethers.Contract(
//         process.env.NFTCA,
//         nftCaData.abi,
//         baseWallet
//       );

//       // 토큰 ID 조회는 트랜잭션 직전에 수행
//       const tokenId = await nftCa.getUserTokenId();
//       const ownerAddress = process.env.OWNER;

//       // 매번 최신 nonce를 가져옴
//       let nonce = await baseProvider.getTransactionCount(
//         baseWallet.address,
//         "pending" // 'latest' 대신 'pending'을 사용하여 대기 중인 트랜잭션도 고려
//       );

//       console.log(
//         `Attempting mint with nonce: ${nonce} for tokenId: ${tokenId}`
//       );

//       // 가스 제한 설정 (추정 가능한 경우 사용)
//       // let gasLimit;
//       // try {
//       //   // gasLimit = await nftCa.customSafeTransferFrom.estimateGas(
//       //   //   ownerAddress,
//       //   //   recipient,
//       //   //   tokenId
//       //   // );
//       //   // 여유분 20% 추가
//       //   //gasLimit = (gasLimit * BigInt(150)) / BigInt(100);
//       //   console.log("gasLimit", gasLimit);
//       //   gasLimit = ethers.parseUnits("1500000", 0);
//       //   //  console.log("gasLimit2", gasLimit2);
//       // } catch (error) {
//       //   console.log("Gas estimation failed, using default:", error.message);
//       //   gasLimit = ethers.parseUnits("7000000", 0);
//       // }
//       let gasLimit = ethers.parseUnits("3000000", 0);
//       const tx = await nftCa.customSafeTransferFrom(
//         ownerAddress,
//         recipient,
//         tokenId,
//         {
//           nonce: nonce,
//           gasLimit: gasLimit,
//           // 트랜잭션이 더 빨리 채굴되도록 가스 가격 약간 높게 설정
//           gasPrice:
//             ((await baseProvider.getFeeData()).gasPrice * BigInt(110)) /
//             BigInt(100),
//         }
//       );

//       console.log(`Transaction sent: ${tx.hash} with nonce ${nonce}`);

//       // 타임아웃 추가
//       const receipt = await Promise.race([
//         tx.wait(),
//         new Promise((_, reject) =>
//           setTimeout(() => reject(new Error("Transaction timeout")), 60000)
//         ),
//       ]);

//       const tokenUri = await nftCa.tokenURI(tokenId);
//       const image_url = await lib.getImageUrlFromMapping(tokenUri);

//       return {
//         success: true,
//         data: {
//           message: "NFT Minted Successfully",
//           tokenUri: tokenUri,
//           image_url: image_url,
//           opensea: `https://testnets.opensea.io/assets/base_sepolia/${process.env.NFTCA}/${tokenId}`,
//           receipt_link: `${process.env.SEPOLIA_ETH_SCAN}${receipt.hash}`,
//           tokenId: tokenId.toString(),
//           transactionHash: receipt.hash,
//         },
//       };
//     } catch (error) {
//       // 에러 분석 및 재시도 조건 결정
//       if (
//         error.message.includes("nonce too low") ||
//         error.message.includes("nonce has already been used") ||
//         error.message.includes("replacement transaction underpriced") ||
//         error.message.includes("execution reverted")
//       ) {
//         if (retryCount < maxRetries) {
//           retryCount++;
//           console.log(
//             `Retrying mint (${retryCount}/${maxRetries}) due to: ${error.message}`
//           );
//           // 재시도 전 짧은 지연
//           await new Promise((resolve) => setTimeout(resolve, 2000));
//           return attemptMint();
//         }
//       }
//       return { success: false, error };
//     }
//   };

//   try {
//     const result = await attemptMint();
//     if (result.success) {
//       res.json(result.data);
//     } else {
//       console.error("Error minting NFT:", result.error);
//       res.status(500).json({ error: result.error.message });
//     }
//   } catch (error) {
//     console.error("Error in mint process:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

const createTopic = async (req, res) => {
  let connection;
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
