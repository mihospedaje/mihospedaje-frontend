import React from 'react';
import axios from 'axios';
import { GraphQLURL } from '../ipgraphql'
import CardMedia from '@material-ui/core/CardMedia';
import { Row, Col, Card, CardBody, CardHeader, CardTitle, Button, Input, FormGroup, Form, CardFooter } from "reactstrap";
import NotificationAlert from "react-notification-alert";
import ReactFileReader from 'react-file-reader';
import ItemsCarousel from 'react-items-carousel';
import range from 'lodash/range';
import {defaulthome} from '../defaulthome';

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
      images:[],
      idimag:[]
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.makepeticion = this.makepeticion.bind(this);
  }
  handleChange(event) {
    let data = this.state.lodging;
    data[parseInt(event.target.id, 10)] = event.target.value;
    this.setState({ lodging: data });
  }
  handleCheck(event) {
    let data = this.state.lodging;
    if (data[parseInt(event.target.id, 10)] == 1) {
      data[parseInt(event.target.id, 10)] = 0
    } else {
      data[parseInt(event.target.id, 10)] = 1
    }
    if (data[parseInt(event.target.id, 10)] == null) {
      data[parseInt(event.target.id, 10)] = 1
    }
    this.setState({ lodging: data });
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
      this.getlodging();
      this.setState({location: data, locationid: datid });

    }).catch((e) => {
      console.log(e)
    });
  };

  getlodging(){
    axios({
        url: GraphQLURL,
        method: 'post',
        data: {
          query: `query{
            lodgingById(id:${localStorage.Update_Lodging}){
              host_id
              lodging_name
              phone_number
              lodging_type
              lodging_provide
              location_id
              is_exclusive
              address
              extra_address
              guest_number
              rooms_number
              beds_number
              bathrooms_number
              time_arrive_start
              time_arrive_end
              with_wifi
              with_cable_tv
              with_air_conditioning
              with_phone
              with_kitchen
              with_cleaning_items
              price_per_person_and_nigth
              lodging_description
              lodging_id
              lodging_class
              is_company
              time_before_guest
            }
          } `
        }
      }).then((result) => {
        if (result.data.data != null) {
          let info = result.data.data.lodgingById
          let data = this.state.lodging
          data[0] = info.lodging_name
          data[1] = info.phone_number
          data[2] = info.lodging_type
          data[3] = info.lodging_provide
          data[4] = this.state.locationid.indexOf(info.location_id);
          data[5] = info.is_exclusive
          data[6] = info.address
          data[7] = info.extra_address
          data[8] = info.guest_number
          data[9] = info.rooms_number
          data[10] = info.beds_number
          data[11] = info.bathrooms_number
          data[12] = info.time_arrive_start
          data[13] = info.time_arrive_end
          data[14] = info.with_wifi
          data[15] = info.with_cable_tv
          data[16] = info.with_air_conditioning
          data[17] = info.with_phone
          data[18] = info.with_kitchen
          data[19] = info.with_cleaning_items
          data[20] = info.price_per_person_and_nigth
          data[21] = info.lodging_description
          data[22] = info.host_id
          data[23] = info.lodging_id
          this.setState({lodging:data})
          this.getImages()
          
        } else {
          this.notify(["danger", "Registro Fallido"]);
        }

      }).catch((e) => {
        console.log(e)
        this.notify(["danger", "Registro Fallido"]);

      });
  }
  changeActiveItem = (activeItemIndex) => this.setState({ activeItemIndex });
  
  componentWillMount() {
    this.setState({
      children: [],
      activeItemIndex: 0,
    });
    setTimeout(() => {
      this.setState({
        children: range(this.state.images.length).map(i => <CardMedia key={i}
          image= {'data:image/png;base64' + this.state.images[i]}
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
        children: range(1).map(i => <CardMedia key={i}
          image= {'data:image/png;base64' + defaulthome}
          title="Mi Hospedaje"
          style={{ height: 400 }}
        />)
      })
    }, 100);
  }
  getImages(){
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
          query: `query {
                  lodging_imageByLodgingid(lodging_id:${localStorage.Update_Lodging}) {
                  lodging_image_id
                  url
                  }
           }`
      }
  }).then((result) => {
    localStorage.setItem('Update_Lodging', null);
        
      if(result.data.data!=null){
        let data = this.state.images;
        let data1 = this.state.idimag;
        let info = result.data.data.lodging_imageByLodgingid;
        for(let i = 0; i<info.length;i++){
          data[i] = info[i].url;
          data1[i] = info[i].lodging_image_id;
        }
        this.setState({load: true, images:data, idimag:data1});
        if (info.length===0){
          this.componentWillMount1();
        }else{
          this.componentWillMount();
        }
      
      }else{
 
      }

  }).catch((e) =>{
    console.log(e);
  });
  }

  makepeticion() {
    let complete = true;
    for (let i = 0; i < 7; i++) {
      if (this.state.lodging[i] == undefined) {
        complete = false;
      }
    }
    for (let i = 8; i < 14; i++) {
      if (this.state.lodging[i] == undefined) {
        complete = false;
      }
    }
    if (this.state.lodging[20] == undefined) {
      complete = false;
    }
    if (this.state.lodging[21] == undefined) {
      complete = false;
    }
    if (this.state.lodging[7] == undefined) {
      this.state.lodging[7] = ""
    }
    if (this.state.lodging[4] != undefined) {
      this.state.lodging[4] = this.state.locationid[parseInt(this.state.lodging[4], 10)]
    }
    if (this.state.lodging[2] != undefined) {
      this.state.lodging[2] = parseInt(this.state.lodging[2], 10)
    }
    if (this.state.lodging[3] != undefined) {
      this.state.lodging[3] = parseInt(this.state.lodging[3], 10)
    }
    if (this.state.lodging[5] != undefined) {
      this.state.lodging[5] = parseInt(this.state.lodging[5], 10)
    }
    if (this.state.lodging[12] != undefined) {
      this.state.lodging[12] = parseInt(this.state.lodging[12], 10)
    }
    if (this.state.lodging[13] != undefined) {
      this.state.lodging[13] = parseInt(this.state.lodging[13], 10)
    }
    for (let i = 14; i < 20; i++) {
      if (this.state.lodging[i] == undefined) {
        this.state.lodging[i] = 0
      }
    }

    if (complete) {
      axios({
        url: GraphQLURL,
        method: 'post',
        data: {
          query: `mutation{
            updateLodging(id:${this.state.lodging[23]},lodging:{
    host_id: ${this.state.lodging[22]}
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
        if (result.data.data != null) {
          let a = result.data.data.updateLodging.lodging_id
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

  loadimage(a) {
    if (this.state.images.length!=0) {
      if(this.state.idimag.length!=0){
        axios({
          url: GraphQLURL,
          method: 'post',
          data: {
            query: `mutation{
              updateLodging_image(id:${this.state.idimag[0]},lodging_image:{
                lodging_id: ${a}
                url: "${this.state.images[0]}"   
              }){
                lodging_image_id
          }
        }
                        `
          }
        }).then((result) => {
          if (result.data.data != null) {
            let data = this.state.images;
            data = data.splice(1,1);
            let data1 = this.state.idimag;
            data1 = data1.splice(1,1);            
            this.setState({ images: data, idimag: data1});
            this.loadimage(a); 
  
          } else {
            this.notify(["danger", "Registro Fallido1"]);
          }
  
        }).catch((e) => {
          console.log(e)
          this.notify(["danger", "Registro Fallido"]);
  
        });

      }else{
      axios({
        url: GraphQLURL,
        method: 'post',
        data: {
          query: `mutation{
            createLodging_image(lodging_image:{
              lodging_id: ${a}
              url: "${this.state.images[0]}"    
          }){
            lodging_image_id
      }
    }
                    `
        }
      }).then((result) => {
        if (result.data.data !== null) {
          let data = this.state.images;
          data = data.splice(1,1);
          this.setState({ images: data});
          this.loadimage(a);          
        } else {
          this.notify(["danger", "Registro Fallido"]);
        }

      }).catch((e) => {
        console.log(e)
        this.notify(["danger", "Registro Fallido"]);

      });
    }
    } else {
      this.notify(["success", "Actualizaci??n exitosa de id: ".concat(a)]);
      localStorage.setItem('View_Lodging', parseInt(a));
      window.location.pathname = '/mh/lodging'
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

  cancel(id){
    localStorage.setItem('Update_Lodging', null);
    localStorage.setItem('View_Lodging', parseInt(id));
    window.location.pathname = '/mh/lodging'
  }
  handleFiles = (files) => {
    let data = this.state.images;
    data = [];
    for(let i = 0; i< files.base64.length;i++){
      data[i] = 'data:image/png;base64' + files.base64[i];

    }
    this.setState({ images: data});
    this.componentWillMount();
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
          horas[i+7] = i+7;
        }
        this.getlocation()
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
                          this.state.images.length <= 1 ? null : (
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
                      Actualice su Alojamiento
                                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Form>
                      <Row>
                        <Col>
                          <FormGroup>
                            <label>Nombre del Alojamiento</label>
                            <Input id="0" placeholder="Nombre" type="text" value={this.state.lodging[0]} onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <label>Tel??fono</label>
                            <Input id="1" placeholder="Tel??fono" type="number" value={this.state.lodging[1]} onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <label>Tipo de Alojamiento</label>
                            <Input id="2" placeholder="Nombre" type="select" value={this.state.lodging[2]} onChange={this.handleChange}>
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
                            <Input id="3" placeholder="Tel??fono" type="select" value={this.state.lodging[3]} onChange={this.handleChange}>
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
                            <Input id="4" placeholder="Nombre" value={this.state.lodging[4]} type="select"  onChange={this.handleChange}>
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
                            <Input id="5" placeholder="Nombre" type="select" value={this.state.lodging[5]} onChange={this.handleChange}>
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
                            <Input id="6" placeholder="Direcci??n" type="text" value={this.state.lodging[6]} onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <label>Extra Direcci??n</label>
                            <Input id="7" placeholder="Extra Direcci??n" type="text" value={this.state.lodging[7]} onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col>
                          <FormGroup>
                            <label>??A cuantos hu??spedes puedes alojar?</label>
                            <Input id="8" type="number" value={this.state.lodging[8]} onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <label>??Cu??ntas habitaciones hay disponibles?</label>
                            <Input id="9" type="number" value={this.state.lodging[9]} onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <label>??Cu??ntas camas hay disponibles?</label>
                            <Input id="10" type="number" value={this.state.lodging[10]} onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <label>??Cu??ntos ba??os hay disponibles?</label>
                            <Input id="11" type="number" value={this.state.lodging[11]} onChange={this.handleChange} />
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
                            <Input id="12" type="select" value={this.state.lodging[12]} onChange={this.handleChange}>
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
                            <Input id="13" type="select" value={this.state.lodging[13]} onChange={this.handleChange}>
                            <option defaultValue>Seleccione una Opcion</option>
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
                                <Input id="14" type="checkbox" checked = {this.state.lodging[14]} onChange={this.handleCheck} />
                                Wifi</label>
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Col>
                              <label>
                                <Input id="15" type="checkbox" checked = {this.state.lodging[15]} onChange={this.handleCheck} />
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
                                <Input id="16" type="checkbox" checked = {this.state.lodging[16]} onChange={this.handleCheck} />
                                Aire Acondicionado</label>
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Col>
                              <label>
                                <Input id="17" type="checkbox" checked = {this.state.lodging[17]}  onChange={this.handleCheck} />
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
                                <Input id="18" type="checkbox" checked = {this.state.lodging[18]}  onChange={this.handleCheck} />
                                Cocina</label>
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Col>
                              <label>
                                <Input id="19" type="checkbox" checked = {this.state.lodging[19]}  onChange={this.handleCheck} />
                                Art??culos de Limpieza</label>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <label>??Cual ser?? el precio por noche por persona?</label>
                            <Input id="20" type="number" value = {this.state.lodging[20]}  onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <label>Describe tu Alojamiento</label>
                            <Input id="21" type="text" value = {this.state.lodging[21]}  onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                      </Row>




                    </Form>
                  </CardBody>
                  <CardFooter className="text-center">
                    <Button className="btn-fill" color="primary" type="submit" onClick={this.makepeticion}>
                      Actualizar Alojamiento
                  </Button>
                  <Button className="btn-fill" color="red" type="submit" onClick={()=>this.cancel(this.state.lodging[23])}>
                      Cancelar
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