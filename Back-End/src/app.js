const express = require("express");
require("dotenv/config");
const questionAPI = require("./api/questions")
const cors = require("cors")
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: "*" }))
app.use('/api/question', questionAPI)

app.use("*", (_, res) => res.send({ message: `${_.method} are not allowed using ${_.path} path`, status: 404 }))

app.listen(3000, () => console.log("Listening on port 3000"))