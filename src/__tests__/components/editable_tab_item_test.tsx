import { fireEvent, render, screen, within, } from "@testing-library/react";
import '@testing-library/jest-dom'
import { store } from "../../redux/reducers";
import { Provider } from "react-redux";
import { iFolderItem } from "../../interfaces/folder_item";
import FolderItem from "../../components/features/folder_item/folder_item";
import EditableTabItem from "../../components/features/editable_tab_item";
import randomNumber from "../../tools/random_number";

const mockPreset: string = randomNumber().toString();
const mockId: number = randomNumber();
const mockWindowNumber: number = randomNumber();
const mockStop = jest.fn();

describe("Test <EditableTabItem>", () => {
    test("The component shows error message when blurred with invalid url", () => {
        render(
            <Provider store={store}>
                <EditableTabItem id={mockId} windowId={mockWindowNumber} preset={mockPreset} onStop={mockStop}  />
            </Provider>
        );

        const field = screen.getByRole("textbox");
        expect(field).toHaveValue(mockPreset);

        let errorMessage = screen.queryByTestId("field-error");
        expect(errorMessage).not.toBeInTheDocument();

        // Click
        fireEvent.click(field);

        errorMessage = screen.queryByTestId("field-error");
        expect(errorMessage).not.toBeInTheDocument();

        // Blur
        fireEvent.blur(field);

        errorMessage = screen.queryByTestId("field-error");
        expect(errorMessage).toBeInTheDocument();
    });

    test("The component shows error message when user hit enter with invalid url", () => {
        render(
            <Provider store={store}>
                <EditableTabItem id={mockId} windowId={mockWindowNumber} preset={mockPreset} onStop={mockStop}  />
            </Provider>
        );

        const field = screen.getByRole("textbox");
        expect(field).toHaveValue(mockPreset);

        let errorMessage = screen.queryByTestId("field-error");
        expect(errorMessage).not.toBeInTheDocument();

        // Click
        fireEvent.click(field);
        fireEvent.change(field, {
            target: {
                value: "blablabla"
            }
        });

        errorMessage = screen.queryByTestId("field-error");
        expect(errorMessage).not.toBeInTheDocument();

        // hit enter
        fireEvent.keyDown(field, {key: 'Enter', code: 'Enter', charCode: 13})

        errorMessage = screen.queryByTestId("field-error");
        expect(errorMessage).toBeInTheDocument();
    });

    test("The component shows no error message when blurred with valid url. triggers mockStop", () => {
        render(
            <Provider store={store}>
                <EditableTabItem id={mockId} windowId={mockWindowNumber} preset={mockPreset} onStop={mockStop}  />
            </Provider>
        );

        const field = screen.getByRole("textbox");
        expect(field).toHaveValue(mockPreset);

        let errorMessage = screen.queryByTestId("field-error");
        expect(errorMessage).not.toBeInTheDocument();

        // Click
        fireEvent.click(field);

        errorMessage = screen.queryByTestId("field-error");
        expect(errorMessage).not.toBeInTheDocument();

        fireEvent.change(field, {
            target: {
                value: "http://google.com"
            }
        });

        // Blur
        fireEvent.blur(field);

        errorMessage = screen.queryByTestId("field-error");
        expect(errorMessage).not.toBeInTheDocument();

        expect(mockStop).toHaveBeenCalled();
    });

    test("The component shows no error message when user hit enter with valid url. triggers mockStop", () => {
        render(
            <Provider store={store}>
                <EditableTabItem id={mockId} windowId={mockWindowNumber} preset={mockPreset} onStop={mockStop}  />
            </Provider>
        );

        const field = screen.getByRole("textbox");
        expect(field).toHaveValue(mockPreset);

        let errorMessage = screen.queryByTestId("field-error");
        expect(errorMessage).not.toBeInTheDocument();

        // Click
        fireEvent.click(field);

        errorMessage = screen.queryByTestId("field-error");
        expect(errorMessage).not.toBeInTheDocument();

        fireEvent.change(field, {
            target: {
                value: "http://google.com"
            }
        });

        // hit enter
        fireEvent.keyDown(field, {key: 'Enter', code: 'Enter', charCode: 13})

        errorMessage = screen.queryByTestId("field-error");
        expect(errorMessage).not.toBeInTheDocument();

        expect(mockStop).toHaveBeenCalled();
    });

    test("Preset is 'https://' if no preset props is given", () => {
        render(
            <Provider store={store}>
                <EditableTabItem id={mockId} windowId={mockWindowNumber} onStop={mockStop}  />
            </Provider>
        );

        const field = screen.getByRole("textbox");
        expect(field).toHaveValue("https://");
    });
})