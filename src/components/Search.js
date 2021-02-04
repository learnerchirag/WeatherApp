import React, { Component } from "react";
export default class Search extends Component {
  state = {
    inputValue: "",
  };
  render() {
    return (
      <div>
        {/* <ReactSelect
          maxCountriesNumber={5}
          onInputChange={(value) => {
            const inputValue = value.replace(/\W/g, "");
            this.setState({ inputValue });
            return inputValue;
          }}
          inputValue={this.state.inputValue}
          onChange={(a, b) => {
            console.log("from Parent: ", a, b);
          }}
        /> */}
      </div>
    );
  }
}
