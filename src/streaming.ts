function internalRequest(classObj: any, requestFunction: Function, ...args: any[]): Promise<void> {
	return new Promise(async (resolve, reject) => {
		if (classObj.isValid(...args)) {
			requestFunction(...args);
			while (!classObj.hasLoaded(...args)) {
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
			resolve();
		} else {
			reject(`${classObj.constructor.name}, ${args} is not valid`);
		}
	});
}
class StreamingModel {
	public static request(modelHash: string | number): Promise<void> {
		const hash = typeof modelHash === "string" ? GetHashKey(modelHash) : modelHash;
		return internalRequest(StreamingModel, RequestModel, hash);
	}

	public static remove(modelHash: number): void {
		SetModelAsNoLongerNeeded(modelHash);
	}

	public static hasLoaded(modelHash: number): boolean {
		return HasModelLoaded(modelHash);
	}

	public static isValid(modelHash: number): boolean {
		return IsModelValid(modelHash);
	}
}

class Anim {
	public static request(dict: string): Promise<void> {
		return internalRequest(Anim, RequestAnimDict, dict);
	}

	public static remove(dict: string): void {
		RemoveAnimDict(dict);
	}

	public static hasLoaded(dict: string): boolean {
		return HasAnimDictLoaded(dict);
	}

	public static isValid(dict: string): boolean {
		return DoesAnimDictExist(dict);
	}
}

class Ptfx {
	public static request(fxName: string): Promise<void> {
		return internalRequest(Ptfx, RequestNamedPtfxAsset, fxName);
	}

	public static remove(fxName: string): void {
		RemoveNamedPtfxAsset(fxName);
	}

	public static hasLoaded(fxName: string): boolean {
		return HasNamedPtfxAssetLoaded(fxName);
	}

	public static isValid(fxName: string): boolean {
		return true; // Can't find a native for this
	}
}

export class Streaming {
	public static Model = StreamingModel;
	public static Anim = Anim;
	public static Ptfx = Ptfx;
}
