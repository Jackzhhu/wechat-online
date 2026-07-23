import Dexie, { type Table } from "dexie";
import { isUndefined } from "lodash-es";

interface DBAsset {
	id: string;
	file: File;
}
export const HASH_ASSETS_DB_NAME = "HashAssetsDB";

export const hashAssetsDB = new Dexie(HASH_ASSETS_DB_NAME) as Dexie & {
	images: Table<DBAsset, string>;
	files: Table<DBAsset, string>;
};

hashAssetsDB.version(1).stores({
	images: "&id",
});

hashAssetsDB.version(2).stores({
	images: "&id",
	files: "&id",
});

hashAssetsDB.use({
	stack: "dbcore",
	name: "imagesCreateMiddleware",
	create: (downlevelDatabase) => {
		return {
			...downlevelDatabase,
			table(name) {
				const downlevelTable = downlevelDatabase.table(name);

				if (name === "images" || name === "files") {
					return {
						...downlevelTable,
						mutate: (req) => {
							if (req.type === "put") {
								const { values } = req;
								const data = values[0] as DBAsset;
								if (data.file) {
									const url = URL.createObjectURL(data.file);
									IMAGES_CACHE.set(data.id, url);
								}
							}
							return downlevelTable.mutate(req);
						},
					};
				}
				return downlevelTable;
			},
		};
	},
});

export let __INIT_IMAGE_DB_PROMISE__: Promise<void> | undefined;
export const IMAGES_CACHE = new Map<string, string>();

export function initDBImagesCacheStore() {
	if (isUndefined(__INIT_IMAGE_DB_PROMISE__)) {
		console.time("initDBImagesCacheStore");
		__INIT_IMAGE_DB_PROMISE__ = hashAssetsDB.images.toArray().then((allImages) => {
			allImages.forEach((img) => {
				if (!img.file) return;
				const url = URL.createObjectURL(img.file);
				IMAGES_CACHE.set(img.id, url);
			});
			console.timeEnd("initDBImagesCacheStore");
		});
	}
	return __INIT_IMAGE_DB_PROMISE__;
}
