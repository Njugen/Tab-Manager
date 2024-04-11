import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import randomNumber from "../../../tools/random_number";
import PopupMessage from "../../../components/utils/popup_message";
import PurpleBorderButton from "../../../components/utils/purple_border_button";
import SimpleSearchBar from "../../../components/utils/simple_search_bar";


const mockFn = jest.fn((e: any) => e.target.value);
const mockText = randomNumber().toString();

describe("Test <SimpleSearchBar>", () => {
    test("Renders field with icon", () => {
        render(
            <SimpleSearchBar onChange={mockFn} />
        )

        const icon = screen.getByRole("img");
        expect(icon).toBeInTheDocument();
    });

    test("Field can be focused and changes to desired values", () => {
        render(
            <SimpleSearchBar onChange={mockFn} />
        )
        const textfield = screen.getByRole("textbox");
        fireEvent.focus(textfield);
        fireEvent.change(textfield, { target: { value: mockText } });

        expect(mockFn).toHaveBeenCalledWith(
            expect.objectContaining({
                "target": expect.objectContaining({
                    "value": mockText
                })
            })
        )
        
    });
});