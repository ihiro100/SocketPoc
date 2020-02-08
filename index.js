var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var io = require('socket.io')(app);
var fs = require('fs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(cors());
app.use(bodyParser.json())

var posts = require("./route/posts.js");

app.get("/getPosts", posts.getPost)


var listener = app.listen(8080, () => {
    console.log("Listening on port " + listener.address().port);
});


io.on('connection', function (socket) {
    socket.emit('news', {
        hello: 'world'
    });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});