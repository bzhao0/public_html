import * as Controls from "./controls.js";
import { BOARD_WIDTH, BOARD_HEIGHT, BALL_RADIUS } from "./model.js";

// Create Image objects for all our game assets
const courtImage = new Image();
const ballImage = new Image();
const paddleImage = new Image();

// Helper function to load an image and return a promise
function loadImage(image, src) {
    return new Promise((resolve, reject) => {
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
    });
}

// This function will be called to load all assets before the game starts.
export function loadAssets() {
    // Make sure you have these image files in your 'ponggame' folder.
    // For example: court.jpg, ball.png, paddle.png
    return Promise.all([loadImage(courtImage, "court.jpg"), loadImage(ballImage, "ball.png"), loadImage(paddleImage, "hand.png"),]);
}

export function bind_events(model) {
    document.getElementById("reset").onclick = () => Controls.resetGame(model);
    document.getElementById("nameL").oninput = (ev) => Controls.set_left_name(model, ev);
    document.getElementById("nameR").oninput = (ev) => Controls.set_right_name(model, ev);
    document.getElementById("cpucheck").onchange = (ev) => Controls.set_cpu(model, ev);
    window.addEventListener("keyup", key => Controls.keyUp(model, key));
    window.addEventListener("keydown", key => Controls.keyDown(model, key));
}

export function updateScore(model) {
    document.getElementById("scoreboard").innerHTML = `${model.scoreL} : ${model.scoreR}`;
}

export function draw_game(model) {
    const canvas = document.getElementById("gameboard");
    const ctx = canvas.getContext("2d");
    // Draw the background image first, covering the whole canvas
    ctx.drawImage(courtImage, 0, 0, BOARD_WIDTH, BOARD_HEIGHT); draw_ball(ctx, model.ball);
    draw_paddle(ctx, model.paddleL);
    draw_paddle(ctx, model.paddleR);
}

function draw_ball(ctx, ball) {
    // Draw the ball image centered on its x/y coordinates
    ctx.drawImage(ballImage, ball.posx - BALL_RADIUS, ball.posy - BALL_RADIUS, BALL_RADIUS * 2, BALL_RADIUS * 2);
}

function draw_paddle(ctx, paddle) {
    // Draw the paddle image
    ctx.drawImage(paddleImage, paddle.posx, paddle.posy, paddle.width, paddle.height);
}

export function speak_reset() {
    const resetPhrases = [
        "Game reset, let's play again",
        "New game starting",
        "Scores reset, fresh start",
        "Game restarted",
        "Ready for a new match"
    ];
    speak_one_of(resetPhrases);
}


export function speak_hit(name) {
    const hitPhrases = [
        `${name} returns the ball`,
        `Nice save by ${name}`,
        `${name} strikes back`,
        `Good hit from ${name}`,
        `${name} keeps it alive`,
        `${name} with the return`,
        `Excellent defense by ${name}`,
        `${name} sends it back`
    ];
    speak_one_of(hitPhrases)
}

export function speak_miss(name, opponent_name) {
    const missPhrases = [
        `${name} missed the ball`,
        `${name} couldn't reach it`,
        `Point to ${opponent_name}`,
        `${name} let it slip by`,
        `${opponent_name} scores`,
        `${name} missed that one`,
        `Too fast for ${name}`,
        `${opponent_name} takes the point`
    ];
    speak_one_of(missPhrases)
}

export function speak_win(name) {
    const winPhrases = [
        `${name} wins the game`,
        `Victory goes to ${name}`,
        `${name} is the champion`,
        `Game over, ${name} wins`,
        `${name} takes the victory`,
        `Congratulations ${name}`,
        `${name} dominates the match`
    ];
    speak_one_of(winPhrases)
}

function speak_one_of(lines) {
    const line = lines[Math.floor(Math.random() * lines.length)];
    speak(line);
}

function speak(text) {

    // Don't speak if speechSynthesis doesn't exist
    if (!window.speechSynthesis) return;

    const voices = window.speechSynthesis.getVoices();
    // Find first English voice, fallback to any available voice
    let gameVoice = voices.find(voice => voice.lang.startsWith('en')) || voices[0];

    // Cancel any currently playing speech to avoid overlap
    window.speechSynthesis.cancel();

    // Create and configure the speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = gameVoice;      // Use selected voice
    utterance.rate = 1.2;             // Speak 20% faster for responsiveness
    utterance.pitch = 1.0;            // Normal pitch
    utterance.volume = 0.8;           // 80% volume

    // Speak the announcement
    window.speechSynthesis.speak(utterance);
}

export function play_beep() {
    let audioContext = new window.AudioContext();

    // Create oscillator (tone generator) and gain node (volume control)
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Connect audio nodes: oscillator -> gain -> speakers
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Configure the oscillator
    oscillator.frequency.value = 300;
    oscillator.type = 'sine';  // Sine wave produces a pure, clean tone

    gainNode.gain.value = .5

    // Start and schedule stop of the oscillator
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + .1);
}