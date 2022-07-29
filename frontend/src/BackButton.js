import {Button} from "react-bootstrap";
import './BackButton.css'
import styled from "styled-components";
import {Link} from "react-router-dom";

const BackLink = styled(Link)`
    text-decoration: none;
    color: #FC766AFF !important;
`;

export default function BackButton() {
    return <Button variant="primary" id="button-back" className={"button-back"}>
        <BackLink to="/">
            <i className="fa fa-chevron-left"></i> Back
        </BackLink>
    </Button>
}