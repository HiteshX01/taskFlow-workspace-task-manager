import express from 'express';
const app = express();

import dotenv from 'dotenv';
dotenv.config();
//const port = 3000;
const port = process.env.PORT || 3000;

// to serve an html page from backend, we need view engine
app.set('view engine', 'ejs');

app.get('/html', (req,res) => {
  res.render('html');
})

// if we want that evey request must go somewhere else first before any serving
// this is middleware
app.use((req,res,next) => {
  console.log('this is middleware');

  // writing middleware logic
  const a = 32;
  const b = 21;
  console.log(a+b);

  return next(); // serve the actual respone now
})


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