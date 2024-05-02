interface iFormField {
	label: String;
	description: String;
	error?: boolean;
	children?: JSX.Element;
}

export { iFormField };
