import { useState, useEffect, useRef, useMemo } from "react";
import { iWindowItem } from '../../interfaces/window_item';
import { useSelector, useDispatch } from "react-redux";
import { iFolderItem } from '../../interfaces/folder_item';
import FolderItem from "../../components/features/folder_item/folder_item";
import { getFromStorage, saveToStorage } from '../../services/webex_api/storage';
import FolderManager from "../../components/features/folder_manager/folder_manager";
import PopupMessage from "../../components/utils/popup_message";
import PrimaryButton from "../../components/utils/primary_button/primary_button";
import NewFolderIcon from "../../components/icons/new_folder_icon";
import CircleButton from "../../components/utils/circle_button";
import Dropdown from "../../components/utils/dropdown/dropdown";
import { iFieldOption } from "../../interfaces/dropdown";
import iFolderState from "../../interfaces/states/folder_state";
import { deleteFolder, readAllStorageFolders } from "../../redux-toolkit/slices/folder_slice";
import { changeSortOption, unMarkAllFolders } from "../../redux-toolkit/slices/folders_section_slice";

const FoldersView = (props: any): JSX.Element => {
    const [editFolderId, setEditFolderId] = useState<number | null>(null);
    const [windowsPayload, setWindowsPayload] = useState<Array<iWindowItem> | null>(null);
    const [totalTabsCount, setTotalTabsCount] = useState<number>(0);
    const [showPerformanceWarning, setShowPerformanceWarning] = useState<boolean>(false);
    const [removalTarget, setRemovalTarget] = useState<iFolderItem | null>(null);
    const [createFolder, setCreateFolder] = useState<boolean>(false);
    const [folderLaunchType, setFolderLaunchType] = useState<string | null>(null); 

    const dispatch = useDispatch();

    const folderState: Array<iFolderItem> = useSelector((state: any) => state.folder);
    const foldersSectionState: iFolderState = useSelector((state: any) => state.foldersSection);

    const storageListener = (changes: any, areaName: string): void => {
        if(areaName === "local"){
            if(changes.folders){
              dispatch(readAllStorageFolders(changes.folders.newValue));
            }
        }
    };

    useEffect(() => {
        getFromStorage("local", "folders", (data) => {  
            dispatch(readAllStorageFolders(data.folders));
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
                setFolderLaunchType(type);
            } else {
                handleLaunchFolder(windows, type);
            }
        });
    }

    const handlePrepareLaunchFolder = (windows: Array<iWindowItem>, type: string): void => {
        setWindowsPayload(windows);
        evaluatePerformanceWarning(type, windows);
    }

    // Launch folder
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

        if(launchType !== "group"){
            // Open all windows in this folder
            windows.forEach((window: iWindowItem, i) => {
                const windowSettings: chrome.windows.CreateData = {
                    focused: i === 0 ? true : false,
                    url: window.tabs.map((tab) => tab.url),
                    incognito: launchType === "incognito" ? true : false,
                    state: "maximized"
                }
                chrome.windows.create(windowSettings);
            });

            // Close current session after launching the folder. Only applies when
            // set in the plugin's settings
            chrome.storage.local.get("closeSessionAtFolderLaunch", (data) => {
                if(data.closeSessionAtFolderLaunch === true){
                    snapshot.forEach((window) => {
                        if(window.id) chrome.windows.remove(window.id);
                    });
                }
            });
        } else {
            let tabIds: Array<number> = [];
            
            windows.forEach((window: iWindowItem, i) => {
                
                window.tabs.forEach((tab, j) => {
                    chrome.tabs.create({ url: tab.url }, (createdTab: chrome.tabs.Tab) => {             
                        if(createdTab.id){
                            tabIds = [...tabIds, createdTab.id]
                        }
                        
                        if(windows.length-1 >= i && window.tabs.length-1 >= j){
                            chrome.tabs.group({ tabIds: tabIds });
                        }
                    })
                })
            });
        }

        // Unset all relevant states to prevent interferance with other features once the folder has been launched
        setWindowsPayload(null);
        setShowPerformanceWarning(false);
        setFolderLaunchType(null);
    }
    
    // Open a specific folder
    const renderFolderManagerPopup = (): JSX.Element => {
        let render;

        if(createFolder === true){
            render = <FolderManager type="slide-in" title="Create folder" onClose={handleCloseFolderManager} />;
        } else {
            const targetFolder: Array<iFolderItem> = folderState.filter((item: iFolderItem) => editFolderId === item.id);
            const input: iFolderItem = {...targetFolder[0]};

            if(targetFolder.length > 0){
                render = <FolderManager type="slide-in" title={`Edit folder ${targetFolder[0].id}`} folder={input} onClose={handleCloseFolderManager} />;
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
        
        dispatch(changeSortOption(newStatus));
    }

    const folderSortCondition = (a: iFolderItem, b: iFolderItem): boolean => {
        const { folderSortOptionValue } = foldersSectionState
        
        const aNameLowerCase = a.name.toLowerCase();
        const bNameToLowerCase = b.name.toLowerCase();
        
        return folderSortOptionValue === 0 ? (aNameLowerCase > bNameToLowerCase) : (bNameToLowerCase > aNameLowerCase);
    }

    const renderSortOptionsDropdown = (): JSX.Element => {
        const optionsList: Array<iFieldOption> = [
            {value: 0, label: "Ascending"},
            {value: 1, label: "Descending"},
        ];

        const presetOption = optionsList.filter((option: iFieldOption) => option.value === foldersSectionState.folderSortOptionValue);
        return <Dropdown tag="sort-folders" preset={presetOption[0] || optionsList[0]} options={optionsList} onCallback={handleSortFolders} />
    }

    const folderList = useMemo((): JSX.Element =>  {
        const handleFolderDelete = (target: iFolderItem): void => {
            chrome.storage.local.get("folderRemovalWarning", (data) => {
                if(data.folderRemovalWarning === true) {
                    setRemovalTarget(target);
                } else {
                    dispatch(deleteFolder(target.id)); 
                    setRemovalTarget(null);
                }
            });
        }

        const sortedFolders = [...folderState].sort((a: any, b: any) => folderSortCondition(a, b) ? 1 : -1);

        const result = sortedFolders.map((folder: iFolderItem, i: number) => {
            return (
                <FolderItem 
                    onDelete={(e) => handleFolderDelete(folder)} 
                    marked={false} 
                    //onMark={handleMarkFolder} 
                    onEdit={() => setEditFolderId(folder.id)} 
                    index={folderState.length-i}
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
    }, [folderState, foldersSectionState.folderSortOptionValue]) 

    const handleCloseFolderManager = (): void => {
        //dispatch(clearMarkedFoldersAction());
        //dispatch(clearInEditFolder());
        dispatch(unMarkAllFolders());

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
                        text: "Yes, open", 
                        callback: () => { 
                            if(windowsPayload) handleLaunchFolder(windowsPayload, folderLaunchType || undefined); 
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
                            dispatch(deleteFolder(removalTarget.id)); 
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