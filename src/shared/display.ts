import { BoardChoice, GameState, MoveChoice, Orientation, Point } from "./common";

export class GameDisplay {
    context: CanvasRenderingContext2D
    size: number
    constructor(context: CanvasRenderingContext2D, size: number) {
        this.context = context;
        this.size = size;
    }
    render(state: GameState) {
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, this.size, this.size);
        this.renderBorders(state);
        this.renderPlayers(state);
        this.renderBoards(state);
    }
    renderBorders(state: GameState) {
        const side = state.players.length === 4 ? 11 : 9;
        const unit = this.getUnit(state.players.length);
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 2;
        this.context.beginPath();
        for (let i = 1; i < side; i++) {
            this.context.moveTo(i * unit, 0);
            this.context.lineTo(i * unit, this.size);
            this.context.moveTo(0, i * unit);
            this.context.lineTo(this.size, i * unit);
        }
        this.context.stroke();
    }
    renderPlayers(state: GameState) {
        const unit = this.getUnit(state.players.length);
        const colors = ['red', 'blue', 'green', 'yellow'];
        state.players.forEach((player, index) => {
            this.context.fillStyle = colors[index];
            this.context.fillRect(
                player.position[0] * unit + unit / 4,
                player.position[1] * unit + unit / 4,
                unit / 2,
                unit / 2
            );
        })
    }
    renderBoards(state: GameState) {        
        const unit = this.getUnit(state.players.length);
        this.context.fillStyle = 'rgba(150, 0, 150)';
        this.context.lineWidth = 5;
        this.context.strokeStyle = 'rgba(255, 0, 255)';
        for (const board of state.boards) {
            if (board.orientation == Orientation.HORIZONTAL) {
                this.context.beginPath();
                this.context.moveTo(board.position[0] * unit, board.position[1] * unit);
                if (board.destroyed) {
                    for (let i = 0; i < board.length; i++) {
                        this.context.lineTo((i + board.position[0]) * unit + unit / 4, board.position[1] * unit);
                        this.context.moveTo((i + 1 + board.position[0]) * unit - unit / 4, board.position[1] * unit);
                    }
                }
                this.context.lineTo((board.length + board.position[0]) * unit, board.position[1] * unit);
                this.context.stroke();
            }
            else {
                this.context.beginPath();
                this.context.moveTo(board.position[0] * unit, board.position[1] * unit);
                if (board.destroyed) {
                    for (let i = 0; i < board.length; i++) {
                        this.context.lineTo(board.position[0] * unit, (i + board.position[1]) * unit + unit / 4);
                        this.context.moveTo(board.position[0] * unit, (i + board.position[1] + 1) * unit - unit / 4);
                    }
                }
                this.context.lineTo(board.position[0] * unit, (board.length + board.position[1]) * unit);
                this.context.stroke();
            }
        }
        for (const board of state.boards) {
            if (board.orientation == Orientation.HORIZONTAL) {
                this.context.beginPath();
                this.context.arc((board.length + board.position[0]) * unit, board.position[1] * unit, 5, 0, Math.PI * 2);
                this.context.fill();
            }
            else {
                this.context.beginPath();
                this.context.arc(board.position[0] * unit, (board.length + board.position[1]) * unit, 5, 0, Math.PI * 2);
                this.context.fill();
            }
            this.context.beginPath();
            this.context.arc(board.position[0] * unit, board.position[1] * unit, 5, 0, Math.PI * 2);
            this.context.fill();
        }
    }
    renderMoveChoices(state: GameState, choices: MoveChoice[]) {
        const unit = this.getUnit(state.players.length);
        this.context.fillStyle = 'rgba(0, 255, 0, .5)';
        for (const choice of choices) {
            this.context.beginPath();
            this.context.arc(
                choice.to[0] * unit + unit / 2,
                choice.to[1] * unit + unit / 2,
                unit / 4, 0, Math.PI * 2);
            this.context.fill()
        }
    }
    renderBoardChoices(state: GameState, point: Point, choices: BoardChoice[]) {
        const unit = this.getUnit(state.players.length);
        this.context.fillStyle = 'rgba(255, 0, 255, .5)';
        this.context.beginPath();
        this.context.arc(point[0] * unit, point[1] * unit, 10, 0, Math.PI * 2);
        this.context.fill();
        this.context.fillStyle = 'rgba(0, 255, 0, .5)';
        for (const choice of choices) {
            this.context.beginPath();
            this.context.arc(
            choice.hint[0] * unit,
            choice.hint[1] * unit,
            10, 0, Math.PI * 2);
            this.context.fill()
        }
    }
    getUnit(players: number): number {
        const side = players === 4 ? 11 : 9;
        return this.size / side;
    }
}