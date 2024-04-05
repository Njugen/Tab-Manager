import { iFolderItem } from "../../../../interfaces/folder_item";
import { iWindowItem } from "../../../../interfaces/window_item";
import WindowItem from "../../window_item";

interface INewWindow {
    folder: iFolderItem,
    inCreationId: number
}

// Renders a section for creating windows, if
// the inCreationId has been passed in and does not exist in the current window list.
// inCreationId is meant to be a random number.
const NewWindow = (props: INewWindow): JSX.Element => {
    const { folder, inCreationId} = props;

    // Get the current set of windows and return windows that matches inCreationId
    const window: Array<iWindowItem> = folder.windows.filter((target: iWindowItem) => {
       return target.id === inCreationId
    });
  
    // If no windows with such id exists, then create a new one with that id
    if(window && window.length === 0){
        return (
            <WindowItem 
                key={"new-window"} 
                tabsCol={2} 
                disableMark={true} 
                disableEdit={false} 
                id={inCreationId} 
                tabs={[]} 
                initExpand={true} 
            />
        );
    } else {
        return <></>;
    }
}

export { INewWindow, NewWindow }