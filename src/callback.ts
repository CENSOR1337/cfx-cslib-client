import { randomUUID } from "./uuid";
import { Event } from "./event";
import { CFXEventData } from "@fivemjs/shared";
import { Callback as CallbackShared } from "@fivemjs/shared";

export class Callback extends CallbackShared {
	public static emit<T>(eventName: string, ...args: any[]): Promise<T> {
		const cbId = randomUUID();
		const promise = new Promise<T>((resolve, reject) => {
			Event.onServer(cbId, (data: any) => {
				resolve(data as T);
			});
		});
		Event.emitServer(`${this.serverNamespace}:${eventName}`, cbId, ...args);
		return promise;
	}

	public static register(eventName: string, handler: (...args: any[]) => void): CFXEventData {
		return Event.onServer(`${this.clientNamespace}:${eventName}`, (cbId: string, ...args: any[]) => {
			Event.emitServer(cbId, handler(...args));
		});
	}
}
