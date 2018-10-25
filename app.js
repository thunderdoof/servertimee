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
var amount_of_balls = 7
var w = 30
var h = 30
var game_screen_width = 1024
var game_screen_height = 768
var bat_array = []
var bat_w = 80
var bat_h = 5
var bat_y = game_screen_height - 50


for (var i = 0; i < amount_of_balls; i++) {

    var x = Math.floor(Math.random() * (game_screen_width - w + 2 * w) - 2 * w);
    var y = Math.floor(Math.random() * (game_screen_height - h + 2 * h) - 2 * h);

    ball_array.push(new BouncingBall(x, y, w, h))
    console.log(ball_array[i])

}

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('send_game_data', function (data) {
        socket.broadcast.emit('send_position', data)
        //console.log(data)
    });
    socket.on('send_bat_position', function (data) {
        //console.log('im fucking sick of gabriel talking to me')
        for (var i = 0; i < bat_array.length; i++) {
            if (socket.id == bat_array[i].socket_id) {
                bat_array[i].x = data.x

            }
        }
    })
    if (bat_array.length == 0) {
        bat_array.push(new PongBat(bat_w, bat_h, bat_y, socket.id))
        console.log('addded first bat ' + bat_array[0].socket_id)
    }
    else if (bat_array.length == 1) {
        bat_array.push(new PongBat(bat_w, bat_h, 100, socket.id))
        console.log('addded second bat ' + bat_array[1].socket_id)
    }

    console.log(socket.id)


    setInterval(function () {
        
        for (var i = 0; i < amount_of_balls; i++) {
            wallBounce(ball_array[i])
            //applyGravity(ball_array[i])

            var result_ball = hasCollidedBall(ball_array[i])
            if (result_ball != null) {
                collisionModel(result_ball, ball_array[i])
            }
            ball_array[i].x = ball_array[i].x + ball_array[i].vx
            ball_array[i].y = ball_array[i].y + ball_array[i].vy
            for (var j = 0; j < bat_array.length ; j++) {
                bat_array[j].prev_x = bat_array[j].x
                applyBat(ball_array[i], bat_array[j]) 
                
                
            }

        }
        
        socket.broadcast.emit('send_ball_positions', { ball_array: ball_array })
        socket.broadcast.emit('send_bats', { bat_array: bat_array })
    }, 16)
}) //applies gravity every second


function BouncingBall(x, y, width, height) {
    this.x = x
    this.y = y  //set fields for this object
    this.vx = 4
    this.vy = 4;
    this.colour = getColour()
    this.width = width
    this.height = height

    //this.vx = Math.floor(Math.random() * (40 + 1) - 1);
    //this.vy = Math.floor(Math.random() * (40 + 1) - 1);
}

function PongBat(width, height, y, socket_id) {
    this.x = 0
    this.y = y
    this.width = width
    this.height = height
    this.socket_id = socket_id
    this.prev_x = 0

}
function getColour() {
    var colours = ['red', 'blue', 'yellow', 'green', 'orange']
    var random = Math.floor(Math.random() * (colours.length));
    return colours[random]
}

function applyGravity(ball) {
    const gravity_constant = 0.05
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

function collisionModel(ball_1, ball_2) {
    var original_ball_1_vx = ball_1.vx
    var original_ball_1_vy = ball_1.vy
    ball_1.vx = ball_2.vx
    ball_1.vy = ball_2.vy

    ball_2.vx = original_ball_1_vx
    ball_2.vy = original_ball_1_vy


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


function ballClubCollision(ball, bat) {
    if (ball.y + ball.height / 2 >= bat.y && ball.y - ball.height / 2 <= bat.y + bat.height) {

        if (ball.x + ball.width / 2 >= bat.x && ball.x - ball.width / 2 <= bat.y + bat.width) {

            return true
        }

    }
}

function applyBatCollision(ball, bat) {
    var prev_ball_x = ball.x - ball.vx

    if (prev_ball_x + ball.width / 2 > bat.prev_x && prev_ball_x - ball.width / 2 < bat.prev_x + bat.width) { //collided on the top
        console.log('top or bottom')

        if (ball.y > bat.y) {        //ball is below box
            console.log('hits from bottom')
            if (ball.vy < 0) {        //ball moving towards box
                ball.vy = -ball.vy
            } else {
                ball.y = bat.y + bat.height + ball.height / 2
            }
        } else {                      //ball above box
            console.log('hits from top')
            if (ball.vy > 0) {        //ball moving towards box
                ball.vy = -ball.vy
            } else {
                ball.y = bat.y - ball.height / 2
            }
        }
    }
}
function applyBat(ball, bat) {
    if (ballClubCollision(ball, bat)) {
        applyBatCollision(ball, bat)
    }
}