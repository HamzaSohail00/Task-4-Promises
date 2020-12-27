const request = require("request");
const cheerio = require("cheerio");
const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
//express
const app = express();

app.use(expressEjsLayouts);
app.set("view engine", "ejs");

//Global Variables
let titlesProccessed = 0;
var titles = (add = []);

app.get("/I/want/title/", (req, res) => {
  address = req.query.address; //get url params
  arrayCheck = Array.isArray(address); //check wether the address is array or not
  if (!arrayCheck && address !== undefined) {
    //if it is not array then it means only one address is given in params
    let temp = [];
    temp.push(address);
    address = temp; //converting address type to array
  }
  if (!address) {
    //if address param is not given in url then this block of code will be executed
    res
      .status(404)
      .send(
        "Must provide address is URL: \n e.g. \\I\\want\\title\\?address=url.com"
      );
  } else if (address) {
    //if address is given then this block of code will execulte
    titlesProccessed = 0;
    titles = [];
    address.forEach((url) => {
      checkUrlhttp = url.includes("http://"); //checking url type
      if (!checkUrlhttp) {
        //
        let checkUrlhttps = url.includes("https://"); //checking url type
        if (!checkUrlhttps) {
          url = `https://${url}`; //if url protocol is not http then it will consider it https
        }
      }
      parseBody(url).then((titles) => {
        console.log("Titles Final: " + titles);
        console.log("Address Final: " + address);
        res.render("layout", {
          //layout.ejs rendering
          address,
          titles,
        });
      });
    });
  }
});

//Return Promise
function parseBody(url) {
  return new Promise((resolve, reject) => {
    request(
      {
        url,
      },
      function (error, response, body) {
        if (body) {
          let $ = cheerio.load(body);
          t = $("title").text();
          titles.push(t);
          console.log("Titles:" + titles);
        } else {
          titles.push("No Response");
        }
        titlesProccessed++;
        if (titlesProccessed == address.length) {
          //condition for callback
          resolve(titles);
        }
      }
    );
  });
}
app.get(["/*", "/I/*", "I/want/title/"], (req, res) => {
  //In case of any error
  res.status(404).send("404: Not found");
});
app.listen(4000, () => {
  console.log("Server is up on port 4000");
});
