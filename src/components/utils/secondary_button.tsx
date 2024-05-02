import styles from "../../styles/global_utils.module.scss";
import { iTextButton } from "../../interfaces/text_button";

/*
    Button intended to use in negative direction ("Cancel", "No", etc). 

    In the future, this button should be made into a generic button, offering various colors instead
    of just being a button intended for one purpose.
*/
const SecondaryButton = (props: iTextButton): JSX.Element => {
	const { text, onClick, disabled } = props;
	const { opacity_hover_effect } = styles;

	return (
		<button
			disabled={disabled}
			className={`text-tbfColor-lightpurple font-medium py-2 px-6 mx-2 bg-transparent border-2 border-tbfColor-lightpurple rounded-3xl ${opacity_hover_effect}`}
			onClick={onClick}
		>
			{text}
		</button>
	);
};

export default SecondaryButton;
