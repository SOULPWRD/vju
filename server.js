import express from "express";
import { makeMainLayout } from "./layout/main.js";
import { render } from "./html.js";
import { readFile, writeFile } from "node:fs/promises";

const server = express();
const port = 8000;

server.use(express.urlencoded({ extended: false }));
server.use("/assets", express.static("public"));

server.get("/", function (_ignore, res) {
  return res.send(render(makeMainLayout()));
});

server.get("/snippets", async function (req, res) {
  const { name } = req.query;
  const snippets = await readFile("./public/db.json");
  return res.send(JSON.parse(snippets)[name]);
});

server.put("/snippets", async function (req, res) {
  const payload = req.body;

  if (!payload.content) {
    return res.sendStatus(500);
  }

  const snippets = JSON.parse(await readFile("./public/db.json"));
  const data = {
    ...snippets,
    [payload.name]: payload.content,
  };
  await writeFile("./public/db.json", JSON.stringify(data));
  return res.sendStatus(204);
});

server.listen(port, function () {
  console.log("Server is running at http://localhost:" + port);
});
