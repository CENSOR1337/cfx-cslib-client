import { Vector3 } from "@fivemjs/shared";
import { VirtualEntity as SharedVirtualEntity } from "@fivemjs/shared";
import { Resource } from "../resource";
import { off } from "@fivemjs/shared";
import { CFXEventData } from "@fivemjs/shared";
import { Dispatcher } from "@fivemjs/shared";

export class VirtualEntity extends SharedVirtualEntity {
	public static readonly instances = new Map<string, VirtualEntity>();
	readonly id: string;
	readonly pos: Vector3;
	readonly syncedMeta: Record<string, any>;
	readonly events = new Array<CFXEventData>();
	private dispatchers = {
		onStreamIn: new Dispatcher(),
		onStreamOut: new Dispatcher(),
	};

	protected constructor(id: string, pos: Vector3, syncedMeta: Record<string, any>) {
		super(pos);
		this.id = id;
		this.pos = new Vector3(pos.x, pos.y, pos.z);
		this.syncedMeta = syncedMeta;
		this.events.push(Resource.onServer(this.event.onVirtualEntitySyncedMetaChange, this.onSyncedMetaChange.bind(this)));
		if (id == "VE_TEMP_INSTANCE") return;
		VirtualEntity.instances.set(this.id, this);
		Resource.onResourceStop(this.destroy.bind(this));
		this.onStreamIn();
	}

	protected onStreamIn() {} // implement this in your class

	protected onStreamOut() {} // implement this in your class

	public getSyncedMeta(key: string): any {
		return this.syncedMeta[key];
	}

	private onSyncedMetaChange(id: string, key: string, value: any) {
		if (id !== this.id) return;
		this.syncedMeta[key] = value;
	}

	public destroy() {
		this.onStreamOut();
		this.events.forEach((event) => off(event));
		VirtualEntity.instances.delete(this.id);
	}

	public static get(obj: any): VirtualEntity | undefined {
		const id = typeof obj === "string" ? obj : obj.id;
		if (!id) return undefined;
		return VirtualEntity.instances.get(id);
	}

	public static initialize(classObject: any) {
		const handlerObject = new classObject("VE_TEMP_INSTANCE", new Vector3(0, 0, 0), {});
		Resource.onServer(handlerObject.event.onVirtualEntityStreamIn, function (veObject: any) {
			const id = veObject.id;
			const pos = veObject.pos;
			const syncedMeta = veObject.syncedMeta;
			if (VirtualEntity.instances.get(id)) return;
			const instance = new classObject(id, pos, syncedMeta);
		});

		Resource.onServer(handlerObject.event.onVirtualEntityStreamOut, function (veObject: any) {
			const id = veObject.id;
			const instance = VirtualEntity.instances.get(id);
			if (!instance) return;
			instance.destroy();
		});
	}
}
