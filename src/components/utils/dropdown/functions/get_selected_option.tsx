import { iFieldOption } from "../../../../interfaces/dropdown";
import { iGetSelectedOptionProps } from "../../../../interfaces/dropdown";

// Return the selected option
const getSelectedOption = (props: iGetSelectedOptionProps): iFieldOption => {
    const { options, preset, selected } = props;

    const target = options.find((option) => option.value === selected);
    return target || preset;
}

export { getSelectedOption };