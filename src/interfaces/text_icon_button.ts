import { iTextButton } from "./text_button";

interface iTextIconButton extends iTextButton {
    id: string,
    textSize: string,
    children: Array<JSX.Element> | JSX.Element,
}


export {
    iTextIconButton
};