interface iHistoryState {
    tabs: Array<chrome.history.HistoryItem>
    markedTabs: Array<chrome.history.HistoryItem>
    tabSortOptionId: number,
    viewMode: "list" | "grid",
}

export default iHistoryState;