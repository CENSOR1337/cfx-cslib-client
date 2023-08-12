import { Vector3 } from "@cfx/client";
import { Dispatcher } from "@cfx-cslib/shared";
import { Streaming } from "./Streaming";
import * as natives from "@cfx/natives";

export enum EntityType {
	Object = "object",
	Ped = "ped",
	Vehicle = "vehicle",
}

export class LocalEntity {
	private pos = new Vector3(0, 0, 0);
	private rot = new Vector3(0, 0, 0);
	private readonly hash: number;
	private _handle: number = 0;
	public readonly type: EntityType;
	private _isDestroyed: boolean = false;
	public readonly onCreated = new Dispatcher();
	public readonly onDestroyed = new Dispatcher();

	constructor(modelHash: string | number, position: Vector3, rotation: Vector3, entityType: EntityType) {
		this.pos = position;
		this.rot = rotation;
		this.hash = typeof modelHash === "string" ? natives.getHashKey(modelHash) : modelHash;
		this.type = entityType;
		this.createEntity(position, rotation);
	}

	public get isDestroyed(): boolean {
		return this._isDestroyed;
	}

	public get handle(): number {
		return this._handle;
	}

	public get id(): number {
		return this.handle;
	}

	public get valid(): boolean {
		return natives.doesEntityExist(this.handle);
	}

	private async createEntity(position: Vector3, rotation: Vector3) {
		await Streaming.Model.request(this.hash);
		if (this.isDestroyed) return;
		switch (this.type) {
			case EntityType.Object:
				this._handle = natives.createObjectNoOffset(this.hash, position.x, position.y, position.z, false, false, false);
				break;
			case EntityType.Ped:
				this._handle = natives.createPed(0, this.hash, position.x, position.y, position.z, 0.0, false, false);
				break;
			case EntityType.Vehicle:
				this._handle = natives.createVehicle(this.hash, position.x, position.y, position.z, 0.0, false, false, false);
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

	public destroy() {
		this._isDestroyed = true;
		this.onDestroyed.broadcast();
		if (!this.valid) return;
		DeleteEntity(this.id);
	}
}
