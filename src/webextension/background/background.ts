chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.runtime.onInstalled.addListener((details) => {
    if(details.reason === chrome.runtime.OnInstalledReason.INSTALL){
        // Set default settings to sync

        chrome.storage.local.set({
            "performance_notification_value": 20,
            "duplication_warning_value": 3,
            "close_current_setting": false,
            "cancellation_warning_setting": true,
            "removal_warning_setting": true,
            "error_log_setting": false,
            "expanded_sidebar": false
        })
    }
});