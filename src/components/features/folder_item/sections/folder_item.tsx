import { useRef, useState, useEffect, useCallback } from "react";
import ClosedFolderIcon from "../../../../images/icons/closed_folder_icon";
import Paragraph from "../../../utils/paragraph";
import OpenedFolderIcon from "../../../../images/icons/opened_folder_icon";
import "../../../../styles/global_utils.module.scss";
import { iFolderItem } from "../../../../interfaces/folder_item";
import { useSelector } from "react-redux";
import iWorkspaceState from "../../../../interfaces/states/workspaceState";
import { FolderActionBar, IFolderActionBarHandlers, IFolderActionBarStates } from "./folder_action_bar";
import FolderWindowList from "../folder_window_list";

/*
    Folder containing description, windows and tabs, as well as various folder options
*/

const FolderItem = (props: iFolderItem): JSX.Element => {
    const contentsRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const folderRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState<boolean>(false);
    const [showLaunchOptions, setShowLaunchOptions] = useState<boolean>(false);
    const [slideDown, setSlideDown] = useState<boolean>(false);

    const workspaceSettings: iWorkspaceState = useSelector((state: any) => state.WorkspaceSettingsReducer);
    
    const { 
        id,
        name,
        marked,
        desc,
        type,
        viewMode,
        windows,
        index,
        onOpen,
        onMark,
        onDelete,
        onEdit 
    } = props;

    useEffect(() => toggleExpand(type), []);
    
    useEffect(() => {
        // Listen for clicks in the viewport. If the options list is visible, then hide it once
        // anything is clicked
        if(slideDown === true){ 
            window.addEventListener("click", handleWindowClick);
        }
        
        return () => {
            window.removeEventListener("click", handleWindowClick);
        }
    }, [slideDown])

    useEffect(() => {
        if(index && folderRef.current) folderRef.current.style.zIndex = index.toString();
    }, [folderRef])

    // Show a list of options for how to launch this folder
    const handleShowLaunchOptionsMenu = useCallback((): void => {
        if(showLaunchOptions === false){
            setShowLaunchOptions(true);
            setTimeout(() => {
                setSlideDown(slideDown === true ? false : true);
            }, 200);
        } else {
            setSlideDown(false);
            setTimeout(() => {
                setShowLaunchOptions(false);
            }, 200);
        }
    }, [showLaunchOptions])
    
    const exp = (): void => {
        if(contentsRef.current === null || headerRef.current === null) return;

        headerRef.current.className = `relative border-b tbf-${type} bg-white px-4 h-10 py-6 flex items-center rounded-t-md`;
        contentsRef.current.className = "overflow-hidden bg-white rounded-b-md border-t-0";

        setExpanded(true);
    }

    const col = (): void => {
        if(contentsRef.current === null || headerRef.current === null) return;

        headerRef.current.className = `relative tbf-${type} bg-white px-4 h-10 py-6 flex items-center rounded-md`;
        contentsRef.current.className = "overflow-hidden rounded-b-md";
        setExpanded(false);
    }

    const toggleExpand = (init?: string): void => {
        if(expanded === false){
            if(init === "expanded" || !init){
                exp();
            } else {
                col();
            }
        } else {
            col()
        }   
    }

    // Expand or collapse this folder
    const handleExpandClick = (e: any): void => {
        toggleExpand();
    }

    // Prepare to open a folder: show launch options -> open folder accordingly
    const handleOpen = (): void => {
        setShowLaunchOptions(true);
        handleShowLaunchOptionsMenu();
    }

    // Launch a folder based on selected option
    const handleLaunch = (id: number): void => {
        let type: string = "";

        if(id === 0){
            type = "normal";
        } else if(id === 1){
            type = "group";
        } else if(id === 2){
            type = "incognito";
        }

        if(onOpen) {
            onOpen(windows, type);
        }

        setShowLaunchOptions(false);
        setSlideDown(false);
    }

   const handleWindowClick = (e: any): void => {
        e.stopPropagation();

        if(showLaunchOptions === true){
            setShowLaunchOptions(false);
            setSlideDown(false);
            handleShowLaunchOptionsMenu();
        }
    }

    const handleDelete = (): void => {
        if(onDelete) onDelete(props);
    }

    function handleEdit(e: any): void {
        if(onEdit) onEdit(e);
    } 


    const actionBarHandlers: IFolderActionBarHandlers = { handleExpandClick, handleOpen, handleEdit, handleDelete, handleLaunch, onOpen, onEdit, onDelete, onMark };
    const actionBarStates: IFolderActionBarStates = { expanded, showLaunchOptions, marked, id };
    
    return (
        <>
            <div 
                ref={folderRef} 
                data-testid={"folder-item"} 
                className={`shadow-[0_0px_3px_1px_rgba(0,0,0,0.125)] ${viewMode === "list" ? "my-4 duration-75" : "my-4 duration-75"} sticky transition-all ease-in w-full rounded-md`}
            >
                <div ref={headerRef}>
                    <div className="inline-block">
                        {expanded === false ? <ClosedFolderIcon size={23} fill={"#000"} /> : <OpenedFolderIcon size={26} fill={"#000"} />}
                    </div>
                    <div className={`inline-block ${viewMode === "list" ? "w-10/12" : "w-5/12"}`}>
                        <h2 className={`text-md p-2 truncate ${expanded === false ? "text-black" : "text-black"}`}>
                            {name}
                        </h2>
                    </div>
                    {<FolderActionBar handlers={actionBarHandlers} states={actionBarStates} />}
                </div>
                <div ref={contentsRef} className="max-h-2000 overflow-y-hidden bg-tbfColor-lighterpurple3">
                {expanded === true && (
                    <>{desc.length > 0 && <div className="px-5 mt-8 flex justify-between items-start">
                    <div data-testid={"description-section"} className="inline-block w-fit">
                            <Paragraph text={desc} />
                        </div>
                    </div>}
                    
                    <div className="px-5 mb-8 mt-8">
                        <FolderWindowList windows={windows} viewMode={workspaceSettings.viewMode} />
                    </div></>
                    )}
                </div>
                
            </div>
        </>
    );
}

export default FolderItem;