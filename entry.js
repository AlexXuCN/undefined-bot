/*import WebSocket from "ws";
import config from './config.json' assert { type : 'json' }*/
const WebSocket = require("ws");
const config = require("./config.json");
const ws = new WebSocket(config.wshost + "/?access_token=" + config.token);

/*
import groupNameChangerEntry from './modules/groupNameChanger.js'
import customReplyEntry from "./modules/customReply.js";
*/

//import webpageScreenshotEntry from "./modules/webpageScreenshot.js";

ws.on('open', function () {
    console.log("WebSocket Connected.");
  }
);

ws.on('close', function () {
    console.log('Disconnected');
    process.exit()
  }
);

ws.on('error', function (e) {
    console.log("Error!\n" + e + "\n")
  }
);

ws.on('message', async function (message) {
    var msg = JSON.parse(message.toString());
    require("./modules/groupNameChanger.js")(config.groupNameChanger,ws).messageHandler(msg);
    require("./modules/customReply.js")(config.customReply,ws).messageHandler(msg);
//    webpageScreenshotEntry(config.webpageScreenshot,ws,msg).messageHandler(msg);
  }
);
