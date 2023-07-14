import { Resource as ResourceShared } from "@fivemjs/shared";
import { Events } from "./Events";
import { Callback } from "./Callback";
import { CFXEventData } from "@fivemjs/shared";

class ResourceCallback extends Callback {
	public static emit<T>(eventName: string, ...args: any[]): Promise<T> {
		return super.emit(Resource.getEventName(eventName), ...args);
	}

	public static register(eventName: string, handler: (...args: any[]) => void): CFXEventData {
		return super.register(Resource.getEventName(eventName), handler);
	}
}

export class Resource extends ResourceShared {
	public static readonly Callback = ResourceCallback;

	public static on(eventName: string, handler: (...args: any[]) => void): CFXEventData {
		return Events.on(this.getEventName(eventName), handler);
	}

	public static once(eventName: string, handler: (...args: any[]) => void): CFXEventData {
		return Events.once(this.getEventName(eventName), handler);
	}

	public static emitServer(eventName: string, ...args: any[]) {
		return Events.emitServer(this.getEventName(eventName), ...args);
	}

	public static onServer(eventName: string, handler: (...args: any[]) => void): CFXEventData {
		return Events.onServer(this.getEventName(eventName), handler);
	}

	public static onceServer(eventName: string, handler: (...args: any[]) => void): CFXEventData {
		return Events.onceServer(this.getEventName(eventName), handler);
	}
}
