import { iFieldOption } from "./dropdown";

interface iAddToFolderPopup {
    title: string,
    type: "slide-in" | "popup"
    dropdownOptions: Array<iFieldOption>,
    onNewWorkspace: () => void,
    onExistingWorkspace: (e: any) => void
    onCancel: () => void,
}

export default iAddToFolderPopup;