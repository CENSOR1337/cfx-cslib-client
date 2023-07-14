import { Vector3 } from "@fivemjs/shared";

export class Player {
	public static player: Player;

	constructor(public readonly playerId: number) {}

	public static get local(): Player {
		if (!Player.player) {
			Player.player = new Player(PlayerId());
		}
		return Player.player;
	}

	public get ped(): number {
		return GetPlayerPed(this.playerId);
	}

	public get pos(): Vector3 {
		return Vector3.fromArray(GetEntityCoords(this.ped, true));
	}

	public get rot(): Vector3 {
		return Vector3.fromArray(GetEntityRotation(this.ped, 0));
	}
}
