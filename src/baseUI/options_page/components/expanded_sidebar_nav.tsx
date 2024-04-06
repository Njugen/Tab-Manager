import ConfigIcon from "../../../components/icons/config_icon";
import MultipleFoldersIcon from "../../../components/icons/multiple_folders_icon";
import Navlink from "../../../components/utils/navlink";
import iSidebarNav from "../../../interfaces/sidebar_nav";

const ExpandedSidebarNav = (props: iSidebarNav): JSX.Element => {
    const { active, onSetActive } = props;

    return (
      <div id="main-menu" className="px-2 py-4">
          <Navlink key="folders-nav-link" label="Dashboard" url="#main" isActive={active === "main" ? true : false} onClick={() => onSetActive("main")}>
            <MultipleFoldersIcon size={20} fill={active === "main" ? "rgb(109 0 194)" : "#525252"} />
          </Navlink>
          <Navlink key="settings-nav-link" label="Settings" url="#settings" isActive={active === "settings" ? true : false} onClick={() => onSetActive("settings")}>
            <ConfigIcon size={20} fill={active === "settings" ? "rgb(109 0 194)" : "#525252"} />
          </Navlink>
      </div>
    );
  }

  export default ExpandedSidebarNav;