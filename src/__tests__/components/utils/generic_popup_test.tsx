import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import CircleButton from '../../../components/utils/circle_button';
import randomNumber from "../../../tools/random_number";
import FormField from "../../../components/utils/form_field";
import GenericButton from "../../../components/utils/generic_button";
import GenericPopup from "../../../components/utils/generic_popup";

const mockTitle = randomNumber().toString();
const mockChild = <div data-testid="mock-child"></div>

const mockSave = {
    label: randomNumber().toString(),
    handler: jest.fn()
}
const mockCancel = {
    label: randomNumber().toString(),
    handler: jest.fn()
}


describe("Test <GenericPopup>", () => {
    const typeCases: Array<"slide-in" | "popup"> = ["slide-in", "popup"];
    

    test.each(typeCases)("Popup works when type = %s and save specs missing", (type) => {
        render(
            <GenericPopup title={mockTitle} type={type} show={true} cancel={mockCancel}>
                {mockChild}
            </GenericPopup>
        );

        const popup = screen.getByRole("dialog");
        expect(popup).toBeVisible();

        const heading = within(popup).queryByRole("heading");
        expect(heading).toHaveTextContent(mockTitle);

        const xButton = within(popup).getByRole("img");
        
        fireEvent.click(xButton);
        expect(mockCancel.handler).toHaveBeenCalled();

        const closeButton = screen.queryByText(mockCancel.label, { selector: "button" });
        const saveButton = screen.queryByText(mockSave.label, { selector: "button" });

        expect(closeButton).not.toBeInTheDocument()
        expect(saveButton).not.toBeInTheDocument()
    })

    test.each(typeCases)("Popup works when type = %s and save specs exists", (type) => {
        render(
            <GenericPopup title={mockTitle} type={type} show={true} cancel={mockCancel} save={mockSave}>
                {mockChild}
            </GenericPopup>
        );

        const popup = screen.getByRole("dialog");
        expect(popup).toBeVisible();

        const heading = within(popup).queryByRole("heading");
        expect(heading).toHaveTextContent(mockTitle);

        const xButton = within(popup).getByRole("img");
        
        fireEvent.click(xButton);
        expect(mockCancel.handler).toHaveBeenCalled();

        const closeButton = screen.getByText(mockCancel.label, { selector: "button" });
        const saveButton = screen.getByText(mockSave.label, { selector: "button" });
        
        fireEvent.click(closeButton);
        expect(mockCancel.handler).toHaveBeenCalled();

        fireEvent.click(saveButton);
        expect(mockSave.handler).toHaveBeenCalled();
    })
});