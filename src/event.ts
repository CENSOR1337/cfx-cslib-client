import { Event as EventShared, Cfx } from "@fivemjs/shared";
import { CFXEventData } from "@fivemjs/shared";

export type listener = (...args: any[]) => void;

export class Event extends EventShared {
	public static emitServer(eventName: string, ...args: any[]): void {
		return Cfx.triggerServerEvent(eventName, ...args);
	}

	public static onServer(eventName: string, listener: listener): CFXEventData {
		Cfx.addNetEventListener(eventName, listener);
		return { eventName, listener } as CFXEventData;
	}

	public static onceServer(eventName: string, listener: listener): CFXEventData {
		let eventData: CFXEventData;
		eventData = Event.onServer(eventName, (...args: any[]) => {
			listener(...args);
			Event.off(eventData);
		});
		return eventData;
	}
}

export const emitServer = Event.emitServer;
export const onServer = Event.onServer;
export const onceServer = Event.onceServer;
