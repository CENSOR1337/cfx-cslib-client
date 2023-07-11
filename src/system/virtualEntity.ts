import { Resource } from "../resource";
import { VirtualEntityObject } from "../objects";

export class VirtualEntity extends VirtualEntityObject {
	public static get all(): VirtualEntityObject[] {
		return Array.from(VirtualEntityObject.instances.values());
	}
}

Resource.onServer(VirtualEntity.Event.onVirtualEntityStreamIn, function (veObject: any) {
	const id = veObject.id;
	const pos = veObject.pos;
	const syncedMeta = veObject.syncedMeta;
	if (VirtualEntityObject.instances.get(id)) return;
	const object = new VirtualEntity(id, pos, syncedMeta);
	VirtualEntityObject.instances.set(id, object);
	Resource.emit("virtualEntityStreamIn", object);
});

Resource.onServer(VirtualEntity.Event.onVirtualEntityStreamOut, function (veObject: any) {
	const id = veObject.id;
	const object = VirtualEntityObject.instances.get(id);
	if (!object) return;
	Resource.emit("virtualEntityStreamOut", object);
	object.destroy();
});

Resource.on("virtualEntityStreamIn", (ve: VirtualEntity) => {
	//console.log("VirtualEntity StreamIn", ve.id, ve);
    ve.hello();
});

Resource.on("virtualEntityStreamOut", (ve: VirtualEntity) => {
	//console.log("VirtualEntity StreamOut", ve.id, ve);
});
