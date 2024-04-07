import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import randomNumber from "../../../tools/random_number";
import PopupMessage from "../../../components/utils/popup_message";
import SectionContainer from "../../../components/utils/section_container";

const mockExpandFn = jest.fn((val: boolean) => val);
const mockId = randomNumber().toString();
const mockTitle = randomNumber().toString();
const mockOption = <div data-testid="mock-options-area"></div>;
const mockChildren = <div data-testid="mock-child-section"></div>

window.scrollTo = jest.fn((e: any) => e)

describe("Test <SectionContainer>", () => {
    test("Renders with options area, fullscreen feature works with callback", () => {
        render(
            <SectionContainer id={mockId} title={mockTitle} options={() => mockOption} onExpand={mockExpandFn}>
                {mockChildren}
            </SectionContainer>
        )

        let section = screen.getByTestId("section-container");
        let fullscreen = screen.queryByTestId("section-container-fullscreen");
        expect(fullscreen).not.toBeInTheDocument();

        let heading = within(section).getByRole("heading");
        expect(heading).toHaveTextContent(mockTitle);
        
        let optionsArea = within(section).getByTestId("mock-options-area");
        expect(optionsArea).toBeInTheDocument();

        let children = within(section).getByTestId("mock-child-section");
        expect(children).toBeInTheDocument();

        let expandButton = within(section).getByRole("button");
        let svg = within(expandButton).getByRole("img");
        fireEvent.click(svg);
        expect(mockExpandFn).toHaveBeenCalledWith(true)

        section = screen.queryByTestId("section-container")!;
        expect(section).not.toBeInTheDocument();

        fullscreen = screen.getByTestId("section-container-fullscreen");
        expect(fullscreen).toBeInTheDocument();

        heading = within(fullscreen).getByRole("heading");
        expect(heading).toHaveTextContent(mockTitle);
        
        optionsArea = within(fullscreen).getByTestId("mock-options-area");
        expect(optionsArea).toBeInTheDocument();

        children = within(fullscreen).getByTestId("mock-child-section");
        expect(children).toBeInTheDocument();

        expandButton = within(fullscreen).getByRole("button");
        svg = within(expandButton).getByRole("img");
        fireEvent.click(svg);
        expect(mockExpandFn).toHaveBeenCalledWith(false);

        section = screen.getByTestId("section-container");
        expect(section).toBeInTheDocument();

        fullscreen = screen.queryByTestId("section-container-fullscreen");
        expect(fullscreen).not.toBeInTheDocument();
    })

    test("Renders without options area, fullscreen feature works with no callback", () => {
        render(
            <SectionContainer id={mockId} title={mockTitle}>
                {mockChildren}
            </SectionContainer>
        )

        let section = screen.getByTestId("section-container");
        let fullscreen = screen.queryByTestId("section-container-fullscreen");
        expect(fullscreen).not.toBeInTheDocument();

        let heading = within(section).getByRole("heading");
        expect(heading).toHaveTextContent(mockTitle);
        
        let optionsArea = within(section).queryByTestId("mock-options-area");
        expect(optionsArea).not.toBeInTheDocument();

        let children = within(section).getByTestId("mock-child-section");
        expect(children).toBeInTheDocument();

        let expandButton = within(section).getByRole("button");
        let svg = within(expandButton).getByRole("img");
        fireEvent.click(svg);

        section = screen.queryByTestId("section-container")!;
        expect(section).not.toBeInTheDocument();

        fullscreen = screen.getByTestId("section-container-fullscreen");
        expect(fullscreen).toBeInTheDocument();

        heading = within(fullscreen).getByRole("heading");
        expect(heading).toHaveTextContent(mockTitle);

        children = within(fullscreen).getByTestId("mock-child-section");
        expect(children).toBeInTheDocument();

        expandButton = within(fullscreen).getByRole("button");
        svg = within(expandButton).getByRole("img");
        fireEvent.click(svg);

        section = screen.getByTestId("section-container");
        expect(section).toBeInTheDocument();

        fullscreen = screen.queryByTestId("section-container-fullscreen");
        expect(fullscreen).not.toBeInTheDocument();
    })
});