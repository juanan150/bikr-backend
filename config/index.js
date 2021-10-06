const config = {
  port: process.env.PORT || 3030,
  mongo_uri: process.env.MONGO_URI,
  jwtKey: process.env.JWT_KEY || "s3cr3t_k3y@!!",
};

module.exports = config;
