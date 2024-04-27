import { render, screen, within, fireEvent, cleanup } from "@testing-library/react";
import '@testing-library/jest-dom'
import { Provider } from "react-redux";
import mockStore from '../../../tools/testing/mock_store';
import AdvancedSearchBar from "../../../components/features/advanced_search_bar/advanced_search_bar";
import { act } from "react-dom/test-utils";

beforeEach(() => {
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
})

describe("Test <AdvancedSearchBar>", () => {
    describe("Test search results", () => {
        test.each([
            ["folder-item", "folders-search-result"],
            ["tab-item", "history-tabs-search-result"],
            ["tab-item", "current-tabs-search-result"],
        ])(`Writing "Tab Manager" will only show %j components in %j section with that label`, (itemType, section) => {
            render(
                <Provider store={mockStore}>
                    <AdvancedSearchBar />
                </Provider>
            )
    
            const textfield = screen.getByRole("textbox");
            fireEvent.click(textfield);
            fireEvent.change(textfield, { target: { value: "Tab Manager" } });
    
            const resultsBox = screen.getByTestId("search-results-area");
    
            const results = within(resultsBox).getByTestId(section);
            const list = within(results).getByRole("list");
            const listItems = within(list).getAllByTestId(itemType);
    
            listItems.forEach((item) => {
                const textContainer = (itemType === "folder-item" ? within(item).getByRole("heading") : item);
                expect(textContainer).toHaveTextContent("Tab Manager");
            });
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
                    <AdvancedSearchBar />
                </Provider>
            )

            const warningMessage = screen.queryByRole("alert");
            expect(warningMessage).not.toBeInTheDocument();
        })

        describe("Test folder launch attempts", () => {
            const commonRender = () => {
                render(
                    <Provider store={mockStore}>
                        <AdvancedSearchBar />
                    </Provider>
                )
    
                const textfield = screen.getByRole("textbox");
                fireEvent.click(textfield);
                fireEvent.change(textfield, { target: { value: "Katter" } });
    
                const resultsBox = screen.getByTestId("search-results-area");
    
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

        describe("Test window opening sequence", () => {
            const commonRender = () => {
                render(
                    <Provider store={mockStore}>
                        <AdvancedSearchBar />
                    </Provider>
                )

                const textfield = screen.getByRole("textbox");
                fireEvent.click(textfield);
                fireEvent.change(textfield, { target: { value: "Katter" } });
    
                const resultsBox = screen.getByTestId("search-results-area");
    
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
                <AdvancedSearchBar />
            </Provider>
        )

        const resultsBox = screen.queryByTestId("search-results-area");
        expect(resultsBox).not.toBeInTheDocument(); 
    })

    test("Results box shows up when clicking the search button", () => {
        jest.useFakeTimers();

        render(
            <Provider store={mockStore}>
                <AdvancedSearchBar />
            </Provider>
        )

        const textfield = screen.getByRole("textbox");
        fireEvent.click(textfield);

        act(() => {
            jest.runAllTimers();
        });

        const resultsBox = screen.getByTestId("search-results-area");
        expect(resultsBox).toBeInTheDocument(); 
        jest.useRealTimers();
    })

    test("Results box contains no lists if the textfield is empty", () => {
        render(
            <Provider store={mockStore}>
                <AdvancedSearchBar />
            </Provider>
        )

        const textfield = screen.getByRole("textbox");
        fireEvent.click(textfield);

        const resultsBox = screen.getByTestId("search-results-area");
        const lists = within(resultsBox).queryAllByRole("list");

        expect(lists.length).toEqual(0);
    })

    test("Results box is not visible when clicking outside textfield AND results box", () => {
        render(
            <Provider store={mockStore}>
                <AdvancedSearchBar />
            </Provider>
        )

        const textfield = screen.getByRole("textbox");
        fireEvent.click(textfield);

        let resultsBox: any = screen.getByTestId("search-results-area");
        fireEvent.click(resultsBox);

        resultsBox = screen.queryByTestId("search-results-area");
        expect(resultsBox).not.toBeInTheDocument()
    })
});