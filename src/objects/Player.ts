import { Vector3 } from "@fivemjs/shared";

export class Player {
	public static player: Player;

	constructor(public readonly handle: number) {}

	public static get local(): Player {
		if (!Player.player) {
			Player.player = new Player(PlayerId());
		}
		return Player.player;
	}

	public static fromPedHandle(ped: number): Player {
		return new Player(NetworkGetPlayerIndexFromPed(ped));
	}

	public static fromServerId(serverId: number): Player {
		return new Player(GetPlayerFromServerId(serverId));
	}

	public static get all(): Player[] {
		const players: Player[] = [];
		const activePlayers = GetActivePlayers();
		for (let i = 0; i < activePlayers.length; i++) {
			players.push(new Player(activePlayers[i]));
		}
		return players;
	}

	public get isDead(): boolean {
		return IsPlayerDead(this.handle);
	}

	public get ped(): number {
		return GetPlayerPed(this.handle);
	}

	public get pos(): Vector3 {
		return Vector3.fromArray(GetEntityCoords(this.ped, true));
	}

	public get rot(): Vector3 {
		return Vector3.fromArray(GetEntityRotation(this.ped, 0));
	}
}
