import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { iFolderItem } from "../../interfaces/folder_item"
import iFolderState from "../../interfaces/states/folder_state"
import iCurrentSessionState from "../../interfaces/states/current_session_state"
import { iWindowItem } from "../../interfaces/window_item"
import { iTabItem } from "../../interfaces/tab_item"

const initialState: iFolderItem = {
    id: -1,
    name: "",
    desc: "",
    marked: false,
    type: "collapsed",
    viewMode: "list",
    windows: []
};

const folderManagementSlice = createSlice({
    name: "folder_management_slice",
    initialState,
    reducers: {
        setUpFolder: (state, action: PayloadAction<iFolderItem>): iFolderItem => {
            const { payload } = action;

            return {
                ...payload
            }
        },
        updateFolder: (state, action: PayloadAction<any>): iFolderItem => {
            const { payload } = action;

            return {
                ...state,
                [payload[0]]: payload[1]
            }
        },
        updateWindowList: (state, action: PayloadAction<{ windowId: number, targetTab: iTabItem }>): iFolderItem => {
            const { payload } = action;
            let tempState: iFolderItem = state;

            if(tempState && payload){
                const { windowId, targetTab } = payload;
                

                // Look for the window in tempState. If none, then create it.
                let targetWindowIndex: number | null = null;
                
                const filteredWindows: Array<iWindowItem> = tempState.windows.filter((testSubject, i) => {
                    // testSubject refers to the window to compare the payload's windowId to
                    if(testSubject.id === windowId){
                        targetWindowIndex = i;
                    }
                    return windowId === testSubject.id
                });

                if(filteredWindows?.length === 0){
                    // If the list of filtered windows is 0, then no such window has been found.
                    // Now, we start CREATING a window with this windowId, and add the target tab into it

                    const newWindow: iWindowItem = {
                        id: windowId,
                        tabs: [targetTab],
                    }

                    return {
                        ...tempState,
                        windows: [...tempState.windows, newWindow]
                    }
                } else {
                    // If the list of filtered windows is 1, then the target window exists.
                    // Now, proceed to adding or replacing tabs

                    if(targetWindowIndex !== null){
                        // Check whether or not the 'targetTab' exists in the target window.
                        const targetTabIndex: number = tempState.windows[targetWindowIndex].tabs.findIndex((tab: iTabItem) => {
                            return tab.id === targetTab.id;
                        })

                        
                        if(targetTabIndex > -1){
                            // If so, then replace its contents with the new one.
                            tempState.windows[targetWindowIndex].tabs[targetTabIndex] = targetTab;
                        } else {
                            // If not, then add the target tab to the window's tab list
                            tempState.windows[targetWindowIndex].tabs.push(targetTab);
                        }

                        return state
                    }

                    
                }
            }
            
            return state;
        }
    },
})

export const { 
    setUpFolder,
    updateFolder,
    updateWindowList,

} = folderManagementSlice.actions;
export default folderManagementSlice.reducer;