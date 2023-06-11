module.exports = function groupNameChangerEntry(config, ws) {
  return {
    messageHandler: function (msg) {
      const fun = {
        log: function (text) {
          console.log("[GroupNameChanger]" + text);
        },
        sendMessage: function (message) {
          ws.send(
            JSON.stringify(
              {
                action: "send_group_msg",
                params: {
                  group_id: config.group,
                  message: message
                }
              }
            )
          )
        },
        changeName: function (name) {
          ws.send(
            JSON.stringify(
              {
                action: "set_group_name",
                params: {
                  group_id: config.group,
                  group_name: name
                }
              }
            )
          )
        }
      }
      if (
        msg.post_type == "message" &&
        msg.group_id == config.group &&
        msg.raw_message.startsWith(config.cmd) &&
        !config.permittedusers.includes(msg.sender.user_id)
      ) {
        fun.sendMessage("Permission Denied.");
      };
      if (
        msg.post_type == "message" &&
        msg.group_id == config.group &&
        msg.raw_message.startsWith(config.cmd) &&
        config.permittedusers.includes(msg.sender.user_id)
      ) {
        if (
          msg.raw_message == config.cmd
        ) {
          fun.changeName(config.nameprefix);
          fun.sendMessage("群名已重置为 " + config.nameprefix);
          fun.log("[Reset] " + config.nameprefix);
        } else if (
          msg.raw_message.startsWith(config.cmd + " ")
        ) {
          var newName = config.nameprefix + " " + msg.message[0].data.text.slice((config.cmd + " ").length)
          fun.changeName(newName)
          fun.sendMessage("群名已更改为 " + newName);;
          fun.log("[Set] " + newName);
        } else {
          fun.sendMessage("命令格式:" + config.cmd + " <群名后缀>");
        };
      }
    }
  }
}
