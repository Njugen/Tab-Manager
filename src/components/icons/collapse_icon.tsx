import { iSVG } from "../../interfaces/svg";

function CollapseIcon(props: iSVG): JSX.Element {
    const {size, fill} = props;

    return (<svg role="img" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size}><path fill={fill} d="m283-345-43-43 240-240 240 239-43 43-197-197-197 198Z"/></svg>);
}

export default CollapseIcon;