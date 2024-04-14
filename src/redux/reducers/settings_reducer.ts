import {
    CHANGE_CANCELLATION_WARNING,
    CHANGE_DUPLICATION_WARNING,
    CHANGE_ERROR_LOG_SETTING,
    CHANGE_REMOVAL_WARNING,
    CHANGE_PERFORMANCE_NOTIFICATION,
    CHANGE_FOLDER_LAUNCH,
    READ_ALL_PLUGIN_SETTINGS
} from "../types/settings_types";

interface iPluginSettings {
    performanceWarningValue: number | null,
    duplicationWarningValue: number | null,
    closeSessionAtFolderLaunch: boolean,
    showFolderChangeWarning: boolean,
    folderRemovalWarning: boolean,
    allowErrorLog: boolean
}

const settingsState: iPluginSettings = {
    performanceWarningValue: 0,
    duplicationWarningValue: 0,
    closeSessionAtFolderLaunch: false,
    showFolderChangeWarning: false,
    folderRemovalWarning: false,
    allowErrorLog: false
}

const pluginSettingsReducer = (state: iPluginSettings = settingsState, action: any): iPluginSettings => {
    const { type, data } = action;
    
    if(type === CHANGE_PERFORMANCE_NOTIFICATION){
        return {
            ...state,
            performanceWarningValue: data
        }
    } else if(type === CHANGE_DUPLICATION_WARNING){
        return {
            ...state,
            duplicationWarningValue: data
        }
    } else if(type === CHANGE_FOLDER_LAUNCH){
        return {
            ...state,
            closeSessionAtFolderLaunch: data
        }
    } else if(type === CHANGE_CANCELLATION_WARNING){
        return {
            ...state,
            showFolderChangeWarning: data
        }
    } else if(type === CHANGE_REMOVAL_WARNING){
        return {
            ...state,
            folderRemovalWarning: data
        }
    } else if(type === CHANGE_ERROR_LOG_SETTING){
        return {
            ...state,
            allowErrorLog: data
        }
    } else if(type === READ_ALL_PLUGIN_SETTINGS){
        return {...data}
    }

    return state;
};

export { pluginSettingsReducer, iPluginSettings };