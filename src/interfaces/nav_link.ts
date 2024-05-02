type tNavLink = {
	label: string;
	url: string;
	isActive: boolean;
	onClick: () => void;
};
interface iNavlink {
	children: Array<JSX.Element> | JSX.Element;
	label?: string;
	url: string;
	isActive?: boolean;
	onClick: () => void;
}

export { tNavLink, iNavlink };
