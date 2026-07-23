import { MOBILE_LIST, SCREEN_SIZE, deviceAtom } from "@/stateV2/device";
import { useSize } from "ahooks";
import { useAtomValue } from "jotai";

export default function useDeviceConfig() {
	const device = useAtomValue(deviceAtom);
	const size = useSize(() => document.querySelector("#center"));
	let screenSize: {
		width: number;
		height: number;
	};
	if (device === MOBILE_LIST.AUTO) {
		// 自动模式跟随中间预览区域变化。顶部需要为模式切换浮层预留空间，
		// 预览屏幕靠下放置，因此无需在底部重复保留同样高度的空白。
		const horizontalGutter = 30;
		const verticalGutter = 72;
		screenSize = {
			width: Math.max(0, (size?.width ?? 0) - horizontalGutter),
			height: Math.max(0, (size?.height ?? 0) - verticalGutter),
		};
	} else {
		screenSize = SCREEN_SIZE[device];
	}

	return {
		screenSize,
		device,
	};
}
