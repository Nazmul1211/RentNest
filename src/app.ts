import express, { type Application } from "express";

const app : Application = express();
const port = 4000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

export default app;
