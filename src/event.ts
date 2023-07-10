import { Event as EventShared, Citizen } from "@fivemjs/shared";
import { CFXEventData } from "@fivemjs/shared";
import { listenerType } from "@fivemjs/shared";

export class Event extends EventShared {
	protected static getObjectClass(obj: any): any {
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
		eventData = Event.onServer(eventName, (...args: any[]) => {
			listener(...args);
			Event.off(eventData);
		});
		return eventData;
	}

	public static on(eventName: string, listener: listenerType): CFXEventData {
		const handler = (...args: any[]) => {
			listener(...Event.getClassFromArguments(...args));
		};
		return super.on(eventName, handler);
	}

	public static once(eventName: string, listener: listenerType): CFXEventData {
		const handler = (...args: any[]) => {
			listener(...Event.getClassFromArguments(...args));
		};
		return super.once(eventName, handler);
	}
}

export const on = Event.on;
export const once = Event.once;
export const emitServer = Event.emitServer;
export const onServer = Event.onServer;
export const onceServer = Event.onceServer;
