import React from 'react';
import './selector.css';
import Highlight from "react-highlight.js";
import axios from 'axios';

class Display extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <div className="displayImage">
                    <img src={this.props.displayPath}/>
                </div>
                <div className="displayText">
                    <pre>
                        {this.props.displayText}
                    </pre>
                </div>
                <div>
                    {Object.values(this.props.displayCodeSnippet).map(v => {
                        return <Highlight language={"golang"}>{v}</Highlight>
                    })}
                </div>
            </div>
        )
    }
}

class Selector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            allProjects: [],
            allModules: [],
            allStructs: [],
            allFunctions: [],
            selectedProject: {},
            selectedModule: {},
            selectedStruct: {},
            selectedFunction: "",

            selectedProjectName: "",
            selectedModuleName: "",
            selectedStructName: "",
            selectedFunctionName: "",

            displayPath: "",
            displayText: "",
            displayCodeSnippet: {},
            isFunctionType: true,
            display: false,
            remoteUrl: "http://darktalk.cn"
        }
        this.handleProjectChange = this.handleProjectChange.bind(this);
        this.handleModuleChange = this.handleModuleChange.bind(this);
        this.handleStructChange = this.handleStructChange.bind(this);
        this.handleFunctionChange = this.handleFunctionChange.bind(this);
        this.handleSubmitStruct = this.handleSubmitStruct.bind(this);
        this.handleSubmitFunctionCallee = this.handleSubmitFunctionCallee.bind(this);
        this.handleSubmitFunctionCaller = this.handleSubmitFunctionCaller.bind(this);
    }

    componentDidMount() {
        axios.get(this.state.remoteUrl + '/load/')
             .then((res) => {
                 console.log(res)
                 let allProjects = Object.keys(res.data).sort();
                 let selectedProject = res.data[allProjects[0]];
                 let allModules = Object.keys(selectedProject).sort();
                 let selectedModule = selectedProject[allModules[0]];
                 let allStructs = Object.keys(selectedModule).sort();
                 let selectedStruct = allStructs.length > 0 ? selectedModule[allStructs[0]].sort() : [];
                 let allFunctions = selectedStruct;
                 let selectedFunction = allFunctions.length > 0 ? allFunctions[0] : "";

                 let selectedProjectName = allProjects[0];
                 let selectedModuleName = allModules[0];
                 let selectedStructName = allStructs[0];

                 this.setState(
                     {
                         data: res.data,
                         allProjects: allProjects,
                         allModules: allModules,
                         allStructs: allStructs,
                         allFunctions: allFunctions,
                         selectedProject: selectedProject,
                         selectedModule: selectedModule,
                         selectedStruct: selectedStruct,
                         selectedFunction: selectedFunction,

                         selectedProjectName: selectedProjectName,
                         selectedModuleName: selectedModuleName,
                         selectedStructName: selectedStructName,
                         selectedFunctionName: selectedFunction,

                         display: true
                     }
                 )
             })
    }

    handleModuleChange(event) {
        let selectedModuleName = event.target.value;
        let selectedModule = this.state.selectedProject[selectedModuleName];
        let allStructs = Object.keys(selectedModule).sort();
        let selectedStruct = allStructs.length > 0 ? selectedModule[allStructs[0]].sort() : [];
        let allFunctions = selectedStruct;
        let selectedFunction = allFunctions.length > 0 ? allFunctions[0] : "";
        let selectedStructName = allStructs[0];

        this.setState(
            {
                allStructs: allStructs,
                allFunctions: allFunctions,
                selectedModule: selectedModule,
                selectedStruct: selectedStruct,
                selectedFunction: selectedFunction,

                selectedModuleName: selectedModuleName,
                selectedStructName: selectedStructName,
                selectedFunctionName: selectedFunction,
            }
        )
    }

    handleProjectChange(event) {
        let selectedProjectName = event.target.value;
        let selectedProject = this.state.data[selectedProjectName];
        let allModules = Object.keys(selectedProject);
        let selectedModule = selectedProject[allModules[0]];
        let allStructs = Object.keys(selectedModule);
        let selectedStruct = allStructs.length > 0 ? selectedModule[allStructs[0]].sort() : [];
        let allFunctions = selectedStruct;
        let selectedFunction = allFunctions.length > 0 ? allFunctions[0] : "";

        let selectedModuleName = allModules[0];
        let selectedStructName = allStructs[0];

        this.setState(
            {
                allModules: allModules,
                allStructs: allStructs,
                allFunctions: allFunctions,
                selectedProject: selectedProject,
                selectedModule: selectedModule,
                selectedStruct: selectedStruct,
                selectedFunction: selectedFunction,

                selectedProjectName: selectedProjectName,
                selectedModuleName: selectedModuleName,
                selectedStructName: selectedStructName,
                selectedFunctionName: selectedFunction,
            }
        )
    }

    handleFunctionChange(event) {
        let selectedFunction = event.target.value;
        this.setState({
            selectedFunction: selectedFunction
        });
    }

    handleStructChange(event) {
        let selectedStructName = event.target.value;
        let selectedStruct = this.state.selectedModule[selectedStructName].sort();
        let allFunctions = selectedStruct;
        let selectedFunction = allFunctions.length > 0 ? allFunctions[0] : "";
        this.setState(
            {
                allFunctions: allFunctions,
                selectedStruct: selectedStruct,
                selectedFunction: selectedFunction,
                selectedFunctionName: selectedFunction,
                selectedStructName: selectedStructName,
            }
        )
    }


    handleSubmitStruct(event) {
        let data = {
            "project": this.state.selectedProjectName,
            "isFunctionType": false,
            "selectedFunction": "",
            "selectedStruct": this.state.selectedModuleName + "/" + this.state.selectedStructName
        }
        axios.post(
            this.state.remoteUrl + '/draw/',
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                this.setState({
                    "displayText": res.data.displayText,
                    "displayCodeSnippet": res.data.structCodeSnippet,
                    "displayPath": this.state.remoteUrl + "/resource/" + this.state.selectedProjectName + "/struct_" + this.state.selectedModuleName + "_" + this.state.selectedStructName + ".png"
                })
            })
    }


    handleSubmitFunctionCallee(event) {
        let data = {
            "project": this.state.selectedProjectName,
            "isFunctionType": true,
            "selectedFunction":  this.state.selectedModuleName + "/" + this.state.selectedStructName + "/" + this.state.selectedFunctionName,
            "selectedStruct": ""
        }
        axios.post(
            this.state.remoteUrl + '/draw/',
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                this.setState({
                    "displayText": res.data.displayText,
                    "displayCodeSnippet": res.data.calleeCodeSnippet,
                    "displayPath": this.state.remoteUrl + "/resource/" + this.state.selectedProjectName + "/function_callee_" + this.state.selectedModuleName + "_" + this.state.selectedStructName + "_" + this.state.selectedFunctionName + ".png"
                })
            })
    }

    handleSubmitFunctionCaller(event) {
        let data = {
            "project": this.state.selectedProjectName,
            "isFunctionType": true,
            "selectedFunction":  this.state.selectedModuleName + "/" + this.state.selectedStructName + "/" + this.state.selectedFunctionName,
            "selectedStruct": ""
        }
        axios.post(
            this.state.remoteUrl + '/draw/',
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                this.setState({
                    "displayText": res.data.displayText,
                    "displayCodeSnippet": res.data.callerCodeSnippet,
                    "displayPath": this.state.remoteUrl + "/resource/" + this.state.selectedProjectName + "/function_caller_" + this.state.selectedModuleName + "_" + this.state.selectedStructName + "_" + this.state.selectedFunctionName + ".png"
                })
            })
    }

    render() {
        return (
            <div>


                        <span className="selectElem">
                            <label>选择项目: </label>
                            <select onChange={this.handleProjectChange}>
                                {this.state.allProjects.map(v => {return <option key={v} value={v}>{v}</option>} )}
                            </select>
                        </span>

                        <span className="selectElem">
                            <label>选择模块: </label>
                            <select onChange={this.handleModuleChange}>
                                {this.state.allModules.map(v => {return <option key={v} value={v}>{v}</option>})}
                             </select>
                        </span>

                        <span className="selectElem">
                            <label>选择Struct: </label>
                            <select onChange={this.handleStructChange}>
                                {this.state.allStructs.map(v => {return <option key={v} value={v}>{v}</option>} )}
                             </select>
                       </span>

                       <span className="selectElem">
                            <label>选择Function: </label>
                            <select onChange={this.handleFunctionChange}>
                                {this.state.allFunctions.map(v => {return <option key={v} value={v}>{v}</option>} )}
                             </select>
                       </span>

                        <div>
                            <br/>
                            <button className="selectElem" onClick={this.handleSubmitStruct}>查看结构体</button>

                            <button className="selectElem" onClick={this.handleSubmitFunctionCallee}>查看函数调用</button>

                            <button className="selectElem" onClick={this.handleSubmitFunctionCaller}>查看函数被调用</button>
                        </div>


                        <div>
                            <br/>
                            <Display displayPath={this.state.displayPath}  displayText={this.state.displayText} displayCodeSnippet={this.state.displayCodeSnippet} />
                        </div>
            </div>

        );
    }
}

export default Selector;