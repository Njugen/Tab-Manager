import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import randomNumber from "../../../../tools/random_number";
import mockStore from "../../../../tools/testing/mock_store";
import { Provider } from "react-redux";
import mockBrowserStorage from "../../../../tools/testing/mock_browser_storage";
import mockWindows from '../../../../tools/testing/mock_windows';
import { Windows } from "jest-chrome/types/jest-chrome";
import { act } from "react-dom/test-utils";
import SessionView from "../../../../views/sidepanel/session_view";
import FoldersView from '../../../../views/sidepanel/folders_view';

const mockCallback = jest.fn();
const mockTestId = randomNumber();
const mockChild = <p data-testid={mockTestId}></p>

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
    jest.useRealTimers();
})

describe("Test <FolderView>", () => {
    test("When invoked, fetch data from storage", () => {
        render(
            <Provider store={mockStore}>
                <FoldersView />
            </Provider>
        )

        expect(chrome.storage.local.get).toHaveBeenCalled();
    });

    test("No warning messages when first rendered (all warning settings turned off)", () => {
        render(
            <Provider store={mockStore}>
                <FoldersView />
            </Provider>
        )
        
        const warningMessages = screen.queryAllByRole("alert");
        expect(warningMessages.length).toEqual(0)
    })

    test("No warning messages when first rendered (all warning settings turned on)", () => {

        render(
            <Provider store={mockStore}>
                <FoldersView />
            </Provider>
        )
        
        const warningMessages = screen.queryAllByRole("alert");
        expect(warningMessages.length).toEqual(0)
    })

    test("Nothing is marked when first rendered", () => {
        render(
            <Provider store={mockStore}>
                <FoldersView />
            </Provider>
        );

        const marks = screen.queryAllByTestId("checked-icon");
        expect(marks.length).toEqual(0);
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
                    <FoldersView />
                </Provider>
            );

            const newFolderIcon = screen.getByTestId("new-folder-icon");
            fireEvent.click(newFolderIcon, { bubbles: true });

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
                    <FoldersView />
                </Provider>
            );

            const newFolderIcon = screen.getByTestId("new-folder-icon");
            fireEvent.click(newFolderIcon, { bubbles: true });

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
                    <FoldersView />
                </Provider>
            );

            const newFolderIcon = screen.getByTestId("new-folder-icon");
            fireEvent.click(newFolderIcon, { bubbles: true });

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

    describe("Test folder removal", () => {
        test("Folder is removed when clicking its trash icon", () => {
            // @ts-expect-error
            chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                callback({
                    ...mockBrowserStorage,
                    folderRemovalWarning: false
                })
            });

            render(
                <Provider store={mockStore}>
                    <FoldersView />
                </Provider>
            );

            const folders = screen.getAllByTestId("folder-item");
            const target = folders[0];

            const targetHeading = within(target).getByRole("heading", { level: 2 });
            const headingText = targetHeading.innerHTML;

            // Trashbutton;
            const trashIcon = within(target).getByTestId("trash-icon");
            fireEvent.click(trashIcon, { bubbles: true })

            let isNotInFolderList = true;
            
            const currentFolders = screen.getAllByTestId("folder-item");

            // If still in list, set isInFolderList = true -> meaning the test fails because it is still in the list
            currentFolders.forEach((folder) => {
                try {
                    within(folder).getByText(headingText, { selector: "h2" });
                    isNotInFolderList = false;
                } catch(e){

                }
            })

            expect(isNotInFolderList).toBeTruthy();
        })

        test("Folder is removed when proceeding through its warning message (if set in plugin's settings)", () => {
            // @ts-expect-error
            chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                callback({
                    ...mockBrowserStorage,
                    folderRemovalWarning: true
                })
            });

            render(
                <Provider store={mockStore}>
                    <FoldersView />
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
            const proceedButton = screen.getByTestId("alert-proceed-button");
            fireEvent.click(proceedButton);
        
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

            expect(isInFolderList).toBeFalsy();
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
                    <FoldersView />
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


    })

    describe("Test sort", () => {
        test("Selecting descend option will change order of rendered folders", () => {
            // @ts-expect-error
            chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                callback({
                    ...mockBrowserStorage,
                    folder_sort: 0
                })
            });

            render(
                <Provider store={mockStore}>
                    <FoldersView />
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

            const targetOption = within(optionsList).getByText("Descending", { selector: "button" });
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
        
        test("Selecting ascent option will change order of rendered folders", () => {
            // @ts-expect-error
            chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                callback({
                    ...mockBrowserStorage,
                    folder_sort: 0
                })
            });

            render(
                <Provider store={mockStore}>
                    <FoldersView />
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

            const targetOption = within(optionsList).getByText("Ascending", { selector: "button" });
            fireEvent.click(targetOption)

            const currentFolders = screen.getAllByTestId("folder-item");

            let currentNameOrder: Array<string> = []
            
            currentFolders.forEach((folder) => {
                const name = within(folder).getByRole("heading", {level: 2})
                currentNameOrder = [...currentNameOrder, name.innerHTML]
            })

            // Stringify both name arrays and compare them. If one is reverse of the other -> pass
            expect(initialNameOrder.join()).toEqual(currentNameOrder.join());
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
                    <FoldersView />
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
                    <FoldersView />
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
            test("Launching a folder triggers the window creation api", () => {
                render(
                    <Provider store={mockStore}>
                        <FoldersView />
                    </Provider>
                );

                const folders = screen.getAllByTestId("folder-item");
                const target = folders[0];

                const browserIcon = within(target).getByTestId("open-browser-icon");
                fireEvent.click(browserIcon, { bubbles: true })

                const optionsList = within(target).getByTestId("open-folder-options");
                const targetOption = within(optionsList).getByText("Open", { selector: "button" });

                fireEvent.click(targetOption);

                expect(chrome.windows.create).toHaveBeenCalled();
            })

            test("Launching a folder as a group triggers the group creation api", () => {
                render(
                    <Provider store={mockStore}>
                        <FoldersView />
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

            test("Launching a folder in incognito triggers the window creation api", () => {
                render(
                    <Provider store={mockStore}>
                        <FoldersView />
                    </Provider>
                );

                const folders = screen.getAllByTestId("folder-item");
                const target = folders[0];

                const browserIcon = within(target).getByTestId("open-browser-icon");
                fireEvent.click(browserIcon, { bubbles: true })

                const optionsList = within(target).getByTestId("open-folder-options");
                const targetOption = within(optionsList).getByText("Open in incognito", { selector: "button" });

                fireEvent.click(targetOption);

                expect(chrome.windows.create).toHaveBeenCalled();
            })
        })
        
        describe("Warning option set in the plugin settings", () => {
            
            test("Launching a folder through warning message triggers the window creation api", () => {
                // @ts-expect-error
                chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                    callback({
                        ...mockBrowserStorage,
                        performanceWarningValue: 5
                    })
                });

                render(
                    <Provider store={mockStore}>
                        <FoldersView />
                    </Provider>
                );

                const folders = screen.getAllByTestId("folder-item");
                const target = folders[0];

                const browserIcon = within(target).getByTestId("open-browser-icon");
                fireEvent.click(browserIcon, { bubbles: true })

                const optionsList = within(target).getByTestId("open-folder-options");
                const targetOption = within(optionsList).getByText("Open", { selector: "button" });
                
                fireEvent.click(targetOption);

                // Target the warning box and click the proceed button
                const warningMessage = screen.getByRole("alert");
                const proceedButton = within(warningMessage).getByTestId("alert-proceed-button");
                fireEvent.click(proceedButton)

                expect(chrome.windows.create).toHaveBeenCalled();
            })

            test("Launching a folder as a group through warning message triggers the window creation api", () => {
                 // @ts-expect-error
                chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                    callback({
                        ...mockBrowserStorage,
                        performanceWarningValue: 5
                    })
                });
                
                render(
                    <Provider store={mockStore}>
                        <FoldersView />
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

                expect(chrome.tabs.create).toHaveBeenCalled();
            })

            test("Launching a folder in incognito through warning message triggers the window creation api", () => {
                // @ts-expect-error
                chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
                    callback({
                        ...mockBrowserStorage,
                        performanceWarningValue: 5
                    })
                });
                
                render(
                    <Provider store={mockStore}>
                        <FoldersView />
                    </Provider>
                );

                const folders = screen.getAllByTestId("folder-item");
                const target = folders[0];

                const browserIcon = within(target).getByTestId("open-browser-icon");
                fireEvent.click(browserIcon, { bubbles: true })

                const optionsList = within(target).getByTestId("open-folder-options");
                const targetOption = within(optionsList).getByText("Open in incognito", { selector: "button" });

                fireEvent.click(targetOption);

                // Target the warning box and click the proceed button
                const warningMessage = screen.getByRole("alert");
                const proceedButton = within(warningMessage).getByTestId("alert-proceed-button");
                fireEvent.click(proceedButton)

                expect(chrome.windows.create).toHaveBeenCalled();
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
                        <FoldersView />
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


                render(
                    <Provider store={mockStore}>
                        <FoldersView />
                    </Provider>
                );

                const folders = screen.getAllByTestId("folder-item");
                const target = folders[0];

                const browserIcon = within(target).getByTestId("open-browser-icon");
                fireEvent.click(browserIcon, { bubbles: true })

                const optionsList = within(target).getByTestId("open-folder-options");
                const targetOption = within(optionsList).getByText("Open", { selector: "button" });
                
                fireEvent.click(targetOption);

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


                render(
                    <Provider store={mockStore}>
                        <FoldersView />
                    </Provider>
                );

                const folders = screen.getAllByTestId("folder-item");
                const target = folders[0];

                const browserIcon = within(target).getByTestId("open-browser-icon");
                fireEvent.click(browserIcon, { bubbles: true })

                const optionsList = within(target).getByTestId("open-folder-options");
                const targetOption = within(optionsList).getByText("Open", { selector: "button" });
                
                fireEvent.click(targetOption);

                expect(chrome.windows.remove).not.toHaveBeenCalled();
            })
        })
    })
})