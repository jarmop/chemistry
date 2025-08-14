import { Vector3 } from "three";

export type Ball = { position: Vector3; color: string; radius: number };

export type Stick = { start: Vector3; end: Vector3 };

export type Connection = { ball?: Ball; stick?: Stick; reverse: boolean };
