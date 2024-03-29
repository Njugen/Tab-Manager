import { iFolderItem } from "../../interfaces/folder_item";
import { iTabItem } from "../../interfaces/tab_item";
import { EDIT_FOLDER, UPDATE_IN_EDIT_FOLDER, CLEAR_IN_EDIT_FOLDER, UPDATE_WINDOW_MANAGER } from "../types/in_edit_folders_types";

const folderManagerState: iFolderItem | null = null;

function folderManagerReducer(state = folderManagerState, action: any) {
    const { type, data } = action;

    if(type === EDIT_FOLDER){
        return {
            ...data
        }
    } else if(type === UPDATE_IN_EDIT_FOLDER){
        let stateClone = { ...state };

        if(stateClone && data){
            stateClone = {
                ...stateClone,
                [data[0]]: data[1]
            };
        }
  
        return {
            ...stateClone
        }
    } else if(type === CLEAR_IN_EDIT_FOLDER){
        return null;
    } else if(type === UPDATE_WINDOW_MANAGER){
        if(state === null) return state;

        let stateClone = { ...state };

        if(stateClone && data){
            const { windowId, payload } = data; 

            // Look for the window in inEditFolder store. If none, then create it.
            let targetIndex: number | null = null;
            const windowResult = stateClone.windows.filter((target, i) => {
                if(target.id === windowId) targetIndex = i;
                return target.id === windowId
            });
            
            if(windowResult?.length === 0){
                const currentWindowItems = stateClone.windows;
                const newWindowItem = {
                    id: windowId,
                    tabs: [payload],
                    initExpand: true
                }
                // window does not exist. Create it and add the tab (payload) into it
                stateClone = {
                    ...stateClone,
                    windows: [...currentWindowItems, newWindowItem]
                }
                
                return {
                    ...stateClone
                };
            } else {
     
                // window does exist. Push the tab to target window
               
                if(targetIndex !== null){

                    const tabs = windowResult[0].tabs;
                    
                    // Check whether or not a tab already exists. If it exists, then replace it with the new payload
                    const tabIndex: number = stateClone.windows[targetIndex].tabs.findIndex((tab: iTabItem) => tab.id === payload.id);
                    

                    stateClone = {
                        ...stateClone
                    }
    
                    stateClone.windows = [
                        ...stateClone.windows
                    ]
    
                    stateClone.windows[targetIndex] = {
                        ...stateClone.windows[targetIndex]
                    }

                    stateClone.windows[targetIndex].tabs = [
                        ...stateClone.windows[targetIndex].tabs
                    ];

                    if(tabIndex > -1){
                        stateClone.windows[targetIndex].tabs[tabIndex] = payload;               
                    } else {
                        stateClone.windows[targetIndex].tabs.push(payload);
                    }

                    return stateClone;
                    
                }

                
            }

        }
    }
    
    return state;
}

export {
    folderManagerReducer
}