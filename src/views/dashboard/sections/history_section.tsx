import styles from "../../../styles/global_utils.module.scss";
import PrimaryButton from '../../../components/utils/primary_button/primary_button';
import FolderManager from '../../../components/features/folder_manager/folder_manager';
import { useEffect, useState, useRef, useMemo } from "react";
import { iFolderItem } from '../../../interfaces/folder_item';
import { useDispatch, useSelector } from 'react-redux';
import { clearInEditFolder  } from '../../../redux/actions/in_edit_folder_actions';
import TextIconButton from '../../../components/utils/text_icon_button';
import randomNumber from '../../../tools/random_number';
import { iWindowItem } from '../../../interfaces/window_item';
import { clearMarkedFoldersAction } from '../../../redux/actions/folder_settings_actions';
import Dropdown from '../../../components/utils/dropdown/dropdown';
import TabItem from '../../../components/features/tab_item';
import { changeTabsViewMode, clearMarkedTabsAction, setMarkMultipleTabsAction, setMarkedTabsAction, setTabsSortOrder, setUpTabsAction } from '../../../redux/actions/history_settings_actions';
import { iTabItem } from '../../../interfaces/tab_item';
import { iDropdownSelected, iFieldOption } from '../../../interfaces/dropdown';
import AddToFolderPopup from '../../../components/features/add_to_folder_popup';
import SectionContainer from "../../../components/utils/section_container";
import { getFromStorage, saveToStorage } from "../../../services/webex_api/storage";
import SelectedCheckboxIcon from "../../../components/icons/selected_checkbox_icon";
import TrashIcon from "../../../components/icons/trash_icon";
import GridIcon from "../../../components/icons/grid_icon";
import ListIcon from "../../../components/icons/list_icon";
import DeselectedCheckboxIcon from "../../../components/icons/deselected_checkbox_icon";
import iHistoryState from './../../../interfaces/states/history_state';
import iHistoryTabGroup from './../../../interfaces/history_tab_group';

const HistorySection = (props: any): JSX.Element => {
    const [addToWorkSpaceMessage, setAddToFolderMessage] = useState<boolean>(false);
    const [mergeProcessFolder, setMergeProcessFolder] = useState<iFolderItem | null>(null);
    const [createFolder, setCreateFolder] = useState<boolean>(false);
    const [timeNow, setTimeNow] = useState<number>(Date.now());

    const historySectionState = useSelector((state: any) => state.historySectionReducer);
    const folderCollectionState: Array<iFolderItem> = useSelector((state: any) => state.folderCollectionReducer);

    const historyListRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();

    useEffect(() => {
        const query = {
            text: "",
            maxResults: 20
        }

        chrome.history.search(query, (items: Array<chrome.history.HistoryItem>) => {
            dispatch(setUpTabsAction(items));
        });

        getFromStorage("local", "history_sort", (data) => {  
            dispatch(setTabsSortOrder(data.history_sort));
        })

        getFromStorage("local", "history_viewmode", (data) => {  
            dispatch(changeTabsViewMode(data.history_viewmode));
        })
    }, []);

    // Change tab listing from grid to list, and vice versa
    const handleChangeViewMode = (): void => {
        const { viewMode } = historySectionState;
        
        const newStatus = viewMode === "list" ? "grid" : "list"
        saveToStorage("local", "history_viewmode", newStatus)
        dispatch(changeTabsViewMode(newStatus));
    }

    const handleCloseFolderManager = (e: any): void => {
        const newStatus = e.selected;

        saveToStorage("local", "history_sort", newStatus);
        dispatch(setTabsSortOrder(newStatus));
    }

    const renderSortOptionsDropdown = (): JSX.Element => {
        const optionsList: Array<iFieldOption> = [
            {id: 0, label: "Ascending title"},
            {id: 1, label: "Descending title"},
            {id: 2, label: "Last visited"},
            {id: 3, label: "Most visited"}
        ];

        const presetOption = optionsList.filter((option: iFieldOption) => option.id === historySectionState.tabSortOptionId);
        
        return <Dropdown tag="sort-folders" preset={presetOption[0] || optionsList[0]} options={optionsList} onCallback={handleCloseFolderManager} />
    }

    // Mark/unmark a tab by its id
    const handleMarkTab = (id: number): void => {
        const tabCollection: Array<chrome.history.HistoryItem> = historySectionState.tabs;
        const markedTabs: Array<chrome.history.HistoryItem> = historySectionState.markedTabs;

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
        const tabs: Array<chrome.history.HistoryItem> = historySectionState.tabs as Array<chrome.history.HistoryItem>;
        dispatch(setMarkMultipleTabsAction(tabs));
    }

    const handleUnMarkAll = (): void => {
        dispatch(setMarkMultipleTabsAction([]));
    }

    const handleDeleteFromHistory = (): void => {
        let updatedMarks = historySectionState.tabs;

        historySectionState.markedTabs.forEach((tab: chrome.history.HistoryItem) => {
            chrome.history.deleteUrl({ url: tab.url! });
            updatedMarks = updatedMarks.filter((target: chrome.history.HistoryItem) => target.url !== tab.url);
        });
        dispatch(setUpTabsAction(updatedMarks));
        dispatch(setMarkMultipleTabsAction([]));
    }

    const handleOpenSelected = (): void => {
        const markedTabs: Array<chrome.history.HistoryItem> = historySectionState.markedTabs as Array<chrome.history.HistoryItem>;
        
        markedTabs.forEach((tab: chrome.history.HistoryItem) => {
            const properties: object = {
                active: false,
                url: tab.url
            };
            chrome.tabs.create(properties);
        })
    }

    const renderOptionsMenu = (): JSX.Element => {
        const { markedTabs } = historySectionState;
        let specs: any;

        if(markedTabs.length > 0){
            specs = {
                label: "Mark all",
                id: "selected_checkbox",
                handle: handleUnMarkAll
            }
        } else {
            specs = {
                label: "Mark all",
                id: "deselected_checkbox",
                handle: handleMarkAllTabs
            }
        }

        return (
            <>
                <div className="mr-4 inline-flex items-center justify-end w-full">
                    <div className="flex">
                        <TextIconButton 
                            disabled={false} 
                            id={specs.id} 
                            textSize="text-sm"
                            text={specs.label} 
                            onClick={specs.handle} 
                        >
                            {
                                markedTabs.length > 0 ? 
                                <SelectedCheckboxIcon size={20} fill={"#6D00C2"} /> : 
                                <DeselectedCheckboxIcon size={20} fill={"#6D00C2"} />
                            }
                        </TextIconButton>
                        <TextIconButton 
                            disabled={markedTabs.length > 0 ? false : true} 
                            id={"trash"} 
                            textSize="text-sm"
                            text="Delete from history" 
                            onClick={handleDeleteFromHistory} 
                        >
                            <TrashIcon size={20} fill={markedTabs.length > 0 ? "#6D00C2" : "#9f9f9f"} />
                        </TextIconButton>
                    </div>
                    
                    <div className="flex items-center justify-end">
                        <TextIconButton 
                            disabled={false} 
                            id={historySectionState.viewMode === "list" ? "grid" : "list"} 
                            textSize="text-sm"
                            text={historySectionState.viewMode === "list" ? "Grid" : "List"} 
                            onClick={handleChangeViewMode} 
                        >
                            { 
                                historySectionState.viewMode === "list" ? 
                                <GridIcon size={20} fill={"#6D00C2"} /> : 
                                <ListIcon size={20} fill={"#6D00C2"} />
                            }
                        </TextIconButton>
                        <div className="relative w-[175px] mr-4 flex items-center">
                            {renderSortOptionsDropdown()}
                        </div>
                        <PrimaryButton disabled={markedTabs.length > 0 ? false : true} text="Open selected" onClick={handleOpenSelected} />
                        <PrimaryButton disabled={markedTabs.length > 0 ? false : true} text="Add to folder" onClick={() => setAddToFolderMessage(true)} />
                    </div>
                </div>
            </>
        )
    }

    const groupByTime = () => {
        const { tabs } = historySectionState as iHistoryState;
        const groups: Map<number, Array<chrome.history.HistoryItem>> = new Map();
        
        let prevMin: number = 0;

        tabs.forEach((tab) => {
            const { lastVisitTime } = tab;
            

            if(lastVisitTime){
                const visitedTimeAsDate = lastVisitTime;
                const diff: number = (Date.now() - lastVisitTime)/1000/60; // in min
                const minutes = Math.floor(diff)

                if(!groups.get(minutes)){
                    groups.set(minutes, []);
                }
                const batch: Array<chrome.history.HistoryItem> | undefined = groups.get(minutes);
                
                if(batch){
                    batch.push(tab);
                    const sorted = batch.sort((a, b) => b.lastVisitTime! - a.lastVisitTime!);
                    groups.set(minutes, [...sorted]);
                }
                

            }
        })

        return groups;
    }

    const renderGroups = (): JSX.Element => {
        const groups: Map<number, Array<chrome.history.HistoryItem>> = groupByTime();
       // console.log(Array.from(groups));
        return <></>;
    }

   const renderTabs = (): Array<JSX.Element> => {
        renderGroups();
        const { tabSortOptionId, tabs } = historySectionState;
        let sortedTabs: Array<chrome.history.HistoryItem> = tabs;
        
        const titleCondition = (a: chrome.history.HistoryItem, b: chrome.history.HistoryItem): boolean => {
            a.title = a.title ? a.title : "";
            b.title = b.title ? b.title : "";

            const aTitleLowerCase = a.title.toLowerCase();
            const bTitleToLowerCase = b.title.toLowerCase();

            return tabSortOptionId === 0 ? (aTitleLowerCase > bTitleToLowerCase) : (bTitleToLowerCase > aTitleLowerCase);
        }

        if(tabSortOptionId === 0 || tabSortOptionId === 1){
            sortedTabs = [...tabs].sort((a: any, b: any) => titleCondition(a, b) ? 1 : -1);
        } else if(tabSortOptionId === 2){
            sortedTabs = [...tabs].sort((a: any, b: any) => a.lastVisitTime - b.lastVisitTime);
        } else if(tabSortOptionId === 3){
            sortedTabs = [...tabs].sort((a: any, b: any) => a.visitCount - b.visitCount);
        }

        const result = sortedTabs.map((item: chrome.history.HistoryItem) => {
            const collection = historySectionState.markedTabs;
            const isMarked = collection.find((target: chrome.history.HistoryItem) => parseInt(target.id) === parseInt(item.id));
            const { id, title, url } = item;
    
            return (
                <TabItem 
                    onMark={handleMarkTab} 
                    key={`sorted-tab-${id}`} 
                    id={parseInt(id)} 
                    label={title || ""} 
                    url={url || "https://"} 
                    disableEdit={true} 
                    disableMark={false} 
                    marked={isMarked ? true : false} 
                />
            )
        });

        return result; 
    };

    const handleAddToNewFolder = (): void => {
        setAddToFolderMessage(false);
        setCreateFolder(true);
    }

    const handleAddToExistingFolder = (e: any): void => {
        if(e.selected === -1) return;

        const targetFolderId = e.selected;
        const targetFolder: iFolderItem | undefined = folderCollectionState.find((folder: iFolderItem) => folder.id === targetFolderId);
     
        if(!targetFolder) return;
        
        const markedTabs: Array<iTabItem> = historySectionState.markedTabs.map((tab: chrome.history.HistoryItem) => {
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

        const updatedFolder: iFolderItem = {...targetFolder};
        updatedFolder.windows = [...updatedFolder.windows, presetWindow];

        if(targetFolder){
            setAddToFolderMessage(false);
            setMergeProcessFolder(updatedFolder);
        }
    }

    const renderAddTabsMessage = (): JSX.Element => {
        const currentFolders: Array<iFolderItem> = folderCollectionState;

        const options: Array<iFieldOption> = currentFolders.map((folder) => {
            return { id: folder.id, label: folder.name }
        });

        const dropdownOptions: Array<iFieldOption> = [
            {
                id: -1,
                label: "Select a folder"
            },
            ...options
        ];

        return (
            <AddToFolderPopup 
                title="Add to folder"
                type="slide-in"
                dropdownOptions={dropdownOptions}
                onNewFolder={handleAddToNewFolder}
                onExistingFolder={handleAddToExistingFolder}
                onCancel={() => setAddToFolderMessage(false)}
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
            const markedTabs: Array<iTabItem> = historySectionState.markedTabs.map((tab: chrome.history.HistoryItem) => {
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
            
            const folderSpecs: iFolderItem = {
                id: randomNumber(),
                name: "",
                desc: "",
                type: "expanded",
                viewMode: "grid",
                marked: false,
                windows: [presetWindow],
            }
            render = <FolderManager type="slide-in" title="Create folder" folder={folderSpecs} onClose={handlePopupClose} />;
        } else if(mergeProcessFolder !== null) {
            render = <FolderManager type="slide-in" title={`Merge tabs to ${mergeProcessFolder.name}`} folder={mergeProcessFolder} onClose={handlePopupClose} />;
        } else {
            render = <></>;
        }

        return render;
    }

    const tabViewModeCSS = (): string => {
        if(historySectionState.viewMode === "list"){
            return "mx-auto mt-10";
        } else {
            return "grid xl:grid-cols-3 2xl:grid-cols-4 grid-flow-dense gap-x-3 gap-y-0 mt-6 pr-2";
        }
    }

    const renderContentSection = (): JSX.Element => {
        return (
            <div className="flex justify-center min-h-[350px]">
                <div className="w-full">
                    <div className="pb-6">
                        <div ref={historyListRef} className={`${styles.scroll_style} overflow-y-auto ${tabViewModeCSS()} max-h-[350px]`}>
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
            <SectionContainer id="history-view" title="History" options={renderOptionsMenu}>
                <div className="mt-8">                     
                    {historySectionState.tabs.length > 0 ? renderContentSection() : renderEmptyMessage()}
                </div>  
            </SectionContainer>
        </>
    );

}

export default HistorySection