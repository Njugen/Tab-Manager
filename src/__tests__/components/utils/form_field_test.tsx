import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import CircleButton from '../../../components/utils/circle_button';
import randomNumber from "../../../tools/random_number";
import FormField from "../../../components/utils/form_field";

const mockLabel = randomNumber().toString();
const mockDesc = randomNumber().toString();
const mockTestId = randomNumber().toString();
const mockChild = <p data-testid={mockTestId}></p>

describe("Test <FormField>", () => {
    test("Field has label as heading", () => {
        render(
            <FormField label={mockLabel} description={mockDesc}>
                {mockChild}
            </FormField>
        )

        const label = screen.getByRole("heading");
        expect(label).toHaveTextContent(mockLabel);
    })

    test("Field displays description props", () => {
        render(
            <FormField label={mockLabel} description={mockDesc}>
                {mockChild}
            </FormField>
        )

        const desc = screen.getByText(mockDesc);
        expect(desc).toBeInTheDocument();
    })

    test("Field has child component", () => {
        render(
            <FormField label={mockLabel} description={mockDesc}>
                {mockChild}
            </FormField>
        )

        const child = screen.getByTestId(mockTestId);
        expect(child).toBeInTheDocument();
    })

    test("Field indicates error", () => {
        render(
            <FormField label={mockLabel} description={mockDesc} error={true}>
                {mockChild}
            </FormField>
        )

        const label = screen.queryByTestId("error-true")
        expect(label).toBeInTheDocument();
    })

    test("Field does not", () => {
        render(
            <FormField label={mockLabel} description={mockDesc}>
                {mockChild}
            </FormField>
        )

        const label = screen.queryByTestId("error-true")
        expect(label).not.toBeInTheDocument();
    })
});