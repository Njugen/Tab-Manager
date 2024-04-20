import './App.css';
import "./styles/global_utils.module.scss";
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import OptionsPage from './baseUI/options_page/options_page';
import SidePanel from './baseUI/sidepanel/sidepanel';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './redux-toolkit/store';
import CircleButton from './components/utils/circle_button';
import CollapseIcon from './components/icons/collapse_icon';

/*
  This file acts as the very foundation of this plugin's UI. This file
  connects a collapsable sidebar, a search bar and a page content section into one single unity,
  making it possible to retain all the basic UI elements while changing pages.

  This file also controls the navigation routes using React-Dom.
*/
function App() {
  const [showScrollUpButton, setShowScrollUpButton] = useState<boolean>(false);

  const appRef = useRef<HTMLDivElement>(null);
  const miscState = useSelector((state: RootState) => state.misc)

  const handleSetShowScrollUpButton = (e: any): void => {
    if(appRef.current && appRef.current.scrollTop > 0){
      setShowScrollUpButton(true);
    } else if(showScrollUpButton === true){
      setShowScrollUpButton(false);
    } 
  }

  const scrollTop = () => {
    if(appRef.current){
      appRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" })
    }
  }

  useEffect(() => {
    if(appRef.current){
      
     
      appRef.current.addEventListener("scroll", handleSetShowScrollUpButton);
    }

    return () => {
      if(appRef.current) appRef.current.removeEventListener("scroll", handleSetShowScrollUpButton);
    }
  }, [appRef.current])

  useEffect(() => {
    window.addEventListener("hashchange", scrollTop);

    return () => {
      window.removeEventListener("hashchange", scrollTop);
    }
  }, [])

  useEffect(() => {
    if(appRef.current) appRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  }, [miscState.scrollTrigger])

  const router = createBrowserRouter([
    {
      path: "/options.html",
      element: <OptionsPage />
    },
    {
      path: "/sidepanel.html",
      element: <SidePanel />
    },
  ]);
  

  return (
    <>
      <CircleButton disabled={false} bgCSSClass={`${showScrollUpButton === true ? "block" : "hidden"} transition-all bg-tbfColor-lightpurple shadow-xl fixed ${window.location.pathname.includes("sidepanel.html") ? "bottom-24" : "bottom-8"} right-8 z-[10000]`} onClick={scrollTop}>
          <CollapseIcon size={32} fill="#fff" />  
      </CircleButton>
      <div ref={appRef} className="App overflow-y-auto h-screen">
          <div id="root" className={`w-full pb`}>
            
            <RouterProvider router={router} />
        </div>
      </div>
    </>
  );
}

export default App;
