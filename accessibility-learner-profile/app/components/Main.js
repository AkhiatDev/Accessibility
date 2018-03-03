import React from "react";
import ReactDOM from "react-dom";
import NameForm from "./NameForm";
import AccessModeSparql from "./AccessModeSparql";
import AccessibleSparql from "./AccessibleSparql";
//import ExampleForm from "./formexample";

//const app= document.getElementById('form1');

ReactDOM.render(<AccessModeSparql/>,document.getElementById('access_mode'));
ReactDOM.render(<AccessibleSparql/>, document.getElementById('accessible_lists'));
//ReactDOM.render(<ExampleForm/>, document.getElementById('ex_root'));