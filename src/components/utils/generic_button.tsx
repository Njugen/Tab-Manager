import { iGenericButton } from "../../interfaces/generic_icon_button";
import styles from "../../styles/global_utils.module.scss";

/*
    An icon button used for all kind of things, where only an icon is sufficient (no labels)
*/

function GenericButton(props: iGenericButton): JSX.Element {
    const { children, onClick } = props;
    const { opacity_hover_effect } = styles;

    return (
        <button className={`${opacity_hover_effect} m-2`} onClick={onClick}>
            {children}
        </button>
    ); 
}

export default GenericButton;