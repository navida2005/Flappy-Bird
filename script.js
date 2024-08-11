// Variables
let move_speed = 3, gravity = 0.5;
let bird = document.querySelector(".bird");
let img = document.getElementById("bird-1");
let sound_point = new Audio("sounds/point.mp3");
let sound_die = new Audio("sounds/die.mp3");

//Get bird properties
let bird_props = bird.getBoundingClientRect();
console.log(bird_props.left,bird_props.right,bird_props.top,bird_props.bottom);


let background = document.querySelector(".background").getBoundingClientRect();

let score_val = document.querySelector(".score_val");
let message = document.querySelector(".message");
let score_title = document.querySelector(".score_title");

let game_state = "Start";
img.style.display = "none";
message.classList.add("message-style");

document.addEventListener("keydown", (e) =>{
    if((e.key == "Enter" || e.key == " ") && game_state != "Play"){
        document.querySelectorAll(".pipe").forEach((e) =>{
            e.remove();
        });
        img.style.display = "block";
        bird.style.top = "40vh";
        game_state = "Play";
        message.innerHTML = "";
        score_title.innerHTML = "Score: ";
        score_val.innerHTML = "0";
        message.classList.remove("message-style");
        play();
    }
});

function play(){
    function move(){
        console.log(game_state);
        if(game_state != "Play"){
            return;
        }
        let pipe = document.querySelectorAll(".pipe");
        pipe.forEach((element) => {
            let pipe_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if(pipe_props.right <= 0){
                element.remove();
            }else{
                if(bird_props.left < pipe_props.left + pipe_props.width && bird_props.left + bird_props.width > pipe_props.left && bird_props.top < pipe_props.top + pipe_props.height && bird_props.top + bird_props.height > pipe_props.top){
                    game_state = "End";
                    message.innerHTML = "Game Over".fontcolor("red") + "<br> Press Enter To Restart";
                    message.classList.add("message-style");
                    img.style.display = "none";
                    sound_die.play();
                    return;
                }else{
                    if(pipe_props.right < bird_props.left && pipe_props.right + move_speed >= bird_props.left && element.increase_score == "1"){
                        score_val.innerHTML =+ score_val.innerHTML + 1;
                        sound_point.play();
                    }
                    element.style.left = pipe_props.left - move_speed + "px"
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    let bird_dy = 0;
    function apply_gravity() {
        if(game_state != "Play"){
            return;
        }
        bird_dy  = bird_dy + gravity;
        document.addEventListener("keydown", (e) =>{
            if(e.key == "ArrowUp" || e.key == " "){
                img.src = "Images/Bird-2.png";
                bird_dy = -7.6;
            }
        });
        document.addEventListener("keyup", (e) => {
            if(e.key == "ArrowUp" || e.key == " "){
                img.src = "Images/Bird.png";
            }
        });

        if(bird_props.top <= 0 || bird_props.bottom >= background.bottom){
            game_state = "End";
            message.style.left = "28vw";
            window.location.reload();
            message.classList.remove("message-style");
            return;
        }

        bird.style.top = bird_props.top + bird_dy + "px";
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }

    requestAnimationFrame(apply_gravity);

    let pipe_seperation = 0;
    let pipe_gap = 35;
    
    function create_pipe(){
        if(game_state != "Play"){
            return;
        }
        if(pipe_seperation > 115){
            pipe_seperation = 0;
            let pipe_position = Math.floor(Math.random() * 43) + 8;
            let pipe_inv = document.createElement("div");
            pipe_inv.className = "pipe";
            pipe_inv.style.top = pipe_position - 70 + "vh";
            pipe_inv.style.left = "100vw";

            document.body.appendChild(pipe_inv);
            let pipe = document.createElement("div");
            pipe.className = "pipe";
            pipe.style.top = pipe_position + pipe_gap + "vh";
            pipe.style.left = "100vw";
            pipe.increase_score = "1";

            document.body.appendChild(pipe);
        }

        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}

