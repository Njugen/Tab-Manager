import { iWindowItem } from "./window_item"

interface iLaunchFolderProps {
    folderLaunchType?: string | null,
    windowsPayload: Array<iWindowItem> | null,
    setWindowsPayload: React.Dispatch<React.SetStateAction<iWindowItem[] | null>>,
    setFolderLaunchType: React.Dispatch<React.SetStateAction<string | null>>,
    setShowPerformanceWarning: React.Dispatch<React.SetStateAction<boolean>>
}

export default iLaunchFolderProps