import { speak_hit } from './view.js';
import { PADDLE_VELOCITY, BOARD_HEIGHT, BOARD_WIDTH, PADDLE_FORCE, BALL_RADIUS, SIDE } from './model.js';


export default class Paddle {
    posx;
    posy;
    width;
    height;
    color;
    constructor(posx, posy, width, height, side, color) {
        this.posx = posx;
        this.posy = posy;
        this.width = width;
        this.height = height;
        this.color = color;
        this.side = side;
        this.vely = 0;
        this.velx = 0;
    }

    move(is_cpu, ball) {
        if (is_cpu) {

            // Vertical Movement
            this.vely = Math.min(PADDLE_VELOCITY, Math.max(-PADDLE_VELOCITY, ball.posy - this.posy - this.height / 2));

            // Horizontal Movement
            let defensiveZoneFraction;
            const ballSpeed = Math.abs(ball.velx);

            // Determine how far back the paddle should stay based on ball speed
            if (ballSpeed < 4) {
                defensiveZoneFraction = 5 / 9;
            } else if (ballSpeed < 8) {
                defensiveZoneFraction = 6 / 9;
            } else if (ballSpeed < 12) {
                defensiveZoneFraction = 7 / 9;
            } else {
                defensiveZoneFraction = 8 / 9;
            }
            const interceptX = ball.posx - this.width / 2;
            let targetX;

            if (this.side === SIDE.RIGHT) {
                const defensiveLine = BOARD_WIDTH * defensiveZoneFraction;
                targetX = Math.max(interceptX, defensiveLine); // Stay to the right of the line
            } else { // SIDE.LEFT
                const defensiveLine = BOARD_WIDTH * (37/40 - defensiveZoneFraction);
                targetX = Math.min(interceptX, defensiveLine); // Stay to the left of the line
            }
            // Calculate velocity to move towards the target position, clamping it to max speed.
            this.velx = Math.min(PADDLE_VELOCITY, Math.max(-PADDLE_VELOCITY, targetX - this.posx));
        }
        this.posy = Math.min(BOARD_HEIGHT - this.height, Math.max(0, this.posy + this.vely));
        if (this.side == SIDE.LEFT) {
            const max_x = BOARD_WIDTH / 2 - this.width;
            this.posx = Math.min(max_x, Math.max(0, this.posx + this.velx));
        } else { // SIDE.RIGHT
            const min_x = BOARD_WIDTH / 2;
            const max_x = BOARD_WIDTH - this.width;
            this.posx = Math.min(max_x, Math.max(min_x, this.posx + this.velx));
        }
    }
    bounce(model, ball) {
        let bounce_dir = Math.sign(BOARD_WIDTH / 2 - this.posx);

        const is_colliding =
            ball.posy + BALL_RADIUS > this.posy && // Ball's bottom edge is below paddle's top edge
            ball.posy - BALL_RADIUS < this.posy + this.height && // Ball's top edge is above paddle's bottom edge
            ball.posx + BALL_RADIUS > this.posx && // Ball's right edge is past paddle's left edge
            ball.posx - BALL_RADIUS < this.posx + this.width && // Ball's left edge is before paddle's right edge
            ball.velx * bounce_dir < 0; // Ball is moving towards the paddle

        if (is_colliding) {
            speak_hit(this.side == SIDE.LEFT ? model.nameL : model.nameR);

            // Reverse horizontal direction and apply force
            ball.velx = bounce_dir * PADDLE_FORCE * Math.abs(ball.velx);

            // Apply "spin" to the ball based on the paddle's vertical movement
            if (this.vely > 0) { // Moving down
                ball.vely = ball.vely * 1.2 + 2;
            } else if (this.vely < 0) { // Moving up
                ball.vely = ball.vely * 1.2 - 2;
            } else if (this.vely == 0) {
                ball.vely = ball.vely * 0.3;
                ball.velx = ball.velx * 2;
            }

            if (this.velx > 0) {
                ball.velx = ball.velx + 2;
            } else if (this.velx < 0) {
                ball.velx = ball.velx - 2;
            }
        }
        return SIDE.NONE;
    }
}
