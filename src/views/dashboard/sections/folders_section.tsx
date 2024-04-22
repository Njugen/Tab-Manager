import FolderItem from '../../../components/features/folder_item/folder_item'
import "../../../styles/global_utils.module.scss";
import PrimaryButton from '../../../components/utils/primary_button/primary_button';
import FolderManager from '../../../components/features/folder_manager/folder_manager';
import { useEffect, useMemo, useState } from "react";
import { iFolderItem } from '../../../interfaces/folder_item';
import { iFieldOption } from '../../../interfaces/dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { saveToStorage, getFromStorage } from '../../../services/webex_api/storage';
import PopupMessage from '../../../components/utils/popup_message';
import TextIconButton from '../../../components/utils/text_icon_button';
import randomNumber from '../../../tools/random_number';
import { iWindowItem } from '../../../interfaces/window_item';
import Dropdown from '../../../components/utils/dropdown/dropdown';
import SectionContainer from '../../../components/utils/section_container';
import DeselectedCheckboxIcon from '../../../components/icons/deselected_checkbox_icon';
import SelectedCheckboxIcon from '../../../components/icons/selected_checkbox_icon';
import FolderDuplicateIcon from '../../../components/icons/folder_duplicate_icon';
import MergeIcon from '../../../components/icons/merge_icon';
import TrashIcon from '../../../components/icons/trash_icon';
import GridIcon from '../../../components/icons/grid_icon';
import ListIcon from '../../../components/icons/list_icon';
import iFolderState from '../../../interfaces/states/folder_state';
import { createNewFolder, deleteFolder, readAllStorageFolders } from '../../../redux-toolkit/slices/folder_slice';
import { changeSortOption, changeViewMode, markFolder, markMultipleFolders, unMarkAllFolders } from '../../../redux-toolkit/slices/folders_section_slice';
import purify from '../../../tools/purify_object';


/*
    Folder management section listing all available folders/folders.
*/

const colsCount = (): number => {
    if(window.innerWidth > 1920){
        return 4;
    } else if(window.innerWidth > 1280) {
        return 3;
    }
    return 2;
};

const FoldersSection = (props: any): JSX.Element => {
    const [editFolderId, setEditFolderId] = useState<number | null>(null);
    const [createFolder, setCreateFolder] = useState<boolean>(false);
    const [removalTarget, setRemovalTarget] = useState<iFolderItem | null>(null);
    const [showDeleteWarning, setShowDeleteWarning] = useState<boolean>(false);
    const [showDuplicationWarning, setShowDuplicationWarning] = useState<boolean>(false);
    const [mergeProcess, setMergeProcess] = useState<iFolderItem | null>(null);
    const [showPerformanceWarning, setShowPerformanceWarning] = useState<boolean>(false);
    const [totalTabsCount, setTotalTabsCount] = useState<number>(0);
    const [windowsPayload, setWindowsPayload] = useState<Array<iWindowItem> | null>(null);
    const [folderLaunchType, setFolderLaunchType] = useState<string | null>(null); 
    const [loaded, setLoaded] = useState<boolean>(false);


    const dispatch = useDispatch();

    const folderState: Array<iFolderItem> = useSelector((state: any) => state.folder);
    const foldersSectionState: iFolderState = useSelector((state: any) => state.foldersSection);

    // Get from browser storage and store into redux 
    useEffect(() => {
        getFromStorage("local", "folders", (data) => {  
            dispatch(readAllStorageFolders(data.folders));
            setLoaded(true);
        })

        getFromStorage("local", "folder_sort", (data) => {  
            dispatch(changeSortOption(data.folder_sort));
        })

        getFromStorage("local", "folder_viewmode", (data) => {  
            dispatch(changeViewMode(data.folder_viewmode));
        })
    }, []);


    const evaluatePerformanceWarning = (type: string, windows: Array<iWindowItem>) => {
        if(!windows) return;
        let tabsCount = 0;
        windows.forEach((window: iWindowItem) => {
            tabsCount += window.tabs.length;
        });
   
        chrome.storage.local.get("performanceWarningValue", (data) => {
            setTotalTabsCount(data.performanceWarningValue);
            if(data.performanceWarningValue !== -1 && data.performanceWarningValue <= tabsCount) {
                setShowPerformanceWarning(true);
            } else {
                handleLaunchFolder(windows, type);
            }
        });
    }

    // Delete one or more marked folders
    const handleDeleteFolders = (): void => {
        const { markedFoldersId } = foldersSectionState;
        if(folderState && markedFoldersId){
            markedFoldersId.forEach((targetId: number) => {
                const markedFolderIndex = folderState.findIndex((folder: iFolderItem) => targetId === folder.id);

                if(markedFolderIndex > -1){
                    dispatch(deleteFolder(folderState[markedFolderIndex].id));
                    
                }
            });
            setShowDeleteWarning(false);
            dispatch(unMarkAllFolders());
        }
    }

    // Duplicate one of more marked folders
    const handleDuplicateFolders = (): void => {
        const { markedFoldersId } = foldersSectionState;

        if(folderState && markedFoldersId){
            markedFoldersId.forEach((targetId: number) => {
                const markedFolderIndex = folderState.findIndex((folder: iFolderItem) => targetId === folder.id);
                if(markedFolderIndex > -1){
                    const newFolder: iFolderItem = purify({...folderState[markedFolderIndex]});
                    newFolder.id = randomNumber();
         
                    newFolder.windows.forEach((window) => {
                        window.id = randomNumber();
                        window.tabs.forEach((tab) => tab.id = randomNumber());
                    });
            
                    newFolder.name = newFolder.name + " (duplicate)";
                    dispatch(createNewFolder({...newFolder}));
                }
            });
            setShowDuplicationWarning(false);
            dispatch(unMarkAllFolders());
        }
    } 

    // Open a specific folder
    const renderFolderManagerPopup = (): JSX.Element => {
        let render;
     
        if(createFolder === true){
            render = <FolderManager type="slide-in" title="Create folder" onClose={handleCloseFolderManager} />;
        } else if(mergeProcess !== null){
            return <FolderManager type="slide-in" title={`Create folder by merge`} folder={mergeProcess} onClose={handleCloseFolderManager} />
        } else {
            const targetFolder: Array<iFolderItem> = folderState.filter((item: iFolderItem) => editFolderId === item.id);
            const input: iFolderItem = {...targetFolder[0]};

            if(targetFolder.length > 0){
                render = <FolderManager type="slide-in" title={`Edit folder ${targetFolder[0].name}`} folder={input} onClose={handleCloseFolderManager} />;
            } else {
                render = <></>;
            }
        }

        return render;
    }

    // Mark a specific folder
    const handleMarkFolder = (id: number): void => {

        dispatch(markFolder(id));
    }

    // Merge selected folders
    const handleMergeFolders = (): void => {
        const newId = randomNumber();
        const { markedFoldersId } = foldersSectionState;

        const folderSpecs: iFolderItem = {
            id: newId,
            name: "",
            desc: "",
            type: "expanded",
            viewMode: "grid",
            marked: false,
            windows: [],
        }

        let purified = purify(folderState);
        if(purified && markedFoldersId){
            const mergedWindows: Array<iWindowItem> = [];

            markedFoldersId.forEach((targetId: number) => {
                const markedFolderIndex = purified.findIndex((folder: iFolderItem) => targetId === folder.id);

                if(markedFolderIndex > -1){
                    const queueWindows: Array<iWindowItem> = purified[markedFolderIndex].windows.map((window: iWindowItem) => { 
                        window.id = randomNumber();
                        return window;
                    })

                    mergedWindows.push(...queueWindows);
                }
            });

            // The new windows needs a new id

            folderSpecs.windows = [...mergedWindows];
            setMergeProcess({...folderSpecs});
        }
    }

    // Close the folder manager
    const handleCloseFolderManager = (): void => {
        setEditFolderId(null);
        setCreateFolder(false);
        setMergeProcess(null);

        dispatch(unMarkAllFolders());
      //  dispatch(clearInEditFolder());
    }

    // Unmark all listed folders
    const handleUnmarkAllFolders = (): void => {
        dispatch(unMarkAllFolders());
    }

    // Mark all listed folders
    const handleMarkAllFolders = (): void => {
        const updatedMarks: Array<number> = [];

        folderState.forEach((folder: iFolderItem) => {
            updatedMarks.push(folder.id);
            
        });

        dispatch(markMultipleFolders([...updatedMarks]));        
    }

    // Toggle between grid and list view
    const handleChangeViewMode = (): void => {
        const { viewMode } = foldersSectionState;
        
        const newStatus = viewMode === "list" ? "grid" : "list"
        saveToStorage("local", "folder_viewmode", newStatus)
        dispatch(changeViewMode(newStatus));
    }

    // Sort all folders
    const handleSortFolders = (e: any): void => {
        const newStatus = e.selected;

        saveToStorage("local", "folder_sort", newStatus);
        dispatch(changeSortOption(newStatus));
    }

    const folderSortCondition = (a: iFolderItem, b: iFolderItem): boolean => {
        const { folderSortOptionValue } = foldersSectionState
        
        const aNameLowerCase = a.name.toLowerCase();
        const bNameToLowerCase = b.name.toLowerCase();

        return folderSortOptionValue === 0 ? (aNameLowerCase > bNameToLowerCase) : (bNameToLowerCase > aNameLowerCase);
    }

    const handleFolderDelete = (target: iFolderItem): void => {
        chrome.storage.local.get("folderRemovalWarning", (data) => {
            if(data.folderRemovalWarning === true) {
                setRemovalTarget(target);
            } else {
                dispatch(deleteFolder(target.id)); 
                setRemovalTarget(null);
            }
        });
    }

    // Prepare to launch a folder by setting windows to be launched, and how to launch the windows/tabs in it.
    const handlePrepareLaunchFolder = (windows: Array<iWindowItem>, type: string): void => {
        setWindowsPayload(windows);
        evaluatePerformanceWarning(type, windows);
    }


    // Render the folder list
    const folderList = useMemo(() => {        
        const sortedFolders = [...folderState].sort((a: any, b: any) => folderSortCondition(a, b) ? 1 : -1);

        // Determine the number of columns to be rendered, based on colsCount
        let colsList: Array<Array<JSX.Element>> = [];
        
        for(let i = 0; i < colsCount(); i++){
            colsList.push([]);
        }

        for(let i = 0; i < sortedFolders.length; i++){
            const folder = sortedFolders[i];
            let result: JSX.Element = <></>;
            
            const collection: Array<number> = foldersSectionState.markedFoldersId;

            result = (
                <FolderItem 
                    onDelete={(e) => handleFolderDelete(folder)} 
                    index={sortedFolders.length-i} 
                    marked={collection.find((id) => folder.id === id) ? true : false} 
                    onMark={handleMarkFolder} 
                    onEdit={() => setEditFolderId(folder.id)} 
                    key={`folder-item-${folder.id}`} 
                    type={folder.type} 
                    id={folder.id} 
                    viewMode={foldersSectionState.viewMode} 
                    name={folder.name} 
                    desc={folder.desc} 
                    windows={folder.windows} 
                    onOpen={handlePrepareLaunchFolder}
                />
            )
     
            colsList[i % colsCount()].push(result);
           
        }

        const columnsRender: Array<JSX.Element> = colsList.map((col, i: number) => <div key={`column-key-${i}`}>{col}</div>);

        return columnsRender;
    }, [folderState, folderSortCondition, foldersSectionState.markedFoldersId])

    const renderSortOptionsDropdown = (): JSX.Element => {
        const optionsList: Array<iFieldOption> = [
            {value: 0, label: "Ascending"},
            {value: 1, label: "Descending"},
        ];

        const presetOption = optionsList.filter((option: iFieldOption) => option.value === foldersSectionState.folderSortOptionValue);

        return <Dropdown tag="sort-folders" preset={presetOption[0] || optionsList[0]} options={optionsList} onCallback={handleSortFolders} />
    }

    // Render the action buttons for folder area
    const renderOptionsMenu = (): JSX.Element => {
        const { markedFoldersId } = foldersSectionState;
        let markSpecs: any;

        if(markedFoldersId.length > 0){
            markSpecs = {
                label: "Mark all",
                icon: "selected_checkbox",
                handle: handleUnmarkAllFolders
            }
        } else {
            markSpecs = {
                label: "Mark all",
                icon: "deselected_checkbox",
                handle: handleMarkAllFolders
            }
        }

        if(folderState.length > 0){
            return (
                <>
                    <div className="inline-flex items-center justify-end w-full">
                        <div className="flex">
                            <TextIconButton 
                                disabled={false} 
                                id={markSpecs.id} 
                                textSize="text-sm"
                                text={markSpecs.label} 
                                onClick={markSpecs.handle} 
                            >
                                {
                                    markedFoldersId.length > 0 ? 
                                    <SelectedCheckboxIcon size={20} fill={"#6D00C2"} /> : 
                                    <DeselectedCheckboxIcon size={20} fill={"#6D00C2"} />
                                }
                            </TextIconButton>

                            <TextIconButton 
                                disabled={markedFoldersId.length > 0 ? false : true} 
                                id={"folder_duplicate"} 
                                textSize="text-sm"
                                text="Duplicate" 
                                onClick={handlePrepareDuplication} 
                            >
                                <FolderDuplicateIcon size={20} fill={markedFoldersId.length > 0 ? "#6D00C2" : "#9f9f9f"}  />
                            </TextIconButton>
                            
                            <TextIconButton 
                                disabled={markedFoldersId.length >= 2 ? false : true} 
                                id={"merge"} 
                                textSize="text-sm"
                                text="Merge" onClick={handleMergeFolders} 
                            >
                                <MergeIcon size={20} fill={markedFoldersId.length >= 2 ? "#6D00C2" : "#9f9f9f"}  />
                            </TextIconButton>

                            <TextIconButton 
                                disabled={markedFoldersId.length > 0 ? false : true} 
                                id={"trash"} 
                                textSize="text-sm"
                                text="Delete" 
                                onClick={handlePrepareMultipleRemovals} 
                            >
                                <TrashIcon size={20} fill={markedFoldersId.length > 0 ? "#6D00C2" : "#9f9f9f"}  />
                            </TextIconButton>
                        </div>
                        <div className="flex items-center justify-end">     
                            <TextIconButton 
                                disabled={false} 
                                id={foldersSectionState.viewMode === "list" ? "grid" : "list"} 
                                textSize="text-sm"
                                text={foldersSectionState.viewMode === "list" ? "Grid" : "List"} 
                                onClick={handleChangeViewMode} 
                            >
                                { 
                                    foldersSectionState.viewMode === "list" ? 
                                    <GridIcon size={20} fill={"#6D00C2"} /> : 
                                    <ListIcon size={20} fill={"#6D00C2"} />
                                }
                            </TextIconButton>
                            <div className="relative w-[175px] mr-4 flex items-center">
                                {renderSortOptionsDropdown()}
                            </div>
                            <PrimaryButton disabled={false} text="Create folder" onClick={() => setCreateFolder(true)} />
                        </div>
                    </div>
                </>
            )
        }

        return <></>
    }

    // Prepare to remove multiple folders. Warn the user if set in Settings page
    const handlePrepareMultipleRemovals = (): void => {
        const { markedFoldersId } = foldersSectionState;
        
        if(markedFoldersId.length > 0) {
            chrome.storage.local.get("folderRemovalWarning", (data) => {
                if(data.folderRemovalWarning === true) {
                    setShowDeleteWarning(true);
                } else {
                    handleDeleteFolders();
                }
            });
        }
    }

    // Prepare to duplicate multiple folders. Warn the user if set in Settings page
    const handlePrepareDuplication = (): void => {
        const { markedFoldersId } = foldersSectionState;
        
        // Run if there are more than 0 marked folders
        if(markedFoldersId.length > 0) {
            chrome.storage.local.get("duplicationWarningValue", (data) => {
                // If the duplication warning is set in settings, and the number of marked tabs exceeds the threshold, then warn the user
                if(data.duplicationWarningValue !== -1 && data.duplicationWarningValue <= foldersSectionState.markedFoldersId.length) {
                    setShowDuplicationWarning(true);
                } else {
                    handleDuplicateFolders();
                }
            });
            
        }
    }

    // Launch folder
    const handleLaunchFolder = (windows: Array<iWindowItem>, launchType?: string): void => {
        // Now, prepare a snapshot, where currently opened windows get stored
        let snapshot: Array<chrome.windows.Window> = [];

        const queryOptions: chrome.windows.QueryOptions = {
            populate: true,
            windowTypes: ["normal", "popup"]
        };

        // Store currently opened windows into the snapshot
        chrome.windows.getAll(queryOptions, (currentWindows: Array<chrome.windows.Window>) => {
            snapshot = currentWindows;
        });

        // Open all windows in this folder
        windows.forEach((window: iWindowItem, i) => {
            const windowSettings = {
                focused: i === 0 ? true : false,
                url: window.tabs.map((tab) => tab.url),
                incognito: launchType === "incognito" ? true : false
            }
            chrome.windows.create(windowSettings);
        });

        // Close current session after launching the folder. Only applies when
        // set in the Pettings page
        chrome.storage.local.get("closeSessionAtFolderLaunch", (data) => {
            if(data.closeSessionAtFolderLaunch === true){
                snapshot.forEach((window) => {
                    if(window.id) chrome.windows.remove(window.id);
                });
            }
        });

        // Unset all relevant states to prevent interferance with other features once the folder has been launched
        setWindowsPayload(null);
        //evaluatePerformanceWarning(null);
        setShowPerformanceWarning(false);
    }
    

    return (
        <>{folderState && foldersSectionState && (
            <>
            {showPerformanceWarning &&
                <PopupMessage
                    title="Warning" 
                    text={`You are about to open ${totalTabsCount} or more tabs at once. Opening this many may slow down your browser. Do you want to proceed?`}
                    primaryButton={{ 
                        text: "Yes, open selected folders", 
                        callback: () => { 
                            if(windowsPayload) handleLaunchFolder(windowsPayload); 
                            setShowPerformanceWarning(false)
                        }
                    }}
                    secondaryButton={{ 
                        text: "No, do not open", 
                        callback: () => { 
                            setShowPerformanceWarning(false); 
                            setWindowsPayload(null)}}}    
                />
            }

            {showDuplicationWarning &&
                <PopupMessage
                    title="Warning" 
                    text={`You are about to duplicate ${foldersSectionState.markedFoldersId.length} or more folders at once. Unnecessary duplications may clutter your dashboard, do you want to proceed?`}
                    primaryButton={{ 
                        text: "Yes, proceed", 
                        callback: () => { 
                            handleDuplicateFolders(); 
                            setShowDuplicationWarning(false)
                        }}
                    }
                    secondaryButton={{ 
                        text: "No, do not duplicate", 
                        callback: () => setShowDuplicationWarning(false)
                    }}    
                />
            }
            {removalTarget &&
                <PopupMessage
                    title="Warning" 
                    text={`You are about to remove the "${removalTarget.name}" folder and all its contents. This is irreversible, do you want to proceed?`}
                    primaryButton={{ 
                        text: "Yes, remove this folder", 
                        callback: () => { 
                            dispatch(deleteFolder(removalTarget.id)); 
                            setRemovalTarget(null)
                        }}}
                    secondaryButton={{ 
                        text: "No, don't remove", 
                        callback: () => setRemovalTarget(null)
                    }}    
                />
            }
            {showDeleteWarning === true && 
                <PopupMessage
                    title="Warning" 
                    text={`You are about to remove one or more folders and all their contents. This is irreversible, do you want to proceed?`}
                    primaryButton={{ text: "Yes, remove these folders", callback: () => handleDeleteFolders()}}
                    secondaryButton={{ text: "No, don't remove", callback: () => setShowDeleteWarning(false)}}    
                />
            }
            {renderFolderManagerPopup()}
        
            <SectionContainer id="folder-section" title="Folders" options={renderOptionsMenu}>
                <>
                    {folderState.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-[50%]">
                            <p className={`text-base"leading-7" text-tbfColor-darkergrey text-start`}>
                                You currently have no folders available. Please, create a new folder
                            </p>
                            <div className="mt-8">
                                <PrimaryButton disabled={false} text="Create folder" onClick={() => setCreateFolder(true)} />
                            </div>
                        </div>
                    )}
                    {<ul className={`list-none ${foldersSectionState.viewMode === "list" ? "mx-auto mt-12" : `grid xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 grid-flow-dense gap-x-4 gap-y-0 mt-8`}`}>
                        {folderList}
                    </ul>}
                </>
            </SectionContainer>
        </>)}
        </>  
    );

}

export default FoldersSection