import styles from "../../../styles/global_utils.module.scss";
import { iFolderIconButton } from "../../../interfaces/folder_icon_button";
import buttonId from "./functions/button_id";

const FolderControlButton = (props: iFolderIconButton): JSX.Element => {
    const { id, disabled, children, onClick } = props;
    const { opacity_hover_effect } = styles;

    return (
        <button 
            disabled={disabled}
            className={`${id !== "collapse_expand" && "mx-2"} ${opacity_hover_effect}`} 
            onClick={onClick}
        >
            {children}
        </button>
    ); 
}

export default FolderControlButton;