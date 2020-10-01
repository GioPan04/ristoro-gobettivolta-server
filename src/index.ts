import express from 'express';
import api from './api';

const app = express();

app.use('/api', api);

app.get('/', (req, res) =>  {
    res.json({test: 'sas'});
});

app.listen(process.env.HTTP_PORT, () => console.log(`Server is listening on *:${process.env.HTTP_PORT}`))