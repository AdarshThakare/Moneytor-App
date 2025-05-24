import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my-rate-limit-key");

    if (!success) {
      return res.status(429).json({
        msg: "Too Many requests, please try again after 60 secs.",
      });
    }
    next();
  } catch (err) {
    console.log("Rate limit error", err);
    next(err);
  }
};

export default rateLimiter;
