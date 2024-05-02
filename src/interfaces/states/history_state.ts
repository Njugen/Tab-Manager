interface iHistoryState {
	tabs: Array<chrome.history.HistoryItem>;
	markedTabs: Array<chrome.history.HistoryItem>;
	tabSortOptionId: number;
	viewMode: "list" | "grid";
	expanded: boolean;
}

export default iHistoryState;
