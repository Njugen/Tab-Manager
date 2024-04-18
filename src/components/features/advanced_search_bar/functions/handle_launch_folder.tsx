import React from "react";
import { iWindowItem } from "../../../../interfaces/window_item";
import iLaunchFolderProps from "../../../../interfaces/launch_folder_props";

// Event handler showing all the launching options of a folder
const handleLaunchFolder = (props: iLaunchFolderProps): void => {
    const { 
        folderLaunchType, 
        windowsPayload, 
        setWindowsPayload, 
        setFolderLaunchType, 
        setShowPerformanceWarning 
    } = props;

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

    // Open all windows in this folder
    windowsPayload.forEach((window: iWindowItem, i) => {
        const windowSettings = {
            focused: i === 0 ? true : false,
            url: window.tabs.map((tab) => tab.url),
            incognito: folderLaunchType === "incognito" ? true : false
        }
        chrome.windows.create(windowSettings);
    });

    // Close current session after launching the folder. Only applies when the
    // set in the Settings page. Launching windows stored in the snapshot
    chrome.storage.local.get("closeSessionAtFolderLaunch", (data) => {
        if(data.closeSessionAtFolderLaunch === true){
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

export { handleLaunchFolder };