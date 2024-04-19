interface iFieldOption {
    value: number,
    label: string,
}


interface iDropdownSelected {
    selected: number | null
}

interface iGetSelectedOptionProps extends iDropdownSelected {
    options: Array<iFieldOption>,
    preset: iFieldOption,
}

interface iDropdown {
    tag: string,
    preset: iFieldOption,
    options: Array<iFieldOption>,
    onCallback: (e: iDropdownSelected) => void
}


export { iFieldOption, iDropdownSelected, iDropdown, iGetSelectedOptionProps }