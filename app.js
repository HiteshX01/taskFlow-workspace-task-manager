import express from 'express';
import morgan from 'morgan';
import { userModel } from './models/user.js';
import { dbConnection } from './config/db.js';
const app = express();

import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;

//built in middlewares
app.use(express.json());
app.use(express.urlencoded({ extended:true }))

//third party middleware, morgan logger
app.use(morgan('dev'));
// to able to link other files(css,js etc) to html ejs,
app.use(express.static('public'));

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

app.post('/form-data', (req,res) => {
  console.log(req.body);
  res.send('<h2>form submitted</h2>')
})

// to serve the register page
app.get('/register', (req,res) => {
  res.render('register');
})
// to get the data from the form
app.post('/register',async (req,res) => {
  console.log(req.body);
  const {username, email, password} = req.body;
  await userModel.create({
    username: username,
    email:email,
    password:password
  })
  res.send('registered successfully')
})

app.get('/get-users', (req, res) => {
  userModel.find({
    username:'w' // those have username w
  }).then((users) => {
    res.send(users);
  })
})

// update
app.get('/update-user', (req,res) => {
  userModel.findOneAndUpdate({
    username: 'w'
  },{
    username: 'well',
    email: 'well@w.com'
  }).then(() => {
    res.send('user w updated');
  })
})

//delete
app.get('/delete-user', (req, res) => {
  userModel.findOneAndDelete({
    username: 'wellwishers067'
  }).then(() => {
    res.send('user deleted')
  })
})

app.get('/', (req, res) => {
  res.send('this is home page');
});

app.get('/hitesh', (request, response) => {
  response.send('<h1>Hii This is HITESH, Welcome..</h1>')
})

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});