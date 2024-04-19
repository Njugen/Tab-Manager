import { iFieldOption } from "../../../../interfaces/dropdown";
import { iGetSelectedOptionProps } from "../../../../interfaces/dropdown";

// Get information about the selected option 
const getSelectedOption = (props: iGetSelectedOptionProps): iFieldOption => {
    const { options, preset, selected } = props;

    const target = options.find((option) => option.value === selected);
    return target ? target : preset;
}

export {getSelectedOption};