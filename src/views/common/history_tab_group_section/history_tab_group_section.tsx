import styles from "../../../styles/global_utils.module.scss";
import Group from "../../../components/utils/group";
import TabItem from "../../../components/features/tab_item";
import { useDispatch, useSelector } from "react-redux";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import iHistoryState from "../../../interfaces/states/history_state";
import iHistoryTabGroupsSection from "../../../interfaces/history_tab_groups_section";
import { markTab, setUpTabs } from "../../../redux-toolkit/slices/history_section_slice";
import tBrowserTabId from "../../../interfaces/types/browser_tab_id";

/*
    Component which displays browsing history pulled straight from the browser api.

    The grouping
*/
const HistoryTabGroupsSection = forwardRef(function HistoryTabGroupsSection(
	props: iHistoryTabGroupsSection,
	ref: any
): JSX.Element {
	const { viewMode, tabs } = props;
	const [snapshot, setSnapshot] = useState<string>("");

	const dispatch = useDispatch();
	const historySectionState: iHistoryState = useSelector((state: any) => state.historySection);

	useEffect(() => {
		let query: any = {
			text: "",
			endTime: undefined,
			startTime: undefined,
			maxResults: viewMode === "grid" ? 10 : undefined
		};

		loadHistory(query);
		searchHistory();

		chrome.history.onVisitRemoved.addListener(searchHistory);
		chrome.history.onVisited.addListener(searchHistory);

		return () => {
			chrome.history.onVisitRemoved.removeListener(searchHistory);
			chrome.history.onVisited.removeListener(searchHistory);
		};
	}, []);

	const compareHistoryItemByTime = (a: chrome.history.HistoryItem, b: chrome.history.HistoryItem) => {
		let comparison: number;

		if (a.lastVisitTime && b.lastVisitTime) {
			comparison = a.lastVisitTime && b.lastVisitTime && b.lastVisitTime - a.lastVisitTime;
		} else {
			comparison = 0;
		}

		return comparison;
	};

	const loadHistory = (query: chrome.history.HistoryQuery = { text: "", maxResults: 10 }): void => {
		chrome.history.search(query, (items: Array<chrome.history.HistoryItem>) => {
			if (items.length === 0) return;

			const sorted = items.sort(compareHistoryItemByTime);
			const newSnapshot = JSON.stringify(sorted[sorted.length - 1].lastVisitTime);

			if (items.length > 0 && snapshot !== newSnapshot) {
				dispatch(setUpTabs(sorted));
				setSnapshot(newSnapshot);
			}
		});
	};

	const tabViewModeCSS = (mode: "list" | "grid") => {
		if (mode === "list") {
			return "mx-auto mt-4";
		} else {
			return "grid xl:grid-cols-3 2xl:grid-cols-3 grid-flow-dense gap-x-3 gap-y-0 mt-6 pr-2";
		}
	};

	const searchHistory = useCallback(() => {
		const query = {
			text: "",
			maxResults: 10
		};
		chrome.history.search(query, (items: Array<chrome.history.HistoryItem>) => {
			dispatch(setUpTabs(items));
		});
	}, []);

	const handleMarkTab = (id: tBrowserTabId): void => {
		const tabCollection: Array<chrome.history.HistoryItem> = historySectionState.tabs;
		const markedTabs: Array<chrome.history.HistoryItem> = historySectionState.markedTabs;

		// Get an index of the affected tab
		const index = tabCollection.findIndex((tab: chrome.history.HistoryItem) => id === tab.id);

		if (index >= 0) {
			const isMarked = markedTabs.find((tab: chrome.history.HistoryItem) => id === tab.id);

			if (isMarked) {
				const updatedMarkedTabCollection: Array<chrome.history.HistoryItem> = markedTabs.filter(
					(tab) => parseInt(tab.id) !== id
				);

				dispatch(markTab(updatedMarkedTabCollection[0]));
			} else {
				const newTab = tabCollection[index];
				dispatch(markTab(newTab));
			}
		}
	};

	const groupByTime = () => {
		const groups: Map<number, Array<chrome.history.HistoryItem>> = new Map();

		tabs.forEach((tab: any) => {
			const { lastVisitTime } = tab;

			if (lastVisitTime) {
				const diff: number = (Date.now() - lastVisitTime) / 1000 / 60; // in min
				const minutes = Math.floor(diff);

				if (!groups.get(minutes)) {
					groups.set(minutes, []);
				}
				const batch: Array<chrome.history.HistoryItem> | undefined = groups.get(minutes);

				if (batch) {
					batch.push(tab);
					const sorted = batch.sort((a, b) => b.lastVisitTime! - a.lastVisitTime!);
					groups.set(minutes, [...sorted]);
				}
			}
		});

		return groups;
	};

	const organizeGroups = (): Array<Array<any>> => {
		const groups: Map<number, Array<chrome.history.HistoryItem>> = groupByTime();

		return Array.from(groups);
	};

	return (
		<div className="flex justify-center min-h-[350px]">
			<div className="w-full">
				<div className="pb-6">
					<div ref={ref} className={`${styles.scroll_style} ${tabViewModeCSS(viewMode)}`}>
						{
							<>
								{useMemo(
									() =>
										organizeGroups().map((group: any, i: number): JSX.Element => {
											return (
												<Group key={`group-${i}`} desc={`${group[0]} minutes ago`}>
													<ul className="list-none">
														{group[1].map((tab: any) => {
															const collection = historySectionState.markedTabs;
															const isMarked = collection.find(
																(target: chrome.history.HistoryItem) =>
																	target.id === tab.id
															);
															const { id, title, url } = tab;
															return (
																<div className="my-3" key={`tab-${id}`}>
																	<TabItem
																		id={id}
																		label={title}
																		url={url}
																		onMark={handleMarkTab}
																		marked={isMarked ? true : false}
																	/>
																</div>
															);
														})}
													</ul>
												</Group>
											);
										}),
									[organizeGroups()]
								)}
							</>
						}
					</div>
				</div>
			</div>
		</div>
	);
});

export default HistoryTabGroupsSection;
