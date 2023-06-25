module.exports = function (config, bot, msg) {
  const fun = {
    log: function (text) {
      console.log("[CustomReply]" + text);
    }
  };
  config.rules.forEach(function (rule) {
    if (
      msg.post_type == "message" &&
      (
        (
          rule.type == "group" &&
          msg.message_type == "group" &&
          (
            rule.groups == "any" ||
            rule.groups.includes(msg.group_id)
          )
        ) ||
        (
          rule.type == "private" &&
          msg.message_type == "private"
        ) ||
        (
          rule.type == "any"
        )
      ) &&
      (new RegExp(rule.regExp, "i")).test(msg.raw_message)
      // (rule.ignoreCase ? (new RegExp(rule.regExp,"i")) : (new RegExp(rule.RegExp))).test(msg.raw_message)
    ) {
      switch (msg.message_type) {
        case "group":
          fun.log(`Responded Group Message from group ${msg.group_id} by user ${msg.sender.card}(${msg.sender.user_id})`);
          fun.log(`  Content: ${msg.raw_message}`);
          fun.log(`  Response: ${rule.message}`);
          bot.sendMessage.group(msg.group_id, rule.message);
          break;
        case "private":
          fun.log(`Responded Private Message from ${msg.sender.nickname}(${msg.sender.user_id})`);
          fun.log(`  Content: ${msg.raw_message}`);
          fun.log(`  Response: ${rule.message}`);
          bot.sendMessage.private(msg.user_id, rule.message);
          break;
      };
    };
  });
  config.nudgeReplies.forEach(function (rule) {
    if (
      msg.post_type == "notice" &&
      msg.notice_type == "notify" &&
      msg.sub_type == "poke" &&
      msg.target_id == msg.self_id &&
      (
        rule.groups == "any" ||
        rule.groups.includes(msg.group_id)
      )
    ) {
      fun.log(`Responded Poke Message from group ${msg.group_id} by user ${msg.user_id}`);
      fun.log(`  Content: ${rule.mesdage}`);
      bot.sendMessage.group(msg.group_id, rule.message);
    };
  });
};