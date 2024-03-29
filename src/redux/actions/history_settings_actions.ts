import { iFolderItem } from "../../interfaces/folder_item";
import { iTabItem } from "../../interfaces/tab_item";
import { 
    SET_MARKED_TABS, 
    SET_MULTIPLE_MARKED_TABS, 
    CLEAR_ALL_MARKED_TABS,
    SET_TABS_SORT_ORDER,
    SET_UP_TABS,

    CHANGE_TABS_VIEWMODE
} from "../types/history_settings_types";

function setUpTabsAction(input: Array<chrome.history.HistoryItem>){
    return {
        type: SET_UP_TABS,
        data: input
    }
}

function setMarkedTabsAction(input: chrome.history.HistoryItem){
    return {
        type: SET_MARKED_TABS,
        data: input
    }
}

function setMarkMultipleTabsAction(input: Array<chrome.history.HistoryItem>){
    return {
        type: SET_MULTIPLE_MARKED_TABS,
        data: input
    }
}

function clearMarkedTabsAction(){
    return {
        type: CLEAR_ALL_MARKED_TABS,
        data: null
    }
}

function setTabsSortOrder(input: number){
    return {
        type: SET_TABS_SORT_ORDER,
        data: input
    }
}

function changeTabsViewMode(input: "list" | "grid"){
    return {
        type: CHANGE_TABS_VIEWMODE,
        data: input
    }
}

export {
    setUpTabsAction,
    setMarkedTabsAction,
    setMarkMultipleTabsAction,
    clearMarkedTabsAction,
    setTabsSortOrder,

    changeTabsViewMode
}