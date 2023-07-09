import { Event as EventShared, Cfx } from "@fivemjs/shared";
import { CFXEventData } from "@fivemjs/shared";

export class Event extends EventShared {
	public static emitServer(eventName: string, ...args: any[]): void {
		return Cfx.triggerServerEvent(eventName, ...args);
	}

	public static onServer(eventName: string, listener: (...args: any[]) => void): CFXEventData {
		Cfx.addNetEventListener(eventName, listener);
		return {
			eventName,
			listener: listener,
		} as CFXEventData;
	}

	public static onceServer(eventName: string, listener: (...args: any[]) => void): CFXEventData {
		const eventData = this.onServer(eventName, (...args: any[]) => {
			listener(...args);
			this.off(eventData);
		});
		return eventData;
	}
}

export const emitServer = Event.emitServer;
export const onServer = Event.onServer;
export const onceServer = Event.onceServer;
