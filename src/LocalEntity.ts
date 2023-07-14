import { Vector3 } from "@fivemjs/shared";
import { Dispatcher } from "@fivemjs/shared";
import { Streaming } from "./Streaming";
import { EntityNative } from "@fivemjs/shared";

export enum EntityType {
	Object = "object",
	Ped = "ped",
	Vehicle = "vehicle",
}

class EntityNativeClient extends EntityNative {
	public get freeze(): boolean {
		return IsEntityPositionFrozen(this.handle);
	}

	public set freeze(state: boolean) {
		super.freeze = state;
	}
}

export class LocalEntity extends EntityNativeClient {
	//private handle = 0;
	//public readonly hash: number;
	//private pos = new Vector3(0, 0, 0);
	//private rot = new Vector3(0, 0, 0);
	public readonly type: EntityType;
	private _isDestroyed: boolean = false;
	public readonly onCreated = new Dispatcher();
	public readonly onDestroyed = new Dispatcher();

	constructor(modelHash: string | number, position: Vector3, rotation: Vector3, entityType: EntityType) {
		super(modelHash);
		//this.pos = position;
		//this.rot = rotation;
		this.type = entityType;
		this.createEntity(position, rotation);
	}

	public get isDestroyed(): boolean {
		return this._isDestroyed;
	}

	public get id(): number {
		return this.handle;
	}

	public get valid(): boolean {
		return DoesEntityExist(this.handle);
	}

	private async createEntity(position: Vector3, rotation: Vector3) {
		await Streaming.Model.request(this.hash);
		if (this.isDestroyed) return;
		switch (this.type) {
			case EntityType.Object:
				this.handle = CreateObjectNoOffset(this.hash, position.x, position.y, position.z, false, false, false);
				break;
			case EntityType.Ped:
				this.handle = CreatePed(4, this.hash, position.x, position.y, position.z, rotation.x, false, false);
				break;
			case EntityType.Vehicle:
				this.handle = CreateVehicle(this.hash, position.x, position.y, position.z, rotation.x, false, false);
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
