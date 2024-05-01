import tLaunchType from "./types/launch_type";
import { iWindowItem } from "./window_item";

interface iFolderItem {
    id: number,
    name: string,
    desc: string,
    marked: boolean,
    type: "expanded" | "collapsed",
    viewMode: "list" | "grid",
    windows: Array<iWindowItem>,
    index?: number,
    onOpen?: (e: Array<iWindowItem>, type: tLaunchType) => void,
    onMark?: (e: number) => void,
    onEdit?: (e: number) => void
    onDelete?: (e: iFolderItem) => void
}


export { iFolderItem };