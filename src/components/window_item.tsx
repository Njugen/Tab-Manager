import { useState, useEffect } from "react";
import GenericIconButton from "./utils/generic_icon_button";
import PrimaryButton from "./utils/primary_button/primary_button";
import PurpleBorderButton from "./utils/purple_border_button";
import TabItem from "./tab_item";
import { iWindowItem} from "../interfaces/window_item";
import EditableTabItem from "./editable_tab_item";
import { iTabItem } from "../interfaces/tab_item";
import { useDispatch, useSelector } from "react-redux";
import { updateInEditFolder } from "../redux/actions/inEditFolderActions";
import { setCurrentlyEditingTab, setTabInEdits } from "../redux/actions/miscActions";
import TrashIcon from "../images/icons/trash_icon";
import CollapseIcon from "../images/icons/collapse_icon";
import ExpandIcon from "../images/icons/expand_icon";

/*
    Window containing tabs and various window related options. Used primarily
    in window managers within folder settings
*/

const WindowItem = (props: iWindowItem): JSX.Element => {
    const [expanded, setExpanded] = useState<boolean>(true);
    const [newTab, setNewTab] = useState<boolean>(false);
    const [editTab, setEditTab] = useState<number | null>(null);
    const [markedTabs, setMarkedTabs] = useState<Array<number>>([]);
    const { id, tabs, tabsCol, disableEdit, disableTabEdit, disableTabMark } = props;
    
    const dispatch = useDispatch();

    // Get information about the folder 
    const folderData = useSelector((state: any) => state.InEditFolderReducer);
    const miscData = useSelector((state: any) => state.MiscReducer);

    // Disable add new tab by setting state
    useEffect(() => {
        if(newTab === true) setNewTab(false);
    }, [folderData]);

    // Expand or collapse a window (show/hide tabs within)
    const handleExpand = (): void => {
        setExpanded(expanded === true ? false : true);
    }

    // Delete this window from redux
    const handleDeleteWindow = (): void => {
        const windows = folderData.windows.filter((target: iWindowItem) => target.id !== id);

        dispatch(setCurrentlyEditingTab(false));
        dispatch(updateInEditFolder("windows", windows));
        dispatch(setCurrentlyEditingTab(false));
    }

    // Activate add new tab feature by setting state
    const handleAddNewTab = (): void => {
        if(editTab === null && miscData.currentlyEditingTab === false) {
            dispatch(setCurrentlyEditingTab(true));
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
        const windows = folderData.windows.filter((target: iWindowItem) => target.id === id);
        const targetWindowIndex = folderData.windows.findIndex((target: iWindowItem) => target.id === id);
        const tabs = windows[0]?.tabs;
     
        const newTabCollection: Array<iTabItem> = [];

        if(tabs){
            tabs.forEach((tab: iTabItem) => {
                const markedTabIndex = markedTabs.findIndex((target) => target === tab.id);
           
                if(markedTabIndex === -1){
                    newTabCollection.push(tab);                    
                }
            });
           
            folderData.windows[targetWindowIndex].tabs = [...newTabCollection];
            
            setMarkedTabs([]);
            dispatch(updateInEditFolder("windows", folderData.windows));
            dispatch(setCurrentlyEditingTab(false));
        }
    }

    const handleTabEdit = (id: number): void => {
        const { isEditingTabs, currentlyEditingTab } = miscData;

        if(currentlyEditingTab === true) return;
        
        dispatch(setTabInEdits(isEditingTabs + 1));
        dispatch(setCurrentlyEditingTab(true));
        setEditTab(id);
    }

    const renderEditTab = (windowId: number, url?: string, tabId?: number): JSX.Element => {
        const { isEditingTabs } = miscData;

        return <EditableTabItem windowId={windowId} id={tabId} preset={url} onStop={() => {
                dispatch(setTabInEdits(isEditingTabs > 0 ? isEditingTabs - 1 : 0)); 
                dispatch(setCurrentlyEditingTab(false));
                setEditTab(null);
            }
        } />
    }

    // Return a list of tabs based on data from parent component
    const renderTabs = (): Array<JSX.Element> => {
        let result = [];
        
        result = tabs.map((tab) => {
            if(editTab === tab.id){
                return renderEditTab(id, tab.url, editTab);
            } else {
                return <TabItem marked={false} disableMark={disableTabMark} disableEdit={disableTabEdit} key={`window-${id}-tab-${tab.id}`} id={tab.id} label={tab.label} url={tab.url} onMark={handleMarkTab} onEdit={handleTabEdit} />
            }
        })

        return result;
    }
    
    // Decide whether or not to show an editable tab field within the tab list
    const evaluateNewTabRender = (): Array<JSX.Element> => {
        if(newTab === true){
            return [...renderTabs(), renderEditTab(id)];
        } else {
            return [...renderTabs()];
        }
    }

    const trashButton = () => {
        return (
            <GenericIconButton icon="trash" onClick={handleDeleteWindow}>
                 <TrashIcon fill="#000" size={20} />
            </GenericIconButton>
        )
    }

    const expandCollapseButton = (): JSX.Element => {
        let icon: JSX.Element;

        if(expanded === true){
            icon = <CollapseIcon size={20} fill="#000" />
        } else {
            icon = <ExpandIcon size={20} fill="#000" />
        }

        return (
            <GenericIconButton icon={expanded === true ? "collapse" : "expand"} onClick={handleExpand}>
                {icon}
            </GenericIconButton>
        );
    }

    return (
        <div data-testid="window-item" className="window-item w-full py-1 rounded-md mb-3" id={`window-${id}`}>
            <div className="flex justify-between items-center w-full border-b border-tbfColor-darkgrey">
                <h3 className="text-sm font-semibold ">
                    {`Window`}
                </h3>
                <div className={`tab-settings`}>
                    {disableEdit === false && trashButton()}
                    {expandCollapseButton()}
                </div>
            </div>
            <div data-testid={`tab-list`} data-visibility={expanded ? "visible" : "hidden"} className={`tabs-list mt-3 overflow-hidden ${expanded === true ? "max-h-[2000px] ease-out visible" : "max-h-0 ease-in invisible"} duration-200 transition-all`}>
                <div className={`${tabsCol && tabsCol > 1 && window.innerWidth >= 640 ? `grid grid-cols-${tabsCol ? tabsCol : 2} gap-x-3 gap-y-0` : ""}`}>
                    {tabs.length > 0 ? [...evaluateNewTabRender()] : [renderEditTab(id)]}
                </div>
                {tabs.length > 0 && disableEdit === false && <div className="mt-10 mb-8 flex justify-end">
                    {markedTabs.length > 0 && <PurpleBorderButton disabled={false} text="Delete tabs" onClick={handleDeleteTabs} />}
                    {disableEdit === false && <PrimaryButton disabled={false} text="New tab" onClick={handleAddNewTab} />}
                </div>}
            </div>
            
        </div>
    ); 
}

export default WindowItem;