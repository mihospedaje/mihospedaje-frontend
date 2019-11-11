import React from "react";
import Popup from "reactjs-popup";
import axios from 'axios';
import {GraphQLURL} from '../ipgraphql'
import './css/Pago.css';
import './css/showBill.css';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {Row,Col} from "reactstrap";
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
  pos: {
    marginBottom: 12,
  },
});

//<Button size="small" color="primary" >VER FACTURA</Button>
function ShowBill (props){
    return (
        <Popup  trigger={ <Button size="small" variant="outlined" color="primary" className={classes.fab}>VER FACTURA</Button>}
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
          console.log(result)
          if(result.data.data!=null){
            let data = result.data.data.reservationById;
          
            this.setState ({data: data,load: true})
            
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
                    lodging_description
                    
                  }
                }`
          }
        }).then((result) => {
          console.log(result)
          if(result.data.data!=null){
            let data = result.data.data.lodgingById;
          
            this.setState ({data2: data,load2: true})
            
          }else{
              //this.notify(["danger","Registro Fallido"]);    
          }
      
        }).catch((e) =>{
          console.log(e);
          //this.notify(["danger","Registro Fallido"]);  
          
        });
      }
      render (){

        if (!this.state.load && !this.state.load2) {
            if (!this.state.charge) {
              this.getReservationById(this.props.info.reservation_id);
              this.getLodgingById(this.state.data.lodging_id);
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
                        {this.state.data2.lodging_description} 
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
                    <CardActions>
                      
                      <ShowBill 
                        start={this.state.data.start_date.substring(0,10)} 
                        end={this.state.data.end_date.substring(0,10)}
                        adultos = {this.state.data.guest_adult_number}
                        ninos= {this.state.data.guest_children_number}
                        total= {this.props.info.amount}
                        descripcion= {this.state.data2.lodging_description}
                    />
                      
                    </CardActions>
                  </Card>
                </Col>
              </Row>
              </div>
              /*
                <div className='pago'>
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
                    <ShowBill 
                        start={this.state.data.start_date.substring(0,10)} 
                        end={this.state.data.end_date.substring(0,10)}
                        adultos = {this.state.data.guest_adult_number}
                        ninos= {this.state.data.guest_children_number}
                        total= {this.props.info.amount}
                    />
                </div>
              */
            )
        }
        

      }
    
}