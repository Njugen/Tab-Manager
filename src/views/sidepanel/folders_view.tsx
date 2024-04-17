import { useState, useEffect, useRef, useMemo } from "react";
import { iWindowItem } from '../../interfaces/window_item';
import { useSelector, useDispatch } from "react-redux";
import { iFolderItem } from '../../interfaces/folder_item';
import FolderItem from "../../components/features/folder_item/folder_item";
import { getFromStorage, saveToStorage } from '../../services/webex_api/storage';
import { deleteFolderAction, readAllFoldersFromBrowserAction } from '../../redux/actions/folder_collection_actions';
import FolderManager from "../../components/features/folder_manager/folder_manager";
import { clearInEditFolder } from "../../redux/actions/in_edit_folder_actions";
import { clearMarkedFoldersAction, setFoldersSortOrder } from "../../redux/actions/folder_settings_actions";
import PopupMessage from "../../components/utils/popup_message";
import PrimaryButton from "../../components/utils/primary_button/primary_button";
import NewFolderIcon from "../../components/icons/new_folder_icon";
import CircleButton from "../../components/utils/circle_button";
import Dropdown from "../../components/utils/dropdown/dropdown";
import { iFieldOption } from "../../interfaces/dropdown";
import iFolderState from "../../interfaces/states/folder_state";

const FoldersView = (props: any): JSX.Element => {
    const [editFolderId, setEditFolderId] = useState<number | null>(null);
    const [windowsPayload, setWindowsPayload] = useState<Array<iWindowItem> | null>(null);
    const [totalTabsCount, setTotalTabsCount] = useState<number>(0);
    const [showPerformanceWarning, setShowPerformanceWarning] = useState<boolean>(false);
    const [removalTarget, setRemovalTarget] = useState<iFolderItem | null>(null);
    const [createFolder, setCreateFolder] = useState<boolean>(false);

    const dispatch = useDispatch();
    const folderCollectionState: Array<iFolderItem> = useSelector((state: any) => state.folderCollectionReducer);
    const folderSettingsState: iFolderState = useSelector((state: any) => state.folderSettingsReducer);

    const storageListener = (changes: any, areaName: string): void => {
        if(areaName === "local"){
            if(changes.folders){
              dispatch(readAllFoldersFromBrowserAction(changes.folders.newValue));
            }
        }
    };

    useEffect(() => {
        getFromStorage("local", "folders", (data) => {  
            dispatch(readAllFoldersFromBrowserAction(data.folders));
        })

        chrome.storage.onChanged.addListener(storageListener);

        return () => {
            chrome.storage.onChanged.removeListener(storageListener);
          }
    }, []);

    const evaluatePerformanceWarning = (type: string, windows: Array<iWindowItem>) => {
        if(!windows) return;
        let tabsCount = 0;
        windows.forEach((window: iWindowItem) => {
            tabsCount += window.tabs.length;
        });
   
        chrome.storage.local.get("performanceWarningValue", (data) => {
            setTotalTabsCount(data.performanceWarningValue);
            if(data.performanceWarningValue !== -1 && data.performanceWarningValue <= tabsCount) {
                setShowPerformanceWarning(true);
            } else {
                handleLaunchFolder(windows, type);
            }
        });
    }

    const handlePrepareLaunchFolder = (windows: Array<iWindowItem>, type: string): void => {
        setWindowsPayload(windows);
        evaluatePerformanceWarning(type, windows);
    }

    const handleLaunchFolder = (windows: Array<iWindowItem>, launchType?: string): void => {
        // Now, prepare a snapshot, where currently opened windows get stored
        let snapshot: Array<chrome.windows.Window> = [];

        const queryOptions: chrome.windows.QueryOptions = {
            populate: true,
            windowTypes: ["normal", "popup"]
        };

        // Store currently opened windows into the snapshot
        chrome.windows.getAll(queryOptions, (currentWindows: Array<chrome.windows.Window>) => {
            snapshot = currentWindows;
        });

        // Open all windows in this folder
        windows.forEach((window: iWindowItem, i) => {
            const windowSettings = {
                focused: i === 0 ? true : false,
                url: window.tabs.map((tab) => tab.url),
                incognito: launchType === "incognito" ? true : false
            }
            chrome.windows.create(windowSettings);
        });

        // Close current session after launching the folder. Only applies when
        // set in the Pettings page
        chrome.storage.local.get("closeSessionAtFolderLaunch", (data) => {
            if(data.closeSessionAtFolderLaunch === true){
                snapshot.forEach((window) => {
                    if(window.id) chrome.windows.remove(window.id);
                });
            }
        });

        // Unset all relevant states to prevent interferance with other features once the folder has been launched
        setWindowsPayload(null);
        setShowPerformanceWarning(false);
    }
    
    // Open a specific folder
    const renderFolderManagerPopup = (): JSX.Element => {
        let render;

        if(createFolder === true){
            render = <FolderManager type="popup" title="Create folder" onClose={handleCloseFolderManager} />;
        } else {
            const targetFolder: Array<iFolderItem> = folderCollectionState.filter((item: iFolderItem) => editFolderId === item.id);
            const input: iFolderItem = {...targetFolder[0]};

            if(targetFolder.length > 0){
                render = <FolderManager type="popup" title={`Edit folder ${targetFolder[0].id}`} folder={input} onClose={handleCloseFolderManager} />;
            } else {
                render = <></>;
            } 
        }

        return render;
    }

    // Sort all folders
    const handleSortFolders = (e: any): void => {
        const newStatus = e.selected;

        saveToStorage("local", "folder_sort", newStatus);
        dispatch(setFoldersSortOrder(newStatus));
    }

    const folderSortCondition = (a: iFolderItem, b: iFolderItem): boolean => {
        const { folderSortOptionId } = folderSettingsState
        
        const aNameLowerCase = a.name.toLowerCase();
        const bNameToLowerCase = b.name.toLowerCase();

        return folderSortOptionId === 0 ? (aNameLowerCase > bNameToLowerCase) : (bNameToLowerCase > aNameLowerCase);
    }

    const renderSortOptionsDropdown = (): JSX.Element => {
        const optionsList: Array<iFieldOption> = [
            {id: 0, label: "Ascending"},
            {id: 1, label: "Descending"},
        ];

        const presetOption = optionsList.filter((option: iFieldOption) => option.id === folderSettingsState.folderSortOptionId);

        return <Dropdown tag="sort-folders" preset={presetOption[0] || optionsList[0]} options={optionsList} onCallback={handleSortFolders} />
    }

    const folderList = useMemo((): JSX.Element =>  {
        const handleFolderDelete = (target: iFolderItem): void => {
            chrome.storage.local.get("folderRemovalWarning", (data) => {
                if(data.folderRemovalWarning === true) {
                    setRemovalTarget(target);
                } else {
                    dispatch(deleteFolderAction(target.id)); 
                    setRemovalTarget(null);
                }
            });
        }

        const sortedFolders = folderCollectionState.sort((a: any, b: any) => folderSortCondition(a, b) ? 1 : -1);

        const result = sortedFolders.map((folder: iFolderItem, i: number) => {
            return (
                <FolderItem 
                    onDelete={(e) => handleFolderDelete(folder)} 
                    marked={false} 
                    //onMark={handleMarkFolder} 
                    onEdit={() => setEditFolderId(folder.id)} 
                    index={folderCollectionState.length-i}
                    key={`folder-id-${folder.id}`} 
                    type={folder.type} 
                    id={folder.id} 
                    viewMode="list" 
                    name={folder.name} 
                    desc={folder.desc} 
                    windows={folder.windows} 
                    onOpen={handlePrepareLaunchFolder}
                />
            );
        })
        return result.length > 0 ? <ul className="list-none">{result}</ul> : <p className="text-center">There are no folders at the moment.</p>
    }, [folderCollectionState, folderSettingsState.folderSortOptionId]) 

    const handleCloseFolderManager = (): void => {
        dispatch(clearMarkedFoldersAction());
        dispatch(clearInEditFolder());
        
        setEditFolderId(null);
        setCreateFolder(false);
    }   

    return (
        <>
            {showPerformanceWarning &&
                <PopupMessage
                    title="Warning" 
                    text={`You are about to open ${totalTabsCount} or more tabs at once. Opening this many may slow down your browser. Do you want to proceed?`}
                    primaryButton={{ 
                        text: "Yes, open selected folders", 
                        callback: () => { 
                            if(windowsPayload) handleLaunchFolder(windowsPayload); 
                            setShowPerformanceWarning(false)}
                        }}
                    secondaryButton={{ 
                        text: "No, do not open", 
                        callback: () => { 
                            setShowPerformanceWarning(false);
                            setWindowsPayload(null)
                        }}}    
                />
            }
            {removalTarget &&
                <PopupMessage
                    title="Warning" 
                    text={`You are about to remove the "${removalTarget.name}" folder and all its contents. This is irreversible, do you want to proceed?`}
                    primaryButton={{ 
                        text: "Yes, remove this folder", 
                        callback: () => { 
                            dispatch(deleteFolderAction(removalTarget.id)); 
                            setRemovalTarget(null)}
                        }}
                    secondaryButton={{ 
                        text: "No, don't remove", 
                        callback: () => { 
                            setRemovalTarget(null)
                        }
                    }}    
                />
            }
          
            {renderFolderManagerPopup()}
            <div className="flex justify-between mt-4 mb-6">
                
                <CircleButton 
                    disabled={false} 
                    bgCSSClass="bg-tbfColor-lightpurple" 
                    onClick={() => setCreateFolder(true)}
                >
                    <NewFolderIcon size={20} fill={"#fff"} />
                </CircleButton>
                <div className="relative w-[175px] flex items-center">
                    {renderSortOptionsDropdown()}
                </div>
            </div>
            <ul className="list-none">
                {folderList}
            </ul>
        </>
    )
}

export default FoldersView;