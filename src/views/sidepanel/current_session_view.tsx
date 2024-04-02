import { useState, useEffect, useMemo } from "react";
import { iWindowItem } from '../../interfaces/window_item';
import { useSelector, useDispatch } from "react-redux";
import { iFolderItem } from '../../interfaces/folder_item';
import FolderManager from "../../components/features/folder_manager/folder_manager";
import { clearInEditFolder } from "../../redux/actions/in_edit_folder_actions";
import { clearMarkedTabsAction } from '../../redux/actions/history_settings_actions';
import { setUpWindowsAction } from '../../redux/actions/current_session_actions';
import { clearMarkedFoldersAction } from '../../redux/actions/folder_settings_actions';
import randomNumber from '../../tools/random_number';
import AddToFolderPopup from "../../components/features/add_to_folder_popup";
import { iTabItem } from '../../interfaces/tab_item';
import { iFieldOption } from '../../interfaces/dropdown';
import SaveIcon from '../../components/icons/save_icon';
import CircleButton from './../../components/utils/circle_button';
import WindowItem from "../../components/features/window_item";
import iCurrentSessionState from "../../interfaces/states/current_session_state";
const CurrentSessionView = (props:any): JSX.Element => {
    const [addToWorkSpaceMessage, setAddToFolderMessage] = useState<boolean>(false);
    const [createFolder, setCreateFolder] = useState<boolean>(false);
    const [mergeProcess, setMergeProcess] = useState<iFolderItem | null>(null);
    const [editFolderId, setEditFolderId] = useState<number | null>(null);

    const folderCollectionState: Array<iFolderItem> = useSelector((state: any) => state.folderCollectionReducer);

    const dispatch = useDispatch();
    const sessionSectionState: any = useSelector((state: any) => state.sessionSectionReducer);

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

    const handlePopupClose = (): void => {
        setEditFolderId(null);
        setCreateFolder(false);
        setMergeProcess(null);

        dispatch(clearMarkedTabsAction());
        dispatch(clearMarkedFoldersAction());
        dispatch(clearInEditFolder());
    }

    const renderEmptyMessage = (): JSX.Element => {
        return (
            <div className={"flex justify-center items-center"}>
                <p> Your browing history is empty.</p>
            </div>
        );
    }

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
                type="popup"
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
            render = <FolderManager type="popup" title="Create folder" folder={folderSpecs} onClose={handlePopupClose} />;
        } else if(mergeProcess !== null) {

            render = <FolderManager type="popup" title={`Merge tabs to ${mergeProcess.name}`} folder={mergeProcess} onClose={handlePopupClose} />;
        }

        return render;
    }

    const windowList = useMemo((): JSX.Element => {
        const existingWindows = sessionSectionState?.windows;
        const existingWindowsElements: Array<JSX.Element> = existingWindows?.map((item: iWindowItem, i: number) => {
            return (
                <WindowItem
                    key={`window-item-${i}`} 
                    tabsCol={1}
                    disableEdit={sessionSectionState.windows.length < 2 ? true : false} 
                    disableTabMark={true} 
                    disableTabEdit={true} 
                    id={item.id} 
                    tabs={item.tabs} 
                    initExpand={true} 
                />
            );
        })
        
        if (existingWindowsElements?.length > 0){
            return <>{existingWindowsElements}</>;
        } else {
            return <>{renderEmptyMessage()}</>;
        }
    }, [sessionSectionState.windows])

    return (
        <>
            {addToWorkSpaceMessage && renderAddTabsMessage()}
            {renderFolderManager()}
            <div className="flex justify-end mx-2 mt-4 mb-6">
                <CircleButton 
                    disabled={false} 
                    bgCSSClass="bg-tbfColor-lightpurple" 
                    onClick={() => setAddToFolderMessage(true)}
                >
                    <SaveIcon size={20} fill={"#fff"} />
                </CircleButton>
            </div>
            <div>
                {windowList}
            </div>
        </>
    )
}

export default CurrentSessionView;