import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import randomNumber from "../../../tools/random_number";
import PopupMessage from "../../../components/utils/popup_message";
import SecondaryButton from "../../../components/utils/secondary_button";
import SimpleSearchBar from "../../../components/utils/simple_search_bar";
import TextIconButton from "../../../components/utils/text_icon_button";
import { iTextIconButton } from "../../../interfaces/text_icon_button";

const mockFn = jest.fn();
const mockText = randomNumber().toString();
const mockId = randomNumber().toString();
const mockChild = <span data-testid="mock-span"></span>

const props: iTextIconButton = {
    id: mockId,
    text: mockText,
    textSize: "h-2",
    onClick: mockFn,
    children: mockChild,
    disabled: false
}

afterEach(() => {
    jest.clearAllMocks();
})

describe("Test <TextIconButton>", () => {
    test("triggers 'onClick' callback when clicked", () => {
        render(
            <TextIconButton {...props}>
                {mockChild}
            </TextIconButton>
        )

        const button = screen.getByRole("button");

        fireEvent.click(button);
        expect(mockFn).toHaveBeenCalled();
    });

    test("Button has text", () => {
        render(
            <TextIconButton {...props}>
                {mockChild}
            </TextIconButton>
        )

        const button = screen.getByRole("button");
        expect(button).toHaveTextContent(mockText);
    });

    test("Button has child component", () => {
        render(
            <TextIconButton {...props}>
                {mockChild}
            </TextIconButton>
        )

        const button = screen.getByRole("button");
        
        const child = within(button).getByTestId("mock-span");
        expect(child).toBeInTheDocument();

    });

    test("'onClick' callback does not trigger at click when disabled", () => {
        render(
            <TextIconButton {...props} disabled={true}>
                {mockChild}
            </TextIconButton>
        )

        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(mockFn).not.toHaveBeenCalled();
    })
});