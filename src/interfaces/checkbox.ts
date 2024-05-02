interface iCheckbox {
	label?: String;
	checked: boolean;
	onCallback: (e: { state: boolean }) => void;
}

export { iCheckbox };
