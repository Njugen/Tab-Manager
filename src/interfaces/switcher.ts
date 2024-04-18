interface iSwitcherSelected {
    state: boolean
}

interface iSwitcher {
    label?: String,
    value: boolean,
    onCallback: (e: boolean | null) => void
}

export {iSwitcherSelected, iSwitcher};