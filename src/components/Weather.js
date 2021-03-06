import React, { Component } from "react";
import axios from "axios";
import { Row, Col, Card } from "react-bootstrap";
import Select from "react-select";
import Clouds from "../mycollection/png/clouds.png";
import Rain from "../mycollection/png/Rain.png";
import Mist from "../mycollection/png/Mist.png";
import Haze from "../mycollection/png/Haze.png";
import Clear from "../mycollection/png/Clear.png";
import pin from "../mycollection/png/pin.png";
import { Container } from "react-bootstrap";
import moment from "moment";
import { Spinner } from "react-bootstrap";
import Chart from "react-apexcharts";
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
    options: {},
    series: [],
    sunTimingChartOptions: {},
    sunTimingChartSeries: [],
    sunriseTime: null,
    sunsetTime: null,
    cityOptions: [
      {
        value: "jaipur",
        label: "Jaipur",
      },
      {
        value: "delhi",
        label: "Delhi",
      },
      {
        value: "dehradun",
        label: "Dehradun",
      },
      {
        value: "mumbai",
        label: "Mumbai",
      },
      {
        value: "pune",
        label: "Pune",
      },
      {
        value: "bangalore",
        label: "Bangalore",
      },
    ],
    selectedCity: null,
    customOption: null,
    sunIndex: null,
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
          this.selectOption();
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
        const sunriseTime = moment(
          new Date(data.data.current.sunrise * 1000)
        ).format("hh A");
        var sunIndex;
        var date = new Date();
        const hr = parseInt(moment(date).format("H"));
        console.log(sunriseTime, hr);
        if (hr > parseInt(sunriseTime.split(" ")[0]) && hr < 18) {
          var index = hr - 6;
          sunIndex = index;
        } else {
          sunIndex = null;
        }

        setInterval(() => {
          if (hr > parseInt(sunriseTime.split(" ")[0]) && hr < 18) {
            var index = hr - 6;
            this.setState(
              {
                sunIndex: index,
              },
              () => {
                console.log("interval fucntion running");
                this.updateSunTimingChart(0);
              }
            );
          } else {
            this.setState(
              {
                sunIndex: null,
              },
              () => {
                this.updateSunTimingChart(0);
              }
            );
          }
        }, 300000);

        this.setState(
          {
            current: data.data.current,
            hourly: data.data.hourly,
            daily: data.data.daily,
            // dataLoaded: true,
            sunIndex,
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
      console.log("fetched Date: ", fetchedDate);
      const timeHour = moment(fetchedDate).format("hh A");
      const xAxisData = [Math.round(fetchedTemp).toString() + "°", timeHour];
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
        height: "auto",
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
            show: false,
          },
        },
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
    } else return Mist;
  };

  updateSunTimingChart = (index) => {
    console.log(
      this.state.daily[index],
      new Date(this.state.daily[index].sunrise)
    );
    const sunriseTime = moment(
      new Date(this.state.daily[index].sunrise * 1000)
    ).format("hh A");
    const sunsetTime = moment(
      new Date(this.state.daily[index].sunset * 1000)
    ).format("hh A");
    // for (let i = 0; i < 15; i++) {
    // }

    let sunTimingChartSeries = [
      {
        name: "Time",
        type: "area",
        data: [-1, 0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0, -1],
      },
    ];
    let xAxisDataSeries = [
      "06 AM",
      "07 AM",
      "08 AM",
      "09 AM",
      "10 AM",
      "11 AM",
      "12 PM",
      "01 PM",
      "02 PM",
      "03 PM",
      "04 PM",
      "05 PM",
      "06 PM",
      "07 PM",
      "08 PM",
    ];

    let sunTimingChartOptions = {
      chart: {
        // id: "area",
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
        // yaxis: {
        //   lines: {
        //     offsetX: -30,
        //   },
        // },
        padding: {
          left: 20,
        },
      },
      markers: {
        size: 1,
        strokeWidth: 1,
        colors: ["#e8ba56"],
        strokeColors: "#e8ba56",
        discrete: [
          {
            seriesIndex: 0,
            dataPointIndex: this.state.sunIndex,
            fillColor: "#e8ba56",
            strokeColor: "#fff",
            size: 12,
          },
        ],
      },
      stroke: {
        curve: "smooth",
        lineCap: "round",
        colors: ["#e8ba56"],
        width: 5,
      },

      yaxis: {
        show: false,
      },
      xaxis: {
        tickAmount: 7,
        categories: xAxisDataSeries,
      },
      fill: {
        // colors: ["#e8ba56"],
        type: "gradient",
        gradient: {
          type: "horizontal",
          stops: [10, 90, 100],
          colorStops: [
            {
              offset: 0,
              color: "black",
              opacity: 0.5,
            },
            {
              offset: 10,
              color: "#e8ba56",
              opacity: 0.5,
            },
            {
              offset: 90,
              color: "#e8ba56",
              opacity: 0.5,
            },
            {
              offset: 100,
              color: "black",
              opacity: 0.5,
            },
          ],
        },
      },
    };
    this.setState({
      sunTimingChartSeries,
      sunTimingChartOptions,
      sunriseTime,
      sunsetTime,
      sunTimingLoaded: true,
    });
  };

  handleCitySelection = (selectedCity) => {
    var lat;
    var lon;
    if (selectedCity) {
      lat = selectedCity.coords.lat;
      lon = selectedCity.coords.lon;
    } else {
      lat = this.state.lat;
      lon = this.state.lon;
    }
    this.setState(
      {
        selectedCity,
      },
      () => {
        this.selectOption();
        this.getWeatherData(lat, lon);
      }
    );
  };
  selectOption = () => {
    var customOption = [];
    this.state.cityOptions.forEach((object) => {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${object.value},IN&units=metric&appid=d6f853f1c69f1ec796e46f78f5b8ebee`
        )
        .then((data) => {
          console.log("weather icon", data);
          var weatherIcon = data.data.weather[0].main;
          var temp = data.data.main.temp;
          var coord = data.data.coord;
          var cityObject = {
            value: object.value,
            label: (
              <div className="label d-flex justify-content-between align-items-center">
                <span className="mr-1">{object.label}</span>
                <span>
                  {temp}°
                  <img src={this.setIcon(weatherIcon)} alt="flag" />
                </span>
              </div>
            ),
            coords: coord,
          };
          customOption.push(cityObject);
        });
    });
    this.setState({
      customOption,
    });
  };
  render() {
    return (
      <div>
        {this.state.dataLoaded ? (
          <div>
            <Container fluid className="py-2">
              <div>
                <Card className="shadow-sm p-2" style={{ borderRadius: 15 }}>
                  <div className="d-flex">
                    <div className="d-flex">
                      <img
                        className="my-auto"
                        src={pin}
                        style={{ height: 20 }}
                      />
                    </div>
                    <div
                      style={{
                        width: "100%",
                        outline: "none",
                        border: "none !important",
                      }}
                    >
                      <Select
                        isClearable
                        className="select-custom"
                        options={this.state.customOption}
                        value={this.state.selectedCity}
                        onChange={this.handleCitySelection}
                        placeholder="Select city"
                        style={{ outline: "none" }}
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
                        style={{ height: 30 }}
                        src={this.setIcon(this.state.daily[i].weather[0].main)}
                      />
                      <small className="text-muted">
                        {this.state.daily[i].weather[0].main}
                      </small>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Card
                className="shadow-sm rounded border-0 p-4"
                style={{ borderRadius: "12px" }}
              >
                <Row className="chartContainer d-sm-none d-md-flex">
                  <Col sm={12} md={2}>
                    <div className="d-flex align-items-start">
                      <h1
                        className="font-weight-bolder mr-3"
                        style={{ fontSize: 48 }}
                      >
                        {this.state.current.temp}°C
                      </h1>
                      <img
                        className="ml-1"
                        src={this.setIcon(this.state.current.weather[0].main)}
                        height="30"
                      ></img>
                    </div>

                    <Col className="p-0 mt-3 d-none d-md-block">
                      <Card
                        className="border-0 p-1 bg-light rounded shadow-sm"
                        style={{
                          textAlign: "left",
                        }}
                      >
                        <h6
                          style={{ fontSize: 22 }}
                          className="font-weight-bolder"
                        >
                          Pressure
                        </h6>
                        <p style={{ fontSize: 20 }} className="mb-0">
                          {this.state.current.pressure} hpa
                        </p>
                      </Card>
                    </Col>
                    <Col className="p-0 mt-3 d-none d-md-block">
                      <Card
                        className="border-0 p-1 bg-light rounded shadow-sm"
                        style={{
                          textAlign: "left",
                        }}
                      >
                        <h6
                          style={{ fontSize: 22 }}
                          className="font-weight-bolder"
                        >
                          Humidity
                        </h6>
                        <p style={{ fontSize: 20 }} className="mb-0">
                          {this.state.current.humidity} %
                        </p>
                      </Card>
                    </Col>
                  </Col>

                  <Col
                    sm={12}
                    md={10}
                    className="overflow-scroll chartContainer w-100"
                  >
                    <div
                      className="chartContainer w-100"
                      style={{
                        overflowX: "scroll",
                        overflowY: "hidden",
                        zIndex: -10,
                      }}
                    >
                      <div className="w-100 ml-2">
                        <Chart
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
                <Row className="mt-3 d-sm-flex d-md-none">
                  <Col className="mt-3">
                    <Card
                      className="border-0 p-1 bg-light rounded shadow-sm"
                      style={{
                        textAlign: "left",
                      }}
                    >
                      <h6
                        style={{ fontSize: 22 }}
                        className="font-weight-bolder"
                      >
                        Pressure
                      </h6>
                      <p style={{ fontSize: 20 }} className="mb-0">
                        {this.state.current.pressure} hpa
                      </p>
                    </Card>
                  </Col>
                  <Col className="mt-3">
                    <Card
                      className="border-0 p-1 bg-light rounded shadow-sm"
                      style={{
                        textAlign: "left",
                      }}
                    >
                      <h6
                        style={{ fontSize: 22 }}
                        className="font-weight-bolder"
                      >
                        Humidity
                      </h6>
                      <p style={{ fontSize: 20 }} className="mb-0">
                        {this.state.current.humidity} %
                      </p>
                    </Card>
                  </Col>
                </Row>
                {this.state.sunTimingLoaded && (
                  <Row className="mt-3">
                    <Col className="px-0">
                      <h6
                        style={{ fontSize: 22 }}
                        className="font-weight-bolder"
                      >
                        Sunrise
                      </h6>
                      <p style={{ fontSize: 20 }} className="mb-0">
                        {this.state.sunriseTime}
                      </p>
                    </Col>
                    <Col className="px-0" style={{ textAlign: "end" }}>
                      <h6
                        style={{ fontSize: 22 }}
                        className="font-weight-bolder"
                      >
                        Sunset
                      </h6>
                      <p style={{ fontSize: 20 }} className="mb-0">
                        {this.state.sunsetTime}
                      </p>
                    </Col>
                  </Row>
                )}

                <Row>
                  <Col>
                    {this.state.sunTimingLoaded && (
                      <Chart
                        options={this.state.sunTimingChartOptions}
                        series={this.state.sunTimingChartSeries}
                        type="area"
                        height="170"
                      />
                    )}
                  </Col>
                </Row>
              </Card>
            </Container>
          </div>
        ) : (
          <Spinner
            animation="grow"
            variant="primary"
            style={{
              position: "absolute",
              top: "50%",
              right: "50%",
              margin: "0 0 1rem 1rem",
            }}
          />
        )}
      </div>
    );
  }
}
