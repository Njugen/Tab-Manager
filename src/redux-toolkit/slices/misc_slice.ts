import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { iFolderItem } from "../../interfaces/folder_item"
import iFolderState from "../../interfaces/states/folder_state"
import iCurrentSessionState from "../../interfaces/states/current_session_state"
import { iWindowItem } from "../../interfaces/window_item"


// Slice in which uncategorized/temporary values needs to be stored

const initialState: any = {
    tabBeingEdited: 0,
    currentlyEditingTab: false
}

const miscSlice = createSlice({
    name: "misc_section_slice",
    initialState,
    reducers: {
        setCurrentTabEdits: (state, action: PayloadAction<number>): any => {
            const { payload } = action;

            return {
                ...state,
                tabBeingEdited: payload
            }
        },
        setIsEditingTab: (state, action: PayloadAction<boolean>): any => {
            const { payload } = action;

            return {
                ...state,
                currentlyEditingTab: payload
            }
        },
    },
})

export const { 
    setCurrentTabEdits,
    setIsEditingTab
} = miscSlice.actions;
export default miscSlice.reducer;