import SimpleSearchBar from '../components/utils/simple_search_bar';
import '../App.css';
import styles from "../styles/global_utils.module.scss";
import "./../styles/sidepanel_specific.css";
import { useState } from 'react';
import Navlink from '../components/utils/navlink';
import FoldersView from '../views/sidepanel/folders_view';
import CurrentSessionView from '../views/sidepanel/current_session_view';
import HistoryView from '../views/sidepanel/history_view';
import SearchResultsContainer from '../views/sidepanel/search_results_view';
import iRenderSidePanel from '../interfaces/render_sidepanel';
import MultipleFoldersIcon from '../components/icons/multiple_folders_icon';
import ConfigIcon from '../components/icons/config_icon';

function RenderSidePanel(props: iRenderSidePanel): JSX.Element {
    const [view, setView] = useState<string>("folders-view");
    const [keyword, setKeyword] = useState<string>("");
    
    let activeNavButtonCSS = "text-tbfColor-lightpurple font-semibold";
    let inactiveNavButtonCSS = "text-gray-400 hover:text-tbfColor-lighterpurple transition ease-in-out duration-300 font-semibold";

    const renderView = (): JSX.Element => {
        let component: JSX.Element = <></>;
        
        if(view === "folders-view"){
            component = <FoldersView />
        } else if(view === "current-session-view"){
            component = <CurrentSessionView />
        }else if(view === "history-view"){
            component = <HistoryView />
        }

        return(
            <div className={`overflow-y-auto px-2 pt-2 ${styles.scroll_style} bg-white min-h-[1000px]`}> 
                {component}
            </div>
        );
    }

    const handleSearchBarChange = (e: any): void => {
        setKeyword(e.target.value);
    } 

    return (
        <>
            {keyword && <SearchResultsContainer keyword={keyword} onClose={() => setKeyword("")} />}
            <div className={"p-4 border-b border-gray-100 sticky top-0 z-50 bg-white shadow"}>
                <SimpleSearchBar onChange={handleSearchBarChange} />
                <div className="flex justify-between mt-8">
                    <button onClick={() => setView("folders-view")} className={view === "folders-view" ? activeNavButtonCSS : inactiveNavButtonCSS}>Folders</button>
                    <button onClick={() => setView("current-session-view")} className={view === "current-session-view" ? activeNavButtonCSS : inactiveNavButtonCSS}>Current session</button>
                    <button onClick={() => setView("history-view")} className={view === "history-view" ? activeNavButtonCSS : inactiveNavButtonCSS}>History</button>
                </div>
            </div>
            {!keyword && renderView()}
            <div className="shadow font-bold bg-white sticky bottom-0 px-4 py-4 border-t-2 border-t-tbfColor-lightpurple flex justify-around z-50">
                <Navlink key="folders-nav-link" label="Advanced" url="?view=main" isActive={false} onClick={() => window.open("./options.html?view=main", "_blank")}>
                    <MultipleFoldersIcon size={20} fill={"#525252"} />
                </Navlink>
                <Navlink key="settings-nav-link" label="Settings" url="?view=settings" isActive={false} onClick={() => window.open("./options.html?view=settings", "_blank")}>
                    <ConfigIcon size={20} fill={"#525252"} />
                </Navlink>
            </div>
        </>
    )
}

export default RenderSidePanel;