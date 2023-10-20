interface iFieldOption {
    id: number,
    label: string
}

interface iDropdownSelected {
    selected: number | null
}

interface iDropdown {
    tag: string,
    preset: iFieldOption,
    options: Array<iFieldOption>,
    onCallback: (e: iDropdownSelected) => void
}

export { iFieldOption, iDropdownSelected, iDropdown }