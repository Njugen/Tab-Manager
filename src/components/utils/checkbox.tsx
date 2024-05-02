import { useState, useEffect, useRef } from "react";
import { iCheckbox } from "../../interfaces/checkbox";

/*
    Customized checkbox

    This checkbox provides a modified check icon. Functionality
    remains the same as browser's default
*/

const Checkbox = (props: iCheckbox): JSX.Element => {
    const { onCallback, label } = props;
    
    // Keep track of wether or not this boxbox has been checked
    const [checked, setChecked] = useState<boolean>(false);
    const checkboxRef = useRef<HTMLInputElement>(null);

    const handleChecked = (e: any): void => {
        // Check/uncheck this box
        e.target.checked = checked ? false : true
        setChecked((prev) => !prev);

        // Send the new state of this box to the parent component 
        onCallback({state: !checked});
    }

    useEffect(() => {
        // Once props.checked is available or changed by the parent component, set this state
        // accordingly
        setChecked(props.checked);
        if(checkboxRef.current) checkboxRef.current.checked = props.checked;
    }, [props.checked])

    return (
        <div className={`flex items-center ${label ? "mx-5" : "ml-2 mr-0"}`}>
            {label && <span className={`inline-block mr-2 text-sm text-black`}>{label}</span>}
            <input
                ref={checkboxRef}
                type="checkbox"
                data-testid={"checkbox"} 
                onClick={handleChecked} 
                defaultChecked={checked}
                className={`relative border border-tbfColor-middlegrey3 h-[1.1rem] w-[1.1rem] accent-tbfColor-lightpurple cursor-pointer`}
            />
             
        </div>
    ); 
}

export default Checkbox;