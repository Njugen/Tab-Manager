import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import randomNumber from "../../../tools/random_number";
import PopupMessage from "../../../components/utils/popup_message";
import PurpleBorderButton from "../../../components/utils/purple_border_button";


const mockText = randomNumber().toString();
const mockFn = jest.fn();

describe("Test <PurpleBorderButton>", () => {
    test("Renders ok and works when not disabled", () => {
        render(
            <PurpleBorderButton text={mockText} disabled={false} onClick={mockFn} />
        )

        const button = screen.getByText(mockText, { selector: "button" });
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        expect(mockFn).toHaveBeenCalled();
    });

    test("Renders ok and triggers nothing when disabled", () => {
        render(
            <PurpleBorderButton text={mockText} disabled={true} onClick={mockFn} />
        )

        const button = screen.getByText(mockText, { selector: "button" });
        fireEvent.click(button);
        expect(mockFn).not.toHaveBeenCalled();
    })
});