chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
    
chrome.runtime.onInstalled.addListener((details) => {
    if(details.reason === chrome.runtime.OnInstalledReason.INSTALL){
        // Set default settings to sync

        chrome.storage.local.set({
            "performanceWarningValue": 20,
            "duplicationWarningValue": 3,
            "closeSessionAtFolderLaunch": false,
            "showFolderChangeWarning": true,
            "folderRemovalWarning": true,
            "allowErrorLog": false,
            "expanded_sidebar": false
        })
    }
});
