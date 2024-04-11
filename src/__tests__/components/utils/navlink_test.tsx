import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import CircleButton from '../../../components/utils/circle_button';
import randomNumber from "../../../tools/random_number";
import FormField from "../../../components/utils/form_field";
import Group from "../../../components/utils/group";
import Navlink from "../../../components/utils/navlink";

 
const mockChild = <img src="/favicon.ico" alt="test" data-testid="mock-child" />
const mockUrl = "http://google.com";
const mockFn = jest.fn();
const mockLabel = randomNumber().toString();

describe("Test <Navlink>", () => {
    test("Link shows label", () => {
        render(
            <Navlink url={mockUrl} label={mockLabel} onClick={mockFn}>
                {mockChild}
            </Navlink>
        )

        const link = screen.getByRole("link");
        expect(link).toHaveTextContent(mockLabel);
    });

    test("Link has url in href attribue", () => {
        render(
            <Navlink url={mockUrl} label={mockLabel} onClick={mockFn}>
                {mockChild}
            </Navlink>
        )

        const link = screen.getByRole("link");  
        expect(link).toHaveAttribute("href", mockUrl);
    });

    test("Link has child component", () => {
        render(
            <Navlink url={mockUrl} label={mockLabel} onClick={mockFn}>
                {mockChild}
            </Navlink>
        )

        const link = screen.getByRole("link");
        const child = within(link).getByTestId("mock-child");
        expect(child).toBeInTheDocument()
    });

    test("Clicking the link triggers callback", () => {
        render(
            <Navlink url={mockUrl} label={mockLabel} onClick={mockFn}>
                {mockChild}
            </Navlink>
        )

        const link = screen.getByRole("link");
        fireEvent.click(link);
        expect(mockFn).toHaveBeenCalled();
    });
});