import { useState, useEffect, useRef } from "react";
import SearchIcon from "../../icons/search_icon";
import { useSelector } from 'react-redux';
import styles from "../../../styles/global_utils.module.scss";
import { iFolderItem } from '../../../interfaces/folder_item';
import { iWindowItem } from '../../../interfaces/window_item';
import iCurrentSessionState from "../../../interfaces/states/current_session_state";
import iHistoryState from "../../../interfaces/states/history_state";
import iAdvancedSearchBar from "../../../interfaces/advanced_search_bar";
import { handleShowResultsContainer, IHandleShowResultsContainerProps } from "./handle_show_results_container";
import { handleWindowClick } from "./window_click_listener";
import { ILaunchFolderProps, handleLaunchFolder } from "./handle_launch_folder";
import { SearchResults } from "./child_components/search_bar_results";
import PopupMessage from "../../utils/popup_message";

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
    const handleShowResultsProps: IHandleShowResultsContainerProps = { searchResultsContainerRef , showResultsContainer, slideDown, setSlideDown, setShowResultsContainer }
    const handleLaunchFolderProps: ILaunchFolderProps = { folderLaunchType, windowsPayload, setWindowsPayload, setFolderLaunchType, setShowPerformanceWarning }

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

    // Adjust the search field features based on the slideDown state
    useEffect(() => {
        if(keyword.length === 0) {
            if(slideDown === false){
                searchFieldRef.current!.value = "Search tabs...";
            } else {
                searchFieldRef.current!.value = "";
            }
        }

        if(slideDown === true){
            setTimeout(() => {
                if(searchResultsContainerRef.current){
                    searchResultsContainerRef.current.classList.remove("mt-10");
                    searchResultsContainerRef.current.classList.add("mt-20");
                }
            }, 50);
          //  document.body.style.overflowY = "hidden";
            document.body.style.overflowX = "hidden";
        }
    }, [slideDown]);


    // Decide whether or not to show performance warning, or launch a folder directly
    useEffect(() => {
        if(!windowsPayload || !folderLaunchType) return;

        let tabsCount = 0;
        windowsPayload.forEach((window: iWindowItem) => {
            tabsCount += window.tabs.length;
        });
   
        chrome.storage.local.get("performance_notification_value", (data) => {
            const { performance_notification_value } = data;

            setTotalTabsCount(performance_notification_value);
            if(performance_notification_value !== -1 && performance_notification_value <= tabsCount) {
                setShowPerformanceWarning(true);
            } else {
                handleLaunchFolderProps.windowsPayload = windowsPayload;
                handleLaunchFolder(handleLaunchFolderProps);
            }
        });
    }, [folderLaunchType]);

    // Show search results area unless already shown
    const handleActivateSearch = (e: any): void => {
        if(slideDown === false) handleShowResultsContainer(handleShowResultsProps);
    }

    const handlePrepareLaunchFolder = (windows: Array<iWindowItem>, type: string): void => {
        setWindowsPayload(windows);
        setFolderLaunchType(type);
    }

    // Run when user don't want to open folder.
    const denyFolderLaunch = (): void => { 
        setShowPerformanceWarning(false); setWindowsPayload(null);
        setFolderLaunchType(null); setShowPerformanceWarning(false);
    }

    // Run when user wants to launch folder
    const proceedFolderLaunch = (): void => {
        if(windowsPayload){
            const tempProps: ILaunchFolderProps = { folderLaunchType, windowsPayload, setWindowsPayload, setFolderLaunchType, setShowPerformanceWarning }

            handleLaunchFolder(tempProps); 
            setShowPerformanceWarning(false);
        }
    }

    return (
        <>
            {showPerformanceWarning &&
                <PopupMessage
                    title="Warning" 
                    text={`You are about to open ${totalTabsCount} or more tabs at once. Opening this many may slow down your browser. Do you want to proceed?`}
                    primaryButton={{ text: "Yes, open selected folders", callback: proceedFolderLaunch}}
                    secondaryButton={{ text: "No, do not open", callback: denyFolderLaunch}}    
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
                        <div data-testid="search-results-area" id="search-results-area" className={`${popup_container_transparent_bg} w-screen h-full top-0 bg-[rgba-] absolute z-500 left-0 flex justify-center`}>
                            <div ref={searchResultsContainerRef} className={`bg-white absolute p-6 ml-16 mt-10 transition-all ease-in duration-75 overflow-hidden w-7/12 z-10 rounded-lg drop-shadow-[0_3px_2px_rgba(0,0,0,0.15)]`}>
                                <SearchResults keyword={keyword} folders={folderCollectionState} session={sessionSectionState} history={historySectionState} launchFolder={handlePrepareLaunchFolder} />   
                            </div>
                        </div>
                    ) 
                }
            </div>
        </>
    ); 
}

export default AdvancedSearchBar;