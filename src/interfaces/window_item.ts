import { iTabItem } from "./tab_item"

interface iWindowItem {
    id: number,
    tabs: Array<iTabItem>,
    onDelete?: (id: number) => void, 
    tabsCol?: number,
    initExpand?: boolean,
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