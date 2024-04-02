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
import HistoryTabGroupsSection from "../../common/HistoryTabGroupsSection";
import iHistoryState from "../../../interfaces/states/history_state";
// MOHAHAHA. THIS FILE IS A MESS AS OF NOW

const HistorySection = (props: any): JSX.Element => {
    const [addToWorkSpaceMessage, setAddToFolderMessage] = useState<boolean>(false);
    const [mergeProcessFolder, setMergeProcessFolder] = useState<iFolderItem | null>(null);
    const [createFolder, setCreateFolder] = useState<boolean>(false);
    const [snapshot, setSnapshot] = useState<string>("");
    const [expanded, setExpanded] = useState<boolean>(false);
    
    const historySectionState = useSelector((state: any) => state.historySectionReducer);
    const folderCollectionState: Array<iFolderItem> = useSelector((state: any) => state.folderCollectionReducer);


    const dispatch = useDispatch();

    const loadHistory = (query: chrome.history.HistoryQuery = { text: "", maxResults: 20 }): void => {
        chrome.history.search(query, (items: Array<chrome.history.HistoryItem>) => {
            if(items.length === 0) return;
            const sorted = items.sort((a,b)=> (a.lastVisitTime && b.lastVisitTime && (b.lastVisitTime - a.lastVisitTime)) || 0);
            const newSnapshot = JSON.stringify(sorted[sorted.length-1].lastVisitTime);
            
            if(items.length > 0 && snapshot !== newSnapshot) { 
                dispatch(setUpTabsAction(sorted));
                setSnapshot(newSnapshot);
            }
        });
    }

    const handleLoadHistory = (e?: any): void => {
        let query: any = {
            text: "",
            endTime: undefined,
            startTime: undefined,
            maxResults: expanded === false ? 15 : undefined
        }

        loadHistory(query)
    }

    
    useEffect(() => {
        
        getFromStorage("local", "history_sort", (data) => {  
            dispatch(setTabsSortOrder(data.history_sort));
        })

        getFromStorage("local", "history_viewmode", (data) => {  
            dispatch(changeTabsViewMode(data.history_viewmode));
        })

        handleLoadHistory()
    }, []);

    useEffect(() => {
        handleLoadHistory()
    }, [expanded])


    // Change tab listing from grid to list, and vice versa
    const handleChangeViewMode = (): void => {
        const { viewMode } = historySectionState;
        
        const newStatus = viewMode === "list" ? "grid" : "list"
        saveToStorage("local", "history_viewmode", newStatus)
        dispatch(changeTabsViewMode(newStatus));
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
                        {/*<div className="relative w-[175px] mr-4 flex items-center">
                            {renderSortOptionsDropdown()}
                        </div>*/}
                        <PrimaryButton disabled={markedTabs.length > 0 ? false : true} text="Open selected" onClick={handleOpenSelected} />
                        <PrimaryButton disabled={markedTabs.length > 0 ? false : true} text="Add to folder" onClick={() => setAddToFolderMessage(true)} />
                    </div>
                </div>
            </>
        )
    }

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

    return (
        <>
            {addToWorkSpaceMessage && renderAddTabsMessage()}
            {renderFolderManager()}
            <SectionContainer id="history-view" title="History" options={renderOptionsMenu} onExpand={(value: boolean) => setExpanded(value)}>
                <HistoryTabGroupsSection viewMode={historySectionState.viewMode} tabs={historySectionState.tabs} />
            </SectionContainer>
        </>
    );

}

export default HistorySection