import { iGenericIconButton } from "../../interfaces/generic_icon_button";
import styles from "./../../styles/global_utils.module.scss";

/*
    An icon button used for all kind of things, where only an icon is sufficient (no labels)
*/


function GenericIconButton(props: iGenericIconButton): JSX.Element {
    const { icon, children, onClick } = props;
    const { opacity_hover_effect } = styles;

    return (
        <button data-testid={`generic-icon-button-${icon}`} className={`${opacity_hover_effect}`} onClick={onClick}>
            {children}
        </button>
    ); 
}

export default GenericIconButton;