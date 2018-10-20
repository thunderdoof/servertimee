
var x = 0
var y = 0
var counter = 0
var available_space_x = []
var available_space_y = []
var amount_of_balls = 3
var w = 50
var h = 50
var golf_width = 80
var golf_height = 80
var golf_club
var prev_mouse_x = 0
var prev_mouse_y = 0
var pseudo_x
var pseudo_y
function setup() {
    var canvas = createCanvas(window.innerWidth, window.innerHeight);
    console.log(canvas)
    golf_club = new GolfClub(golf_width, golf_height)

    ball_array = []
    //generateSpaceArray(w,h)

    var index_x = 0
    var index_y = 0

    for (var i = 0; i < amount_of_balls; i++) {

        var x
        var y
        /* if(index_y < window.innerHeight/h){ 
             index_y ++
             
         }else{
             index_y = 0
             index_x ++ 
         }
         x = available_space_x[index_x]
         y = available_space_y[index_y]
         console.log(x + ' ; ' + y)    */

        x = Math.floor(Math.random() * (window.innerWidth - w + 2 * w) - 2 * w);
        y = Math.floor(Math.random() * (window.innerHeight - h + 2 * h) - 2 * h);

        ball_array.push(new BouncingBall(x, y, w, h))



    }
}
function draw() {
    socket.emit('send_game_data', {x:mouseX, y:mouseY});
    counter++
    if (counter > 90) {
        //    changeDirection()
        counter = 0
    }
    background('white')
    rect(mouseX, mouseY, golf_club.width, golf_club.height)
    rect(pseudo_x, pseudo_y, golf_club.width, golf_club.height)

    for (var i = 0; i < ball_array.length; i++) {

        wallBounce(ball_array[i])
        if (ballClubCollision(ball_array[i])) {
            
            applyBatCollision(ball_array[i])

        }

        var result_ball = hasCollidedBall(ball_array[i])

        if (result_ball != null) {
            collisionModel(result_ball, ball_array[i])
        }



        fill(ball_array[i].colour)
        ellipse(ball_array[i].x, ball_array[i].y, ball_array[i].width, ball_array[i].height)
        ball_array[i].x = ball_array[i].x + ball_array[i].vx
        ball_array[i].y = ball_array[i].y + ball_array[i].vy

        applyFriction(ball_array[i])


    }
    prev_mouse_x = mouseX
    prev_mouse_y = mouseY
}

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

function generateSpaceArray(w, h) {

    for (var i = 0; i < window.innerWidth; i += w) {
        available_space_x.push(i)
        console.log(i)
        for (var j = 0; j < window.innerHeight; j += h) {
            available_space_y.push(j)

        }

    }

}






function getColour() {
    var colours = ['red', 'blue', 'yellow', 'green', 'orange']
    var random = Math.floor(Math.random() * (colours.length));
    return colours[random]
}

function changeDirection() {
    for (i = 0; i < ball_array.length; i++) {
        ball_array[i].vx += Math.floor(Math.random() * (6))
        ball_array[i].vy += Math.floor(Math.random() * (6))

    }
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

    if (ball.x - ball.width / 2 <= 0 || ball.x + ball.width / 2 >= window.innerWidth) {
        return true
    }
}

function hasCollidedyWall(ball) {
    if (ball.y - ball.height / 2 <= 0 || ball.y + ball.height / 2 >= window.innerHeight) {
        return true
    }
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

function applyFriction(ball) {
    const friction_constant = 0.991
    ball.vx = friction_constant * ball.vx
    ball.vy = friction_constant * ball.vy


}


function mouseMoved(event) {
    console.log('move the mouse')
}

function GolfClub(width, height) {
    this.width = width
    this.height = height
}

function ballClubCollision(ball) {
    if (ball.y + ball.height / 2 >= mouseY && ball.y - ball.height / 2 <= mouseY + golf_club.height) {

        if (ball.x + ball.width / 2 >= mouseX && ball.x - ball.width / 2 <= mouseX + golf_club.width) {

            return true
        }

    }
}
function getBoxVelocityX() {
    var x_velocity = mouseX - prev_mouse_x
    return x_velocity


}
function getBoxVelocityY() {
    var y_velocity = mouseY - prev_mouse_y
    return y_velocity
}
function applyBatCollision(ball) {
    var prev_ball_x = ball.x - ball.vx
    var prev_ball_y = ball.y - ball.vy

    if (prev_ball_x + ball.width / 2 > prev_mouse_x && prev_ball_x - ball.width / 2 < prev_mouse_x + golf_club.width) { //collided on the top
        console.log('top or bottom')
        
        if (ball.y > mouseY) {        //ball is below box
            console.log('hits from bottom')
            if (ball.vy < 0) {        //ball moving towards box
                ball.vy = -ball.vy
            } else {
                ball.y = mouseY + golf_club.height + ball.height / 2
            }
        } else {                      //ball above box
            console.log('hits from top')
            if (ball.vy > 0) {        //ball moving towards box
                ball.vy = -ball.vy 
            } else {
                ball.y = mouseY - ball.height / 2
            }
        }
    }
    else if (prev_ball_y + ball.height / 2 > prev_mouse_y && prev_ball_y - ball.height / 2 < prev_mouse_y + golf_club.height) { //collided the side
        (console.log('side'))
        console.log(prev_ball_y + ball.height / 2 - prev_mouse_y)
        console.log(prev_ball_y - ball.height / 2 - (prev_mouse_y + golf_club.height))
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
                ball.x = mouseX + golf_club.width + ball.width / 2    // set to right side of box
            }
        }
    }

    
}



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