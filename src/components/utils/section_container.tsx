import { useRef, useState } from 'react';
import iSectionContainer from '../../interfaces/section_container';
import GenericButton from './generic_button';
import CloseIcon from '../icons/close_icon';

import FullscreenIcon from './../icons/fullscreen_icon';

/*
    A white wrapper serving as either main section (contents page wrapper), or part section
    of a view.

    Can be expanded into a fullscreen component by setting fullscreen state to true.
*/

const SectionContainer = (props: iSectionContainer): JSX.Element => {
    const [fullscreen, setFullscreen] = useState<boolean>(false);
    const { id, title, options, onExpand, children } = props;
    const sectionRef = useRef<HTMLDivElement>(null);
    
    return (
        <>
            {
            fullscreen ? 
                <div data-testid="section-container-fullscreen">
                    <div ref={sectionRef} id={id} className={`absolute top-0 left-0 transition-all ease-in-out z-[1000] w-full h-auto min-h-full mb-6 pt-10 bg-white shadow`}>
                        <div className="flex justify-between mb-10 pb-8 px-14 border-b border-tbfColor-lgrey">
                            <h1 className="text-4xl text-tbfColor-darkpurple font-light inline-block">
                                {title}
                            </h1>
                            <GenericButton onClick={() => {
                                setFullscreen(false);
                                if(onExpand) onExpand(false);
                            }}>
                                <CloseIcon size={38} fill="rgba(0,0,0,0.2)" />
                            </GenericButton>
              
                        </div>
                        <div className="flex justify-between min-h-[350px]">
                            <div className="w-full mb-6 px-14 pb-4">
                                
                                <div className="flex flex-col 2xl:flex-row justify-end items-center 2xl:items-end mb-8">
                                    
                                    <div className="mt-10 justify 2xl:mt-0">
                                        {options && options()}
                                    </div>
                                </div>
                                {children}
                            </div>
                        </div>
                    </div>
                </div> : 
                <div data-testid="section-container">
                    <div className="text-right">
                        <GenericButton onClick={() => {
                            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                            setFullscreen(true);
                            if(onExpand) onExpand(true);
                        }}>
                            <FullscreenIcon size={16} fill="rgba(0,0,0,0.4)" />
                        </GenericButton>
                    </div>
                    <div ref={sectionRef} id={id} className={`mb-12 pt-10 bg-white shadow`}>
                        <div className="flex justify-between min-h-[350px]">
                            <div className="w-full mb-6 px-14 pb-4">
                                <div className="flex flex-col 2xl:flex-row justify-between items-center 2xl:items-end mb-8">
                                    <h1 className="text-4xl text-tbfColor-darkpurple font-light inline-block">
                                        {title}
                                    </h1>
                                    <div className="mt-10 justify 2xl:mt-0">
                                        {options && options()}
                                    </div>
                                </div>
                                {children}
                            </div>
                        </div>
                    </div>
                    
                </div>
            }
        </>
    )
}


export default SectionContainer;