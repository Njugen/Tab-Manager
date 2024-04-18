import iCurrentSessionState from "./states/current_session_state";
import iHistoryState from "./states/history_state";
import { iWindowItem } from "./window_item";
import { iFolderItem } from "./folder_item";

interface iSearchResultsProps {
    keyword: string,
    launchFolder: (windows: Array<iWindowItem>, type: string) => void,
    folders: Array<iFolderItem>, 
    session: iCurrentSessionState, 
    history: iHistoryState
}

export default iSearchResultsProps;