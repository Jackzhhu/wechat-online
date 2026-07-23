import { hashAssetsDB } from "@/db";
import { getFileMD5 } from "@/utils";
import { DeleteOutlined, FileOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import type { ChangeEvent } from "react";

export type UploadedFileData = {
	fileInfo: string;
	fileName: string;
	fileSize: number;
	mimeType?: string;
};

type Props = {
	value?: UploadedFileData;
	onChange?: (value?: UploadedFileData) => void;
};

const LocalFileUpload = ({ value, onChange }: Props) => {
	const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;
		const hash = await getFileMD5(file);
		await hashAssetsDB.files.put({ id: hash, file });
		onChange?.({
			fileInfo: hash,
			fileName: file.name,
			fileSize: file.size,
			mimeType: file.type || undefined,
		});
	};

	return (
		<div>
			<Input type="file" onChange={handleChange} />
			{value && (
				<div className="mt-2 flex items-center gap-2 rounded border p-2">
					<FileOutlined />
					<span className="min-w-0 flex-1 truncate">{value.fileName}</span>
					<Button type="text" danger icon={<DeleteOutlined />} onClick={() => onChange?.()} />
				</div>
			)}
		</div>
	);
};

export default LocalFileUpload;
