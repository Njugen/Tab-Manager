import "../../../styles/global_utils.module.scss";
import PrimaryButton from '../../../components/utils/primary_button/primary_button';
import FolderManager from '../../../components/features/folder_manager/folder_manager';
import { useEffect, useState } from "react";
import { iFolderItem } from '../../../interfaces/folder_item';
import { useDispatch, useSelector } from 'react-redux';
import { clearInEditFolder  } from '../../../redux/actions/in_edit_folder_actions';
import randomNumber from '../../../tools/random_number';
import { iWindowItem } from '../../../interfaces/window_item';
import { clearMarkedFoldersAction } from '../../../redux/actions/workspace_settings_actions';
import { clearMarkedTabsAction} from '../../../redux/actions/history_settings_actions';
import { iTabItem } from '../../../interfaces/tab_item';
import { iFieldOption } from '../../../interfaces/dropdown';
import { setUpWindowsAction } from '../../../redux/actions/current_session_actions';
import AddToWorkspacePopup from '../../../components/features/add_to_workspace_popup';
import SectionContainer from "../../../components/utils/section_container";
import WindowItem from "../../../components/features/window_item";

const CurrentSessionSection = (props: any): JSX.Element => {
    const [addToWorkSpaceMessage, setAddToWorkspaceMessage] = useState<boolean>(false);
    const [mergeProcess, setMergeProcess] = useState<iFolderItem | null>(null);
    const [createFolder, setCreateFolder] = useState<boolean>(false);

    const folder_collection_state: Array<iFolderItem> = useSelector((state: any) => state.FolderCollectionReducer);
    const session_section_state = useSelector((state: any) => state.CurrentSessionSettingsReducer);

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
                            text="Save this session to workspace" 
                            onClick={() => setAddToWorkspaceMessage(true)} 
                        />
                    </div>
                </div>
            </>
        )
    }

    const renderContents = (): JSX.Element => {
        const existingWindows = session_section_state?.windows;
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
            return <></>;
        }
    }

    const handleAddToNewWorkspace = (): void => {
        setAddToWorkspaceMessage(false);
        setCreateFolder(true);
    }

    const handleAddToExistingWorkspace = (e: any): void => {
        if(e.selected === -1) return;

        const targetFolderId = e.selected;
        const targetFolder: iFolderItem | undefined = folder_collection_state.find((folder: iFolderItem) => folder.id === targetFolderId);
     
        if(!targetFolder) return;
        
        if(session_section_state.windows){
            const newWindowItems: Array<iWindowItem> = session_section_state.windows.map((window: chrome.windows.Window) => {
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
                setAddToWorkspaceMessage(false);
                setMergeProcess(updatedFolder);
            }
        }
        
    }

    const renderAddTabsMessage = (): JSX.Element => {
        const currentFolders: Array<iFolderItem> = folder_collection_state;

        const options: Array<iFieldOption> = currentFolders.map((folder) => {
            return { id: folder.id, label: folder.name }
        });

        const dropdownOptions: Array<iFieldOption> = [
            {
                id: -1,
                label: "Select a workspace"
            },
            ...options
        ];

        return (
            <AddToWorkspacePopup
                title="Add to workspace"
                type="slide-in"
                dropdownOptions={dropdownOptions}
                onNewWorkspace={handleAddToNewWorkspace}
                onExistingWorkspace={handleAddToExistingWorkspace}
                onCancel={() => setAddToWorkspaceMessage(false)}
            />
        );
    }
    
    const renderFolderManager = (): JSX.Element => {
        let render = <></>;

        if(createFolder === true){
            const presetWindows: Array<iWindowItem> = session_section_state.windows.map((window: chrome.windows.Window) => {
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
            render = <FolderManager type="slide-in" title="Create workspace" folder={folderSpecs} onClose={handleCloseFolderManager} />;
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
                {renderContents()}
            </SectionContainer>
        </>  
    );

}

export default CurrentSessionSection