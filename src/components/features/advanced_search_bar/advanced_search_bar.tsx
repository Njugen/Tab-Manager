import { useState, useEffect, useRef, useCallback } from "react";
import SearchIcon from "../../icons/search_icon";
import { useSelector } from "react-redux";
import { iFolderItem } from "../../../interfaces/folder_item";
import { iWindowItem } from "../../../interfaces/window_item";
import iCurrentSessionState from "../../../interfaces/states/current_session_state";
import iHistoryState from "../../../interfaces/states/history_state";
import { handleShowResultsContainer, iHandleShowResultsContainerArgs } from "./functions/handle_show_results_container";
import { handleWindowClick } from "./functions/window_click_listener";
import { handleLaunchFolder, iLaunchFolderArgs } from "./functions/handle_launch_folder";
import { SearchResults } from "./components/search_bar_results";
import PopupMessage from "../../utils/popup_message";
import { RootState } from "../../../redux-toolkit/store";
import tLaunchBehavior from "../../../interfaces/types/launch_behavior";
/*
    Search bar placed at the top of the viewport

    Filters folders, history and session tabs accordingly to keyword
*/

const AdvancedSearchBar = (props: any): JSX.Element => {
	// Setting for whether or not to show/hide search results
	const [showResultsContainer, setShowResultsContainer] = useState<boolean>(false);

	// Setting for whether or not to apply a slidedown effect when showing the search results
	const [slideDown, setSlideDown] = useState<boolean>(false);

	// Keyword used to filter folders and tabs
	const [keyword, setkeyword] = useState<string>("");

	// Place a set of windows on hold (e.g. for an upcoming event like launching etc)
	const [windowsPayload, setWindowsPayload] = useState<Array<iWindowItem>>([]);

	// Setting for how to launch a folder (normally, as a group or incognito?)
	const [folderLaunchBehavior, setFolderLaunchBehavior] = useState<tLaunchBehavior>("normal");

	// Setting for whether or not to show a warning message when opening too many
	const [showPerformanceWarning, setShowPerformanceWarning] = useState<boolean>(false);

	// The number of tabs about to be launched from a folder
	const [tabsToLaunchCount, setTabsToLaunchCount] = useState<number>(0);

	const searchResultsContainerRef = useRef<HTMLDivElement>(null);
	const searchFieldRef = useRef<HTMLInputElement>(null);

	const folderState: Array<iFolderItem> = useSelector((state: RootState) => state.folder);
	const sessionSectionState: iCurrentSessionState = useSelector((state: RootState) => state.sessionSection);
	const historySectionState: iHistoryState = useSelector((state: RootState) => state.historySection);

	// Wait a moment before applying slide down effect
	const handleSlideDown = (status: boolean) => {
		if (keyword.length === 0) {
			if (status) {
				searchFieldRef.current!.value = "";
			}
		}

		if (status) {
			setTimeout(() => {
				if (searchResultsContainerRef.current) {
					searchResultsContainerRef.current.classList.remove("mt-10");
					searchResultsContainerRef.current.classList.add("mt-20");
				}
			}, 50);

			// document.body.style.overflow = "hidden";
		}
		setSlideDown(status);
	};

	// Args to be passed to handleShowResultsContainer()
	const handleShowResultsArgs: iHandleShowResultsContainerArgs = {
		searchResultsContainerRef,
		showResultsContainer,
		slideDown,
		handleSlideDown,
		setShowResultsContainer
	};

	// Args to be passed to handleLaunchFolder()
	const handleLaunchFolderArgs: iLaunchFolderArgs = {
		folderLaunchBehavior,
		windowsPayload,
		setWindowsPayload,
		setFolderLaunchBehavior,
		setShowPerformanceWarning
	};

	const clickListener = useCallback(
		(e: any): void => {
			handleWindowClick({ e, handleShowResultsArgs });
		},
		[handleShowResultsArgs.slideDown]
	);

	useEffect(() => {
		// Listen for clicks in the viewport. Used primarily to hide the search results
		// once the user clicks outside the searchfield AND the results area

		if (showResultsContainer) {
			window.addEventListener("click", clickListener);
		}

		return () => {
			window.removeEventListener("click", clickListener);
		};
	}, [showResultsContainer]);

	// Decide whether or not to launch a folder immediately, OR to show a warning message
	const evaluatePerformanceWarning = (type: tLaunchBehavior, windows: Array<iWindowItem>) => {
		if (!windows) return;
		let tabsCount = 0;
		windows.forEach((window: iWindowItem) => {
			tabsCount += window.tabs.length;
		});

		chrome.storage.local.get("performanceWarningValue", (data) => {
			setTabsToLaunchCount(data.performanceWarningValue);
			if (data.performanceWarningValue !== -1 && data.performanceWarningValue <= tabsCount) {
				setShowPerformanceWarning(true);
			} else {
				handleLaunchFolderArgs.windowsPayload = windows;
				handleLaunchFolderArgs.folderLaunchBehavior = type;
				handleLaunchFolder(handleLaunchFolderArgs);
			}
		});
	};

	// Prepare the windows in a folder for launch, and Instruct the component on how to launch the folder
	const handlePrepareLaunchFolder = (windows: Array<iWindowItem>, type: tLaunchBehavior): void => {
		setWindowsPayload(windows);
		setFolderLaunchBehavior(type);
		evaluatePerformanceWarning(type, windows);
	};

	return (
		<>
			{showPerformanceWarning && (
				<PopupMessage
					title="Warning"
					text={`You are about to open ${tabsToLaunchCount} or more tabs at once. Opening this many may slow down your browser. Do you want to proceed?`}
					primaryButton={{
						text: "Yes, open",
						callback: () => {
							if (windowsPayload) {
								handleLaunchFolderArgs.windowsPayload = windowsPayload;
								handleLaunchFolderArgs.folderLaunchBehavior = folderLaunchBehavior;
								handleLaunchFolder(handleLaunchFolderArgs);
							}
							setShowPerformanceWarning(false);
						}
					}}
					secondaryButton={{
						text: "No, do not open",
						callback: () => {
							setShowPerformanceWarning(false);
							setWindowsPayload([]);
						}
					}}
				/>
			)}
			<div className="mt-8 flex justify-center">
				<div
					className={`w-7/12 flex items-center relative  z-[501] text-sm h-10 ${slideDown === false ? "opacity-50 bg-gray-300" : "drop-shadow-md bg-white"} focus:opacity-90 border-tbfColor-lightergrey focus:outline-0 focus:outline-tbfColor-lighterpurple4 focus:shadow-md hover:shadow py-5 pr-5 rounded-3xl`}
				>
					<div data-testid="te" className="ml-4 mr-2 z-[502]">
						<SearchIcon fill={"#5c5c5c"} size={24} />
					</div>
					<input
						ref={searchFieldRef}
						data-testid="search-field"
						id="search-field"
						defaultValue="Search tabs..."
						onChange={(e) => setkeyword(e.target.value)}
						onClick={() => slideDown === false && handleShowResultsContainer(handleShowResultsArgs)}
						className={`py-5 h-10 ${slideDown === false ? "bg-gray-300" : "bg-white"} w-full focus:outline-0`}
						type="text"
					/>
				</div>
				{slideDown && (
					<section
						data-testid="search-results-area"
						id="search-results-area"
						className={`bg-black bg-opacity-50 w-screen h-full top-0 bg-[rgba-] absolute z-500 left-0 flex justify-center`}
					>
						<div
							ref={searchResultsContainerRef}
							className={`bg-white absolute p-6 ml-16 mt-10 transition-all ease-in duration-75 overflow-hidden w-7/12 z-10 rounded-lg drop-shadow-[0_3px_2px_rgba(0,0,0,0.15)]`}
						>
							<SearchResults
								keyword={keyword}
								folders={folderState}
								session={sessionSectionState}
								history={historySectionState}
								launchFolder={handlePrepareLaunchFolder}
							/>
						</div>
					</section>
				)}
			</div>
		</>
	);
};

export default AdvancedSearchBar;
