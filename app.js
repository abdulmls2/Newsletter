const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.get("/", function(req, res) {
  // res.send("test");
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const email = req.body.emailaddress;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {FNAME:firstName, LNAME:lastName}
      }
    ]
  }

  const jsdonData = JSON.stringify(data);

  const url = "https://us20.api.mailchimp.com/3.0/lists/54c207d449";

  const options = {
    method: "POST",
    auth: "jimmy:bf9b2632704258473d02be0d8787d5a5-us20"
  }

  const request = https.request(url, options, function(response) {

    // after sign up
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    }
    else {
      res.sendFile(__dirname + "/failure.html")
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })

  })

  // sending data
  request.write(jsdonData);
  request.end();

});


// redirecting if error after signing up
app.post("/failure", function(req, res) {
  res.redirect("/")
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server running on port 3000");
});


// api key
// bf9b2632704258473d02be0d8787d5a5-us20

// audience id
// 54c207d449
