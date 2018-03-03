import React from "react";
import sparqlClient from "../src/sparql-query-client"

var SPARQL_LOCAL_ENDPOINT = 'http://localhost:8085/ACCESSIBLE/sparql';

export default class AccessModeSparql extends React.Component {
  constructor(props) {
    super(props);
    this.state = {sparqlResult: {value : 'nothing to show yet '}, accessModeList: null};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
  }
    
renderListItems(items) {
    var options = []
    if (items) {
        items.forEach(item => {
            var output = item.x.substring(item.x.lastIndexOf("#")+1,item.x.lastIndexOf(">"));
            options.push(<option key={item.x} value={item.x}>{output}</option>);
        })
    
    return options;
  }
}

render() {
    if (!this.state.accessModeList) {
        sparqlClient.doQuery(SPARQL_LOCAL_ENDPOINT, 'SELECT ?x WHERE {?x a <http://www.AccessLearner.org/accessible_ocw#accessModeValue>}',
            (rawData, items) => {
                this.setState({accessModeList: this.renderListItems(items)});
            });
    }
    return (
      <div>
        <select>{this.state.accessModeList}</select>
      </div>
    );
  }
}