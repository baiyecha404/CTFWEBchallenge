/* Imports */
const cookieParser = require("cookie-parser");
const express = require("express");
const jwt = require("jsonwebtoken");
const secrets = require("./config/secrets");
const path = require("path");

const app = express();
const port = 3000;
const cookieOptions = {
  httpOnly: true,
  sameSite: "None",
  secure: true,
};

/* Middlewares */
app.use(cookieParser());

/* Home */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/src/index.html"));
});
// Assets
app.get("/js/font-awesome-kit.js", (req, res) => {
  res.sendFile(path.join(__dirname + "/src/js/font-awesome-kit.js"));
});

/* API */
app.get("/api", (req, res) => {
  res.type("application/json");
  res.json({
    name: "Criss Cross",
    version: "0.1.0",
    description: "Philosophy on Pwning",
  });
});

/* Quotes */
let quotes = [
  {
    id: 1,
    quote: "Brick aids creation, but the kind matters.",
    author: "PwnFunction",
  },
  {
    id: 2,
    quote: "There shouldn't be actions between when you see and when you do.",
    author: "PwnFunction",
  },
  {
    id: 3,
    quote:
      "You see a thing not for what it is but, for what one told you it is.",
    author: "PwnFunction",
  },
  {
    id: 4,
    quote: "Where there is a mixture of context, there lies stangeness.",
    author: "PwnFunction",
  },
  {
    id: 5,
    quote: "Foundation comes first then the house, order matters.",
    author: "PwnFunction",
  },
  {
    id: 6,
    quote: "A common phenomena between perspective and time is relativity.",
    author: "PwnFunction",
  },
  {
    id: 7,
    quote: "One must learn to break complexity into simplicty.",
    author: "PwnFunction",
  },
];
// All Quotes
app.get("/api/quotes", (req, res) => {
  return res.json(quotes);
});
// Quote
app.get("/api/quote/:id", (req, res) => {
  return res.json(quotes.filter((q) => q.id == req.params.id));
});

// Generate JWT `admin=false`
function generate() {
  return jwt.sign({ name: "guest", admin: false }, secrets.JWT_SECRET, {
    expiresIn: 60 * 60 * 10000,
  });
}

/* Login */
app.get("/api/login", (req, res) => {
  if (!req.cookies.token) {
    let token = generate();
    res.cookie("token", token, cookieOptions);
    res.status(201);
    return res.json({
      code: 201,
      message: "Created",
    });
  }

  try {
    let decoded = jwt.verify(req.cookies.token, secrets.JWT_SECRET);
  } catch (err) {
    let token = generate();
    res.cookie("token", token, cookieOptions);
    res.status(205);
    return res.json({
      code: 205,
      message: "Reset",
    });
  }

  res.status(200);
  return res.json({
    code: 200,
    message: "OK",
  });
});

/* FLAG */
app.get("/api/flag", (req, res) => {
  if (req.cookies.token) {
    try {
      let decoded = jwt.verify(req.cookies.token, secrets.JWT_SECRET);
      if (decoded.admin === true) {
        res.status(200);
        return res.json({
          code: 200,
          message: "OK",
          flag: secrets.FLAG,
        });
      }
    } catch (err) {
      res.cookie("token", "", cookieOptions);
      res.status(401);
      return res.json({
        code: 401,
        message: "Unauthorized",
      });
    }
  }

  // Forbidden
  res.status(403);
  return res.json({
    code: 403,
    message: "Forbidden",
  });
});

/* DEBUG */
app.post("/debug", (req, res) => {
  // Filter problematic characters
  for (i in req.query) {
    try {
      req.query[i] = req.query[i].replace(
        /[\/\*\'\"\`\<\\\>\-\(\)\[\]\=]/g,
        ""
      );
      console.log(req.query[i]);
    } catch {
      continue;
    }
  }
  res.type("json");

  // Debug Info
  try {
    if (req.cookies.token) {
      let all = "";

      // HTTP Version
      all += `HTTP Version: ${req.httpVersion}\n`;

      // HTTP Headers
      all += `\nHeaders:\n`;
      for (i in req.headers) {
        all += `  - ${i}: ${req.headers[i]}\n`;
      }
      
      // HTTP Query Params
      all += `\nParameters:\n`;
      for (i in req.query) {
        //so here req.query[0]={'toString':'a'} which is an object 
        //it will cause error when converting it into strings.
        all += `  - ${i}: ${req.query[i]}\n`;
      }
      
      return res.send(all);
    }
  } catch (e) {
    // Print Error
    let token = req.cookies.token || "";
    let title = req.query.title || "Error";

    return res.send(`${title} [${new Date().getTime()}] - <${e}>\n${token}`);
  }

  // Forbidden
  res.status(403);
  return res.json({
    code: 403,
    message: "Forbidden",
  });
});

/* Report URI */
app.get("/report", (req, res) => {
  // Admin will take a look at these reports to validate them
  // ...
});

// Listen
app.listen(port, () => console.log(`Listening on ${port}...`));
