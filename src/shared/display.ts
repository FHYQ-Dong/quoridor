import { BoardChoice, DestroyChoice, Direction, GameState, MoveChoice, Orientation, Point } from "./common";

export class GameDisplay {
    readonly context: CanvasRenderingContext2D
    readonly size: number
    readonly replay: boolean
    constructor(context: CanvasRenderingContext2D, size: number, replay?: boolean) {
        this.context = context;
        this.size = size;
        this.replay = replay ?? false;
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
        this.context.textAlign = 'left';
        this.context.textBaseline = 'top';
        this.context.font = '12px sans-serif';
        this.context.fillStyle = 'rgba(100, 0, 100)';
        this.context.beginPath();
        for (let i = 1; i < side; i++) {
            this.context.moveTo(i * unit, 0);
            this.context.lineTo(i * unit, this.size);
            this.context.moveTo(0, i * unit);
            this.context.lineTo(this.size, i * unit);
            if (this.replay) {
              this.context.fillText(i.toString(), i * unit + 2, 2);
              this.context.fillText(i.toString(), 2, i * unit + 2);
            }
        }
        if (this.replay)
          this.context.fillText('0', 2, 2);
        this.context.stroke();
        if (state.players.length === 2) {
            this.context.strokeStyle = 'red'
            this.context.beginPath();
            this.context.moveTo(0, 1);
            this.context.lineTo(this.size, 1);
            this.context.stroke();
            this.context.strokeStyle = 'blue'
            this.context.beginPath();
            this.context.moveTo(0, this.size - 1);
            this.context.lineTo(this.size, this.size - 1);
            this.context.stroke();
        }
        else {
            this.context.strokeStyle = 'red'
            this.context.beginPath();
            this.context.moveTo(0, 1);
            this.context.lineTo(this.size, 1);
            this.context.stroke();
            this.context.strokeStyle = 'blue'
            this.context.beginPath();
            this.context.moveTo(this.size - 1, 0);
            this.context.lineTo(this.size - 1, this.size);
            this.context.stroke();
            this.context.strokeStyle = 'green'
            this.context.beginPath();
            this.context.moveTo(0, this.size - 1);
            this.context.lineTo(this.size, this.size - 1);
            this.context.stroke();
            this.context.strokeStyle = 'yellow'
            this.context.beginPath();
            this.context.moveTo(1, 0);
            this.context.lineTo(1, this.size);
            this.context.stroke();
        }
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
    renderDestroyChoices(state: GameState, choices: DestroyChoice[]) {
        const unit = this.getUnit(state.players.length);
        this.context.fillStyle = 'rgba(0, 255, 0, .5)';
        for (const choice of choices) {
            this.context.beginPath();
            switch (choice.direction) {
              case Direction.LEFT: {
                this.context.moveTo(
                  choice.hint[0] * unit + unit / 4,
                  choice.hint[1] * unit + unit / 2);
                this.context.lineTo(
                  choice.hint[0] * unit + unit * 3 / 4,
                  choice.hint[1] * unit + unit / 4);
                this.context.lineTo(
                  choice.hint[0] * unit + unit * 3 / 4,
                  choice.hint[1] * unit + unit * 3 / 4);
                this.context.moveTo(
                  choice.hint[0] * unit + unit / 4,
                  choice.hint[1] * unit + unit / 2);
                break;
              }
              case Direction.RIGHT: {
                this.context.moveTo(
                  choice.hint[0] * unit + unit * 3 / 4,
                  choice.hint[1] * unit + unit / 2);
                this.context.lineTo(
                  choice.hint[0] * unit + unit / 4,
                  choice.hint[1] * unit + unit / 4);
                this.context.lineTo(
                  choice.hint[0] * unit + unit / 4,
                  choice.hint[1] * unit + unit * 3 / 4);
                this.context.moveTo(
                  choice.hint[0] * unit + unit * 3 / 4,
                  choice.hint[1] * unit + unit / 2);
                break;
              }
              case Direction.TOP: {
                this.context.moveTo(
                  choice.hint[0] * unit + unit / 2,
                  choice.hint[1] * unit + unit / 4);
                this.context.lineTo(
                  choice.hint[0] * unit + unit / 4,
                  choice.hint[1] * unit + unit * 3 / 4);
                this.context.lineTo(
                  choice.hint[0] * unit + unit * 3 / 4,
                  choice.hint[1] * unit + unit * 3 / 4);
                this.context.moveTo(
                  choice.hint[0] * unit + unit / 4,
                  choice.hint[1] * unit + unit / 2);
                break;
              }
              case Direction.BOTTOM: {
                this.context.moveTo(
                  choice.hint[0] * unit + unit / 2,
                  choice.hint[1] * unit + unit * 3 / 4);
                this.context.lineTo(
                  choice.hint[0] * unit + unit * 3 / 4,
                  choice.hint[1] * unit + unit / 4);
                this.context.lineTo(
                  choice.hint[0] * unit + unit / 4,
                  choice.hint[1] * unit + unit / 4);
                this.context.moveTo(
                  choice.hint[0] * unit + unit / 2,
                  choice.hint[1] * unit + unit * 3 / 4);
                break;
              }
            }
            this.context.fill()
        }
    }
    getUnit(players: number): number {
        const side = players === 4 ? 11 : 9;
        return this.size / side;
    }
}