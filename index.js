import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/hitesh', (request, response) => {
  response.send('hii this is hitesh')
})

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});