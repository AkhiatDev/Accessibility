import React from "react";


export default class Title extends React.Component {
  render() {
    return (
      <h1>this.props.title</h1>
    );
  }
}


<form onSubmit={this.handleSubmit}>
            <label>
              Please specify endpoint
              <input type="text" value={this.state.endpoint} onChange={this.handleChange} />
            </label>
            <label>
              Please enter query:
              <input type="text" value={this.state.query} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
            <br/>
          </form>