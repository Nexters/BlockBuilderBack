const fs = require("fs");
const path = require("path");
const ethers = require("ethers");
const loginSvc = require("../services/loginSvc");
const loginModal = require("../src/models/loginModel");
const pool = require("../src/config/database");

const SALT = process.env.SALT;

// 🚀 Ethereum Identity 생성
const generateEthereumIdentity = async (req, res) => {
  try {
    const wallet = ethers.Wallet.createRandom();
    const mnemonic = wallet.mnemonic.phrase;
    const address = wallet.address;
    const privateKey = wallet.privateKey;

    // 니모닉 및 Private Key 암호화
    const { encryptedMnemonic, iv } = loginSvc.EncryptMnemonic(mnemonic, SALT);
    const { encryptedPrivateKey, ivPrivateKey } = loginSvc.EncryptPriv(
      privateKey,
      SALT
    );

    const nickname = loginSvc.GenerateNickname(); // 랜덤 닉네임 생성

    const identity = {
      ethereum_address: address,
      encrypted_mnemonic: encryptedMnemonic,
      iv_mnemonic: iv,
      encrypted_private_key: encryptedPrivateKey,
      iv_private_key: ivPrivateKey,
      nickname: nickname,
    };

    connection = await pool.getConnection();
    // DB 저장
    loginModal.insertUser(connection, identity);

    // JSON 파일 저장
    const filePath = path.join(__dirname, "eth_wallets.json");
    let existingData = [];

    if (fs.existsSync(filePath)) {
      const rawData = fs.readFileSync(filePath);
      existingData = JSON.parse(rawData);
    }

    existingData.push(identity);
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

    res.json(identity);
  } catch (error) {
    console.error("Error generating Ethereum identity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
  }
};

const getDecryptedMnemonic = (req, res) => {
  const filePath = path.join(__dirname, "eth_wallets.json");

  const address = req.query.address;
  const salt = req.query.salt;

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "No wallet data found." });
  }

  const data = JSON.parse(fs.readFileSync(filePath));

  // 해당 주소에 대한 데이터 검색
  const walletData = data.find((wallet) => wallet.ethereum_address === address);

  if (!walletData) {
    return res.status(404).json({ error: "Address not found." });
  }

  try {
    // 니모닉 복호화
    const decryptedMnemonic = loginSvc.DecryptMnemonic(
      walletData.encrypted_mnemonic,
      walletData.iv_mnemonic,
      salt
    );

    // Private Key 복호화
    const decryptedPrivateKey = loginSvc.DecryptPriv(
      walletData.encrypted_private_key,
      walletData.iv_private_key,
      salt
    );

    const result = {
      ethereum_address: address,
      mnemonic: decryptedMnemonic,
      private_key: decryptedPrivateKey,
    };

    res.json(result);
  } catch (error) {
    console.error("Error decrypting data:", error);
    res.status(500).json({ error: "Decryption failed." });
  }
};

module.exports = {
  generateEthereumIdentity,
  getDecryptedMnemonic,
};
