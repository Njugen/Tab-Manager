import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import iHistoryState from "../../interfaces/states/history_state"

const initialState: iHistoryState = {
    tabs: [],
    markedTabs: [],
    tabSortOptionId: 0,
    viewMode: "grid",
    expanded: false
}

const historySlice = createSlice({
    name: "history_section_slice",
    initialState,
    reducers: {
        setUpTabs: (state, action: PayloadAction<Array<chrome.history.HistoryItem>>): iHistoryState => {
            const { payload } = action;

            return {
                ...state,
                tabs: payload
            }
        },
        markTabs: (state, action: PayloadAction<Array<chrome.history.HistoryItem>>): iHistoryState => {
            const { payload } = action;

            return {
                ...state,
                markedTabs: [...payload]
            }
        },
        markMultipleTabs: (state, action: PayloadAction<Array<chrome.history.HistoryItem>>): iHistoryState => {
            const { payload } = action;

            return {
                ...state,
                markedTabs: [...payload]
            }
        },
        unMarkAllTabs: (state): iHistoryState => {
            return {
                ...state,
                markedTabs: []
            }
        },
        changeSortOption: (state, action: PayloadAction<number>): iHistoryState => {
            const { payload } = action;

            return {
                ...state,
                tabSortOptionId: payload
            }
        },
        changeViewMode: (state, action: PayloadAction<"grid" | "list">): iHistoryState => {
            const { payload } = action;

            return {
                ...state,
                viewMode: payload
            }
        }
    },
})

export const { 
    setUpTabs,
    markTabs,
    markMultipleTabs,
    unMarkAllTabs,
    changeSortOption,
    changeViewMode
} = historySlice.actions;
export default historySlice.reducer;