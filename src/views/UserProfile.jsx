import React from "react";
import axios from 'axios';
import {GraphQLURL} from '../ipgraphql'

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  Row,
  Col
} from "reactstrap";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    profile: [],
    load : false
    };
    this.getinfoprofile = this.getinfoprofile.bind(this);
}
  getinfoprofile(){
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
          query: `query {
                      userById(id: ${localStorage.UsrID}) {
                  id
                  name
                  lastname
                  birthdate
                  email
                  }
           }`
      }
  }).then((result) => {
      console.log(result)
      if(result.data.data!=null){
        let data = this.state.profile;
        data[0] = result.data.data.userById.name;
        data[1] = result.data.data.userById.lastname;
        data[2] = result.data.data.userById.birthdate.substring(0, 10);;
        data[3] = result.data.data.userById.email;
        data[4] = "assets/img/2.jpg";
        //"assets/img/".concat("2",".jpg");
        this.setState({ profile:data, load:true});
      //this.notify(["success","Registro Exitoso"]);
      //window.location.pathname = '/mh/login'
      
      }else{
          //this.notify(["danger","Registro Fallido"]);    
      }

  }).catch((e) =>{
      console.log(e);
      //this.notify(["danger","Registro Fallido"]);  
      
  });
  }
  render() {
    if(!this.state.load){
      this.getinfoprofile();
      return(<>
      <div className="content"></div>
      </>)
    }else{
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
                    <a>
                      <img alt="..." src={require("assets/img/2.jpg")}/>
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
                    <div><label>Email: {this.state.profile[3]}</label></div>
                    <div><label>FN: {this.state.profile[2]}</label></div>
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
}

export default UserProfile;
