import styles from "../../styles/global_utils.module.scss";
import TabGroup from "../../components/utils/tab_group";
import TabItem from "../../components/features/tab_item";
import { useDispatch, useSelector } from "react-redux";
import { setMarkMultipleTabsAction, setMarkedTabsAction, setUpTabsAction } from "../../redux/actions/history_settings_actions";
import { iFolderItem } from "../../interfaces/folder_item";
import { useEffect, useState } from "react";
import iHistoryState from "../../interfaces/states/history_state";
import iHistoryTabGroupsSection from './../../interfaces/history_tab_groups_section';


const HistoryTabGroupsSection = (props: iHistoryTabGroupsSection) => {
    const { viewMode, tabs } = props;
    const [snapshot, setSnapshot] = useState<string>("");

    const dispatch = useDispatch();
    const historySectionState: iHistoryState = useSelector((state: any) => state.historySectionReducer);

    useEffect(() => {
        searchHistory();

        chrome.history.onVisitRemoved.addListener(historyRemovedListener);
        chrome.history.onVisited.addListener(historyVisitedListener);

        return () => {
            chrome.history.onVisitRemoved.addListener(historyRemovedListener);
            chrome.history.onVisited.addListener(historyVisitedListener);
        }
    }, []);

    const loadHistory = (query: chrome.history.HistoryQuery = { text: "", maxResults: 20 }): void => {
        chrome.history.search(query, (items: Array<chrome.history.HistoryItem>) => {
            if(items.length === 0) return;
            const sorted = items.sort((a,b)=> (a.lastVisitTime && b.lastVisitTime && (b.lastVisitTime - a.lastVisitTime)) || 0);
            const newSnapshot = JSON.stringify(sorted[sorted.length-1].lastVisitTime);
            
            if(items.length > 0 && snapshot !== newSnapshot) { 
                dispatch(setUpTabsAction(sorted));
                setSnapshot(newSnapshot);
            }
        });
    }

    const handleLoadHistory = (): void => {
        let query: any = {
            text: "",
            endTime: undefined,
            startTime: undefined,
            maxResults: viewMode === "grid" ? 15 : undefined
        }

        loadHistory(query)
    }

    
    useEffect(() => {
        handleLoadHistory()
    }, []);

    useEffect(() => {
        handleLoadHistory()
    }, [viewMode])

    const tabViewModeCSS = (mode: "list" | "grid") => {
        if(mode === "list"){
            return "mx-auto mt-4";
        } else {
            return "grid xl:grid-cols-3 2xl:grid-cols-3 grid-flow-dense gap-x-3 gap-y-0 mt-6 pr-2";
        }
    } 

    const searchHistory = () => {
        const query = {
            text: "",
            maxResults: 25
        }
        chrome.history.search(query, (items: Array<chrome.history.HistoryItem>) => {
            dispatch(setUpTabsAction(items));
        });
    }

    const historyRemovedListener = (result: chrome.history.RemovedResult): void => {
        searchHistory();
    }

    const historyVisitedListener = (result: chrome.history.HistoryItem): void => {
        searchHistory();
    }

    useEffect(() => {
        searchHistory();

        chrome.history.onVisitRemoved.addListener(historyRemovedListener);
        chrome.history.onVisited.addListener(historyVisitedListener);

        return () => {
            chrome.history.onVisitRemoved.addListener(historyRemovedListener);
            chrome.history.onVisited.addListener(historyVisitedListener);
        }
    }, []);

    const handleMarkTab = (id: number): void => {
        const tabCollection: Array<chrome.history.HistoryItem> = historySectionState.tabs;
        const markedTabs: Array<chrome.history.HistoryItem> = historySectionState.markedTabs;

        // Get an index of the affected tab
        const index = tabCollection.findIndex((tab: chrome.history.HistoryItem) => id === parseInt(tab.id));

        if(index >= 0){
            const isMarked = markedTabs.find((tab: chrome.history.HistoryItem) => id === parseInt(tab.id));
            
            if(isMarked){
                const updatedMarkedTabCollection: Array<chrome.history.HistoryItem> = markedTabs.filter((tab) => parseInt(tab.id) !== id);

                dispatch(setMarkMultipleTabsAction(updatedMarkedTabCollection));
            } else {
                const newTab = tabCollection[index];
                dispatch(setMarkedTabsAction(newTab));
            }  
        }
    }

    const groupByTime = () => {
        const groups: Map<number, Array<chrome.history.HistoryItem>> = new Map();

        tabs.forEach((tab: any) => {
            const { lastVisitTime } = tab;
            

            if(lastVisitTime){
                const visitedTimeAsDate = lastVisitTime;
                const diff: number = (Date.now() - (lastVisitTime))/1000/60; // in min
                const minutes = Math.floor(diff)

                if(!groups.get(minutes)){
                    groups.set(minutes, []);
                }
                const batch: Array<chrome.history.HistoryItem> | undefined = groups.get(minutes);
                
                if(batch){
                    batch.push(tab);
                    const sorted = batch.sort((a, b) => b.lastVisitTime! - a.lastVisitTime!);
                    groups.set(minutes, [...sorted]);
                }
                

            }
        })

        return groups;
    }

    const organizeGroups = (): Array<Array<any>> => {
        const groups: Map<number, Array<chrome.history.HistoryItem>> = groupByTime();

        return Array.from(groups);
    }

    return (
        <div className="flex justify-center min-h-[350px]">
            <div className="w-full">
                <div className="pb-6">
                    <div className={`${styles.scroll_style} ${tabViewModeCSS(viewMode)}`}>
                        {
                            <>
                                { 
                                    organizeGroups().map((group: any): JSX.Element => {

                                            return (
                                                <TabGroup desc={`${group[0]} minutes ago`}>
                                                        {
                                                        group[1].map((tab: any) => {
                                                            const collection = historySectionState.markedTabs;
                                                            const isMarked = collection.find((target: chrome.history.HistoryItem) => parseInt(target.id) === parseInt(tab.id));
                                                            const { id, title, url } = tab;
                                                            return (
                                                                
                                                                <div className="my-3">
                                                                    <TabItem key={`tab-${id}`} id={parseInt(id)} label={title} url={url} onMark={handleMarkTab} marked={isMarked ? true : false} disableEdit={true} disableMark={false} />
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </TabGroup>
                                                
                                            );
                                        }
                                    )
                                }
                            </>
                        }   
                    </div>
                </div> 
            </div>            
        </div>
    )
}

export default HistoryTabGroupsSection;