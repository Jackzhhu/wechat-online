import { h } from "@/components/HashAssets";
import { canBeDetected } from "@/components/NodeDetected";
import TopOperations from "@/components/TopOperations";
import { MYSELF_ID } from "@/faker/user";
import {
	EConversationType,
	type IConversationTypeText,
	conversationItemReferenceAtom,
	conversationListAtom,
} from "@/stateV2/conversation";
import { EMetaDataType, activatedNodeAtom } from "@/stateV2/detectedNode";
import { getModeValueSnapshot } from "@/stateV2/mode";
import SlateText from "@/wechatComponents/SlateText";
import UserName from "@/wechatComponents/User/UserName";
import { AimOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useAtomValue, useSetAtom } from "jotai";
import { memo } from "react";
import { useConversationAPI } from "../../context";

type Props = {
	referenceId: IConversationTypeText["referenceId"];
	conversationItemId: IConversationTypeText["id"];
};

const TextReference = ({ referenceId, conversationItemId }: Props) => {
	const { conversationId, isGroupChat } = useConversationAPI();
	const referenceData = useAtomValue(
		conversationItemReferenceAtom({
			friendId: conversationId,
			conversationId: referenceId!,
		}),
	);
	const setConversationList = useSetAtom(conversationListAtom(conversationId));
	const setActivatedNode = useSetAtom(activatedNodeAtom);

	if (!referenceData) return null;

	const { role, type } = referenceData;
	const senderId = referenceData.senderId ?? (role === "friend" ? conversationId : MYSELF_ID);

	const renderBlockElement = () => {
		switch (type) {
			case EConversationType.text: {
				const { textContent } = referenceData;
				return (
					<SlateText
						content={textContent}
						classNames={{
							base: "inline",
							emojiClassName: "h-5 w-5 text-sm origin-top-left scale-85 mx-[1px]",
							emojiInnerClassName: "mx-0",
							textClassName: "inline",
						}}
					/>
				);
			}
			case EConversationType.image:
				return (
					<h.img
						src={referenceData.imageInfo}
						className="inline-block h-9 w-9 rounded object-cover object-center align-middle"
					/>
				);
			case EConversationType.video:
				return <span>[视频]</span>;
			case EConversationType.voice:
				return <span>[语音] {referenceData.duration}秒</span>;
			case EConversationType.transfer:
				return <span>微信转账</span>;
			case EConversationType.redPacket:
				return <span>[红包] {referenceData.note || "恭喜发财，大吉大利"}</span>;
			case EConversationType.personalCard:
				return <span>[个人名片] {referenceData.nickname}</span>;
			case EConversationType.file:
				return <span>[文件] {referenceData.fileData.fileName}</span>;
			case EConversationType.centerText:
				return <span>{referenceData.simpleContent}</span>;
			case EConversationType.redPacketAcceptedReply:
				return <span>[红包领取消息]</span>;
			default:
				return <span>[消息]</span>;
		}
	};

	return (
		<canBeDetected.div
			className="mt-2 ml-[52px] max-w-[85%] cursor-pointer border-[#E7E7E7] border-l-2 pl-2 text-[#AFAFB5] text-sm group-[.mine]:mr-[52px] group-[.mine]:ml-auto group-[.mine]:border-r-2 group-[.mine]:border-l-0 group-[.mine]:pr-2 group-[.mine]:pl-0 group-[.mine]:text-right"
			metaData={[
				{
					type: EMetaDataType.ConversationItem,
					index: [conversationId, referenceId!],
					treeItemDisplayName: "引用消息",
					label: "编辑引用消息",
					operations: [
						{
							element: (
								<TopOperations.OperaionDeleteBase
									tooltipProps={{ title: "移除引用消息（不删除原始的被引用消息）" }}
								/>
							),
							onClick: () => {
								setConversationList((prev) =>
									prev.map((v) =>
										v.id === conversationItemId ? { ...v, referenceId: undefined } : v,
									),
								);
							},
						},
						{
							element: (
								<Tooltip title="定位到原始消息">
									<AimOutlined />
								</Tooltip>
							),
							onClick: () => {
								const target = document.querySelector(`[data-conversation-id="${referenceId}"]`);
								const id = target?.getAttribute("id");
								if (id) {
									target!.scrollIntoView({ behavior: "smooth" });
									setActivatedNode(id);
								}
							},
						},
					],
				},
				...(senderId === MYSELF_ID
					? [{ type: EMetaDataType.MyProfile as const, label: "个人信息" }]
					: [
							{
								type: EMetaDataType.FirendProfile as const,
								index: senderId,
								label: isGroupChat ? "群成员个人信息" : "好友个人信息",
							},
						]),
			]}
			onClick={() => {
				if (getModeValueSnapshot() === "edit") return;
				document
					.querySelector(`[data-conversation-id="${referenceId}"]`)
					?.scrollIntoView({ behavior: "smooth" });
			}}
		>
			<div className="float-left inline">
				<UserName id={senderId} className="inline text-[#AFAFB5]" />
				<span>：</span>
			</div>
			{renderBlockElement()}
		</canBeDetected.div>
	);
};

export default memo(TextReference);
