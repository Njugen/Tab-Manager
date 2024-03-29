import { iWindowItem } from "../../../../interfaces/window_item";
import WindowItem from "../../window_item";
import { INewWindow, NewWindow } from "./window_manager_new_window";

interface IWindowList extends INewWindow {
    createWindow: boolean
}

// List all windows. the windows are adjusted to folder manager itself
const WindowList = (props: IWindowList): JSX.Element => {
    const { folder, inCreationId, createWindow } = props;

    const existingWindows = folder?.windows;
    const existingWindowsElements: Array<JSX.Element> = existingWindows?.map((item: iWindowItem) => {
        return (
            <WindowItem 
                tabsCol={2} 
                disableMark={false} 
                disableEdit={false} 
                key={item.id} 
                id={item.id} 
                tabs={item.tabs} 
                initExpand={item.initExpand} 
            />
        )
    });
    
    if(createWindow === true && inCreationId > 0){
        return (
        <>
            {existingWindowsElements} 
            <NewWindow folder={folder} inCreationId={inCreationId} />
        </>
        );
    } else {
        if (existingWindowsElements?.length > 0){
            return <>{existingWindowsElements}</>;
        } else {
            return <p>There are no windows in this folder. Please, create one by clicking the button below.</p>;
        }
    }
}

export default WindowList;