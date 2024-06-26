import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { iFolderItem } from "../../interfaces/folder_item";
import { saveToStorage } from "../../services/webex_api/storage";
import purify from "../../tools/purify_object";

const initialState: Array<iFolderItem> = [];

const folderSlice = createSlice({
	name: "folder_slice",
	initialState,
	reducers: {
		setUpFolders: (state, action: PayloadAction<iFolderItem>): Array<iFolderItem> => {
			const { payload } = action;

			return [payload];
		},
		readAllStorageFolders: (state, action) => {
			const { payload } = action;

			return payload;
		},
		createNewFolder: (state, action: PayloadAction<iFolderItem>): Array<iFolderItem> => {
			const { payload } = action;

			// For some reason, previous state values gets proxified, causing error next
			// time user reloads the plugin. To circumvent that, we stringify and parse back the whole state.
			const cleanState = purify(state);

			const updatedFolders = [...cleanState, payload];

			saveToStorage("local", "folders", updatedFolders);

			return updatedFolders;
		},
		readFolder: (state, action: PayloadAction<number>) => {
			const { payload } = action;

			return state.filter((folder) => folder.id === payload);
		},
		saveFolder: (state, action: PayloadAction<iFolderItem>) => {
			const { payload } = action;

			const updatedFolders: Array<iFolderItem> = state.map((folder) => {
				if (folder.id === payload.id) {
					return payload;
				} else {
					return folder;
				}
			});
			saveToStorage("local", "folders", purify(updatedFolders));

			return [...updatedFolders];
		},
		deleteFolder: (state, action: PayloadAction<number>) => {
			const { payload } = action;

			const updatedFolders: Array<iFolderItem> = state.filter(
				(folder) => folder.id !== payload
			);

			if (updatedFolders.length === 0) saveToStorage("local", "folders", []);

			return [...updatedFolders];
		}
	}
});

export const {
	setUpFolders,
	readAllStorageFolders,
	createNewFolder,
	readFolder,
	saveFolder,
	deleteFolder
} = folderSlice.actions;

export default folderSlice.reducer;
