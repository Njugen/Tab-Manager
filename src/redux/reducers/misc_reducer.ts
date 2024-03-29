import { IS_EDITING_TAB } from "../types/in_edit_folders_types";
import { CURRENTLY_EDITING_TAB } from "../types/misc_types";

const miscStates = {
    isEditingTabs: 0,
    currentlyEditingTab: false
}

function miscReducer(state = miscStates, action: any){
    const { type, data } = action;    

    if(type === IS_EDITING_TAB){
        return {
            ...miscStates,
            isEditingTabs: data
        }
    } else if(type === CURRENTLY_EDITING_TAB){
        return {
            ...miscStates,
            currentlyEditingTab: data
        }
    }

    return state;
}

export {
    miscReducer
}