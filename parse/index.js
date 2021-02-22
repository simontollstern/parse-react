const express = require("express");
const ParseServer = require("parse-server").ParseServer;
const app = express();

const config = new ParseServer({
  databaseURI: "mongodb://localhost:27017/parse", // Connection string for your MongoDB database
  cloud: "./cloud/main.js", // Path to your Cloud Code
  appId: "appid",
  masterKey: "masterkey", // Keep this key secret!
  fileKey: "optionalFileKey",
  serverURL: "http://localhost:1337/parse", // Don't forget to change to https if needed
  liveQuery: { classNames: ["Person"] },
});

app.use("/parse", config);

const httpServer = require("http").createServer(app);
httpServer.listen(1337, () => {
  console.log("parse-server running on port 1337.");
});

ParseServer.createLiveQueryServer(httpServer);
