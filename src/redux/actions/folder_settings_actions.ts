import { SET_MARKED_WORKSPACES_ID, 
    SET_MULTIPLE_MARKED_WORKSPACES_ID, 
    CLEAR_ALL_MARKED_WORKSPACES_ID,
    SET_WORKSPACES_SORT_ORDER,
    CHANGE_WORKSPACES_VIEWMODE,

} from "../types/folder_space_settings_types";

function setMarkedFoldersAction(input: number){
    return {
        type: SET_MARKED_WORKSPACES_ID,
        data: input
    }
}

function setMarkMultipleFoldersAction(input: Array<number>){
    return {
        type: SET_MULTIPLE_MARKED_WORKSPACES_ID,
        data: input
    }
}

function clearMarkedFoldersAction(){
    return {
        type: CLEAR_ALL_MARKED_WORKSPACES_ID,
        data: null
    }
}

function setFoldersSortOrder(input: string){
    return {
        type: SET_WORKSPACES_SORT_ORDER,
        data: input
    }
}

function changeFoldersViewMode(input: "list" | "grid"){
    return {
        type: CHANGE_WORKSPACES_VIEWMODE,
        data: input
    }
}

export {
    setMarkedFoldersAction,
    setMarkMultipleFoldersAction,
    clearMarkedFoldersAction,
    setFoldersSortOrder,

    changeFoldersViewMode
}