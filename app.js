var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const config = require("./config/keys")

require("./connections/dbConnection.js")

var bodyParser = require("body-parser");
var cors = require('cors')

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cors());
app.use(bodyParser.json())

var posts = require("./route/posts.js");

app.get('/', function (req, res) {
  res.send("Working on it")
  // res.sendFile(__dirname + '/index.html');
});

app.get("/api/getPosts", posts.getPost);
app.get("/api/loginUser", posts.loginUser);
app.post("/api/createPost", posts.createPost);
app.post("/api/toggleLike", posts.toggleLike);
app.post("/api/comment", posts.comment);
app.get("/api/getComments", posts.getComments);

app.get("/ping", (req, res) => res.send("ping"))


var socketRoute = require("./socket/socket.js")
io.on('connection', (socket) => socketRoute);


app.listen(config.PORT, () => console.log(`Example app listening on PORT ${config.PORT}!`))