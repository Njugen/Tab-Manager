import { iTabItem } from "./tab_item"
import tBrowserTabId from "./types/browser_tab_id";

interface iWindowItem {
    id: number,
    tabs: Array<iTabItem>,
    onDelete?: (id: number) => void, 
    onDeleteTabs?: (ids: Array<tBrowserTabId>) => void,
    tabsCol?: number,
    disableMark?: boolean,
    disableEdit?: boolean,
    disableMarkTab?: boolean,
    disableEditTab?: boolean,
    disableDeleteTab?: boolean,
    disableAddTab?: boolean
}

export {
    iWindowItem
};