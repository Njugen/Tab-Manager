import { iFormField } from "../../interfaces/form_field";

/*
    Form field encapsulates other component(s)
    
    Offers a label and a description for the encapsulated component (usually input or textarea, but may
    be something else if necessary).

    If there is an error recorded by the parent component, the label will change to red.
*/
const FormField = (props: iFormField): JSX.Element => {
    const { label, description, children, error } = props;
    
    return (
        <div className="mb-12 md:flex md:flex-row items-center">
            <div className={`sm:w-full md:w-2/5`}>
                <h4 data-testid={`error-${error}`} className={`font-semibold text-lg mb-1 ${error && "text-red-500"}`}>{label}</h4>
                <p className={`text-sm leading-6 text-tbfColor-darkergrey text-start ${error && "text-red-500"}`}>
                    {description}
                </p>
            </div>
            <div className="sm:w-full md:w-3/5 md:ml-24 my-4">
                { children }
            </div>
        </div>
    ); 
}

export default FormField;