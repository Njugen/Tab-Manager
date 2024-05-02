import iPanelView from "../../../interfaces/panel_view";
import SessionView from "../../../views/sidepanel/session_view";
import FoldersView from "../../../views/sidepanel/folders_view";
import HistoryView from "../../../views/sidepanel/history_view";
import { useEffect, useState } from "react";
import CircleButton from "../../../components/utils/circle_button";
import CollapseIcon from "../../../components/icons/collapse_icon";

const PanelView = (props: iPanelView): JSX.Element => {
    const { view } = props;
    let component: JSX.Element = <></>;
    const [showScrollUpButton, setShowScrollUpButton] = useState<boolean>(false);

    useEffect(() => {
        // Listen to whenever the user scroll's the browser window
        window.addEventListener("scroll", handleSetShowScrollUpButton);
    
        return () => {
          // Remove all listeners once the component gets destroyed.
          window.removeEventListener("scroll", handleSetShowScrollUpButton);
        }
    }, []);

    const handleSetShowScrollUpButton = (e: any): void => {
    if(window.scrollY === 0){
        setShowScrollUpButton(false);
    } else if(showScrollUpButton === false){
        setShowScrollUpButton(true);
    } 
    }

    if(view === "folders"){
        component = <FoldersView />
    } else if(view === "session"){
        component = <SessionView />
    } else if(view === "history"){
        component = <HistoryView />
    }

    return(
        <>
            <CircleButton disabled={false} bgCSSClass={`${showScrollUpButton ? "block" : "hidden"} transition-all bg-tbfColor-lightpurple shadow-xl fixed bottom-24 right-2 z-[10000]`} onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}>
                <CollapseIcon size={32} fill="#fff" />  
            </CircleButton>
            <main className={`overflow-y-auto px-2 pb-24 pt-2 bg-white min-h-[1000px]`}> 
                {component}
            </main>
        </>
    );
}

export default PanelView;