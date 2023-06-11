module.exports = function webpageScreenshotEntry(config, ws) {
  return {
    messageHandler: async function (msg) {
      const fun = {
        log: function (text) {
          console.log("[WebpageScreenshot]" + text);
        }
      };
      if (
        msg.post_type == "message" &&
        msg.raw_message.startsWith(config.prefix)
      ) {
        if (
          config.permittedusers.includes(msg.sender.user_id)
        ) {
          if (msg.message[0].data.text.slice(config.prefix.length).startsWith("http://" || "https://")) {
            const browser = await require("puppeteer").launch({
              headless: "new"/*,
              args: ["--disable-gpu","--no-sandbox"],
              executablePath: "/snap/bin/chromium"*/

            });
            const page = await browser.newPage();
            await page.goto(msg.message[0].data.text.slice(config.prefix.length), { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(6000);
            buffer = await page.screenshot({ fullPage: true });
            switch (msg.message_type) {
              case "group":
                ws.send(
                  JSON.stringify(
                    {
                      action: "send_group_msg",
                      params: {
                        group_id: msg.group_id,
                        message: [
                          {
                            type: "image",
                            data: {
                              file: buffer.toString("base64url")
                            }
                          }
                        ]
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
                        user_id: msg.sender.user_id,
                        message: [
                          {
                            type: "image",
                            data: {
                              file: buffer.toString("base64url")
                            }
                          }
                        ]
                      }
                    }
                  )
                );
                break;
            };
            fun.log(`Responded screenshot request from user ${msg.sender.card || msg.sender.nickname}(${msg.sender.user_id})`);
            await page.close();
            await browser.close();
          };

        } else {
          switch (msg.message_type) {
            case "group":
              ws.send(
                JSON.stringify(
                  {
                    action: "send_group_msg",
                    params: {
                      group_id: msg.group_id,
                      message: config.denyMessage
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
                      user_id: msg.sender.user_id,
                      message: config.denymessage
                    }
                  }
                )
              );
              break;
          }
        };
      };
    }
  };
}