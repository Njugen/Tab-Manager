import styles from "../../../styles/global_utils.module.scss";
import PrimaryButton from '../../../components/utils/primary_button';
import FolderManager from '../../../components/utils/folder_manager';
import { useEffect, useState, useRef } from "react";
import { iFolder } from '../../../interfaces/folder';
import { useDispatch, useSelector } from 'react-redux';
import { clearInEditFolder  } from '../../../redux/actions/inEditFolderActions';
import TextIconButton from '../../../components/utils/text_icon_button';
import randomNumber from '../../../tools/random_number';
import { iWindowItem } from '../../../interfaces/window_item';
import { clearMarkedFoldersAction } from '../../../redux/actions/workspaceSettingsActions';
import Dropdown from '../../../components/utils/dropdown';
import TabItem from '../../../components/tab_item';
import { clearMarkedTabsAction, setMarkMultipleTabsAction, setMarkedTabsAction, setTabsSortOrder, setUpTabsAction } from '../../../redux/actions/historySettingsActions';
import { iTabItem } from '../../../interfaces/tab_item';
import { iDropdownSelected, iFieldOption } from '../../../interfaces/dropdown';
import AddToWorkspacePopup from '../../../components/utils/add_to_workspace_popup';

const HistorySection = (props: any): JSX.Element => {
    const [viewMode, setViewMode] = useState<string>("grid");
    const [addToWorkSpaceMessage, setAddToWorkspaceMessage] = useState<boolean>(false);
    const [mergeProcessFolder, setMergeProcessFolder] = useState<iFolder | null>(null);
    const [createFolder, setCreateFolder] = useState<boolean>(false);

    const tabsData = useSelector((state: any) => state.HistorySettingsReducer);
    const folderCollection: Array<iFolder> = useSelector((state: any) => state.FolderCollectionReducer);

    const historyListRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();

    useEffect(() => {
        const query = {
            text: "",
            maxResults: 25
        }

        chrome.history.search(query, (items: Array<chrome.history.HistoryItem>) => {
            dispatch(setUpTabsAction(items));
        });
    }, []);

    // Change tab listing from grid to list, and vice versa
    const handleChangeViewMode = (): void => {
        setViewMode(viewMode === "list" ? "grid" : "list");
    }

    const handleCloseFolderManager = (e: iDropdownSelected): void => {
        let option = "asc";

        if(e.selected === 0){
            option = "asc";
        } else if(e.selected === 1){
            option = "desc";
        } else if(e.selected === 2){
            option = "lv";
        } else if(e.selected === 3){
            option = "mv";
        }
        
        dispatch(setTabsSortOrder(option));
    }

    const renderSortOptionsDropdown = (): JSX.Element => {
        const optionsList: Array<iFieldOption> = [
            {id: 0, label: "Ascending title"},
            {id: 1, label: "Descending title"},
            {id: 2, label: "Last visited"},
            {id: 3, label: "Most visited"}
        ];

        return <Dropdown tag="sort-folders" preset={{id: 0, label: "Ascending"}} options={optionsList} onCallback={handleCloseFolderManager} />
    }

    // Mark/unmark a tab by its id
    const handleMarkTab = (id: number): void => {
        const tabCollection: Array<chrome.history.HistoryItem> = tabsData.tabs;
        const markedTabs: Array<chrome.history.HistoryItem> = tabsData.markedTabs;

        // Get an index of the affected tab
        const index = tabCollection.findIndex((tab: chrome.history.HistoryItem) => id === parseInt(tab.id));

        if(index >= 0){
            const isMarked = markedTabs.find((tab: chrome.history.HistoryItem) => id === parseInt(tab.id));
            
            if(isMarked){
                const updatedMarkedTabCollection: Array<chrome.history.HistoryItem> = markedTabs.filter((tab) => parseInt(tab.id) !== id);

                dispatch(setMarkMultipleTabsAction(updatedMarkedTabCollection));
            } else {
                const newTab = tabCollection[index];
                dispatch(setMarkedTabsAction(newTab));
            }  
        }
    }


    const handleMarkAllTabs = (): void => {
        const tabs: Array<chrome.history.HistoryItem> = tabsData.tabs as Array<chrome.history.HistoryItem>;
        dispatch(setMarkMultipleTabsAction(tabs));
    }

    const handleUnMarkAll = (): void => {
        dispatch(setMarkMultipleTabsAction([]));
    }

    const handleDeleteFromHistory = (): void => {
        let updatedMarks = tabsData.tabs;

        tabsData.markedTabs.forEach((tab: chrome.history.HistoryItem) => {
            chrome.history.deleteUrl({ url: tab.url! });
            updatedMarks = updatedMarks.filter((target: chrome.history.HistoryItem) => target.url !== tab.url);
        });
        dispatch(setUpTabsAction(updatedMarks));
        dispatch(setMarkMultipleTabsAction([]));
    }

    const handleOpenSelected = (): void => {
        const markedTabs: Array<chrome.history.HistoryItem> = tabsData.markedTabs as Array<chrome.history.HistoryItem>;
        
        markedTabs.forEach((tab: chrome.history.HistoryItem) => {
            const properties: object = {
                active: false,
                url: tab.url
            };
            chrome.tabs.create(properties);
        })
    }

    const renderOptionsMenu = (): JSX.Element => {
        const { markedTabs } = tabsData;

        return (
            <>
                <div className="mr-4 inline-flex items-center justify-end w-full">
                    <div className="flex">
                        <TextIconButton disabled={false} icon={"selected_checkbox"} size={{ icon: 20, text: "text-sm" }}  fill="#6D00C2" text="Mark all" onClick={handleMarkAllTabs} />
                        <TextIconButton disabled={false} icon={"deselected_checkbox"} size={{ icon: 20, text: "text-sm" }}  fill="#6D00C2" text="Unmark all" onClick={handleUnMarkAll} />
                        <TextIconButton disabled={markedTabs.length > 0 ? false : true} icon={"trash"} size={{ icon: 20, text: "text-sm" }}  fill={markedTabs.length > 0 ? "#6D00C2" : "#9f9f9f"} text="Delete from history" onClick={handleDeleteFromHistory} />
                    </div>
                    <div className="flex items-center justify-end">
                        
                        <TextIconButton disabled={false} icon={viewMode === "list" ? "grid" : "list"} size={{ icon: 20, text: "text-sm" }} fill="#6D00C2" text={viewMode === "list" ? "Grid" : "List"} onClick={handleChangeViewMode} />
                        <div className="relative w-[175px] mr-4 flex items-center">
                            {renderSortOptionsDropdown()}
                        </div>
                        <PrimaryButton disabled={markedTabs.length > 0 ? false : true} text="Open selected" onClick={handleOpenSelected} />
                        <PrimaryButton disabled={markedTabs.length > 0 ? false : true} text="Add to workspace" onClick={() => setAddToWorkspaceMessage(true)} />
                    </div>
                </div>
            </>
        )
    }

    const renderTabs = (): Array<JSX.Element> => {
        const { tabsSort, tabs } = tabsData;
        let sortedTabs: Array<chrome.history.HistoryItem> = tabs;
        
        const titleCondition = (a: chrome.history.HistoryItem, b: chrome.history.HistoryItem): boolean => {
            a.title = a.title ? a.title : "";
            b.title = b.title ? b.title : "";

            const aTitleLowerCase = a.title.toLowerCase();
            const bTitleToLowerCase = b.title.toLowerCase();

            return tabsSort === "asc" ? (aTitleLowerCase > bTitleToLowerCase) : (bTitleToLowerCase > aTitleLowerCase);
        }

        if(tabsSort === "asc" || tabsSort === "desc"){
            sortedTabs = [...tabs].sort((a: any, b: any) => titleCondition(a, b) ? 1 : -1);
        } else if(tabsSort === "lv"){
            sortedTabs = [...tabs].sort((a: any, b: any) => a.lastVisitTime - b.lastVisitTime);
        } else if(tabsSort === "mv"){
            sortedTabs = [...tabs].sort((a: any, b: any) => a.visitCount - b.visitCount);
        }

        const result = sortedTabs.map((item: chrome.history.HistoryItem) => {
            const collection = tabsData.markedTabs;
            const isMarked = collection.find((target: chrome.history.HistoryItem) => parseInt(target.id) === parseInt(item.id));
    
            return <TabItem onMark={handleMarkTab} key={`sorted-tab-${item.id}`} id={parseInt(item.id)} label={item.title || ""} url={item.url || "https://"} disableEdit={true} disableMark={false} marked={isMarked ? true : false} />
        });

        return result; 
    };

    // Decide number of columns in the tab grid
    const decideGridCols = (): number => {
        const { innerWidth } = window;
        
        if(innerWidth > 1920){
            return 4;
        } else if(innerWidth > 1280){
            return 4;
        } else {
            return 3;
        }
    };

    const renderAddTabsMessage = (): JSX.Element => {
        const currentFolders: Array<iFolder> = folderCollection;

        const options: Array<iFieldOption> = currentFolders.map((folder) => {
            return { id: folder.id, label: folder.name }
        });

        const dropdownOptions: Array<iFieldOption> = [
            {
                id: -1,
                label: "Select a workspace"
            },
            ...options
        ];

        const handleAddToNewWorkspace = (): void => {
            setAddToWorkspaceMessage(false);
            setCreateFolder(true);
        }

        const handleAddToExistingWorkspace = (e: any): void => {
            if(e.selected === -1) return;

            const targetFolderId = e.selected;
            const targetFolder: iFolder | undefined = folderCollection.find((folder: iFolder) => folder.id === targetFolderId);
         
            if(!targetFolder) return;
            
            const markedTabs: Array<iTabItem> = tabsData.markedTabs.map((tab: chrome.history.HistoryItem) => {
                return {
                    id: tab.id,
                    label: tab.title,
                    url: tab.url,
                    disableEdit: false,
                    disableMark: false,
                }
            });

            const presetWindow: iWindowItem = {
                id: randomNumber(),
                tabs: markedTabs
            };

            const updatedFolder: iFolder = {...targetFolder};
            updatedFolder.windows = [...updatedFolder.windows, presetWindow];

            if(targetFolder){
                setAddToWorkspaceMessage(false);
                setMergeProcessFolder(updatedFolder);
            }
        }

        return (
            <AddToWorkspacePopup 
                title="Save history"
                type="slide-in" 
                dropdownOptions={dropdownOptions}
                onNewWorkspace={handleAddToNewWorkspace}
                onExistingWorkspace={handleAddToExistingWorkspace}
                onCancel={() => setAddToWorkspaceMessage(false)}
            />

        );
    }


    const handlePopupClose = (): void => {
        setCreateFolder(false);
        setMergeProcessFolder(null);

        dispatch(clearMarkedTabsAction());
        dispatch(clearMarkedFoldersAction());
        dispatch(clearInEditFolder());
    }

    const renderFolderManager = (): JSX.Element => {
        let render;
        if(createFolder === true){
            const markedTabs: Array<iTabItem> = tabsData.markedTabs.map((tab: chrome.history.HistoryItem) => {
                return {
                    id: tab.id,
                    label: tab.title,
                    url: tab.url,
                    disableEdit: false,
                    disableMark: false,
                }
            });

            const presetWindow: iWindowItem = {
                id: randomNumber(),
                tabs: markedTabs
            };
            
            const folderSpecs: iFolder = {
                id: randomNumber(),
                name: "",
                desc: "",
                type: "expanded",
                viewMode: "grid",
                marked: false,
                windows: [presetWindow],
            }
            render = <FolderManager type="slide-in" title="Create workspace" folder={folderSpecs} onClose={handlePopupClose} />;
        } else if(mergeProcessFolder !== null) {
            render = <FolderManager type="slide-in" title={`Merge tabs to ${mergeProcessFolder.name}`} folder={mergeProcessFolder} onClose={handlePopupClose} />;
        } else {
            render = <></>;
        }

        return render;
    }

    const renderContentSection = (): JSX.Element => {
        return (
            <div className="flex justify-center min-h-[350px]">
                <div className="w-full">
                    <div className="pb-6">
                        <div ref={historyListRef} className={`${styles.scroll_style} overflow-y-auto ${viewMode === "list" ? "mx-auto mt-10" : `grid grid-cols-${decideGridCols()} grid-flow-dense gap-x-3 gap-y-0 mt-8 pr-2`} max-h-[350px]`}>
                            {renderTabs()}
                        </div>
                    </div> 
                </div>            
            </div>
        );
    }

    const renderEmptyMessage = (): JSX.Element => {
        return (
            <div className="flex justify-center items-center bg-white min-h-[350px]">
                <p> Your browing history is empty.</p>
            </div>
        );
    }

    return (
        <>
            {addToWorkSpaceMessage && renderAddTabsMessage()}
            {renderFolderManager()}
            <div id="history-view" className="mb-12 pt-10 bg-white shadow">
                <div className="flex justify-between min-h-[350px]">
                    <div className="w-full mb-6 px-14 pb-4">
                        <div className="flex">
                            <h1 className="text-4xl text-tbfColor-darkpurple font-light inline-block">
                                History
                            </h1>
                            {renderOptionsMenu()}
                        </div>
                        <div className="mt-8">                     
                            {tabsData.tabs.length > 0 ? renderContentSection() : renderEmptyMessage()}
                        </div>  
                    </div>
                </div>
            </div>
        </>  
    );

}

export default HistorySection