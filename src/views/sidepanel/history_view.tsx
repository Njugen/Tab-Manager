import { useState, useEffect, useRef } from "react";
import { iWindowItem } from '../../interfaces/window_item';
import { useSelector, useDispatch } from "react-redux";
import { iFolderItem } from '../../interfaces/folder_item';
import FolderManager from "../../components/features/folder_manager/folder_manager";
import { clearInEditFolder } from "../../redux/actions/in_edit_folder_actions";
import { clearMarkedTabsAction, setMarkMultipleTabsAction, setMarkedTabsAction, setTabsSortOrder, setUpTabsAction } from '../../redux/actions/history_settings_actions';
import { clearMarkedFoldersAction } from '../../redux/actions/folder_settings_actions';
import randomNumber from '../../tools/random_number';
import AddToFolderPopup from "../../components/features/add_to_folder_popup";
import { iTabItem } from '../../interfaces/tab_item';
import { iFieldOption } from '../../interfaces/dropdown';
import Dropdown from "../../components/utils/dropdown/dropdown";
import TabItem from "../../components/features/tab_item";
import CircleButton from './../../components/utils/circle_button';
import SaveIcon from '../../components/icons/save_icon';
import TrashIcon from '../../components/icons/trash_icon';
import OpenBrowserIcon from "../../components/icons/open_browser_icon";
import iHistoryState from "../../interfaces/states/history_state";
import styles from "../../../src/styles/global_utils.module.scss";
import TabGroup from './../../components/utils/tab_group';

const HistoryView = (props:any): JSX.Element => {
    const [mergeProcess, setMergeProcess] = useState<iFolderItem | null>(null);
    const [addToWorkSpaceMessage, setAddToFolderMessage] = useState<boolean>(false);
    const [editFolderId, setEditFolderId] = useState<number | null>(null);
    const [createFolder, setCreateFolder] = useState<boolean>(false);
    const [snapshot, setSnapshot] = useState<string>("");
    const historyListRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();
    const historySectionState = useSelector((state: any) => state.historySectionReducer);
    const folderCollectionState: Array<iFolderItem> = useSelector((state: any) => state.folderCollectionReducer);

    useEffect(() => {        
        if(folderCollectionState.length > 0){
     //       saveToStorage("local", "folders", folderCollectionState);
        } 
    }, [folderCollectionState]);
    const handleMark = (input: number): void => {
        const tabCollection: Array<chrome.history.HistoryItem> = historySectionState.tabs;
        const markedTabs: Array<chrome.history.HistoryItem> = historySectionState.markedTabs;
        const index = tabCollection.findIndex((tab: chrome.history.HistoryItem) => input === parseInt(tab.id));

        if(index > -1){
            const isMarked = markedTabs.find((tab: chrome.history.HistoryItem) => input === parseInt(tab.id));
            
            if(isMarked){
                const updatedMarkedTabCollection: Array<chrome.history.HistoryItem> = markedTabs.filter((tab) => parseInt(tab.id) !== input);
                dispatch(setMarkMultipleTabsAction(updatedMarkedTabCollection));
            } else {
                const newTab = tabCollection[index];
                dispatch(setMarkedTabsAction(newTab));
            }  
        }
    }


    const handleMarkAll = (): void => {
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

    const searchHistory = () => {
        const query = {
            text: "",
            maxResults: 25
        }
        chrome.history.search(query, (items: Array<chrome.history.HistoryItem>) => {
            dispatch(setUpTabsAction(items));
        });
    }

    const historyRemovedListener = (result: chrome.history.RemovedResult): void => {
        searchHistory();
    }

    const historyVisitedListener = (result: chrome.history.HistoryItem): void => {
        searchHistory();
    }

    useEffect(() => {
        searchHistory();

        chrome.history.onVisitRemoved.addListener(historyRemovedListener);
        chrome.history.onVisited.addListener(historyVisitedListener);

        return () => {
            chrome.history.onVisitRemoved.addListener(historyRemovedListener);
            chrome.history.onVisited.addListener(historyVisitedListener);
        }
    }, []);



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
            setMergeProcess(updatedFolder);
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
                type="popup"
                dropdownOptions={dropdownOptions}
                onNewFolder={handleAddToNewFolder}
                onExistingFolder={handleAddToExistingFolder}
                onCancel={() => setAddToFolderMessage(false)}
            />

        );
    }

    const handlePopupClose = (): void => {

        setEditFolderId(null);
        setCreateFolder(false);
        setMergeProcess(null);

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
            render = <FolderManager type="popup" title="Create folder" folder={folderSpecs} onClose={handlePopupClose} />;
        } else if(mergeProcess !== null) {

            render = <FolderManager type="popup" title={`Merge tabs to ${mergeProcess.name}`} folder={mergeProcess} onClose={handlePopupClose} />;
        } else {
            render = <></>;
        }

        return render;
    }
    const groupByTime = () => {
        const { tabs } = historySectionState as iHistoryState;
        const groups: Map<number, Array<chrome.history.HistoryItem>> = new Map();
        
        let prevMin: number = 0;

        tabs.forEach((tab) => {
            const { lastVisitTime } = tab;
            

            if(lastVisitTime){
                const visitedTimeAsDate = lastVisitTime;
                const diff: number = (Date.now() - (lastVisitTime))/1000/60; // in min
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

    const organizeGroups = (): Array<Array<any>> => {
        const groups: Map<number, Array<chrome.history.HistoryItem>> = groupByTime();

        return Array.from(groups);
    }

    const renderEmptyMessage = (): JSX.Element => {
        return (
            <div className="flex justify-center items-center bg-white min-h-[350px]">
                <p> Your browing history is empty.</p>
            </div>
        );
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

    return (
        <>
            {addToWorkSpaceMessage && renderAddTabsMessage()}
            {renderFolderManager()}
            <div className="flex justify-end mx-2 mt-4 mb-4">
                <CircleButton 
                    disabled={historySectionState.markedTabs.length > 0 ? false : true} 
                    bgCSSClass="bg-tbfColor-lightpurple" 
                    onClick={() => handleOpenSelected()}
                >
                    <OpenBrowserIcon size={20} fill={"#fff"} />
                </CircleButton>

                <CircleButton 
                    disabled={historySectionState.markedTabs.length > 0 ? false : true} 
                    bgCSSClass="bg-tbfColor-lightpurple" 
                    onClick={() => setAddToFolderMessage(true)}
                >
                    <SaveIcon size={20} fill={"#fff"} />
                </CircleButton>

                <CircleButton 
                    disabled={historySectionState.markedTabs.length > 0 ? false : true} 
                    bgCSSClass="bg-tbfColor-lightpurple" 
                    onClick={() => handleDeleteFromHistory()}
                >
                    <TrashIcon size={20} fill={"#fff"} />
                </CircleButton>
            </div>
            <div className="mt-8">  
                <div className="flex justify-center min-h-[350px]">
                    <div className="w-full">
                        <div className="pb-6">
                            <div ref={historyListRef} className={`${styles.scroll_style}`}>
                                {
                                    <>
                                        { 
                                            organizeGroups().map((group): JSX.Element => {

                                                    return (
                                                        <TabGroup desc={`${group[0]} minutes ago`}>
                                                            {
                                                                group[1].map((tab: any) => {
                                                                    const collection = historySectionState.markedTabs;
                                                                    const isMarked = collection.find((target: chrome.history.HistoryItem) => parseInt(target.id) === parseInt(tab.id));
                                                                    const { id, title, url } = tab;
                                                                    return (
                                                                        
                                                                        <div className="my-3">
                                                                            <TabItem key={`tab-${id}`} id={parseInt(id)} label={title} url={url} onMark={handleMarkTab} marked={isMarked ? true : false} disableEdit={true} disableMark={false} />
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </TabGroup>
                                                    
                                                    );
                                                }
                                            )
                                        }
                                    </>
                                }   
                            </div>
                        </div> 
                    </div>            
                </div>
            </div>
        </>
    )
}

export default HistoryView;