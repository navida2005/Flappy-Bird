// Game constants
let move_speed = 3;           // Speed at which the pipes move
let gravity = 0.5;            // Gravity that pulls the bird down
let bird = document.querySelector(".bird");  // Select the bird element
let img = document.getElementById("bird-1"); // Select the bird image
let sound_point = new Audio("sounds/point.mp3");  // Sound when scoring a point
let sound_die = new Audio("sounds/die.mp3");      // Sound when the game ends

// Get bird properties (position and size)
let bird_props = bird.getBoundingClientRect();
console.log(bird_props.left, bird_props.right, bird_props.top, bird_props.bottom);

// Get background dimensions
let background = document.querySelector(".background").getBoundingClientRect();

// UI elements
let score_val = document.querySelector(".score_val"); // Score display
let message = document.querySelector(".message");     // Message display
let score_title = document.querySelector(".score_title"); // Score title

// Initial game state
let game_state = "Start";   // Game starts in "Start" state
img.style.display = "none"; // Hide the bird initially
message.classList.add("message-style"); // Apply message style

// Start the game when Enter or Space is pressed
document.addEventListener("keydown", function(e) {
    // Check if the key pressed is Enter or Space and if the game is not already playing
    if((e.key == "Enter" || e.key == " ") && game_state != "Play"){
        // Remove existing pipes from the screen
        let pipes = document.querySelectorAll(".pipe");
        for (let i = 0; i < pipes.length; i++) {
            pipes[i].remove();
        }
        
        // Show the bird and reset its position
        img.style.display = "block";
        bird.style.top = "40vh";  // Position bird at 40% of the viewport height
        
        // Set game state to "Play" and reset score
        game_state = "Play";
        message.innerHTML = "";
        score_title.innerHTML = "Score: ";
        score_val.innerHTML = "0";
        message.classList.remove("message-style"); // Remove message style
        
        play(); // Start the game
    }
});

// Function to start the game logic
function play(){
    // Function to move pipes
    function move(){
        if(game_state != "Play"){
            return;  // Stop moving pipes if the game is not in "Play" state
        }
        
        // Move each pipe and check for collisions
        let pipes = document.querySelectorAll(".pipe");
        for (let i = 0; i < pipes.length; i++) {
            let element = pipes[i];
            let pipe_props = element.getBoundingClientRect(); // Get pipe properties
            bird_props = bird.getBoundingClientRect();         // Update bird properties

            // Remove pipes that have moved off-screen
            if(pipe_props.right <= 0){
                element.remove();
            } else {
                // Check if bird has collided with a pipe
                if(
                    bird_props.left < pipe_props.left + pipe_props.width &&
                    bird_props.left + bird_props.width > pipe_props.left &&
                    bird_props.top < pipe_props.top + pipe_props.height &&
                    bird_props.top + bird_props.height > pipe_props.top
                ){
                    game_state = "End";  // End the game if collision occurs
                    message.innerHTML = "Game Over".fontcolor("red") + "<br> Press Enter To Restart";
                    message.classList.add("message-style");
                    img.style.display = "none";  // Hide the bird
                    sound_die.play();            // Play die sound
                    return;
                } else {
                    // Increase score if bird has passed a pipe
                    if(pipe_props.right < bird_props.left && pipe_props.right + move_speed >= bird_props.left && element.increase_score == "1"){
                        score_val.innerHTML = +score_val.innerHTML + 1; // Increase score
                        sound_point.play();   // Play point sound
                    }
                    // Move pipe to the left
                    element.style.left = pipe_props.left - move_speed + "px";
                }
            }
        }

        requestAnimationFrame(move); // Continue moving pipes
    }
    requestAnimationFrame(move);

    let bird_dy = 0;  // Bird's vertical speed (dy = delta y)
    
    // Function to apply gravity to the bird
    function apply_gravity() {
        if(game_state != "Play"){
            return;  // Stop applying gravity if the game is not in "Play" state
        }
        
        bird_dy = bird_dy + gravity;  // Increase bird's downward speed by gravity
        
        // Listen for keydown events to make the bird fly up
        document.addEventListener("keydown", function(e) {
            if(e.key == "ArrowUp" || e.key == " "){
                img.src = "Images/Bird-2.png";  // Change bird image to "flap" wings
                bird_dy = -7.6;  // Make the bird fly up by setting a negative speed
            }
        });

        // Listen for keyup events to change the bird image back
        document.addEventListener("keyup", function(e) {
            if(e.key == "ArrowUp" || e.key == " "){
                img.src = "Images/Bird.png";  // Change bird image back
            }
        });

        // Check if the bird has hit the top or bottom of the screen
        if(bird_props.top <= 0 || bird_props.bottom >= background.bottom){
            game_state = "End";  // End the game if bird hits the top or bottom
            message.style.left = "28vw";
            window.location.reload();  // Reload the page to restart
            message.classList.remove("message-style");
            return;
        }

        // Move the bird down by its speed (bird_dy)
        bird.style.top = bird_props.top + bird_dy + "px";
        bird_props = bird.getBoundingClientRect();  // Update bird properties
        requestAnimationFrame(apply_gravity);  // Continue applying gravity
    }

    requestAnimationFrame(apply_gravity);

    let pipe_separation = 0;  // Separation between pipes
    let pipe_gap = 35;        // Gap between top and bottom pipes
    
    // Function to create pipes at intervals
    function create_pipe(){
        if(game_state != "Play"){
            return;  // Stop creating pipes if the game is not in "Play" state
        }

        // Create new pipes after a certain interval
        if(pipe_separation > 115){
            pipe_separation = 0;
            
            // Randomize the position of the gap between pipes
            let pipe_position = Math.floor(Math.random() * 43) + 8;
            
            // Create the top pipe
            let pipe_inv = document.createElement("div");
            pipe_inv.className = "pipe";
            pipe_inv.style.top = pipe_position - 70 + "vh";
            pipe_inv.style.left = "100vw";
            document.body.appendChild(pipe_inv);

            // Create the bottom pipe
            let pipe = document.createElement("div");
            pipe.className = "pipe";
            pipe.style.top = pipe_position + pipe_gap + "vh";
            pipe.style.left = "100vw";
            pipe.increase_score = "1";  // Mark this pipe to increase score
            document.body.appendChild(pipe);
        }

        pipe_separation++;  // Increase separation counter
        requestAnimationFrame(create_pipe);  // Continue creating pipes
    }
    requestAnimationFrame(create_pipe);
}

