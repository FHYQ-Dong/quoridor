import { GameState, Point, Direction, Orientation, BoardState, pointEquals, BoardChoice, MoveChoice, beside, GameAction, leftSide, rightSide, DestroyChoice } from "./common";

export interface GameConfig {
    players: number,
    boards: number,
    cheats: number
}

export interface GameReplay {
    config: GameConfig,
    actions: GameAction[],
    name: string,
    time: Date
}

export class Game {
    state: GameState
    readonly side: number
    readonly config: GameConfig
    constructor(config: GameConfig) {
        this.config = config;
        this.state = {
            players: [],
            boards: []
        }
        if (this.config.players === 2) {
            this.side = 9;
            this.state.players.push({
                position: [4, 0],
                boards: this.config.boards,
                cheats: this.config.cheats,
                cheated: false
            });
            this.state.players.push({
                position: [4, 8],
                boards: this.config.boards,
                cheats: this.config.cheats,
                cheated: false
            });
        }
        else if (this.config.players === 4) {
            this.side = 11;
            this.state.players.push({
                position: [5, 0],
                boards: this.config.boards,
                cheats: this.config.cheats,
                cheated: false
            });
            this.state.players.push({
                position: [10, 5],
                boards: this.config.boards,
                cheats: this.config.cheats,
                cheated: false
            });
            this.state.players.push({
                position: [5, 10],
                boards: this.config.boards,
                cheats: this.config.cheats,
                cheated: false
            });
            this.state.players.push({
                position: [0, 5],
                boards: this.config.boards,
                cheats: this.config.cheats,
                cheated: false
            });
        }
        else throw new Error('invalid players count');
    }
    validBoardAt(point: Point, direction: Direction): BoardState | undefined {
        if (direction === Direction.LEFT) {
            return this.state.boards.find(board => 
                !board.destroyed &&
                board.orientation === Orientation.VERTICAL && 
                board.position[0] === point[0] && 
                board.position[1] > point[1]-board.length &&
                board.position[1] <= point[1]
            )
        }
        if (direction === Direction.RIGHT) {
            return this.state.boards.find(board => 
                !board.destroyed &&
                board.orientation === Orientation.VERTICAL && 
                board.position[0] === point[0]+1 && 
                board.position[1] > point[1]-board.length &&
                board.position[1] <= point[1]
            )
        }
        if (direction === Direction.TOP) {
            return this.state.boards.find(board => 
                !board.destroyed &&
                board.orientation === Orientation.HORIZONTAL && 
                board.position[1] === point[1] && 
                board.position[0] > point[0]-board.length &&
                board.position[0] <= point[0]
            )
        }
        if (direction === Direction.BOTTOM) {
            return this.state.boards.find(board => 
                !board.destroyed &&
                board.orientation === Orientation.HORIZONTAL && 
                board.position[1] === point[1]+1 && 
                board.position[0] > point[0]-board.length &&
                board.position[0] <= point[0]
            )
        }
    }
    validBoardPlace(position: Point, orientation: Orientation, length: number): boolean {
        if ((position[1] === 0 || position[1] === this.side || position[0] > this.side - length) &&
            (orientation === Orientation.HORIZONTAL)) return false;
        if ((position[0] === 0 || position[0] === this.side || position[1] > this.side - length) &&
            (orientation === Orientation.VERTICAL)) return false;
        if (orientation === Orientation.HORIZONTAL) {
            return this.state.boards.every(board => {
                return board.orientation === Orientation.HORIZONTAL ?
                    (board.position[1] !== position[1] || (board.position[0] - position[0] <= -board.length || board.position[0] - position[0] >= length)) :
                    (board.position[0] <= position[0] || board.position[0] >= position[0] + length || board.position[1] >= position[1] || board.position[1] <= position[1] - board.length)
            })
        }
        if (orientation === Orientation.VERTICAL) {
            return this.state.boards.every(board => {
                return board.orientation === Orientation.VERTICAL ?
                    (board.position[0] !== position[0] || (board.position[1] - position[1] <= -board.length || board.position[1] - position[1] >= length)) :
                    (board.position[1] <= position[1] || board.position[1] >= position[1] + length || board.position[0] >= position[0] || board.position[0] <= position[0] - board.length)
            })
        }
        return true; // why?
    }
    validGame() {
        let painted: Point[];
        function in_(pos: Point) {
            return painted.some(x => pointEquals(x, pos));
        }
        const paint = (pos: Point) => {
            if (pos[0] > 0 && !this.validBoardAt(pos, Direction.LEFT) && !in_(beside(pos, Direction.LEFT))) {
                painted.push(beside(pos, Direction.LEFT));
                paint(beside(pos, Direction.LEFT));
            }
            if (pos[0] < this.side - 1 && !this.validBoardAt(pos, Direction.RIGHT) && !in_(beside(pos, Direction.RIGHT))) {
                painted.push(beside(pos, Direction.RIGHT));
                paint(beside(pos, Direction.RIGHT));
            }
            if (pos[1] > 0 && !this.validBoardAt(pos, Direction.TOP) && !in_(beside(pos, Direction.TOP))) {
                painted.push(beside(pos, Direction.TOP));
                paint(beside(pos, Direction.TOP));
            }
            if (pos[1] < this.side - 1 && !this.validBoardAt(pos, Direction.BOTTOM) && !in_(beside(pos, Direction.BOTTOM))) {
                painted.push(beside(pos, Direction.BOTTOM));
                paint(beside(pos, Direction.BOTTOM));
            }
        }
        if (this.state.players.length === 2) {
            painted = [];
            paint(this.state.players[0].position)
            if (!painted.some(x => x[1] == this.side - 1)) return false;
            painted = [];
            paint(this.state.players[1].position)
            if (!painted.some(x => x[1] == 0)) return false;
        }
        else if (this.state.players.length === 4) {
            painted = [];
            paint(this.state.players[0].position)
            if (!painted.some(x => x[1] == this.side - 1)) return false;
            painted = [];
            paint(this.state.players[1].position)
            if (!painted.some(x => x[0] == 0)) return false;
            painted = [];
            paint(this.state.players[2].position)
            if (!painted.some(x => x[1] == 0)) return false;
            painted = [];
            paint(this.state.players[3].position)
            if (!painted.some(x => x[0] == this.side - 1)) return false;
        }
        return true;
    }
    boardChoices(position: Point, length: number) {
        const candidates: BoardChoice[] = [];
        if (position[0] >= length && this.validBoardPlace([position[0] - length, position[1]], Orientation.HORIZONTAL, length)) {
            candidates.push({
                hint: beside(position, Direction.LEFT, length),
                position: beside(position, Direction.LEFT, length),
                orientation: Orientation.HORIZONTAL
            });
        }
        if (position[0] <= this.side - length && this.validBoardPlace(position, Orientation.HORIZONTAL, length)) {
            candidates.push({
                hint: beside(position, Direction.RIGHT, length),
                position,
                orientation: Orientation.HORIZONTAL
            });
        }
        if (position[1] <= this.side - length && this.validBoardPlace(position, Orientation.VERTICAL, length)) {
            candidates.push({
                hint: beside(position, Direction.BOTTOM, length),
                position,
                orientation: Orientation.VERTICAL
            });
        }
        if (position[1] >= length && this.validBoardPlace([position[0], position[1] - length], Orientation.VERTICAL, length)) {
            candidates.push({
                hint: beside(position, Direction.TOP, length),
                position: beside(position, Direction.TOP, length),
                orientation: Orientation.VERTICAL
            });
        }
        const result = [];
        for (const can of candidates) {
            this.state.boards.push({
                position: can.position,
                orientation: can.orientation,
                length: length,
                destroyed: false
            });
            if (this.validGame()) {
                result.push(can);
            }
            this.state.boards.splice(this.state.boards.length - 1, 1);
        }
        return result;
    }
    hasPlayerAt(point: Point): boolean {
        return this.state.players.some(x => pointEquals(point, x.position));
    }
    moveChoices(point: Point): MoveChoice[] {
        const candidates: MoveChoice[] = [];
        if (point[0] > 0 && !this.validBoardAt(point, Direction.LEFT) && !this.hasPlayerAt(beside(point, Direction.LEFT))) {
            candidates.push({
                to: beside(point, Direction.LEFT),
                jump: false
            });
        }
        if (point[0] < this.side - 1 && !this.validBoardAt(point, Direction.RIGHT) && !this.hasPlayerAt(beside(point, Direction.RIGHT))) {
            candidates.push({
                to: beside(point, Direction.RIGHT),
                jump: false
            });
        }
        if (point[1] > 0 && !this.validBoardAt(point, Direction.TOP) && !this.hasPlayerAt(beside(point, Direction.TOP))) {
            candidates.push({
                to: beside(point, Direction.TOP),
                jump: false
            });
        }
        if (point[1] < this.side - 1 && !this.validBoardAt(point, Direction.BOTTOM) && !this.hasPlayerAt(beside(point, Direction.BOTTOM))) {
            candidates.push({
                to: beside(point, Direction.BOTTOM),
                jump: false
            });
        }
        candidates.push(...this.jumpChoices(point));
        return candidates;
    }
    sideDistance(point: Point, direction: Direction): number {
        switch (direction) {
            case Direction.LEFT: return point[0];
            case Direction.TOP: return point[1];
            case Direction.RIGHT: return this.side-point[0]-1;
            case Direction.BOTTOM: return this.side-point[1]-1;
        }
    }
    jumpChoices(point: Point, previous?: Direction, depth?: number): MoveChoice[] {
        depth = depth ?? 0;
        if (depth >= 4) {
            return [];
        }
        depth++;
        const jumpTo = (direction: Direction) => {
            if (this.hasPlayerAt(beside(point, direction, 2))) {
                candidates.push(...this.jumpChoices(
                    beside(point, direction),
                    direction,
                    depth
                ));
            }
            else if (this.validBoardAt(beside(point, direction), direction) || this.sideDistance(point, direction) === 1) {
                if (!this.validBoardAt(beside(point, direction), leftSide(direction)) && this.sideDistance(point, leftSide(direction)) !== 0) {
                    if (this.hasPlayerAt(beside(beside(point, direction), leftSide(direction)))) {
                        candidates.push(...this.jumpChoices(
                            beside(point, direction),
                            leftSide(direction),
                            depth
                        ))
                    }
                    else
                        candidates.push({
                            to: beside(beside(point, direction), leftSide(direction)),
                            jump: true
                        })
                }
                if (!this.validBoardAt(beside(point, direction), rightSide(direction)) && this.sideDistance(point, rightSide(direction)) !== 0) {
                    if (this.hasPlayerAt(beside(beside(point, direction), rightSide(direction)))) {
                        candidates.push(...this.jumpChoices(
                            beside(point, direction),
                            rightSide(direction),
                            depth
                        ))
                    }
                    else
                        candidates.push({
                            to: beside(beside(point, direction), rightSide(direction)),
                            jump: true
                        })
                }
            }
            else {
                candidates.push({
                    to: beside(point, direction, 2),
                    jump: true
                })
            }
        }
        const canJump = (direction: Direction) => 
            this.hasPlayerAt(beside(point, direction)) && !this.validBoardAt(point, direction);
        const candidates: MoveChoice[] = [];
        if (previous !== undefined) {
            if (canJump(previous)) {
                jumpTo(previous);
            }
            else {
                if (canJump(leftSide(previous))) {
                    jumpTo(leftSide(previous));
                }
                if (canJump(rightSide(previous))) {
                    jumpTo(rightSide(previous));
                }
            }
        }
        else {
            if (canJump(Direction.LEFT)) jumpTo(Direction.LEFT);
            if (canJump(Direction.TOP)) jumpTo(Direction.TOP);
            if (canJump(Direction.RIGHT)) jumpTo(Direction.RIGHT);
            if (canJump(Direction.BOTTOM)) jumpTo(Direction.BOTTOM);
        }
        return candidates
    }
    destroyChoices(point: Point): DestroyChoice[] {
        const candidates: DestroyChoice[] = [];
        if (this.validBoardAt(point, Direction.LEFT)) {
            candidates.push({
                hint: beside(point, Direction.LEFT),
                direction: Direction.LEFT
            });
        }
        if (this.validBoardAt(point, Direction.TOP)) {
            candidates.push({
                hint: beside(point, Direction.TOP),
                direction: Direction.TOP
            });
        }
        if (this.validBoardAt(point, Direction.RIGHT)) {
            candidates.push({
                hint: beside(point, Direction.RIGHT),
                direction: Direction.RIGHT
            });
        }
        if (this.validBoardAt(point, Direction.BOTTOM)) {
            candidates.push({
                hint: beside(point, Direction.BOTTOM),
                direction: Direction.BOTTOM
            });
        }
        return candidates;
    }
    isWinner(index: number): boolean {
        if (this.config.players === 2) {
            if (index === 0) {
                return this.state.players[0].position[1] >= this.side - 1;
            }
            else if (index === 1) {
                return this.state.players[1].position[1] <= 0;
            }
        }
        else if (this.config.players === 4) {
            if (index === 0) {
                return this.state.players[0].position[1] >= this.side - 1;
            }
            else if (index === 1) {
                return this.state.players[1].position[0] <= 0;
            }
            else if (index === 2) {
                return this.state.players[2].position[1] <= 0;
            }
            else if (index === 3) {
                return this.state.players[3].position[0] >= this.side - 1;
            }
        }
        return false;
    }
}