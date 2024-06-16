const { Router } = require("express");
const { z } = require("zod");
const database = require("../utils/database");
const router = Router();
const db = database();

router.get("/", async (req, res) => {
  if (!req.query.id)
    return res.send({ message: "Missing 'id' query parameter", status: 400 });
  let question = await db
    .from("questions")
    .select("*")
    .eq("question", req.query.question);
  if (!question.data.length)
    return res.send({ status: 404, message: "Question not found" });
  return res.send({ data: question.data, status: 200 });
});

router.get("/all", async (req, res) => {
  let content = await db.from("questions").select("*");
  if (content.error)
    return res.send({ message: content.error.details, status: content.status });
  return res.send({ results: content.data, status: 200 });
});

router.post("/create", async (req, res) => {
  const schema = z.object({
    question: z.string(),
    category: z.string(),
    difficulty: z.string(),
    correct_answer: z.string(),
    incorrect_answers: z.array(z.string()),
  });
  const question = schema.safeParse(req.body);
  if (!question.success)
    return res.send({ status: 403, message: question.error });
  const query = await db.from("questions").insert(question.data);
  if (query.error)
    return res.send({ status: query.status, message: query.error.details });
  return res.send({ status: 200, message: "Success" });
});

module.exports = router;
