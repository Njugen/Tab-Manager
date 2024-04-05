// Check whether or not the set of windows has been modified
const windowListChanged = (origin: string, modified: string): boolean => {
    const presetWindows: string = origin;
    const modifiedWindows: string = JSON.stringify(modified);

    if(!modifiedWindows || !presetWindows) return false;
    if(origin !== modifiedWindows){
        return true;
    }

    return false;
}

export default windowListChanged;