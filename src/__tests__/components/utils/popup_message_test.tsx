import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import randomNumber from "../../../tools/random_number";
import PopupMessage from "../../../components/utils/popup_message";


const mockText = randomNumber().toString();
const mockTitle = randomNumber().toString();
const pButton = {
    text: randomNumber().toString(),
    callback: jest.fn()
}
const sButton = {
    text: randomNumber().toString(),
    callback: jest.fn()
}

describe("Test <Popup message>", () => {
    test("Renders ok and buttons work", () => {
        render(
            <PopupMessage title={mockTitle} text={mockText} primaryButton={pButton} secondaryButton={sButton} />
        )

        const heading = screen.getByRole("heading");
        expect(heading).toHaveTextContent(mockTitle);

        const text = screen.getByText(mockText);
        expect(text).toBeVisible();
        
        const primaryButton = screen.getByText(pButton.text, { selector: "button" });
        expect(primaryButton).toBeVisible();
        fireEvent.click(primaryButton);
        expect(pButton.callback).toHaveBeenCalled();

        const secondaryButton = screen.getByText(sButton.text, { selector: "button" });
        expect(secondaryButton).toBeVisible();
        fireEvent.click(secondaryButton);
        expect(sButton.callback).toHaveBeenCalled();
    })
});