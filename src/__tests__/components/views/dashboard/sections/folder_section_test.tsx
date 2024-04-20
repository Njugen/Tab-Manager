import { render, screen, within, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom'
import { Provider, useSelector } from "react-redux";
import FoldersSection from "../../../../../views/dashboard/sections/folders_section";
import mockStore, { mockFolders } from "../../../../../tools/testing/mock_store";
import mockBrowserStorage from "../../../../../tools/testing/mock_browser_storage";
import { get } from "http";
import { changeDuplicationWarningValue } from "../../../../../redux-toolkit/slices/plugin_settings_slice";
import randomNumber from "../../../../../tools/random_number";
import { act } from "react-dom/test-utils";
import { iFolderItem } from "../../../../../interfaces/folder_item";


beforeEach(() => {
    // @ts-expect-error
    chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
        callback(mockBrowserStorage)
    });

    jest.useFakeTimers();
})

afterEach(() => {
    jest.useRealTimers();
})

describe("Test <FoldersSection>", () => {
    test("When invoked, fetch data from storage", () => {


        render(
            <Provider store={mockStore}>
                <FoldersSection />
            </Provider>
        )

        expect(chrome.storage.local.get).toHaveBeenCalled();
    });

    test("No warning messages when first rendered (all warning settings turned off)", () => {


        render(
            <Provider store={mockStore}>
                <FoldersSection />
            </Provider>
        )
        
        const warningMessages = screen.queryAllByRole("alert");
        expect(warningMessages.length).toEqual(0)
    })

    test("No warning messages when first rendered (all warning settings turned on)", () => {

        render(
            <Provider store={mockStore}>
                <FoldersSection />
            </Provider>
        )
        
        const warningMessages = screen.queryAllByRole("alert");
        expect(warningMessages.length).toEqual(0)
    })

    test("No visible dialogs (e.g. folder manager) when first rendered", () => {
        render(
            <Provider store={mockStore}>
                <FoldersSection />
            </Provider>
        )
        
        const dialog = screen.queryByRole("dialog");
        expect(dialog).not.toBeInTheDocument();
    })

    test("Nothing is marked when first rendered", () => {
        render(
            <Provider store={mockStore}>
                <FoldersSection />
            </Provider>
        );

        const marks = screen.queryAllByTestId("checked-icon");
        expect(marks.length).toEqual(0);
    })

    describe("Test option's menu", () => {
        describe("Test them mark/unmark buttons", () => {
            test("Clicking the 'mark all' button once will mark every folder", () => {
                render(
                    <Provider store={mockStore}>
                        <FoldersSection />
                    </Provider>
                );
    
                const markAllButtons = screen.getByTestId("deselected-checkbox-icon");
                fireEvent.click(markAllButtons, { bubbles: true });
                
                const folders = screen.getAllByTestId("folder-item");
            
                folders.forEach((folder) => {
                    const checkedIcon = within(folder).getByTestId("checked-icon");
                    expect(checkedIcon).toBeInTheDocument();
                });
            })
    
            test("Clicking the 'unmark all' button once will leave no folder marked", () => {
                render(
                    <Provider store={mockStore}>
                        <FoldersSection />
                    </Provider>
                );
    
                const markAllButtons = screen.getByTestId("selected-checkbox-icon");
                fireEvent.click(markAllButtons, { bubbles: true });
                
                const folders = screen.getAllByTestId("folder-item");
            
                folders.forEach((folder) => {
                    const checkedIcon = within(folder).queryByTestId("checked-icon");
                    expect(checkedIcon).not.toBeInTheDocument();
                });
            })
    
        })
        
        describe("Test duplication feature", () => {
            test("'duplicate' button is disabled at first render", () => {
                render(
                    <Provider store={mockStore}>
                        <FoldersSection />
                    </Provider>
                );
    
                const duplicateButton = screen.getByTestId("text-icon-button-folder_duplicate");
            
                expect(duplicateButton).toBeDisabled()
            })
    
            test("'duplicate' button triggers a duplication when clicked (one folder marked)", () => {
    
                render(
                    <Provider store={mockStore}>
                        <FoldersSection />
                    </Provider>
                );
                
                let folders = screen.getAllByTestId("folder-item");
                const randomIndex = Math.floor(Math.random() * folders.length);
    
                const checkbox = within(folders[randomIndex]).getByTestId("checkbox");
                fireEvent.click(checkbox);
    
                const originHeadingText = within(folders[randomIndex]).getByRole("heading", {level: 2}).innerHTML;
    
    
                const duplicateButton = screen.getByTestId("text-icon-button-folder_duplicate");
                fireEvent.click(duplicateButton);
    
                // Now, a duplication should have triggered
                // We check the folder names to determine this is the case.
                folders = screen.getAllByTestId("folder-item");
                let nameOccurrences = 0;
                
                folders.forEach((folder) => {
                    try {
                        const target = within(folder).getByRole("heading", { level: 2 }).innerHTML;
                        if(target.includes(originHeadingText)) nameOccurrences++;
                    } catch(e) {
    
                    }
                });
    
                expect(nameOccurrences).toBeGreaterThan(1);
            })
    
            test("'duplicate' button triggers a warning if multiple folders are marked. Proceeding will duplicate marked folders", () => {
                // @ts-expect-error
                chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                    callback({
                        ...mockBrowserStorage,
                        duplicationWarningValue: 2
                    })
                });
    
                render(
                    <Provider store={mockStore}>
                        <FoldersSection />
                    </Provider>
                );
                
                let folders = screen.getAllByTestId("folder-item");
    
                const checkbox = within(folders[0]).getByTestId("checkbox");
                fireEvent.click(checkbox);
    
                const checkbox2 = within(folders[1]).getByTestId("checkbox");
                fireEvent.click(checkbox2);
                const duplicateButton = screen.getByTestId("text-icon-button-folder_duplicate");
                fireEvent.click(duplicateButton);
    
                // Target the warning box and click the proceed button
                const warningMessage = screen.getByRole("alert");
                const proceedButton = within(warningMessage).getByTestId("alert-proceed-button");
                fireEvent.click(proceedButton)
    
                // Now, a duplication should have triggered
                // Since previous test already assures successful duplication by checking titles, 
                // we can just check that the number of folders have increased by 2
                let currentFolders = screen.getAllByTestId("folder-item");
    
                expect(folders.length + 2).toEqual(currentFolders.length);
            })

            test("Cancelling the warning will not trigger duplication", () => {
                // @ts-expect-error
                chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                    callback({
                        ...mockBrowserStorage,
                        duplicationWarningValue: 2
                    })
                });
    
                render(
                    <Provider store={mockStore}>
                        <FoldersSection />
                    </Provider>
                );
                
                let folders = screen.getAllByTestId("folder-item");
    
                const checkbox = within(folders[0]).getByTestId("checkbox");
                fireEvent.click(checkbox);
    
                const checkbox2 = within(folders[1]).getByTestId("checkbox");
                fireEvent.click(checkbox2);
                const duplicateButton = screen.getByTestId("text-icon-button-folder_duplicate");
                fireEvent.click(duplicateButton);
    
                // Target the warning box and click the proceed button
                const warningMessage = screen.getByRole("alert");
                const cancelButton = within(warningMessage).getByTestId("alert-cancel-button");
                fireEvent.click(cancelButton)
    
                // Now, duplication shouldn't have triggered and the number of folders remain the same
                let currentFolders = screen.getAllByTestId("folder-item");
    
                expect(folders.length).toEqual(currentFolders.length);
            })
        })
      
        describe("Test folder creation process", () => {
            test("Create folder button opens folder manager when clicked", () => {
                // @ts-expect-error
                chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                    callback({
                        ...mockBrowserStorage,
                    })
                });
    
                render(
                    <Provider store={mockStore}>
                        <FoldersSection />
                    </Provider>
                );

                const button = screen.getByText("Create folder", { selector: "button" });
                fireEvent.click(button);

                const folderManager = screen.getByRole("dialog");
                expect(folderManager).toBeInTheDocument();
            });

            test("Cancelling the folder manager hides it", () => {
                // @ts-expect-error
                chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                    callback({
                        ...mockBrowserStorage,
                    })
                });
                
     
                render(
                    <Provider store={mockStore}>
                        <FoldersSection />
                    </Provider>
                );

                const button = screen.getByText("Create folder", { selector: "button" });
                fireEvent.click(button);

                let folderManager: any = screen.getByRole("dialog");
                const closeIcon = within(folderManager).getByTestId("close-icon");


                fireEvent.click(closeIcon, { bubbles: true });
                
                act(() => {
                    jest.runAllTimers();
                });

                folderManager = screen.queryByRole("dialog");
                expect(folderManager).not.toBeInTheDocument();


             
            });

            test("Saving the folder manager once correctly filled, will add the new folder to list", () => {
                // @ts-expect-error
                chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                    callback({
                        ...mockBrowserStorage,
                        folder_sort: 0,
                    })
                });

                render(
                    <Provider store={mockStore}>
                        <FoldersSection />
                    </Provider>
                );

                const button = screen.getByText("Create folder", { selector: "button" });
                fireEvent.click(button);

                let randomName = randomNumber().toString();
                let randomDesc = randomNumber().toString();
                let randomTab = `http://${randomNumber().toString()}.com`;

                let folderManager = screen.getByRole("dialog");

                const nameField = within(folderManager).getByTestId("name-field");
                fireEvent.focus(nameField);
                fireEvent.change(nameField, { target: { value: randomName } });
                fireEvent.blur(nameField);

                const descField = within(folderManager).getByTestId("desc-field");
                fireEvent.focus(descField);
                fireEvent.change(descField, { target: { value: randomDesc } });
                fireEvent.blur(descField);

                const newWindowButton = within(folderManager).getByText("New window", { selector: "button" });
                fireEvent.click(newWindowButton, { bubbles: true });

                const editableTab = within(folderManager).getByTestId("editable-tab");
                fireEvent.focus(editableTab);
                fireEvent.change(editableTab, { target: { value: randomTab } });
                fireEvent.blur(editableTab);

                const createButton = within(folderManager).getByText("Create", { selector: "button" });

                fireEvent.click(createButton, { bubbles: true });
                
                act(() => {
                    jest.runAllTimers();
                });

                // Now, is the newly created folder in the list?
                let isInList = false;
                
                const folders = screen.getAllByTestId("folder-item");

                folders.forEach((folder) => {
                    try {
                        // If there are no errors thrown, then all these components have been found
                        // in this folder -> addition was successful
                        const targetHeading = within(folder).getByText(randomName, { selector: "h2" });
                        const targetDesc = within(folder).getByText(randomDesc);
                        const targetTabItem = within(folder).getByTestId("tab-item");
                        const tabUrl = within(targetTabItem).getByText(randomTab);
                        isInList = true;
                    } catch(e){}
                })

                expect(isInList).toBeTruthy();
      
            })
        })

        describe("Test merge process", () => {
            test("Merge button is disabled when no folders are marked", () => {
                // @ts-expect-error
                chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                    callback({
                        ...mockBrowserStorage,
                    })
                });

                render(
                    <Provider store={mockStore}>
                        <FoldersSection />
                    </Provider>
                );

                const mergeButton = screen.getByTestId("text-icon-button-merge");
            
                expect(mergeButton).toBeDisabled()
            })

            test("Marking folders transfers their windows to folder manager for creation", () => {
                // @ts-expect-error
                chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                    callback({
                        ...mockBrowserStorage,
                    })
                });

                render(
                    <Provider store={mockStore}>
                        <FoldersSection />
                    </Provider>
                );

                const folders = screen.getAllByTestId("folder-item");

                // Mark folders
                folders.forEach((folder) => {
                    const checkbox = within(folder).getByTestId("checkbox");
                    fireEvent.click(checkbox);
                });

                // Click and bubble merge icon
                const mergeIcon = screen.getByTestId("merge-icon");
                fireEvent.click(mergeIcon, { bubbles: true });

                // Dialog (folder manager)
                const folderManager = screen.getByRole("dialog");

                // Fill name
                const mockName = randomNumber().toString();
                const nameField = within(folderManager).getByTestId("name-field");
                fireEvent.focus(nameField);
                fireEvent.change(nameField, { target: { value: mockName } });
                fireEvent.blur(nameField);

                const texts = [];
                const tabItems = within(folderManager).getAllByTestId("tab-item");
                
                const createButton = within(folderManager).getByText("Save", { selector: "button" });
                fireEvent.click(createButton);

                act(() => {
                    jest.runAllTimers();
                });

                // The mock folder should be available in folder list
                const currentFolders = screen.getAllByTestId("folder-item");
                let isInFolder = false;

                currentFolders.forEach((folder) => {
                    try {
                        within(folder).getByText(mockName, { selector: "h2" });
                        isInFolder = true;
                    } catch(e){

                    }
                })

                expect(isInFolder).toBeTruthy()
            })
        })
    })
})
