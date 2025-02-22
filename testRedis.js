const redis = require("./util/redisClient"); // 경로 확인
const MINT_QUEUE = "mint_queue";

(async () => {
  try {
    const testData = {
      recipient: "0x6e759B3B147FaF2E422cDAda8FA11A17DD544f36",
      timestamp: Date.now(),
    };
    const result = await redis.rpush(MINT_QUEUE, JSON.stringify(testData));
    console.log("rpush 결과:", result);
    process.exit(0);
  } catch (error) {
    console.error("rpush 테스트 에러:", error);
    process.exit(1);
  }
})();
