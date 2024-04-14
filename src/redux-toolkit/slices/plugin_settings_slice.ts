import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { iFolderItem } from "../../interfaces/folder_item"
import iFolderState from "../../interfaces/states/folder_state"
import iCurrentSessionState from "../../interfaces/states/current_session_state"
import { iWindowItem } from "../../interfaces/window_item"

interface iPluginSettings {
    performanceWarningValue: number | null,
    duplicationWarningValue: number | null,
    closeSessionAtFolderLaunch: boolean,
    showFolderChangeWarning: boolean,
    folderRemovalWarning: boolean,
    allowErrorLog: boolean
}

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
                folderRemovalWarning: payload
            }
        },
    },
})

export const { 

} = pluginSettingsSlice.actions;
export default pluginSettingsSlice.reducer;