import React from "react";


export default class Header extends React.Component {
  handlerchange(e){
      const title=e.target.value;
      this.props.changeTitle(title);
  }
  render() {
    return (
        <div>
            <Title title={this.props.title} />
            <input  onChange={this.handleChange.bind(this)} />
        </div>
      
    );
  }
}