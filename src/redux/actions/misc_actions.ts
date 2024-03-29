import { 
    IS_EDITING_TAB,
    CURRENTLY_EDITING_TAB
} from "../types/misc_types";

function setTabInEdits(value: number){
    return {
        type: IS_EDITING_TAB,
        data: value
    }
}

function setCurrentlyEditingTab(value: boolean){
    return {
        type: CURRENTLY_EDITING_TAB,
        data: value
    }
}

export {
    setTabInEdits,
    setCurrentlyEditingTab
}