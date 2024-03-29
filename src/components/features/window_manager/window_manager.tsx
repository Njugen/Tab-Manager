import PrimaryButton from "../../utils/primary_button/primary_button";
import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import randomNumber from "../../../tools/random_number";
import iWindowManager from "../../../interfaces/window_manager";
import WindowList from './child_components/window_list';

/*
    Section for managing windows and tabs, primarily used
    within folder configuration popups
*/
const WindowManager = (props: iWindowManager): JSX.Element => {
    const [createWindow, setCreateWindow] = useState<boolean>(false);
    const [inCreationId, setIncreationId] = useState<number>(-1);

    const folderManagerState = useSelector((state: any) => state.folderManagerReducer);

    // Once the inEdit reducer changes, stop creating window
    useEffect(() => {
        setIncreationId(-1);
        setCreateWindow(false);
    }, [folderManagerState]);

    // Add a new window with a random id
    const handleCreateWindow = (): void => {
        setIncreationId(randomNumber());
        setCreateWindow(true);
    }

    return (
        <div data-testid="window-manager" className="py-6 min-h-[200px] flex flex-col items-center justify-center">
            {<WindowList folder={folderManagerState} createWindow={createWindow} inCreationId={inCreationId} />}
            { 
                <div className="flex flex-row mt-10">
                    <PrimaryButton disabled={false} text="New window" onClick={handleCreateWindow} />            
                </div> 
            }            
        </div> 
    ); 
}

export default WindowManager;