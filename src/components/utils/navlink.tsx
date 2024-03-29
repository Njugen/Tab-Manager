import styles from "./../../styles/global_utils.module.scss";
import { iNavlink } from "../../interfaces/nav_link";
import { Link } from 'react-router-dom';
import MultipleFoldersIcon from "../icons/multiple_folders_icon";
import ConfigIcon from "../icons/config_icon";

/*
  Navigation link, intended to be used in the sidebar
*/

const Navlink = (props: iNavlink): JSX.Element => {
    const { children, label, url, isActive, onClick } = props;
    const { opacity_hover_effect } = styles

    const activeLinkStyle: String = "font-semibold text-tbfColor-lightpurple";
    const inActiveLinkStyle: String = "font-normal text-tbfColor-middlegrey3 hover:border-tbfColor-middlegrey3";
    
    const stateCSS: String = isActive ? activeLinkStyle : inActiveLinkStyle;

    return (
        <Link to={url} className={`text-left xl:p-2 2xl:p-3 flex items-center text-lg ${stateCSS} ${opacity_hover_effect} ${label && "py-2"} border-color border-tbfColor-lgrey block`} onClick={onClick}>
          {children} 
          {label && <span className="ml-3">{label}</span>}
        </Link>
    ); 
}

export default Navlink;