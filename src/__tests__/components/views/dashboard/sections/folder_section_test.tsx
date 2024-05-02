import { render, screen, within, fireEvent, cleanup } from "@testing-library/react";
import '@testing-library/jest-dom'
import { Provider } from "react-redux";
import FoldersSection from "../../../../../views/dashboard/sections/folders_section";
import mockStore from "../../../../../tools/testing/mock_store";
import mockBrowserStorage from "../../../../../tools/testing/mock_browser_storage";
import randomNumber from "../../../../../tools/random_number";
import { act } from "react-dom/test-utils";
import { iWindowItem } from "../../../../../interfaces/window_item";


beforeEach(() => {
    // @ts-expect-error
    chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
        callback(mockBrowserStorage)
    });

    // @ts-expect-error
    chrome.extension.isAllowedIncognitoAccess = jest.fn((callback: (data: boolean) => void) => {
        callback(true);
    })

    // @ts-expect-error
    chrome.tabs.create = jest.fn((data, callback) => {
        const str = JSON.parse('{"active":false,"audible":false,"autoDiscardable":true,"discarded":true,"favIconUrl":"https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico?v=ec617d715196","groupId":-1,"height":0,"highlighted":false,"id":892795750,"incognito":false,"index":0,"mutedInfo":{"muted":false},"pinned":false,"selected":false,"status":"unloaded","title":"git - gitignore does not ignore folder - Stack Overflow","url":"https://stackoverflow.com/questions/24410208/gitignore-does-not-ignore-folder","width":0,"windowId":892795610}');
        callback(str);
    });
    chrome.tabs.group = jest.fn();
    chrome.windows.create = jest.fn()

    jest.useFakeTimers();
})

afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    cleanup();
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
                    const checkbox: HTMLInputElement = within(folder).getByRole("checkbox");
                    expect(checkbox.defaultChecked).toBeTruthy();
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

            test("Creating folder by merging multiple folders works", () => {
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

                const createButton = within(folderManager).getByText("Save", { selector: "button" });
                fireEvent.click(createButton);

                act(() => {
                    jest.runAllTimers();
                });

                // The mock folder should be available in folder list
                const currentFolders = screen.getAllByTestId("folder-item");
                let isInFolderList = false;

                currentFolders.forEach((folder) => {
                    try {
                        within(folder).getByText(mockName, { selector: "h2" });
                        isInFolderList = true;
                    } catch(e){

                    }
                })

                expect(isInFolderList).toBeTruthy()
            })
        })

        describe("Test folder removal", () => {
            test.each([
                ["Folder is removed when clicking its trash icon", false, true],
                ["Folder is removed when proceeding through its warning message (if set in plugin's settings)", true, false]
            ])("%j", (label, preset, expected) => {
                // @ts-expect-error
                chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                    callback({
                        ...mockBrowserStorage,
                        folderRemovalWarning: preset
                    })
                });

                render(
                    <Provider store={mockStore}>
                        <FoldersSection />
                    </Provider>
                );

                const folders = screen.getAllByTestId("folder-item");
                const target = folders[0];

                const targetHeading = within(target).getByRole("heading", { level: 2 });
                const headingText = targetHeading.innerHTML;

                // Trashbutton;
                const trashIcon = within(target).getByTestId("trash-icon");
                fireEvent.click(trashIcon, { bubbles: true })

                let isInFolderList = expected;
                
                const currentFolders = screen.getAllByTestId("folder-item");

                // If still in list, set isInFolderList = true -> meaning the test fails because it is still in the list
                currentFolders.forEach((folder) => {
                    try {
                        within(folder).getByText(headingText, { selector: "h2" });
                        isInFolderList = false;
                    } catch(e){
                        isInFolderList = expected;
                    }
                })

                expect(isInFolderList).toEqual(expected);
            })

            test("Folder is not removed when cancelling through its warning message (if set in plugin's settings)", () => {
                // @ts-expect-error
                chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                    callback({
                        ...mockBrowserStorage,
                        folderRemovalWarning: true
                    })
                });

                render(
                    <Provider store={mockStore}>
                        <FoldersSection />
                    </Provider>
                );

                const folders = screen.getAllByTestId("folder-item");
                const target = folders[0];

                const targetHeading = within(target).getByRole("heading", { level: 2 });
                const headingText = targetHeading.innerHTML;

                // Trashbutton;
                const trashIcon = within(target).getByTestId("trash-icon");
                fireEvent.click(trashIcon, { bubbles: true })

                // Proceed button
                const cancelButton = screen.getByTestId("alert-cancel-button");
                fireEvent.click(cancelButton);
            
                let isInFolderList = false;
                
                const currentFolders = screen.getAllByTestId("folder-item");

                // If still in list, set isInFolderList = true -> meaning the test fails because it is still in the list
                currentFolders.forEach((folder) => {
                    try {
                        within(folder).getByText(headingText, { selector: "h2" });
                        isInFolderList = true;
                    } catch(e){

                    }
                })

                expect(isInFolderList).toBeTruthy();
            })

            test("Trash button in options bar is disabled when first rendered", () => {
                render(
                    <Provider store={mockStore}>
                        <FoldersSection />
                    </Provider>
                );

                const trashButton = screen.getByTestId("text-icon-button-trash");
                expect(trashButton).toBeDisabled();
            })

            test("Clicking trash button in option bar removes marked folders", () => {
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
                let targets = [folders[0], folders[1]];
                let headingsText: string[] = [];

                targets.forEach((target) => {
                    const heading = within(target).getByRole("heading", { level: 2 })
                    headingsText = [...headingsText, heading.innerHTML];

                    // Mark targt folder
                    const checkbox = within(target).getByTestId("checkbox");
                    fireEvent.click(checkbox);
                })

                // Click trash button in option bar
                const trashButton = screen.getByTestId("text-icon-button-trash");
                fireEvent.click(trashButton);

                let isNotInFolderList = true;

                // Check whether or not all target titles are removed. If not -> fail
                const currentFolders = screen.getAllByTestId("folder-item");

                currentFolders.forEach((folder, i) => {
                    try {
                        const folderName = within(folder).getByText(headingsText[i], { selector: "h2" });
                        isNotInFolderList = false;
                    } catch(e){
                        isNotInFolderList = true;
                    };
                })

                expect(isNotInFolderList).toBeTruthy();
            })

            test("Removing marked folders through warning message via trash button in option bar, is successful if user proceeds", () => {
                // @ts-expect-error
                chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                    callback({
                        ...mockBrowserStorage,
                        folderRemovalWarning: true
                    })
                });

                render(
                    <Provider store={mockStore}>
                        <FoldersSection />
                    </Provider>
                );

                const folders = screen.getAllByTestId("folder-item");

                // Mark targt folder
                const checkbox = within(folders[0]).getByTestId("checkbox");
                fireEvent.click(checkbox);

                // Click trash button in option bar
                const trashButton = screen.getByTestId("text-icon-button-trash");
                fireEvent.click(trashButton);

                // Target the warning box and click the proceed button
                const warningMessage = screen.getByRole("alert");
                const proceedButton = within(warningMessage).getByTestId("alert-proceed-button");
                fireEvent.click(proceedButton)

                let isNotInFolderList = true;

                // Check whether or not all target titles are removed. If not -> fail
                const currentFolders = screen.getAllByTestId("folder-item");

                currentFolders.forEach((folder, i) => {
                    try {
                        isNotInFolderList = true;
                    } catch(e){
                        isNotInFolderList = false;
                    };
                })

                expect(isNotInFolderList).toBeTruthy();
            })

            test("Removing marked folders through warning message via trash button in option bar, fails if user cancel", () => {
                // @ts-expect-error
                chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                    callback({
                        ...mockBrowserStorage,
                        folderRemovalWarning: true
                    })
                });

                render(
                    <Provider store={mockStore}>
                        <FoldersSection />
                    </Provider>
                );

                const folders = screen.getAllByTestId("folder-item");

                // Mark targt folder
                const checkbox = within(folders[0]).getByTestId("checkbox");
                fireEvent.click(checkbox);

                // Click trash button in option bar
                const trashButton = screen.getByTestId("text-icon-button-trash");
                fireEvent.click(trashButton);

                // Target the warning box and click the cancel button
                const warningMessage = screen.getByRole("alert");
                const cancelButton = within(warningMessage).getByTestId("alert-cancel-button");
                fireEvent.click(cancelButton)

                // Check whether or not any folder has been removed
                const currentFolders = screen.getAllByTestId("folder-item");
                expect(currentFolders.length).toEqual(folders.length);
            })
        })

        describe("Test sort", () => {
            test.each([
                ["Selecting descend option will change order of rendered folders", "Descending"],
                ["Selecting ascend option will change order of rendered folders", "Ascending"]
            ])("%j", (label, option) => {
                // @ts-expect-error
                chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                    callback({
                        ...mockBrowserStorage,
                        folder_sort: 0
                    })
                });

                render(
                    <Provider store={mockStore}>
                        <FoldersSection />
                    </Provider>
                );

                let initialNameOrder: Array<string> = [];
                
                const folders = screen.getAllByTestId("folder-item");

                folders.forEach((folder) => {
                    const name = within(folder).getByRole("heading", {level: 2})

                    initialNameOrder = [...initialNameOrder, name.innerHTML];
                })

                initialNameOrder = initialNameOrder.sort()

                const sortMenu= screen.getByRole("menu");
                const initButton = within(sortMenu).getByRole("button");
                fireEvent.click(initButton)

                const optionsList = within(sortMenu).getByRole("list");

                const targetOption = within(optionsList).getByText(option, { selector: "button" });
                fireEvent.click(targetOption)

                const currentFolders = screen.getAllByTestId("folder-item");

                let currentNameOrder: Array<string> = []
                
                currentFolders.forEach((folder) => {
                    const name = within(folder).getByRole("heading", {level: 2})
                    currentNameOrder = [...currentNameOrder, name.innerHTML]
                })

                // Stringify both name arrays and compare them. If one is reverse of the other -> pass
                expect(initialNameOrder.join()).not.toEqual(currentNameOrder.join());
            })

        })

        describe("Test folder edit", () => {
            test("Clicking the cog icon renders the folder manager prefilled with tabs", () => {
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
                const target = folders[0];


                const settingsIcon = within(folders[0]).getByTestId("settings-icon");
                fireEvent.click(settingsIcon, { bubbles: true });

                const folderManager = screen.getByRole("dialog");

                const tabs = within(folderManager).getAllByTestId("tab-item");
                expect(tabs.length).toBeGreaterThan(0);
            });

            test("Clicking the cog icon renders the folder manager prefilled with folder name", () => {
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
                const target = folders[0];

                const folderHeading = within(target).getByRole("heading", { level: 2 });
                const folderName = folderHeading.innerHTML

                const settingsIcon = within(target).getByTestId("settings-icon");
                fireEvent.click(settingsIcon, { bubbles: true });

                const folderManager = screen.getByRole("dialog");

                const nameField = within(folderManager).getByTestId("name-field");
                expect(nameField).toHaveValue(folderName);
            })
        })

        describe("Test launching folder", () => {
            // @ts-expect-error
            chrome.windows.create = jest.fn((window: iWindowItem) => {})

            describe("No warning set in the plugin settings", () => {
                test.each([
                    ["Launching a folder triggers the window creation api", "Open"],
                    ["Launching a folder in incognito triggers the window creation api", "Open in incognito"]
                ])("%j", (label, optionText) => {
                    render(
                        <Provider store={mockStore}>
                            <FoldersSection />
                        </Provider>
                    );
    
                    const folders = screen.getAllByTestId("folder-item");
                    const target = folders[0];
    
                    const browserIcon = within(target).getByTestId("open-browser-icon");
                    fireEvent.click(browserIcon, { bubbles: true })
    
                    const optionsList = within(target).getByTestId("open-folder-options");
                    const targetOption = within(optionsList).getByText(optionText, { selector: "button" });
    
                    fireEvent.click(targetOption);
    
                    expect(chrome.windows.create).toHaveBeenCalled();
                })

                test("Launching a folder as a group triggers the group creation api", () => {
                    render(
                        <Provider store={mockStore}>
                            <FoldersSection />
                        </Provider>
                    );
    
                    const folders = screen.getAllByTestId("folder-item");
                    const target = folders[0];
    
                    const browserIcon = within(target).getByTestId("open-browser-icon");
                    fireEvent.click(browserIcon, { bubbles: true })
    
                    const optionsList = within(target).getByTestId("open-folder-options");
                    const targetOption = within(optionsList).getByText("Open as group", { selector: "button" });
    
                    fireEvent.click(targetOption);
    
                    expect(chrome.tabs.group).toHaveBeenCalled();
                })
            })
            
            describe("Warning option set in the plugin settings", () => {
                const removalAPISequence = () => {
                    render(
                        <Provider store={mockStore}>
                            <FoldersSection />
                        </Provider>
                    );
    
                    const folders = screen.getAllByTestId("folder-item");
                    const target = folders[0];
    
                    const browserIcon = within(target).getByTestId("open-browser-icon");
                    fireEvent.click(browserIcon, { bubbles: true })
    
                    const optionsList = within(target).getByTestId("open-folder-options");
                    const targetOption = within(optionsList).getByText("Open", { selector: "button" });
                    
                    fireEvent.click(targetOption);
                }
                
                test.each([
                    ["Launching a folder through warning message triggers the window creation api", "Open"],
                    ["Launching a folder in incognito through warning message triggers the window creation api", "Open in incognito"]
                ])("%j", (label, optionText) => {
                    // @ts-expect-error
                    chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                        callback({
                            ...mockBrowserStorage,
                            performanceWarningValue: 5
                        })
                    });

                    render(
                        <Provider store={mockStore}>
                            <FoldersSection />
                        </Provider>
                    );
    
                    const folders = screen.getAllByTestId("folder-item");
                    const target = folders[0];
    
                    const browserIcon = within(target).getByTestId("open-browser-icon");
                    fireEvent.click(browserIcon, { bubbles: true })
    
                    const optionsList = within(target).getByTestId("open-folder-options");
                    const targetOption = within(optionsList).getByText(optionText, { selector: "button" });
                    
                    fireEvent.click(targetOption);
    
                    // Target the warning box and click the proceed button
                    const warningMessage = screen.getByRole("alert");
                    const proceedButton = within(warningMessage).getByTestId("alert-proceed-button");
                    fireEvent.click(proceedButton)

                    expect(chrome.windows.create).toHaveBeenCalled();
                })

                test("Launching a folder as a group through warning message triggers the group creation api", () => {
                    // @ts-expect-error
                    chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                        callback({
                            ...mockBrowserStorage,
                            performanceWarningValue: 5
                        })
                    });

                    render(
                        <Provider store={mockStore}>
                            <FoldersSection />
                        </Provider>
                    );
    
                    const folders = screen.getAllByTestId("folder-item");
                    const target = folders[0];
    
                    const browserIcon = within(target).getByTestId("open-browser-icon");
                    fireEvent.click(browserIcon, { bubbles: true })
    
                    const optionsList = within(target).getByTestId("open-folder-options");
                    const targetOption = within(optionsList).getByText("Open as group", { selector: "button" });
                    
                    fireEvent.click(targetOption);
    
                    // Target the warning box and click the proceed button
                    const warningMessage = screen.getByRole("alert");
                    const proceedButton = within(warningMessage).getByTestId("alert-proceed-button");
                    fireEvent.click(proceedButton)

                    expect(chrome.tabs.group).toHaveBeenCalled();
                })

                test("Cancelling folder launch through warning message won't trigger browser api", () => {
                    // @ts-expect-error
                    chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                        callback({
                            ...mockBrowserStorage,
                            performanceWarningValue: 5
                        })
                    });

                    render(
                        <Provider store={mockStore}>
                            <FoldersSection />
                        </Provider>
                    );
    
                    const folders = screen.getAllByTestId("folder-item");
                    const target = folders[0];
    
                    const browserIcon = within(target).getByTestId("open-browser-icon");
                    fireEvent.click(browserIcon, { bubbles: true })
    
                    const optionsList = within(target).getByTestId("open-folder-options");
                    const targetOption = within(optionsList).getByText("Open", { selector: "button" });
                    
                    fireEvent.click(targetOption);
    
                    // Target the warning box and click the cancel button
                    const warningMessage = screen.getByRole("alert");
                    const cancelButton = within(warningMessage).getByTestId("alert-cancel-button");
                    fireEvent.click(cancelButton)

                    expect(chrome.windows.create).not.toHaveBeenCalled();
                })

                test("Opening a folder will trigger removal api (to close current session) if set in plugin settings", () => {
                    // @ts-expect-error
                    chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                        callback({
                            ...mockBrowserStorage,
                            closeSessionAtFolderLaunch: true
                        })
                    });

                    const mockSession: Array<chrome.windows.Window> = JSON.parse('[{"alwaysOnTop":false,"focused":true,"height":1056,"id":892792030,"incognito":false,"left":2552,"state":"maximized","top":-8,"type":"normal","width":1936}]')
                    // @ts-expect-error
                    chrome.windows.getAll = jest.fn((anything, callback: (data: Array<chrome.windows.Window>) => {}): void => {
                        callback(mockSession);
                    })
                    chrome.windows.remove = jest.fn();

                    removalAPISequence();

                    expect(chrome.windows.remove).toHaveBeenCalled();
                })

                test("Opening a folder won't trigger removal api (to close current session) if not set in plugin settings", () => {
                    // @ts-expect-error
                    chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                        callback({
                            ...mockBrowserStorage,
                            closeSessionAtFolderLaunch: false
                        })
                    });
                    const mockSession: Array<chrome.windows.Window> = JSON.parse('[{"alwaysOnTop":false,"focused":true,"height":1056,"id":892792030,"incognito":false,"left":2552,"state":"maximized","top":-8,"type":"normal","width":1936}]')
                    // @ts-expect-error
                    chrome.windows.getAll = jest.fn((anything, callback: (data: Array<chrome.windows.Window>) => {}): void => {
                        callback(mockSession);
                    })
                    chrome.windows.remove = jest.fn();

                    removalAPISequence();

                    expect(chrome.windows.remove).not.toHaveBeenCalled();
                })
            })
        })
        
        describe("Toggling view mode", () => {
            // @ts-expect-error
            chrome.storage.local.set = jest.fn((data: any) => {});

            test.each([
                ["Toggling from grid to list", "grid", "list",],
                ["Toggling from list to grid", "list", "grid"]
            ])("%j", (label, initial, newSetting) => {
                // @ts-expect-error
                chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                    callback({
                        ...mockBrowserStorage,
                        folder_viewmode: initial
                    })
                });

                render(
                    <Provider store={mockStore}>
                        <FoldersSection />
                    </Provider>
                );

                const togglingButton = screen.getByTestId(`text-icon-button-${newSetting}`);
                fireEvent.click(togglingButton);

                expect(chrome.storage.local.set).toHaveBeenCalledWith({ "folder_viewmode": newSetting })
            })
        })
    })
})
