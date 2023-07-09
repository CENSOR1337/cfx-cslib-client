import { randomUUID } from "./uuid";
import { Event } from "./event";
import { CFXEventData } from "@fivemjs/shared";

function triggerServerCallback(eventName: string, ...args: any[]): Promise<any[]> {
	const cbId = randomUUID();
	const cbEventName = `cslib:svcb:${cbId}`;
	const promise = new Promise<any[]>((resolve, reject) => {
		Event.onServer(cbEventName, (...cbArgs: any[]) => {
			resolve(cbArgs);
		});
	});
	Event.emitServer(eventName, cbId, ...args);
	return promise;
}

function registerClientCallback(eventName: string, handler: (...args: any[]) => void): CFXEventData {
	const cbEventName = `cslib:clcb:${eventName}`;
	return Event.onServer(cbEventName, (cbId: string, ...args: any[]) => {
		Event.emitServer(`${cbEventName}${cbId}`, handler(...args));
	});
}

export class Callback {
	public static trigger(eventName: string, ...args: any[]): Promise<any[]> {
		return triggerServerCallback(eventName, ...args);
	}

	public static register(eventName: string, handler: (...args: any[]) => void): CFXEventData {
		return registerClientCallback(eventName, handler);
	}
}
