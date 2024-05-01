import tLaunchBehavior from "./types/launch_behavior";
import tFolderdisplay from "./types/folder_display";
import { iWindowItem } from "./window_item";

interface iFolderItem {
    id: number,
    name: string,
    desc: string,
    marked: boolean,
    display: tFolderdisplay,
    viewMode: "list" | "grid",
    windows: Array<iWindowItem>,
    index?: number,
    onOpen?: (e: Array<iWindowItem>, type: tLaunchBehavior) => void,
    onMark?: (e: number) => void,
    onEdit?: (e: number) => void
    onDelete?: (e: iFolderItem) => void
}


export { iFolderItem };