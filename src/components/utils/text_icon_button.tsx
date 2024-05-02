import { iTextIconButton } from "../../interfaces/text_icon_button";
import styles from "./../../styles/global_utils.module.scss";

/*
    An icon button with applied labels, used for all kind of things, 
*/

const TextIconButton = (props: iTextIconButton): JSX.Element => {
	const { children, id, disabled, text, textSize, onClick } = props;
	const { opacity_hover_effect } = styles;

	return (
		<button
			data-testid={`text-icon-button-${id}`}
			disabled={disabled}
			className={`flex mr-6 items-center disabled:opacity-50 ${!disabled && opacity_hover_effect}`}
			onClick={onClick}
		>
			{children}
			<span className={`${textSize} ml-2`}>{text}</span>
		</button>
	);
};

export default TextIconButton;
