import React, { Component } from "react";
import axios from "axios";
import { Row, Col, Card } from "react-bootstrap";
// import { Chart } from "react-charts";
// import { Line } from "react-chartjs-2";
import Chart from "react-apexcharts";
import Select from "react-select";
import Clouds from "../mycollection/png/clouds.png";
import Rain from "../mycollection/png/Rain.png";
import Haze from "../mycollection/png/Haze.png";
import Clear from "../mycollection/png/Clear.png";
import pin from "../mycollection/png/pin.png";
import { Container } from "react-bootstrap";
var d = new Date();
export default class Weather extends Component {
  state = {
    lat: "",
    lon: "",
    current: {},
    hourly: [],
    daily: [],
    today: null,
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dataLoaded: false,
    chartCategories: [
      "7am",
      "8am",
      "9am",
      "10am",
      "11am",
      "12pm",
      "1pm",
      "2pm",
      "3pm",
      "4pm",
      "5pm",
      "6pm",
      "7pm",
      "8pm",
      "9pm",
      "10pm",
      "11pm",
      "12am",
      "1am",
      "2am",
      "3am",
      "4am",
      "5am",
      "6am",
    ],
    options: {},
    series: [],
    cityOptions: {
      value: "chocolate",
      label: "Jaipur",
    },
  };

  componentDidMount() {
    this.setState({
      today: d.getDay(),
    });
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState(
        {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        },
        () => {
          this.getWeatherData(this.state.lat, this.state.lon);
        }
      );
    });
  }
  getWeatherData = (lat, lon) => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=d6f853f1c69f1ec796e46f78f5b8ebee`
      )
      .then((data) => {
        this.setState(
          {
            current: data.data.current,
            hourly: data.data.hourly,
            daily: data.data.daily,
            // dataLoaded: true,
          },
          () => {
            this.updateChart(0);
          }
        );
        console.log(data);
      });
  };
  updateChart = async (index) => {
    var chartData = [];
    let i;
    let n;
    // this.state.hourly.forEach((hour) => {
    //   chartData.push(hour.temp);
    // });
    if (index % 2 === 0) {
      i = 0;
      n = 24;
    } else {
      i = 24;
      n = 48;
    }
    for (i; i < n; i++) {
      chartData.push(this.state.hourly[i].temp);
    }
    console.log(chartData);
    var series = [
      {
        name: "temperature",
        data: chartData,
      },
    ];

    var options = {
      chart: {
        id: "area",
        height: 2000,
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        show: false,
      },
      stroke: {
        show: true,
        curve: "straight",
      },
      markers: {
        size: 3,
        shape: "circle",
      },
      yaxis: {
        show: false,
      },
      xaxis: {
        categories: this.state.chartCategories,
      },
      responsive: [
        {
          breakpoint: 540,
          options: {
            height: 400,
          },
        },
      ],
    };
    this.setState({
      series,
      options,
      dataLoaded: true,
    });
  };
  setIcon = (word) => {
    if (word === "Clouds") {
      return Clouds;
    } else if (word === "Haze") {
      return Haze;
    } else if (word === "Rain") {
      return Rain;
    } else if (word === "Clear") {
      return Clear;
    }
  };
  render() {
    return (
      <div>
        {this.state.dataLoaded && (
          <div>
            <Container fluid className="py-2">
              <div>
                <Card
                  className="shadow my-2 px-2"
                  style={{ borderRadius: "15px" }}
                >
                  <div className="d-flex">
                    <div className="d-flex">
                      <img className="my-auto" src={pin} />
                    </div>
                    <div style={{ width: "100%" }}>
                      <Select
                        options={this.state.cityOptions}
                        placeholder="Select city"
                      />
                    </div>
                  </div>
                </Card>
              </div>
              <Row
                className="my-3"
                style={{
                  flexWrap: "nowrap",
                  overflow: "scroll",
                }}
              >
                {this.state.days.map((day, i) => (
                  <Col style={{ textAlign: "center" }}>
                    <Card
                      className="day-card p-2"
                      onClick={() => this.updateChart(i)}
                      style={{ alignItems: "center", border: "none" }}
                    >
                      <small className="font-weight-bold">
                        {this.state.days[(this.state.today + i) % 7]}
                      </small>
                      <div className="d-flex">
                        <small className="font-weight-bold mr-2">
                          {Math.round(this.state.daily[i].temp.max)}&#8451;
                        </small>
                        <small>
                          {Math.round(this.state.daily[i].temp.min)}&#8451;
                        </small>
                      </div>
                      <img
                        className="p-1"
                        src={this.setIcon(this.state.daily[i].weather[0].main)}
                      />
                      <small>{this.state.daily[i].weather[0].main}</small>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Card
                className="shadow border-0 py-2"
                style={{ borderRadius: "12px" }}
              >
                <Row>
                  <Col>
                    <div className="d-flex">
                      <h1 className="font-weight-bolder mr-3">
                        {this.state.current.temp}&#8451;
                      </h1>
                      <img
                        src={this.setIcon(this.state.current.weather[0].main)}
                      ></img>
                    </div>
                  </Col>
                  <Col className="md-6 sm-12">
                    <div
                      // className="temp-chart"
                      style={{ overflowX: "scroll", overflowY: "hidden" }}
                    >
                      <div style={{ minWidth: "1000px" }}>
                        <Chart
                          // className="temp-chart"
                          options={this.state.options}
                          series={this.state.series}
                          type="area"
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Card
                      className="border-0"
                      style={{
                        backgroundColor: "rgb(165, 217, 232)",
                        textAlign: "center",
                      }}
                    >
                      <small className="font-weight-bolder">Pressure</small>
                      <small>{this.state.current.pressure}</small>
                    </Card>
                  </Col>
                  <Col>
                    <Card
                      className="border-0"
                      style={{
                        backgroundColor: "rgb(165, 217, 232)",
                        textAlign: "center",
                      }}
                    >
                      <small className="font-weight-bolder">Humidity</small>
                      <small>{this.state.current.humidity}</small>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div style={{ overflowX: "scroll", overflowY: "hidden" }}>
                      <div style={{ Width: "100%" }}>
                        {/* <Chart
                          // className="temp-chart"
                          options={this.state.options}
                          series={[
                            {name:"variation",
                            data:[0,5,0]
                          },
                          {
                            name:"sun",
                            data:["1"]
                          }
                          ]}
                          type="area"
                        /> */}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Container>
          </div>
        )}
      </div>
    );
  }
}
