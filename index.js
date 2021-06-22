const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));

//cors
app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/boards', (req, res) => {
    res.render('board/boards');
})
app.get('/boards/boardInfo', (req, res) => {
    res.render('board/boardInfo');
})
app.get('/boards/write', (req, res) => {
    res.render('board/write');
})

app.listen(port, () => {
    console.log(`app listening at https://ori-blog.run.goorm.io`)
});