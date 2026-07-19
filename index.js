import express from 'express';
const app = express();

import dotenv from 'dotenv';
dotenv.config();
//const port = 3000;
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('this is home page');
});

app.get('/hitesh', (request, response) => {
  response.send('<h1>Hii This is HITESH, Welcome..</h1>')
})

app.get('/leetcode', (req, res) => {
  res.send('<a href=https://leetcode.com>leetcode</a>')
})
app.get('/profile', (req, res) => {
  res.send('profile page');
})

app.get('/about', (req, res) => {
  res.send('this is about section');
})

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});