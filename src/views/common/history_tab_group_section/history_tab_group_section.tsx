import styles from "../../../styles/global_utils.module.scss";
import Group from "../../../components/utils/group";
import TabItem from "../../../components/features/tab_item";
import { useDispatch, useSelector } from "react-redux";
import { setMarkMultipleTabsAction, setMarkedTabsAction, setUpTabsAction } from "../../../redux/actions/history_settings_actions";
import { forwardRef, useEffect, useState } from "react";
import iHistoryState from "../../../interfaces/states/history_state";
import iHistoryTabGroupsSection from '../../../interfaces/history_tab_groups_section';
import tabViewModeCSS from "./functions/tabViewModeCSS";
import getTabGroups from "./functions/groupTabsByTime";

/*
    Component which displays browsing history pulled straight from the browser api. Fetching
    behaviour depends on section expansion and scroll events.    
*/
const HistoryTabGroupsSection = forwardRef(function HistoryTabGroupsSection(props: iHistoryTabGroupsSection, ref: any): JSX.Element {
    const { viewMode, tabs } = props;

    const dispatch = useDispatch();
    const historySectionState: iHistoryState = useSelector((state: any) => state.historySectionReducer);


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

    return (
        <div className="flex justify-center min-h-[350px]">
            <div className="w-full pb-6">
                <div ref={ref} className={`${styles.scroll_style} ${tabViewModeCSS(viewMode)}`}>
                    {
                        <>
                            { 
                                getTabGroups(tabs).map((group: any, i: number): JSX.Element => {

                                        return (
                                            <Group key={`tab-group-${i}`} desc={`${group[0]} minutes ago`}>
                                                {
                                                    group[1].map((tab: any) => {
                                                        const collection = historySectionState.markedTabs;
                                                        const isMarked = collection.find((target: chrome.history.HistoryItem) => parseInt(target.id) === parseInt(tab.id));
                                                        const { id, title, url } = tab;
                                                        return (
                                                            
                                                            <div className="my-3" key={`tab-${id}`}>
                                                                <TabItem id={parseInt(id)} label={title} url={url} onMark={handleMarkTab} marked={isMarked ? true : false} disableEdit={true} disableMark={false} />
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </Group>
                                            
                                        );
                                    }
                                )
                            }
                        </>
                    }   
                </div>
            </div>            
        </div>
    )
})

export default HistoryTabGroupsSection;
