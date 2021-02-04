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
import moment from 'moment';

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
    sunTimingLoaded: false,
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
    sunTimingChartOptions: {},
    sunTimingChartSeries: [],
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
            this.updateSunTimingChart(0);
          }
        );
        console.log(data);
      });
  };
  updateChart = (index) => {
    var chartData = [];
    let i;
    let n;
    if (index % 2 === 0) {
      i = 0;
      n = 24;
    } else {
      i = 24;
      n = 48;
    }
    let xAxisDataSeries = [];
    for (i; i < n; i++) {
      
      const fetchedTemp = this.state.hourly[i].temp;
      const fetchedDate = new Date(this.state.hourly[i].dt * 1000);
      console.log('fetched Date: ', fetchedDate);
      const timeHour = moment(fetchedDate).format('hh A');
      const xAxisData = [Math.round(fetchedTemp).toString() + '°', timeHour];
      xAxisDataSeries.push(xAxisData);
      chartData.push(fetchedTemp);
    }
    console.log(chartData);
    var series = [
      {
        name: "Temperature",
        data: chartData,
      },
    ];

    var options = {
      chart: {
        id: "area",
        height: 'auto',
        // width: '100%',
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        show: true,
        yaxis: {
          lines: {
              show: false
          }
      }
      },
      stroke: {
        curve: "smooth",
      },
    
      yaxis: {
        show: false,
      },
      xaxis: {
        categories: xAxisDataSeries,
      },
      
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

  updateSunTimingChart = (index) => {
    console.log(this.state.daily[index], new Date(this.state.daily[index].sunrise));
    const sunriseTime = moment(new Date(this.state.daily[index].sunrise * 1000)).format('hh A');
    const sunsetTime = moment(new Date(this.state.daily[index].sunset * 1000)).format('hh A');
    let sunTimingChartSeries = [
      {
        name: 'Time',
        data: [0, 0.5, 0]
      }
    ]
    let xAxisDataSeries = ['06 AM', '01 PM', '8 PM'];

    let sunTimingChartOptions = {
      chart: {
        id: "area",
        height: 100,
        // width: '100%',
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        yaxis: {
          lines: {
            offsetX: -30
          }
        },
        padding: {
          left: 20
        }
      },
      stroke: {
        curve: "smooth",
        lineCap: 'round',
        colors: ['#e8ba56'],
        width: 5
      },
    
      yaxis: {
        show: false,
      },
      xaxis: {
        categories: xAxisDataSeries,
      },
      fill: {
        colors: ['#e8ba56']
      }
      
    }
    this.setState({
      sunTimingChartSeries,
      sunTimingChartOptions,
      sunTimingLoaded: true,
    });
    
  }
  render() {
    return (
      <div>
        {this.state.dataLoaded && (
          <div>
            <Container fluid className="py-2">
              <div>
                <Card
                  className="shadow-sm p-2"
                  style={{ borderRadius: 15 }}
                >
                  <div className="d-flex">
                    <div className="d-flex">
                      <img className="my-auto" src={pin} style={{height: 20}} />
                    </div>
                    <div style={{ width: "100%", outline: 'none' }}>
                      <Select
                        options={this.state.cityOptions}
                        placeholder="Select city"
                        style={{outline: 'none'}}
                      />
                    </div>
                  </div>
                </Card>
              </div>
              <Row
                className="my-3 daysTapsList"
                style={{
                  flexWrap: "nowrap",
                  overflowX: "scroll",
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
                        <small className="font-weight-bold mr-1">
                          {Math.round(this.state.daily[i].temp.max)}°
                        </small>
                        <small>
                          {Math.round(this.state.daily[i].temp.min)}°
                        </small>
                      </div>
                      <img
                        className="p-1"
                        style={{height: 30}}
                        src={this.setIcon(this.state.daily[i].weather[0].main)}
                      />
                      <small className="text-muted">{this.state.daily[i].weather[0].main}</small>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Card
                className="shadow-sm rounded border-0 p-4"
                style={{ borderRadius: "12px" }}
              >
                <Row className="chartContainer">
                  <Col>
                    <div className="d-flex align-items-start">
                      <h1 className="font-weight-bolder mr-3" style={{fontSize: 48}}>
                        {this.state.current.temp}°C
                      </h1>
                      <img
                      className="ml-1"
                        src={this.setIcon(this.state.current.weather[0].main)}
                        height="30"
                      ></img>
                    </div>
                  </Col>
                  <Col sm={12} className="overflow-scroll chartContainer w-100">
                    <div
                      // className="temp-chart"
                      className="chartContainer w-100"
                      style={{ overflowX: "scroll", overflowY: "hidden", zIndex: -10 }}
                    >
                      <div className="w-100 ml-2">
                        <Chart
                          // className="temp-chart"
                          options={this.state.options}
                          series={this.state.series}
                          type="line"
                          height="300"
                          width="1100"
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <Card
                      className="border-0 p-1 bg-light rounded shadow-sm"
                      style={{
                        textAlign: "left",
                      }}
                    >
                      <h6 style={{fontSize: 22}} className="font-weight-bolder">Pressure</h6>
                      <p style={{fontSize: 20}} className="mb-0">{this.state.current.pressure} hpa</p>
                    </Card>
                  </Col>
                  <Col>
                    <Card
                      className="border-0 p-1 bg-light rounded shadow-sm"
                      style={{
                        textAlign: "left",
                      }}
                    >
                      <h6 style={{fontSize: 22}} className="font-weight-bolder">Humidity</h6>
                      <p style={{fontSize: 20}} className="mb-0">{this.state.current.humidity} %</p>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col>
                  {this.state.sunTimingLoaded && (
                    <Chart
                    options={this.state.sunTimingChartOptions}
                    series={this.state.sunTimingChartSeries}
                    type="area"
                    height="130"
                     />
                  )}
                      
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
