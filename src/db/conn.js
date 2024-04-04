const mongoose = require("mongoose");


mongoose.connect("mongodb://localhost:27017/Easycalm", {


}).then(() => {
    console.log("Connection successful");

}).catch((e) => {
    console.log("connect to mongo failed ");
})


