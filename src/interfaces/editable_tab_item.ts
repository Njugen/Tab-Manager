import { iTabItem } from "./tab_item";

interface iEditableTabItem {
    windowId: number,
    id?: number | string,
    preset?: string,
    onStop: () => void
}

export {
    iEditableTabItem
};