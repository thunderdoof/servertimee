
var x = 0
var y = 0
var counter = 0
var available_space_x = []
var available_space_y = []
var amount_of_balls = 3
var w = 50
var h = 50

var pong_bat
var prev_mouse_x = 0
var prev_mouse_y = 0
var pseudo_x = window.innerWidth / 2
var server_ball_array = []
var server_bat_array = []
function setup() {
    var canvas = createCanvas(window.innerWidth, window.innerHeight);
    console.log(canvas)


}

function draw() {
    socket.emit('send_bat_position', { x: mouseX });

    counter++
    if (counter > 90) {
        //    changeDirection()
        counter = 0
    }
    background('white')
    //rect(mouseX, pong_bat.y, pong_bat.width, pong_bat.height)
    //rect(pseudo_x, pseudo_pong_bat.y, pseudo_pong_bat.width, pseudo_pong_bat.height)


    for (var i = 0; i < server_ball_array.length; i++) {
        //

        //for (var j = 0; j < bat_array.length; j++) {
        //applyBat(server_ball_array[i], bat_array[j])
        //}


        fill(server_ball_array[i].colour)
        ellipse(server_ball_array[i].x, server_ball_array[i].y, server_ball_array[i].width, server_ball_array[i].height)
        //server_ball_array[i].x = server_ball_array[i].x + server_ball_array[i].vx
        //server_ball_array[i].y = server_ball_array[i].y + server_ball_array[i].vy

        //applyFriction(server_ball_array[i])
        //addGravity(server_ball_array[i])

    }

    for (var i = 0; i < server_bat_array.length; i++) {
        //fill(server_bat_array[i].colour)
        rect(server_bat_array[i].x, server_bat_array[i].y, server_bat_array[i].width, server_bat_array[i].height)
        
    }
}

    function generateSpaceArray(w, h) {

        for (var i = 0; i < window.innerWidth; i += w) {
            available_space_x.push(i)
            console.log(i)
            for (var j = 0; j < window.innerHeight; j += h) {
                available_space_y.push(j)

            }

        }

    }

    function changeDirection() {
        for (i = 0; i < server_ball_array.length; i++) {
            server_ball_array[i].vx += Math.floor(Math.random() * (6))
            server_ball_array[i].vy += Math.floor(Math.random() * (6))

        }
    }

    function applyFriction(ball) {
        const friction_constant = 0.991
        ball.vx = friction_constant * ball.vx
        ball.vy = friction_constant * ball.vy

    }

    function mouseMoved(event) {
        console.log('move the mouse')
    }




    function getBoxVelocityX() {
        var x_velocity = mouseX - prev_mouse_x
        return x_velocity

    }
 
    /*else if (prev_ball_y + ball.height / 2 > prev_mouse_y && prev_ball_y - ball.height / 2 < prev_mouse_y + pong_bat.height) { //collided the side
        (console.log('side'))
        console.log(prev_ball_y + ball.height / 2 - prev_mouse_y)
        console.log(prev_ball_y - ball.height / 2 - (prev_mouse_y + pong_bat.height))
        if (ball.x < mouseX) {        //ball is on the left
            console.log('left of box')
            if (ball.vx > 0) {        //ball moving towards box
                
                ball.vx = -ball.vx
            } else {
                ball.x = mouseX - ball.width / 2
            }
        } else {                      //ball is on the right
            console.log('right of box')
            if (ball.vx < 0) {        //ball moving towards box
                ball.vx = -ball.vx
            } else {
                ball.x = mouseX + pong_bat.width + ball.width / 2    // set to right side of box
            }
        }
    } */






/*window.onload = function() {
 ball_centre_x = ball.x + ball.width
 ball_centre_y = ball.y + ball.height
console.log('bonjour')
var canvas = document.getElementById('myCanvas')  // variable canvas given by document.get  document referes it to the whole doc, then elent id references the canvas object within - recognized html object type-->
console.log(canvas)
var ctx = canvas.getContext("2d"); //prebuilt fucnt
for (var i = 0; i < 100; i++) {
    var random_x = Math.random() * (1000 - 100) + 100;
    var random_y = Math.floor(Math.random() * 800);
    var random_r = Math.floor(Math.random() * 99);
    var col = getColour()
    ctx.strokeStyle=col;
    ctx.beginPath();
    ctx.arc(random_x,random_y,random_r,0,2*Math.PI);
    ctx.fillStyle=col;
    ctx.fill();
    ctx.stroke();
   
} 


}
} //onload makes sure the javascript doesnt run until html is loaded */