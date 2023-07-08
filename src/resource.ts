import { Resource as ResourceShared } from "@fivemjs/shared";
import { emitServer } from "./event";

export class Resource extends ResourceShared {
	public static emitServer(eventName: string, target: number, ...args: any[]) {
		return emitServer(this.getEventName(eventName), target, ...args);
	}
}
