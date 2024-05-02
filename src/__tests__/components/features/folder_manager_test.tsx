import { render, screen, within, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import randomNumber from "../../../tools/random_number";
import { iFolderManager } from "../../../interfaces/iFolderManager";
import { store } from "../../../redux-toolkit/store";
import { Provider } from "react-redux";
import FolderManager from "../../../components/features/folder_manager/folder_manager";
import { act } from "react-dom/test-utils";
import React from "react";
import { iWindowItem } from "../../../interfaces/window_item";
import { iFolderItem } from "../../../interfaces/folder_item";

const mockFn = jest.fn();

const mockProps: iFolderManager = {
	title: randomNumber().toString(),
	type: "slide-in",
	onClose: mockFn
};

window.scrollTo = jest.fn();

beforeEach(() => {
	// Mock the managerwrapperref
	jest.spyOn(React, "useRef").mockReturnValue({
		current: {
			scrollTo: (a: any) => {}
		}
	});
	jest.useFakeTimers();
});

afterEach(() => {
	jest.clearAllMocks();
	jest.useRealTimers();
	cleanup();
});

describe("Test <FolderManager>", () => {
	const commonRender = () => {
		render(
			<Provider store={store}>
				<FolderManager {...mockProps} />
			</Provider>
		);
	};

	describe("Start with empty plate (e.g. add new folder)", () => {
		test("There are no warning messages when launching an empty plate", () => {
			// Mock the chrome storage getter

			// @ts-expect-error
			chrome.storage.local.get = jest.fn(
				(
					keys: string | string[] | { [key: string]: any } | null,
					callback: (items: { [key: string]: any }) => void
				): void => {
					callback({ showFolderChangeWarning: false });
				}
			);

			commonRender();

			const warningMessage = screen.queryByRole("alert");
			expect(warningMessage).not.toBeInTheDocument();
		});

		test("All text fields are empty", () => {
			// Mock the chrome storage getter

			// @ts-expect-error
			chrome.storage.local.get = jest.fn(
				(
					keys: string | string[] | { [key: string]: any } | null,
					callback: (items: { [key: string]: any }) => void
				): void => {
					callback({ showFolderChangeWarning: false });
				}
			);

			commonRender();

			let managerPopup = screen.getByRole("dialog");
			const fields = within(managerPopup).getAllByRole("textbox");
			fields.forEach((field) => {
				expect(field).toHaveDisplayValue("");
			});
		});

		test("There are no windows listed", () => {
			// Mock the chrome storage getter

			// @ts-expect-error
			chrome.storage.local.get = jest.fn(
				(
					keys: string | string[] | { [key: string]: any } | null,
					callback: (items: { [key: string]: any }) => void
				): void => {
					callback({ showFolderChangeWarning: false });
				}
			);

			commonRender();

			let managerPopup = screen.getByRole("dialog");
			const windows = within(managerPopup).queryAllByTestId("window-item");
			expect(windows.length).toEqual(0);
		});

		test("Attempt at saving empty form results won't trigger 'onClose' callback", () => {
			// Mock the chrome storage getter

			// @ts-expect-error
			chrome.storage.local.get = jest.fn(
				(
					keys: string | string[] | { [key: string]: any } | null,
					callback: (items: { [key: string]: any }) => void
				): void => {
					callback({ showFolderChangeWarning: false });
				}
			);

			commonRender();

			let managerPopup = screen.getByRole("dialog");

			// Try save it. The onClose callback won't be called
			const saveButton = within(managerPopup).getByText("Create", {
				selector: "button"
			});
			fireEvent.click(saveButton, { bubbles: true });
			expect(mockProps.onClose).not.toHaveBeenCalled();
		});

		test("Clicking the cancel button will trigger 'onClose' callback", () => {
			// Mock the chrome storage getter

			// @ts-expect-error
			chrome.storage.local.get = jest.fn(
				(
					keys: string | string[] | { [key: string]: any } | null,
					callback: (items: { [key: string]: any }) => void
				): void => {
					callback({ showFolderChangeWarning: false });
				}
			);

			commonRender();

			let managerPopup = screen.getByRole("dialog");

			// Cancelling closes the popup
			const cancelButton = within(managerPopup).getByText("Cancel", {
				selector: "button"
			});
			fireEvent.click(cancelButton, { bubbles: true });

			act(() => {
				jest.runAllTimers();
			});

			expect(mockProps.onClose).toHaveBeenCalled();
		});

		test("Clicking the X button will trigger 'onClose' callback", () => {
			// Mock the chrome storage getter

			// @ts-expect-error
			chrome.storage.local.get = jest.fn(
				(
					keys: string | string[] | { [key: string]: any } | null,
					callback: (items: { [key: string]: any }) => void
				): void => {
					callback({ showFolderChangeWarning: false });
				}
			);

			commonRender();

			let managerPopup = screen.getByRole("dialog");

			// Cancelling closes the popup
			const xButton = within(managerPopup).getByTestId("close-icon");
			fireEvent.click(xButton, { bubbles: true });

			act(() => {
				jest.runAllTimers();
			});

			expect(mockProps.onClose).toHaveBeenCalled();
		});

		test("No warning message when launching the folder manager", () => {
			// Mock the chrome storage getter

			// @ts-expect-error
			chrome.storage.local.get = jest.fn(
				(
					keys: string | string[] | { [key: string]: any } | null,
					callback: (items: { [key: string]: any }) => void
				): void => {
					callback({ showFolderChangeWarning: false });
				}
			);

			commonRender();

			let alert = screen.queryByRole("alert");
			expect(alert).not.toBeInTheDocument();
		});

		test("No warning message when launching the folder manager (even when cancellation warning is turned on)", () => {
			// Mock the chrome storage getter

			// @ts-expect-error
			chrome.storage.local.get = jest.fn(
				(
					keys: string | string[] | { [key: string]: any } | null,
					callback: (items: { [key: string]: any }) => void
				): void => {
					callback({ showFolderChangeWarning: true });
				}
			);

			commonRender();

			let alert = screen.queryByRole("alert");
			expect(alert).not.toBeInTheDocument();
		});
	});

	describe("Test user interaction with the form", () => {
		test("Clicking Create/Save won't trigger 'onClose' prop when only namefield has been changed", () => {
			// Mock the chrome storage getter

			// @ts-expect-error
			chrome.storage.local.get = jest.fn(
				(
					keys: string | string[] | { [key: string]: any } | null,
					callback: (items: { [key: string]: any }) => void
				): void => {
					callback({ showFolderChangeWarning: false });
				}
			);

			commonRender();

			let managerPopup = screen.getByRole("dialog");

			// Change the name field value
			const nameField = within(managerPopup).getByTestId("name-field");
			fireEvent.focus(nameField);
			fireEvent.change(nameField, {
				target: { value: randomNumber().toString() }
			});
			fireEvent.blur(nameField);

			const saveButton = within(managerPopup).getByText("Create", {
				selector: "button"
			});
			fireEvent.click(saveButton, { bubbles: true });

			act(() => {
				jest.runAllTimers();
			});

			expect(mockProps.onClose).not.toHaveBeenCalled();
		});

		test("Clicking Create/Save won't trigger 'onClose' when only description field has been changed", () => {
			// Mock the chrome storage getter

			// @ts-expect-error
			chrome.storage.local.get = jest.fn(
				(
					keys: string | string[] | { [key: string]: any } | null,
					callback: (items: { [key: string]: any }) => void
				): void => {
					callback({ showFolderChangeWarning: false });
				}
			);

			commonRender();

			let managerPopup = screen.getByRole("dialog");

			// Change the name field value
			const descField = within(managerPopup).getByTestId("desc-field");
			fireEvent.focus(descField);
			fireEvent.change(descField, {
				target: { value: randomNumber().toString() }
			});
			fireEvent.blur(descField);

			const saveButton = within(managerPopup).getByText("Create", {
				selector: "button"
			});
			fireEvent.click(saveButton, { bubbles: true });

			act(() => {
				jest.runAllTimers();
			});

			expect(mockProps.onClose).not.toHaveBeenCalled();
		});

		test("Blurring any textfield without making changes won't trigger warning messages", () => {
			// Mock the chrome storage getter

			// @ts-expect-error
			chrome.storage.local.get = jest.fn(
				(
					keys: string | string[] | { [key: string]: any } | null,
					callback: (items: { [key: string]: any }) => void
				): void => {
					callback({ showFolderChangeWarning: false });
				}
			);

			commonRender();

			let managerPopup = screen.getByRole("dialog");

			// Change the name field value
			const textfields = within(managerPopup).getAllByRole("textbox");
			textfields.forEach((field) => {
				fireEvent.click(field);
				fireEvent.blur(field);

				const warningMessage = screen.queryByRole("alert");
				expect(warningMessage).not.toBeInTheDocument();
			});
		});

		test("Cancelling/closing after blurring any textfield won't trigger warning message (without writing anything)", () => {
			// Mock the chrome storage getter

			// @ts-expect-error
			chrome.storage.local.get = jest.fn(
				(
					keys: string | string[] | { [key: string]: any } | null,
					callback: (items: { [key: string]: any }) => void
				): void => {
					callback({ showFolderChangeWarning: false });
				}
			);

			commonRender();

			let managerPopup = screen.getByRole("dialog");

			// Change the name field value
			const textfields = within(managerPopup).getAllByRole("textbox");
			textfields.forEach((field) => {
				fireEvent.click(field);
				fireEvent.blur(field);
			});

			const xButton = within(managerPopup).getByTestId("close-icon");
			fireEvent.click(xButton, { bubbles: true });

			const warningMessage = screen.queryByTestId("alert");
			expect(warningMessage).not.toBeInTheDocument();
		});

		test("Clicking Create/Save won't trigger 'onClose' when only window list has been changed", () => {
			// Mock the chrome storage getter

			// @ts-expect-error
			chrome.storage.local.get = jest.fn(
				(
					keys: string | string[] | { [key: string]: any } | null,
					callback: (items: { [key: string]: any }) => void
				): void => {
					callback({ showFolderChangeWarning: false });
				}
			);

			commonRender();

			let managerPopup = screen.getByRole("dialog");

			// Add a few new windows (and one tab in each)
			for (let i = 0; i < 5; i++) {
				const newWindowButton = within(managerPopup).getByText("New window", {
					selector: "button"
				});
				fireEvent.click(newWindowButton);
				const window = within(managerPopup).getAllByTestId("window-item");
				const editableTabField = within(window[i]).getByTestId("editable-tab");
				fireEvent.focus(editableTabField);
				fireEvent.change(editableTabField, {
					target: {
						value: `https://${randomNumber().toString()}.com`
					}
				});
				fireEvent.blur(editableTabField);
			}

			// Try save it. It should pass
			const saveButton = within(managerPopup).getByText("Create", {
				selector: "button"
			});
			fireEvent.click(saveButton, { bubbles: true });

			act(() => {
				jest.runAllTimers();
			});

			expect(mockProps.onClose).not.toHaveBeenCalled();
		});

		test("Clicking Create/Save will triger 'onClose' prop when window list and name fields have values", () => {
			// @ts-expect-error
			chrome.storage.local.get = jest.fn(
				(
					keys: string | string[] | { [key: string]: any } | null,
					callback: (items: { [key: string]: any }) => void
				): void => {
					callback({ showFolderChangeWarning: false });
				}
			);

			commonRender();

			let managerPopup = screen.getByRole("dialog");

			const nameField = within(managerPopup).getByTestId("name-field");
			fireEvent.focus(nameField);
			fireEvent.change(nameField, {
				target: { value: randomNumber().toString() }
			});
			fireEvent.blur(nameField);

			// Add a few new windows (and one tab in each)
			for (let i = 0; i < 5; i++) {
				const newWindowButton = within(managerPopup).getByText("New window", {
					selector: "button"
				});
				fireEvent.click(newWindowButton);
				const window = within(managerPopup).getAllByTestId("window-item");
				const editableTabField = within(window[i]).getByTestId("editable-tab");
				fireEvent.focus(editableTabField);
				fireEvent.change(editableTabField, {
					target: {
						value: `https://${randomNumber().toString()}.com`
					}
				});
				fireEvent.blur(editableTabField);
			}

			// Try save it. It should pass
			const saveButton = within(managerPopup).getByText("Create", {
				selector: "button"
			});
			fireEvent.click(saveButton, { bubbles: true });

			act(() => {
				jest.runAllTimers();
			});

			expect(mockProps.onClose).toHaveBeenCalled();
		});

		describe("Test cancellation warning popup", () => {
			test.each([
				["name", "name-field"],
				["description", "desc-field"]
			])(
				"Attempt at cancelling when %j field has changed will trigger a warning if set in plugin settings",
				(label, testId) => {
					// @ts-expect-error
					chrome.storage.local.get = jest.fn(
						(
							keys: string | string[] | { [key: string]: any } | null,
							callback: (items: { [key: string]: any }) => void
						): void => {
							callback({ showFolderChangeWarning: true });
						}
					);

					commonRender();

					let managerPopup = screen.getByRole("dialog");

					// Change the description field value
					const desc = within(managerPopup).getByTestId(testId);
					fireEvent.focus(desc);
					fireEvent.change(desc, {
						target: { value: randomNumber().toString() }
					});
					fireEvent.blur(desc);

					// Try save it. It should pass
					const cancelButton = within(managerPopup).getByText("Cancel", {
						selector: "button"
					});
					fireEvent.click(cancelButton, { bubbles: true });

					// Get the popup
					let warningMessage = screen.getByRole("alert");
					expect(warningMessage).toBeInTheDocument();

					const keepEditingButton = within(warningMessage).getByText("No, keep editing", {
						selector: "button"
					});
					fireEvent.click(keepEditingButton);

					// Trigger popup again and hit close
					fireEvent.click(cancelButton, { bubbles: true });

					warningMessage = screen.getByRole("alert");
					expect(warningMessage).toBeInTheDocument();

					const closeButton = within(warningMessage).getByText("Yes, close this form", {
						selector: "button"
					});
					fireEvent.click(closeButton);

					act(() => {
						jest.runAllTimers();
					});

					expect(mockProps.onClose).toHaveBeenCalled();
				}
			);

			test("Attempt at cancelling once a window/tab has been added will trigger a warning if set in plugin settings", () => {
				// Mock the chrome storage getter

				// @ts-expect-error
				chrome.storage.local.get = jest.fn(
					(
						keys: string | string[] | { [key: string]: any } | null,
						callback: (items: { [key: string]: any }) => void
					): void => {
						callback({ showFolderChangeWarning: true });
					}
				);

				commonRender();

				let managerPopup = screen.getByRole("dialog");

				// Add a window
				const newWindowButton = within(managerPopup).getByText("New window", {
					selector: "button"
				});
				fireEvent.click(newWindowButton);
				const window = within(managerPopup).getByTestId("window-item");
				const editableTabField = within(window).getByTestId("editable-tab");
				fireEvent.focus(editableTabField);
				fireEvent.change(editableTabField, {
					target: {
						value: `https://${randomNumber().toString()}.com`
					}
				});
				fireEvent.blur(editableTabField);

				// Try save it. It should pass
				const cancelButton = within(managerPopup).getByText("Cancel", {
					selector: "button"
				});
				fireEvent.click(cancelButton, { bubbles: true });

				// Get the popup
				let warningMessage = screen.getByRole("alert");
				expect(warningMessage).toBeInTheDocument();

				const keepEditingButton = within(warningMessage).getByText("No, keep editing", {
					selector: "button"
				});
				fireEvent.click(keepEditingButton);

				// Trigger popup again and hit close
				fireEvent.click(cancelButton, { bubbles: true });

				warningMessage = screen.getByRole("alert");
				expect(warningMessage).toBeInTheDocument();

				const closeButton = within(warningMessage).getByText("Yes, close this form", {
					selector: "button"
				});
				fireEvent.click(closeButton);

				act(() => {
					jest.runAllTimers();
				});

				expect(mockProps.onClose).toHaveBeenCalled();
			});
		});
	});
});

describe("Edit folder: Test <FolderManager> with prefilled values", () => {
	const totalWindowsCount = 20;
	const totalTabsInWindowCount = 15;

	const mockFolder: iFolderItem = {
		id: randomNumber(),
		name: randomNumber().toString(),
		desc: randomNumber().toString(),
		marked: false,
		display: "collapsed",
		viewMode: "list",
		windows: []
	};

	for (let winCount = 0; winCount < totalWindowsCount; winCount++) {
		let window: iWindowItem = {
			id: randomNumber(),
			tabs: [],
			disableEditTab: false,
			disableDeleteTab: false
		};

		for (let tabCount = 0; tabCount < totalTabsInWindowCount; tabCount++) {
			window.tabs.push({
				id: randomNumber(),
				label: randomNumber().toString(),
				url: `http://${randomNumber()}.com`
			});
		}
		mockFolder.windows.push(window);
	}

	const mockPresetProps = {
		...mockProps,
		folder: mockFolder
	};

	const commonRender = () => {
		render(
			<Provider store={store}>
				<FolderManager {...mockPresetProps} />
			</Provider>
		);
	};

	describe("Test prefilled fields (props data)", () => {
		test("There are no warning messages when launching prefilled plate", () => {
			// Mock the chrome storage getter

			// @ts-expect-error
			chrome.storage.local.get = jest.fn(
				(
					keys: string | string[] | { [key: string]: any } | null,
					callback: (items: { [key: string]: any }) => void
				): void => {
					callback({ showFolderChangeWarning: false });
				}
			);

			commonRender();

			const warningMessage = screen.queryByRole("alert");
			expect(warningMessage).not.toBeInTheDocument();
		});

		test("Blurring any preset textfield without making changes won't trigger warning messages", () => {
			// Mock the chrome storage getter

			// @ts-expect-error
			chrome.storage.local.get = jest.fn(
				(
					keys: string | string[] | { [key: string]: any } | null,
					callback: (items: { [key: string]: any }) => void
				): void => {
					callback({ showFolderChangeWarning: false });
				}
			);

			commonRender();

			let managerPopup = screen.getByRole("dialog");

			// Change the name field value
			const textfields = within(managerPopup).getAllByRole("textbox");
			textfields.forEach((field) => {
				fireEvent.click(field);
				fireEvent.blur(field);

				const warningMessage = screen.queryByRole("alert");
				expect(warningMessage).not.toBeInTheDocument();
			});
		});

		test(`There are ${totalWindowsCount} windows in total`, () => {
			// @ts-expect-error
			chrome.storage.local.get = jest.fn(
				(
					keys: string | string[] | { [key: string]: any } | null,
					callback: (items: { [key: string]: any }) => void
				): void => {
					callback({ showFolderChangeWarning: false });
				}
			);

			commonRender();

			const tabItems = screen.queryAllByTestId("window-item");
			expect(tabItems.length).toEqual(totalWindowsCount);
		});

		test(`There are ${totalTabsInWindowCount} tabs in each window`, () => {
			// @ts-expect-error
			chrome.storage.local.get = jest.fn(
				(
					keys: string | string[] | { [key: string]: any } | null,
					callback: (items: { [key: string]: any }) => void
				): void => {
					callback({ showFolderChangeWarning: false });
				}
			);

			commonRender();

			const windows = screen.queryAllByTestId("window-item");

			windows.forEach((window) => {
				const tabs = within(window).queryAllByTestId("tab-item");
				expect(tabs.length).toEqual(totalTabsInWindowCount);
			});
		});

		test(`There are ${totalTabsInWindowCount * totalWindowsCount} tabs in total`, () => {
			// @ts-expect-error
			chrome.storage.local.get = jest.fn(
				(
					keys: string | string[] | { [key: string]: any } | null,
					callback: (items: { [key: string]: any }) => void
				): void => {
					callback({ showFolderChangeWarning: false });
				}
			);

			commonRender();

			const tabs = screen.getAllByTestId("tab-item");
			expect(tabs.length).toEqual(totalTabsInWindowCount * totalWindowsCount);
		});

		test(`Clicking delete tabs button will delete the marked tabs from the manager`, () => {
			// @ts-expect-error
			chrome.storage.local.get = jest.fn(
				(
					keys: string | string[] | { [key: string]: any } | null,
					callback: (items: { [key: string]: any }) => void
				): void => {
					callback({ showFolderChangeWarning: false });
				}
			);

			commonRender();

			// Get a random window id
			const randomWindowIndex: number = Math.floor(Math.random() * totalWindowsCount);

			// Get the window element
			let windowItems = screen.getAllByTestId("window-item");
			let targetWindow = windowItems[randomWindowIndex];
			let tabItems = within(targetWindow).getAllByTestId("tab-item");

			// Get 4 random tab id
			let randomTabs: Array<HTMLElement> = [];
			let lastSelectedId = -1;

			for (let i = 0; i < 4; i++) {
				const randomTabIndex = Math.floor(Math.random() * totalTabsInWindowCount);
				const target = tabItems.splice(randomTabIndex, 1);
				randomTabs = randomTabs.concat(target);
			}

			// Loop through these 4 tabs and mark them
			randomTabs.forEach((tab) => {
				const checkbox = within(tab).getByTestId("checkbox");
				fireEvent.click(checkbox);
			});

			const deleteButton = screen.getByText("Delete tabs", {
				selector: "button"
			});
			fireEvent.click(deleteButton);

			windowItems = screen.getAllByTestId("window-item");
			targetWindow = windowItems[randomWindowIndex];

			// Loop through the same tabs and make sure they are not in the manager anymore
			randomTabs.forEach((tab) => {
				expect(tab).not.toBeInTheDocument();
			});
		});

		describe("Test cancellation warning popup", () => {
			test(`Attempt at cancelling after deleting tabs will trigger a warning, if set in the plugin settings`, () => {
				// @ts-expect-error
				chrome.storage.local.get = jest.fn(
					(
						keys: string | string[] | { [key: string]: any } | null,
						callback: (items: { [key: string]: any }) => void
					): void => {
						callback({ showFolderChangeWarning: true });
					}
				);

				commonRender();

				// Get a random window id
				const randomWindowIndex: number = Math.floor(Math.random() * totalWindowsCount);

				// Get the window element
				let windowItems = screen.getAllByTestId("window-item");
				let targetWindow = windowItems[randomWindowIndex];
				let tabItems = within(targetWindow).getAllByTestId("tab-item");

				// Get 4 random tab id
				let randomTabs: Array<HTMLElement> = [];
				let lastSelectedId = -1;

				for (let i = 0; i < 4; i++) {
					const randomTabIndex = Math.floor(Math.random() * totalTabsInWindowCount);
					const target = tabItems.splice(randomTabIndex, 1);
					randomTabs = randomTabs.concat(target);
				}

				// Loop through these 4 tabs and mark them
				randomTabs.forEach((tab) => {
					const checkbox = within(tab).getByTestId("checkbox");
					fireEvent.click(checkbox);
				});

				const deleteButton = screen.getByText("Delete tabs", {
					selector: "button"
				});
				fireEvent.click(deleteButton);

				const cancelButton = screen.getByText("Cancel", {
					selector: "button"
				});
				fireEvent.click(cancelButton);

				const alert = screen.getByRole("alert");
				expect(alert).toBeInTheDocument();
			});

			test(`Attempt at cancelling after editing tab will trigger a warning, if set in the plugin settings`, () => {
				// @ts-expect-error
				chrome.storage.local.get = jest.fn(
					(
						keys: string | string[] | { [key: string]: any } | null,
						callback: (items: { [key: string]: any }) => void
					): void => {
						callback({ showFolderChangeWarning: true });
					}
				);

				commonRender();

				// Get a random window id
				const randomWindowIndex: number = Math.floor(Math.random() * totalWindowsCount);

				const targetWindowTabs = mockFolder.windows[randomWindowIndex].tabs;

				const randomTabIndex: number = Math.floor(Math.random() * targetWindowTabs.length);

				// Get all windows
				let windowItems = screen.getAllByTestId("window-item");

				// Select a specific window
				let targetWindowItem = windowItems[randomWindowIndex];
				let targetWindowTabItems = within(targetWindowItem).getAllByTestId("tab-item");

				let tabSpecs = mockFolder.windows[randomWindowIndex].tabs[randomTabIndex];

				let targetTab = targetWindowTabItems[randomTabIndex];
				let targetTabLabel = within(targetTab).getByText(tabSpecs.label);

				// now, target the pen and change the field
				const newRandomValue = `http://${randomNumber()}.com`;

				const penIcon = within(targetTab).getByTestId("pen-icon");
				fireEvent.click(penIcon, { bubbles: true });

				// Now, target the input field
				const textfield = screen.getByTestId("editable-tab");
				fireEvent.change(textfield, {
					target: { value: newRandomValue }
				});
				fireEvent.blur(textfield);

				const cancelButton = screen.getByText("Cancel", {
					selector: "button"
				});
				fireEvent.click(cancelButton);

				const alert = screen.getByRole("alert");
				expect(alert).toBeInTheDocument();
			});

			test.each([
				["name", "name-field"],
				["description", "desc-field"]
			])(
				"Attempt at cancelling when %j field has changed will trigger a warning if set in plugin settings",
				(label, testId) => {
					// @ts-expect-error
					chrome.storage.local.get = jest.fn(
						(
							keys: string | string[] | { [key: string]: any } | null,
							callback: (items: { [key: string]: any }) => void
						): void => {
							callback({ showFolderChangeWarning: true });
						}
					);

					commonRender();

					let managerPopup = screen.getByRole("dialog");

					// Change the description field value
					const desc = within(managerPopup).getByTestId(testId);
					fireEvent.focus(desc);
					fireEvent.change(desc, {
						target: { value: randomNumber().toString() }
					});
					fireEvent.blur(desc);

					// Try save it. It should pass
					const cancelButton = within(managerPopup).getByText("Cancel", {
						selector: "button"
					});
					fireEvent.click(cancelButton, { bubbles: true });

					// Get the popup
					let warningMessage = screen.getByRole("alert");
					expect(warningMessage).toBeInTheDocument();

					const keepEditingButton = within(warningMessage).getByText("No, keep editing", {
						selector: "button"
					});
					fireEvent.click(keepEditingButton);

					// Trigger popup again and hit close
					fireEvent.click(cancelButton, { bubbles: true });

					warningMessage = screen.getByRole("alert");
					expect(warningMessage).toBeInTheDocument();

					const closeButton = within(warningMessage).getByText("Yes, close this form", {
						selector: "button"
					});
					fireEvent.click(closeButton);

					act(() => {
						jest.runAllTimers();
					});

					expect(mockProps.onClose).toHaveBeenCalled();
				}
			);
		});
	});
});
