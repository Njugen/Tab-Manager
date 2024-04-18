import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { iFolderItem } from "../../interfaces/folder_item"
import iFolderState from "../../interfaces/states/folder_state"
import iCurrentSessionState from "../../interfaces/states/current_session_state"
import { iWindowItem } from "../../interfaces/window_item"
import iPluginSettings from './../../interfaces/states/plugin_settings_state';


const initialState: iPluginSettings = {
    performanceWarningValue: 0,
    duplicationWarningValue: 0,
    closeSessionAtFolderLaunch: false,
    showFolderChangeWarning: false,
    folderRemovalWarning: false,
    allowErrorLog: false
}

const pluginSettingsSlice = createSlice({
    name: "plugin_settings_slice",
    initialState,
    reducers: {
        readAllPluginSettings: (state, action: PayloadAction<iPluginSettings>): iPluginSettings => {
            const { payload } = action;

            return {
                ...payload
            }
        },
        changePerformanceWarningValue: (state, action: PayloadAction<number>): iPluginSettings => {
            const { payload } = action;

            return {
                ...state,
                performanceWarningValue: payload
            }
        },
        changeDuplicationWarningValue: (state, action: PayloadAction<number>): iPluginSettings => {
            const { payload } = action;

            return {
                ...state,
                duplicationWarningValue: payload
            }
        },
        changeCloseSession: (state, action: PayloadAction<boolean>): iPluginSettings => {
            const { payload } = action;

            return {
                ...state,
                closeSessionAtFolderLaunch: payload
            }
        },
        changeShowFolderChangeWarning: (state, action: PayloadAction<boolean>): iPluginSettings => {
            const { payload } = action;

            return {
                ...state,
                showFolderChangeWarning: payload
            }
        },
        changeFolderRemovalWarning: (state, action: PayloadAction<boolean>): iPluginSettings => {
            const { payload } = action;

            return {
                ...state,
                folderRemovalWarning: payload
            }
        },
        allowErrorLog: (state, action: PayloadAction<boolean>): iPluginSettings => {
            const { payload } = action;

            return {
                ...state,
                allowErrorLog: payload
            }
        },
    },
})

export const { 
    readAllPluginSettings,
    changePerformanceWarningValue,
    changeDuplicationWarningValue,
    changeCloseSession,
    changeShowFolderChangeWarning,
    changeFolderRemovalWarning,
    allowErrorLog
} = pluginSettingsSlice.actions;
export default pluginSettingsSlice.reducer;