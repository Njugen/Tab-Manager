import { iFolderItem } from "../../interfaces/folder_item";
import { iTabItem } from "../../interfaces/tab_item";

import { 
    EDIT_FOLDER, 
    UPDATE_IN_EDIT_FOLDER, 
    CLEAR_IN_EDIT_FOLDER, 
    UPDATE_WINDOW_MANAGER 
} from "../types/in_edit_folders_types";

    
function initInEditFolder(folder: iFolderItem) {
    return {
        type: EDIT_FOLDER,
        data: folder
    }
}

function updateInEditFolder(key: string, value: any){
    return {
        type: UPDATE_IN_EDIT_FOLDER,
        data: [key, value]
    }
}

function clearInEditFolder(){
    return {
        type: CLEAR_IN_EDIT_FOLDER,
        data: null
    }
}

function updateWindowManager(windowId: number, payload: iTabItem){
    return {
        type: UPDATE_WINDOW_MANAGER,
        data: { windowId, payload }
    }
}

export {
    initInEditFolder,
    updateInEditFolder,
    clearInEditFolder,
    updateWindowManager,
}
