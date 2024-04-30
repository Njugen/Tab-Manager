interface iTabItem {
    id: number | string,
    label: string,
    url: string,
    windowId?: number,
    marked?: boolean,
    onMark?: (tabId: number | string, checked: boolean) => void | undefined,
    onEdit?: (tabId: number | string) => void | undefined,
    onClose?: (e?: any) => any | undefined
}

export {
    iTabItem
};