import { hashAssetsDB } from "@/db";
import type { IConversationTypeFile } from "@/stateV2/conversation";
import type { IStateProfile } from "@/stateV2/profile";
import { message } from "antd";
import { saveAs } from "file-saver";
import CommonBlock from "./CommonBlock";

type Props = Pick<IConversationTypeFile, "upperText" | "fileData"> & {
	senderId: IStateProfile["id"];
};

const formatFileSize = (bytes: number) => {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const File = ({ upperText, senderId, fileData }: Props) => {
	const download = async () => {
		const asset = await hashAssetsDB.files.get(fileData.fileInfo);
		if (!asset?.file) {
			message.error("文件数据不存在或已被清理");
			return;
		}
		saveAs(asset.file, fileData.fileName);
	};

	return (
		<CommonBlock
			upperText={upperText}
			senderId={senderId}
			innerBlockClassName="w-[222px] cursor-pointer bg-white before:bg-white p-2"
			onClick={download}
		>
			<div className="flex min-h-12 items-center justify-between gap-3">
				<div className="min-w-0 flex-1 self-stretch py-0.5 text-left">
					<div className="truncate text-base text-black leading-6">{fileData.fileName}</div>
					<div className="mt-1 text-[#AFAFB5] text-xs leading-4">
						{formatFileSize(fileData.fileSize)}
					</div>
				</div>
				<div className="relative flex h-10 w-8 shrink-0 items-center justify-center bg-[#E4E7EE] text-[#8F96A3] text-lg">
					<span className="absolute top-0 right-0 h-2.5 w-2.5 border-[#C9CED8] border-b border-l bg-white" />
					?
				</div>
			</div>
		</CommonBlock>
	);
};

export default File;
