import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import ClosedFolderIcon from "../../icons/closed_folder_icon";
import Paragraph from "../../utils/paragraph";
import OpenedFolderIcon from "../../icons/opened_folder_icon";
import "../../../styles/global_utils.module.scss";
import { iFolderItem } from "../../../interfaces/folder_item";
import {  useSelector } from "react-redux";
import { FolderActionBar } from "./components/folder_action_bar";
import { getFromStorage, saveToStorage } from "../../../services/webex_api/storage";
import iFolderState from '../../../interfaces/states/folder_state';
import WindowItem from "../window_item";
import { iFolderActionBarHandlers } from "../../../interfaces/folder_action_bar";
import { iFolderActionBarStates } from "../../../interfaces/folder_action_bar";

/*
    Folder section containing description, windows and tabs, as well as various folder options
*/
const FolderItem = (props: iFolderItem): JSX.Element => {
    const contentsRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const folderRef = useRef<HTMLLIElement>(null);
    const [expanded, setExpanded] = useState<boolean>(props.type === "expanded" ? true : false);
    const [showLaunchOptions, setShowLaunchOptions] = useState<boolean>(false);
    const [slideDown, setSlideDown] = useState<boolean>(false);

    const folderSettingsState: iFolderState = useSelector((state: any) => state.folderSettingsReducer);

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

    //useEffect(() => toggleExpand(type), []);
    
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
    
    const expHeaderCSS: string = `relative border-b tbf-${type} bg-white px-4 h-10 py-6 flex items-center rounded-t-md`;
    const colHeaderCSS: string = `relative tbf-${type} bg-white px-4 h-10 py-6 flex items-center rounded-md`;

    const expContentsCSS: string = `overflow-hidden bg-white rounded-b-md border-t-0`;
    const colContentsCSS: string = `overflow-hidden rounded-b-md`;

    // Update the storage state of folder view mode 
    const updateFolder = (newType: "expanded" | "collapsed") => {
        getFromStorage("local", "folders", (data: any) => {
            const tempCollection: Array<iFolderItem> = data.folders.map((folder: iFolderItem) => {
                if(folder.id === id) folder.type = newType;
                return folder;
            })
       
            saveToStorage("local", "folders", tempCollection);
        })
    }

    // Decide whether or not the folder shows its contents or not.
    const toggleExpand = (init?: string): void => {
        if(expanded === false){
            if(init === "expanded" || !init){
                updateFolder("expanded");
                setExpanded(true);
            } else {
                //col();
                updateFolder("collapsed");
                setExpanded(false);
            }
        } else {
            //col()
            updateFolder("collapsed");
            setExpanded(false);
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


    const actionBarHandlers: iFolderActionBarHandlers = { handleExpandClick, handleOpen, handleEdit, handleDelete, handleLaunch, onOpen, onEdit, onDelete, onMark };
    const actionBarStates: iFolderActionBarStates = { expanded, showLaunchOptions, marked, id };
    
    const windowTabsCols = (folderViewMode: string, windowViewMode: string): number => {
        if(folderViewMode === "grid"){
            return 1;
        } else {
            if(windowViewMode === "list"){
                return 4;
            } else {
                return 2;
            }
        }
    }

    // Render a list of all windows in the folder. The window components are adjusted to suit folder behaviour
    const folderWindowList = useMemo((): JSX.Element => {
        const decisiveCols: number = windowTabsCols(folderSettingsState.viewMode, viewMode);
    
        const result: Array<JSX.Element> = windows.map((window, index): JSX.Element => (
            <WindowItem 
                tabsCol={decisiveCols} 
                disableMarkTab={true} 
                disableEditTab={true} 
                key={"window-" + index} 
                id={window.id} 
                tabs={window.tabs} 
            />
        ));
    
        return <>{result}</>;
    }, [windows, viewMode])

    return (
        <>
            <li 
                ref={folderRef} 
                data-testid={"folder-item"} 
                className={`shadow-[0_0px_3px_1px_rgba(0,0,0,0.125)] ${viewMode === "list" ? "my-4 duration-75" : "my-4 duration-75"} sticky transition-all ease-in w-full rounded-md`}
            >
                <div ref={headerRef} className={expanded === true ? expHeaderCSS : colHeaderCSS}>
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
                <div ref={contentsRef} className={expanded === true ? expContentsCSS : colContentsCSS}>
                {expanded === true && (
                    <>{desc.length > 0 && <div className="px-5 mt-8 flex justify-between items-start">
                    <div data-testid={"description-section"} className="inline-block w-fit">
                            <Paragraph>
                                {desc}
                            </Paragraph>
                        </div>
                    </div>}
                    
                    <ul className="px-5 mb-8 mt-8">
                        {folderWindowList}
                    </ul></>
                    )}
                </div>
                
            </li>
        </>
    );
}

export default FolderItem;