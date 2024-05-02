import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Slice in which sidepanel settings are stored

const initialState: any = {
	view: "folders",
	isEditFolderInPanel: false
};

const sidepanelSlice = createSlice({
	name: "sidepanel_slice",
	initialState,
	reducers: {
		setPanelView: (state, action: PayloadAction<any>): any => {
			const { payload } = action;

			return {
				...state,
				view: payload
			};
		},
		setIsEditFolderInPanel: (state, action: PayloadAction<any>): any => {
			const { payload } = action;

			return {
				...state,
				isEditFolderInPanel: payload
			};
		}
	}
});

export const { setPanelView, setIsEditFolderInPanel } = sidepanelSlice.actions;
export default sidepanelSlice.reducer;
