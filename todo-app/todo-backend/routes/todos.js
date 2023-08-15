const express = require("express");
const { Todo } = require("../mongo");
const redis = require("../redis");
const router = express.Router();

const redisKey = "todosCount";

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

router.get("/stats", async (_, res) => {
  const todosCount = Number(await redis.getAsync(redisKey));
  res.send({ added_todos: todosCount });
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  const prevTodosCount = Number(await redis.getAsync(redisKey));
  console.log(prevTodosCount, typeof prevTodosCount);
  await redis.setAsync(redisKey, prevTodosCount + 1);
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.todo.id, req.body, {
      new: true,
    });
    if (!todo)
      return res.status(404).send("The todo with the given ID was not found.");
    res.send(todo);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
