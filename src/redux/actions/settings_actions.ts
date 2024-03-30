import {
    CHANGE_CANCELLATION_WARNING,
    CHANGE_DUPLICATION_WARNING,
    CHANGE_ERROR_LOG_SETTING,
    CHANGE_REMOVAL_WARNING,
    CHANGE_PERFORMANCE_NOTIFICATION,
    CHANGE_FOLDER_LAUNCH,
    READ_ALL_PLUGIN_SETTINGS
} from "../types/settings_types";


const changePerformanceNotification = (input: number) => {
    return {
        type: CHANGE_PERFORMANCE_NOTIFICATION,
        data: input
    }
}

const changeDuplicationWarnings = (input: number) => {
    return {
        type: CHANGE_DUPLICATION_WARNING,
        data: input
    }
}

const changeCloseAtLaunch = (input: boolean) => {
    return {
        type: CHANGE_FOLDER_LAUNCH,
        data: input
    }
}

const changeCancellationWarnings = (input: boolean) => {
    return {
        type: CHANGE_CANCELLATION_WARNING,
        data: input
    }
}

const changeRemovalWarning = (input: boolean) => {
    return {
        type: CHANGE_REMOVAL_WARNING,
        data: input
    }
}

const changeLogErrors = (input: boolean) => {
    return {
        type: CHANGE_ERROR_LOG_SETTING,
        data: input
    }
}
const readAllPluginSettings = (payload: any) => {
    return {
        type: READ_ALL_PLUGIN_SETTINGS,
        data: payload
    }
}

export {
    changePerformanceNotification,
    changeDuplicationWarnings,
    changeCloseAtLaunch,
    changeCancellationWarnings,
    changeRemovalWarning,
    changeLogErrors,
    readAllPluginSettings
}