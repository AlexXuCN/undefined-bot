require('dotenv').config();
const WebSocket = require("ws");
const config = require("./config.json");

const ws = new WebSocket(process.env.BOT_WS_HOST + "/?access_token=" + process.env.BOT_WS_TOKEN);

const bot = {
  sendMessage: {
    /**
     * 发送群聊消息
     * @param {number} target 群号
     * @param {Array | string} msg 
     */
    group: function(target,msg){
      ws.send(
        JSON.stringify(
          {
            action: "send_group_msg",
            params: {
              group_id: target,
              message: msg
            }
          }
        )
      );
    },
    /**
     * 发送私聊消息
     * @param {number} target QQ号
     * @param {Array | string} msg 
     */
    private: function(target,msg){
      ws.send(
        JSON.stringify(
          {
            action: "send_private_msg",
            params: {
              user_id: target,
              message: msg
            }
          }
        )
      );
    },
    /**
     * 回复要处理的消息（不带引用）
     * @param {object} originalMsg 要回复的消息
     * @param {string | Array} msg 回复的消息内容
     */
    inReplyTo: function (originalMsg,msg){
      switch(originalMsg.message_type){
        case "group":
          ws.send(
            JSON.stringify(
              {
                action: "send_group_msg",
                params: {
                  group_id: originalMsg.group_id,
                  message: msg
                }
              }
            )
          );
          break;
        case "private":
          ws.send(
            JSON.stringify(
              {
                action: "send_private_msg",
                params: {
                  user_id: target,
                  message: msg
                }
              }
            )
          );
      };
    },
    /**
     * 回复要处理的消息（自动引用）
     * @param {object} originalMsg 要引用的消息
     * @param {string | array} msg 回复的消息内容
     */
    reply: function (originalMsg,msg){
      switch(Object.prototype.toString.call(msg)){
        case "[object String]":
          msg = `[CQ:reply,id=${originalMsg.message_id}]${msg}`;
          break;
        case "[object Array]":
          msg = [
            {
              type: "reply",
              data: {
                id: originalMsg.message_id
              }
            }
          ].concat(msg);
      };
      switch(originalMsg.message_type){
        case "group":
          ws.send(
            JSON.stringify(
              {
                action: "send_group_msg",
                params: {
                  group_id: originalMsg.group_id,
                  message: msg
                }
              }
            )
          );
          break;
        case "private":
          ws.send(
            JSON.stringify(
              {
                action: "send_private_msg",
                params: {
                  user_id: target,
                  message: msg
                }
              }
            )
          );
      };
    }
  },
  ws: {
    /**
     * 发送ws数据
     * @param {string | object} value 
     */
    sendData: function(value){
      ws.send(
        (Object.prototype.toString.call(value) == "[object String]") ? value : JSON.stringify(value)
      );
    }
  }
};

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
    msg = JSON.parse(message.toString());
   for(plugin in pluginEntries){
    pluginEntries[plugin](config[plugin],bot,msg);
   };
  }
);

var pluginEntries = {
  groupNameChanger: require("./modules/groupNameChanger.js"),
  customReply:  require("./modules/customReply.js"),
  biliParser: require("./modules/biliParser.js"),
  mcMOTD: require("./modules/mcMOTD.js")
};