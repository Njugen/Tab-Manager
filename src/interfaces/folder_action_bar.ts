import { iWindowItem } from "./window_item";
import { iFolderItem } from "./folder_item";
import tLaunchBehavior from "./types/launch_behavior";

interface iFolderActionBarHandlers {
    handleExpandClick: (e: any) => void,
    handlePrepareOpen: (e: any) => void,
    handleEdit: (e: any) => void,
    handleDelete: (e: any) => void,
    handleLaunch: (e: any) => void,
    onOpen?: (e: Array<iWindowItem>, type: tLaunchBehavior) => void,
    onMark?: (e: number) => void,
    onEdit?: (e: number) => void
    onDelete?: (e: iFolderItem) => void,
}

interface iFolderActionBarStates {
    isExpanded: boolean,
    showLaunchOptions: boolean,
    marked: boolean,
    id: number
}

interface iFolderActionBarProps{
    states: iFolderActionBarStates,
    handlers: iFolderActionBarHandlers
}

export { iFolderActionBarHandlers, iFolderActionBarStates, iFolderActionBarProps }