import styles from "./../../styles/global_utils.module.scss";
import { iNavlink } from "../../interfaces/nav_link";
import { Link } from 'react-router-dom';
import MultipleFoldersIcon from "../icons/multiple_folders_icon";
import ConfigIcon from "../icons/config_icon";
import iTabGroup from "../../interfaces/tab_group";

/*
  Navigation link, intended to be used in the sidebar
*/

const TabGroup = (props: iTabGroup): JSX.Element => {
    const { desc, children } = props;

    return (
        <div className="py-3">
            <p className="text-xs text-right font-semibold">
                {desc}
            </p>
            {children}
        </div>
    ); 
}

export default TabGroup;