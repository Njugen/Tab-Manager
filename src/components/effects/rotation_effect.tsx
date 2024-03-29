import iRotationEffect from "../../interfaces/rotation_effect";


// Render a child component up or down

const RotationEffect = (props: iRotationEffect): JSX.Element => {
    const { children, rotated, display } = props;
    
    return (
        <div className={`${rotated === true ? "rotate-180" : "rotate-0"} ${display ? display : "block"} transition ease-in-out duration-75`}>
            { children }
        </div>
    ); 
}

export default RotationEffect;