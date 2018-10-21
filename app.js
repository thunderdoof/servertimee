const express = require('express')
const app = express()
const expressValidator = require('express-validator');
const path = require('path')
const bodyParser = require('body-parser');

var server = require('http').Server(app);
var io = require('socket.io').listen(server);
const port = 3000
app.use(expressValidator())
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

server.listen(process.env.PORT || port);
console.log("Server started")
app.get('/game', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'))
})
// app.get('/iloveu', (req, res) => res.send('I love you too'))
app.post('/submit_form', function (req, res) {
    var firstname = req.body.firstname
    var lastname = req.body.lastname
    res.send('Your name is ' + firstname + ' ' + lastname)
})

var ball_array = []
var amount_of_balls = 3
var w = 50
var h = 50
var game_screen_width = 1024
var game_screen_height = 768
for (var i = 0; i < amount_of_balls; i++) {

    var x = Math.floor(Math.random() * (game_screen_width - w + 2 * w) - 2 * w);
    var y = Math.floor(Math.random() * (game_screen_height- h + 2 * h) - 2 * h);

    ball_array.push(new BouncingBall(x, y, w, h))
    console.log(ball_array[i])
    
}

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('send_game_data', function (data) {
        socket.broadcast.emit('send_position', data)
        //console.log(data)
    });
    setInterval(function(){ 
    for(var i = 0; i < amount_of_balls; i++){
        wallBounce(ball_array[i])
        applyGravity(ball_array[i])
        hasCollidedBall(ball_array[i]) 
        ball_array[i].x = ball_array[i].x + ball_array[i].vx
        ball_array[i].y = ball_array[i].y + ball_array[i].vy   

    }

        console.log(ball_array[0].y)    
        socket.broadcast.emit('send_ball_positions', {ball_array: ball_array})

    },17) //applies gravity every second
});

function BouncingBall(x, y, width, height) {
    this.x = x
    this.y = y  //set fields for this object
    this.vx = 7
    this.vy = 7;
    this.colour = getColour()
    this.width = width
    this.height = height

    //this.vx = Math.floor(Math.random() * (40 + 1) - 1);
    //this.vy = Math.floor(Math.random() * (40 + 1) - 1);
}    
function getColour() {
    var colours = ['red', 'blue', 'yellow', 'green', 'orange']
    var random = Math.floor(Math.random() * (colours.length));
    return colours[random]
}

function applyGravity(ball) {
    const gravity_constant = 0.1
    ball.vy += gravity_constant
}

function hasCollidedBall(ball) {
    reference_ball_centre_x = ball.x + ball.width
    reference_ball_centre_y = ball.y + ball.height
    for (i = 0; i < ball_array.length; i++) {
        if (ball != ball_array[i]) {
            ball_centre_x = ball_array[i].x + ball_array[i].width
            ball_centre_y = ball_array[i].y + ball_array[i].height
            var xdistance = reference_ball_centre_x - ball_centre_x
            var ydistance = reference_ball_centre_y - ball_centre_y
            var distance = Math.sqrt(Math.pow(xdistance, 2) + Math.pow(ydistance, 2))

            if (distance <= ball.width) {

                return ball_array[i]
            }
        }
    }

    return null

}

function wallBounce(ball) {
    if (hasCollidedxWall(ball)) {
        ball.vx = -ball.vx
    }

    if (hasCollidedyWall(ball)) {
        ball.vy = -ball.vy
    }
}

function hasCollidedxWall(ball) {

    if (ball.x - ball.width / 2 <= 0 || ball.x + ball.width / 2 >= game_screen_width) {
        return true
    }
}

function hasCollidedyWall(ball) {
    if (ball.y - ball.height / 2 <= 0 || ball.y + ball.height / 2 >= game_screen_height) {
        return true
    }
}