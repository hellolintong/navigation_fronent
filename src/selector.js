import React from 'react';
import './selector.css';
import Highlight from "react-highlight.js";
import axios from 'axios';

class Selector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedProject: '',
            selectedFunction: '',
            selectedStruct: '',
            allProjectElements: {},
            allFunctions: [],
            allStructs: [],
            displayPath: "",
            displayText: "",
            displayCodeSnippet: {},
            isFunctionType: true,
            remoteUrl: "http://www.darktalk.cn"
        }
        this.handleProjectChange = this.handleProjectChange.bind(this);
        this.handleFunctionChange = this.handleFunctionChange.bind(this);
        this.handleStructChange = this.handleStructChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeParseType = this.handleChangeParseType.bind(this);
    }

    componentDidMount() {
        axios.get(this.state.remoteUrl + '/load/')
             .then((res) => {
                 this.setState({
                     allProjectElements: res.data,
                     selectedProject: Object.keys(res.data)[0],
                     allFunctions: res.data[Object.keys(res.data)[0]]["functions"],
                     allStructs: res.data[Object.keys(res.data)[0]]["structs"],
                     selectedFunction: res.data[Object.keys(res.data)[0]]["functions"][0],
                     selectedStruct: res.data[Object.keys(res.data)[0]]["structs"][0],
                 })
             })
    }

    handleProjectChange(event) {
        let selectedProject = event.target.value;

        this.setState({
            selectedProject: selectedProject,
            allFunctions: this.state.allProjectElements[selectedProject]["functions"],
            allStructs: this.state.allProjectElements[selectedProject]["structs"],
            selectedFunction: this.state.allProjectElements[selectedProject]["functions"][0],
            selectedStruct: this.state.allProjectElements[selectedProject]["structs"][0],
        });
    }

    handleChangeParseType(event) {
        if (event.target.value === 'parseFunction') {
            this.setState({
                isFunctionType: true,
            })
        } else {
            this.setState({
                isFunctionType: false,
            })
        }
    }

    handleFunctionChange(event) {
        let selectedFunction = event.target.value;
        this.setState({
            selectedFunction: selectedFunction
        });
    }

    handleStructChange(event) {
        let selectedStruct = event.target.value;
        this.setState({
            selectedStruct: selectedStruct
        });
    }

    handleSubmit(event) {
        let data = {
            "project": this.state.selectedProject,
            "isFunctionType": this.state.isFunctionType,
            "selectedFunction": this.state.selectedFunction,
            "selectedStruct": this.state.selectedStruct
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
                    "displayCodeSnippet": res.data.displayCodeSnippet
                })
                if (this.state.isFunctionType) {
                    let res = this.state.selectedFunction.split("/")
                    let path = res.join('_')
                    this.setState(
                        {
                            "displayPath": this.state.remoteUrl + "/resource/" + this.state.selectedProject + "/function_" + path + ".png"
                        }
                    )
                } else {
                    let res = this.state.selectedStruct.split("/")
                    let path = res.join('_')
                    this.setState(
                        {
                            "displayPath": this.state.remoteUrl + "/resource/" + this.state.selectedProject + "/struct_" + path + ".png"
                        }
                    )
                }
            })
    }

    render() {
        const isFunctionType = this.state.isFunctionType;
        return (
            <div>
                <div>
                    <form>
                        <div >
                            <label>选择项目:  </label>
                            <select className="selectProject" onChange={this.handleProjectChange}>
                                {Object.keys(this.state.allProjectElements).map(v => {return <option key={v} value={v}>{v}</option>} )}
                            </select>
                        </div>
                    </form>
                </div>
                <div>
                    <div>
                        <div>
                            <span>
                                <select onChange={this.handleChangeParseType}>
                                    <option value="parseFunction">解析函数</option>
                                    <option value="parseStruct">解析结构体</option>
                                </select>
                            </span>

                            {
                                isFunctionType ?
                                <span className="selectElem" onChange={this.handleFunctionChange}>
                                <select>
                                {this.state.allFunctions.map(v => {return <option key={v} value={v}>{v}</option>} )}
                                </select>
                                </span>
                                :
                                <span className="selectElem" onChange={this.handleStructChange}>
                                <select>
                                {this.state.allStructs.map(v => {return <option key={v} value={v}>{v}</option>} )}
                                </select>
                                </span>
                            }
                            <button className="submitBtn" onClick={this.handleSubmit}>确认</button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="displayImage">
                        <img src={this.state.displayPath} />
                    </div>
                    <div className="displayText">
                        <pre>
                        {this.state.displayText}
                        </pre>
                    </div>
                    <div>
                        {Object.values(this.state.displayCodeSnippet).map(v => {return <Highlight language={"golang"}>{v}</Highlight>} )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Selector;