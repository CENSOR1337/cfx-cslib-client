import { Vector3 } from "@fivemjs/shared";
import { Dispatcher } from "@fivemjs/shared";
import { Streaming } from "../streaming";

export enum EntityType {
	Object = "object",
	Ped = "ped",
	Vehicle = "vehicle",
}

export class LocalEntity {
	private _id = 0;
	public readonly hash: number;
	public readonly pos: Vector3;
	public readonly rot: Vector3;
	public readonly type: EntityType;
	private _isDestroyed: boolean = false;
	public readonly onCreated = new Dispatcher();
	public readonly onDestroyed = new Dispatcher();

	constructor(modelHash: string | number, position: Vector3, rotation: Vector3, entityType: EntityType) {
		this.hash = typeof modelHash === "string" ? GetHashKey(modelHash) : modelHash;
		this.pos = position;
		this.rot = rotation;
		this.type = entityType;
		this.createEntity();
	}

	public get isDestroyed(): boolean {
		return this._isDestroyed;
	}
	public get id(): number {
		return this._id;
	}

	private async createEntity() {
		await Streaming.Model.request(this.hash);
		if (this.isDestroyed) return;
		switch (this.type) {
			case EntityType.Object:
				this._id = CreateObjectNoOffset(this.hash, this.pos.x, this.pos.y, this.pos.z, false, false, false);
				break;
			case EntityType.Ped:
				this._id = CreatePed(4, this.hash, this.pos.x, this.pos.y, this.pos.z, this.rot.x, false, false);
				break;
			case EntityType.Vehicle:
				this._id = CreateVehicle(this.hash, this.pos.x, this.pos.y, this.pos.z, this.rot.x, false, false);
				break;
			default:
				throw new Error("Invalid entity type");
		}
		if (!this.valid) {
			this.destroy();
			return;
		}
		this.onCreated.broadcast();
	}

	public async waitForCreation(): Promise<void> {
		if (this.valid) return Promise.resolve();
		return new Promise((resolve) => {
			const listener = this.onCreated.add(() => {
				resolve();
				this.onCreated.remove(listener);
			});
		});
	}

	public get valid(): boolean {
		return DoesEntityExist(this.id);
	}

	public destroy() {
		this._isDestroyed = true;
		this.onDestroyed.broadcast();
		if (!this.valid) return;
		DeleteEntity(this.id);
	}
}
