import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import iCurrentSessionState from "../../interfaces/states/current_session_state";

const initialState: iCurrentSessionState = {
	windows: [],
	markedWindows: [],
	markedTabs: [],
	tabsSort: "asc",
	viewMode: "grid"
};

const sessionSectionSlice = createSlice({
	name: "session_section_slice",
	initialState,
	reducers: {
		setUpWindows: (state, action: PayloadAction<Array<chrome.windows.Window>>): iCurrentSessionState => {
			const { payload } = action;

			return {
				...state,
				windows: payload
			};
		},
		changeSortOption: (state, action: PayloadAction<string>): iCurrentSessionState => {
			const { payload } = action;

			return {
				...state,
				tabsSort: payload
			};
		},
		deletTabs: (state, action: PayloadAction<Array<number>>): iCurrentSessionState => {
			const { payload } = action;

			return {
				...state
			};
		},
		markTabs: (state, action: PayloadAction<Array<chrome.tabs.Tab>>): iCurrentSessionState => {
			const { payload } = action;

			return {
				...state,
				markedTabs: [...payload]
			};
		}
	}
});

export const { setUpWindows, changeSortOption, deletTabs, markTabs } = sessionSectionSlice.actions;
export default sessionSectionSlice.reducer;
