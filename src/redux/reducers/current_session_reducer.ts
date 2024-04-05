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

const sessionSectionReducer = (state = sessionSectionState, action: any): iCurrentSessionState => {
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
        return {
            ...state,
        }
    } else {
        return state;
    }
}

export { sessionSectionReducer }