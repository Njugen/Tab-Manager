const applyStateClasses = (id: number, selected: number | null): string => {
    if(selected === id){
        // Indicate a selected option.
        return "hover:opacity-70 border-b bottom flex items-center text-sm text-white weight-bold px-3 py-6 h-10 w-full bg-tbfColor-lightpurple h-9";
    } else {
        // Indicate a non-selected option(s)
        return "hover:bg-tbfColor-lightgrey border-b border-tbfColor-middlegrey hover:border-tbfColor-lightergrey flex items-center text-sm text-tbfColor-darkergrey weight-bold px-3 py-6 h-10 w-full";
    }
}

export default applyStateClasses;