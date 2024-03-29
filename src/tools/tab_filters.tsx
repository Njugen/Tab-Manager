import iCurrentSessionState from "../interfaces/states/current_session_state";
import iHistoryState from "../interfaces/states/history_state";
import { iFolderItem } from "../interfaces/folder_item";

const filterSessionTabsByString = (arr: iCurrentSessionState, keyword: string): Array<chrome.tabs.Tab> => {
    let collection: Array<chrome.tabs.Tab> = [];

    arr.windows.forEach((window: chrome.windows.Window) => {
        collection = collection.concat(window.tabs!);
    });

    const result: Array<chrome.tabs.Tab> = collection.filter((tab: chrome.tabs.Tab) => tab.title && tab.title.toLowerCase().includes(keyword.toLowerCase()));
    return result.slice(0,5);
}

const filterHistoryTabsByString = (arr: iHistoryState, keyword: string): Array<chrome.history.HistoryItem> => {
    const result =  arr.tabs.filter((tab: chrome.history.HistoryItem) => tab.title!.toLowerCase().includes(keyword.toLowerCase()));
    return result.slice(0,5);
}

const filterFoldersByString = (arr: Array<iFolderItem>, keyword: string): Array<iFolderItem> => {
    const result =  arr.filter((folder: iFolderItem) => folder.name.toLowerCase().includes(keyword.toLowerCase()));
    return result.slice(0,5);
}

export {
    filterSessionTabsByString,
    filterHistoryTabsByString,
    filterFoldersByString
}