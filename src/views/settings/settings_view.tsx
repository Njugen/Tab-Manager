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
import { changeCancellationWarnings, changeCloseAtLaunch, changeDuplicationWarnings, changeLogErrors, changePerformanceNotification, changeRemovalWarning, readAllPluginSettings } from "../../redux/actions/settings_actions";
import { iPluginSettings } from "../../redux/reducers/settings_reducer";

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
    const settingsState: iPluginSettings = useSelector((state: any) => state.pluginSettingsReducer);
    const dispatch = useDispatch()

   
    // Set default values of all fields
    useEffect(() => {
        getFromStorage("local", null, (data) => {
            const { performance_notification_value, duplication_warning_value, close_current_setting, cancellation_warning_setting, removal_warning_setting, error_log_setting } = data;

            const payload = {
                performance_notification_value, duplication_warning_value, close_current_setting, cancellation_warning_setting, removal_warning_setting, error_log_setting
            }
            dispatch(readAllPluginSettings(payload));
        })
    }, []);

    const getPresetPerformanceNotification = (): any => {
        const result = performanceNotificationOptions.filter((target) => target.id === settingsState.performance_notification_value);
        return result[0] || performanceNotificationOptions[0];
    }

    const getPresetDuplicationWarning = (): any => {
        const result = duplicationWarningOptions.filter((target) => target.id === settingsState.duplication_warning_value);
        return result[0] || duplicationWarningOptions[0];
    }

    // Save data selected in dropdown menu
    const saveSelectedOption = (key: string, value: number | null): void => {
        if(value !== null){
            saveToStorage("local", key, value);

            if(key === "performance_notification_value"){
                dispatch(changePerformanceNotification(value))
            } else if(key === "duplication_warning_value"){
                dispatch(changeDuplicationWarnings(value))
            }
       
        }
    }

    // Save switcher data
    const saveSwitchSetting = (key: string, value: boolean | null): void => {
        if(value === null) return;

        saveToStorage("local", key, value);

        if(key === "close_current_setting"){
            dispatch(changeCloseAtLaunch(value));
        } else if(key === "cancellation_warning_setting"){
            dispatch(changeCancellationWarnings(value));
        } else if(key === "removal_warning_setting"){
            dispatch(changeRemovalWarning(value))
        } else if(key === "error_log_setting"){
            dispatch(changeLogErrors(value))
        }
    }



    return (
        <SectionContainer id="settings-view" title="Settings">
            <div className="flex 2xl:flex-row justify-center 2xl:justify-normal">
                {Object.entries(settingsState).length > 0 && <div className="w-10/12 2xl:w-7/12">
                    <FormField label="Performance notification" description="Warn me if the total amount of tabs exceeds a certain threshold when launching multiple tabs">
                        <Dropdown 
                            onCallback={(e) => saveSelectedOption("performance_notification_value", e.selected)} 
                            tag="performance-dropdown" 
                            preset={getPresetPerformanceNotification()} 
                            options={performanceNotificationOptions} 
                        />
                    </FormField>                      
                    <FormField label="Duplication warnings" description="Show a warning message before duplicating at least a certain amount of selected folders">
                        <Dropdown 
                            onCallback={(e) => saveSelectedOption("duplication_warning_value", e.selected)} 
                            tag="duplication-warning-dropdown" 
                            preset={getPresetDuplicationWarning()} 
                            options={duplicationWarningOptions} 
                        />
                    </FormField>
                    <FormField label="Close at folder launch" description="Close current browser session when launching a folder">
                        <Switcher 
                            id="close_current_setting" 
                            value={settingsState.close_current_setting} 
                            onCallback={(e) => saveSwitchSetting("close_current_setting", e)} 
                        />
                    </FormField>
                    <FormField label="Cancellation warnings" description="Show a warning message before discarding changes made to folders">
                        <Switcher 
                            id="cancellation_warning_setting" 
                            value={settingsState.cancellation_warning_setting} 
                            onCallback={(e) => saveSwitchSetting("cancellation_warning_setting", e)} 
                        />
                    </FormField>
                    <FormField label="Removal warnings" description="Show a warning message before deleting folders">
                        <Switcher 
                            id="removal_warning_setting" 
                            value={settingsState.removal_warning_setting} 
                            onCallback={(e) => saveSwitchSetting("removal_warning_setting", e)} 
                        />
                    </FormField>
                    <FormField label="Log errors" description="Automatically send error reports to the developer">
                        <Switcher 
                            id="error_log_setting" 
                            value={settingsState.error_log_setting} 
                            onCallback={(e) => saveSwitchSetting("error_log_setting", e)} 
                        />
                    </FormField>
                </div>}
            </div>
        </SectionContainer>
    );
}

export default SettingsView;