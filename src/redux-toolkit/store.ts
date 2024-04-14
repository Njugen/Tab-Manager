import { configureStore } from "@reduxjs/toolkit";
import folderManagementReducer from "./slices/folder_management_slice";
import folderReducer from "./slices/folder_slice";
import foldersSectionReducer from "./slices/folders_section_slice";
import historySectionReducer from "./slices/history_section_slice";
import miscReducer from "./slices/misc_slice";
import sessionSectionReducer from "./slices/session_section_slice";
import pluginSettingsReducer from "./slices/plugin_settings_slice";

export const store = configureStore({
    reducer: {
        folderManagement: folderManagementReducer,
        folder: folderReducer,
        foldersSection: foldersSectionReducer,
        sessionSection: sessionSectionReducer,
        historySection: historySectionReducer,
        misc: miscReducer,
        pluginSettings: pluginSettingsReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;