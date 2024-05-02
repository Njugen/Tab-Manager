import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import iFolderState from "../../interfaces/states/folder_state";
import purify from "../../tools/purify_object";

const initialState: iFolderState = {
	markedFoldersId: [],
	folderSortOptionValue: 0,
	viewMode: "grid"
};

const foldersSectionSlice = createSlice({
	name: "folders_section_slice",
	initialState,
	reducers: {
		markFolder: (state, action: PayloadAction<number>): iFolderState => {
			const { payload } = action;

			let currentlyMarkedIds: Array<number> = state.markedFoldersId || [];
			const purified: Array<number> = purify(currentlyMarkedIds);
			// Find whether or not the requested folder id is marked or not
			const payloadIsMarked: number | undefined = currentlyMarkedIds.find((id) => id === payload);
			if (payloadIsMarked) {
				currentlyMarkedIds = purified.filter((id) => id !== payload);
			} else {
				currentlyMarkedIds = [...purified, payload];
			}

			return {
				...state,
				markedFoldersId: [...currentlyMarkedIds]
			};
		},
		markMultipleFolders: (state, action: PayloadAction<Array<number>>): iFolderState => {
			const { payload } = action;

			return {
				...state,
				markedFoldersId: payload
			};
		},
		unMarkAllFolders: (state): iFolderState => {
			return {
				...state,
				markedFoldersId: []
			};
		},
		changeSortOption: (state, action: PayloadAction<number>): iFolderState => {
			const { payload } = action;

			return {
				...state,
				folderSortOptionValue: payload
			};
		},
		changeViewMode: (state, action: PayloadAction<"grid" | "list">): iFolderState => {
			const { payload } = action;

			return {
				...state,
				viewMode: payload
			};
		}
	}
});

export const { markFolder, markMultipleFolders, unMarkAllFolders, changeSortOption, changeViewMode } =
	foldersSectionSlice.actions;
export default foldersSectionSlice.reducer;
