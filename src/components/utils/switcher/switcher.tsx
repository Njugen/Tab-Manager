import { useState, useEffect } from "react";
import { iSwitcher } from "../../../interfaces/switcher";
import buttonStateCSS from "./functions/button_state_css";
import divStateCSS from "./functions/div_state_css";

/*
    Switcher, acts as an dynamic toggle component permitting
    setting state to a boolean or null value
*/

const Switcher = (props: iSwitcher): JSX.Element => {
    const [switchOn, setSwitchOn] = useState<boolean | null>(null);
    const { onCallback, label, id, value } = props;

    // Set the props.value to component's state once identified such exists
    useEffect(() => {
        setSwitchOn(props.value);
    }, [props.value]);

    // Set the state to either true or false
    const handleSwitch = (): void => {
        setSwitchOn(switchOn === false ? true : false);
        onCallback(switchOn === false ? true : false);
    }

    return (
        <div className={`flex items-center ${label && "mx-5"}`}>
            {label && <span className={`inline-block mr-2 text-sm text-black`}>{label}</span>}
            <button 
                data-testid={id} 
                onClick={handleSwitch} 
                className={`hover:opacity-70 rounded-3xl py-0 px-2 inline-block w-14 h-7 items-center ${buttonStateCSS(switchOn, value)}`}
            >
                <div className={`h-4 w-6 relative`}>
                    <div className={`w-4 h-4 block rounded-3xl absolute top-0 ${divStateCSS(switchOn, value)}`}>
                        
                    </div>
                </div>
            </button>
        </div>
    ); 
}

export default Switcher;