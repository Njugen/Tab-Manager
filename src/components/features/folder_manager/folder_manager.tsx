import { useState, useEffect, useRef } from "react";
import FormField from "../../utils/form_field";
import * as predef from "../../../styles/predef";
import { iPopup } from "../../../interfaces/popup";

import randomNumber from "../../../tools/random_number";
import { initInEditFolder, updateInEditFolder} from "../../../redux/actions/in_edit_folder_actions";
import { iFolderItem } from "../../../interfaces/folder_item";
import PopupMessage from '../../utils/popup_message';
import { useDispatch, useSelector } from "../../../redux/mocked_hooks";
import { setShowFolderChangeWarning } from "../../../redux/actions/warning_actions";
import { createFolderAction, updateFolderAction } from "../../../redux/actions/folder_collection_actions";
import { setCurrentlyEditingTab } from "../../../redux/actions/misc_actions";
import windowListChanged from "./window_list_changed";
import WindowManager from "../window_manager/window_manager";
import GenericPopup from "../../utils/generic_popup";

/*
    A popup providing oversight of a folder's settings and available windows/tabs.
    The settings may be changed by the user, which then gets applied to redux storage

    Warning messages may be added using the <PopupMessage/> component. New fields can be added
    preferably by using the <FormField /> component. See examples in render() function.
*/

const FolderManager = (props: iPopup): JSX.Element => {
    const { onClose, type, folder, title } = props;
    const [show, setShow] = useState<boolean>(false);
    const [isCreate, setIsCreate] = useState<boolean>(false);
    const [modified, setModified] = useState<boolean>(false);
    const [originWindows, setOriginWindows] = useState<string>("");
    const [inValidFields, setInValidFields] = useState<{ name: boolean, windows: boolean }>({
        name: false,
        windows: false
    });

    const dispatch = useDispatch();

    // Read necessary data from redux. These data are are used in this component
    // for various tasks. Values may be dispatched back to these redux states for use in other multilevel components
    const state = useSelector((state: any) => state)

    useEffect(() => {
        // Hide the sidebar of the body. A sidebar of this component is used instead.
        document.body.style.overflowY = "hidden";

        // Information about the folder. If undefined, there are no preset information
        let folderSpecs: iFolderItem | undefined = folder;
        
        // Apply slide down effect once this popup is launched
        setShow(true);
     
        // folderSpecs is undefined, this means this popup is used for creating a new folder.
        // Otherwise, a folder is being edited.
        if(!folderSpecs){
            const randId = randomNumber();
            folderSpecs = {
                id: randId,
                name: "",
                desc: "",
                type: "expanded",
                viewMode: "grid",
                marked: false,
                windows: [],
            }
            setIsCreate(true);
        }

        // Track the preset windows of this payload. Used to track new/removed windows
        setOriginWindows(JSON.stringify(folderSpecs.windows));

        // Tell redux this popup is active and a create/edit process is ongoing.
        dispatch(initInEditFolder(folderSpecs));
    }, []);

    useEffect(() => {
        const inEditWindows: string = state.folderManagerReducer?.windows;
        const listChanged: boolean = windowListChanged(originWindows, inEditWindows);

        if(listChanged === true){
            setModified(true);
        }
    }, [state.folderManagerReducer]);
    
    // Handle changes to a field
    // - key: a string to identify the changed field
    // - value: the new value of this field
    const handleChangeField = (key: string, value: string): void => {
        if(!state.folderManagerReducer) return;
        
        if(modified === false && JSON.stringify(state.folderManagerReducer[key]) !== JSON.stringify(value)) setModified(true);

        // Inform redux about the field change
        dispatch(updateInEditFolder(key, value));
    }



    // Read the updated form changes from redux, and determine
    // whether or not they are valid. If not, mark the affected fields
    // as invalid. Otherwise, send a callback to proceed.
    const validateForm = (callback: () => void): void => {
        const data = state.folderManagerReducer;

        const updatedFieldState = {
            name: false,
            windows: false
        }

        if(data.name.length === 0){
            updatedFieldState.name = true;
        } 

        if((data.windows && data.windows.length === 0) || state.miscReducer.isEditingTabs > 0) {
            updatedFieldState.windows = true;
        } 
        
        if(updatedFieldState.name === false && updatedFieldState.windows === false){
            callback();
        } else {
            setInValidFields({...updatedFieldState});
          
        }
    }

    // Perform tasks and close this form popup
    const handleClose = (skipWarning?: boolean): void => {
        chrome.storage.local.get("cancellation_warning_setting", (data) => {
            if((modified === true && skipWarning !== true) && data.cancellation_warning_setting === true){
                // Show a warning when a form has been modified AND when settings explicitly permits it.
                dispatch(setShowFolderChangeWarning(true));
            } else {
                // Perform tasks and close the popup form.
                setShow(false);
                dispatch(setShowFolderChangeWarning(false));
                setModified(false)
                setOriginWindows("");
                setIsCreate(false);
                document.body.style.overflowY = "scroll";

                setTimeout(() => {
                    dispatch(setCurrentlyEditingTab(false));
                    onClose()
                }, 500);
            }
        })
    }

    // Validate and save the data to redux, then close the popup form.
    const handleSave = (): void => {
        validateForm(() => {
            if(props.folder){
                // Find out if process is merge or edit
                const targetIndex = state.folderCollectionReducer.findIndex((target: any) => target.id === props.folder?.id);

                if(targetIndex === -1){
                    dispatch(createFolderAction(state.folderManagerReducer));
                } else {
                    dispatch(updateFolderAction(state.folderManagerReducer));
                }
                
            } else {
                dispatch(createFolderAction(state.folderManagerReducer));
            }   
      
            handleClose(true);
        });
       
    }

    // Close error/warning messages, but remain in the popup
    const handleKeepEditing = (): void => {
        document.body.style.overflowY = "hidden";
        dispatch(setShowFolderChangeWarning(false))
    }

    const cancelButtonSpecs: any = {
        label: "Cancel",
        handler: handleClose
    }

    const saveButtonSpecs: any = {
        label: isCreate === true ? "Create" : "Save",
        handler: handleSave
    }

    return (
        <>
            {state.WarningActionsReducer?.showFolderChangeWarning === true && 
                <PopupMessage
                    title="Warning" 
                    text="You have made changes to this form. Closing it will result in all changes being lost. Do you want to proceed?"
                    primaryButton={{ 
                        text: "Yes, close this form", 
                        callback: () => handleClose(true) 
                    }}
                    secondaryButton={{ 
                        text: "No, keep editing", 
                        callback: () => handleKeepEditing()
                    }}    
                />
            }
        
            <GenericPopup title={title} type={type} show={show} cancel={cancelButtonSpecs} save={saveButtonSpecs}>
                <FormField label="Name *" error={inValidFields.name} description="Give a name to this folder. A sensible name may help your workflow when relevant tabs are needed.">
                    <input 
                        data-testid="name-field" 
                        id="name-field" 
                        type="text" 
                        defaultValue={state.folderManagerReducer?.name} 
                        className={predef.textfield_full} 
                        onBlur={(e: any) => handleChangeField("name", e.target.value)} 
                    />
                </FormField>
                <FormField label="Description" description="Describe the purpose of this folder.">
                    <textarea 
                        data-testid="desc-field" 
                        id="desc-field" 
                        defaultValue={state.folderManagerReducer?.desc} 
                        className={predef.textarea_full} 
                        onBlur={(e: any) => handleChangeField("desc", e.target.value)}
                    ></textarea>
                </FormField>
                <div className={`py-6 flex flex-row items-center`}>
                    <div className="w-full">
                        <h4 className={`font-semibold text-lg mb-1 ${inValidFields.windows === true && "text-red-500"}`}>Windows and tabs *</h4>
                        <p className={`text-sm leading-6 text-tbfColor-darkergrey text-start ${inValidFields.windows === true && "text-red-500"}`}>
                            You may add as windows and tabs to this folder as you like to this folder, although a maximum of 25-30 tabs is recommended. 
                        </p>
                        <WindowManager />
                    </div>
                </div>
            </GenericPopup>

        </>
    ); 
}

export default FolderManager;