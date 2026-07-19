import express from 'express';
import morgan from 'morgan';
const app = express();

import dotenv from 'dotenv';
dotenv.config();
//const port = 3000;
const port = process.env.PORT || 3000;

// using a third party middleware, morgan logger
app.use(morgan('dev'));


// if we want that evey request must go somewhere else first before any serving
// this is middleware , middle ware uses funtion takes three parameters always
// this is coustom middleware
// let we want a coustom middleware for a specific page only
app.get('/subscription',(req,res,next) => {
  const a = 10;
  const b = 11;
  console.log(a+b);

  console.log('coustom middleware, only for the subscription page');

  next()

},(req, res) => {
  res.send('your subscription is active');
})

app.use((req,res,next) => {
  console.log('this is middleware');

  // writing middleware logic
  const a = 32;
  const b = 21;
  console.log(a+b);

  return next(); // serve the actual respone now
})

// to serve an html page from backend, we need view engine
app.set('view engine', 'ejs');

app.get('/html', (req,res) => {
  res.render('html');
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