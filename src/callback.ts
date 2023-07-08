import { randomUUID } from "./uuid";
import { once, onceNet, onNet } from "@fivemjs/shared";
import { emitServer } from "./event";
import { CFXEventData } from "@fivemjs/shared";

function triggerServerCallback(eventName: string, ...args: any[]): Promise<any[]> {
	const cbId = randomUUID();
	const cbEventName = `cslib:svcb:${cbId}`;
	const promise = new Promise<any[]>((resolve, reject) => {
		onceNet(cbEventName, (...cbArgs: any[]) => {
			resolve(cbArgs);
		});
	});
	emitServer(eventName, cbId, ...args);
	return promise;
}

function registerClientCallback(eventName: string, handler: (...args: any[]) => void) {
	const cbEventName = `cslib:clcb:${eventName}`;
	return onNet(cbEventName, (cbId: string, ...args: any[]) => {
		emitServer(`${cbEventName}${cbId}`, handler(...args));
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
