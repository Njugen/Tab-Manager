import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import CircleButton from '../../../components/utils/circle_button';
import randomNumber from "../../../tools/random_number";
import FormField from "../../../components/utils/form_field";
import Group from "../../../components/utils/group";

const mockDesc = randomNumber().toString();
const mockChild = <img src="/favicon.ico" alt="test" data-testid="mock-child" />

describe("Test <Group>", () => {
    test("Renders ok", () => {
        render(
            <Group desc={mockDesc}>
                {mockChild}
            </Group>
        )

        const desc = screen.getByText(mockDesc);
        expect(desc).toBeVisible();

        const child = screen.getByTestId("mock-child");
        expect(child).toBeInTheDocument();
    })
});