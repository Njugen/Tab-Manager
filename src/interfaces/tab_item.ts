interface iTabItem {
    id: number,
    label: string,
    url: string,
    marked?: boolean,
    onMark?: (tabId: number, checked: boolean) => void | undefined,
    onEdit?: (tabId: number) => void | undefined,
    onClose?: (e?: any) => any | undefined
}

export {
    iTabItem
};