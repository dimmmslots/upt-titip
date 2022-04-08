const exp = require('constants');
const express = require('express');
const app = express();
const routes = require('./routes');

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use('/', routes);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});