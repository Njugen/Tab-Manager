import { useRef, useState, useEffect } from "react";
import CollapseIcon from "../../icons/collapse_icon";
import { iDropdown } from "../../../interfaces/dropdown";
import RotationEffect from "../../effects/rotation_effect";
import { IGetSelectedOptionProps, getSelectedOption } from "./get_selected_option";
import DropdownMenu from "../dropdown_menu/dropdown_menu";

/*
    A dropdown selector, containing a menu with a set of options
*/

const Dropdown = (props: iDropdown): JSX.Element => {
    // The selected option id
    const [selected, setSelected] = useState<number | null>(null);

    // State defining the visibility of the menu
    const [showSubMenuContainer, setShowSubMenuContainer] = useState<boolean>(false);
    const [hack, setHack] = useState<boolean>(false);
    const { tag, preset, options, onCallback } = props;

    // Reference to dropdown selector container
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Show or hide sub menu based on state by sliding down the menu.
    // The sliding effect is delayed to allow certain states to take effect
    const handleShowSubMenu = (): void => {
        if(showSubMenuContainer === false){
            setShowSubMenuContainer(true);
            setHack(false);
        } else {
            setHack(true);
            setShowSubMenuContainer(false);
        }
    
    }

    // Trigger once an option has been selected
    const handleSelect = (id: number): void => {
        setSelected(id);
        handleShowSubMenu();
    }

    const handleWindowClick = (e: any): void => {
        e.stopPropagation();

        const selectorTag = (tag + "-selector");
        const { id, parentElement, tagName } = e.target;

        if(
            id !== selectorTag && 
            parentElement?.id !== selectorTag && 
            tagName !== "svg" && 
            tagName !== "path"
        ) {
            setHack((prevState) => !prevState);
        }
    }

    useEffect(() => {
        if(hack === true) {
            setShowSubMenuContainer(false)
        }
    }, [hack])   

    useEffect(() => {
        // Listen for clicks at all time and determine whether or not the menu should be shown/hidden
        if(showSubMenuContainer === true) {
            window.addEventListener("click", handleWindowClick);
        }

        return () => {
            window.removeEventListener("click", handleWindowClick);
        }
    }, [showSubMenuContainer]);

    useEffect(() => {
        // Once the selected option id has been changed, send it back to the parent component
        if(selected !== null) onCallback({ selected: selected });
    }, [selected]);

    const dropdownBorderCSS = (showSubMenuContainer === true ? " border-tbfColor-lightpurple" : "border-tbfColor-middlegrey4");
    const optionsProps: IGetSelectedOptionProps = { options, preset, selected };

    return (
        <div ref={dropdownRef} className={`hover:cursor-pointer bg-white relative text-sm w-full text-tbfColor-darkergrey rounded-lg h-[2.75rem] border transition-all duration-75 ${dropdownBorderCSS}`}>
            <div id={`${tag}-selector`} data-testid={`${tag}-selector`} className="flex items-center justify-between mx-3 h-full" onClick={handleShowSubMenu}>          
                <span className="hover:cursor-pointer">
                    { getSelectedOption(optionsProps) ? getSelectedOption(optionsProps).label : preset.label }
                </span>
                <RotationEffect rotated={showSubMenuContainer}>
                    <CollapseIcon size={28} fill={"#000"} />
                </RotationEffect>
            </div>
            <div className={`transition duration-75 ${showSubMenuContainer === true ? "ease-in opacity-100" : "ease-out opacity-0"}`}>
                { showSubMenuContainer === true && <DropdownMenu tag={tag} options={options} selected={selected} onSelect={handleSelect} />}
            </div>
        </div>
    ); 
}

export default Dropdown;