export type Point = [number, number];

export enum Orientation {
    HORIZONTAL, VERTICAL
}

export enum Direction {
    LEFT, TOP, RIGHT, BOTTOM
}

export function formatOrientation(orientation: Orientation): string {
    return orientation === Orientation.HORIZONTAL ? 'H' : 'V';
}

export function formatDirection(direction: Direction): string {
    return direction === Direction.LEFT ? 'L' :
        direction === Direction.TOP ? 'T' :
        direction === Direction.RIGHT ? 'R' : 'B'
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

export interface GameAction {
    player: number,
    type: string
}

export interface MoveAction extends GameAction {
    type: 'move',
    to: Point
}

export interface JumpAction extends GameAction {
    type: 'jump',
    to: Point
}

export interface BoardAction extends GameAction {
    type: 'board',
    position: Point,
    orientation: Orientation,
    length: number
}

export interface SurrenderAction extends GameAction {
    type: 'surrender'
}

export interface TimeoutAction extends GameAction {
    type: 'timeout'
}

export interface AddtionalBoardAction extends GameAction {
    type: 'addboard'
}

export interface DestroyerAction extends GameAction {
    type: 'destroyer',
    direction: Direction
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

export function formatAction(action: GameAction): string | undefined {
    switch (action.type) {
        case 'move': {
            const cast = (action as MoveAction);
            return `@${cast.player} !move (${cast.to[0]}, ${cast.to[1]})`;
        }
        case 'jump': {
            const cast = (action as JumpAction);
            return `@${cast.player} !jump (${cast.to[0]}, ${cast.to[1]})`;
        }
        case 'board': {
            const cast = (action as BoardAction);
            return `@${cast.player} !board (${cast.position[0]}, ${cast.position[1]}), ${formatOrientation(cast.orientation)}, ${cast.length}`;
        }
        case 'surrender': 
        case 'timeout': 
        case 'addboard': {
            return `@${action.player} !${action.type}`;
        }
        case 'destroyer': {
            const cast = (action as DestroyerAction);
            return `@${cast.player} !destroyer ${formatDirection(cast.direction)}`;
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