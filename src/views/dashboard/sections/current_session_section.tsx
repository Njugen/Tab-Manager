import "../../../styles/global_utils.module.scss";
import PrimaryButton from '../../../components/utils/primary_button/primary_button';
import FolderManager from '../../../components/features/folder_manager/folder_manager';
import { useEffect, useMemo, useState } from "react";
import { iFolderItem } from '../../../interfaces/folder_item';
import { useDispatch, useSelector } from 'react-redux';
import { clearInEditFolder  } from '../../../redux/actions/in_edit_folder_actions';
import randomNumber from '../../../tools/random_number';
import { iWindowItem } from '../../../interfaces/window_item';
import { clearMarkedFoldersAction } from '../../../redux/actions/folder_settings_actions';
import { clearMarkedTabsAction} from '../../../redux/actions/history_settings_actions';
import { iTabItem } from '../../../interfaces/tab_item';
import { iFieldOption } from '../../../interfaces/dropdown';
import { setUpWindowsAction } from '../../../redux/actions/current_session_actions';
import AddToFolderPopup from '../../../components/features/add_to_folder_popup';
import SectionContainer from "../../../components/utils/section_container";
import WindowItem from "../../../components/features/window_item";
import iCurrentSessionState from "../../../interfaces/states/current_session_state";

const CurrentSessionSection = (props: any): JSX.Element => {
    const [addToWorkSpaceMessage, setAddToFolderMessage] = useState<boolean>(false);
    const [mergeProcess, setMergeProcess] = useState<iFolderItem | null>(null);
    const [createFolder, setCreateFolder] = useState<boolean>(false);

    const folderCollectionState: Array<iFolderItem> = useSelector((state: any) => state.folderCollectionReducer);
    const sessionSectionState = useSelector((state: any) => state.sessionSectionReducer);

    const dispatch = useDispatch();

    useEffect(() => {
        getAllWindows();

        chrome.windows.onCreated.addListener(() => {
            getAllWindows();
        });
    
        chrome.windows.onRemoved.addListener(() => {
            getAllWindows();
        });

        chrome.tabs.onCreated.addListener(() => {
            getAllWindows();
        });

        chrome.tabs.onRemoved.addListener(() => {
            getAllWindows();
        });

        chrome.tabs.onDetached.addListener(() => {
            getAllWindows();
        });

        chrome.tabs.onMoved.addListener(() => {
            getAllWindows();
        });

        chrome.tabs.onReplaced.addListener(() => {
            getAllWindows();
        });

        chrome.tabs.onUpdated.addListener(() => {
            getAllWindows();
        });
    }, []);

    const getAllWindows = (): void => {
        const queryOptions: chrome.windows.QueryOptions = {
            populate: true,
            windowTypes: ["normal", "popup"]
        };
        chrome.windows.getAll(queryOptions, (windows: Array<chrome.windows.Window>) => {
            dispatch(setUpWindowsAction(windows));
        });
    };

    const handleCloseFolderManager = (): void => {
        // Reset and clear out any settings or processes 
        setCreateFolder(false);
        setMergeProcess(null);

        dispatch(clearMarkedTabsAction());
        dispatch(clearMarkedFoldersAction());
        dispatch(clearInEditFolder());
    }

    const renderOptionsMenu = (): JSX.Element => {
        return (
            <>
                <div className="inline-flex items-center justify-end">
                    <div className="flex">
                   
                    </div>
                    <div className="flex items-center justify-end">
                        <PrimaryButton 
                            disabled={false} 
                            text="Add to folder" 
                            onClick={() => setAddToFolderMessage(true)} 
                        />
                    </div>
                </div>
            </>
        )
    }

    const renderEmptyMessage = (): JSX.Element => {
        return (
            <div className={"flex justify-center items-center"}>
                <p> Your browing history is empty.</p>
            </div>
        );
    }

    const windowList = useMemo((): JSX.Element => {
        const existingWindows = sessionSectionState?.windows;
        const existingWindowsElements: Array<JSX.Element> = existingWindows?.map((item: iWindowItem, i: number) => {
            return (
                <WindowItem 
                    key={`window-item-${i}`} 
                    tabsCol={4} 
                    disableEdit={true} 
                    disableTabMark={true} 
                    disableTabEdit={true} 
                    id={item.id} 
                    tabs={item.tabs} 
                    initExpand={true} 
                />
            );
        });
        
        if (existingWindowsElements?.length > 0){
            return <>{existingWindowsElements}</>;
        } else {
            return <>{renderEmptyMessage()}</>;
        }
    }, [sessionSectionState.windows]);

    const handleAddToNewFolder = (): void => {
        setAddToFolderMessage(false);
        setCreateFolder(true);
    }

    const handleAddToExistingFolder = (e: any): void => {
        if(e.selected === -1) return;

        const targetFolderId = e.selected;
        const targetFolder: iFolderItem | undefined = folderCollectionState.find((folder: iFolderItem) => folder.id === targetFolderId);
     
        if(!targetFolder) return;
        
        if(sessionSectionState.windows){
            const newWindowItems: Array<iWindowItem> = sessionSectionState.windows.map((window: chrome.windows.Window) => {
                if(window.tabs){
                    const tabs: Array<iTabItem> = window.tabs.map((tab: chrome.tabs.Tab) => {
                        return {
                            id: tab.id || randomNumber(),
                            label: tab.title || "",
                            url: tab.url || "",
                            marked: false,
                            disableEdit: false,
                            disableMark: false,
                        }
                    })

                    return {
                        id: randomNumber(),
                        tabs: tabs
                    }
                }
            })

            const updatedFolder: iFolderItem = {...targetFolder};
            updatedFolder.windows = [...updatedFolder.windows,  ...newWindowItems];

            if(targetFolder){
                setAddToFolderMessage(false);
                setMergeProcess(updatedFolder);
            }
        }
        
    }

    const renderAddTabsMessage = (): JSX.Element => {
        const currentFolders: Array<iFolderItem> = folderCollectionState;

        const options: Array<iFieldOption> = currentFolders.map((folder) => {
            return { id: folder.id, label: folder.name }
        });

        const dropdownOptions: Array<iFieldOption> = [
            {
                id: -1,
                label: "Select a folder"
            },
            ...options
        ];

        return (
            <AddToFolderPopup
                title="Add to folder"
                type="slide-in"
                dropdownOptions={dropdownOptions}
                onNewFolder={handleAddToNewFolder}
                onExistingFolder={handleAddToExistingFolder}
                onCancel={() => setAddToFolderMessage(false)}
            />
        );
    }
    
    const renderFolderManager = (): JSX.Element => {
        let render = <></>;

        if(createFolder === true){
            const presetWindows: Array<iWindowItem> = sessionSectionState.windows.map((window: chrome.windows.Window) => {
                if(window.tabs){
                    const tabs: Array<iTabItem> = window.tabs.map((tab: chrome.tabs.Tab) => {
                        return {
                            id: tab.id || randomNumber(),
                            label: tab.title || "",
                            url: tab.url || "",
                            marked: false,
                            disableEdit: false,
                            disableMark: false,
                        }
                    })

                    return {
                        id: randomNumber(),
                        tabs: tabs
                    }
                }
            })

            const folderSpecs: iFolderItem = {
                id: randomNumber(),
                name: "",
                desc: "",
                type: "expanded",
                viewMode: "grid",
                marked: false,
                windows: [...presetWindows],
            }
            render = <FolderManager type="slide-in" title="Create folder" folder={folderSpecs} onClose={handleCloseFolderManager} />;
        } else if(mergeProcess !== null) {
            render = <FolderManager type="slide-in" title={`Merge tabs to ${mergeProcess.name}`} folder={mergeProcess} onClose={handleCloseFolderManager} />;
        }

        return render;
    }

    return (
        <>
            {addToWorkSpaceMessage && renderAddTabsMessage()}
            {renderFolderManager()}
            <SectionContainer id="currentSession-view" title="Current session" options={renderOptionsMenu}>
                {windowList}
            </SectionContainer>
        </>  
    );

}

export default CurrentSessionSection