import { iFolderItem } from "./folder_item";

interface iFolderManager {
	title: string;
	type: "slide-in" | "popup";
	folder?: iFolderItem;
	onClose: () => void;
}

export { iFolderManager };
