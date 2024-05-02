import tBrowserTabId from "./types/browser_tab_id";

interface iTabItem {
	id: tBrowserTabId;
	label: string;
	url: string;
	windowId?: number;
	marked?: boolean;
	onMark?: (tabId: tBrowserTabId, checked: boolean) => void | undefined;
	onEdit?: (tabId: tBrowserTabId) => void | undefined;
	onClose?: (e?: any) => any | undefined;
}

export { iTabItem };
