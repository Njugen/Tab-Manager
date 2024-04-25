
import "./../../styles/global_utils.module.scss";
import Checkbox from "../utils/checkbox";
import { iTabItem } from "../../interfaces/tab_item";
import PenIcon from "../icons/pen_icon";
import CloseLightIcon from "../icons/close_light_icon";
import styles from "../../styles/global_utils.module.scss";

/* 
    Tab component with clickable url and options (close tab, edit tab, mark tab)

    - onEdit: if function present, then show an icon triggering it once clicked
    - onMark: if function present, show a checkbox, permitting the tab to be marked.
    - onClose: if function present, then show an icon triggering it once clicked
*/

const TabItem = (props: iTabItem): JSX.Element => {
    const { 
        id, 
        label, 
        url, 
        marked, 
        onMark, 
        onEdit, 
        onClose, 
    } = props;

    let address: URL | null = null;
    
    // If the given url is not valid, then put this tab in edit mode.
    // -> Automatically edit a tab once a new window has been created
    try {
        address = new URL(url);
    } catch(e){
        if(onEdit) onEdit(id);
    }   

    return (
        <>
            <li data-testid={"tab-item"} className="bg-gray-100 border h-12 px-2 border-gray-100 hover:border-tbfColor-lightpurple hover:bg-tbfColor-lighterpurple hover:text-tbf-middlegrey2 transition-all ease-in duration-100 tab-item my-1 flex items-center justify-between">
                <a href={url} rel="noreferrer" className="w-full py-3 text-sm flex hover:no-underline items-center truncate px-2 tab-item-info" target="_blank">
                    {address && <img src={`${chrome.runtime.getURL("/_favicon/")}?pageUrl=${address.origin}&size=18`} alt={""} />}
                    <span className="mx-3">{label || url}</span>
                </a>
            
                <div className="tab-item-settings px-2 py-2 flex flex-row">
                    {
                        onEdit && (
                            <button className={`${styles.opacity_hover_effect} m-1`} onClick={() => onEdit(id)}>
                                <PenIcon size={24} fill={"#000"} />
                            </button>
                        )
                    }
                    {onMark && marked !== undefined && <Checkbox checked={marked} onCallback={(e) => onMark(id, e.state)} />}
                    {
                        onClose &&
                        (
                            <button className={`${styles.opacity_hover_effect} my-2`} onClick={() => onClose(id)}>
                                <CloseLightIcon size={20} fill={"#000"} />
                            </button>
                        )
                    }
                </div>
            </li>
        </>
    ); 
}

export default TabItem;