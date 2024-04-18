const divStateCSS = (isOn: boolean | null, value: boolean): string => {
    // Decide CSS for switched on/off state
    if(isOn === true || value === true){
        return "transition-all ease-in duration-100 left-full bg-tbfColor-lightpurple";
    } else {
        return "transition-all ease-out duration-100 left-0 bg-tbfColor-middlegrey3";
    }
}

export default divStateCSS;