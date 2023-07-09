import { randomUUID } from "./uuid";
import { Event } from "./event";
import { CFXEventData } from "@fivemjs/shared";

function triggerServerCallback<T>(eventName: string, ...args: any[]): Promise<T> {
	const cbId = randomUUID();
	const cbEventName = `cslib:svcb:${cbId}`;
	const promise = new Promise<T>((resolve, reject) => {
		Event.onServer(cbEventName, (data: any) => {
			resolve(data as T);
		});
	});
	Event.emitServer(eventName, cbId, ...args);
	return promise;
}

function registerClientCallback(eventName: string, handler: (...args: any[]) => void): CFXEventData {
	return Event.onServer(eventName, (cbId: string, ...args: any[]) => {
		const cbEventName = `cslib:clcb:${cbId}`;
		Event.emitServer(cbEventName, handler(...args));
	});
}

export class Callback {
	public static emit(eventName: string, ...args: any[]): Promise<any[]> {
		return triggerServerCallback(eventName, ...args);
	}

	public static register(eventName: string, handler: (...args: any[]) => void): CFXEventData {
		return registerClientCallback(eventName, handler);
	}
}
