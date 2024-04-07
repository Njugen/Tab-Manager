interface iFolderIconButton {
    id: string,
    disabled: boolean,
    children: Array<JSX.Element> | JSX.Element,
    onClick: (e: any) => void
}

export {iFolderIconButton}