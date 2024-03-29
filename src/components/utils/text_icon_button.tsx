import { iTextIconButton } from "../../interfaces/text_icon_button";
import styles from "./../../styles/global_utils.module.scss";

/*
    An icon button with applied labels, used for all kind of things, 

    To make use of a new icon, insert a new if-statement returning the requested icon and
    check for the icon's prop name.
*/


const TextIconButton = (props: iTextIconButton): JSX.Element => {
    const { children, id, disabled, text, textSize, onClick } = props;
    const { opacity_hover_effect } = styles;
    
    return (
        <button 
            data-testid={`text-icon-button-${id}`} 
            disabled={disabled} 
            className={`flex mr-6 items-center disabled:opacity-50 ${disabled === false && opacity_hover_effect}`} 
            onClick={onClick}
        >
            {children} 
            <span className={`${textSize} ml-2`}>
                {text}
            </span>
        </button>
    ); 
}

export default TextIconButton;