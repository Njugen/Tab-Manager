import iDropdownMenu from "../../../interfaces/dropdown_menu";
import applyStateClasses from "./functions/apply_state_classes";
import applyStateValue from "./functions/apply_state_id";

/*
    Dropdown menu, displaying a set of options passed in through the props.
*/

const DropdownMenu = (props: iDropdownMenu): JSX.Element => {
    const { tag, options, onSelect, selected } = props;

    return (
        <ul id={tag} className={`z-50 list-none drop-shadow-no_pos overflow-y-auto bg-white absolute max-h-[2000px] mt-2 text-sm w-full text-tbfColor-darkergrey rounded-lg`}>
            {
                options.map((option, i) => {
                    return (
                        <li id={applyStateValue(tag, option.value, selected)} key={applyStateValue(tag, option.value, selected)}>
                            <button key={option.value} onClick={() => onSelect(option.value)} className={applyStateClasses(option.value, selected)}>
                                {option.label}
                            </button>
                        </li>
                    );
                })
            }
        </ul>
    )
}

export default DropdownMenu;