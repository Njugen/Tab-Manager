import { iTabItem } from "./tab_item"

interface iWindowItem {
    id: number,
    tabs: Array<iTabItem>,
    onDelete?: (id: number) => void, 
    onDeleteTabs?: (ids: Array<number>) => void,
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