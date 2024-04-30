import { useState, useRef } from "react";
import { iWindowItem } from '../../interfaces/window_item';
import { useSelector, useDispatch } from "react-redux";
import { iFolderItem } from '../../interfaces/folder_item';
import FolderManager from "../../components/features/folder_manager/folder_manager";
import randomNumber from '../../tools/random_number';
import AddToFolderPopup from "../../components/features/add_to_folder_popup";
import { iTabItem } from '../../interfaces/tab_item';
import { iFieldOption } from '../../interfaces/dropdown';
import CircleButton from './../../components/utils/circle_button';
import SaveIcon from '../../components/icons/save_icon';
import TrashIcon from '../../components/icons/trash_icon';
import OpenBrowserIcon from "../../components/icons/open_browser_icon";
import HistoryTabGroupsSection from "../common/history_tab_group_section/history_tab_group_section";
import { setUpTabs, unMarkAllTabs } from "../../redux-toolkit/slices/history_section_slice";
import { unMarkAllFolders } from "../../redux-toolkit/slices/folders_section_slice";

const HistoryView = (props:any): JSX.Element => {
    const [mergeProcess, setMergeProcess] = useState<iFolderItem | null>(null);
    const [addToWorkSpaceMessage, setAddToFolderMessage] = useState<boolean>(false);
    const [editFolderId, setEditFolderId] = useState<number | null>(null);
    const [createFolder, setCreateFolder] = useState<boolean>(false);

    const dispatch = useDispatch();
    const historySectionState: any = useSelector((state: any) => state.historySection);
    const folderState: Array<iFolderItem> = useSelector((state: any) => state.folder);

    const handleDeleteFromHistory = (): void => {
        let updatedMarks = historySectionState.tabs;

        historySectionState.markedTabs.forEach((tab: chrome.history.HistoryItem) => {
            chrome.history.deleteUrl({ url: tab.url! });
            updatedMarks = updatedMarks.filter((target: chrome.history.HistoryItem) => target.url !== tab.url);
        });

        dispatch(setUpTabs(updatedMarks));
        dispatch(unMarkAllTabs());
    }

    const handleOpenSelected = (): void => {
        const markedTabs: Array<chrome.history.HistoryItem> = historySectionState.markedTabs as Array<chrome.history.HistoryItem>;
        
        markedTabs.forEach((tab: chrome.history.HistoryItem) => {
            const properties: object = {
                active: false,
                url: tab.url
            };
            chrome.tabs.create(properties);
        })
    }


    const handleAddToNewFolder = (): void => {
        setAddToFolderMessage(false);
        setCreateFolder(true);
    }

    const handleAddToExistingFolder = (e: any): void => {
        if(e.selected === -1) return;

        const targetFolderId = e.selected;
        const targetFolder: iFolderItem | undefined = folderState.find((folder: iFolderItem) => folder.id === targetFolderId);
     
        if(!targetFolder) return;
        
        const markedTabs: Array<iTabItem> = historySectionState.markedTabs.map((tab: chrome.history.HistoryItem) => {
            return {
                id: tab.id,
                label: tab.title,
                url: tab.url,
                disableEdit: false,
                disableMark: false,
            }
        });

        const presetWindow: iWindowItem = {
            id: randomNumber(),
            tabs: markedTabs
        };

        const updatedFolder: iFolderItem = {...targetFolder};
        updatedFolder.windows = [...updatedFolder.windows, presetWindow];

        if(targetFolder){
            setAddToFolderMessage(false);
            setMergeProcess(updatedFolder);
        }
    }
    const renderAddTabsMessage = (): JSX.Element => {
        const currentFolders: Array<iFolderItem> = folderState;

        const options: Array<iFieldOption> = currentFolders.map((folder) => {
            return { value: folder.id, label: folder.name }
        });

        const dropdownOptions: Array<iFieldOption> = [
            {
                value: -1,
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

    const handlePopupClose = (): void => {

        setEditFolderId(null);
        setCreateFolder(false);
        setMergeProcess(null);

        dispatch(unMarkAllTabs());
        dispatch(unMarkAllFolders());
    }


    const renderFolderManager = (): JSX.Element => {
        let render;
        if(createFolder === true){
            const markedTabs: Array<iTabItem> = historySectionState.markedTabs.map((tab: chrome.history.HistoryItem) => {
                return {
                    id: tab.id,
                    label: tab.title,
                    url: tab.url,
                    disableEdit: false,
                    disableMark: false,
                }
            });

            const presetWindow: iWindowItem = {
                id: randomNumber(),
                tabs: markedTabs
            };
            
            const folderSpecs: iFolderItem = {
                id: randomNumber(),
                name: "",
                desc: "",
                type: "expanded",
                viewMode: "grid",
                marked: false,
                windows: [presetWindow],
            }
            render = <FolderManager type="slide-in" title="Create folder" folder={folderSpecs} onClose={handlePopupClose} />;
        } else if(mergeProcess !== null) {

            render = <FolderManager type="slide-in" title={`Merge tabs to ${mergeProcess.name}`} folder={mergeProcess} onClose={handlePopupClose} />;
        } else {
            render = <></>;
        }

        return render;
    }


    return (
        <>
            {addToWorkSpaceMessage && renderAddTabsMessage()}
            {renderFolderManager()}
            <div className="flex justify-end mt-4">
                <CircleButton 
                    disabled={historySectionState.markedTabs.length > 0 ? false : true} 
                    bgCSSClass="bg-tbfColor-lightpurple" 
                    onClick={() => handleOpenSelected()}
                >
                    <OpenBrowserIcon size={20} fill={"#fff"} />
                </CircleButton>

                <CircleButton 
                    disabled={historySectionState.markedTabs.length > 0 ? false : true} 
                    bgCSSClass="bg-tbfColor-lightpurple" 
                    onClick={() => setAddToFolderMessage(true)}
                >
                    <SaveIcon size={20} fill={"#fff"} />
                </CircleButton>

                <CircleButton 
                    disabled={historySectionState.markedTabs.length > 0 ? false : true} 
                    bgCSSClass="bg-tbfColor-lightpurple" 
                    onClick={() => handleDeleteFromHistory()}
                >
                    <TrashIcon size={20} fill={"#fff"} />
                </CircleButton>
            </div>            
            <HistoryTabGroupsSection viewMode="list" tabs={historySectionState.tabs} />
        </>
    )
}

export default HistoryView;