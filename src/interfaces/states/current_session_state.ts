interface iCurrentSessionState {
    windows: Array<chrome.windows.Window>
    markedWindows: Array<chrome.windows.Window>
    markedTabs: Array<chrome.tabs.Tab>,
    tabsSort: string,
    viewMode: "list" | "grid",
}

export default iCurrentSessionState;