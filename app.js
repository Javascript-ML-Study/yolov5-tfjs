import express from 'express';

const app = express();

app.disable('x-powered-by');

//app.use('/', express.static('src'));
app.use('/', express.static('dist'));

app.listen(9000, err => {
    console.log(`[ + ] The server is running.`);
});