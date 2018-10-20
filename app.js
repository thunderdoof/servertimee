const express = require('express')
const app = express()
const expressValidator = require('express-validator');
const path = require('path')
const bodyParser = require('body-parser');

var server = require('http').Server(app);
var io = require('socket.io').listen(server);
const port = 3000
app.use(expressValidator())
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/client', express.static(__dirname + '/client'));
//app.use('/public', express.static(path.join(__dirname, 'public')))

server.listen(process.env.PORT || port);
console.log("Server started")
app.get('/game', function(req, res){
    res.sendFile(path.join(__dirname + '/views/index.html'))
})
// app.get('/iloveu', (req, res) => res.send('I love you too'))
app.post('/submit_form', function(req, res){
    var firstname = req.body.firstname
    var lastname  = req.body.lastname
    res.send('Your name is ' + firstname + ' ' + lastname)
}) 
io.on('connection' , function(socket){
    console.log('a user connected');
  });