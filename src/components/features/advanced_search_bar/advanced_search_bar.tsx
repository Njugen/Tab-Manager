import { useState, useEffect, useRef } from "react";
import SearchIcon from "../../icons/search_icon";
import { useSelector } from 'react-redux';
import styles from "../../../styles/global_utils.module.scss";
import { iFolderItem } from '../../../interfaces/folder_item';
import { iWindowItem } from '../../../interfaces/window_item';
import iCurrentSessionState from "../../../interfaces/states/current_session_state";
import iHistoryState from "../../../interfaces/states/history_state";
import iAdvancedSearchBar from "../../../interfaces/advanced_search_bar";
import { handleShowResultsContainer } from "./functions/handle_show_results_container";
import { handleWindowClick } from "./functions/window_click_listener";
import { handleLaunchFolder } from "./functions/handle_launch_folder";
import { SearchResults } from "./components/search_bar_results";
import PopupMessage from "../../utils/popup_message";
import iLaunchFolderProps from "../../../interfaces/launch_folder_props";
import iHandleShowResultsContainerProps from "../../../interfaces/handle_show_results_container_props";

/*
    Search bar placed at the top of the viewport

    Filters current and history tabs by input string
*/

const AdvancedSearchBar = (props: iAdvancedSearchBar): JSX.Element => {
    const [showResultsContainer, setShowResultsContainer] = useState<boolean>(false);
    const [slideDown, setSlideDown] = useState<boolean>(false);
    const [keyword, setkeyword] = useState<string>("");
    const [windowsPayload, setWindowsPayload] = useState<Array<iWindowItem> | null>(null);
    const [folderLaunchType, setFolderLaunchType] = useState<string | null>(null); 
    const [showPerformanceWarning, setShowPerformanceWarning] = useState<boolean>(false);
    const [totalTabsCount, setTotalTabsCount] = useState<number>(0);
      
    const searchResultsContainerRef = useRef<HTMLDivElement>(null);
    const searchFieldRef = useRef<HTMLInputElement>(null);

    const folderCollectionState: Array<iFolderItem> = useSelector((state: any) => state.folderCollectionReducer);
    const sessionSectionState: iCurrentSessionState = useSelector((state: any) => state.sessionSectionReducer);
    const historySectionState: iHistoryState = useSelector((state: any) => state.historySectionReducer);

    const { popup_container_transparent_bg } = styles;

    const handleSlideDown = (status: boolean) => {
        // Adjust the search field features based on the slideDown state

        if(keyword.length === 0) {
            if(status === true){
                searchFieldRef.current!.value = "";
            }
        }

        if(status === true){
            setTimeout(() => {
                if(searchResultsContainerRef.current){
                    searchResultsContainerRef.current.classList.remove("mt-10");
                    searchResultsContainerRef.current.classList.add("mt-20");
                }
            }, 50);
  
            document.body.style.overflowX = "hidden";
        }
        setSlideDown(status);
    } 

    const handleShowResultsProps: iHandleShowResultsContainerProps = { searchResultsContainerRef , showResultsContainer, slideDown, handleSlideDown, setShowResultsContainer }
    const handleLaunchFolderProps: iLaunchFolderProps = { folderLaunchType, windowsPayload, setWindowsPayload, setFolderLaunchType, setShowPerformanceWarning }

    const clickListener = (e: any): void => {
        handleWindowClick({ e, handleShowResultsProps });
    }

    useEffect(() => {
        // Listen for clicks in the viewport. Used primarily to hide the search results
        // once the user clicks outside the searchfield AND the results area

        if(showResultsContainer === true){
            window.addEventListener("click", clickListener);
        }
        return () => {
            window.removeEventListener("click", clickListener);
        }
    }, [showResultsContainer]);


    const evaluatePerformanceWarning = (type: string, windows: Array<iWindowItem>) => {
        if(!windows) return;
        let tabsCount = 0;
        windows.forEach((window: iWindowItem) => {
            tabsCount += window.tabs.length;
        });
   
        chrome.storage.local.get("performance_notification_value", (data) => {
            setTotalTabsCount(data.performance_notification_value);
            if(data.performance_notification_value !== -1 && data.performance_notification_value <= tabsCount) {
                setShowPerformanceWarning(true);
            } else {
                handleLaunchFolderProps.windowsPayload = windows;
                handleLaunchFolderProps.folderLaunchType = type;
                handleLaunchFolder(handleLaunchFolderProps);
            }
        });
    }

    // Show search results area unless already shown
    const handleActivateSearch = (e: any): void => {
        if(slideDown === false) handleShowResultsContainer(handleShowResultsProps);
    }

    // Prepare the windows in a folder for launch, and Instruct the component on how to launch the folder
    const handlePrepareLaunchFolder = (windows: Array<iWindowItem>, type: string): void => {
        console.log("TYPE", type);
        setWindowsPayload(windows);
        evaluatePerformanceWarning(type, windows);
    }



    return (
        <>
            {showPerformanceWarning &&
                <PopupMessage
                    title="Warning" 
                    text={`You are about to open ${totalTabsCount} or more tabs at once. Opening this many may slow down your browser. Do you want to proceed?`}
                    primaryButton={{ 
                        text: "Yes, open selected folders", 
                        callback: () => { 
                            if(windowsPayload) {
                                handleLaunchFolderProps.windowsPayload = windowsPayload;
                                handleLaunchFolder(handleLaunchFolderProps);
                            }
                            setShowPerformanceWarning(false)
                        }
                    }}
                    secondaryButton={{ 
                        text: "No, do not open", 
                        callback: () => { 
                            setShowPerformanceWarning(false); 
                            setWindowsPayload(null)}}}     
                />
            }
            <div className="mt-8 flex justify-center">
                <div className={`w-7/12 flex items-center relative  z-[501] text-sm h-10 ${slideDown === false ? "opacity-50 bg-gray-300" : "drop-shadow-md bg-white"} focus:opacity-90 border-tbfColor-lightergrey focus:outline-0 focus:outline-tbfColor-lighterpurple4 focus:shadow-md hover:shadow py-5 pr-5 rounded-3xl`}>
                    <div data-testid="te" className="ml-4 mr-2 z-[502]">
                        <SearchIcon fill={"#5c5c5c"} size={24} />
                    </div>
                    <input ref={searchFieldRef} 
                        data-testid="search-field" 
                        id="search-field" 
                        defaultValue="Search tabs..." 
                        onChange={(e) => setkeyword(e.target.value)} 
                        onClick={handleActivateSearch} 
                        className={`py-5 h-10 ${slideDown === false ? "bg-gray-300" : "bg-white"} w-full focus:outline-0`} 
                        type="text" 
                    />
                </div>
                {   
                    slideDown === true && 
                    (
                        <section data-testid="search-results-area" id="search-results-area" className={`${popup_container_transparent_bg} w-screen h-full top-0 bg-[rgba-] absolute z-500 left-0 flex justify-center`}>
                            <div ref={searchResultsContainerRef} className={`bg-white absolute p-6 ml-16 mt-10 transition-all ease-in duration-75 overflow-hidden w-7/12 z-10 rounded-lg drop-shadow-[0_3px_2px_rgba(0,0,0,0.15)]`}>
                                <SearchResults keyword={keyword} folders={folderCollectionState} session={sessionSectionState} history={historySectionState} launchFolder={handlePrepareLaunchFolder} />   
                            </div>
                        </section>
                    ) 
                }
            </div>
        </>
    ); 
}

export default AdvancedSearchBar;