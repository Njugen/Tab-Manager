import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import randomNumber from "../../../tools/random_number";
import SectionContainer from "../../../components/utils/section_container";

const mockExpandFn = jest.fn((val: boolean) => val);
const mockId = randomNumber().toString();
const mockTitle = randomNumber().toString();
const mockOption = <div data-testid="mock-options-area"></div>;
const mockChildren = <div data-testid="mock-child-section"></div>

window.scrollTo = jest.fn((e: any) => e)

describe("Test <SectionContainer>", () => {
    describe("When rendering with options area", () => {
        test("Full screen is turned off", () => {
            render(
                <SectionContainer id={mockId} title={mockTitle} options={() => mockOption} onExpand={mockExpandFn}>
                    {mockChildren}
                </SectionContainer>
            )
    
            let section = screen.getByTestId("section-container");
            let fullscreen = screen.queryByTestId("section-container-fullscreen");
            expect(fullscreen).not.toBeInTheDocument();
        })

        test("Title props is displayed in the heading", () => {
            render(
                <SectionContainer id={mockId} title={mockTitle} options={() => mockOption} onExpand={mockExpandFn}>
                    {mockChildren}
                </SectionContainer>
            )
    
            let section = screen.getByTestId("section-container");
            let heading = within(section).getByRole("heading");
            expect(heading).toHaveTextContent(mockTitle);
        })

        test("Option area exists", () => {
            render(
                <SectionContainer id={mockId} title={mockTitle} options={() => mockOption} onExpand={mockExpandFn}>
                    {mockChildren}
                </SectionContainer>
            )
    
            let section = screen.getByTestId("section-container");
            let optionsArea = within(section).getByTestId("mock-options-area");
            expect(optionsArea).toBeInTheDocument();
        })
        
        test("There are child components in options area", () => {
            render(
                <SectionContainer id={mockId} title={mockTitle} options={() => mockOption} onExpand={mockExpandFn}>
                    {mockChildren}
                </SectionContainer>
            )
    
            let section = screen.getByTestId("section-container");
            let optionsArea = within(section).getByTestId("mock-options-area");
            let children = within(section).getByTestId("mock-child-section");
            expect(children).toBeInTheDocument();
        })

        test("Clicking the expand button triggers expand callback", () => {
            render(
                <SectionContainer id={mockId} title={mockTitle} options={() => mockOption} onExpand={mockExpandFn}>
                    {mockChildren}
                </SectionContainer>
            )
    
            let section = screen.getByTestId("section-container");

            let expandButton = within(section).getByRole("button");
            let svg = within(expandButton).getByRole("img");
            fireEvent.click(svg);
            expect(mockExpandFn).toHaveBeenCalledWith(true)
        })

        test("Clicking the expand button hides ordinary section area", () => {
            render(
                <SectionContainer id={mockId} title={mockTitle} options={() => mockOption} onExpand={mockExpandFn}>
                    {mockChildren}
                </SectionContainer>
            )
    
            let section = screen.getByTestId("section-container");
            let expandButton = within(section).getByRole("button");
            let svg = within(expandButton).getByRole("img");
            fireEvent.click(svg);
    
            section = screen.queryByTestId("section-container")!;
            expect(section).not.toBeInTheDocument();
        })

        test("Clicking the expand button triggers the component's fullscreen layer", () => {
            render(
                <SectionContainer id={mockId} title={mockTitle} options={() => mockOption} onExpand={mockExpandFn}>
                    {mockChildren}
                </SectionContainer>
            )
    
            let section = screen.getByTestId("section-container");
            let expandButton = within(section).getByRole("button");
            let svg = within(expandButton).getByRole("img");
            fireEvent.click(svg);
    
            let fullscreen = screen.getByTestId("section-container-fullscreen");
            expect(fullscreen).toBeInTheDocument();
    
        })

        test("Full screen layer has heading", () => {
            render(
                <SectionContainer id={mockId} title={mockTitle} options={() => mockOption} onExpand={mockExpandFn} initFullscreen={true}>
                    {mockChildren}
                </SectionContainer>
            )
    
            let fullscreen = screen.getByTestId("section-container-fullscreen");
            let heading = within(fullscreen).getByRole("heading");
            expect(heading).toHaveTextContent(mockTitle);
        })

        test("Fullscreen has options area", () => {
            render(
                <SectionContainer id={mockId} title={mockTitle} options={() => mockOption} onExpand={mockExpandFn} initFullscreen={true}>
                    {mockChildren}
                </SectionContainer>
            )
    
            let fullscreen = screen.getByTestId("section-container-fullscreen");
            let optionsArea = within(fullscreen).getByTestId("mock-options-area");
            expect(optionsArea).toBeInTheDocument();
        })

        test("Fullscreen has child components", () => {
            render(
                <SectionContainer id={mockId} title={mockTitle} options={() => mockOption} onExpand={mockExpandFn} initFullscreen={true}>
                    {mockChildren}
                </SectionContainer>
            )
    
            let fullscreen = screen.getByTestId("section-container-fullscreen");
            let children = within(fullscreen).getByTestId("mock-child-section");
            expect(children).toBeInTheDocument();
        })
        
        test("Section returns to normal once expand button is clicked", () => {
            render(
                <SectionContainer id={mockId} title={mockTitle} options={() => mockOption} onExpand={mockExpandFn} initFullscreen={true}>
                    {mockChildren}
                </SectionContainer>
            )

            let fullscreen: any = screen.getByTestId("section-container-fullscreen");
    
            let expandButton = within(fullscreen).getByRole("button");
            let svg = within(expandButton).getByRole("img");
            fireEvent.click(svg);
    
            let section = screen.getByTestId("section-container");
            expect(section).toBeInTheDocument();

            fullscreen = screen.queryByTestId("section-container-fullscreen");
            expect(fullscreen).not.toBeInTheDocument();
        })

        test("Renders without options area", () => {
            render(
                <SectionContainer id={mockId} title={mockTitle} onExpand={mockExpandFn}>
                    {mockChildren}
                </SectionContainer>
            )
    
            let section = screen.getByTestId("section-container");
            
            let optionsArea = within(section).queryByTestId("mock-options-area");
            expect(optionsArea).not.toBeInTheDocument();
    
        })
    
        test("Renders without options area in full screen", () => {
            render(
                <SectionContainer id={mockId} title={mockTitle} onExpand={mockExpandFn} initFullscreen={true}>
                    {mockChildren}
                </SectionContainer>
            )
    
            let fullscreen = screen.getByTestId("section-container-fullscreen");
    
            let optionsArea = within(fullscreen).queryByTestId("mock-options-area");
            expect(optionsArea).not.toBeInTheDocument();
        })
    })
});