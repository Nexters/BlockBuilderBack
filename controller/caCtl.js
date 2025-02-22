require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const util = require("../util/util");
const caSvc = require("../services/caSvc");
const pool = require("../src/config/database");
const lib = require("../util/lib");

const inMemoryQueue = []; // { jobId, recipient, resolve, reject } 형태
let currentActiveCount = 0;
const MAX_CONCURRENCY = 10;

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

// 큐 이름
const MINT_QUEUE = "mint_queue";

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

// const deployFTContract = async (req, res) => {
//   try {
//     const factory = new ethers.ContractFactory(
//       ftCaData.abi,
//       ftCaData.data.bytecode,
//       baseWallet
//     );

//     const { recipient, name, symbol } = req.body;

//     if (!recipient || !name || !symbol) {
//       return res.status(400).json({
//         error: "Recipient, name, symbol are required",
//       });
//     }

//     const image = process.env.IMAGE;
//     const amount = 1000;

//     const contract = await factory.deploy(
//       baseWallet.address, // initialOwner
//       recipient, // 수령자 (토큰을 받을 주소)
//       image, // tokenUri (IPFS 이미지 URL)
//       name, // ERC-20 토큰 이름
//       symbol, // ERC-20 토큰 심볼
//       amount.toString() // 18자리 소수점 적용
//     );
//     result = await contract.waitForDeployment();

//     res.json({
//       message: "Contract successfully deployed",
//       receipt_link: `${process.env.SEPOLIA_ETH_SCAN_CA}${result.target}/?tab=logs`,
//       name: name,
//       symbol: symbol,
//       image: image,
//       amount: amount,
//       contractAddress: result.target,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const deployFTContract = async (req, res) => {
  try {
    const { recipient, name, symbol } = req.body;

    // 요청 파라미터 체크
    if (!recipient || !name || !symbol) {
      return res.status(400).json({
        error: "Recipient, name, symbol are required",
      });
    }

    // 배포할 이미지 및 초기 발행량
    const image = process.env.IMAGE;
    const amount = 1000;

    // Ethers.js 6.x 기준: ABI, Bytecode, Signer 준비
    const factory = new ethers.ContractFactory(
      ftCaData.abi,
      ftCaData.data.bytecode,
      baseWallet
    );

    // 최대 3번 재시도
    let attempts = 0;
    let contractResult = null;
    let success = false;

    while (attempts < 3 && !success) {
      try {
        // 현재 nonce 조회
        const currentNonce = await baseWallet.getNonce();

        // 하드코딩할 가스 가격(예: 50 Gwei)
        // parseUnits("50", "gwei") => 50 Gwei
        const maxGasPrice = ethers.parseUnits("50", "gwei");

        // 배포(트랜잭션) 옵션
        // 가스 한도도 필요하다면 gasLimit: 값 을 넣으면 됩니다.
        const deployOverrides = {
          nonce: currentNonce,
          gasPrice: maxGasPrice,
        };

        // ContractFactory.deploy()에 필요한 파라미터 + overrides
        const contract = await factory.deploy(
          baseWallet.address, // initialOwner
          recipient, // 토큰 전달받을 주소
          image, // tokenUri (IPFS 이미지 URL)
          name, // ERC-20 토큰 이름
          symbol, // ERC-20 토큰 심볼
          amount.toString(), // 토큰 초기 발행량(문자열로 전달)
          deployOverrides // nonce, gasPrice 등 override 정보
        );

        // 배포 완료 대기 (Ethers v6 방식)
        const result = await contract.waitForDeployment();
        contractResult = result;
        success = true; // 성공 시 반복 탈출
      } catch (err) {
        attempts++;
        console.error(`배포 시도 ${attempts}회차 실패:`, err.message);

        // nonce 관련 에러가 발생하면(too low 등), 다시 시도
        // 그 외 에러(실제로 컨트랙트가 revert 되는 경우 등)도 재시도
        // 3회까지 재시도 후 실패하면 throw
        if (attempts >= 3) {
          throw err;
        }
      }
    }

    // 모든 시도가 끝나고 성공했다면 배포 결과 반환
    res.json({
      message: "Contract successfully deployed",
      receipt_link: `${process.env.SEPOLIA_ETH_SCAN_CA}${contractResult.target}/?tab=logs`,
      name: name,
      symbol: symbol,
      image: image,
      amount: amount,
      contractAddress: contractResult.target,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// const mintNft = async (req, res) => {
//   try {
//     const { recipient } = req.body;
//     if (!recipient) {
//       return res
//         .status(400)
//         .json({ error: "Recipient and tokenUri are required" });
//     }

//     const nftCa = new ethers.Contract(
//       process.env.NFTCA,
//       nftCaData.abi,
//       baseWallet
//     );

//     const tokenId = await nftCa.getUserTokenId();
//     const ownerAddress = process.env.OWNER;

//     // 재시도 함수 정의
//     const executeTransaction = async (retryCount = 0, maxRetries = 10) => {
//       try {
//         // 매번 최신 nonce 가져오기
//         let nonce = await baseProvider.getTransactionCount(
//           baseWallet.address,
//           "pending"
//         );

//         const tx = await nftCa.customSafeTransferFrom(
//           ownerAddress,
//           recipient,
//           tokenId,
//           {
//             nonce: nonce,
//             gasLimit: ethers.parseUnits("10000000", 0),
//           }
//         );

//         return await tx.wait();
//       } catch (error) {
//         // 재시도 횟수 초과 시 에러 발생
//         if (retryCount >= maxRetries) {
//           throw new Error(
//             `Transaction failed after ${maxRetries} attempts: ${error.message}`
//           );
//         }

//         // 실패 원인에 따라 대기 시간 조정 (exponential backoff)
//         const waitTime = 1000 * Math.pow(2, retryCount);
//         console.log(
//           `Transaction attempt ${
//             retryCount + 1
//           } failed. Retrying in ${waitTime}ms...`
//         );
//         await new Promise((resolve) => setTimeout(resolve, waitTime));

//         // 재귀적으로 재시도
//         return executeTransaction(retryCount + 1, maxRetries);
//       }
//     };

//     // 트랜잭션 실행 (최대 3번 재시도)
//     const receipt = await executeTransaction();
//     const tokenUri = await nftCa.tokenURI(tokenId);
//     const image_url = await lib.getImageUrlFromMapping(tokenUri);

//     res.json({
//       message: "NFT Minted Successfully",
//       tokenUri: tokenUri,
//       image_url: image_url,
//       opensea: `https://testnets.opensea.io/assets/base_sepolia/${process.env.NFTCA}/${tokenId}`,
//       receipt_link: `${process.env.SEPOLIA_ETH_SCAN}${receipt.hash}`,
//       tokenId: tokenId.toString(),
//       transactionHash: receipt.hash,
//     });
//   } catch (error) {
//     console.error("Error minting NFT:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

const mintNft = async (req, res) => {
  try {
    const { recipient } = req.body;
    if (!recipient) {
      return res.status(400).json({ error: "Recipient is required" });
    }

    // 1) jobId 생성
    const jobId = uuidv4();
    console.log(`[mintNft] New jobId=${jobId}, recipient=${recipient}`);

    // 2) Promise 생성 → 큐에 넣을 콜백(resolve, reject)
    const txPromise = new Promise((resolve, reject) => {
      // 큐에 넣을 데이터
      inMemoryQueue.push({
        jobId,
        recipient,
        resolve,
        reject,
      });
    });

    // 3) Promise 결과를 기다렸다가 응답
    const txResult = await txPromise;

    // 여기서 최종 응답
    return res.json({
      message: "NFT Minted Successfully",
      tokenId: txResult.tokenId,
      transactionHash: txResult.transactionHash,
      tokenUri: txResult.tokenUri,
      image_url: txResult.image_url,
      opensea: `https://testnets.opensea.io/assets/base_sepolia/${process.env.NFTCA}/${txResult.tokenId}`,
      receipt_link: `${process.env.SEPOLIA_ETH_SCAN}${txResult.transactionHash}`,
    });
  } catch (err) {
    console.error("[mintNft] Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ========================== 민팅 트랜잭션 실행 함수 ==========================
async function executeTransaction(recipient) {
  // Ethers 컨트랙트
  const nftCa = new ethers.Contract(
    process.env.NFTCA,
    nftCaData.abi,
    baseWallet
  );

  // 재시도 로직
  async function tryTx(retryCount = 0, maxRetries = 3) {
    try {
      // 매번 최신 nonce 가져오기
      const nonce = await baseProvider.getTransactionCount(
        baseWallet.address,
        "pending"
      );
      // tokenId 조회
      const tokenId = await nftCa.getUserTokenId();
      // 실제 트랜잭션
      const tx = await nftCa.customSafeTransferFrom(
        process.env.OWNER,
        recipient,
        tokenId,
        {
          nonce,
          gasLimit: ethers.parseUnits("10000000", 0),
        }
      );
      // 대기
      const receipt = await tx.wait();

      // tokenURI + image_url
      const tokenUri = await nftCa.tokenURI(tokenId);
      const image_url = await lib.getImageUrlFromMapping(tokenUri);

      return {
        tokenId: tokenId.toString(),
        transactionHash: receipt.transactionHash,
        tokenUri,
        image_url,
      };
    } catch (err) {
      if (retryCount >= maxRetries) {
        throw new Error(
          `Transaction failed after ${maxRetries} attempts: ${err.message}`
        );
      }
      const waitTime = 1000 * Math.pow(2, retryCount);
      console.log(
        `[executeTransaction] Retry #${retryCount + 1} after ${waitTime}ms`
      );
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return tryTx(retryCount + 1, maxRetries);
    }
  }

  return tryTx();
}

// ========================== 큐 처리(Worker) ==========================
//  - currentActiveCount < MAX_CONCURRENCY면 새 작업 실행
//  - 실행할 때는 currentActiveCount++
//  - 끝나면 currentActiveCount-- 하고 다음 작업
async function queueWorkerLoop() {
  while (true) {
    // 1) 현재 실행 가능한지 체크
    if (currentActiveCount < MAX_CONCURRENCY && inMemoryQueue.length > 0) {
      // 큐에서 하나 꺼냄
      const nextJob = inMemoryQueue.shift(); // { jobId, recipient, resolve, reject }
      currentActiveCount++;
      console.log(
        `>>> [Worker] Start jobId=${nextJob.jobId}. Active=${currentActiveCount}`
      );

      // 2) 실제 트랜잭션 실행
      executeTransaction(nextJob.recipient)
        .then((txResult) => {
          console.log(`>>> [Worker] jobId=${nextJob.jobId} done.`);
          // 요청 쪽에서 응답을 받기 위해 resolve(txResult)
          nextJob.resolve(txResult);
        })
        .catch((err) => {
          console.error(`[Worker] jobId=${nextJob.jobId} failed:`, err.message);
          nextJob.reject(err);
        })
        .finally(() => {
          currentActiveCount--;
        });
    } else {
      // 실행할 수 없으면 잠시 대기 후 다시 루프
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
}

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
  queueWorkerLoop,
  // processMintQueue,
  // processMintTransaction,
};
