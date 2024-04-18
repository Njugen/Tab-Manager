import iPanelView from "../../../interfaces/panel_view";
import CurrentSessionView from "../../../views/sidepanel/current_session_view";
import FoldersView from "../../../views/sidepanel/folders_view";
import HistoryView from "../../../views/sidepanel/history_view";
import styles from "../../../styles/global_utils.module.scss";

const PanelView = (props: iPanelView): JSX.Element => {
    const { view } = props;
    let component: JSX.Element = <></>;
    
    if(view === "folders-view"){
        component = <FoldersView />
    } else if(view === "current-session-view"){
        component = <CurrentSessionView />
    } else if(view === "history-view"){
        component = <HistoryView />
    }

    return(
        <main className={`overflow-y-auto px-2 pb-24 pt-2 ${styles.scroll_style} bg-white min-h-[1000px]`}> 
            {component}
        </main>
    );
}

export default PanelView;