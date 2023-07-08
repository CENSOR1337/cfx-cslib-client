const cfx = {
	// @ts-ignore
	triggerServerEvent: global.TriggerServerEvent,
};

export function emitServer(eventName: string, ...args: any[]): void {
	return cfx.triggerServerEvent(eventName, ...args);
}
