import express from 'express';

const app = express();
//const port = 3000;
const port = Process.env.port;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/hitesh', (request, response) => {
  response.send(<h1>Hii This is HITESH, Welcome..</h1>)
})

app.get('/leetcode', (req, res) => {
  res.send('<a href=https://leetcode.com>leetcode</a>')
})
app.get('/version 1 updated', (req, res) => {
  console.log('it the version 1 updated');
})

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});