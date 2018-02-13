const path = require('path');
const express = require('express');

const app = express();
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

app.listen(port, () => {
    console.log(`app started listening at the port ${port}`)
});






//TESTING
// console.log(`${__dirname}/../public`); //displays D:\NODE.js\chatApp13feb\server/../public which is not necessary to show two dots going back
//solution
// console.log(path.join(`${__dirname}/../public`)); //resolves the path and sends back
//TESTING