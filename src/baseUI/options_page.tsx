import '../App.css';
import "../styles/global_utils.module.scss";
import styles from "../styles/global_utils.module.scss";
import Navlink from '../components/utils/navlink';
import { useEffect, useRef, useState } from 'react';
import DashboardView from '../views/dashboard/dashboard_view';
import SettingsView from '../views/settings/settings_view';
import LeftIcon from '../components/icons/left_icon';
import RightIcon from '../components/icons/right_icon';
import AdvancedSearchBar from '../components/features/advanced_search_bar/advanced_search_bar';
import iOptionsPage from '../interfaces/options_page';
import { useDispatch, useSelector } from 'react-redux';
import { getFromStorage } from '../services/webex_api/storage';
import { readAllFoldersFromBrowserAction, setUpFoldersAction } from '../redux/actions/folder_collection_actions';
import { setUpTabsAction } from '../redux/actions/history_settings_actions';
import MultipleFoldersIcon from '../components/icons/multiple_folders_icon';
import ConfigIcon from '../components/icons/config_icon';

const RenderOptionsPage = (props: iOptionsPage): JSX.Element => {
  
  // Determine what navigation link (sidebar links) to mark as preset
  const presetActiveNavLink = (): string => {
    const url: string = window.location.href;
    const urlSplit: Array<string> = url.split("?");

    if(urlSplit.length === 2){
      const paramSplit: Array<string> =  urlSplit[1].split("=");
      const key: string = paramSplit[0];
      const val: string = paramSplit[1];

      return val;
    } else {
      return "main";
    }
  }

  const [activeNavLink, setActiveNavLink] = useState<string>(presetActiveNavLink()); 
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(localStorage["expanded_sidebar"] === "true" ? true : false);

  const rootRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

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

  const historyRemovedListener = (result: chrome.history.RemovedResult): void => {
    searchHistory();
  }

  const historyVisitedListener = (result: chrome.history.HistoryItem): void => {
    searchHistory();
  }

  useEffect(() => {
    // Listen for changes in browser storage
    chrome.storage.onChanged.addListener(storageListener);
    chrome.history.onVisitRemoved.addListener(historyRemovedListener);
    chrome.history.onVisited.addListener(historyVisitedListener);

    return () => {
      chrome.storage.onChanged.removeListener(storageListener);
      chrome.history.onVisitRemoved.addListener(historyRemovedListener);
      chrome.history.onVisited.addListener(historyVisitedListener);
    }
  }, []);

  // Expand/collapse sidebar, and save the information in the browser storage
  const handleSidebarExpandButton = (): void => {
    setSidebarExpanded(sidebarExpanded === true ? false : true);
    localStorage.setItem("expanded_sidebar", localStorage["expanded_sidebar"] === "true" ? "false" : "true");
  }

  const renderExpandedSidebarNav = (): JSX.Element => {
    return (
      <div id="main-menu" className="px-2 py-4">
          <Navlink key="folders-nav-link" label="Dashboard" url="?view=main" isActive={activeNavLink === "main" ? true : false} onClick={() => setActiveNavLink("main")}>
            <MultipleFoldersIcon size={20} fill={activeNavLink === "main" ? "rgb(109 0 194)" : "#525252"} />
          </Navlink>
          <Navlink key="settings-nav-link" label="Settings" url="?view=settings" isActive={activeNavLink === "settings" ? true : false} onClick={() => setActiveNavLink("settings")}>
            <ConfigIcon size={20} fill={activeNavLink === "settings" ? "rgb(109 0 194)" : "#525252"} />
          </Navlink>
      </div>
    );
  }

  const renderCollapsedSidebarNav = (): JSX.Element => {
    return (
      <div id="main-menu" className="flex flex-col items-center justify-center">
        <div className="">
          <div className={`my-2 border rounded-lg ${activeNavLink === "main" ? "border-tbfColor-lightpurple" : "border-tbfColor-middlegrey2"}`}>
            <Navlink key="folders-nav-link" url="?view=main" isActive={activeNavLink === "main" ? true : false} onClick={() => setActiveNavLink("main")}>
              <MultipleFoldersIcon size={32} fill={activeNavLink === "main" ? "rgb(109 0 194)" : "#525252"} />
            </Navlink>
          </div>
          <div className={`my-2 border rounded-lg ${activeNavLink === "settings" ? "border-tbfColor-lightpurple" : "border-tbfColor-middlegrey2"}`}>
            <Navlink key="settings-nav-link" url="?view=settings" isActive={activeNavLink === "settings" ? true : false} onClick={() => setActiveNavLink("settings")}>
              <ConfigIcon size={32} fill={activeNavLink === "settings" ? "rgb(109 0 194)" : "#525252"} />
            </Navlink>
          </div>
        </div>
      </div>
    );
  }

  // Render the plugin's user interface
  const renderUI = (view: JSX.Element): JSX.Element => {
    return (
      <>       
        <div className="flex h-full w-full relative bg-gray-50">
          <div id="sidebar" className={`drop-shadow-md h-[calc(100vh)] transition-all sticky top-0 self-start ${sidebarExpanded === true ? `w-[220px]` : `w-[70px]`} items-end flex flex-col justify-between border-tbfColor-middlegrey bg-white`}>
              <div className="w-full px-2 overflow-hidden">
                {sidebarExpanded === true ? renderExpandedSidebarNav() : renderCollapsedSidebarNav()}
              </div>
              <button className={`flex justify-center bottom-0 right-0 float-right h-6 ${sidebarExpanded === true ? "w-full" : "w-full"} bg-tbfColor-middlegrey2 hover:opacity-70 transition-all ease-in`} onClick={handleSidebarExpandButton}>
                {sidebarExpanded === true ? <LeftIcon size={20} fill="#828282" /> : <RightIcon size={20} fill="#828282" />}
              </button>  
          </div>
      
          
          <div ref={rootRef} id="body" className="container px-16">
            <AdvancedSearchBar />
            <div className="mb-12 mt-16 pb-[50px]">
              {view}
            </div>
          </div>
        </div>
      </>
    );
  };

  // Routing. Encapsulate a page component in the renderUI for each path.
  const renderView = (): JSX.Element => {
    const url: string = window.location.href;
    const urlSplit: Array<string> = url.split("?");
    let result: JSX.Element = <></>;

    if(urlSplit.length === 1){
      result = renderUI(<DashboardView data-testid="ffff" />);
    } else if(urlSplit.length === 2){
      const paramSplit: Array<string> =  urlSplit[1].split("=");
      const key: string = paramSplit[0];
      const val: string = paramSplit[1]
      
      if(key === "view"){
        if(val === "main"){
          result = renderUI(<DashboardView />);
        } else if(val === "settings"){
          result = renderUI(<SettingsView />);
        } else {
          result = renderUI(<DashboardView />);
        }
        
      } else {
        result = renderUI(<DashboardView />);
      }
    }
    
    return result;
  }

  return renderView();
}

export default RenderOptionsPage;