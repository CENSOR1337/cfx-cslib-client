export class StreamingModel {
	public static request(modelHash: string | number): Promise<void> {
		const hash = typeof modelHash === "string" ? GetHashKey(modelHash) : modelHash;
		return new Promise(async (resolve, reject) => {
			if (StreamingModel.isValid(hash)) {
				RequestModel(hash);
				while (!StreamingModel.hasLoaded(hash)) {
					await new Promise((resolve) => setTimeout(resolve, 100));
				}
				resolve();
			} else {
				reject("Model is not valid");
			}
		});
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

class AnimDict {
	public static request(dict: string): Promise<void> {
		return new Promise(async (resolve, reject) => {
			if (AnimDict.hasLoaded(dict)) {
				resolve();
			} else {
				RequestAnimDict(dict);
				while (!AnimDict.hasLoaded(dict)) {
					await new Promise((resolve) => setTimeout(resolve, 100));
				}
				resolve();
			}
		});
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

export class Streaming {
	public static Model = StreamingModel;
	public static AnimDict = AnimDict;
}
