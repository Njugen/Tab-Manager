const buttonId = (id: string, active: boolean): String => {
    if(id === "collapse_expand"){
        return `folder-control-button-${active === true ? "collapse" : "expand"}`;
    } else {
        return `folder-control-button-${id ? id : "none"}`;
    }
}

export default buttonId;