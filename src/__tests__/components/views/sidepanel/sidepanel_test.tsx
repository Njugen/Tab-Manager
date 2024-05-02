import { render, screen, within, fireEvent, cleanup } from "@testing-library/react";
import '@testing-library/jest-dom'
import { Provider } from "react-redux";
import mockStore from "../../../../tools/testing/mock_store";
import mockBrowserStorage from "../../../../tools/testing/mock_browser_storage";
import SidePanel from "../../../../baseUI/sidepanel/sidepanel";


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
});

afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
})

describe("Test <SidePanel>", () => {
    describe("Test search results", () => {

        test("Clicking X when search results is visible will exit the results", () => {
            render(
                <Provider store={mockStore}>
                    <SidePanel />
                </Provider>
            )
    
            const textfield = screen.getByRole("textbox");
            fireEvent.click(textfield);
            fireEvent.change(textfield, { target: { value: "Lucid Lynx" } });
    
            let resultsBox = screen.queryByTestId("sidepanel-search-results");
    
            const closeIcon = screen.getByTestId("close-icon");
            fireEvent.click(closeIcon, { bubbles: true });

            resultsBox = screen.queryByTestId("sidepanel-search-results");
            
            expect(resultsBox).not.toBeInTheDocument();
        })
    })

    describe("Folder interactions", () => {
        test("There are no warning messages at invocation", () => {
            // @ts-expect-error
            chrome.storage.local.get = jest.fn((keys: string | string[] | { [key: string]: any; } | null, callback: (items: { [key: string]: any; }) => void): void => {
                callback({ performanceWarningValue: 5 })
            })

            jest.useFakeTimers();

            render(
                <Provider store={mockStore}>
                    <SidePanel />
                </Provider>
            )

            const warningMessage = screen.queryByRole("alert");
            expect(warningMessage).not.toBeInTheDocument();
        })

        describe("Test folder launch attempts", () => {
            const commonRender = () => {
                render(
                    <Provider store={mockStore}>
                        <SidePanel />
                    </Provider>
                )
    
                const textfield = screen.getByRole("textbox");
                fireEvent.click(textfield);
                fireEvent.change(textfield, { target: { value: "Lucid Lynx" } });
    
                const resultsBox = screen.getByTestId("sidepanel-search-results");
    
                const foldersResults = within(resultsBox).getByTestId("folders-search-result");
                const list = within(foldersResults).getByRole("list");
                const folders = within(list).getAllByTestId("folder-item");
    
                const targetFolder = folders[0];
    
                const openButton = within(targetFolder).getByTestId("open-browser-icon");
                fireEvent.click(openButton, { bubbles: true });
    
                const openFolderOptionsMenu = within(targetFolder).getByTestId("open-folder-options");
    
                let optionsButton = within(openFolderOptionsMenu).getAllByRole("button");
                fireEvent.click(optionsButton[0], { bubbles: true });
            }

            test("Attempt at launching a folder where total number of tabs exceeds settings treshold, will trigger a warning", () => {
                // @ts-expect-error
                chrome.storage.local.get = jest.fn((keys: string | string[] | { [key: string]: any; } | null, callback: (items: { [key: string]: any; }) => void): void => {
                    callback({ performanceWarningValue: 5 })
                })
    
                jest.useFakeTimers();
    
                commonRender();
    
                const warningMessage = screen.getByRole("alert");
                expect(warningMessage).toBeInTheDocument();
            })
    
            test("Attempt at launching a folder where total number of tabs does not exceeds settings treshold, will not trigger a warning", () => {
                // @ts-expect-error
                chrome.storage.local.get = jest.fn((keys: string | string[] | { [key: string]: any; } | null, callback: (items: { [key: string]: any; }) => void): void => {
                    callback({ performanceWarningValue: 30 })
                })
    
                jest.useFakeTimers();
    
                commonRender()
    
                const warningMessage = screen.queryByRole("alert");
                expect(warningMessage).not.toBeInTheDocument();
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
                            <SidePanel />
                        </Provider>
                    );
    
                    const textfield = screen.getByRole("textbox");
                    fireEvent.click(textfield);
                    fireEvent.change(textfield, { target: { value: "Lucid Lynx" } });

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
                            <SidePanel />
                        </Provider>
                    );

                    const textfield = screen.getByRole("textbox");
                    fireEvent.click(textfield);
                    fireEvent.change(textfield, { target: { value: "Lucid Lynx" } });
    
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
                            <SidePanel />
                        </Provider>
                    );

                    const textfield = screen.getByRole("textbox");
                    fireEvent.click(textfield);
                    fireEvent.change(textfield, { target: { value: "Lucid Lynx" } });
    
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
                            <SidePanel />
                        </Provider>
                    );

                    const textfield = screen.getByRole("textbox");
                    fireEvent.click(textfield);
                    fireEvent.change(textfield, { target: { value: "Lucid Lynx" } });
    
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
                            <SidePanel />
                        </Provider>
                    );

                    const textfield = screen.getByRole("textbox");
                    fireEvent.click(textfield);
                    fireEvent.change(textfield, { target: { value: "Lucid Lynx" } });
    
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
                            <SidePanel />
                        </Provider>
                    );
    
                    const textfield = screen.getByRole("textbox");
                    fireEvent.click(textfield);
                    fireEvent.change(textfield, { target: { value: "Lucid Lynx" } });

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

        describe("Test window opening sequence", () => {
            const commonRender = () => {
                render(
                    <Provider store={mockStore}>
                        <SidePanel />
                    </Provider>
                )

                const textfield = screen.getByRole("textbox");
                fireEvent.click(textfield);
                fireEvent.change(textfield, { target: { value: "Lucid Lynx" } });
    
                const resultsBox = screen.getByTestId("sidepanel-search-results");
    
                const foldersResults = within(resultsBox).getByTestId("folders-search-result");
                const list = within(foldersResults).getByRole("list");
                const folders = within(list).getAllByTestId("folder-item");
    
                const targetFolder = folders[0];
    
                const openButton = within(targetFolder).getByTestId("open-browser-icon");
                fireEvent.click(openButton, { bubbles: true });
    
                const openFolderOptionsMenu = within(targetFolder).getByTestId("open-folder-options");
    
                let optionsButton = within(openFolderOptionsMenu).getAllByRole("button");
                fireEvent.click(optionsButton[0], { bubbles: true });
    
            }

            test("Cancelling a warning will hide it", () => {
                // @ts-expect-error
                chrome.storage.local.get = jest.fn((keys: string | string[] | { [key: string]: any; } | null, callback: (items: { [key: string]: any; }) => void): void => {
                    callback({ performanceWarningValue: 5 })
                })

                commonRender();
    
                const warningMessage = screen.getByRole("alert");
                const cancelButton = within(warningMessage).getByTestId("alert-cancel-button");
    
                fireEvent.click(cancelButton);
                expect(warningMessage).not.toBeInTheDocument()
    
            })

            test("Proceeding/opening a window through warning message will trigger equivalent chrome function", () => {
                // @ts-expect-error
                chrome.windows.create = jest.fn((): void => {})
    
                // @ts-expect-error
                chrome.storage.local.get = jest.fn((keys: string | string[] | { [key: string]: any; } | null, callback: (items: { [key: string]: any; }) => void): void => {
                    callback({ performanceWarningValue: 5 })
                })
    
                commonRender();
                
                const warningMessage = screen.getByRole("alert");
                const proceedButton = within(warningMessage).getByTestId("alert-proceed-button");
    
                fireEvent.click(proceedButton);
                expect(chrome.windows.create).toHaveBeenCalled();
    
            });
            
            test("Proceeding/opening a window through warning message will hide it", () => {
                // @ts-expect-error
                chrome.storage.local.get = jest.fn((keys: string | string[] | { [key: string]: any; } | null, callback: (items: { [key: string]: any; }) => void): void => {
                    callback({ performanceWarningValue: 5 })
                })
    
                commonRender();
    
                const warningMessage = screen.getByRole("alert");
                const proceedButton = within(warningMessage).getByTestId("alert-proceed-button");
    
                fireEvent.click(proceedButton);
                expect(warningMessage).not.toBeInTheDocument()
    
            })
        })

    })

    test("No results box visible at invocation", () => {
        render(
            <Provider store={mockStore}>
                <SidePanel />
            </Provider>
        )

        const resultsBox = screen.queryByTestId("sidepanel-search-results");
        expect(resultsBox).not.toBeInTheDocument(); 
    })
})