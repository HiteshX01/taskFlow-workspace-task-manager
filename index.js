import express from 'express';
import 'dotenv/config'
const app = express();

const port = process.env.port;


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/hitesh', (req, res) => {
  res.send('hii this is hitesh');
})

app.get('/leetcode', (req, res) => {
  res.send('<a href="https://leetcode.com" target="_blank">go to leetcode</a>');
})
app.listen(port, () => {
  console.log(`app server is running, is listening on port ${port}`);
});