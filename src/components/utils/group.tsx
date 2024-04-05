import iGroup from "../../interfaces/group";

/*
    Encapsulate other components and adds a label/description string on top.
*/

const Group = (props: iGroup): JSX.Element => {
    const { desc, children } = props;

    return (
        <div className="py-3">
            <p className="text-xs text-right font-semibold">
                {desc}
            </p>
            {children}
        </div>
    ); 
}

export default Group;