import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col
} from "reactstrap";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {profile: ['Christian']};
}
  render() {
    return (
      <>
        <div className="content">
          <Row>
          <Col md="4">
              <Card className="card-user">
                <CardBody>
                  <CardText />
                  <div className="author">
                    <div className="block block-one" />
                  </div>
                  <div>
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                      <img alt="..." src={require("assets/img/Perfil.jpeg")}/>

                    </a>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="8">
              <Card>
                <CardHeader className="text-center">
                  <h1 className="title">Hola, mi nombre es {this.state.profile[0]}</h1>
                </CardHeader>
                <CardBody>
                  
                </CardBody>
                <CardFooter>

                </CardFooter>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default UserProfile;
