import { iWindowItem } from "./window_item";
import { iFolderItem } from "./folder_item";
import tLaunchType from "./types/launch_type";

interface iFolderActionBarHandlers {
    handleExpandClick: (e: any) => void,
    handlePrepareOpen: (e: any) => void,
    handleEdit: (e: any) => void,
    handleDelete: (e: any) => void,
    handleLaunch: (e: any) => void,
    onOpen?: (e: Array<iWindowItem>, type: tLaunchType) => void,
    onMark?: (e: number) => void,
    onEdit?: (e: number) => void
    onDelete?: (e: iFolderItem) => void,
}

interface iFolderActionBarStates {
    expanded: boolean,
    showLaunchOptions: boolean,
    marked: boolean,
    id: number
}

interface iFolderActionBarProps{
    states: iFolderActionBarStates,
    handlers: iFolderActionBarHandlers
}

export { iFolderActionBarHandlers, iFolderActionBarStates, iFolderActionBarProps }