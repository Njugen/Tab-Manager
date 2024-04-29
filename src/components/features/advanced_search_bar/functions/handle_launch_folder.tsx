import React from "react";
import { iWindowItem } from "../../../../interfaces/window_item";

interface iLaunchFolderArgs {
    folderLaunchType?: string | null,
    windowsPayload: Array<iWindowItem> | null,
    setWindowsPayload: React.Dispatch<React.SetStateAction<iWindowItem[] | null>>,
    setFolderLaunchType: React.Dispatch<React.SetStateAction<string | null>>,
    setShowPerformanceWarning: React.Dispatch<React.SetStateAction<boolean>>
}

// Event handler showing all the launching options of a folder
const handleLaunchFolder = (args: iLaunchFolderArgs): void => {
    const { 
        folderLaunchType, 
        windowsPayload, 
        setWindowsPayload, 
        setFolderLaunchType, 
        setShowPerformanceWarning 
    } = args;

    if(!windowsPayload) return;

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

    if(folderLaunchType !== "group"){
        // Open all windows in this folder
        windowsPayload.forEach((window: iWindowItem, i) => {
            const windowSettings = {
                focused: i === 0 ? true : false,
                url: window.tabs.map((tab) => tab.url),
                incognito: folderLaunchType === "incognito" ? true : false
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

        windowsPayload.forEach((window: iWindowItem, i) => {
            window.tabs.forEach((tab) => {
                chrome.tabs.create({ url: tab.url}, (createdTab: chrome.tabs.Tab) => {
                    
                    if(createdTab.id){
                        tabIds = [...tabIds, createdTab.id]
                    }
                })
            })
        });

        setTimeout(() => chrome.tabs.group({ tabIds: tabIds }), 3000);
    }

    // Unset all relevant states to prevent interferance with other features once the folder has been launched
    setWindowsPayload(null);
    setFolderLaunchType(null);
    setShowPerformanceWarning(false);
}

export { handleLaunchFolder, iLaunchFolderArgs };