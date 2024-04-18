import { iFolderItem } from "./folder_item"
import { iWindowItem } from "./window_item"

interface iSearchBarFolderListProps {
    items: Array<iFolderItem>,
    keyword: string,
    handleOpen: (windows: Array<iWindowItem>, type: string) => void
}

export default iSearchBarFolderListProps