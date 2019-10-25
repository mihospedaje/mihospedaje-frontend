import React from 'react';
import axios from 'axios';
import { GraphQLURL } from '../ipgraphql'
import ItemsCarousel from 'react-items-carousel';
import range from 'lodash/range';
import CardMedia from '@material-ui/core/CardMedia';
import { Row, Col, Card, CardBody, CardHeader, CardTitle, Button } from "reactstrap";
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import HomeIcon from '@material-ui/icons/Home';
import WifiIcon from '@material-ui/icons/Wifi';
import TvIcon from '@material-ui/icons/Tv';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import PhoneIcon from '@material-ui/icons/Phone';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import LocalLaundryServiceIcon from '@material-ui/icons/LocalLaundryService';

export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lodging: [],
      load: false,
      charge: false
    };
    this.getlodginginfo = this.getlodginginfo.bind(this);
  }
  // FOTOS
  componentWillMount() {
    this.setState({
      children: [],
      activeItemIndex: 0,
    });

    setTimeout(() => {
      this.setState({
        children: range(3).map(i => <CardMedia key={i}
          image="https://pix6.agoda.net/hotelImages/348529/-1/0eb81c6bf886dc45d066e7c1f2b94f11.jpg"
          title="hospedaje"
          style={{ height: 400 }}
        />)
      })
    }, 100);
  }
  addtofav(){
    if(this.state.color === null){
        this.setState({color:"red"})
    }else{
        this.setState({color:null})
    }
}

  changeActiveItem = (activeItemIndex) => this.setState({ activeItemIndex });
  // INFORMACION
  getUser(information){
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
          query: `query {
                      userById(id: ${information.host_id}) {
                  id
                  name
                  }
           }`
      }
  }).then((result) => {
      if(result.data.data!=null){
        information.host_id = result.data.data.userById.name
        this.setState({ lodging: information, load: true });
      
      }else{
 
      }

  }).catch((e) =>{
      console.log(e);
     
  });
  }
  getlocation(information) {
    let city
    let country
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
        query: `query {
          locationById(id:${information.location_id}){
            country
            city
          }
        }
                    `
      }
    }).then((result) => {
      var info = result.data.data.locationById
      console.log(info)
      country = info.country
      city = info.city
      information.location_id = city.concat(", ",country)
      this.getUser(information)
      
      
    }).catch((e) => {
      console.log(e)
      //return "city.concat(",",country)"
    });
  };

  getlodginginfo() {
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
        query: `query{
            lodgingById(id:${localStorage.LodID}){
              lodging_id
              lodging_name
              lodging_type
              lodging_provide
              lodging_description
              phone_number
              guest_number
              rooms_number
              beds_number
              bathrooms_number
              location_id
              with_wifi
              with_cable_tv
              with_air_conditioning
              with_phone
              with_kitchen
              with_cleaning_items
              price_per_person_and_nigth
              host_id
            }
          }`
      }
    }).then((result) => {
      localStorage.setItem('LodID', null);
      console.log(result)
      if (result.data.data != null) {
        let info = result.data.data.lodgingById;
        switch (info.lodging_provide) {
          case 1:
            info.lodging_provide = "Alojamiento Entero"
            break;
          case 2:
            info.lodging_provide = "Habitación Privada"
            break;
          case 3:
            info.lodging_provide = "Habitación Compartida"
            break;
        }
        switch (info.lodging_type) {
          case 1:
            info.lodging_type = "Departamento"
            break;
          case 2:
            info.lodging_type = "Casa"
            break;
          case 3:
            info.lodging_type = "Vivienda Anexa"
            break;
          case 4:
            info.lodging_type = "Alojamiento Único"
            break;
          case 5:
            info.lodging_type = "Bed and Breakfast"
            break;
        }
        
        if(info.with_wifi === 0){
          info.with_wifi = "red"
        }else{
          info.with_wifi = "green"
        }
        if(info.with_cable_tv === 0){
          info.with_cable_tv = "red"
        }else{
          info.with_cable_tv = "green"
        }
        
        if(info.with_air_conditioning === 0){
          info.with_air_conditioning = "red"
        }else{
          info.with_air_conditioning = "green"
        }
        if(info.with_phone === 0){
          info.with_phone = "red"
        }else{
          info.with_phone = "green"
        }
        if(info.with_kitchen === 0){
          info.with_kitchen = "red"
        }else{
          info.with_kitchen = "green"
        }
        if(info.with_cleaning_items === 0){
          info.with_cleaning_items = "red"
        }else{
          info.with_cleaning_items = "green"
        }
        this.getlocation(info);

      } else {
        //this.notify(["danger","Registro Fallido"]);    
      }

    }).catch((e) => {
      console.log(e);
      //this.notify(["danger","Registro Fallido"]);  

    });
  }


  render() {
    const {
      activeItemIndex,
      children,
    } = this.state;
    if (!this.state.load) {
      if (!this.state.charge) {
        this.getlodginginfo();
        this.setState({ charge: true });
      }
      return (<>
        <div className="content"></div>
      </>)
    } else {
      let lodginginfo = this.state.lodging;
      return (
        <>
          <div className="content">
            <Row>

              <Col lg="5">
                <Card className="card-user">
                  <div className="author">
                    <div className="block block-one" />
                  </div>
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
                  </CardBody>
                </Card>
              </Col>
              <Col lg="7">
                <Row>
                  <Card>
                    <CardHeader >
                      <Row>
                      <Col><CardTitle className="text-center"><h1 className="title">{lodginginfo.lodging_name}</h1></CardTitle></Col>
                      <div className="justify-content-center"><IconButton style={{ color: this.state.color }} onClick={() => this.addtofav()} aria-label="add to favorites"><FavoriteIcon /></IconButton></div>
                      </Row>
                      
                    </CardHeader>
                    <CardBody>
                      <Row>
                      <Col>
                      <Row><Col><p>{lodginginfo.location_id}</p></Col></Row>
                      <Row><Col><p>Teléfono: {lodginginfo.phone_number}</p></Col></Row>
                      </Col>
                      <Col>
                          <Row>
                          <CardMedia
                            className="avatar"
                            image="https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg"
                            title="hospedaje"
                            style={{ height: 50, width: 50 }}
                            text = "SSS"/>
                            <p style={{ fontSize: "150%"}}>{lodginginfo.host_id}</p>
                          </Row>
                         </Col>
                        </Row>
                      
                      <Row style={{borderBottom: "1px solid rgb(212, 212, 212)"}}>
                        <Col>
                          <CardHeader className="text-center" >
                            <p className="title" style={{ fontSize: "150%"}}>Descripción</p>
                          </CardHeader>
                          <Row><Col>{lodginginfo.lodging_description}</Col></Row>
                          <br/>
                        </Col>
                       
                      </Row>
                      <br/>
                      <Row>
                        <Col>
                      <IconButton style={{color:"black"}}><HomeIcon/></IconButton>
                          {lodginginfo.lodging_type} - {lodginginfo.lodging_provide}
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                        <Col><p className="title">
                        {lodginginfo.guest_number} Huéspedes &nbsp; &nbsp;
                        {lodginginfo.rooms_number} Habitaciones &nbsp; &nbsp;
                        {lodginginfo.beds_number} Camas &nbsp; &nbsp;
                        {lodginginfo.bathrooms_number} Baños &nbsp; &nbsp;</p>
                          </Col>
                        </Col>
                      </Row>
                      <Row>
                      <Col>
                      <IconButton style={{color:lodginginfo.with_wifi}}><WifiIcon/></IconButton>
                      Wifi
                      </Col>
                      <Col>
                      <IconButton style={{color:lodginginfo.with_cable_tv}}><TvIcon/></IconButton>
                      TV Cable
                      </Col>
                      </Row>
                      <Row>
                      <Col>
                      <IconButton style={{color:lodginginfo.with_air_conditioning}}><AcUnitIcon/></IconButton>
                      Aire Acondicionado
                      </Col>
                      <Col>
                      <IconButton style={{color:lodginginfo.with_phone}}><PhoneIcon/></IconButton>
                      Teléfono
                      </Col>
                      </Row>
                      <Row>
                      <Col>
                      <IconButton style={{color:lodginginfo.with_kitchen}}><RestaurantIcon/></IconButton>
                      Cocina
                      </Col>
                      <Col>
                      <IconButton style={{color:lodginginfo.with_cleaning_items}}><LocalLaundryServiceIcon/></IconButton>
                      Elementos de Aseo
                      </Col>
                      </Row>
                      <br/>
                      <Row>
                        <Col>
                      <Row>
                        <Col><Col><p>Arriendalo por solo: </p></Col></Col>
                      </Row>
                      <Row>
                        <Col><Col><p className="title" style={{ fontSize: "150%"}}>${lodginginfo.price_per_person_and_nigth} COP &nbsp;</p>
                        <p>Noche por Persona</p></Col></Col>
                      </Row>
                      </Col>
                      <Col>
                      <br/>
                      <Button className="btn-fill" color="primary" type="submit">
                                        Reservar
                     </Button>
                      </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Row>

              </Col>


            </Row>

          </div>
        </>
      );

    }
  }
} 