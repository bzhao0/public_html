import Ball from "./ball.js";
import Paddle from "./paddle.js";

export const SIDE = { NONE: 0, LEFT: 1, RIGHT: 2 };
export const STATE = { STARTUP: 0, PLAYING: 1, GAMEOVER: 2 };

export const BOARD_WIDTH = 1000;
export const BOARD_HEIGHT = 800;
export const PADDLE_WIDTH = 75;
export const PADDLE_HEIGHT = 100;
export const BALL_RADIUS = 25;
export const PADDLE_VELOCITY = 7.5;
export const PADDLE_FORCE = 0.8; // 110% of speed before

export class Model {
    ball;
    paddleL;
    paddleR;
    scoreL = 0;
    scoreR = 0;
    is_cpu = false;
    state = STATE.STARTUP;
    intervalID = -1;
    nameL = "Player 1";
    nameR = "Player 2";
    lastScorer;

    constructor() {
        this.resetGame();
    }

    resetGame() {
        this.state = STATE.STARTUP;
        clearTimeout(this.intervalID);
        this.lastScorer = SIDE.RIGHT;
        this.resetBall();
        this.paddleL = new Paddle(0, 0, PADDLE_WIDTH, PADDLE_HEIGHT, SIDE.LEFT, "red");
        this.paddleR = new Paddle(BOARD_WIDTH - PADDLE_WIDTH, 0, PADDLE_WIDTH, PADDLE_HEIGHT, SIDE.RIGHT, "green");
    }

    resetBall() {
        let velx;
        let vely = Math.random() * 6 - 3;

        if (this.lastScorer == SIDE.LEFT) {
        velx = 0.5;
        this.ball = new Ball(BOARD_WIDTH / 2, BOARD_HEIGHT / 2, velx, vely);
        }
        else {
        velx = -0.5;
        this.ball = new Ball(BOARD_WIDTH / 2, BOARD_HEIGHT / 2, velx, vely);
        }
    }

}

