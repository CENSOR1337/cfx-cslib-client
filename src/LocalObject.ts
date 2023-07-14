import { LocalEntity } from "./LocalEntity";
import { Vector3 } from "@fivemjs/shared";
import { EntityType } from "./LocalEntity";

export class LocalObject extends LocalEntity {
	constructor(modelHash: string | number, position: Vector3, rotation: Vector3) {
		super(modelHash, position, rotation, EntityType.Object);
	}
}
