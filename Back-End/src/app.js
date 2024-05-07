const express = require("express");
const app = express();

app.use(express.urlencoded());
app.use(express.json());


app.listen(5000, () => console.log("Listening on port 5000"))