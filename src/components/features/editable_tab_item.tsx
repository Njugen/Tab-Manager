
import "./../../styles/global_utils.module.scss";
import { iEditableTabItem } from "../../interfaces/editable_tab_item";
import * as predef from "../../styles/predef";
import { useRef, useState } from "react";
import randomNumber from "../../tools/random_number";
import { iTabItem } from "../../interfaces/tab_item";
import { useDispatch } from "react-redux";
import verifyValue from "../../tools/verify_value";
import { updateWindowList } from "../../redux-toolkit/slices/folder_management_slice";


/*
    A textfield, which lets the user set/update a url of a tab.
*/

const EditableTabItem = (props: iEditableTabItem): JSX.Element => {
    const { id, windowId, preset, onStop } = props;
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const fieldRef = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch();
    
    // Show error message, and prevent saving if field is invalid.
    // Save to redux store if valid.
    const saveToStore = (e: any): void => {
        const tabId = id ? id : randomNumber();

        if(!verifyValue(e.target.value)){
            setErrorMessage("A tab needs to have a valid URL, e.g. https://google.com/...");
        } else {
            setErrorMessage(null);
            
            const tab: iTabItem = {
                id: tabId,
                label: e.target.value,
                url: e.target.value,
                marked: e.target.marked
            };
           
            dispatch(updateWindowList({ windowId, targetTab: tab })); 
            onStop();
        }
    }

    // Save the field once the user clicks outside of it.
    const handleBlur = (e: any): void => {
        saveToStore(e);
    }

    // Save the field once the user hits "Enter" on the keyboard
    const handleKeyDown = (e: any): void => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            saveToStore(e);
        }
    }

    return (
        <li className="mt-1 list-none">
            <input 
                data-testid="editable-tab"
                autoFocus 
                ref={fieldRef} 
                type="text" 
                defaultValue={preset ? preset : "https://"}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={`${predef.textfield_full} h-[46px] px-3 py-6 w-full text-lg text-tbfColor-darkergrey rounded-lg border border-tbfColor-middlegrey4`} 
            />
            {errorMessage && <span data-testid="field-error" className="text-semibold text-red-500 text-sm">{errorMessage}</span>} 
        </li>
    ); 
}

export default EditableTabItem;