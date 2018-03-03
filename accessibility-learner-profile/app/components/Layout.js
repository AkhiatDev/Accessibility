import React from "react";
import Header from "./Header";
import Footer from "./Footer";


export default class Layout extends React.Component {
    constructor(){
        super();
        this.state={title:"I am the title"};
    }
    
    changetitle(title){
        this.setState({title});
    }
  render() {
    return (
        <div>
        <Header changetitle={this.changetitle.bind(this)} title={this.state.title} />
        <Footer/>
        </div>
    );
  }
}