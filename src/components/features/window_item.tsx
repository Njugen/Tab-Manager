import { useState,  useId } from "react";
import GenericButton from "../utils/generic_button";
import PrimaryButton from "../utils/primary_button/primary_button";
import PurpleBorderButton from "../utils/purple_border_button";
import TabItem from "./tab_item";
import { iWindowItem} from "../../interfaces/window_item";
import EditableTabItem from "./editable_tab_item";
import { iTabItem } from "../../interfaces/tab_item";
import { useDispatch, useSelector } from "react-redux";
import { updateInEditFolder } from "../../redux/actions/in_edit_folder_actions";
//import { setcurrentlyEditingTab, setTabInEdits } from "../../redux/actions/misc_actions";
import TrashIcon from "../icons/trash_icon";
import CollapseIcon from "../icons/collapse_icon";
import ExpandIcon from "../icons/expand_icon";
import { iFolderItem } from "../../interfaces/folder_item";
import { useMemo } from "react";
import iFolderState from "../../interfaces/states/folder_state";
import { RootState } from "../../redux-toolkit/store";
import { setCurrentTabEdits, setIsEditingTab } from "../../redux-toolkit/slices/misc_slice";
import { updateFolder } from "../../redux-toolkit/slices/folder_management_slice";


/*
    Window containing tabs and various window related options. Used primarily
    in window managers within folder settings
*/

const WindowItem = (props: iWindowItem): JSX.Element => {
    const [expanded, setExpanded] = useState<boolean>(true);
    const [newTab, setNewTab] = useState<boolean>(false);
    const [editTab, setEditTab] = useState<number | null>(null);
    const [markedTabs, setMarkedTabs] = useState<Array<number>>([]);
    const { id, tabs, tabsCol, onDelete, onDeleteTabs, disableEdit, disableEditTab, disableMarkTab, disableDeleteTab, disableAddTab } = props;
    
    const dispatch = useDispatch();

    // Get information about the folder 
    //const folder_state: iFolderItem | null = useSelector((state: any) => state.folderManagerReducer);
    //const miscState: any = useSelector((state: any) => state.miscReducer);
    const folderManagementState: iFolderItem | null = useSelector((state: RootState) => state.folderManagement);
    const miscState: any = useSelector((state: RootState) => state.misc);

    // Expand or collapse a window (show/hide tabs within)
    const handleExpand = (): void => {
        setExpanded(expanded === true ? false : true);
    }

    // Delete this window from redux
    

    // Activate add new tab feature by setting state
    const handleAddNewTab = (): void => {
        if(editTab === null && miscState.currentlyEditingTab === false) {
            dispatch(setIsEditingTab(true));
            setNewTab(true);
        }
    }

    // Mark/unmark specific tab in this window
    const handleMarkTab = (tabId: number, checked: boolean): void => {
        if(checked === true){
            const findInState = markedTabs.findIndex((target) => target === tabId);
            if(findInState < 0){  
                setMarkedTabs([...markedTabs, tabId]);
            }
        } else {
            const filteredMarks = markedTabs.filter((id) => id !== tabId);
            setMarkedTabs([...filteredMarks]);
        }
       
    }

    // Delete marked tabs
    const handleDeleteTabs = (): void => {

        if(folderManagementState?.windows && folderManagementState.windows.length > 0){
        
            const windows = folderManagementState.windows.filter((target: iWindowItem) => target.id === id);
            const targetWindowIndex = folderManagementState?.windows.findIndex((target: iWindowItem) => target.id === id);
            const tabs = windows[0].tabs;
        
            const newTabCollection: Array<iTabItem> = [];

            if(tabs){
                tabs.forEach((tab: iTabItem) => {
                    const markedTabIndex = markedTabs.findIndex((target) => target === tab.id);
            
                    if(markedTabIndex === -1){
                        newTabCollection.push(tab);                    
                    }
                });
                
                const tempState = JSON.parse(JSON.stringify(folderManagementState));

                tempState.windows[targetWindowIndex].tabs = [...newTabCollection];

                setMarkedTabs([]);
                dispatch(updateFolder(["windows", tempState.windows]));
                dispatch(setIsEditingTab(false));
            }
        } else {
            if(onDeleteTabs) {
                onDeleteTabs(markedTabs);
                setMarkedTabs([]);
            } 
        }
    }

    const handleTabEdit = (id: number): void => {
        const { toBeingEdited, currentlyEditingTab } = miscState;

        if(currentlyEditingTab === true) return;

        dispatch(setCurrentTabEdits(toBeingEdited + 1));
        dispatch(setIsEditingTab(true));
        setEditTab(id);
    }

    const handleEditTabStop = (): void => {
        const { toBeingEdited } = miscState;
        dispatch(setCurrentTabEdits(toBeingEdited > 0 ? toBeingEdited - 1 : 0)); 
        dispatch(setIsEditingTab(false));
        setEditTab(null);
        setNewTab(false);
    }

    const handleTabClose = (tabId: number): void => {
        chrome.tabs.remove(tabId)
    }

    // Return a list of tabs based on data from parent component
    const renderTabs: Array<JSX.Element> = useMemo(() => {
        let result = [];
       
        result = tabs.map((tab) => {
            if(editTab === tab.id){
                return <EditableTabItem key={`window-${id}-tab-${tab.id}`} windowId={id} id={editTab} preset={tab.url} onStop={handleEditTabStop} />
            } else {
                return (
                    <TabItem 
                        marked={false} 
                        key={`window-${id}-tab-${tab.id}`} 
                        id={tab.id} 
                        label={tab.label} 
                        url={tab.url} 
                        onMark={disableMarkTab === false ? handleMarkTab : undefined} 
                        onEdit={disableEditTab === false ? handleTabEdit : undefined}
                        onClose={disableDeleteTab === false ? handleTabClose : undefined}
                    />
                );
            }
        })

        return result;
    }, [tabs, editTab, miscState.currentlyEditingTab, markedTabs])
    
    // Decide whether or not to show an editable tab field within the tab list
    const evaluateNewTabRender = (): Array<JSX.Element> => {
        if(newTab === true){
            return [
                ...renderTabs, 
                <EditableTabItem windowId={id} onStop={handleEditTabStop} />
            ];
        } else {
            return renderTabs;
        }
    }

    const expandCollapseButton = (): JSX.Element => {
        let icon: JSX.Element;

        if(expanded === true){
            icon = <CollapseIcon size={20} fill="#000" />
        } else {
            icon = <ExpandIcon size={20} fill="#000" />
        }

        return (
            <GenericButton onClick={handleExpand}>
                {icon}
            </GenericButton>
        );
    }

    return (
        <li data-testid="window-item" className="window-item w-full py-1 rounded-md mb-3" id={`window-${id}`}>
            <div className="flex justify-between items-center w-full border-b border-tbfColor-darkgrey">
                <h3 className="text-sm font-semibold ">
                    {`Window`}
                </h3>
                <div className={`tab-settings`}>
                    {disableEdit === false && (
                        <GenericButton onClick={(e: any) => onDelete && onDelete(id)}>
                            <TrashIcon fill="#000" size={20} />
                        </GenericButton>
                    )}
                    {expandCollapseButton()}
                </div>
            </div>
            <div 
                data-visibility={expanded ? "visible" : "hidden"} 
                className={`tabs-list mt-3 overflow-hidden ${expanded === true ? "max-h-[2000px] ease-out visible" : "max-h-0 ease-in invisible"} duration-200 transition-all`}
            >
                <ul className={`list-none grid ${tabsCol && tabsCol > 1 && window.innerWidth >= 640 ? `grid-cols-${tabsCol ? tabsCol : 2} gap-x-3 gap-y-1` : "gap-y-1 grid-cols-1"}`}>
                    {tabs.length > 0 ? [...evaluateNewTabRender()] : <EditableTabItem windowId={id} onStop={handleEditTabStop} />}
                </ul>
                {tabs.length > 0 && disableEdit === false && <div className="mt-10 mb-8 flex justify-end">
                    {markedTabs.length > 0 && <PurpleBorderButton disabled={false} text="Delete tabs" onClick={handleDeleteTabs} />}
                    {disableAddTab === false && <PrimaryButton disabled={false} text="New tab" onClick={handleAddNewTab} />}
                </div>}
            </div>
            
        </li>
    ); 
}

export default WindowItem;