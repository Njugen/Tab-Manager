import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'

import AddToFolderPopup from "../../../components/features/add_to_folder_popup";
import { iFieldOption } from "../../../interfaces/dropdown";
import randomNumber from "../../../tools/random_number";
import GenericPopup from "../../../components/utils/generic_popup";

interface IGPButtonProps { 
    label: string, 
    handler: (e: any) => void 
}

const mockSaveSpecs: IGPButtonProps = {
    label: randomNumber().toString(),
    handler: jest.fn()
}

const mockCancelSpecs: IGPButtonProps = {
    label: randomNumber().toString(),
    handler: jest.fn()
}

const mockTitle: string = randomNumber().toString();
const mockContentsText: string = randomNumber().toString();
const mockContents: JSX.Element = <p>{mockContentsText}</p>

describe("test <GenericPopup> slide-in", () => {
    test("is visible and all necessities work", () => {
        render(
            <GenericPopup title={mockTitle} type="slide-in" show={true} save={mockSaveSpecs} cancel={mockCancelSpecs}>
                {mockContents}
            </GenericPopup>
        )

        const contents = screen.queryByText(mockContentsText);
        expect(contents).toBeVisible();

        const xIconButton = screen.getByTestId("generic-icon-button-close");
        expect(xIconButton).toBeVisible();

        fireEvent.click(xIconButton);
        expect(mockCancelSpecs.handler).toHaveBeenCalled();

        const footer = screen.getByTestId("generic-popup-footer");
        const buttons = within(footer).getAllByRole("button")

        // Cancel (first button)
        expect(buttons[0].textContent).toBe(mockCancelSpecs.label);
        fireEvent.click(buttons[0]);
        expect(mockCancelSpecs.handler).toHaveBeenCalled();

        
        // Save (seccond button)
        expect(buttons[1].textContent).toBe(mockSaveSpecs.label);
        fireEvent.click(buttons[1]);
        expect(mockSaveSpecs.handler).toHaveBeenCalled();
    })

    test("footer is hidden if there are no save props", () => {
        render(
            <GenericPopup title={mockTitle} type="slide-in" show={true} cancel={mockCancelSpecs}>
                {mockContents}
            </GenericPopup>
        )

        const footer = screen.queryByTestId("generic-popup-footer");
        expect(footer).not.toBeInTheDocument();

        const buttons = screen.queryAllByRole("button");
        expect(buttons.length).toEqual(1);
        
        const cancelText = screen.queryByText(mockCancelSpecs.label);
        const saveText = screen.queryByText(mockSaveSpecs.label);
        expect(cancelText).not.toBeInTheDocument();
        expect(saveText).not.toBeInTheDocument();
    })
})

describe("test <GenericPopup> popup", () => {
    test("is visible and all necessities work", () => {
        render(
            <GenericPopup title={mockTitle} type="popup" show={true} save={mockSaveSpecs} cancel={mockCancelSpecs}>
                {mockContents}
            </GenericPopup>
        )

        const contents = screen.queryByText(mockContentsText);
        expect(contents).toBeVisible();

        const xIconButton = screen.getByTestId("generic-icon-button-close");
        expect(xIconButton).toBeVisible();

        fireEvent.click(xIconButton);
        expect(mockCancelSpecs.handler).toHaveBeenCalled();

        const footer = screen.getByTestId("generic-popup-footer");
        const buttons = within(footer).getAllByRole("button")

        // Cancel (first button)
        expect(buttons[0].textContent).toBe(mockCancelSpecs.label);
        fireEvent.click(buttons[0]);
        expect(mockCancelSpecs.handler).toHaveBeenCalled();

        
        // Save (seccond button)
        expect(buttons[1].textContent).toBe(mockSaveSpecs.label);
        fireEvent.click(buttons[1]);
        expect(mockSaveSpecs.handler).toHaveBeenCalled();
    })

    test("footer is hidden if there are no save props", () => {
        render(
            <GenericPopup title={mockTitle} type="slide-in" show={true} cancel={mockCancelSpecs}>
                {mockContents}
            </GenericPopup>
        )

        const footer = screen.queryByTestId("generic-popup-footer");
        expect(footer).not.toBeInTheDocument();

        const buttons = screen.queryAllByRole("button");
        expect(buttons.length).toEqual(1);
        
        const cancelText = screen.queryByText(mockCancelSpecs.label);
        const saveText = screen.queryByText(mockSaveSpecs.label);
        expect(cancelText).not.toBeInTheDocument();
        expect(saveText).not.toBeInTheDocument();
    })
    
})

test("<GenericPopup> is hidden when rendered with show = false", () => {
    render(
        <GenericPopup title={mockTitle} type="slide-in" show={false} save={mockSaveSpecs} cancel={mockCancelSpecs}>
            {mockContents}
        </GenericPopup>
    )

    const popup = screen.queryByTestId("generic-popup");
    expect(popup?.style.height).toBeFalsy();
});