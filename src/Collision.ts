import { Vector3 } from "@fivemjs/shared";
import { Collision as CollisionBase } from "@fivemjs/shared";
import { randomUUID } from "./utils/uuid";

export class Collision extends CollisionBase {
	constructor(pos: Vector3) {
		const id = randomUUID();
		super(id, pos);
	}

	protected isEntityValid(entity: number) {
		if (!super.isEntityValid(entity)) return false;
		return true;
	}

	protected getRevelantEntities(): Array<number> {
		const entities = new Array<number>();
		const players = GetActivePlayers();

		for (const player of players) {
			const ped = GetPlayerPed(player);
			entities.push(ped);
		}

		if (!this.playersOnly) {
			const vehicles = GetGamePool("CVehicle");
			const objects = GetGamePool("CObject");
			const peds = GetGamePool("CPed");

			entities.push(...vehicles);
			entities.push(...objects);
			entities.push(...peds);
		}

		return entities;
	}
}
