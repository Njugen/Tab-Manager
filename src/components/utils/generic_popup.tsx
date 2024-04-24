import { forwardRef, useEffect } from "react"
import CloseIcon from "../icons/close_icon"
import { innerStyleDirection, outerStyleDirection } from "../features/folder_manager/functions/style_directions"
import GenericButton from "./generic_button"
import PrimaryButton from "./primary_button/primary_button"
import PurpleBorderButton from "./purple_border_button"
import { iGenericPopup } from '../../interfaces/generic_popup';
import styles from "../../styles/global_utils.module.scss";

// Popup component with providing basic popup features.
// Can encapsulate any components and trigger callback props when
// clicking primary/secondary buttons (e.g. save and close)

const GenericPopup = forwardRef(function GenericPopup(props: iGenericPopup, ref: any): JSX.Element {
    const { title, type, children, show, save, cancel } = props;

    const handleClose = (): void => {
        cancel.handler();
        document.body.style.overflowY = "auto";
    }

    const handleSave = (): void => {
        if(!save) return;
        save?.handler();
        document.body.style.overflowY = "auto";
    }

    useEffect(() => {
       // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        document.body.style.overflowY = "hidden";
    }, [])
    

    return (
        <section role="dialog" ref={ref} className={`${styles.scroll_style} ${outerStyleDirection(type, show)}`}>
            <div className="w-full h-full">   
                <div className="relative top-0 md:bottom-12 max-w-[992px] mx-auto">
                    <div className={innerStyleDirection(type, show)}>
                        <header id="generic-popup-header" className={`pl-8 pr-5 pb-5 pt-6 border-b border-tbfColor-lgrey w-full flex items-center justify-between`}>
                            <h1 data-testid="generic-popup-title" className="text-3xl text-tbfColor-darkpurple font-light inline-block">
                                {title}
                            </h1>
                            <GenericButton onClick={handleClose}>
                                <CloseIcon size={34} fill="rgba(0,0,0,0.2)" />
                            </GenericButton>
                        </header>
                        <div id="generic-popup-body" className="px-8 pt-6">
                            {children}
                        </div>
                        {
                            save && (
                                <div className="max-sm:justify-center px-8 py-8 mt-4 flex justify-end border-t border-tbfColor-lgrey s">
                                    <PurpleBorderButton text={cancel.label} disabled={false} onClick={handleClose} />
                                    <PrimaryButton text={save.label} disabled={false} onClick={handleSave}/>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div> 
        </section>
    )
})

export default GenericPopup;