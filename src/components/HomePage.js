import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import './HomePage.scss'
import CrudServices from '../Services/CrudServices'

const service = new CrudServices()

export default class HomePage extends Component {
  constructor() {
    super()
    this.state = {
      File: new FormData(),
      UploadFile: false,
      FileExtension: '',
      DataRecord: [],
    }
  }

  componentWillMount() {
    console.log('Component Will Mount Calling')
    this.ReadRecord()
  }

  ReadRecord() {
    service
      .ReadRecord()
      .then((data) => {
        console.log(data.data.readRecord)
        console.log(data.data.readRecordData)
        this.setState({ DataRecord: data.data.readRecord })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  changeHandler = (event) => {
    console.log("Event : ", event.target.files[0]);
    this.setState({ File: event.target.files[0] })
    this.setState({ UploadFile: true })
    this.setState({
      FileExtension: event.target.files[0].name.split('.').pop(),
    })
  }

  InsertCsvRecord(fName) {
    console.log("inside DataService:", fName);
    let fdata = new FormData();
    fdata.append("File", fName);
    const requestOptions = {
      method: "POST",
      headers: {
        "cache-control": "no-cache"
      },
      credentials: "include",
      body: fdata
    };
    return fetch(
      baseURL + "/api/ProgramSettings/InsertStoreTags",
      requestOptions
    )
      .then(res => res.json())
      .then(result => {
        console.log(result, "result");
        return result;
      });
  }

  handleClick = () => {
    if (this.state.FileExtension !== '') {
      let fdata = new FormData();
      const data = {
        file: fdata.append("file",this.state.File),
      }

      if (this.state.FileExtension.toLowerCase() === 'csv') {
        service
          .InsertCsvRecord(data)
          .then((data) => {
            console.log(data)
          })
          .catch((error) => {
            console.log(error)
          })
      } else if (this.state.FileExtension.toLowerCase() === 'xlsx') {
        service
          .InsertExcelRecord(data)
          .then((data) => {
            console.log(data)
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        console.log('Invalid File')
      }
    }
  }

  render() {
    let state = this.state
    let Self = this
    return (
      <div className="MainContainer">
        <div className="SubContainer">
          <div className="Box1">
            <div className="Input-Container">
              <div className="flex-Container">
                <div className="sub-flex-Container">
                  <div className="FileName">{state.File.name}</div>
                  <div className="UploadButton">
                    <input
                      accept=".xlsx, .csv"
                      className="Upload"
                      id="contained-button-file"
                      type="file"
                      onChange={this.changeHandler}
                    />
                    <label htmlFor="contained-button-file">
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                      >
                        Upload
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex-button">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={this.handleClick}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
          <div className="Box2">
            {Array.isArray(this.state.DataRecord) &&
            this.state.DataRecord.length > 0 ? (
              this.state.DataRecord.map(function (data, index) {
                return (
                  <div key={index} className="data-flex">
                    <div className="UserId">{data.userId}</div>
                    <div className="UserName">{data.userName}</div>
                    <div className="EmailID">{data.emailID}</div>
                    <div className="MobileNumber">{data.mobileNumber}</div>
                    <div className="Salary">{data.salary}</div>
                    <div className="Gender">{data.gender}</div>
                    <div className="Age">{data.age}</div>
                  </div>
                )
              })
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    )
  }
}
