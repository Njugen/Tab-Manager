import { useMemo } from "react";
import { iWindowItem } from "../../../../interfaces/window_item";
import WindowItem from "../../window_item";
import { INewWindow, NewWindow } from "./window_manager_new_window";
import { useDispatch } from "react-redux";
import { setIsEditingTab } from "../../../../redux-toolkit/slices/misc_slice";
import { updateFolder } from "../../../../redux-toolkit/slices/folder_management_slice";

interface IWindowList extends INewWindow {
    createWindow: boolean
}

// List all windows. the windows are adjusted to folder manager itself
const WindowList = (props: IWindowList): JSX.Element => {
    const { folder, inCreationId, createWindow } = props;

    const existingWindows = folder?.windows;

    const dispatch = useDispatch();

    // Delete from the in-edit editor
    const handleDelete = (id: number) => {
        const windows = existingWindows.filter((target: iWindowItem) => target.id !== id);

        dispatch(setIsEditingTab(false));
        dispatch(updateFolder(["windows", windows]));
        dispatch(setIsEditingTab(false));
    }

    const existingWindowsElements: Array<JSX.Element> = useMemo(() => existingWindows?.map((item: iWindowItem) => {
        return (
            <WindowItem 
                tabsCol={2} 
                disableMark={false} 
                disableEdit={false} 
                disableAddTab={false}
                disableDeleteTab={true}
                disableEditTab={false}
                disableMarkTab={false}
                onDelete={handleDelete}
                key={item.id} 
                id={item.id} 
                tabs={item.tabs} 
            />
        )
    }), [folder]);
    
    if(createWindow === true && inCreationId > 0){
        return (
        <>
            {existingWindowsElements} 
            <NewWindow folder={folder} inCreationId={inCreationId} />
        </>
        );
    } else {
        if (existingWindowsElements?.length > 0){
            return (
                <ul className="w-full list-none">{existingWindowsElements}</ul>
            );
        } else {
            return <p>There are no windows in this folder. Please, create one by clicking the button below.</p>;
        }
    }
}

export default WindowList;