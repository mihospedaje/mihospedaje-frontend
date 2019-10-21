import React from "react";
import axios from 'axios';
// reactstrap components
import {
    Card, CardHeader, CardBody, CardTitle, Row, Col, FormGroup,
    Form, Input, Button, CardFooter
} from "reactstrap";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {datalogin: ['']};
    
        this.handleChange = this.handleChange.bind(this);
        this.login = this.login.bind(this);
    }
    handleChange(event) {
        let data = this.state.datalogin;
        data[parseInt(event.target.id, 10)] = event.target.value;
        this.setState({ datalogin:data});
        console.log(this.state.datalogin);
      }


    login(){
        /*
        axios({
            url: 'http://3.132.9.148:5000/graphql',
            method: 'post',
            data: {
                query: `mutation {
                            createUser(user: {
                            name: "${this.state.register[0]}"
                            lastname: "${this.state.register[1]}"
                            birthdate: "${this.state.register[4]}"
                            email: "${this.state.register[2]}"
                            password: "${this.state.register[3]}"
                            idrole:1
                            }) {
                            name
                            }
                        }
                        `
            }
        }).then((result) => {
            console.log(result.data.data.allUsers)
        }).catch((e) =>{
            console.log(e)
        });
        */
       console.log(this.state.datalogin);
       localStorage.setItem('UsrID', parseInt(this.state.datalogin[0], 10));
       window.location.pathname = 'mh/profile'
    };

    render() {
        return (
            <>
                <div className="content">
                    <Row className="justify-content-center">
                        <Col md="5">
                            <Card >
                                <CardHeader className="text-center mb-0">
                                    <h5 className="card-category">MiHospedaje</h5>
                                    <CardTitle tag="h3">
                                        Iniciar Sesión
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <FormGroup>
                                            <label> Correo Electronico</label>
                                            <Input id="0" placeholder="email@email.com" type="email" onChange={this.handleChange} />
                                        </FormGroup>
                                        <FormGroup>
                                            <label> Contraseña</label>
                                            <Input id="1" type="password" onChange={this.handleChange}/>
                                        </FormGroup>
                                    </Form>
                                </CardBody>
                                <CardFooter className="text-center">
                                    <Button className="btn-fill" color="primary" type="submit" onClick={this.login}>
                                        Iniciar Sesion
                  </Button>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </div>

            </>
        );
    }
}

export default Register;
