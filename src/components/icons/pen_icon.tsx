import { iSVG } from "../../interfaces/svg";

function PenIcon(props: iSVG): JSX.Element {
    const {size, fill} = props;

    return (<svg role="img" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size}><path fill={fill} d="M754.306-613.77 619.309-747.537l52.538-52.538q17.231-17.23 42.461-17.23 25.23 0 42.46 17.23l49.461 49.461q17.231 17.23 17.846 41.845.615 24.615-16.615 41.845l-53.154 53.154Zm-43.383 43.999-429.77 429.77H146.156v-134.998l429.769-429.77 134.998 134.998Z"/></svg>);
}

export default PenIcon;