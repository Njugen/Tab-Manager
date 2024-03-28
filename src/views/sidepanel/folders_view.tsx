import { useState, useEffect, useRef } from "react";
import { iWindowItem } from '../../interfaces/window_item';
import { useSelector, useDispatch } from "react-redux";
import { iFolderItem } from '../../interfaces/folder_item';
import FolderItem from "../../components/features/folder_item/folder_item";
import { getFromStorage, saveToStorage } from '../../services/webex_api/storage';
import { deleteFolderAction, readAllFoldersFromBrowserAction } from '../../redux/actions/folderCollectionActions';
import FolderManager from "../../components/features/folder_manager/folder_manager";
import { clearInEditFolder } from "../../redux/actions/inEditFolderActions";
import { clearMarkedFoldersAction } from "../../redux/actions/workspaceSettingsActions";
import PopupMessage from "../../components/utils/popup_message";
import PrimaryButton from "../../components/utils/primary_button/primary_button";
import iFoldersView from "../../interfaces/folders_view";
import NewFolderIcon from "../../images/icons/new_folder_icon";
import CircleButton from "../../components/utils/circle_button";

const FoldersView = (props: iFoldersView): JSX.Element => {
    const [editFolderId, setEditFolderId] = useState<number | null>(null);
    const [windowsPayload, setWindowsPayload] = useState<Array<iWindowItem> | null>(null);
    const [folderLaunchType, setFolderLaunchType] = useState<string | null>(null); 
    const [totalTabsCount, setTotalTabsCount] = useState<number>(0);
    const [showPerformanceWarning, setShowPerformanceWarning] = useState<boolean>(false);
    const [removalTarget, setRemovalTarget] = useState<iFolderItem | null>(null);
    const [createFolder, setCreateFolder] = useState<boolean>(false);

    const dispatch = useDispatch();
    const folderCollection = useSelector((state: any) => state.FolderCollectionReducer);

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

    useEffect(() => {        
        if(folderCollection.length > 0){
            //saveToStorage("local", "folders", folderCollection);
        } 
    }, [folderCollection]);

    useEffect(() => {
        
        if(!windowsPayload || !folderLaunchType) return;
        let tabsCount = 0;
        windowsPayload.forEach((window: iWindowItem) => {
            tabsCount += window.tabs.length;
        });
   
        chrome.storage.local.get("performance_notification_value", (data) => {
            setTotalTabsCount(data.performance_notification_value);
            if(data.performance_notification_value !== -1 && data.performance_notification_value <= tabsCount) {
                setShowPerformanceWarning(true);
            } else {
                handleLaunchFolder(windowsPayload);
            }
        });
    }, [folderLaunchType]);


    const handlePrepareLaunchFolder = (windows: Array<iWindowItem>, type: string): void => {
        setWindowsPayload(windows);
        setFolderLaunchType(type);
    }

    const handleLaunchFolder = (windows: Array<iWindowItem>): void => {
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
                incognito: folderLaunchType === "incognito" ? true : false
            }
            chrome.windows.create(windowSettings);
        });

        // Close current session after launching the folder. Only applies when
        // set in the Pettings page
        chrome.storage.local.get("close_current_setting", (data) => {
            if(data.close_current_setting === true){
                snapshot.forEach((window) => {
                    if(window.id) chrome.windows.remove(window.id);
                });
            }
        });

        // Unset all relevant states to prevent interferance with other features once the folder has been launched
        setWindowsPayload(null);
        setFolderLaunchType(null);
        setShowPerformanceWarning(false);
    }
    
    // Open a specific folder
    const renderFolderManagerPopup = (): JSX.Element => {
        let render;

        if(createFolder === true){
            render = <FolderManager type="popup" title="Create workspace" onClose={handleCloseFolderManager} />;
        } else {
            const targetFolder: Array<iFolderItem> = folderCollection.filter((item: iFolderItem) => editFolderId === item.id);
            const input: iFolderItem = {...targetFolder[0]};

            if(targetFolder.length > 0){
                render = <FolderManager type="popup" title={`Edit folder ${targetFolder[0].id}`} folder={input} onClose={handleCloseFolderManager} />;
            } else {
                render = <></>;
            } 
        }

        return render;
    }

    const renderFolders = (): Array<JSX.Element> => {
        const handleFolderDelete = (target: iFolderItem): void => {
            chrome.storage.local.get("removal_warning_setting", (data) => {
                if(data.removal_warning_setting === true) {
                    setRemovalTarget(target);
                } else {
                    dispatch(deleteFolderAction(target.id)); 
                    setRemovalTarget(null);
                }
            });
        }

        const result = folderCollection.map((folder: iFolderItem, i: number) => {
            return (
                <FolderItem 
                    onDelete={(e) => handleFolderDelete(folder)} 
                    marked={false} 
                    //onMark={handleMarkFolder} 
                    onEdit={() => setEditFolderId(folder.id)} 
                    index={folderCollection.length-i}
                    key={folder.id} 
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
        return result.length > 0 ? result : [<p className="text-center">There are no folders at the moment.</p>]
    } 

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
                    primaryButton={{ text: "Yes, open selected folders", callback: () => { windowsPayload && handleLaunchFolder(windowsPayload); setShowPerformanceWarning(false)}}}
                    secondaryButton={{ text: "No, do not open", callback: () => { setShowPerformanceWarning(false); setWindowsPayload(null);
                        setFolderLaunchType(null); setShowPerformanceWarning(false);}}}    
                />
            }
            {removalTarget &&
                <PopupMessage
                    title="Warning" 
                    text={`You are about to remove the "${removalTarget.name}" workspace and all its contents. This is irreversible, do you want to proceed?`}
                    primaryButton={{ text: "Yes, remove this folder", callback: () => { dispatch(deleteFolderAction(removalTarget.id)); setRemovalTarget(null)}}}
                    secondaryButton={{ text: "No, don't remove", callback: () => setRemovalTarget(null)}}    
                />
            }
          
            {renderFolderManagerPopup()}
            <div className="flex justify-end mx-2 mt-4 mb-6">
                <CircleButton 
                    disabled={false} 
                    bgCSSClass="bg-tbfColor-lightpurple" 
                    onClick={() => setCreateFolder(true)}
                >
                    <NewFolderIcon size={20} fill={"#fff"} />
                </CircleButton>
            </div>
            {renderFolders()}
        </>
    )
}

export default FoldersView;