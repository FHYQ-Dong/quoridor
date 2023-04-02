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

export function formatOrientation(orientation: Orientation): string {
    return ['H', 'V'][orientation];
}

export function formatDirection(direction: Direction): string {
    return ['L', 'T', 'R', 'B'][direction];
}

export function formatActionType(actionType: ActionType): string {
    return [
        'move',
        'jump',
        'board',
        'surrender',
        'timeout',
        'cheat'
    ][actionType];
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

export interface DestroyerParameters {
    position: Point,
    orientation: Orientation
}

export enum CheatType {
    ADDROUND, ADDBOARD, SHORTBOARD, LONGBOARD, DESTROYER
}

export function formatCheatType(cheatType: CheatType) {
    return [
        'addround', 
        'addboard', 
        'shortboard', 
        'longboard', 
        'destroyer'
    ][cheatType];
}

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
            return `!${formatActionType(action.type)} ${formatPoint(cast.to)}`;
        }
        case ActionType.JUMP: {
            const cast = (action as JumpAction);
            return `!${formatActionType(action.type)} ${formatPoint(cast.to)}`;
        }
        case ActionType.BOARD: {
            const cast = (action as BoardAction);
            return `!${formatActionType(action.type)} ${formatPoint(cast.position)} ${formatOrientation(cast.orientation)} ${cast.length}`;
        }
        case ActionType.SURRENDER:
        case ActionType.TIMEOUT: {
            return `!${formatActionType(action.type)}`;
        }
        case ActionType.CHEAT: {
            const cast = (action as CheatAction);
            switch (cast.cheat) {
                case CheatType.DESTROYER: {
                    return `!${formatActionType(action.type)}:${formatCheatType(cast.cheat)} ${formatPoint(cast.parameters!.position)} ${formatOrientation(cast.parameters!.orientation)}`;
                }
                default: {
                    return `!${formatActionType(action.type)}:${formatCheatType(cast.cheat)}`
                }
            }
        }
    }
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