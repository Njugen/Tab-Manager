import { iFolderItem } from "../../interfaces/folder_item";
import { 
    SET_UP_WINDOWS,
    SET_CURRENT_TABS_SORT_ORDER,
    SET_MARKED_CURRENT_TABS_ID
} from "../types/current_session_settings_types";

function setUpWindowsAction(input: Array<chrome.windows.Window>){
    return {
        type: SET_UP_WINDOWS,
        data: input
    }
}

function setCurrentTabsSortOrder(input: string){
    return {
        type: SET_CURRENT_TABS_SORT_ORDER,
        data: input
    }
}

function setMarkMultipleTabsAction(input: Array<chrome.tabs.Tab>){
    return {
        type: SET_MARKED_CURRENT_TABS_ID,
        data: input
    }
}

export {
    setUpWindowsAction,
    setCurrentTabsSortOrder,
    setMarkMultipleTabsAction
}