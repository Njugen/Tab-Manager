import iCircleButton from "../../interfaces/circle_button";
import styles from "./../../styles/global_utils.module.scss";

const CircleButton = (props: iCircleButton) => {
    const { children, disabled, bgCSSClass, onClick } = props;

    return (
        <button 
            disabled={disabled}
            className={`${bgCSSClass} m-1 p-3 disabled:bg-tbfColor-middlegrey3 disabled:hover:disabled:bg-tbfColor-middlegrey3 disabled:opacity-50 rounded-full inline-flex justify-center items-center ${disabled === false && styles.opacity_hover_effect}`} 
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default CircleButton;