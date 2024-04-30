import { useState, useEffect, useRef } from "react";
import { iWindowItem } from '../../interfaces/window_item';
import { useSelector } from "react-redux";
import { iFolderItem } from '../../interfaces/folder_item';
import FolderItem from "../../components/features/folder_item/folder_item";
import TabItem from "../../components/features/tab_item";
import { 
    filterSessionTabsByString, 
    filterHistoryTabsByString, 
    filterFoldersByString 
} from "../../tools/tab_filters";
import CloseIcon from "../../components/icons/close_icon";
import iCurrentSessionState from "../../interfaces/states/current_session_state";
import styles from "../../styles/global_utils.module.scss";
import PopupMessage from "../../components/utils/popup_message";

function SearchResultsContainer(props:any): JSX.Element {
    const { keyword, onClose } = props;
    const [windowsPayload, setWindowsPayload] = useState<Array<iWindowItem> | null>(null);
    const [folderLaunchType, setFolderLaunchType] = useState<string | null>(null); 
    const [totalTabsCount, setTotalTabsCount] = useState<number>(0);
    const [showPerformanceWarning, setShowPerformanceWarning] = useState<boolean>(false);
    
    const handleClose = (): void => {
        onClose();
    }

    const handlePrepareLaunchFolder = (windows: Array<iWindowItem>, type: string): void => {
        setFolderLaunchType(type);
        setWindowsPayload(windows);
        evaluatePerformanceWarning(type, windows);
    }

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
                    console.log("TABS", tab);
                    chrome.tabs.create({ url: tab.url }, (createdTab: chrome.tabs.Tab) => {             
                        if(createdTab.id){
                            tabIds = [...tabIds, createdTab.id]
                        }
                        console.log("ABC", windows.length, window.tabs.length);
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

    useEffect(() => {
        
        if(!windowsPayload || !folderLaunchType) return;

        let tabsCount = 0;
        
        windowsPayload.forEach((window: iWindowItem) => {
            tabsCount += window.tabs.length;
        });
   
        chrome.storage.local.get("performanceWarningValue", (data) => {
            setTotalTabsCount(data.performanceWarningValue);

            if(data.performanceWarningValue !== -1 && data.performanceWarningValue <= tabsCount) {
                setShowPerformanceWarning(true);
            } else {
                handleLaunchFolder(windowsPayload);
            }
        });
    }, [folderLaunchType]);

    const folderState: Array<iFolderItem> = useSelector((state: any) => state.folder);
    const sessionSectionState: iCurrentSessionState = useSelector((state: any) => state.sessionSection);
    const historySectionState = useSelector((state: any) => state.historySection);

    // Render all filtered folders
    const renderFolders = (): Array<JSX.Element> => {
        const folders = filterFoldersByString(folderState, keyword);

        return folders.map((folder: iFolderItem) => <FolderItem key={`folder-id-${folder.id}`} marked={false} id={folder.id!} name={folder.name} viewMode={"list"} type={"collapsed"} desc={folder.desc} windows={folder.windows} onOpen={handlePrepareLaunchFolder} />);
    }

    // Render all filtered session tabs
    const renderSessionTabs = (): Array<JSX.Element> => {
        const tabs = filterSessionTabsByString(sessionSectionState, keyword);

        return tabs.map((tab) => <TabItem key={`session-tab-id-${tab.id}`} marked={false} id={tab.id!} label={tab.title!} url={tab.url!} onClose={() => handleCloseTab(tab.id!)} />)
    }

    // Render all filtered history tabs
    const renderHistoryTabs = (): Array<JSX.Element> => {
        const tabs = filterHistoryTabsByString(historySectionState, keyword);

        return tabs.map((tab) => <TabItem key={`history-tab-id-${tab.id}`} marked={false} id={parseInt(tab.id)} label={tab.title!} url={tab.url!}  onClose={() => {}} />);
    }

    // Close a tab
    const handleCloseTab = (tabId: number) => {
        chrome.tabs.remove(tabId);
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
                            if(windowsPayload) handleLaunchFolder(windowsPayload, folderLaunchType || undefined); 
                            setShowPerformanceWarning(false)
                        }
                    }}
                    secondaryButton={{ 
                        text: "No, do not open", 
                        callback: () => { 
                            setShowPerformanceWarning(false); 
                            setWindowsPayload(null)}}}     
                />
            }
            <div data-testid="sidepanel-search-results" className="bg-white absolute top-20 z-[200] px-4 w-full">
                <div id="popup-header" className="pb-5 border-tbfColor-lgrey w-full flex justify-between">
                    <header>
                        <h1 data-testid="manage-folder-title" className="text-3xl text-tbfColor-darkpurple font-light inline-block">
                            Search Results
                        </h1>
                    </header>
                    <button className={`${styles.opacity_hover_effect} m-1`} onClick={handleClose}>
                        <CloseIcon size={34} fill="rgba(0,0,0,0.2)" />
                    </button>
                </div>
                <section data-testid="folders-search-result" className="mt-4">
                    <h3 className="uppercase font-bold text-md mb-4 text-tbfColor-darkergrey">Folders</h3>
                    <ul className="list-none">
                        {
                            renderFolders()
                        }
                    </ul>
                </section>
                <section data-testid="current-tabs-search-result" className="mt-4">
                    <h3 className="uppercase font-bold text-md mb-4 text-tbfColor-darkergrey">Currently opened</h3>
                    <ul className="list-none">
                        {
                            renderSessionTabs()
                        }
                    </ul>
                </section>
                <section data-testid="history-tabs-search-result" className="mt-4">
                    <h3 className="uppercase font-bold text-md mb-4 text-tbfColor-darkergrey">History</h3>
                    <ul className="list-none">
                        {
                            renderHistoryTabs()
                        }
                    </ul>
                </section>
            </div>
        </>
    )
}

export default SearchResultsContainer;