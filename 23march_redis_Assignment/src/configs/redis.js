const { createClient } = require("redis");

const client=createClient({url:"redis://localhost:6379"});

client.on("error" , function(err){   // if we get error at the time of connection it will go to this error part;
    console.log({message:err.message})
});

module.exports = client;