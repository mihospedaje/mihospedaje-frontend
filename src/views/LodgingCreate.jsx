import React from 'react';
import axios from 'axios';
import { GraphQLURL } from '../ipgraphql'
import CardMedia from '@material-ui/core/CardMedia';
import { Row, Col, Card, CardBody, CardHeader, CardTitle, Button, Input, FormGroup, Form, CardFooter } from "reactstrap";
import NotificationAlert from "react-notification-alert";
import ReactFileReader from 'react-file-reader';
import ItemsCarousel from 'react-items-carousel';
import range from 'lodash/range';
import { defaulthome } from '../defaulthome';

export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lodging: [],
      load: false,
      charge: false,
      location: [],
      locationid: [],
      hourframe:[],
      id : null,
      uploadimagen: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.makepeticion = this.makepeticion.bind(this);
    this.loadimage = this.loadimage.bind(this);
  }
  handleChange(event) {
    let data = this.state.lodging;
    data[parseInt(event.target.id, 10)] = event.target.value;
    this.setState({ lodging: data });
  }
  handleCheck(event) {
    let data = this.state.lodging;
    if (data[parseInt(event.target.id, 10)] === 1) {
      data[parseInt(event.target.id, 10)] = 0
    } else {
      data[parseInt(event.target.id, 10)] = 1
    }
    if (data[parseInt(event.target.id, 10)] == null) {
      data[parseInt(event.target.id, 10)] = 1
    }
    this.setState({ lodging: data });
  }
  changeActiveItem = (activeItemIndex) => this.setState({ activeItemIndex });
  

  componentWillMount() {
    this.setState({
      children: [],
      activeItemIndex: 0,
    });
    setTimeout(() => {
      this.setState({
        children: range(1).map(i => <CardMedia key={i}
          image= {'data:image/png;base64' + defaulthome}
          title="Mi Hospedaje"
          style={{ height: 400 }}
        />)
      })
    }, 100);
  }
  componentWillMount1() {
    this.setState({
      children: [],
      activeItemIndex: 0,
    });
    setTimeout(() => {
      this.setState({
        children: range(this.state.uploadimagen.length).map(i => <CardMedia key={i}
          image = {'data:image/png;base64' + this.state.uploadimagen[i]}
          title="hospedaje"
          style={{ height: 400 }}
        />)
      })
    }, 100);
  }

  // INFORMACION

  getlocation() {
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
        query: `query {
                     allLocations{
                        location_id
                        country
                        city
                   }
           }
                    `
      }
    }).then((result) => {
      var info = result.data.data.allLocations
      let data = this.state.location
      let datid = this.state.locationid
      for (let i = 0; i < info.length; i++) {
        data[i] = (info[i].city).concat(", ", info[i].country)
        datid[i] = info[i].location_id
      }
      this.componentWillMount();
      this.setState({ load: true, location: data, locationid: datid });

    }).catch((e) => {
      console.log(e)
    });
  };

  makepeticion() {
    let complete = true;
    for (let i = 0; i < 7; i++) {
      if (this.state.lodging[i] === undefined || this.state.lodging[i] === "") {
        complete = false;
      }
    }
    for (let i = 8; i < 12; i++) {
      if (this.state.lodging[i] === undefined || this.state.lodging[i] === "") {
        complete = false;
      }else{
        this.state.lodging[i] = parseInt(this.state.lodging[i], 10)
      }
    }
    if (this.state.lodging[12] !== undefined) {
      if(this.state.lodging[12]!=="-1"){
        this.state.lodging[12] = parseInt(this.state.lodging[12], 10)
      }else{
        complete=false
      }
    }else{
      complete = false
    }
    if (this.state.lodging[13] !== undefined) {
      if(this.state.lodging[13]!=="-1"){
        this.state.lodging[13] = parseInt(this.state.lodging[13], 10)
      }else{
        complete=false
      }
    }else{
      complete = false
    }

    if (this.state.lodging[20] === undefined || this.state.lodging[20] === "") {
      complete = false;
    }
    if (this.state.lodging[21] === undefined || this.state.lodging[21] === "") {
      complete = false;
    }
    if (this.state.lodging[7] === undefined) {
      this.state.lodging[7] = ""
    }
    if (this.state.lodging[4] !== undefined) {
      if(this.state.lodging[4]!=="-1"){
        this.state.lodging[4] = this.state.locationid[parseInt(this.state.lodging[4], 10)]
      }else{
        complete=false
      }
    }
    if (this.state.lodging[2] !== undefined) {
      if(this.state.lodging[2]!=="-1"){
      this.state.lodging[2] = parseInt(this.state.lodging[2], 10)
    }else{
      complete=false
    }
    }
    if (this.state.lodging[3] !== undefined) {
      if(this.state.lodging[3]!=="-1"){
      this.state.lodging[3] = parseInt(this.state.lodging[3], 10)
    }else{
      complete=false
    }
    }
    if (this.state.lodging[5] !== undefined) {
      if (this.state.lodging[5] !== "-1") {
      this.state.lodging[5] = parseInt(this.state.lodging[5], 10)
    }else{
      complete=false
    }
    }
    if (this.state.lodging[12] !== undefined) {
      if (this.state.lodging[12] !== "-1") {
      this.state.lodging[12] = parseInt(this.state.lodging[12], 10)
    }else{
      complete=false
    }
    }
    if (this.state.lodging[13] !== undefined) {
      if (this.state.lodging[13] !== "-1") {
      this.state.lodging[13] = parseInt(this.state.lodging[13], 10)
    }else{
      complete=false
    }
    }
    for (let i = 14; i < 20; i++) {
      if (this.state.lodging[i] === undefined) {
        this.state.lodging[i] = 0
      }
    }
    if (complete) {
      axios({
        url: GraphQLURL,
        method: 'post',
        data: {
          query: `mutation{
  createLodging(lodging:{
    host_id: ${this.state.id}
    lodging_name: "${this.state.lodging[0]}"
    phone_number: ${this.state.lodging[1]}
    lodging_type: ${this.state.lodging[2]}
    lodging_provide: ${this.state.lodging[3]}
    location_id: ${this.state.lodging[4]}
    is_exclusive: ${this.state.lodging[5]}
    address: "${this.state.lodging[6]}",
    extra_address: "${this.state.lodging[7]}",
    guest_number: ${this.state.lodging[8]}
    rooms_number: ${this.state.lodging[9]}
    beds_number: ${this.state.lodging[10]}
    bathrooms_number: ${this.state.lodging[11]}
    time_arrive_start: ${this.state.lodging[12]}
    time_arrive_end: ${this.state.lodging[13]}
    with_wifi: ${this.state.lodging[14]}
    with_cable_tv: ${this.state.lodging[15]}
    with_air_conditioning: ${this.state.lodging[16]}
    with_phone: ${this.state.lodging[17]}
    with_kitchen: ${this.state.lodging[18]}
    with_cleaning_items: ${this.state.lodging[19]}
    price_per_person_and_nigth: ${this.state.lodging[20]}
    lodging_description: "${this.state.lodging[21]}"
    lodging_class: 0,
    is_company: 0,
    time_before_guest: 0,
  }){
    lodging_id
  }
}
                    `
        }
      }).then((result) => {
        if (result.data.data !== null) {
          let a = result.data.data.createLodging.lodging_id
          this.loadimage(a);          

        } else {
          this.notify(["danger", "Registro Fallido"]);
        }

      }).catch((e) => {
        console.log(e)
        this.notify(["danger", "Registro Fallido"]);

      });
    } else {
      this.notify(["danger", "Datos Incompletos"]);
    }
  };
  notify = place => {
    var type = place[0];
    var options = {};
    options = {
      place: "tc",
      message: (
        <div>
          <div>
            {place[1]}
          </div>
        </div>
      ),
      type: type,
      icon: "tim-icons icon-bell-55",
      autoDismiss: 7
    };
    this.refs.notificationAlert.notificationAlert(options);
  };
  loadimage(a) {
    if (this.state.uploadimagen.length!=0) {
      axios({
        url: GraphQLURL,
        method: 'post',
        data: {
          query: `mutation{
            createLodging_image(lodging_image:{
              lodging_id: ${a}
              url: "${this.state.uploadimagen[0]}"    
          }){
            lodging_image_id
      }
    }
                    `
        }
      }).then((result) => {
        if (result.data.data !== null) {
          let data = this.state.uploadimagen;
          data = data.splice(1,1);
          this.setState({ uploadimagen: data});
          this.loadimage(a);          
        } else {
          this.notify(["danger", "Registro Fallido"]);
        }

      }).catch((e) => {
        console.log(e)
        this.notify(["danger", "Registro Fallido"]);

      });
    } else {
      this.notify(["success", "Registro Exitoso"]);
      localStorage.setItem('View_Lodging', parseInt(a));
      window.location.pathname = '/mh/lodging'
    }
  };
  getid(email) {
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
        query: `query{
          userByEmail(email:${email}){
            id
          }
        }`
      }
    }).then((result) => {
      if(result.data.data != null){
        this.setState({id:result.data.data.userByEmail.id});
        this.getlocation();
      }
    }).catch((e) => {
      console.log(e);
    });
  }
  validatetoken() {
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
        query: `mutation{
          validate(credentials:{
            token:"${localStorage.jwt}" 
          }){
            message
          }
        }`
      }
    }).then((result) => {
      if (result.data.data.validate.message === "Token Valido") {
        var jwt = require("jsonwebtoken");
        var decoded = jwt.decode(localStorage.jwt);
        var email = (decoded.body.split(",")[0]).split(":")[1];
        this.getid(email);
      } else {
        localStorage.setItem('View_User', "");
        localStorage.setItem('View_Lodging', "");
        localStorage.setItem('jwt', "");
        localStorage.setItem('IsLogged', false);
        window.location.pathname = 'mh/login'
      }
    }).catch((e) => {
      console.log(e);
      localStorage.setItem('View_User', "");
      localStorage.setItem('View_Lodging', "");
      localStorage.setItem('jwt', "");
      localStorage.setItem('IsLogged', false);
      window.location.pathname = 'mh/login'
    });
  }
  handleFiles = (files) => {
    let data = this.state.uploadimagen;
    const data1 = data.splice(1,1);
    data = [];
    for(let i = 0; i< files.base64.length;i++){
      data[i] = 'data:image/png;base64' + files.base64[i];

    }
    this.setState({ uploadimagen: data});
    this.componentWillMount1();
  }

  render() {
    const {
      activeItemIndex,
      children,
    } = this.state;
    if (!this.state.load) {
      if (!this.state.charge) {
        let horas = this.state.hourframe;
        for(let i = 0; i<16;i++){
          horas[i] = i+7;
        }
        this.validatetoken();
        this.setState({ charge: true , hourframe: horas });
      }
      return (<>
        <div className="content">

        </div>

      </>)
    } else {
      return (
        <>
          <div className="content">
            <div className="react-notification-alert-container">
              <NotificationAlert ref="notificationAlert" />
            </div>
            <Row>

              <Col lg="5">
                <Card className="card-user">
                  <CardBody>
                    <ItemsCarousel
                      // Carousel configurations
                      numberOfCards={1}
                      gutter={0}
                      showSlither={true}
                      firstAndLastGutter={true}
                      freeScrolling={false}
                      // Active item configurations
                      requestToChangeActive={this.changeActiveItem}
                      activeItemIndex={activeItemIndex}
                      activePosition={'center'}
                      chevronWidth={150}
                      chevronHeigth={150}
                      rightChevron={' '}
                      leftChevron={' '}
                      outsideChevron={false}
                    >
                      {children}
                    </ItemsCarousel>
                    {
                          this.state.uploadimagen.length <= 1 ? null : (
                            <label>Deslize el carrusel para ver todas las fotos cargadas en la plataforma</label>
                          )
                    }
                   
                    <ReactFileReader fileTypes = {[".jpeg", ".png", ".jpg"]} base64={true} multipleFiles={true} handleFiles={this.handleFiles}>
                        <Button className="btn-fill" color="primary">Upload</Button>
                    </ReactFileReader>
                  </CardBody>                  
                </Card>
              </Col>
              <Col lg="7">
                <Card>
                  <CardHeader className=" text-center mb-0">
                    <h5 className="card-category">MiHospedaje</h5>
                    <CardTitle className="text-center" tag="h3">
                      Reg??stre su Alojamiento
                                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Form>
                      <Row>
                        <Col>
                          <FormGroup>
                            <label>Nombre del Alojamiento</label>
                            <Input id="0" placeholder="Nombre" type="text" onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <label>Tel??fono</label>
                            <Input id="1" placeholder="Tel??fono" type="number" onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <label>Tipo de Alojamiento</label>
                            <Input id="2" placeholder="Nombre" type="select" onChange={this.handleChange}>
                              <option value = "-1" defaultValue>Seleccione una Opcion</option>
                              <option value="1">Departamento</option>
                              <option value="2">Casa</option>
                              <option value="3">Vivienda Anexa</option>
                              <option value="4">Alojamiento ??nico</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <label>??De qu?? dispondr??n los hu??spedes?</label>
                            <Input id="3" placeholder="Tel??fono" type="select" onChange={this.handleChange}>
                              <option value = "-1" defaultValue>Seleccione una Opcion</option>
                              <option value="1">Alojamiento Entero</option>
                              <option value="2">Habitaci??n Privada</option>
                              <option value="3">Habitaci??n Compartida</option>
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <label>Ubicaci??n</label>
                            <Input id="4" placeholder="Nombre" type="select" onChange={this.handleChange}>
                              <option value = "-1" defaultValue>Seleccione una Opcion</option>
                              {this.state.location.map((prop, key) => {
                                return (<option key={key} value={key} >{prop}</option>)
                              })
                              }

                            </Input>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <label>??El espacio es ??nico para alojamiento</label>
                            <Input id="5" placeholder="Nombre" type="select" onChange={this.handleChange}>
                              <option value = "-1" defaultValue>Seleccione una Opcion</option>
                              <option value="1">S??, est?? pensado para los hu??spedes</option>
                              <option value="0">No, aqu?? tengo mis pertenencias</option>
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <label>Direcci??n</label>
                            <Input id="6" placeholder="Direcci??n" type="text" onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <label>Extra Direcci??n</label>
                            <Input id="7" placeholder="Extra Direcci??n" type="text" onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col>
                          <FormGroup>
                            <label>??A cuantos hu??spedes puedes alojar?</label>
                            <Input id="8" type="number" onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <label>??Cu??ntas habitaciones hay disponibles?</label>
                            <Input id="9" type="number" onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <label>??Cu??ntas camas hay disponibles?</label>
                            <Input id="10" type="number" onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <label>??Cu??ntos ba??os hay disponibles?</label>
                            <Input id="11" type="number" onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                        <label>??Cu??ndo pueden llegar los hu??spedes?</label>
                        </Col>
                        </Row>
                      <Row>
                        <Col>
                         
                          <FormGroup>
                            <label>Desde</label>
                            <Input id="12" type="select" onChange={this.handleChange}>
                            <option value = "-1" defaultValue>Seleccione una Opcion</option>
                            <option value = "0" >Flexible</option>
                              {this.state.hourframe.map((prop, key) => {
                                return (<option key={key} value={key+1} >{prop}:00</option>)
                              })
                              }
                              </Input>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <label>Hasta</label>
                            <Input id="13" type="select" onChange={this.handleChange}>
                            <option value = "-1" defaultValue>Seleccione una Opcion</option>
                            <option value = "0" >Flexible</option>
                              {this.state.hourframe.map((prop, key) => {
                                return (<option key={key} value={key+1} >{prop+1}:00</option>)
                              })
                              }
                            </Input>
                          </FormGroup>
                        </Col>
                        </Row>
                        <Row>
                        <Col>
                        <label>??Con qu?? servicios cuenta el alojamiento?</label>
                        </Col>
                        </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <Col>
                              <label>
                                <Input id="14" type="checkbox" onChange={this.handleCheck} />
                                Wifi</label>
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Col>
                              <label>
                                <Input id="15" type="checkbox" onChange={this.handleCheck} />
                                TV Cable</label>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <Col>
                              <label>
                                <Input id="16" type="checkbox" onChange={this.handleCheck} />
                                Aire Acondicionado</label>
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Col>
                              <label>
                                <Input id="17" type="checkbox" onChange={this.handleCheck} />
                                Tel??fono</label>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <Col>
                              <label>
                                <Input id="18" type="checkbox" onChange={this.handleCheck} />
                                Cocina</label>
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Col>
                              <label>
                                <Input id="19" type="checkbox" onChange={this.handleCheck} />
                                Art??culos de Limpieza</label>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <label>??Cual ser?? el precio por noche por persona?</label>
                            <Input id="20" type="number" onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <label>Describe tu Alojamiento</label>
                            <Input id="21" type="text" onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                      </Row>




                    </Form>
                  </CardBody>
                  <CardFooter className="text-center">
                    <Button className="btn-fill" color="primary" type="submit" onClick={this.makepeticion}>
                      Registrar Alojamiento
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

} 