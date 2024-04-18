import iPopupMessage from '../../interfaces/popup_message';
import styles from "../../styles/global_utils.module.scss";

/*
    A customized and generic message box, used primarily to warn the user about
    certain actions. This box may be used for other purposes as well.

    UI might be modified later to suit other needs...
*/

const PopupMessage = (props: iPopupMessage): JSX.Element => {
    const { title, text, primaryButton, secondaryButton } = props;
    const { popup_container_transparent_bg } = styles;

    
    // Hide body's scrollbar
    document.body.style.overflowY = "hidden";

    // Handle a button click. Perform actions based on the button's purposes
    // ... this should be rewritten/refactored at a later time...
    const handleButtonClick = (option: "primary" | "secondary"): void => {
        // Restore body's scrollbar
        document.body.style.overflowY = "scroll";

        if(option === "primary"){
            primaryButton.callback();
        } else {
            secondaryButton.callback();
        }
    }

    return (
        <div role="alert" className={`${styles.scroll_style} fixed top-0 flex ${popup_container_transparent_bg} justify-center items-center left-0 w-full h-screen z-[1000000]`}>
            <div className="p-10 bg-tbfColor-darkpurple rounded-lg drop-shadow-2xl text-center leading-7 text-md">
                {<h4 className="text-2xl mb-3 text-white">{title}</h4>}
                <p className="mb-8 text-white">
                    {text}
                </p>
              
                <button 
                    data-testid={"alert-cancel-button"}
                    onClick={() => handleButtonClick("secondary")} 
                    className="hover:opacity-60 transition-all ease-in border-2 my-2 border-white bg-tbfColor-darkpurple text-white font-semibold px-3 py-2 mx-2 rounded-3xl"
                >
                    { secondaryButton.text }
                </button>
                <button 
                    data-testid={"alert-proceed-button"}
                    onClick={() => handleButtonClick("primary")} 
                    className="hover:opacity-60 transition-all ease-in border-2 my-2 border-white bg-white text-tbfColor-darkpurple font-semibold px-3 py-2 mx-2 rounded-3xl"
                >
                    { primaryButton.text }
                </button>
            </div>
        </div>
    ); 
}

export default PopupMessage;