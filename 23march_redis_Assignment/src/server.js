const app = require("./index.js");
const connect = require("./configs/db.js");

app.listen(4321, async function () {
    await connect();
    console.log("listening on port 4321");
});