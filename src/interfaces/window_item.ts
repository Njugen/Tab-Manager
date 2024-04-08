import { iTabItem } from "./tab_item"

interface iWindowItem {
    id: number,
    tabs: Array<iTabItem>,
    tabsCol?: number,
    initExpand?: boolean,
    disableMark?: boolean,
    disableEdit?: boolean,
    disableTabMark?: boolean,
    disableTabEdit?: boolean,
    disableTabDelete?: boolean,
    disableAddTab?: boolean
}

export {
    iWindowItem
};