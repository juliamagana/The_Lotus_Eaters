
 // ==========================================
 // THE LOTUS EATERS
 // Single-Level Platform Game
 // ==========================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// ==========================================
// 1. GAME SCREENS
// ==========================================

let currentScreen = "start";

const startScreen = new Image();
startScreen.src = "assets/screens/start-screen.png";

const story1Screen = new Image();
story1Screen.src = "assets/screens/intro-part1.png";

const story2Screen = new Image();
story2Screen.src = "assets/screens/intro-part2.png";

// Your custom instructions image
const instructionsScreen = new Image();
instructionsScreen.src = "assets/screens/instructions.png";

const endingScreen = new Image();
endingScreen.src = "assets/screens/end-screen.png";

// ==========================================
// 2. GAME ASSETS
// ==========================================

// Beach background
const beach = new Image();
beach.src = "assets/background/level-background.png";

// Odysseus sprite sheet
const odysseusImage = new Image();
odysseusImage.src = "assets/characters/Odysseus.png";

// Lost crew member
const crewImage = new Image();
crewImage.src = "assets/crew/Crew.png";

// Animated lotus sprite sheet
const lotusImage = new Image();
lotusImage.src = "assets/objects/Lotus Animation.png";

// ==========================================
// 3. PLAYER
// ==========================================

const player = {
    x: 40,
    y: 272,
    width: 48,
    height: 48,

    speed: 3,
    velocityY: 0,
    jumpPower: -10,
    gravity: 0.5,

    onGround: false,
    moving: false
};

// ==========================================
// 4. PLATFORMS
// ==========================================

const platforms = [
    { x: 0, y: 320, width: 640, height: 40 },
    { x: 130, y: 260, width: 110, height: 20 },
    { x: 290, y: 215, width: 110, height: 20 },
    { x: 460, y: 265, width: 110, height: 20 }
];

// ==========================================
// 5. LOTUS HAZARDS
// ==========================================

const lotuses = [
    { x: 250, y: 270, width: 50, height: 50 },
    { x: 410, y: 270, width: 50, height: 50 }
];

// Lotus animation settings
let lotusFrame = 0;
let lotusFrameTimer = 0;
const lotusFrameDelay = 10;

// ==========================================
// 6. CREW MEMBER
// ==========================================

const crewMember = {
    x: 570,
    y: 272,
    width: 48,
    height: 48
};

// ==========================================
// 7. KEYBOARD CONTROLS
// ==========================================

const keys = {};

document.addEventListener("keydown", function(event) {

    const key = event.key.toLowerCase();

    keys[key] = true;

    if (
        event.code === "Space" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight"
    ) {
        event.preventDefault();
    }

});

document.addEventListener("keyup", function(event) {

    keys[event.key.toLowerCase()] = false;

});

// ==========================================
// 8. INTRODUCTION SCREEN CONTROLS
// ==========================================

canvas.addEventListener("click", function() {

    if (currentScreen === "start") {
        currentScreen = "story1";
    }

    else if (currentScreen === "story1") {
        currentScreen = "story2";
    }

    else if (currentScreen === "story2") {
        currentScreen = "instructions";
    }

    else if (currentScreen === "instructions") {
        resetPlayer();
        currentScreen = "game";
    }

    else if (currentScreen === "ending") {
        currentScreen = "start";
        resetPlayer();
    }

});

// ==========================================
// 9. RESET PLAYER
// ==========================================

function resetPlayer() {

    player.x = 40;
    player.y = 272;

    player.velocityY = 0;
    player.onGround = false;
    player.moving = false;

}

// ==========================================
// 10. COLLISION DETECTION
// ==========================================

function isColliding(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );

}

// ==========================================
// 11. PLAYER MOVEMENT
// ==========================================

function updatePlayer() {

    player.moving = false;

    // Move left
    if (keys["a"] || keys["arrowleft"]) {
        player.x -= player.speed;
        player.moving = true;
    }

    // Move right
    if (keys["d"] || keys["arrowright"]) {
        player.x += player.speed;
        player.moving = true;
    }

    // Keep player inside the screen
    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > WIDTH) {
        player.x = WIDTH - player.width;
    }

    // Jump
    if (
        (keys[" "] || keys["space"]) &&
        player.onGround
    ) {
        player.velocityY = player.jumpPower;
        player.onGround = false;
    }

    // Apply gravity
    player.velocityY += player.gravity;

    const previousY = player.y;

    player.y += player.velocityY;

    player.onGround = false;

    // Check platform collisions
    for (let platform of platforms) {

        const horizontalOverlap =
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width;

        const crossedPlatform =
            previousY + player.height <= platform.y &&
            player.y + player.height >= platform.y;

        if (
            horizontalOverlap &&
            crossedPlatform &&
            player.velocityY >= 0
        ) {

            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.onGround = true;

        }

    }

    // Prevent falling below the screen
    if (player.y + player.height > HEIGHT) {

        player.y = HEIGHT - player.height;
        player.velocityY = 0;
        player.onGround = true;

    }

}

// ==========================================
// 12. LOTUS ANIMATION
// ==========================================

function updateLotusAnimation() {

    lotusFrameTimer++;

    if (lotusFrameTimer >= lotusFrameDelay) {

        lotusFrame++;

        if (lotusFrame >= 6) {
            lotusFrame = 0;
        }

        lotusFrameTimer = 0;

    }

}

// ==========================================
// 13. CHECK LOTUS COLLISIONS
// ==========================================

function checkLotusCollision() {

    for (let lotus of lotuses) {

        if (isColliding(player, lotus)) {

            resetPlayer();
            currentScreen = "start";

            return;

        }

    }

}

// ==========================================
// 14. CHECK CREW MEMBER COLLISION
// ==========================================

function checkCrewCollision() {

    if (isColliding(player, crewMember)) {

        currentScreen = "ending";

    }

}

// ==========================================
// 15. DRAW PLAYER
// ==========================================

function drawPlayer() {

    if (
        odysseusImage.complete &&
        odysseusImage.naturalWidth > 0
    ) {

        // Top frame = idle
        // Bottom frame = walking

        const sourceY = player.moving ? 48 : 0;

        ctx.drawImage(
            odysseusImage,
            0, sourceY,
            48, 48,
            player.x, player.y,
            player.width, player.height
        );

    } else {

        // Temporary fallback if sprite fails to load
        ctx.fillStyle = "blue";

        ctx.fillRect(
            player.x,
            player.y,
            player.width,
            player.height
        );

    }

}

// ==========================================
// 16. DRAW LOTUS FLOWERS
// ==========================================

function drawLotuses() {

    for (let lotus of lotuses) {

        if (
            lotusImage.complete &&
            lotusImage.naturalWidth > 0
        ) {

            // Sprite sheet has 2 columns and 3 rows
            const sourceX = (lotusFrame % 2) * 50;

            const sourceY =
                Math.floor(lotusFrame / 2) * 50;

            ctx.drawImage(
                lotusImage,
                sourceX, sourceY,
                50, 50,
                lotus.x, lotus.y,
                lotus.width, lotus.height
            );

        } else {

            ctx.fillStyle = "purple";

            ctx.fillRect(
                lotus.x,
                lotus.y,
                lotus.width,
                lotus.height
            );

        }

    }

}

// ==========================================
// 17. DRAW GAME WORLD
// ==========================================

function drawGame() {

    // Draw beach
    if (
        beach.complete &&
        beach.naturalWidth > 0
    ) {

        ctx.drawImage(beach, 0, 0, WIDTH, HEIGHT);

    } else {

        ctx.fillStyle = "#87CEEB";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

    }

    // Temporary platform rectangles
    for (let platform of platforms) {

        ctx.fillStyle = "#302820";

        ctx.fillRect(
            platform.x,
            platform.y,
            platform.width,
            platform.height
        );

    }

    // Draw animated lotus flowers
    drawLotuses();

    // Draw crew member
    if (
        crewImage.complete &&
        crewImage.naturalWidth > 0
    ) {

        ctx.drawImage(
            crewImage,
            crewMember.x,
            crewMember.y,
            crewMember.width,
            crewMember.height
        );

    }

    // Draw Odysseus
    drawPlayer();

}

// ==========================================
// 18. MAIN GAME LOOP
// ==========================================

function gameLoop() {

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // TITLE SCREEN
    if (currentScreen === "start") {

        if (
            startScreen.complete &&
            startScreen.naturalWidth > 0
        ) {

            ctx.drawImage(startScreen, 0, 0, WIDTH, HEIGHT);

        }

    }

    // STORY PAGE 1
    else if (currentScreen === "story1") {

        if (
            story1Screen.complete &&
            story1Screen.naturalWidth > 0
        ) {

            ctx.drawImage(story1Screen, 0, 0, WIDTH, HEIGHT);

        }

    }

    // STORY PAGE 2
    else if (currentScreen === "story2") {

        if (
            story2Screen.complete &&
            story2Screen.naturalWidth > 0
        ) {

            ctx.drawImage(story2Screen, 0, 0, WIDTH, HEIGHT);

        }

    }

    // YOUR CUSTOM INSTRUCTIONS PAGE
    else if (currentScreen === "instructions") {

        if (
            instructionsScreen.complete &&
            instructionsScreen.naturalWidth > 0
        ) {

            ctx.drawImage(
                instructionsScreen,
                0, 0,
                WIDTH, HEIGHT
            );

        }

    }

    // GAMEPLAY
    else if (currentScreen === "game") {

        updatePlayer();

        updateLotusAnimation();

        checkLotusCollision();

        if (currentScreen === "game") {
            checkCrewCollision();
        }

        if (currentScreen === "game") {
            drawGame();
        }

    }

    // ENDING
    else if (currentScreen === "ending") {

        if (
            endingScreen.complete &&
            endingScreen.naturalWidth > 0
        ) {

            ctx.drawImage(endingScreen, 0, 0, WIDTH, HEIGHT);

        } else {

            ctx.fillStyle = "#FFF7BC";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.font = "28px monospace";

            ctx.fillText(
                "YOU FOUND YOUR CREWMATE!",
                WIDTH / 2,
                160
            );

            ctx.fillText(
                "CLICK TO PLAY AGAIN",
                WIDTH / 2,
                220
            );

        }

    }

    requestAnimationFrame(gameLoop);

}

// ==========================================
// 19. START GAME
// ==========================================

gameLoop();
