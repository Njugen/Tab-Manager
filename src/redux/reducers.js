import { createStore, applyMiddleware } from "redux";
import { combineReducers } from "redux";
import thunk from "redux-thunk";
import { folderCollectionReducer } from "./reducers/folder_collection_reducer";
import { folderManagerReducer } from "./reducers/in_edit_folder_reducer";
import { WarningActionsReducer } from "./reducers/warning_actions_reducer";
import { folderSettingsReducer } from "./reducers/folder_settings_reducer";
import { historySectionReducer } from "./reducers/history_settings_reducer";
import { sessionSectionReducer } from "./reducers/current_session_reducer";
import { miscReducer } from "./reducers/misc_reducer";
import { pluginSettingsReducer } from "./reducers/settings_reducer";

const combinedReducers = combineReducers({
    folderCollectionReducer: folderCollectionReducer,
    folderManagerReducer: folderManagerReducer,
    WarningActionsReducer: WarningActionsReducer,
    folderSettingsReducer: folderSettingsReducer,
    historySectionReducer: historySectionReducer,
    sessionSectionReducer: sessionSectionReducer,
    pluginSettingsReducer: pluginSettingsReducer,
    miscReducer: miscReducer
});

const middleware = applyMiddleware(thunk);
const store = createStore(combinedReducers, middleware);
store.subscribe(()=>{});

const mockStore = () => {
    const middleware = applyMiddleware(thunk);
    const temp = createStore(combinedReducers, middleware);
    temp.subscribe(()=>{});
    return temp;
}

export { store, mockStore, combinedReducers }