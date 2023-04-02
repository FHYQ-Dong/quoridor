import {
    GameState, Point, Direction, Orientation,
    BoardState, pointEquals, BoardChoice, MoveChoice,
    beside, GameAction, leftSide, rightSide,
    DestroyChoice, MoveAction, BoardAction, ActionType,
    CheatAction,
    JumpAction,
    CheatType
} from "./common";

export interface GameConfig {
    players: number,
    boards: number,
    cheats: number
}

export enum TimerElapsed {
    LOSE, BOARD, CHEAT
}

export interface GameReplay<TAction = GameAction> {
    config: GameConfig & {
        elapsed: TimerElapsed
    },
    actions: TAction[],
    name: string,
    time: number
}

export type EncodedGameAction = (number | Point)[];

export function encodeAction(action: GameAction): EncodedGameAction {
    switch (action.type) {
        case ActionType.MOVE: {
            const cast = action as MoveAction;
            return [action.type, cast.to];
        }
        case ActionType.JUMP: {
            const cast = action as JumpAction;
            return [action.type, cast.to];
        }
        case ActionType.BOARD: {
            const cast = action as BoardAction;
            return [action.type, cast.position, cast.orientation, cast.length];
        }
        case ActionType.SURRENDER:
        case ActionType.TIMEOUT: {
            return [action.type];
        }
        case ActionType.CHEAT: {
            const cast = action as CheatAction;
            switch (cast.cheat) {
                case CheatType.DESTROYER: {
                    return [action.type, cast.cheat, cast.parameters!.position, cast.parameters!.orientation];
                }
                default: {
                    return [action.type, cast.cheat];
                }
            }
        }
    }
}

export function decodeAction(action: EncodedGameAction): GameAction {
    switch (action[0]) {
        case ActionType.MOVE: {
            return {
                type: action[0],
                to: action[1]
            } as MoveAction;
        }
        case ActionType.JUMP: {
            return {
                type: action[0],
                to: action[1]
            } as JumpAction;
        }
        case ActionType.BOARD: {
            return {
                type: action[0],
                position: action[1],
                orientation: action[2],
                length: action[3]
            } as BoardAction;
        }
        case ActionType.SURRENDER:
        case ActionType.TIMEOUT: {
            return {
                type: action[0]
            }
        }
        case ActionType.CHEAT: {
            switch (action[1]) {
                case CheatType.DESTROYER: {
                    return {
                        type: action[0],
                        cheat: action[1],
                        parameters: {
                            position: action[2],
                            orientation: action[3]
                        }
                    } as CheatAction;
                }
                default: {
                    return {
                        type: action[0],
                        cheat: action[1]
                    } as CheatAction;
                }
            }
        }
    }
    throw new Error('invalid encoded action.');
}

export function encodeReplay(replay: GameReplay): GameReplay<EncodedGameAction> {
    return {
        ...replay,
        actions: replay.actions.map(encodeAction)
    };
}

export function decodeReplay(replay: GameReplay<EncodedGameAction>): GameReplay {
    return {
        ...replay,
        actions: replay.actions.map(decodeAction)
    };
}

export class Game {
    readonly state: GameState
    readonly config: GameConfig
    constructor(config: GameConfig) {
        this.config = config;
        this.state = {
            players: [],
            boards: []
        }
        if (this.config.players === 2) {
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
    get side(): number {
        return this.config.players === 4 ? 11 : 9;
    }
    validBoardAt(point: Point, direction: Direction): BoardState | undefined {
        if (direction === Direction.LEFT) {
            return this.state.boards.find(board =>
                !board.destroyed &&
                board.orientation === Orientation.VERTICAL &&
                board.position[0] === point[0] &&
                board.position[1] > point[1] - board.length &&
                board.position[1] <= point[1]
            )
        }
        if (direction === Direction.RIGHT) {
            return this.state.boards.find(board =>
                !board.destroyed &&
                board.orientation === Orientation.VERTICAL &&
                board.position[0] === point[0] + 1 &&
                board.position[1] > point[1] - board.length &&
                board.position[1] <= point[1]
            )
        }
        if (direction === Direction.TOP) {
            return this.state.boards.find(board =>
                !board.destroyed &&
                board.orientation === Orientation.HORIZONTAL &&
                board.position[1] === point[1] &&
                board.position[0] > point[0] - board.length &&
                board.position[0] <= point[0]
            )
        }
        if (direction === Direction.BOTTOM) {
            return this.state.boards.find(board =>
                !board.destroyed &&
                board.orientation === Orientation.HORIZONTAL &&
                board.position[1] === point[1] + 1 &&
                board.position[0] > point[0] - board.length &&
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
    validGame(ignorePlayers?: number[]) {
        ignorePlayers = ignorePlayers ?? [];
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
            if (!ignorePlayers.includes(0)) {
                painted = [];
                paint(this.state.players[0].position);
                if (!painted.some(x => x[1] == this.side - 1)) return false;
            }
            if (!ignorePlayers.includes(1)) {
                painted = [];
                paint(this.state.players[1].position)
                if (!painted.some(x => x[1] == 0)) return false;
            }
        }
        else if (this.state.players.length === 4) {
            if (!ignorePlayers.includes(0)) {
                painted = [];
                paint(this.state.players[0].position)
                if (!painted.some(x => x[1] == this.side - 1)) return false;
            }
            if (!ignorePlayers.includes(1)) {
                painted = [];
                paint(this.state.players[1].position)
                if (!painted.some(x => x[0] == 0)) return false;
            }
            if (!ignorePlayers.includes(2)) {
                painted = [];
                paint(this.state.players[2].position)
                if (!painted.some(x => x[1] == 0)) return false;
            }
            if (!ignorePlayers.includes(3)) {
                painted = [];
                paint(this.state.players[3].position)
                if (!painted.some(x => x[0] == this.side - 1)) return false;
            }
        }
        return true;
    }
    boardChoices(position: Point, length: number, ignorePlayers?: number[]) {
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
            if (this.validGame(ignorePlayers)) {
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
            case Direction.RIGHT: return this.side - point[0] - 1;
            case Direction.BOTTOM: return this.side - point[1] - 1;
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
    move(index: number, position: Point) {
        this.state.players[index].position = position;
    }
    position(index: number): Point {
        return this.state.players[index].position;
    }
    placeBoard(index: number, board: Omit<BoardState, 'destroyed'>) {
        this.state.boards.push({
            ...board,
            destroyed: false
        });
        if (this.config.boards >= 0)
            this.state.players[index].boards -= 1;
    }
    hasBoard(index: number): boolean {
        return this.state.players[index].boards !== 0;
    }
    canCheat(index: number): boolean {
        return this.state.players[index].cheats > 0;
    }
    cheat(index: number) {
        this.state.players[index].cheated = true;
        this.state.players[index].cheats -= 1;
    }
    cheated(index: number): boolean {
        return this.state.players[index].cheated;
    }
    additionalBoard(index: number) {
        this.state.players[index].boards += 1;
    }
}

export class ReplayManager {
    readonly replay: GameReplay
    readonly winners: number[]
    readonly losers: number[]
    turn: number
    current: number
    readonly state: GameState
    private _extendedTurnLeft: number = 0;
    constructor(replay: GameReplay) {
        this.replay = replay;
        this.winners = [];
        this.losers = [];
        this.current = -1;
        this.turn = this.replay.config.players - 1;
        this.state = {
            players: [],
            boards: []
        }
        if (this.replay.config.players === 2) {
            this.state.players.push({
                position: [4, 0],
                boards: this.replay.config.boards,
                cheats: this.replay.config.cheats,
                cheated: false
            });
            this.state.players.push({
                position: [4, 8],
                boards: this.replay.config.boards,
                cheats: this.replay.config.cheats,
                cheated: false
            });
        }
        else if (this.replay.config.players === 4) {
            this.state.players.push({
                position: [5, 0],
                boards: this.replay.config.boards,
                cheats: this.replay.config.cheats,
                cheated: false
            });
            this.state.players.push({
                position: [10, 5],
                boards: this.replay.config.boards,
                cheats: this.replay.config.cheats,
                cheated: false
            });
            this.state.players.push({
                position: [5, 10],
                boards: this.replay.config.boards,
                cheats: this.replay.config.cheats,
                cheated: false
            });
            this.state.players.push({
                position: [0, 5],
                boards: this.replay.config.boards,
                cheats: this.replay.config.cheats,
                cheated: false
            });
        }
        else throw new Error('invalid players count');
    }
    get side(): number {
        return this.replay.config.players === 4 ? 11 : 9;
    }
    get steps(): number {
        return this.replay.actions.length;
    }
    nextTurn() {
        if (this._extendedTurnLeft) {
            this._extendedTurnLeft -= 1;
            return;
        }
        let nextTurn = this.turn;
        do {
            nextTurn = (nextTurn + 1) % this.replay.config.players;
        } while (this.winners.includes(nextTurn) || this.losers.includes(nextTurn))
        this.turn = nextTurn;
    }
    nextAction(): GameAction | undefined {
        if (this.current >= this.steps - 1) return;
        const action = this.replay.actions[++this.current];
        this.nextTurn();
        switch (action.type) {
            case ActionType.MOVE:
            case ActionType.JUMP: {
                this.state.players[this.turn].position =
                    (action as MoveAction).to;
                if (this._isWinner(this.turn)) {
                    this.winners.push(this.turn);
                }
                break;
            }
            case ActionType.BOARD: {
                this.state.players[this.turn].boards -= 1;
                const cast = action as BoardAction;
                this.state.boards.push({
                    position: cast.position,
                    orientation: cast.orientation,
                    length: cast.length,
                    destroyed: false
                });
                break;
            }
            case ActionType.SURRENDER: {
                this.losers.push(this.turn);
                this._extendedTurnLeft = 0;
                break;
            }
            case ActionType.TIMEOUT: {
                switch (this.replay.config.elapsed) {
                    case TimerElapsed.LOSE: {
                        this.losers.push(this.turn);
                        this._extendedTurnLeft = 0;
                        break;
                    }
                    case TimerElapsed.BOARD: {
                        this.state.players[(this.turn + 1) % this.replay.config.players].boards += 1;
                        break;
                    }
                    case TimerElapsed.CHEAT: {
                        this.state.players[(this.turn + 1) % this.replay.config.players].cheats += 1;
                        break;
                    }
                }
                break;
            }
            case ActionType.CHEAT: {
                const cast = action as CheatAction;
                this._extendedTurnLeft++;
                switch (cast.cheat) {
                    case CheatType.ADDBOARD: {
                        this.state.players[this.turn].boards += 1;
                        break;
                    }
                    case CheatType.DESTROYER: {
                        this.state.boards.find(board =>
                            pointEquals(board.position, cast.parameters!.position) &&
                            board.orientation === cast.parameters!.orientation)!.destroyed = true;
                        this._extendedTurnLeft--;
                        break;
                    }
                    case CheatType.ADDROUND: {
                        this._extendedTurnLeft++;
                        break;
                    }
                }
                this.state.players[this.turn].cheats -= 1;
                this.state.players[this.turn].cheated = true;
            }
        }
        return action;
    }
    private _isWinner(index: number): boolean {
        if (this.replay.config.players === 2) {
            if (index === 0) {
                return this.state.players[0].position[1] >= this.side - 1;
            }
            else if (index === 1) {
                return this.state.players[1].position[1] <= 0;
            }
        }
        else if (this.replay.config.players === 4) {
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