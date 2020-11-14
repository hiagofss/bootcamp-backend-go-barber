import express, { response } from 'express';

const app = express();

app.get('/', (resquest, response) => [
  response.json({ message: 'Hello World' }),
]);

app.listen(3333, () => {
  console.log('✔ Server started on port');
});
