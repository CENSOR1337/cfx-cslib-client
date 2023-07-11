import { Vector3 } from "@fivemjs/shared";
import { VirtualEntity as SharedVirtualEntity } from "@fivemjs/shared";
import { Resource } from "../resource";
import { off } from "@fivemjs/shared";
import { CFXEventData } from "@fivemjs/shared";

export class VirtualEntityThread extends SharedVirtualEntity {
	protected static readonly instances = new Map<string, VirtualEntityThread>();
}

export class VirtualEntityObject extends SharedVirtualEntity {
	public static readonly instances = new Map<string, VirtualEntityObject>();
	readonly id: string;
	readonly pos: Vector3;
	readonly syncedMeta: Record<string, any>;
	readonly events = new Array<CFXEventData>();

	constructor(id: string, pos: Vector3, syncedMeta: Record<string, any>) {
		super(pos);
		this.id = id;
		this.pos = pos;
		this.syncedMeta = syncedMeta;
		this.events.push(Resource.onServer(VirtualEntityObject.Event.onVirtualEntitySyncedMetaChange, this.onSyncedMetaChange.bind(this)));
	}

	public getSyncedMeta(key: string): any {
		return this.syncedMeta[key];
	}

	private onSyncedMetaChange(id: string, key: string, value: any) {
		if (id !== this.id) return;
		this.syncedMeta[key] = value;
	}

	public destroy() {
		this.events.forEach((event) => off(event));
	}

	public hello() {
		console.log("hello");
	}

	public static get(obj: any): VirtualEntityObject | undefined {
		const id = typeof obj === "string" ? obj : obj.id;
		if (!id) return undefined;
		return VirtualEntityObject.instances.get(id);
	}
}
