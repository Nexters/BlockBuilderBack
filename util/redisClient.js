const Redis = require("ioredis");

// Redis 클라이언트를 Promise 기반으로 변경
const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});

// 에러 핸들링 로그 예시
redis.on("connect", () => {
  console.log("[Redis] 서버에 연결되었습니다.");
});

redis.on("error", (err) => {
  console.error("[Redis] 클라이언트 에러:", err);
});

redis.on("reconnecting", () => {
  console.log("[Redis] 재연결 시도 중...");
});

module.exports = redis;
