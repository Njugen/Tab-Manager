import PrimaryButton from '../utils/primary_button/primary_button';
import Dropdown from "../utils/dropdown/dropdown";
import iAddToFolderPopup from '../../interfaces/add_to_workspace_popup';
import GenericPopup from '../utils/generic_popup';
import { iDropdownSelected } from '../../interfaces/dropdown';
import { useEffect, useState } from 'react';

/*
    Popup where the user may choose where to add
    selected tabs (either to a new or existing folder)
*/

const AddToFolderPopup = (props: iAddToFolderPopup): JSX.Element => {
    const [show, setShow] = useState<boolean>(false);
    const { type, title } = props;

    useEffect(() => {
        setShow(true)
    }, [])

    const { 
        dropdownOptions, 
        onNewWorkspace, 
        onExistingWorkspace, 
        onCancel,
    } = props;


    const handleToNewWorkspace = (): void => {
        onCancel();
        onNewWorkspace();
    }

    const handleAddToExistingWorkspace = (folder: iDropdownSelected): void => {
        onCancel();
        setShow(false);
        onExistingWorkspace(folder);
    }

    const closeButtonSpecs: any = {
        label: "Close",
        handler: onCancel
    }

    return (
        <GenericPopup title={title} type={type} show={show} cancel={closeButtonSpecs}>
            <div className="flex flex-col items-center pb-6 max-sm:h-screen">
                {
                    dropdownOptions.length > 1 && (
                        <div className="mt-10 text-center w-[350px] px-8">
                            <p className="text-lg text-black inline-block mb-4 font-semibold">
                                To an existing folder
                            </p>
                            <Dropdown 
                                tag="select-folder-dropdown" 
                                preset={dropdownOptions[0]} 
                                options={dropdownOptions} 
                                onCallback={handleAddToExistingWorkspace} 
                            />
                        </div>
                    )
                }
                <div className="mt-5 text-center flex flex-col">
                    {
                        dropdownOptions.length > 1 && 
                        <p className="text-lg text-black block font-semibold">
                            Or
                        </p>
                    }
                    <div className="mb-6 mt-6">
                        <PrimaryButton disabled={false} text="To a new folder" onClick={handleToNewWorkspace} />
                    </div>
                </div>
            </div>
        </GenericPopup>
    );
}

export default AddToFolderPopup;