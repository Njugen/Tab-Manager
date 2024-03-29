import { iFieldOption } from "./dropdown";

interface iAddToFolderPopup {
    title: string,
    type: "slide-in" | "popup"
    dropdownOptions: Array<iFieldOption>,
    onNewFolder: () => void,
    onExistingFolder: (e: any) => void
    onCancel: () => void,
}

export default iAddToFolderPopup;