import React from "react";
import axios from 'axios';
// reactstrap components
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import {Card,Row,Col} from "reactstrap";

const useStyles = makeStyles({
    media: {
      height: 250
},
});
var sectionStyle = {
    color: "red",
    

  };



export default function LodgingCard(props) {
    const classes = useStyles();
        return (
            <>
             <Card>
              <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={props.name}
                    title="hospedaje"
                    
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                    <Row>
                        <Col lg="10">Bogota</Col>
                        <IconButton style={sectionStyle} aria-label="add to favorites"><FavoriteIcon/></IconButton>
                    </Row>
                    
                      
                      
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      Camas super comodas, no se diga mas, animate
                    </Typography>
            
                  </CardContent>
                </CardActionArea>
                </Card>
            </>
        );
    }

