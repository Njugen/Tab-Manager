import ConfigIcon from "../../../components/icons/config_icon";
import MultipleFoldersIcon from "../../../components/icons/multiple_folders_icon";
import Navlink from "../../../components/utils/navlink";
import iSidebarNav from "../../../interfaces/sidebar_nav";

const CollapsedSidebarNav = (props: iSidebarNav): JSX.Element => {
	const { active, onSetActive } = props;

	return (
		<div id="main-menu" className="flex flex-col items-center justify-center">
			<div className="">
				<div
					className={`my-2 border rounded-lg ${active === "main" ? "border-tbfColor-lightpurple" : "border-tbfColor-middlegrey2"}`}
				>
					<Navlink
						key="folders-nav-link"
						url="#main"
						isActive={active === "main" ? true : false}
						onClick={() => onSetActive("main")}
					>
						<MultipleFoldersIcon
							size={32}
							fill={active === "main" ? "rgb(109 0 194)" : "#525252"}
						/>
					</Navlink>
				</div>
				<div
					className={`my-2 border rounded-lg ${active === "settings" ? "border-tbfColor-lightpurple" : "border-tbfColor-middlegrey2"}`}
				>
					<Navlink
						key="settings-nav-link"
						url="#settings"
						isActive={active === "settings" ? true : false}
						onClick={() => onSetActive("settings")}
					>
						<ConfigIcon
							size={32}
							fill={active === "settings" ? "rgb(109 0 194)" : "#525252"}
						/>
					</Navlink>
				</div>
			</div>
		</div>
	);
};

export default CollapsedSidebarNav;
