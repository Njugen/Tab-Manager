import CollapseIcon from "../../../icons/collapse_icon"
import RotationEffect from "../../../effects/rotation_effect"
import FolderControlButton from "../../../utils/icon_button/icon_button"

import { iFolderItem } from "../../../../interfaces/folder_item"
import { iWindowItem } from "../../../../interfaces/window_item"
import OpenBrowserIcon from "../../../icons/open_browser_icon"
import TrashIcon from "../../../icons/trash_icon"
import SettingsIcon from "../../../icons/settings_icon"
import Checkbox from "../../../utils/checkbox"
import DropdownMenu from "../../../utils/dropdown_menu/dropdown_menu"
import { iFieldOption } from "../../../../interfaces/dropdown"

interface IFolderActionBarHandlers {
    handleExpandClick: (e: any) => void,
    handleOpen: (e: any) => void,
    handleEdit: (e: any) => void,
    handleDelete: (e: any) => void,
    handleLaunch: (e: any) => void,
    onOpen?: (e: Array<iWindowItem>, type: string) => void,
    onMark?: (e: number) => void,
    onEdit?: (e: number) => void
    onDelete?: (e: iFolderItem) => void,
}

interface IFolderActionBarStates {
    expanded: boolean,
    showLaunchOptions: boolean,
    marked: boolean,
    id: number
}

interface IRenderActionBarProps {
    states: IFolderActionBarStates,
    handlers: IFolderActionBarHandlers
}

// List of all options on how to launch this folder. The id identifies the option, and
// actions are performed accordingly.
const launchOptions: Array<iFieldOption> = [
    {
        id: 0,
        label: "Open"
    },
    {
        id: 1,
        label: "Open as group"
    },
    {
        id: 2,
        label: "Open in incognito"
    }
] 

// Renders an action bar containing various UI buttons for handling the behaviour of the folder.
const FolderActionBar = (props: IRenderActionBarProps): JSX.Element => {
    const { states, handlers } = props;
    const { expanded, showLaunchOptions, marked, id } = states;
    const {
        handleExpandClick,
        handleOpen,
        handleEdit,
        handleDelete,
        handleLaunch,
        onOpen,
        onMark,
        onEdit,
        onDelete
    } = handlers;

    let openButton: JSX.Element | null = null
    let editButton: JSX.Element | null = null
    let deleteButton: JSX.Element | null = null
    let checkbox: JSX.Element | null = null
    let expand_collapse_button: JSX.Element | null = (
        <FolderControlButton id={expanded ? "collapse" : "expand"} active={true} onClick={handleExpandClick}>
            <RotationEffect rotated={expanded}>
                <CollapseIcon size={28} fill={"#000"} />
            </RotationEffect>
        </FolderControlButton>
    );

    if(onOpen){
        openButton = (
            <FolderControlButton id="open_browser" active={true} onClick={handleOpen}>
                <OpenBrowserIcon size={17} fill={"#000"} />
            </FolderControlButton>
        );
    }
    if(onEdit){
        editButton = (
            <FolderControlButton id="settings" active={true} onClick={handleEdit}>
                <SettingsIcon size={17} fill={"#000"} />
            </FolderControlButton>
        );
    }
    if(onDelete){
        deleteButton = (
            <FolderControlButton id="trash" active={true} onClick={handleDelete}>
                <TrashIcon size={17} fill={"#000"} />
            </FolderControlButton>
        );
    }
    if(onMark){
        checkbox = <Checkbox checked={marked} onCallback={(e) => onMark!(id)} />;
    }

    let result = (
        <div className="absolute flex items-center right-4">
            { 
                showLaunchOptions === true && 
                <div className={"w-[200px] absolute mt-12 right-10"}>
                    <DropdownMenu 
                        selected={null} 
                        tag={"folder-control-dropdown"} 
                        onSelect={handleLaunch} 
                        options={launchOptions} 
                    />
                </div>
            }
            {openButton}
            {editButton}
            {deleteButton}
            {expand_collapse_button}
            {checkbox}
        </div>
    );

    return result;
}

export { 
    FolderActionBar,
    IFolderActionBarHandlers,
    IFolderActionBarStates
};