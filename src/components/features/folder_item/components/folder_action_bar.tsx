import CollapseIcon from "../../../icons/collapse_icon"
import RotationEffect from "../../../effects/rotation_effect"
import OpenBrowserIcon from "../../../icons/open_browser_icon"
import TrashIcon from "../../../icons/trash_icon"
import SettingsIcon from "../../../icons/settings_icon"
import Checkbox from "../../../utils/checkbox"
import DropdownMenu from "../../../utils/dropdown_menu/dropdown_menu"
import { iFieldOption } from "../../../../interfaces/dropdown"
import { iFolderActionBarProps } from "../../../../interfaces/folder_action_bar"
import styles from "../../../../styles/global_utils.module.scss";
import { useMemo, useState } from "react"



// Renders an action bar containing various UI buttons for handling the behaviour of the folder.
const FolderActionBar = (props: iFolderActionBarProps): JSX.Element => {
    const [launchOptions, setLaunchOptions] = useState<Array<iFieldOption>>([]);
    const { states, handlers } = props;
    const { expanded, showLaunchOptions, marked, id } = states;
    const { opacity_hover_effect } = styles;

    useMemo(() => {
        const options: Array<iFieldOption> = [
            {
                value: 0,
                label: "Open"
            }
        ]

        if(chrome.tabs.group !== undefined){
            options.push({
                value: 1,
                label: "Open as group"
            });
        } 
        
        chrome.extension.isAllowedIncognitoAccess((access: boolean) => {
            if(access){
                options.push({
                    value: 2,
                    label: "Open in incognito"
                });
            }
        })
        
        setLaunchOptions(options);
    }, [])

    const {
        handleExpandClick,
        handlePrepareOpen,
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
        <button id={expanded ? "collapse" : "expand"} className={`mx-2 ${opacity_hover_effect}`} disabled={false} onClick={handleExpandClick}>
            <RotationEffect rotated={expanded}>
                <CollapseIcon size={28} fill={"#000"} />
            </RotationEffect>
        </button>
    );

    // Show certain options depending on whether or not the folder permits those features
    if(onOpen){
        openButton = (
            <button id="open_browser" disabled={false} className={`mx-2 ${opacity_hover_effect}`} onClick={handlePrepareOpen}>
                <OpenBrowserIcon size={17} fill={"#000"} />
            </button>
        );
    }
    if(onEdit){
        editButton = (
            <button id="settings" disabled={false} className={`mx-2 ${opacity_hover_effect}`}  onClick={handleEdit}>
                <SettingsIcon size={17} fill={"#000"} />
            </button>
        );
    }
    if(onDelete){
        deleteButton = (
            <button id="trash" disabled={false} className={`mx-2 ${opacity_hover_effect}`}  onClick={handleDelete}>
                <TrashIcon size={17} fill={"#000"} />
            </button>
        );
    }
    if(onMark){
        checkbox = <Checkbox checked={marked} onCallback={(e) => onMark!(id)} />;
    }

    let result = (
        <div className="absolute flex items-center right-4">
            { 
                showLaunchOptions === true && 
                <div data-testid={"open-folder-options"} className={"w-[200px] absolute mt-12 right-10"}>
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
    FolderActionBar
};