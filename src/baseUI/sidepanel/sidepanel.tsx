import SimpleSearchBar from '../../components/utils/simple_search_bar';
import '../../App.css';
import { useEffect, useState } from 'react';
import Navlink from '../../components/utils/navlink';
import SearchResultsContainer from '../../views/sidepanel/search_results_view';
import MultipleFoldersIcon from '../../components/icons/multiple_folders_icon';
import ConfigIcon from '../../components/icons/config_icon';
import CircleButton from '../../components/utils/circle_button';
import CollapseIcon from '../../components/icons/collapse_icon';
import PanelView from './components/panel_view';

/*
  Base template for the plugin's side panel.
  
  A sidepanel in the browser refers to the quick view located to the right or left
  side of the browser window. It can be accessed by hitting CTRL + B.

  This plugin has its own sidepanel, where the most trivial features are located. More
  advanced features and extended overview are located in the Option Page 
*/

function SidePanel(props: any): JSX.Element {
    const [view, setView] = useState<string>("folders-view");
    const [keyword, setKeyword] = useState<string>("");
    const [showScrollUpButton, setShowScrollUpButton] = useState<boolean>(false);
    
    let activeNavButtonCSS = "text-tbfColor-lightpurple font-semibold";
    let inactiveNavButtonCSS = "text-gray-400 hover:text-tbfColor-lighterpurple transition ease-in-out duration-300 font-semibold";

    const handleSetShowScrollUpButton = (e: any): void => {
        if(window.scrollY === 0){
          setShowScrollUpButton(false);
        } else {
          if(showScrollUpButton === false) setShowScrollUpButton(true);
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", handleSetShowScrollUpButton);

        return () => window.removeEventListener("scroll", handleSetShowScrollUpButton);
    }, [])

    const handleSearchBarChange = (e: any): void => {
        setKeyword(e.target.value);
    } 

    return (
        <>
            <CircleButton disabled={false} bgCSSClass={`${showScrollUpButton === true ? "block" : "hidden"} transition-all bg-tbfColor-lightpurple shadow-lg fixed bottom-24 right-4 z-[10000]`} onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}>
                <CollapseIcon size={32} fill="#fff" />  
            </CircleButton>
            {keyword && <SearchResultsContainer keyword={keyword} onClose={() => setKeyword("")} />}
            <div className={"p-4 border-b border-gray-100 sticky top-0 z-50 bg-white"}>
                <section>
                    <SimpleSearchBar onChange={handleSearchBarChange} />
                </section>
                <nav className="flex justify-between mt-8">
                    <button onClick={() => setView("folders-view")} className={view === "folders-view" ? activeNavButtonCSS : inactiveNavButtonCSS}>Folders</button>
                    <button onClick={() => setView("current-session-view")} className={view === "current-session-view" ? activeNavButtonCSS : inactiveNavButtonCSS}>Current session</button>
                    <button onClick={() => setView("history-view")} className={view === "history-view" ? activeNavButtonCSS : inactiveNavButtonCSS}>History</button>
                </nav>
            </div>
            {!keyword && <PanelView view={view} />}
            <footer className="shadow font-bold bg-white sticky bottom-0 px-4 py-4 border-t-2 border-t-tbfColor-lightpurple flex justify-around z-50">
                <Navlink key="folders-nav-link" label="Advanced" url="?view=main" isActive={false} onClick={() => window.open("./options.html#main", "_blank")}>
                    <MultipleFoldersIcon size={20} fill={"#525252"} />
                </Navlink>
                <Navlink key="settings-nav-link" label="Settings" url="?view=settings" isActive={false} onClick={() => window.open("./options.html#settings", "_blank")}>
                    <ConfigIcon size={20} fill={"#525252"} />
                </Navlink>
            </footer>
        </>
    )
}

export default SidePanel;