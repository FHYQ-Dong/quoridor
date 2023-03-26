export type Point = [number, number];

export enum Orientation {
    HORIZONTAL, VERTICAL
}

export enum Direction {
    LEFT, TOP, RIGHT, BOTTOM
}

export enum ActionType {
    MOVE, JUMP, BOARD, SURRENDER, TIMEOUT, CHEAT
}

export function formatPoint(point: Point): string {
    return `(${point[0]},${point[1]})`;
}

export function parsePoint(repr: string): Point {
    return repr.substring(1, repr.length-1).split(',').map(a => parseInt(a)) as Point;
}

export function formatOrientation(orientation: Orientation): string {
    return orientation === Orientation.HORIZONTAL ? 'H' : 'V';
}

export function parseOrientation(repr: string): Orientation {
    return repr === 'H' ? Orientation.HORIZONTAL : Orientation.VERTICAL;
}

export function formatDirection(direction: Direction): string {
    return direction === Direction.LEFT ? 'L' :
        direction === Direction.TOP ? 'T' :
        direction === Direction.RIGHT ? 'R' : 'B';
}

export function parseDirection(repr: string): Direction {
    return repr === 'L' ? Direction.LEFT :
        repr === 'T' ? Direction.TOP :
        repr === 'R' ? Direction.RIGHT : Direction.BOTTOM;
}

export interface PlayerState {
    position: Point,
    boards: number,
    cheats: number,
    cheated: boolean
}

export interface BoardState {
    position: Point,
    orientation: Orientation,
    length: number,
    destroyed: boolean
}

export interface GameState {
    players: PlayerState[],
    boards: BoardState[]
}

export interface MoveChoice {
    to: Point,
    jump: boolean
}

export interface BoardChoice {
    hint: Point,
    position: Point,
    orientation: Orientation
}

export interface DestroyChoice {
    hint: Point,
    direction: Direction
}

export interface GameAction {
    type: ActionType
}

export interface MoveAction extends GameAction {
    type: ActionType.MOVE,
    to: Point
}

export interface JumpAction extends GameAction {
    type: ActionType.JUMP,
    to: Point
}

export interface BoardAction extends GameAction {
    type: ActionType.BOARD,
    position: Point,
    orientation: Orientation,
    length: number
}

export interface SurrenderAction extends GameAction {
    type: ActionType.SURRENDER
}

export interface TimeoutAction extends GameAction {
    type: ActionType.TIMEOUT
}

export interface DestroyerParameters {
    position: Point,
    orientation: Orientation
}

export type CheatType = 'addround' | 'addboard' | 'shortboard' | 'longboard' | 'destroyer';

export interface CheatAction extends GameAction {
    type: ActionType.CHEAT,
    cheat: CheatType,
    parameters?: DestroyerParameters
}

export function pointEquals(p1: Point, p2: Point): boolean {
    return p1[0] === p2[0] && p1[1] === p2[1];
}

export function beside(point: Point, direction: Direction, span?: number): Point {
    span = span ?? 1;
    switch (direction) {
        case Direction.LEFT: {
            return [point[0]-span, point[1]];
        }
        case Direction.TOP: {
            return [point[0], point[1]-span];
        }
        case Direction.RIGHT: {
            return [point[0]+span, point[1]];
        }
        case Direction.BOTTOM: {
            return [point[0], point[1]+span];
        }
    }
}

export function formatAction(action: GameAction): string {
    switch (action.type) {
        case ActionType.MOVE: {
            const cast = (action as MoveAction);
            return `!move ${formatPoint(cast.to)}`;
        }
        case ActionType.JUMP: {
            const cast = (action as JumpAction);
            return `!jump ${formatPoint(cast.to)}`;
        }
        case ActionType.BOARD: {
            const cast = (action as BoardAction);
            return `!board ${formatPoint(cast.position)} ${formatOrientation(cast.orientation)} ${cast.length}`;
        }
        case ActionType.SURRENDER: {
            return '!surrender'
        }
        case ActionType.TIMEOUT: {
            return '!timeout';
        }
        case ActionType.CHEAT: {
            const cast = (action as CheatAction);
            switch (cast.cheat) {
                case 'destroyer': {
                    return `!cheat ${cast.cheat} ${formatPoint(cast.parameters!.position)} ${formatOrientation(cast.parameters!.orientation)}`;
                }
                default: {
                    return `!cheat ${cast.cheat}`
                }
            }
        }
    }
}

export function parseAction(repr: string): GameAction {
    if (repr.startsWith('!')) repr = repr.substring(1);
    const [type, ...params] = repr.split(' ');
    switch (type) {
        case 'move': {
            return {
                type: ActionType.MOVE,
                to: parsePoint(params[0])
            } as MoveAction;
        }
        case 'jump': {
            return {
                type: ActionType.JUMP,
                to: parsePoint(params[0])
            } as JumpAction;
        }
        case 'board': {
            return {
                type: ActionType.BOARD,
                position: parsePoint(params[0]),
                orientation: parseOrientation(params[1]),
                length: parseInt(params[2])
            } as BoardAction;
        }
        case 'surrender': {
            return {
                type: ActionType.SURRENDER
            } as SurrenderAction
        }
        case 'timeout': {
            return {
                type: ActionType.TIMEOUT
            } as TimeoutAction;
        }
        case 'cheat': {
            if (params[0] === 'destroyer') {
                return {
                    type: ActionType.CHEAT,
                    cheat: 'destroyer',
                    parameters: {
                        position: parsePoint(params[1]),
                        orientation: parseOrientation(params[2])
                    }
                } as CheatAction;
            }
            return {
                type: ActionType.CHEAT,
                cheat: params[0] as CheatType
            } as CheatAction;
        }
    }
    throw new Error('invalid action string: ' + repr);
}

export function leftSide(direction: Direction): Direction {
    switch (direction) {
        case Direction.LEFT: return Direction.BOTTOM;
        case Direction.TOP: return Direction.LEFT;
        case Direction.RIGHT: return Direction.TOP;
        case Direction.BOTTOM: return Direction.RIGHT;
    }
}
export function rightSide(direction: Direction): Direction {
    switch (direction) {
        case Direction.LEFT: return Direction.TOP;
        case Direction.TOP: return Direction.RIGHT;
        case Direction.RIGHT: return Direction.BOTTOM;
        case Direction.BOTTOM: return Direction.LEFT;
    }
}