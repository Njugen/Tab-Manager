import { useRef, useState, useEffect, useCallback } from "react";
import CollapseIcon from "../../icons/collapse_icon";
import { iDropdown } from "../../../interfaces/dropdown";
import RotationEffect from "../../effects/rotation_effect";
import { getSelectedOption } from "./functions/get_selected_option";
import { iGetSelectedOptionProps } from "../../../interfaces/dropdown";
import DropdownMenu from "../dropdown_menu/dropdown_menu";

/*
    A dropdown selector, containing a menu with a set of options
*/

const Dropdown = (props: iDropdown): JSX.Element => {
	// The selected option id
	const [selected, setSelected] = useState<number | null>(null);

	// State defining the visibility of the menu
	const [showSubMenuContainer, setShowSubMenuContainer] = useState<boolean>(false);
	const { tag, preset, options, onCallback } = props;

	// Reference to dropdown selector container
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Trigger once an option has been selected
	const handleSelect = (id: number): void => {
		setSelected(id);
		onCallback({ selected: id });
	};

	const handleWindowClick = useCallback(
		(e: any): void => {
			e.stopPropagation();

			const selectorTag = tag + "-selector";
			const { id, parentElement, tagName } = e.target;

			if (
				id !== selectorTag &&
				parentElement?.id !== selectorTag &&
				tagName !== "svg" &&
				tagName !== "path"
			) {
				setShowSubMenuContainer(!showSubMenuContainer);
			}
		},
		[showSubMenuContainer]
	);

	useEffect(() => {
		// Listen for clicks at all time and determine whether or not the dropdown menu should be shown/hidden
		if (showSubMenuContainer) {
			window.addEventListener("click", handleWindowClick);
		}

		return () => {
			window.removeEventListener("click", handleWindowClick);
		};
	}, [showSubMenuContainer]);

	const dropdownBorderCSS = showSubMenuContainer
		? " border-tbfColor-lightpurple"
		: "border-tbfColor-middlegrey4";
	const optionsProps: iGetSelectedOptionProps = { options, preset, selected };

	return (
		<div
			role="menu"
			ref={dropdownRef}
			className={`hover:cursor-pointer bg-white relative text-sm w-full text-tbfColor-darkergrey rounded-lg h-[2.75rem] border transition-all duration-75 ${dropdownBorderCSS}`}
		>
			<div
				data-testid={`${tag}-selector`}
				id={`${tag}-selector`}
				className="flex items-center justify-between mx-3 h-full"
				onClick={() => setShowSubMenuContainer(!showSubMenuContainer)}
			>
				<button className="hover:cursor-pointer">
					{getSelectedOption(optionsProps)
						? getSelectedOption(optionsProps).label
						: preset.label}
				</button>
				<RotationEffect rotated={showSubMenuContainer}>
					<CollapseIcon size={28} fill={"#000"} />
				</RotationEffect>
			</div>
			<div
				className={`transition duration-75 ${showSubMenuContainer ? "ease-in opacity-100" : "ease-out opacity-0"}`}
			>
				{showSubMenuContainer && (
					<DropdownMenu
						tag={tag}
						options={options}
						selected={selected}
						onSelect={handleSelect}
					/>
				)}
			</div>
		</div>
	);
};

export default Dropdown;
