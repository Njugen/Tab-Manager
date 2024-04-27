import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import randomNumber from "../../../tools/random_number";
import PopupMessage from "../../../components/utils/popup_message";
import iPopupMessage from "../../../interfaces/popup_message";


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

const props: iPopupMessage = {
    title: mockTitle,
    text: mockText,
    primaryButton: pButton,
    secondaryButton: sButton 
}

describe("Test <PopupMessage>", () => {
    test("heading shows 'title' prop", () => {
        render(
            <PopupMessage {...props} />
        )

        const container = screen.getByRole("alert");
        const heading = within(container).getByRole("heading");
        expect(heading).toHaveTextContent(mockTitle);
    })

    test("Shows text inserted through 'text' prop", () => {
        render(
            <PopupMessage {...props} />
        )

        const container = screen.getByRole("alert");
        const text = within(container).getByText(mockText);
        expect(text).toBeInTheDocument();
    })

    test.each([
        ["primary", pButton], 
        ["secondary", sButton]
    ])("Clicking %j button triggers its callback", (def, button) =>{
        render(<PopupMessage {...props} />)

        const container = screen.getByRole("alert");
        const target = within(container).getByText(button.text, { selector: "button" });
        fireEvent.click(target);
        expect(button.callback).toHaveBeenCalled();
    })
});