interface iGPButtonProps { 
    label: string, 
    handler: (e?: any) => void 
}

interface iGenericPopup {
    title: string,
    type: "slide-in" | "popup",
    children: Array<JSX.Element> | JSX.Element,
    show: boolean,
    cancel: iGPButtonProps,
    save?: iGPButtonProps,
}

export { iGPButtonProps, iGenericPopup };