/***
 * Base UI template for plugin's options page. Provides basic features and encapsulate
 * views and page components
*/

import '../../App.css';
import "../../styles/global_utils.module.scss";
import { useEffect, useRef, useState } from 'react';
import LeftIcon from '../../components/icons/left_icon';
import RightIcon from '../../components/icons/right_icon';
import AdvancedSearchBar from '../../components/features/advanced_search_bar/advanced_search_bar';
import iOptionsPage from '../../interfaces/options_page';
import { useDispatch } from 'react-redux';
import { readAllFoldersFromBrowserAction } from '../../redux/actions/folder_collection_actions';
import { setUpTabsAction } from '../../redux/actions/history_settings_actions';
import CircleButton from '../../components/utils/circle_button';
import CollapseIcon from '../../components/icons/collapse_icon';
import presetActiveNavLink from './functions/presetActiveNavLink';
import ExpandedSidebarNav from './components/expanded_sidebar_nav';
import CollapsedSidebarNav from './components/collapsed_sidebar_nav';
import PageView from './components/page_view';

/*
  Base template for the plugin's option page.
  
  "Option Page" is the Webextension term for the settings UI of a 
  browser plugin. E.g. in Chrome, the options page can be accessed through:

  Menu -> Extensions -> Manage Extensions -> Details -> Extension Options

  OR by right clicking on the plugin's icon in the taskbar, and select "Options"
*/
const OptionsPage = (props: iOptionsPage): JSX.Element => {
  const [activeNavLink, setActiveNavLink] = useState<string>(presetActiveNavLink("main")); 
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(localStorage["expanded_sidebar"] === "true" ? true : false);
  const [showScrollUpButton, setShowScrollUpButton] = useState<boolean>(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const handleSetShowScrollUpButton = (e: any): void => {
    if(window.scrollY === 0){
      setShowScrollUpButton(false);
    } else if(showScrollUpButton === false){
      setShowScrollUpButton(true);
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

  const storageListener = (changes: any, areaName: string): void => {
    if(areaName === "local"){
        if(changes.folders){
          dispatch(readAllFoldersFromBrowserAction(changes.folders.newValue));
        }
    }
  };

  useEffect(() => {
    // Listen to whenever the user scroll's the browser window
    window.addEventListener("scroll", handleSetShowScrollUpButton);

    // Listen for changes in browser storage
    chrome.storage.onChanged.addListener(storageListener);
    chrome.history.onVisitRemoved.addListener(searchHistory);
    chrome.history.onVisited.addListener(searchHistory);

    return () => {
      // Remove all listeners once the component gets destroyed.
      window.removeEventListener("scroll", handleSetShowScrollUpButton);

      chrome.storage.onChanged.removeListener(storageListener);
      chrome.history.onVisitRemoved.addListener(searchHistory);
      chrome.history.onVisited.addListener(searchHistory);
    }
  }, []);

  // Expand/collapse sidebar, and save the information to localStorage
  const handleSidebarExpandButton = (): void => {
    setSidebarExpanded(sidebarExpanded === true ? false : true);
    localStorage.setItem("expanded_sidebar", localStorage["expanded_sidebar"] === "true" ? "false" : "true");
  }

  return (
    <>       
      <CircleButton disabled={false} bgCSSClass={`${showScrollUpButton === true ? "block" : "hidden"} transition-all bg-tbfColor-lightpurple shadow-xl fixed bottom-8 right-8 z-[10000]`} onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}>
          <CollapseIcon size={32} fill="#fff" />  
      </CircleButton>
      <div className="flex h-full w-full relative bg-gray-50">
        <div id="sidebar" className={`drop-shadow-md h-[calc(100vh)] transition-all sticky top-0 self-start ${sidebarExpanded === true ? `w-[220px]` : `w-[70px]`} items-end flex flex-col justify-between border-tbfColor-middlegrey bg-white`}>
            <div className="w-full px-2 overflow-hidden">
              {
                sidebarExpanded === true ? 
                <ExpandedSidebarNav active={activeNavLink} onSetActive={setActiveNavLink} /> 
                : <CollapsedSidebarNav active={activeNavLink} onSetActive={setActiveNavLink} />
              }
            </div>
            <button className={`flex justify-center bottom-0 right-0 float-right h-6 ${sidebarExpanded === true ? "w-full" : "w-full"} bg-tbfColor-middlegrey2 hover:opacity-70 transition-all ease-in`} onClick={handleSidebarExpandButton}>
              {sidebarExpanded === true ? <LeftIcon size={20} fill="#828282" /> : <RightIcon size={20} fill="#828282" />}
            </button>  
        </div>
    
        
        <div ref={rootRef} id="body" className="container px-16">
          <AdvancedSearchBar />
          <div className="mb-12 mt-16 pb-[50px]">
            <PageView />
          </div>
        </div>
      </div>
    </>
  );
}

export default OptionsPage;