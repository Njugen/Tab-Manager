import { useState, useEffect, useRef } from "react";
import { iWindowItem } from '../../interfaces/window_item';
import { useSelector } from "react-redux";
import { iFolderItem } from '../../interfaces/folder_item';
import FolderItem from "../../components/features/folder_item/folder_item";
import TabItem from "../../components/features/tab_item";
import GenericIconButton from "../../components/utils/generic_icon_button";
import { 
    filterSessionTabsByString, 
    filterHistoryTabsByString, 
    filterFoldersByString 
} from "../../tools/tab_filters";
import CloseIcon from "../../components/icons/close_icon";

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
    }

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
            //handleLaunchFolder(windowsPayload);
        });
    }, [folderLaunchType]);

    const folderCollectionState = useSelector((state: any) => state.folderCollectionReducer);
    const sessionSectionState = useSelector((state: any) => state.sessionSectionReducer);
    const historySectionState = useSelector((state: any) => state.historySectionReducer);

    // Render all filtered folders
    const renderFolders = (): Array<JSX.Element> => {
        const folders = filterFoldersByString(folderCollectionState, keyword);

        return folders.map((folder: iFolderItem) => <FolderItem marked={false} id={folder.id!} name={folder.name} viewMode={"list"} type={"collapsed"} desc={folder.desc} windows={folder.windows} onOpen={handlePrepareLaunchFolder} />);
    }

    // Render all filtered session tabs
    const renderSessionTabs = (): Array<JSX.Element> => {
        const tabs = filterSessionTabsByString(sessionSectionState, keyword);

        return tabs.map((tab) => <TabItem key={tab.id} marked={false} id={tab.id!} label={tab.title!} url={tab.url!} disableEdit={true} disableMark={true} disableCloseButton={false} onClose={() => handleCloseTab(tab.id!)} />)
    }

    // Render all filtered history tabs
    const renderHistoryTabs = (): Array<JSX.Element> => {
        const tabs = filterHistoryTabsByString(historySectionState, keyword);

        return tabs.map((tab) => <TabItem key={tab.id} marked={false} id={parseInt(tab.id)} label={tab.title!} url={tab.url!} disableEdit={true} disableMark={true} disableCloseButton={true} onClose={() => {}} />);
    }

    // Close a tab
    const handleCloseTab = (tabId: number) => {
        chrome.tabs.remove(tabId);
    }

    return (
        <>
            <div className="bg-white absolute top-20 z-[200] px-4 w-full">
                <div id="popup-header" className="pb-5 border-tbfColor-lgrey w-full flex justify-between">
                    <h1 data-testid="manage-folder-title" className="text-3xl text-tbfColor-darkpurple font-light inline-block">
                        Search Results
                    </h1>
                    <GenericIconButton icon="close" onClick={handleClose}>
                        <CloseIcon size={34} fill="rgba(0,0,0,0.2)" />
                    </GenericIconButton>
                </div>
                <div className="mt-4">
                    <h3 className="uppercase font-bold text-md mb-4 text-tbfColor-darkergrey">Folders</h3>
                    {renderFolders()}
                </div>
                <div className="mt-4">
                    <h3 className="uppercase font-bold text-md mb-4 text-tbfColor-darkergrey">Currently opened</h3>
                    {renderSessionTabs()}
                </div>
                <div className="mt-4">
                    <h3 className="uppercase font-bold text-md mb-4 text-tbfColor-darkergrey">History</h3>
                    {renderHistoryTabs()}
                </div>
            </div>
        </>
    )
}

export default SearchResultsContainer;