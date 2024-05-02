import { iTabItem } from "./tab_item";
import tBrowserTabId from "./types/browser_tab_id";

interface iEditableTabItem {
	windowId: number;
	id?: tBrowserTabId;
	preset?: string;
	onStop: () => void;
}

export { iEditableTabItem };
