import iWarningState from "../../interfaces/states/warning_state";
import { SHOW_FOLDER_CHANGE_WARNING, SHOW_SINGLE_FOLDER_REMOVAL_WARNING, SHOW_MULTIFOLDER_REMOVAL_WARNING } from "../types/warning_actions_types";

const warningActionsState: iWarningState = {
    showFolderChangeWarning: false,
    showSingleFolderRemovalWarning: false,
    showMultiFolderRemovalWarning: false
};

function WarningActionsReducer(state = warningActionsState, action: any) {
    const { type, data } = action;

    if(type === SHOW_FOLDER_CHANGE_WARNING){
        return {
            ...state,
            showFolderChangeWarning: data
        }
    } else if (type === SHOW_SINGLE_FOLDER_REMOVAL_WARNING){
        return {
            ...state,
            showSingleFolderRemovalWarning: data
        }
    } else if (type === SHOW_MULTIFOLDER_REMOVAL_WARNING){
        return {
            ...state,
            showMultiFolderRemovalWarning: data
        }
    } else {
        return state;
    }
}

export { WarningActionsReducer }