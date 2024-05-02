import PrimaryButton from "../../utils/primary_button/primary_button";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import randomNumber from "../../../tools/random_number";
import iWindowManager from "../../../interfaces/window_manager";
import WindowList from './components/window_list';
import { iFolderItem } from "../../../interfaces/folder_item";

/*
    Section for managing windows and tabs, primarily used
    within folder configuration popups
*/
const WindowManager = (props: iWindowManager): JSX.Element => {
    const [createWindow, setCreateWindow] = useState<boolean>(false);
    const [inCreationId, setIncreationId] = useState<number>(-1);

    const folderManagementState: iFolderItem = useSelector((state: any) => state.folderManagement);

    
    const windowCreationProcess = (on: boolean): void => {
        // on = true: Tell the component that a window is being created
        // on = false: Tell the component no windows are created. Component behaves like normal
        if(on){
            setIncreationId(randomNumber());
            setCreateWindow(true);
        } else {
            setIncreationId(-1);
            setCreateWindow(false);
        }
    }

    useEffect(() => {
        windowCreationProcess(false)
    }, [folderManagementState]);

    const handleCreateWindow = (): void => {
        windowCreationProcess(true)
    }

    return (
        <div className="py-6 min-h-[200px] flex flex-col items-center justify-center">
            <WindowList folder={folderManagementState} createWindow={createWindow} inCreationId={inCreationId} />
            { 
                <div className="flex flex-row mt-10">
                    <PrimaryButton disabled={false} text="New window" onClick={handleCreateWindow} />            
                </div> 
            }            
        </div> 
    ); 
}

export default WindowManager;