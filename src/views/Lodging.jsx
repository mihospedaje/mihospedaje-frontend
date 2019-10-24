
import React from "react";
import axios from 'axios';
import {Row, Col} from "reactstrap";
import CardLodging from "components/CardLodging.jsx";
import { GraphQLURL } from '../ipgraphql'


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charge: false,
      load: false,
      lodginginfo: [],
    };
    this.getlodging = this.getlodging.bind(this);
  }
  generatecol(info) {
    return (
      <Col lg="4">
        <CardLodging lodinfo={info} reserva= {null} onClick={console.log("S")}/>
      </Col>
    );
  }
  generaterow(info) {
    var colums = []
    console.log(info)
    for (let i = 0; i < info.length; i++) {
      colums[i] = this.generatecol(info[i]);
    }
    return (
      <Row>
        {colums[0] == null ? null : (colums[0])}
        {colums[1] == null ? null : (colums[1])}
        {colums[2] == null ? null : (colums[2])}
      </Row>
    )
  }
  getlocation() {
    return "Ciudad, Pais"
  }
  getlodging() {
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
        query: `query {
                        allLodgings {
                          lodging_id
                          lodging_name
                          location_id
                          price_per_person_and_nigth
                          lodging_provide
                      }
                    }
                    `
      }
    }).then((result) => {
      var info = result.data.data.allLodgings
      let lodgings = []
      let i = 0
      let j = 0
      while (i < info.length) {
        let recive = null;
        info[i].location_id = this.getlocation(info[i].location_id);
        if (i + 1 < info.length) {
          info[i + 1].location_id = this.getlocation(info[i].location_id);
          if (i + 2 < info.length) {
            info[i + 2].location_id = this.getlocation(info[i].location_id);
            recive = this.generaterow([info[i], info[i + 1], info[i + 2]]);
          } else {
            recive = this.generaterow([info[i], info[i + 1]])
          }
        } else {
          recive = this.generaterow([info[i]])
        }
        lodgings[j] = recive
        j += 1
        i += 3
      }
      this.setState({ load: true, page: lodgings });
     
    }).catch((e) => {
      console.log(e)
    });
  };

  render() {
    this.state.another.push(<p onClick={console.log("S")}>SSSSSSSSSSSS</p>)
    if (!this.state.load) {
      if (!this.state.charge) {
        this.getlodging();
        this.setState({ charge: true });
      }
      return (<>
        <div className="content"></div>
      </>)
    } else {
      return (
        <>
          <div className="content">
             {this.state.page} 
          </div>
        </>
      );
    }
  }
}

export default Home;

