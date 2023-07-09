import { Resource as ResourceShared } from "@fivemjs/shared";
import { Event } from "./event";

export class Resource extends ResourceShared {
	public static emitServer(eventName: string, ...args: any[]) {
		return Event.emitServer(this.getEventName(eventName), ...args);
	}
}
