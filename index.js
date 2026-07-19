import express from 'express';
import morgan from 'morgan';
const app = express();

import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;

//built in middlewares
app.use(express.json());
app.use(express.urlencoded({ extended:true }))

//third party middleware, morgan logger
app.use(morgan('dev'));

// this is middleware , middleware uses funtion takes three parameters always
app.use((req,res,next) => {
  console.log('this is middleware');
  return next(); // serve the actual respone now
})

// to serve an html page from backend, we need view engine
app.set('view engine', 'ejs');

app.get('/form', (req,res) => {
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

app.post('/form-data', (req,res) => {
  console.log(req.body);
  res.send('<h2>form submitted</h2>')
})

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});