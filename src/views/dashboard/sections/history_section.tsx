import PrimaryButton from "../../../components/utils/primary_button/primary_button";
import FolderManager from "../../../components/features/folder_manager/folder_manager";
import { useEffect, useState, useRef, useCallback } from "react";
import { iFolderItem } from "../../../interfaces/folder_item";
import { useDispatch, useSelector } from "react-redux";
import TextIconButton from "../../../components/utils/text_icon_button";
import randomNumber from "../../../tools/random_number";
import { iWindowItem } from "../../../interfaces/window_item";
import { iTabItem } from "../../../interfaces/tab_item";
import { iFieldOption } from "../../../interfaces/dropdown";
import AddToFolderPopup from "../../../components/features/add_to_folder_popup";
import SectionContainer from "../../../components/utils/section_container";
import { getFromStorage, saveToStorage } from "../../../services/webex_api/storage";
import SelectedCheckboxIcon from "../../../components/icons/selected_checkbox_icon";
import TrashIcon from "../../../components/icons/trash_icon";
import GridIcon from "../../../components/icons/grid_icon";
import ListIcon from "../../../components/icons/list_icon";
import DeselectedCheckboxIcon from "../../../components/icons/deselected_checkbox_icon";
import HistoryTabGroupsSection from "../../common/history_tab_group_section/history_tab_group_section";
import {
	changeSortOption,
	changeViewMode,
	markMultipleTabs,
	setUpTabs,
	unMarkAllTabs
} from "../../../redux-toolkit/slices/history_section_slice";
import { unMarkAllFolders } from "../../../redux-toolkit/slices/folders_section_slice";

/*
    History section, listing history tabs fetched from browser api. Lazyloads tabs at scroll only
    when section is in fullscreen mode
*/

const HistorySection = (props: any): JSX.Element => {
	const [addToFolderMessage, setAddToFolderMessage] = useState<boolean>(false);
	const [mergeProcessFolder, setMergeProcessFolder] = useState<iFolderItem | null>(null);
	const [createFolder, setCreateFolder] = useState<boolean>(false);
	const [snapshot, setSnapshot] = useState<string>("");
	const [searchString, setSearchString] = useState<string>("");
	const [tabsCount, setTabsCount] = useState<number>(10);

	const historySectionState = useSelector((state: any) => state.historySection);
	const folderState: Array<iFolderItem> = useSelector((state: any) => state.folder);
	const sectionRef = useRef<HTMLDivElement>(null);

	const dispatch = useDispatch();

	// Load tabs from history api and store it in redux store for further use while this component is rendered
	const loadHistory = (keyword: string, count: number): void => {
		const query: chrome.history.HistoryQuery = {
			text: keyword,
			endTime: undefined,
			startTime: undefined,
			maxResults: count
		};

		chrome.history.search(query, (items: Array<chrome.history.HistoryItem>) => {
			if (items.length === 0) return;

			const sorted = items.sort(
				(a, b) => (a.lastVisitTime && b.lastVisitTime && b.lastVisitTime - a.lastVisitTime) || 0
			);
			const newSnapshot = JSON.stringify(sorted[sorted.length - 1].lastVisitTime);

			if (items.length > 0 && snapshot !== newSnapshot) {
				dispatch(setUpTabs(sorted));
				setSnapshot(newSnapshot);
			}
		});
	};

	// Reload history each time the number of tabs is changed
	useEffect(() => {
		loadHistory(searchString, tabsCount);
	}, [tabsCount]);

	// Increase the number of tabs once the user scrolls down far enough. UseCallback
	// ensures the listener stays the same after re-render -> listener can be removed from event handler
	const scrollListener = useCallback((): void => {
		if (sectionRef.current) {
			const { scrollY, outerHeight } = window;
			const windowYScrollSpace = outerHeight + scrollY;

			if (sectionRef.current && windowYScrollSpace >= sectionRef.current.clientHeight) {
				setTabsCount((prev) => prev + 20);
			}
		}
	}, []);

	// Sets event listener once fullscreen expansion takes place, and removes it when exiting fullscreen
	const handleLoadHistory = (fullscreen: boolean, count: number): void => {
		if (fullscreen === true) {
			window.addEventListener("scroll", scrollListener);
		} else {
			setTabsCount(10);
			window.removeEventListener("scroll", scrollListener);
		}
	};

	// Set up sorting and view mode settings in redux based on storage info
	useEffect(() => {
		getFromStorage("local", "history_sort", (data) => {
			dispatch(changeSortOption(data.history_sort));
		});

		getFromStorage("local", "history_viewmode", (data) => {
			dispatch(changeViewMode(data.history_viewmode));
		});
	}, []);

	// Change tab listing from grid to list, and vice versa
	const handleChangeViewMode = (): void => {
		const { viewMode } = historySectionState;

		const newStatus = viewMode === "list" ? "grid" : "list";
		saveToStorage("local", "history_viewmode", newStatus);
		dispatch(changeViewMode(newStatus));
	};

	const handleMarkAllTabs = (): void => {
		const tabs: Array<chrome.history.HistoryItem> = historySectionState.tabs as Array<chrome.history.HistoryItem>;
		dispatch(markMultipleTabs(tabs));
	};

	const handleUnMarkAll = (): void => {
		dispatch(unMarkAllTabs());
	};

	// Delete tabs from browser history and update redux store accordingly
	const handleDeleteFromHistory = (): void => {
		let updatedMarks = historySectionState.tabs;

		historySectionState.markedTabs.forEach((tab: chrome.history.HistoryItem) => {
			chrome.history.deleteUrl({ url: tab.url! });
			updatedMarks = updatedMarks.filter((target: chrome.history.HistoryItem) => target.url !== tab.url);
		});

		dispatch(setUpTabs(updatedMarks));
		dispatch(unMarkAllTabs());
	};

	// Open marked folders
	const handleOpenSelected = (): void => {
		const markedTabs: Array<chrome.history.HistoryItem> =
			historySectionState.markedTabs as Array<chrome.history.HistoryItem>;

		markedTabs.forEach((tab: chrome.history.HistoryItem) => {
			const properties: object = {
				active: false,
				url: tab.url
			};
			chrome.tabs.create(properties);
		});
	};

	const showOptionsMenu = (): JSX.Element => {
		const { markedTabs } = historySectionState;
		let specs: any;

		if (markedTabs.length > 0) {
			specs = {
				label: "Mark all",
				id: "selected_checkbox",
				handle: handleUnMarkAll
			};
		} else {
			specs = {
				label: "Mark all",
				id: "deselected_checkbox",
				handle: handleMarkAllTabs
			};
		}

		return (
			<>
				<div className="mr-4 inline-flex items-center justify-end w-full">
					<div className="flex">
						<TextIconButton
							disabled={false}
							id={specs.id}
							textSize="text-sm"
							text={specs.label}
							onClick={specs.handle}
						>
							{markedTabs.length > 0 ? (
								<SelectedCheckboxIcon size={20} fill={"#6D00C2"} />
							) : (
								<DeselectedCheckboxIcon size={20} fill={"#6D00C2"} />
							)}
						</TextIconButton>
						<TextIconButton
							disabled={markedTabs.length > 0 ? false : true}
							id={"trash"}
							textSize="text-sm"
							text="Delete from history"
							onClick={handleDeleteFromHistory}
						>
							<TrashIcon size={20} fill={markedTabs.length > 0 ? "#6D00C2" : "#9f9f9f"} />
						</TextIconButton>
					</div>

					<div className="flex items-center justify-end">
						<TextIconButton
							disabled={false}
							id={historySectionState.viewMode === "list" ? "grid" : "list"}
							textSize="text-sm"
							text={historySectionState.viewMode === "list" ? "Grid" : "List"}
							onClick={handleChangeViewMode}
						>
							{historySectionState.viewMode === "list" ? (
								<GridIcon size={20} fill={"#6D00C2"} />
							) : (
								<ListIcon size={20} fill={"#6D00C2"} />
							)}
						</TextIconButton>

						{/*   <input 
                            data-testid="history-search-field" 
                            id="history-search-field" 
                            type="text" 
                            placeholder={"Search history..."} 
                            className={`${predef.textfield} w-[250px] p-2.5 mx-4`} 
                            onChange={handleSearch}
                        />*/}
						<PrimaryButton
							disabled={markedTabs.length > 0 ? false : true}
							text="Open selected"
							onClick={handleOpenSelected}
						/>
						<PrimaryButton
							disabled={markedTabs.length > 0 ? false : true}
							text="Add to folder"
							onClick={() => {
								if (folderState.length > 0) {
									setAddToFolderMessage(true);
								} else {
									setCreateFolder(true);
								}
							}}
						/>
					</div>
				</div>
			</>
		);
	};

	// Set necessary states to trigger an empty Folder Manager with preset tabs
	const handleAddToNewFolder = (): void => {
		setAddToFolderMessage(false);
		setCreateFolder(true);
	};

	// Set necessary states to trigger a Folder Manager containing an existing folder + selected tabs
	const handleAddToExistingFolder = useCallback(
		(e: any): void => {
			if (e.selected === -1) return;

			const targetFolderId = e.selected;
			const targetFolder: iFolderItem | undefined = folderState.find(
				(folder: iFolderItem) => folder.id === targetFolderId
			);

			if (!targetFolder) return;

			const markedTabs: Array<iTabItem> = historySectionState.markedTabs.map(
				(tab: chrome.history.HistoryItem) => {
					return {
						id: tab.id,
						label: tab.title,
						url: tab.url,
						disableEdit: false,
						disableMark: false
					};
				}
			);

			const presetWindow: iWindowItem = {
				id: randomNumber(),
				tabs: markedTabs
			};

			const updatedFolder: iFolderItem = { ...targetFolder };

			updatedFolder.windows = [...updatedFolder.windows, presetWindow];

			if (targetFolder) {
				setAddToFolderMessage(false);
				setMergeProcessFolder(updatedFolder);
			}
		},
		[historySectionState.markedTabs]
	);

	// Show a popup with options on how to add/merge selected tabs
	const showSelector = (): JSX.Element => {
		const currentFolders: Array<iFolderItem> = folderState;

		const options: Array<iFieldOption> = currentFolders.map((folder) => {
			return {
				value: folder.id,
				label: folder.name
			};
		});

		const dropdownOptions: Array<iFieldOption> = [
			{
				value: -1,
				label: "Select a folder"
			},
			...options
		];

		return (
			<AddToFolderPopup
				title="Add to folder"
				type="slide-in"
				dropdownOptions={dropdownOptions}
				onNewFolder={handleAddToNewFolder}
				onExistingFolder={handleAddToExistingFolder}
				onCancel={() => setAddToFolderMessage(false)}
			/>
		);
	};

	const handleCloseFolderManager = (): void => {
		setCreateFolder(false);
		setMergeProcessFolder(null);

		dispatch(unMarkAllTabs());
		dispatch(unMarkAllFolders());
	};

	const handleSearch = (e: any): void => {
		setSearchString(e.target.value);
		loadHistory(searchString, tabsCount);
	};

	const showFolderManager = (): JSX.Element => {
		let render = <></>;

		if (createFolder === true) {
			const markedTabs: Array<iTabItem> = historySectionState.markedTabs.map(
				(tab: chrome.history.HistoryItem) => {
					return {
						id: tab.id,
						label: tab.title,
						url: tab.url,
						disableEdit: false,
						disableMark: false
					};
				}
			);

			const presetWindow: iWindowItem = {
				id: randomNumber(),
				tabs: markedTabs
			};

			const folderSpecs: iFolderItem = {
				id: randomNumber(),
				name: "",
				desc: "",
				display: "expanded",
				viewMode: "grid",
				marked: false,
				windows: [presetWindow]
			};
			render = (
				<FolderManager
					type="slide-in"
					title="Create folder"
					folder={folderSpecs}
					onClose={handleCloseFolderManager}
				/>
			);
		} else if (mergeProcessFolder) {
			render = (
				<FolderManager
					type="slide-in"
					title={`Merge tabs to ${mergeProcessFolder.name}`}
					folder={mergeProcessFolder}
					onClose={handleCloseFolderManager}
				/>
			);
		}

		return render;
	};

	return (
		<>
			{addToFolderMessage && showSelector()}
			{showFolderManager()}
			<SectionContainer
				fullscreen={false}
				id="history-view"
				title="History"
				options={showOptionsMenu}
				onExpand={(value: boolean) => handleLoadHistory(value, tabsCount)}
			>
				<HistoryTabGroupsSection
					ref={sectionRef}
					viewMode={historySectionState.viewMode}
					tabs={historySectionState.tabs}
				/>
			</SectionContainer>
		</>
	);
};

export default HistorySection;
