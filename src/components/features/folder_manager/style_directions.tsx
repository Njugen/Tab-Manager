import styles from "../../../styles/global_utils.module.scss";

const { popup_container_transparent_bg, popup_container_default } = styles;

// Style the outer layer of this component (this layer handles e.g. the slide in behaviour)
const outerStyleDirection = (type: string, show: boolean): string => {
    let cssClasses = "";

    if(type === "slide-in"){
        cssClasses = `${popup_container_transparent_bg} scroll-smooth overflow-x-hidden overflow-y-scroll flex fixed top-0 left-0 justify-center items-center w-screen z-[600] ${show === false ? "h-0" : "h-screen"}`;
    } else if(type === "popup") {
        cssClasses = `${popup_container_default} overflow-y-auto overflow-x-hidden flex fixed top-0 left-0 justify-center items-center w-screen z-[600] ${show === false ? "h-0" : "h-screen"}`;
    }

    return cssClasses;
}

// Style the inner layer of this component (the popup itself, where the contents resides)
const innerStyleDirection = (type: string, show: boolean): string => {
    let cssClasses = "";

    if(type === "slide-in"){
        cssClasses = `w-full bg-white min-h-[200px] md:rounded-lg absolute left-0 ${show === false ? "top-[-200%] ease-out duration-300" : "top-0 md:top-[6rem] sm:top-0 ease-in duration-300"}`;
    } else if(type === "popup"){
        cssClasses = `w-full bg-white min-h-[200px] md:rounded-lg absolute left-0 ${show === false ? "hidden" : "top-0"}`;
    }

    return cssClasses;
}

export {
    outerStyleDirection,
    innerStyleDirection
}