import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Slice in which uncategorized/temporary values needs to be stored

const initialState: any = {
	tabBeingEdited: 0,
	currentlyEditingTab: false,
	scrollTrigger: 0
};

const miscSlice = createSlice({
	name: "misc_section_slice",
	initialState,
	reducers: {
		setCurrentTabEdits: (state, action: PayloadAction<number>): any => {
			const { payload } = action;

			return {
				...state,
				tabBeingEdited: payload
			};
		},
		setIsEditingTab: (state, action: PayloadAction<boolean>): any => {
			const { payload } = action;

			return {
				...state,
				currentlyEditingTab: payload
			};
		},
		smoothScrollUp: (state, action: PayloadAction<null>): any => {
			return {
				...state,
				scrollTrigger: state.scrollTrigger + 1
			};
		}
	}
});

export const { setCurrentTabEdits, setIsEditingTab, smoothScrollUp } = miscSlice.actions;
export default miscSlice.reducer;
