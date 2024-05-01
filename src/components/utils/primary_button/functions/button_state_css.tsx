import styles from "./../../../../styles/global_utils.module.scss";

const { opacity_hover_effect } = styles;

const buttonStateCSS = (isDisabled: boolean): string => {
    if(!isDisabled){
        return `bg-tbfColor-lightpurple border-tbfColor-lightpurple ${opacity_hover_effect}`;
    } else {
        return `bg-tbfColor-middlegrey3 border-tbfColor-middlegrey3 disabled:opacity-50`;
    }
}

export default buttonStateCSS;