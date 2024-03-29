import { iSVG } from "../../interfaces/svg";

function ListIcon(props: iSVG): JSX.Element {
    const {size, fill} = props;

    return (<svg role="img" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size}><path fill={fill} d="M840-120H120v-200h720v200Zm0-260H120v-200h720v200Zm0-260H120v-200h720v200Z"/></svg>);
}

export default ListIcon;