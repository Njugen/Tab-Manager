const { local, sync } = chrome.storage;

const saveToStorage = (type: "local" | "sync", key: string, value: any) => {
    const payload = {
        [key]: value
    }

    if(type === "local"){
        local.set(payload);

    } else if(type === "sync"){
        sync.set(payload);
    }
}

const getFromStorage = (type: "local" | "sync", key: string, callback: (items: any) => void) => {
    let result;
    
    if(type === "local"){
        result = local.get(key, callback);
    } else if(type === "sync"){
        result = sync.get(key, callback);
    }
 
    return result;
}

export {
    saveToStorage,
    getFromStorage
}