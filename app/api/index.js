const express = require("express");

const app = express();

const PORT = 3000;

const expressJsApp = ({ rkwpbot }) => {
  app.get("/api/send", (req, res) => {
    const { to, message } = req.query;
    // const prefixRegex =
    //   /^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/;
    // const prefix =
    //   /^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/.test(to)
    //     ? to.match(
    //         /^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/gi
    //       )
    //     : "#";
    // const isCommand = to.startsWith(prefix);
    // const command = isCommand
    //   ? to.trim().match(prefixRegex)[0].toLowerCase()
    //   : null;
    rkwpbot.ev.emit("from.api", { to, message });
    res
      .json({
        to,
        command,
      })
      .status(200);
  });

  app.listen(PORT, () => {
    console.log("Express running in port: " + PORT);
  });
};

module.exports = expressJsApp;
