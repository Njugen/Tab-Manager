import { render, screen, within, fireEvent, waitFor, cleanup } from "@testing-library/react";
import '@testing-library/jest-dom'
import { Provider, useSelector, useDispatch } from "react-redux";
import SettingsView from "../../../views/settings/settings_view";
import mockStore from "../../../tools/testing/mock_store";
import { act } from "react-dom/test-utils";
import mockBrowserStorage from "../../../tools/testing/mock_browser_storage";

afterEach(() => cleanup())

const commonRender = () => {
    render(
        <Provider store={mockStore}>
            <SettingsView />
        </Provider>
    )
}

describe("Test <SettingsView>", () => {
    test("Get settings stored in browser's storage when invoked", async () => {
        // @ts-expect-error
        chrome.storage.local.get = jest.fn((data, callback: (e: any) => {}): void => {
            callback(mockBrowserStorage)
        });

        commonRender(); 
        
        expect(chrome.storage.local.get).toHaveBeenCalled();
        jest.clearAllMocks();
    })
    test("Changing any dropdown setting will save it to browser storage", () => {   
        commonRender();
    
        const dropdowns = screen.getAllByRole("menu");

        dropdowns.forEach((dropdown) => {
            // @ts-expect-error
            chrome.storage.local.set = jest.fn((): void => {});

            const menuButton = within(dropdown).getByRole("button");
            fireEvent.click(menuButton);

            const optionsList = within(dropdown).getByRole("list");
            const options = within(optionsList).getAllByRole("listitem");

            // Create a random index in the range of 0 to number of options
            const optionIndex = Math.floor(Math.random() * options.length);

            const target = options[optionIndex];
            const button = within(target).getByRole("button");

            // Click an option
            fireEvent.click(button);
            expect(chrome.storage.local.set).toHaveBeenCalled();
        })
    })

    test("Toggling any switcher on will save it to browser storage", () => {   
        commonRender();
    
        const switchers = screen.getAllByTestId("switcher");

        switchers.forEach((switcher) => {
            const button = within(switcher).getByRole("button");

            // @ts-expect-error
            chrome.storage.local.set = jest.fn((): void => {});

            fireEvent.click(button);

            expect(chrome.storage.local.set).toHaveBeenCalled();
        });
    })

    test("Toggling any switcher off will save it to browser storage", () => {   
        commonRender();
    
        const switchers = screen.getAllByTestId("switcher");

        switchers.forEach((switcher) => {
            const button = within(switcher).getByRole("button");

            // @ts-expect-error
            chrome.storage.local.set = jest.fn((): void => {});

            fireEvent.click(button);
            
            // @ts-expect-error
            chrome.storage.local.set = jest.fn((): void => {});
            fireEvent.click(button);
            expect(chrome.storage.local.set).toHaveBeenCalled();
        });
    })
})
