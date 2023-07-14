import { Events as EventShared, Citizen } from "@fivemjs/shared";
import { CFXEventData } from "@fivemjs/shared";
import { listenerType } from "@fivemjs/shared";
import { VirtualEntity } from "./VirtualEntity";

export class Events extends EventShared {
	protected static getObjectClass(obj: any): any {
		const objType = obj.type;
		if (!objType) return obj;

		switch (objType) {
			case VirtualEntity.type: {
				return VirtualEntity.get(obj);
			}
		}

		return super.getObjectClass(obj);
	}

	public static emitServer(eventName: string, ...args: any[]): void {
		return Citizen.triggerServerEvent(eventName, ...args);
	}

	public static onServer(eventName: string, listener: listenerType): CFXEventData {
		Citizen.addNetEventListener(eventName, listener);
		return { eventName, listener } as CFXEventData;
	}

	public static onceServer(eventName: string, listener: listenerType): CFXEventData {
		let eventData: CFXEventData;
		eventData = Events.onServer(eventName, (...args: any[]) => {
			listener(...args);
			Events.off(eventData);
		});
		return eventData;
	}

	public static on(eventName: string, listener: listenerType): CFXEventData {
		const handler = (...args: any[]) => {
			listener(...Events.getClassFromArguments(...args));
		};
		return super.on(eventName, handler);
	}

	public static once(eventName: string, listener: listenerType): CFXEventData {
		const handler = (...args: any[]) => {
			listener(...Events.getClassFromArguments(...args));
		};
		return super.once(eventName, handler);
	}
}

export const on = Events.on;
export const once = Events.once;
export const emitServer = Events.emitServer;
export const onServer = Events.onServer;
export const onceServer = Events.onceServer;
