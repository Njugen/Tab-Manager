import { SHOW_FOLDER_CHANGE_WARNING, SHOW_SINGLE_FOLDER_REMOVAL_WARNING, SHOW_MULTIFOLDER_REMOVAL_WARNING } from "../types/warning_actions_types";


function setShowFolderChangeWarning(input: boolean) {
    return {
        type: SHOW_FOLDER_CHANGE_WARNING,
        data: input
    }
}

function setShowSingleFolderRemovalWarning(input: boolean){
    return {
        type: SHOW_SINGLE_FOLDER_REMOVAL_WARNING,
        data: input
    }
}

function setShowMultiFolderRemovalWarning(input: boolean){
    return {
        type: SHOW_MULTIFOLDER_REMOVAL_WARNING,
        data: input
    }
}


export {
    setShowFolderChangeWarning,
    setShowSingleFolderRemovalWarning,
    setShowMultiFolderRemovalWarning
}
