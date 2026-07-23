import Done2SVG from "@/assets/done2-outlined.svg?react";
import ErrorSVG from "@/assets/error-outlined.svg?react";
import Previous2SVG from "@/assets/previous2-outlined.svg?react";
import Transfer2SVG from "@/assets/transfer2-outlined.svg?react";
import type { IConversationTypeTransfer } from "@/stateV2/conversation";
import type { IStateProfile } from "@/stateV2/profile";
import { get } from "lodash-es";
import { type ComponentType, type SVGProps, memo } from "react";
import { twJoin } from "tailwind-merge";
import { TRANSFER_TEXT_NOTE_MAP } from "../consts";
import CommonBlock from "./CommonBlock";

type Props = {
	role: IConversationTypeTransfer["role"];
	upperText: IConversationTypeTransfer["upperText"];
	senderId: IStateProfile["id"];
	transferStatus: IConversationTypeTransfer["transferStatus"];
	amount: IConversationTypeTransfer["amount"];
	note: IConversationTypeTransfer["note"];
	originalSender: IConversationTypeTransfer["originalSender"];
};

const SVG_COMPONENT_MAP: Record<
	IConversationTypeTransfer["transferStatus"],
	ComponentType<SVGProps<SVGSVGElement>>
> = {
	awaiting: Transfer2SVG,
	accepted: Done2SVG,
	rejected: Previous2SVG,
	expired: ErrorSVG,
};

const Transfer = ({
	upperText,
	senderId,
	transferStatus,
	amount,
	note,
	originalSender,
	role,
}: Props) => {
	const SVGComp = SVG_COMPONENT_MAP[transferStatus];
	const getTransferNote = () => {
		const statusText = get(TRANSFER_TEXT_NOTE_MAP, [originalSender, role, transferStatus], "");
		if (transferStatus === "awaiting") return statusText;
		return note || statusText;
	};

	return (
		<CommonBlock
			upperText={upperText}
			senderId={senderId}
			innerBlockClassName={twJoin(
				"w-[242px] pb-1",
				transferStatus === "awaiting" && "bg-wechatOrange-3 before:bg-wechatOrange-3",
				(transferStatus === "accepted" || transferStatus === "rejected") &&
					"bg-wechatOrange-5 before:bg-wechatOrange-5",
				transferStatus === "expired" && "bg-wechatOrange-5 before:bg-wechatOrange-5 saturate-60",
			)}
		>
			<div className="flex flex-col pl-1 text-white">
				<div className="flex flex-1 items-center pb-2">
					<SVGComp fill="white" width={40} height={40} className="-ml-1 flex-shrink-0" />
					<div className="ml-2 min-w-0 overflow-hidden text-left">
						<div className="font-normal text-base leading-5">¥{amount}</div>
						<div className="mt-1 line-clamp-1 font-normal text-xs leading-4">
							{getTransferNote()}
						</div>
					</div>
				</div>
				<span className="pt-1 font-light text-xs">微信转账</span>
			</div>
		</CommonBlock>
	);
};

export default memo(Transfer);
