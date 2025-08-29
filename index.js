const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const FULL_NAME = "john_doe";
const DOB = "17091999";
const EMAIL = "john@xyz.com";
const ROLL_NUMBER = "ABCD123";

function isnum(value) {
  return /^-?\d+$/.test(value);
}

function isalpha(value) {
  return /^[a-zA-Z]+$/.test(value);
}

function revcap(str) {
  let reversed = str.split("").reverse().join("");
  return reversed
    .split("")
    .map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join("");
}

app.get("/", (req, res) => {
  res.send("BFHL API is running. Use POST /bfhl");
});

app.post("/bfhl", (req, res) => {
  try {
    const inp = req.body.data;

    if (!Array.isArray(inp)) {
      return res.status(400).json({
        is_success: false,
        message: "Invalid input",
      });
    }

    let odds = [];
    let evens = [];
    let alpha = [];
    let symbols = [];
    let sum = 0;
    let alphajoin = "";

    inp.forEach((item) => {
      if (isnum(item)) {
        let num = parseInt(item, 10);
        if (num % 2 === 0) {
          evens.push(item.toString());
        } else {
          odds.push(item.toString());
        }
        sum += num;
      } else if (isalpha(item)) {
        alpha.push(item.toUpperCase());
        alphajoin += item;
      } else {
        symbols.push(item);
      }
    });

    const response = {
      is_success: true,
      user_id: `${FULL_NAME}_${DOB}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers: odds,
      even_numbers: evens,
      alphabets: alpha,
      special_characters: symbols,
      sum: sum.toString(),
      concat_string: revcap(alphajoin),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      is_success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;