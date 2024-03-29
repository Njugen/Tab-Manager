import iCurrentSessionState from "../../interfaces/states/current_session_state";
import { 
    SET_UP_WINDOWS,
    SET_CURRENT_TABS_SORT_ORDER,
    DELETE_MARKED_CURRENT_TABS_ID,
} from "../types/current_session_settings_types";


const sessionSectionState: iCurrentSessionState = {
    windows: [],
    markedWindows: [],
    markedTabs: [],
    tabsSort: "asc",
    viewMode: "grid"
}

function sessionSectionReducer(state = sessionSectionState, action: any) {
    const { type, data } = action;

    if(type === SET_UP_WINDOWS){
        return {
            ...state,
            windows: data
        }
    } else if(type === SET_CURRENT_TABS_SORT_ORDER) {
        return {
            ...state,
            tabsSort: data
        }
    } else if(type === DELETE_MARKED_CURRENT_TABS_ID){

    } else {
        return state;
    }
}

export { sessionSectionReducer }