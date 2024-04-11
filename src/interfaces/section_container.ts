interface iSectionContainer {
    id: string,
    title: string,
    children: JSX.Element | Array<JSX.Element>,
    onExpand?: (e: boolean) => void, 
    options?: () => JSX.Element | Array<JSX.Element>,
    initFullscreen?: boolean 
    ref?: any
}

export default iSectionContainer;