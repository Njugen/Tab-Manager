import { iTextContents } from "../../interfaces/text_contents";

/*
    Customized generic paragraph for this extension. May or may not be used depending
    on needs for a generic paragraph layout.
*/

const Paragraph = (props: iTextContents): JSX.Element => {
    const { children, size, lineheight} = props;
    
    return (
        <p className={`${size && size} text-base ${lineheight ? lineheight : "leading-7"} text-tbfColor-darkergrey text-start`}>
            {children}
        </p>
    ); 
}

export default Paragraph;