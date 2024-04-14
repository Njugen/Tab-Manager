import "./../../styles/global_utils.module.scss";
import FormField from '../../components/utils/form_field';
import Dropdown from '../../components/utils/dropdown/dropdown';
import Switcher from '../../components/utils/switcher/switcher';
import { iFieldOption } from "../../interfaces/dropdown";
import { useEffect, useMemo, useState } from 'react';
import { getFromStorage, saveToStorage } from "../../services/webex_api/storage";
import SectionContainer from "../../components/utils/section_container";
import iView from "../../interfaces/view";
import { useDispatch, useSelector } from "react-redux";
import { allowErrorLog, changeCloseSession, changeDuplicationWarningValue, changeFolderRemovalWarning, changePerformanceWarningValue, changeShowFolderChangeWarning, readAllPluginSettings } from "../../redux-toolkit/slices/plugin_settings_slice";
import { RootState } from "../../redux-toolkit/store";
import iPluginSettings from "../../interfaces/states/plugin_settings_state";

/*
    Settings view

    Consists of form fields wrapping input components in vertical order, representing various settings and options 
    in this plugin. 

    Wrap input, textarea, Dropdown, Switcher or Checkbox components into the formfields to add new
    features if needed while keeping the intended UI intact. 
*/

// Options for performance warnings
const performanceNotificationOptions: Array<iFieldOption> = [
    { id: 5, label: "5" }, 
    { id: 10, label: "10" }, 
    { id: 15, label: "15" }, 
    { id: 20, label: "20" }, 
    { id: 30, label: "30" },
    { id: 40, label: "40" }, 
    { id: -1, label: "Don't warn me" } 
];

// Options for duplication warnings
const duplicationWarningOptions: Array<iFieldOption> = [
    { id: 2, label: "2 folders" }, 
    { id: 3, label: "3 folders" }, 
    { id: 4, label: "4 folders" }, 
    { id: 5, label: "5 folders" }, 
    { id: -1, label: "Never" }
];

const SettingsView = (props: iView): JSX.Element => {
    const pluginSettingsState: iPluginSettings = useSelector((state: RootState) => state.pluginSettings);
    const dispatch = useDispatch()

   
    // Set default values of all fields
    useEffect(() => {
        getFromStorage("local", null, (data) => {
            dispatch(readAllPluginSettings(data));
        })
    }, []);

    const getPresetPerformanceNotification = (): any => {
        const result = performanceNotificationOptions.filter((target) => target.id === pluginSettingsState.performanceWarningValue);
        return result[0] || performanceNotificationOptions[0];
    }

    const getPresetDuplicationWarning = (): any => {
        const result = duplicationWarningOptions.filter((target) => target.id === pluginSettingsState.duplicationWarningValue);
        return result[0] || duplicationWarningOptions[0];
    }

    // Save data selected in dropdown menu
    const saveSelectedOption = (key: string, value: number | null): void => {
        if(value !== null){
            saveToStorage("local", key, value);

            if(key === "performanceWarningValue"){
                dispatch(changePerformanceWarningValue(value))
            } else if(key === "duplicationWarningValue"){
                dispatch(changeDuplicationWarningValue(value))
            }
       
        }
    }

    // Save switcher data
    const saveSwitchSetting = (key: string, value: boolean | null): void => {
        if(value === null) return;

        saveToStorage("local", key, value);

        if(key === "closeSessionAtFolderLaunch"){
            dispatch(changeCloseSession(value));
        } else if(key === "showFolderChangeWarning"){
            dispatch(changeShowFolderChangeWarning(value));
        } else if(key === "folderRemovalWarning"){
            dispatch(changeFolderRemovalWarning(value))
        } else if(key === "allowErrorLog"){
            dispatch(allowErrorLog(value))
           
        }
    }



    return (
        <SectionContainer id="settings-view" title="Settings">
            <div className="flex 2xl:flex-row justify-center 2xl:justify-normal">
                {Object.entries(pluginSettingsState).length > 0 && <div className="w-10/12 2xl:w-7/12">
                    <FormField label="Performance notification" description="Warn me if the total amount of tabs exceeds a certain threshold when launching multiple tabs">
                        <Dropdown 
                            onCallback={(e) => saveSelectedOption("performanceWarningValue", e.selected)} 
                            tag="performance-dropdown" 
                            preset={getPresetPerformanceNotification()} 
                            options={performanceNotificationOptions} 
                        />
                    </FormField>                      
                    <FormField label="Duplication warnings" description="Show a warning message before duplicating at least a certain amount of selected folders">
                        <Dropdown 
                            onCallback={(e) => saveSelectedOption("duplicationWarningValue", e.selected)} 
                            tag="duplication-warning-dropdown" 
                            preset={getPresetDuplicationWarning()} 
                            options={duplicationWarningOptions} 
                        />
                    </FormField>
                    <FormField label="Close at folder launch" description="Close current browser session when launching a folder">
                        <Switcher 
                            value={pluginSettingsState.closeSessionAtFolderLaunch} 
                            onCallback={(e) => saveSwitchSetting("closeSessionAtFolderLaunch", e)} 
                        />
                    </FormField>
                    <FormField label="Cancellation warnings" description="Show a warning message before discarding changes made to folders">
                        <Switcher 
                            value={pluginSettingsState.showFolderChangeWarning} 
                            onCallback={(e) => saveSwitchSetting("showFolderChangeWarning", e)} 
                        />
                    </FormField>
                    <FormField label="Removal warnings" description="Show a warning message before deleting folders">
                        <Switcher 
                            value={pluginSettingsState.folderRemovalWarning} 
                            onCallback={(e) => saveSwitchSetting("folderRemovalWarning", e)} 
                        />
                    </FormField>
                    <FormField label="Log errors" description="Automatically send error reports to the developer">
                        <Switcher 
                            value={pluginSettingsState.allowErrorLog} 
                            onCallback={(e) => saveSwitchSetting("allowErrorLog", e)} 
                        />
                    </FormField>
                </div>}
            </div>
        </SectionContainer>
    );
}

export default SettingsView;