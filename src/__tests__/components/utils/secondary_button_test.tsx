import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import randomNumber from "../../../tools/random_number";
import PopupMessage from "../../../components/utils/popup_message";
import SecondaryButton from "../../../components/utils/secondary_button";


const mockText = randomNumber().toString();
const mockFn = jest.fn();

describe("Test <SecondaryButton>", () => {
    test("Button has props text", () => {
        render(
            <SecondaryButton text={mockText} disabled={false} onClick={mockFn} />
        )

        const button = screen.getByText(mockText, { selector: "button" });
        expect(button).toBeInTheDocument();
    });

    test("Clicking the button triggers callback", () => {
        render(
            <SecondaryButton text={mockText} disabled={false} onClick={mockFn} />
        )

        const button = screen.getByText(mockText, { selector: "button" });
        fireEvent.click(button);
        expect(mockFn).toHaveBeenCalled();
    });

    test("Renders ok and triggers nothing when disabled", () => {
        render(
            <SecondaryButton text={mockText} disabled={true} onClick={mockFn} />
        )

        const button = screen.getByText(mockText, { selector: "button" });
        fireEvent.click(button);
        expect(mockFn).not.toHaveBeenCalled();
    })
});