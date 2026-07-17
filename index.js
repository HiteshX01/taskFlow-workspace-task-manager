import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/hitesh', (request, response) => {
  response.send('hii this is hitesh')
})

app.get('/version 1 updated', (req, res) => {
  console.log('it the version 1 updated');
})

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});