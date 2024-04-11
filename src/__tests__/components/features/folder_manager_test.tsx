
import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import randomNumber from "../../../tools/random_number";
import FolderControlButton from "../../../components/utils/icon_button/icon_button";
import { iPopup } from "../../../interfaces/popup";
import { store } from "../../../redux/reducers";
import { Provider } from 'react-redux';
import FolderManager from "../../../components/features/folder_manager/folder_manager";
import { act } from "react-dom/test-utils";
import React from "react";

const mockId = randomNumber().toString();
const mockChildren = <p data-testid="mock-component"></p>
const mockFn = jest.fn();

beforeEach(() => {
    // Mock the managerwrapperref
    jest.spyOn(React , "useRef").mockReturnValue({
        current: {
            scrollTo: (a: any) => {}
        }
    });
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
})

describe("Test <FolderManager>", () => {
    describe("Empty plate (e.g. add new folder)", () => {
        const mockProps: iPopup = {
            title: randomNumber().toString(),
            type: "slide-in",
            onClose: mockFn
        }

        test("Renders empty form. Attempt at saving empty form results won't trigger onClose callback", () => {
            // Mock the chrome storage getter

            // @ts-expect-error
            chrome.storage.local.get = jest.fn((keys: string | string[] | { [key: string]: any; } | null, callback: (items: { [key: string]: any; }) => void): void => {
                callback({ cancellation_warning_setting: false })
            })

            render(
                <Provider store={store}>
                    <FolderManager {...mockProps} />
                </Provider>
            )
            
            let managerPopup = screen.getByRole("dialog");
            expect(managerPopup).toBeInTheDocument();

            const fields = within(managerPopup).getAllByRole("textbox");
            fields.forEach((field) => {
                expect(field).toHaveDisplayValue("")
            })

            const windows = within(managerPopup).queryAllByTestId("window-item");
            expect(windows.length).toEqual(0);

            // Try save it. The onClose callback won't be called
            const saveButton = within(managerPopup).getByText("Create", { selector: "button" });
            fireEvent.click(saveButton, { bubbles: true });
            expect(mockProps.onClose).not.toHaveBeenCalled();
            
            managerPopup = screen.getByRole("dialog");
            expect(managerPopup).toBeInTheDocument();

            // Cancelling closes the popup
            const cancelButton = within(managerPopup).getByText("Cancel", { selector: "button" });
            fireEvent.click(cancelButton, { bubbles: true });

            act(() => {
                jest.runAllTimers();
            });

            expect(mockProps.onClose).toHaveBeenCalled();
            
        })

        test("Saving with non-empty fields will trigger onClose callback", () => {
            // Mock the chrome storage getter

            // @ts-expect-error
            chrome.storage.local.get = jest.fn((keys: string | string[] | { [key: string]: any; } | null, callback: (items: { [key: string]: any; }) => void): void => {
                callback({ cancellation_warning_setting: false })
            })


            render(
                <Provider store={store}>
                    <FolderManager {...mockProps} />
                </Provider>
            )
            
            let managerPopup = screen.getByRole("dialog");
            
            // Change the name field value
            const nameField = within(managerPopup).getByTestId("name-field");
            fireEvent.focus(nameField);
            fireEvent.change(nameField, { target: { value: randomNumber().toString() } } )
            fireEvent.blur(nameField);

            // Add a few new windows (and one tab in each)
            for(let i = 0; i < 5; i++){
                const newWindowButton = within(managerPopup).getByText("New window", { selector: "button" });
                fireEvent.click(newWindowButton);
                const window = within(managerPopup).getAllByTestId("window-item");
                const editableTabField = within(window[i]).getByTestId("editable-tab");
                fireEvent.focus(editableTabField);
                fireEvent.change(editableTabField, { target: { value: `https://${randomNumber().toString()}.com` } } )
                fireEvent.blur(editableTabField);
            }

            // Try save it. It should pass
            const saveButton = within(managerPopup).getByText("Create", { selector: "button" });
            fireEvent.click(saveButton, { bubbles: true });

            act(() => {
                jest.runAllTimers();
            });

            expect(mockProps.onClose).toHaveBeenCalled();

            
        })

        describe("Test cancellation warning popup", () => {
            test("Attempt at cancelling when name field has changed will trigger a warning", () => {
                // Mock the chrome storage getter

                // @ts-expect-error
                chrome.storage.local.get = jest.fn((keys: string | string[] | { [key: string]: any; } | null, callback: (items: { [key: string]: any; }) => void): void => {
                    callback({ cancellation_warning_setting: true })
                })
                

                render(
                    <Provider store={store}>
                        <FolderManager {...mockProps} />
                    </Provider>
                )
                
                let managerPopup = screen.getByRole("dialog");
                
                // Change the name field value
                const nameField = within(managerPopup).getByTestId("name-field");
                fireEvent.focus(nameField);
                fireEvent.change(nameField, { target: { value: randomNumber().toString() } } )
                fireEvent.blur(nameField);


                // Try save it. It should pass
                const cancelButton = within(managerPopup).getByText("Cancel", { selector: "button" });
                fireEvent.click(cancelButton, { bubbles: true });

                // Get the popup
                let warningMessage = screen.getByRole("alert");
                expect(warningMessage).toBeInTheDocument();

                const keepEditingButton = within(warningMessage).getByText("No, keep editing", { selector: "button" })
                fireEvent.click(keepEditingButton);
                
                
                // Trigger popup again and hit close
                fireEvent.click(cancelButton, { bubbles: true });

                warningMessage = screen.getByRole("alert");
                expect(warningMessage).toBeInTheDocument();
                
                const closeButton = within(warningMessage).getByText("Yes, close this form", { selector: "button" })
                fireEvent.click(closeButton);

                act(() => {
                    jest.runAllTimers();
                });

                expect(mockProps.onClose).toHaveBeenCalled();
    
                
            })

            test("Attempt at cancelling when description field has changed will trigger a warning", () => {
                // Mock the chrome storage getter

                // @ts-expect-error
                chrome.storage.local.get = jest.fn((keys: string | string[] | { [key: string]: any; } | null, callback: (items: { [key: string]: any; }) => void): void => {
                    callback({ cancellation_warning_setting: true })
                })
                
    
                render(
                    <Provider store={store}>
                        <FolderManager {...mockProps} />
                    </Provider>
                )
                
                let managerPopup = screen.getByRole("dialog");
                
                // Change the description field value
                const desc = within(managerPopup).getByTestId("desc-field");
                fireEvent.focus(desc);
                fireEvent.change(desc, { target: { value: randomNumber().toString() } } )
                fireEvent.blur(desc);


                // Try save it. It should pass
                const cancelButton = within(managerPopup).getByText("Cancel", { selector: "button" });
                fireEvent.click(cancelButton, { bubbles: true });

                // Get the popup
                let warningMessage = screen.getByRole("alert");
                expect(warningMessage).toBeInTheDocument();

                const keepEditingButton = within(warningMessage).getByText("No, keep editing", { selector: "button" })
                fireEvent.click(keepEditingButton);
                
                
                // Trigger popup again and hit close
                fireEvent.click(cancelButton, { bubbles: true });

                warningMessage = screen.getByRole("alert");
                expect(warningMessage).toBeInTheDocument();
                
                const closeButton = within(warningMessage).getByText("Yes, close this form", { selector: "button" })
                fireEvent.click(closeButton);

                act(() => {
                    jest.runAllTimers();
                });

                expect(mockProps.onClose).toHaveBeenCalled();
    
                
            })

            test("Attempt at cancelling once a window/tab has been added will  trigger a warning", () => {
                // Mock the chrome storage getter

                // @ts-expect-error
                chrome.storage.local.get = jest.fn((keys: string | string[] | { [key: string]: any; } | null, callback: (items: { [key: string]: any; }) => void): void => {
                    callback({ cancellation_warning_setting: true })
                })
    
                render(
                    <Provider store={store}>
                        <FolderManager {...mockProps} />
                    </Provider>
                )
                
                let managerPopup = screen.getByRole("dialog");
                
                // Add a window
                const newWindowButton = within(managerPopup).getByText("New window", { selector: "button" });
                fireEvent.click(newWindowButton);
                const window = within(managerPopup).getByTestId("window-item");
                const editableTabField = within(window).getByTestId("editable-tab");
                fireEvent.focus(editableTabField);
                fireEvent.change(editableTabField, { target: { value: `https://${randomNumber().toString()}.com` } } )
                fireEvent.blur(editableTabField);
          


                // Try save it. It should pass
                const cancelButton = within(managerPopup).getByText("Cancel", { selector: "button" });
                fireEvent.click(cancelButton, { bubbles: true });

                // Get the popup
                let warningMessage = screen.getByRole("alert");
                expect(warningMessage).toBeInTheDocument();

                const keepEditingButton = within(warningMessage).getByText("No, keep editing", { selector: "button" })
                fireEvent.click(keepEditingButton);
                
                
                // Trigger popup again and hit close
                fireEvent.click(cancelButton, { bubbles: true });

                warningMessage = screen.getByRole("alert");
                expect(warningMessage).toBeInTheDocument();
                
                const closeButton = within(warningMessage).getByText("Yes, close this form", { selector: "button" })
                fireEvent.click(closeButton);

                act(() => {
                    jest.runAllTimers();
                });

                expect(mockProps.onClose).toHaveBeenCalled();
    
                
            })
        })
        
    })
    
});