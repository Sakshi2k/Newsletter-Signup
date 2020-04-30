const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
  
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req, res) => {

    console.log(req.body);
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const phNum = req.body.phNum;
    const email = req.body.email;

    // console.log(firstName, lastName, email);
    const data = {
    members : [
        {
        email_address: email,
        status : "subscribed",
        merge_fields : {
            FNAME : firstName,
            LNAME : lastName,
            PHONE : phNum
        }
        }
    ]   
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us8.api.mailchimp.com/3.0/lists/529cffc56a";
    const options = {
        method: "POST",
        auth: "saku:2ed996a859eb298e8a6e18646ed8e9b1-us8"
    };

    const request = https.request(url, options, function(response) {
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })


        if(response.statusCode ===200){
            res.sendFile(__dirname + "/success.html");
        }
        else res.sendFile(__dirname + "/failure.html");
    // res.send("<h1>Hey</h1>");
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure",(req, res) => {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, () =>{
    console.log("Listening at port 3000");
});


// API KEY :
// 2ed996a859eb298e8a6e18646ed8e9b1-us8

//List ID:
// 529cffc56a

//https://infinite-wildwood-17047.herokuapp.com/