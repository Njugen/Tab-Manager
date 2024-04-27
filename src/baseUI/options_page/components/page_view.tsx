import DashboardView from "../../../views/dashboard/dashboard_view";
import SettingsView from "../../../views/settings/settings_view";
import iPageView from "../../../interfaces/page_view";
import { useEffect } from "react";

const PageView = (props: iPageView): JSX.Element => {
    const { view } = props;
    let result: JSX.Element = <></>;

    useEffect(() => {
      window.scrollTo({ 
        top: 0, 
        left: 0, 
        behavior: "smooth" 
      })
    }, [view])

    if(view === "main"){
      result = <DashboardView />;
    } else if(view ==="settings") {
      result = <SettingsView />;
    }

    return result;
}

export default PageView;