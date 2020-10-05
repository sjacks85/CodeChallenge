import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
//import registerServiceWorker from ".registerServiceWorker";
import "bootstrap/dist/css/bootstrap.css";
import DiscAssessmentComponent from "./components/discAssessmentComponent";

const element = <h1>DISC Behavioral Assessment</h1>;
ReactDOM.render(<DiscAssessmentComponent />, document.getElementById("root"));
//registerServiceWorker();
