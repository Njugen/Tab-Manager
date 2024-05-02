import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import iHistoryState from "../../interfaces/states/history_state";

const initialState: iHistoryState = {
	tabs: [],
	markedTabs: [],
	tabSortOptionId: 0,
	viewMode: "grid",
	expanded: false
};

const historySlice = createSlice({
	name: "history_section_slice",
	initialState,
	reducers: {
		setUpTabs: (state, action: PayloadAction<Array<chrome.history.HistoryItem>>): iHistoryState => {
			const { payload } = action;

			return {
				...state,
				tabs: payload
			};
		},
		markTab: (state, action: PayloadAction<chrome.history.HistoryItem>): iHistoryState => {
			const { payload } = action;

			let currentlyMarkedTabs: Array<chrome.history.HistoryItem> = state.markedTabs || [];
			// Find whether or not the requested folder id is marked or not
			const payloadIsMarked = currentlyMarkedTabs.find((tab) => tab.id === payload.id);
			if (payloadIsMarked) {
				currentlyMarkedTabs = currentlyMarkedTabs.filter((tab) => tab.id !== payload.id);
			} else {
				currentlyMarkedTabs = [...currentlyMarkedTabs, payload];
			}

			return {
				...state,
				markedTabs: [...currentlyMarkedTabs]
			};
		},
		markMultipleTabs: (state, action: PayloadAction<Array<chrome.history.HistoryItem>>): iHistoryState => {
			const { payload } = action;

			return {
				...state,
				markedTabs: [...state.markedTabs, ...payload]
			};
		},
		unMarkAllTabs: (state): iHistoryState => {
			return {
				...state,
				markedTabs: []
			};
		},
		changeSortOption: (state, action: PayloadAction<number>): iHistoryState => {
			const { payload } = action;

			return {
				...state,
				tabSortOptionId: payload
			};
		},
		changeViewMode: (state, action: PayloadAction<"grid" | "list">): iHistoryState => {
			const { payload } = action;

			return {
				...state,
				viewMode: payload
			};
		}
	}
});

export const { setUpTabs, markTab, markMultipleTabs, unMarkAllTabs, changeSortOption, changeViewMode } =
	historySlice.actions;
export default historySlice.reducer;
