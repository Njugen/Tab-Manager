interface iHistoryTabGroupsSection {
    viewMode: "grid" | "list",
    tabs: Array<chrome.history.HistoryItem>
}

export default iHistoryTabGroupsSection