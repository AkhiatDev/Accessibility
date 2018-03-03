import React from "react";
import sparqlClient from "../src/sparql-query-client"

var SPARQL_LOCAL_ENDPOINT = 'http://localhost:8085/ACCESSIBLE/sparql';
var SPARQL_LOCAL_ENDPOINT_u = 'http://localhost:8085/ACCESSIBLE/update';

export default class AccessibleSparql extends React.Component {
  constructor(props) {
    super(props);
    this.state = {impairmentDisabilityMap : null, impairmentList: null, disabilityList: null, assistiveTechnologyList: null};
    this.handleImpairmentChange = this.handleImpairmentChange.bind(this);
    this.handleDisabilityChange = this.handleDisabilityChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleImpairmentChange(event) {
      var selectedImpairmentDisablities = this.state.impairmentDisabilityMap
            .find(this.findByImpairment, event.target.value)
            .disabilities
            .map(item => item.disability);
      this.state.selectedDisability = selectedImpairmentDisablities[0];

      var selectedAssistiveTechnologies = this.state.impairmentDisabilityMap
            .find(this.findByImpairment, event.target.value)
            .disabilities
            .find(this.findByDisability, this.state.selectedDisability)
            .assistiveTechnologies;

      this.setState({selectedImpairment: event.target.value,
                    disabilityList: this.renderListItems(selectedImpairmentDisablities),
                    selectedDisability: selectedImpairmentDisablities[0],
                    assistiveTechnologyList:this.renderListItems(selectedAssistiveTechnologies),
                    selectedAssistiveTechnology: selectedAssistiveTechnologies[0]
            });
  }

  handleDisabilityChange(event) {
      var selectedAssistiveTechnologies = this.state.impairmentDisabilityMap
            .find(this.findByImpairment, this.state.selectedImpairment)
            .disabilities
            .find(this.findByDisability, event.target.value)
            .assistiveTechnologies;
            
      this.setState({selectedDisability: event.target.value,
                    assistiveTechnologyList:this.renderListItems(selectedAssistiveTechnologies),
                    selectedAssistiveTechnology: selectedAssistiveTechnologies[0]
            });
  }

  handleSubmit(event) {
  
    sparqlClient.doQuery(SPARQL_LOCAL_ENDPOINT_u, 
        'INSERT DATA {<http://localhost:8085/ACCESSIBLE/Learner_10> <http://localhost:8085/ACCESSIBLE/hasName> "DusAccountee". }', function(insertData){
        //'INSERT { <http://example/egbook3> <http://purl.org/dc/elements/1.1/>  "This is an example title" }', function(insertData){
            
            alert(insertData);
        })
    //this.state.form.dis.value
    //alert("submit action" + event.target.dis.value);
/*    
    var rdfstore = require('rdfstore');
    new rdfstore.Store(function(err, store) {
        // the new store is ready
      });

    new Store({name:'test', overwrite:true}, function(err,store){
        
        store.setPrefix("ex", "http://localhost:8085/ACCESSIBLE/update");
        store.execute('INSERT DATA {  <http://localhost:8085/ACCESSIBLE/Learner_6> <http://localhost:8085/ACCESSIBLE/hasName> "DusAccountee" }', function(err){
        //    store.execute('INSERT DATA {ex:Learner ex:hasName "DusAccountent" }', function(err){
    
           store.registerDefaultProfileNamespaces();
           
           alert(err);
           store.setPrefix("ex", "http://localhost:8085/ACCESSIBLE/select");
           store.execute('SELECT * { ?s ex:name ?name }', function(err,results) {
            
            alert(results);

               test.ok(results.length === 1);
               
               test.ok(results[0].name.value === "Celia");
           });
        });
    });
*/
/*
    var fs = require("fs");
    var path = "c:\\Bonn PhD\\SlideWiki\\Development\\learnerprofile\\savedinfo.txt";
    var data = "Hello from the Node writeFile method!";
    
    //fs.writeFile('message.txt', 'Hello Node.js', 'utf8', callback);
    alert(path);
    
    fs.writeFile(path, data.toString(), function(error) {
        alert(path);
         if (error) {
           alert("write error:  " + error.message);
         } else {
           alert("Successful Write to " + path);
         }
    });
*/
    //?dis=<http%3A%2F%2Fwww.AccessibleOntology.com%2FGenericOntology.owl%23Expressive_Language_Disorder>
    //var filename = "test";
    //var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    //saveAs(blob, filename+".txt");
    
    event.preventDefault();
    }
  
    
renderListItems(items) {
    var options = []
    if (items) {
        items.filter((value, index, self)=>{
            return self.indexOf(value) === index;
        }).forEach(item => {
            var output = item.substring(item.lastIndexOf("#")+1,item.lastIndexOf(">"));
            options.push(<option key={item} value={item}>{output.split("_").join(" ")}</option>);
        })
    
    return options;
  }
}

findByImpairment(value){
    return this === value.impairment;       
}

findByDisability(value){
    return this === value.disability;       
}

render() {
    if (!this.state.impairmentDisabilityMap) {
        sparqlClient.doQuery(SPARQL_LOCAL_ENDPOINT, 
                             'SELECT ?x ?y ?z ' +
                             'WHERE { ' +
                             '?x a <http://www.AccessibleOntology.com/GenericOntology.owl#Impairment>.' +
                             '?y <http://www.AccessibleOntology.com/GenericOntology.owl#Disability_belongsTo_Impairment> ?x.' +
                             'OPTIONAL  {?z <http://www.AccessibleOntology.com/GenericOntology.owl#Device_belongsTo_Disability> ?y}.'+
                             'OPTIONAL  {?y <http://www.AccessibleOntology.com/GenericOntology.owl#Disability_has_Device> ?z}.'+
                             '}',
            (rawData, resultObject) => {
                var mappedResult = [];
                resultObject.map(row =>{
                    var impairmentKey = mappedResult.find(this.findByImpairment, row.x);
                    if(!impairmentKey){
                        impairmentKey = {impairment: row.x, disabilities: []}
                        mappedResult.push(impairmentKey);
                    }
                    var disabilityKey = impairmentKey.disabilities.find(this.findByDisability, row.y);
                    if (!disabilityKey) {
                        disabilityKey = {disability: row.y, assistiveTechnologies: []}
                        impairmentKey.disabilities.push(disabilityKey);
                    }
                    disabilityKey.assistiveTechnologies.push(row.z);
                })
                var impairmentListOptions = this.renderListItems(mappedResult
                        .map(item => item.impairment));
                var disabilityListOptions = this.renderListItems(mappedResult
                        .find(this.findByImpairment, impairmentListOptions[0].key)
                        .disabilities
                        .map(item => item.disability));
                var assistiveTechnologyListOptions = this.renderListItems(mappedResult
                        .find(this.findByImpairment, impairmentListOptions[0].key)
                        .disabilities
                        .find(this.findByDisability, disabilityListOptions[0].key)
                        .assistiveTechnologies);
                this.setState({impairmentDisabilityMap: mappedResult,
                              impairmentList: impairmentListOptions,
                              selectedImpairment: impairmentListOptions[0].key,
                              disabilityList: disabilityListOptions,
                            assistiveTechnologyList: assistiveTechnologyListOptions});
            });
    }
    return (
        
      <div>
          <form action="" onSubmit={this.handleSubmit}>
        <div className="ui inline field">
            <label style={{width:'150px'}}>Impairment Type * </label>
            <div className='ui icon input'>
            <select value={this.state.selectedImpairment} onChange={this.handleImpairmentChange}>{this.state.impairmentList}</select>
            </div>
        </div>
        <div className="ui inline field">
            <label style={{width:'150px'}}>Disability Type * </label>
            <div className='ui icon input'>
            <select name="dis" value={this.state.selectedDisability} onChange={this.handleDisabilityChange}>{this.state.disabilityList}</select>
            </div>
        </div>
        
        <div className="ui inline field">
            <label style={{width:'150px'}}>Assistive Technology * </label>
            <div className='ui icon input'>
            <select >{this.state.assistiveTechnologyList}</select>
        </div>
        </div>
        <input type="submit" value="Submit" onSubmit={this.handleSubmit.bind(this)}/> 
        </form>
      </div>
    );
  }
}