import React from "react";
import Popup from "reactjs-popup";
import axios from 'axios';
import {GraphQLURL} from '../ipgraphql'
import './css/Pago.css';
import './css/showBill.css';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {Row,Col,Button,CardFooter} from "reactstrap";
import { makeStyles } from '@material-ui/core/styles';


const contentStyle = {
    maxWidth: "500px",
    width: "90%"
  };

const classes = makeStyles({
  card: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  
});

//<Button size="small" color="primary" >VER FACTURA</Button>
function ShowBill (props){
    return (
        <Popup  trigger={ <Button className="btn-fill" color="primary" >Ver Factura</Button>}
            modal
            contentStyle={contentStyle}
        >
            {close =>(
                <div className="modal2">
                    <a className="close2" onClick={close}>
                    &times;
                    </a>
                    <div className="header2"> Factura  </div>
                    <div className="content2">
                        <b>Descripción</b><br/>
                        {props.descripcion}
                        <br></br><b>Fechas</b><br></br>
                        
                        Fecha inicio:  {props.start}
                        <br/>
                        Fecha final:  {props.end}
                        
                        <br></br><b>Huespedes</b><br></br>
                        
                        Adultos: {props.adultos}
                        <br/>
                        Niños: {props.ninos}
                        <br></br><b>Precio</b><br></br>
                        
                        Total: {props.total}
                        
                    </div>
                </div>
            )}
            
           
        </Popup>
  
    );
}

export default class Pago extends React.Component{
    
    constructor(props){
        super(props)
        this.state = {
          data : [],
          data2: [],
          charge: false,
          load: false,
          load2: false
        }
        this.getReservationById = this.getReservationById.bind(this);
        this.getLodgingById = this.getLodgingById.bind(this);
      }
    getReservationById(id){
        axios({
          url: GraphQLURL,
          method: 'post',
          data: {
              query: `query {
                reservationById (id: ${id}) {
                  guest_adult_number
                  guest_children_number
                  start_date
                  end_date
                  lodging_id
                } 
              }`
          }
        }).then((result) => {
          if(result.data.data!=null){
            let data = result.data.data.reservationById;
            this.setState ({data: data})
            this.getLodgingById(this.state.data.lodging_id);
          }else{
              //this.notify(["danger","Registro Fallido"]);    
          }
      
        }).catch((e) =>{
          console.log(e);
          //this.notify(["danger","Registro Fallido"]);  
          
        });
      }
      getLodgingById(id){
        axios({
          url: GraphQLURL,
          method: 'post',
          data: {
              query: `query {
                lodgingById(id: ${id}){
                    lodging_name
                    lodging_description
                  }
                }`
          }
        }).then((result) => {
          if(result.data.data!=null){
            let data = result.data.data.lodgingById;
          
            this.setState ({data2: data,load: true})
            
          }else{
              //this.notify(["danger","Registro Fallido"]);    
          }
      
        }).catch((e) =>{
          console.log(e);
          //this.notify(["danger","Registro Fallido"]);  
          
        });
      }
      render (){

        if (!this.state.load) {
            if (!this.state.charge) {
              this.getReservationById(this.props.info.reservation_id);
              this.setState({ charge: true });
            }
            return(<>
            <div className="content"></div>
            </>)
        }else{
            
            return (
              <div className="pago">
              <Row>
                <Col lg="12">
                <Card  >
                    <CardContent>
                      
                      <Typography variant="h6" component="h2">
                        {this.state.data2.lodging_name} 
                      </Typography>
                      <Typography className={classes.pos} color="textSecondary">
                      <div id='fechas'><p>
                        Fecha inicio:  {this.state.data.start_date.substring(0,10)}
                        <br/>
                        Fecha final:  {this.state.data.end_date.substring(0,10)} </p></div>
                      <div id='huespedes'><p>
                          Adultos: {this.state.data.guest_adult_number}
                          <br/>
                          Niños: {this.state.data.guest_children_number}
                      </p></div>
                      <div id='total'><p>Total: {this.props.info.amount}</p></div>
                      </Typography>
                      
                    </CardContent>
                    <CardFooter className="text-center" >
                      
                      <ShowBill 
                        start={this.state.data.start_date.substring(0,10)} 
                        end={this.state.data.end_date.substring(0,10)}
                        adultos = {this.state.data.guest_adult_number}
                        ninos= {this.state.data.guest_children_number}
                        total= {this.props.info.amount}
                        descripcion= {this.state.data2.lodging_description}
                    />
                      
                      </CardFooter>
                    
                  </Card>
                </Col>
              </Row>
              
              </div>
              
            )
        }
        
      }
    
}