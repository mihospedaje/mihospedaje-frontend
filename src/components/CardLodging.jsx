import React from "react";
import axios from 'axios';
import { GraphQLURL } from '../ipgraphql'
// reactstrap components
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Card, Row, Col, CardBody } from "reactstrap";




class CardLodging extends React.Component {
    constructor(props) {
        super(props);
        this.state = {color: null, load: false, charge:false, location:"" };
        this.addtofav = this.addtofav.bind(this);
        this.getlocation = this.getlocation.bind(this);
    }
    getlocation(idlocation) {
        let city
        let country
        axios({
          url: GraphQLURL,
          method: 'post',
          data: {
            query: `query {
              locationById(id:${idlocation}){
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
          let l = city.concat(", ",country)
          this.setState({load:true, location:l})
          
        }).catch((e) => {
          console.log(e)
          //return "city.concat(",",country)"
        });
      };
    
    gotolodging(id){
        localStorage.setItem('View_Lodging', parseInt(id));
        window.location.pathname = '/mh/lodging'
    }
    addtofav(){
        if(this.state.color === null){
            this.setState({color:"red"})
        }else{
            this.setState({color:null})
        }
    }
    render() {
        var lodginginfo = this.props.lodinfo;
        var reserinfo = this.props.reserva
        switch (lodginginfo.lodging_provide) {
            case 1:
                lodginginfo.lodging_provide = "Alojamiento Entero"
                break;
            case 2:
                lodginginfo.lodging_provide = "Habitación Privada"
                break;
            case 3:
                lodginginfo.lodging_provide = "Habitación Compartida"
                break;
        }
        if (!this.state.load) {
            if (!this.state.charge) {
              this.getlocation(lodginginfo.location_id);
              this.setState({ charge: true });
            }
            return (<>
              <div className="content"></div>
            </>)
          } else {
        return (
            <>
                <Card >
                    <CardActionArea >
                        <CardMedia
                            image="https://pix6.agoda.net/hotelImages/348529/-1/0eb81c6bf886dc45d066e7c1f2b94f11.jpg"
                            title="hospedaje"
                            style={{ height: 250 }}
                            onClick={() => this.gotolodging(lodginginfo.lodging_id)}
                        />
                        <CardBody >
                            <Row >
                                <Col onClick={() => this.gotolodging(lodginginfo.lodging_id)}>
                                    <p>{this.state.location}</p>
                                    <p style={{ fontSize: "180%" }} className="title">{lodginginfo.lodging_name}</p>
                                    <p>{lodginginfo.lodging_provide}</p>
                                    {
                                        this.props.reserva != null ? null : (
                                            <p>${lodginginfo.price_per_person_and_nigth} COP por noche</p>
                                        )
                                    }
                                    {
                                        this.props.reserva == null ? null : (
                                            <div>
                                                <p>{reserinfo.fechast} -> {reserinfo.fechaend}</p>
                                                <p>Huéspedes:{reserinfo.adults} Adulto(s), {reserinfo.children} Niño(s)</p>
                                                <p>Total: ${reserinfo.total} COP</p>
                                            </div>
                                        )
                                    }
                                </Col>
                                <div className="justify-content-center"><IconButton style={{color: this.state.color}} onClick={()=>this.addtofav()} aria-label="add to favorites"><FavoriteIcon/></IconButton></div>
                            </Row>
                        </CardBody>
                    </CardActionArea>
                </Card>
            </>
        );
    }
}
}


export default CardLodging;