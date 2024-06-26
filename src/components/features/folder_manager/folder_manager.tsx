import { useState, useEffect, useRef } from "react";
import FormField from "../../utils/form_field";
import * as predef from "../../../styles/predef";
import { iFolderManager } from "../../../interfaces/iFolderManager";

import randomNumber from "../../../tools/random_number";
import { iFolderItem } from "../../../interfaces/folder_item";
import PopupMessage from "../../utils/popup_message";
import WindowManager from "../window_manager/window_manager";
import GenericPopup from "../../utils/generic_popup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux-toolkit/store";
import iPluginSettings from "../../../interfaces/states/plugin_settings_state";
import { setUpFolder, updateFolder } from "../../../redux-toolkit/slices/folder_management_slice";
import { changeShowFolderChangeWarning } from "../../../redux-toolkit/slices/plugin_settings_slice";
import { setIsEditingTab } from "../../../redux-toolkit/slices/misc_slice";
import { createNewFolder, saveFolder } from "../../../redux-toolkit/slices/folder_slice";
import purify from "../../../tools/purify_object";
import { setPanelView } from "../../../redux-toolkit/slices/sidepanel_slice";
/*
    A popup providing oversight of a folder's settings and available windows/tabs.
    The settings may be changed by the user, which then gets saved to redux storage

    Warning messages may be added using the <PopupMessage/> component. New fields can be added
    preferably by using the <FormField /> component. See examples in the return statement
*/

const FolderManager = (props: iFolderManager): JSX.Element => {
	const { onClose, type, folder, title } = props;
	const [show, setShow] = useState<boolean>(false);
	const [isCreate, setIsCreate] = useState<boolean>(false);
	const [modified, setModified] = useState<boolean>(false);
	const [originWindows, setOriginWindows] = useState<string>("");
	const [inValidFields, setInValidFields] = useState<{
		name: boolean;
		windows: boolean;
	}>({
		name: false,
		windows: false
	});

	const managerWrapperRef = useRef<any>(null);

	const dispatch = useDispatch();

	// Read necessary data from redux. These data are are used in this component
	// for various tasks. Values may be dispatched back to these redux states for use in other multilevel components
	const miscState: any = useSelector((state: RootState) => state.misc);
	const folderState: Array<iFolderItem> = useSelector((state: RootState) => state.folder);
	const pluginSettingsState: iPluginSettings = useSelector(
		(state: RootState) => state.pluginSettings
	);
	const folderManagementState: any = useSelector((state: RootState) => state.folderManagement);
	const sidepanelState = useSelector((state: any) => state.sidepanel);

	useEffect(() => {
		// Information about the folder. If undefined, there are no preset information
		let folderSpecs: iFolderItem | undefined = folder;

		// Apply slide down effect once this popup is launched
		setShow(true);

		// folderSpecs is undefined, this means this popup is used for creating a new folder.
		// Otherwise, a folder is being edited.
		if (!folderSpecs) {
			const randId = randomNumber();
			folderSpecs = {
				id: randId,
				name: "",
				desc: "",
				display: "expanded",
				viewMode: "grid",
				marked: false,
				windows: []
			};
			setIsCreate(true);
		}

		// Track the preset windows of this payload. Used to track new/removed windows
		const windowsString = JSON.stringify(folderSpecs.windows);
		setOriginWindows(windowsString);

		// Tell redux this popup is active and a create/edit process is ongoing.
		dispatch(setUpFolder(folderSpecs));
	}, []);

	const windowListChanged = (origin: string, modified: string): boolean => {
		const presetWindows: string = origin;
		const modifiedWindows: string = modified;

		if (!modifiedWindows || !presetWindows) return false;
		if (origin !== modifiedWindows) {
			return true;
		}

		return false;
	};

	useEffect(() => {
		const inEditWindows: string = purify(folderManagementState)?.windows;
		const listChanged: boolean = windowListChanged(originWindows, inEditWindows);

		if (listChanged) {
			setModified(true);
		}
	}, [folderManagementState]);

	// Handle changes to a field
	// - key: a string to identify the changed field
	// - value: the new value of this field
	const handleChangeField = (key: string, value: string): void => {
		if (!folderManagementState) {
			return;
		} else if (!modified && folderManagementState[key] !== value) {
			setModified(true);
		}

		// Inform redux about the field change regardless of whether or not local state has been modified or not
		if (folderManagementState[key] !== value) dispatch(updateFolder([key, value]));
	};

	// Read the updated form changes from redux, and determine
	// whether or not they are valid. If not, mark the affected fields
	// as invalid. Otherwise, send a callback to proceed.
	const validateForm = (callback: () => void): void => {
		const data = folderManagementState;

		const updatedFieldState = {
			name: false,
			windows: false
		};

		if (data.name.length === 0) {
			updatedFieldState.name = true;
		}

		if ((data.windows && data.windows.length === 0) || miscState.toBeingEdited > 0) {
			updatedFieldState.windows = true;
		}

		if (!updatedFieldState.name && !updatedFieldState.windows) {
			callback();
		} else {
			setInValidFields({ ...updatedFieldState });

			if (managerWrapperRef.current && managerWrapperRef.current.scrollTo) {
				managerWrapperRef.current.scrollTo({
					top: 0,
					behavior: "smooth"
				});
			}
		}
	};

	// Perform tasks and close this form popup
	const handleClose = (skipWarning?: boolean): void => {
		chrome.storage.local.get("showFolderChangeWarning", (data) => {
			if (modified && !skipWarning && data.showFolderChangeWarning === true) {
				// Show a warning when a form has been modified AND when settings explicitly permits it.
				dispatch(changeShowFolderChangeWarning(true));
			} else {
				// Perform tasks and close the popup form.
				setShow(false);
				dispatch(changeShowFolderChangeWarning(false));
				setModified(false);
				setOriginWindows("");
				setIsCreate(false);

				document.body.style.overflow = "auto";

				dispatch(setIsEditingTab(false));
				onClose();
			}
		});
	};

	// Validate and save the data to redux, then close the popup form.
	const handleSave = (): void => {
		document.body.style.overflow = "hidden";
		validateForm(() => {
			if (props.folder) {
				// Find out if process is merge or edit
				const targetIndex = folderState.findIndex(
					(target: any) => target.id === props.folder?.id
				);

				if (targetIndex === -1) {
					dispatch(createNewFolder(folderManagementState));
				} else {
					dispatch(saveFolder(folderManagementState));
				}
			} else {
				dispatch(createNewFolder(folderManagementState));
			}

			if (sidepanelState.isEditFolderInPanel) {
				dispatch(setPanelView("folders"));
			} else {
				window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
			}

			handleClose(true);
		});
	};

	// Close error/warning messages, but remain in the popup
	const handleKeepEditing = (): void => {
		document.body.style.overflow = "hidden";
		dispatch(changeShowFolderChangeWarning(false));
	};

	const cancelButtonSpecs: any = {
		label: "Cancel",
		handler: handleClose
	};

	const saveButtonSpecs: any = {
		label: isCreate ? "Create" : "Save",
		handler: handleSave
	};

	return (
		<>
			{modified && pluginSettingsState?.showFolderChangeWarning && (
				<PopupMessage
					title="Warning"
					text="You have made changes to this form. Closing it will result in all changes being lost. Do you want to proceed?"
					primaryButton={{
						text: "Yes, close this form",
						callback: () => handleClose(true)
					}}
					secondaryButton={{
						text: "No, keep editing",
						callback: () => handleKeepEditing()
					}}
				/>
			)}

			<GenericPopup
				ref={managerWrapperRef}
				title={title}
				type={type}
				show={show}
				cancel={cancelButtonSpecs}
				save={saveButtonSpecs}
			>
				<FormField
					label="Name *"
					error={inValidFields.name}
					description="Give a name to this folder. A sensible name may help your workflow when relevant tabs are needed."
				>
					<input
						data-testid="name-field"
						id="name-field"
						type="text"
						defaultValue={folder?.name}
						className={predef.textfield_full}
						onBlur={(e: any) => handleChangeField("name", e.target.value)}
					/>
				</FormField>
				<FormField label="Description" description="Describe the purpose of this folder.">
					<textarea
						data-testid="desc-field"
						id="desc-field"
						defaultValue={folder?.desc}
						className={predef.textarea_full}
						onBlur={(e: any) => handleChangeField("desc", e.target.value)}
					></textarea>
				</FormField>
				<div className={`py-6 flex flex-row items-center`}>
					<div className="w-full">
						<h4
							className={`font-semibold text-lg mb-1 ${inValidFields.windows && "text-red-500"}`}
						>
							Windows and tabs *
						</h4>
						<p
							className={`text-sm leading-6 text-tbfColor-darkergrey text-start ${inValidFields.windows && "text-red-500"}`}
						>
							You may add as windows and tabs to this folder as you like to this
							folder, although a maximum of 25-30 tabs is recommended.
						</p>
						<WindowManager />
					</div>
				</div>
			</GenericPopup>
		</>
	);
};

export default FolderManager;
