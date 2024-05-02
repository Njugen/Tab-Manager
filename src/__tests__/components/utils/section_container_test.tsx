import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import randomNumber from "../../../tools/random_number";
import SectionContainer from "../../../components/utils/section_container";
import iSectionContainer from "../../../interfaces/section_container";
import { Provider } from "react-redux";
import { store } from "../../../redux-toolkit/store";

const mockExpandFn = jest.fn((val: boolean) => val);
const mockId = randomNumber().toString();
const mockTitle = randomNumber().toString();
const mockOption = <div data-testid="mock-options-area"></div>;
const mockChildren = <div data-testid="mock-child-section"></div>

window.scrollTo = jest.fn((e: any) => e)

afterEach(() => {
    jest.clearAllMocks();
})

describe("Test <SectionContainer>", () => {
    describe("When rendering with options area", () => {
        const props: iSectionContainer = {
            id: mockId,
            title: mockTitle,
            options: () => mockOption,
            onExpand: mockExpandFn,
            children: mockChildren,
            fullscreen: false
        }
        
        test("Full screen is turned off", () => {
            render(
                <Provider store={store}>
                    <SectionContainer {...props}>
                        {mockChildren}
                    </SectionContainer>
                </Provider>
            )
    
            let fullscreen = screen.queryByTestId("section-container-fullscreen");
            expect(fullscreen).not.toBeInTheDocument();
        })

        test("'title' prop is displayed in the heading", () => {
            render(
                <Provider store={store}>
                    <SectionContainer {...props} fullscreen={false}>
                        {mockChildren}
                    </SectionContainer>
                </Provider>
            )
    
            let section = screen.getByTestId("section-container");
            let heading = within(section).getByRole("heading");
            expect(heading).toHaveTextContent(mockTitle);
        })

        test("Options are provided by 'option' prop", () => {
            render(
                <Provider store={store}>
                    <SectionContainer {...props} fullscreen={false}>
                        {mockChildren}
                    </SectionContainer>
                </Provider>
            )
    
            let section = screen.getByTestId("section-container");
            let optionsArea = within(section).getByTestId("mock-options-area");
            expect(optionsArea).toBeInTheDocument();
        })
        
        test("There are child components in options area", () => {
            render(
                <Provider store={store}>
                    <SectionContainer {...props} fullscreen={false}>
                        {mockChildren}
                    </SectionContainer>
                </Provider>
            )
    
            let section = screen.getByTestId("section-container");
            let children = within(section).getByTestId("mock-child-section");
            expect(children).toBeInTheDocument();
        })

        test("Clicking the expand button triggers 'onExpand' callback", () => {
            render(
                <Provider store={store}>
                    <SectionContainer {...props} fullscreen={false}>
                        {mockChildren}
                    </SectionContainer>
                </Provider>
            )
    
            let section = screen.getByTestId("section-container");

            let expandButton = within(section).getByRole("button");
            let svg = within(expandButton).getByRole("img");
            fireEvent.click(svg);
            expect(mockExpandFn).toHaveBeenCalledWith(true)
        })

        test("Clicking the expand button hides ordinary section area", () => {
            render(
                <Provider store={store}>
                    <SectionContainer {...props} fullscreen={false}>
                        {mockChildren}
                    </SectionContainer>
                </Provider>
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
                <Provider store={store}>
                    <SectionContainer {...props} fullscreen={false}>
                        {mockChildren}
                    </SectionContainer>
                </Provider>
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
                <Provider store={store}>
                    <SectionContainer {...props} fullscreen={true}>
                        {mockChildren}
                    </SectionContainer>
                </Provider>
            )
    
            let fullscreen = screen.getByTestId("section-container-fullscreen");
            let heading = within(fullscreen).getByRole("heading");
            expect(heading).toHaveTextContent(mockTitle);
        })

        test("Fullscreen has options area", () => {
            render(
                <Provider store={store}>
                    <SectionContainer {...props} fullscreen={true}>
                        {mockChildren}
                    </SectionContainer>
                </Provider>
            )
    
            let fullscreen = screen.getByTestId("section-container-fullscreen");
            let optionsArea = within(fullscreen).getByTestId("mock-options-area");
            expect(optionsArea).toBeInTheDocument();
        })

        test("Fullscreen has child components", () => {
            render(
                <Provider store={store}>
                    <SectionContainer {...props} fullscreen={true}>
                        {mockChildren}
                    </SectionContainer>
                </Provider>
            )
    
            let fullscreen = screen.getByTestId("section-container-fullscreen");
            let children = within(fullscreen).getByTestId("mock-child-section");
            expect(children).toBeInTheDocument();
        })
        
        test("Section returns to normal once expand button is clicked", () => {
            render(
                <Provider store={store}>
                    <SectionContainer {...props} fullscreen={true}>
                        {mockChildren}
                    </SectionContainer>
                </Provider>
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
                <Provider store={store}>
                    <SectionContainer id={mockId} title={mockTitle} fullscreen={false} onExpand={mockExpandFn}>
                        {mockChildren}
                    </SectionContainer>
                </Provider>
            )
    
            let section = screen.getByTestId("section-container");
            
            let optionsArea = within(section).queryByTestId("mock-options-area");
            expect(optionsArea).not.toBeInTheDocument();
    
        })
    
        test("Renders without options area in full screen", () => {
            render(
                <Provider store={store}>
                    <SectionContainer id={mockId} title={mockTitle} onExpand={mockExpandFn} fullscreen={true}>
                        {mockChildren}
                    </SectionContainer>
                </Provider>
            )
    
            let fullscreen = screen.getByTestId("section-container-fullscreen");
    
            let optionsArea = within(fullscreen).queryByTestId("mock-options-area");
            expect(optionsArea).not.toBeInTheDocument();
        })
    })
});