import { Resource as ResourceShared } from "@fivemjs/shared";
import { Event } from "./event";

export class Resource extends ResourceShared {
	public static emitServer(eventName: string, target: number, ...args: any[]) {
		return Event.emitServer(this.getEventName(eventName), target, ...args);
	}
}
