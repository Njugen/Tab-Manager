interface iHistoryTabGroup {
	tabs: Array<chrome.history.HistoryItem>;
	timeSince: string;
}

export default iHistoryTabGroup;
