import { render, screen, within, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom'
import randomNumber from "../../../tools/random_number";
import TextIconButton from "../../../components/utils/text_icon_button";
import EditableTabItem from "../../../components/features/editable_tab_item";
import { store } from "../../../redux/reducers";
import { Provider } from "react-redux";

const mockFn = jest.fn();
const mockTabId = randomNumber();
const mockWindowId = randomNumber();
const mockPreset = `https://${randomNumber().toString()}.com`;
const mockNewValue = `https://${randomNumber().toString()}.com`;

describe("Test <EditableTabItem>", () => {
    test("Works correctly with no specific tab id nor preset value", async () => {
        render(
            <Provider store={store}>
                <EditableTabItem windowId={mockWindowId} onStop={mockFn} />
            </Provider>
        )   
        
        let textfield = screen.getByRole("textbox");
        expect(textfield).toHaveValue("https://");

        await waitFor(() => expect(textfield).toHaveFocus(), { timeout: 1000 })
        
        // Test blur
        fireEvent.blur(textfield);
        expect(mockFn).not.toHaveBeenCalled();

        // Test press enter
        fireEvent.keyDown(textfield, { key: "Enter" });
        expect(mockFn).not.toHaveBeenCalled();
        
        // Test press enter
        fireEvent.keyDown(textfield, { charCode: 13 });
        expect(mockFn).not.toHaveBeenCalled();

        // Value remains the same
        textfield = screen.getByRole("textbox");
        expect(textfield).toHaveValue("https://");

        const errfield = screen.getByTestId("field-error");
        expect(errfield).toBeInTheDocument();

        // Change to new value
        fireEvent.change(textfield);
        fireEvent.blur(textfield, { target: { value:  mockNewValue} });
        expect(textfield).toHaveValue(mockNewValue);
        expect(mockFn).toHaveBeenCalled();
        expect(errfield).not.toBeInTheDocument();
    });

    test("Works correctly with tab id and preset value", async () => {
        render(
            <Provider store={store}>
                <EditableTabItem windowId={mockWindowId} id={mockTabId} preset={mockPreset} onStop={mockFn} />
            </Provider>
        )   
        
        let textfield = screen.getByRole("textbox");
        expect(textfield).toHaveValue(mockPreset);
        await waitFor(() => expect(textfield).toHaveFocus(), { timeout: 1000 })
        
        // Test blur
        fireEvent.blur(textfield);
        expect(mockFn).toHaveBeenCalled();
        
        // Test press enter
        fireEvent.keyDown(textfield, { charCode: 13 });
        expect(mockFn).toHaveBeenCalled();

        // Value remains the same
        textfield = screen.getByRole("textbox");
        expect(textfield).toHaveValue(mockPreset);
        const errfield = screen.queryByTestId("field-error");
        expect(errfield).not.toBeInTheDocument();

        // Change to new value
        fireEvent.change(textfield);
        fireEvent.blur(textfield, { target: { value:  mockNewValue} });
        expect(textfield).toHaveValue(mockNewValue);
        expect(mockFn).toHaveBeenCalled();
    });
});