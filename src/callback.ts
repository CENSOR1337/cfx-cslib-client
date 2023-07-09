import { randomUUID } from "./uuid";
import { Event } from "./event";
import { CFXEventData } from "@fivemjs/shared";

function triggerServerCallback<T>(eventName: string, ...args: any[]): Promise<T> {
	const cbId = randomUUID();
	const promise = new Promise<T>((resolve, reject) => {
		Event.onServer(cbId, (data: any) => {
			resolve(data as T);
		});
	});
	Event.emitServer(`cslib:svcb:${eventName}`, cbId, ...args);
	return promise;
}

function registerClientCallback(eventName: string, handler: (...args: any[]) => void): CFXEventData {
	return Event.onServer(`cslib:clcb:${eventName}`, (cbId: string, ...args: any[]) => {
		Event.emitServer(cbId, handler(...args));
	});
}

export class Callback {
	public static emit = triggerServerCallback;
	public static register = registerClientCallback;
}
