import WindowItem from "../../window_item";
import { iWindowItem } from "../../../../interfaces/window_item";
import { useSelector } from "react-redux";

interface IFolderWindowListProps {
    windows: Array<iWindowItem>,
    viewMode: "list" | "grid"
}

const cols = (folderViewMode: string, windowViewMode: string): number => {
    if(folderViewMode === "grid"){
        return 1;
    } else {
        if(windowViewMode === "list"){
            return 4;
        } else {
            return 2;
        }
    }
}

// Render a list of all windows in the folder. The window components are adjusted to suit folder behaviour
const FolderWindowList = (props: IFolderWindowListProps): JSX.Element => {
    const { windows, viewMode } = props;

    const folderSettingsState = useSelector((state: any) => state.folderSettingsReducer);

    const decisiveCols: number = cols(folderSettingsState.viewMode, viewMode);

    const result: Array<JSX.Element> = windows.map((window, index): JSX.Element => (
        <WindowItem 
            tabsCol={decisiveCols} 
            disableTabMark={true} 
            disableTabEdit={true} 
            key={"window-" + index} 
            id={window.id} 
            tabs={window.tabs} 
        />
    ));

    return <>{result}</>;
}

export default FolderWindowList;