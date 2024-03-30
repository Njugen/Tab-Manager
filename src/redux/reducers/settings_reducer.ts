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
    performance_notification_value: number | null,
    duplication_warning_value: number | null,
    close_current_setting: boolean,
    cancellation_warning_setting: boolean,
    removal_warning_setting: boolean,
    error_log_setting: boolean
}

const settingsState: iPluginSettings = {
    performance_notification_value: 0,
    duplication_warning_value: 0,
    close_current_setting: false,
    cancellation_warning_setting: false,
    removal_warning_setting: false,
    error_log_setting: false
}

const pluginSettingsReducer = (state: iPluginSettings = settingsState, action: any): iPluginSettings => {
    const { type, data } = action;
    
    if(type === CHANGE_PERFORMANCE_NOTIFICATION){
        return {
            ...state,
            performance_notification_value: data
        }
    } else if(type === CHANGE_DUPLICATION_WARNING){
        return {
            ...state,
            duplication_warning_value: data
        }
    } else if(type === CHANGE_FOLDER_LAUNCH){
        return {
            ...state,
            close_current_setting: data
        }
    } else if(type === CHANGE_CANCELLATION_WARNING){
        return {
            ...state,
            cancellation_warning_setting: data
        }
    } else if(type === CHANGE_REMOVAL_WARNING){
        return {
            ...state,
            removal_warning_setting: data
        }
    } else if(type === CHANGE_ERROR_LOG_SETTING){
        return {
            ...state,
            error_log_setting: data
        }
    } else if(type === READ_ALL_PLUGIN_SETTINGS){
        return {...data}
    }

    return state;
};

export { pluginSettingsReducer, iPluginSettings };