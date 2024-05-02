import React from "react";
import { iWindowItem } from "../../../../interfaces/window_item";
import tLaunchBehavior from "./../../../../interfaces/types/launch_behavior";

interface iLaunchFolderArgs {
	folderLaunchBehavior: tLaunchBehavior;
	windowsPayload: Array<iWindowItem> | null;
	setWindowsPayload: React.Dispatch<React.SetStateAction<iWindowItem[]>>;
	setFolderLaunchBehavior: React.Dispatch<React.SetStateAction<tLaunchBehavior>>;
	setShowPerformanceWarning: React.Dispatch<React.SetStateAction<boolean>>;
}

// Event handler showing all the launching options of a folder
const handleLaunchFolder = (args: iLaunchFolderArgs): void => {
	const {
		folderLaunchBehavior,
		windowsPayload,
		setWindowsPayload,
		setFolderLaunchBehavior,
		setShowPerformanceWarning
	} = args;

	if (!windowsPayload) return;

	// Now, prepare a snapshot, where currently opened windows get stored
	let snapshot: Array<chrome.windows.Window> = [];

	const queryOptions: chrome.windows.QueryOptions = {
		populate: true,
		windowTypes: ["normal", "popup"]
	};

	// Store currently opened windows into the snapshot
	chrome.windows.getAll(queryOptions, (currentWindows: Array<chrome.windows.Window>) => {
		snapshot = currentWindows;
	});

	if (folderLaunchBehavior !== "group") {
		// Open all windows in this folder
		windowsPayload.forEach((window: iWindowItem, i) => {
			const windowSettings: chrome.windows.CreateData = {
				focused: i === 0 ? true : false,
				url: window.tabs.map((tab) => tab.url),
				incognito: folderLaunchBehavior === "incognito" ? true : false,
				state: "maximized"
			};
			chrome.windows.create(windowSettings);
		});

		// Close current session after launching the folder. Only applies when
		// set in the plugin's settings
		chrome.storage.local.get("closeSessionAtFolderLaunch", (data) => {
			if (data.closeSessionAtFolderLaunch === true) {
				snapshot.forEach((window) => {
					if (window.id) chrome.windows.remove(window.id);
				});
			}
		});
	} else {
		let tabIds: Array<number> = [];

		windowsPayload.forEach((window: iWindowItem, i) => {
			window.tabs.forEach((tab, j) => {
				chrome.tabs.create({ url: tab.url }, (createdTab: chrome.tabs.Tab) => {
					if (createdTab.id) {
						tabIds = [...tabIds, createdTab.id];
					}

					if (windowsPayload.length - 1 >= i && window.tabs.length - 1 >= j) {
						chrome.tabs.group({ tabIds: tabIds });
					}
				});
			});
		});
	}

	window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

	// Unset all relevant states to prevent interferance with other features once the folder has been launched
	setWindowsPayload([]);
	setFolderLaunchBehavior("normal");
	setShowPerformanceWarning(false);
};

export { handleLaunchFolder, iLaunchFolderArgs, tLaunchBehavior };
