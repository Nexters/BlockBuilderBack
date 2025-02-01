const crypto = require("crypto");
const loginModal = require("../src/models/loginModel");

const ALGORITHM = "aes-256-cbc";

// 닉네임 생성 함수
const GenerateNickname = () => {
  const randomWord =
    loginModal.words[Math.floor(Math.random() * loginModal.words.length)];
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `${randomWord}${randomNumber}`;
};

// AES-256 암호화 키 생성 (salt 활용)
const GenerateKey = (salt) => {
  return crypto.pbkdf2Sync(salt, "mnemonic-encryption", 100000, 32, "sha256");
};

// AES-256 암호화 함수 (니모닉)
const EncryptMnemonic = (mnemonic, salt) => {
  const key = GenerateKey(salt);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(mnemonic, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { encryptedMnemonic: encrypted, iv: iv.toString("hex") };
};

// AES-256 암호화 함수 (Private Key)
const EncryptPriv = (privateKey, salt) => {
  const key = GenerateKey(salt);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(privateKey, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { encryptedPrivateKey: encrypted, ivPrivateKey: iv.toString("hex") };
};

// AES-256 복호화 함수 (니모닉)
const DecryptMnemonic = (encryptedMnemonic, iv, salt) => {
  const key = GenerateKey(salt);
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedMnemonic, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// AES-256 복호화 함수 (Private Key)
const DecryptPriv = (encryptedPrivateKey, iv, salt) => {
  const key = GenerateKey(salt);
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedPrivateKey, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

module.exports = {
  GenerateNickname,
  EncryptMnemonic,
  DecryptMnemonic,
  EncryptPriv,
  DecryptPriv,
  GenerateKey,
};
