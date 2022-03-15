import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import './HomePage.scss'
import CrudServices from '../Services/CrudServices'
import ReactFileReader from 'react-file-reader'
import Pagination from '@material-ui/lab/Pagination'
import DeleteIcon from '@material-ui/icons/Delete'

const service = new CrudServices()

export default class HomePage extends Component {
  constructor() {
    super()
    this.state = {
      File: new FormData(),
      UploadFile: false,
      FileExtension: '',
      DataRecord: [],
      RecordPerPage: 4,
      PageNumber: 1,
      currentPage: 1,
      totalRecords: 0,
      totalPages: 0,
    }
  }

  componentWillMount() {
    console.log('Component Will Mount Calling')
    this.ReadRecord(this.state.PageNumber)
  }

  ReadRecord(CurrentPage) {
    let data = {
      recordPerPage: this.state.RecordPerPage,
      pageNumber: CurrentPage,
    }

    console.log('Record Request Body : ', data)

    service
      .ReadRecord(data)
      .then((data) => {
        console.log(data.data.readRecord)
        this.setState({ totalRecords: data.data.totalRecords })
        this.setState({ totalPages: data.data.totalPages })
        this.setState({ DataRecord: data.data.readRecord })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  handleClick = (event) => {
    event.preventDefault()
    if (this.state.FileExtension !== '') {
      const data = new FormData()
      data.append('file', this.state.File)

      if (this.state.FileExtension.toLowerCase() === 'csv') {
        service
          .InsertCsvRecord(data)
          .then((data) => {
            console.log(data)
            this.ReadRecord(this.state.PageNumber)
          })
          .catch((error) => {
            console.log(error)
            this.ReadRecord(this.state.PageNumber)
          })
      } else if (this.state.FileExtension.toLowerCase() === 'xlsx') {
        service
          .InsertExcelRecord(data)
          .then((data) => {
            console.log(data)
            this.ReadRecord(this.state.PageNumber)
          })
          .catch((error) => {
            console.log(error)
            this.ReadRecord(this.state.PageNumber)
          })
      } else {
        console.log('Invalid File')
      }
    }
  }

  handleFiles = (files) => {
    var reader = new FileReader()
    reader.readAsText(files[0])
    this.setState({ File: files[0] })
    this.setState({ UploadFile: true })
    this.setState({
      FileExtension: files[0].name.split('.').pop(),
    })
  }

  handlePaging = (event, value) => {
    this.setState({ PageNumber: value })
    console.log('value : ', value)
    this.ReadRecord(value)
  }

  handleDelete = (datas) => {
    console.log('Delete Body Id: ', datas.userId)
    service
      .DeleteRecord(datas.userId)
      .then((data) => {
        console.log(data)
        this.ReadRecord(this.state.PageNumber)
      })
      .catch((error) => {
        console.log(error)
        this.ReadRecord(this.state.PageNumber)
      })
  }

  render() {
    //console.log('State : ', this.state)
    let state = this.state
    let Self = this
    return (
      <div className="MainContainer">
        <div className="SubContainer">
          <div className="Box1">
            <div className="Input-Container">
              <div className="flex-Container">
                <div className="Header">Excel & Csv Bulk Data Upload</div>
                <div className="sub-flex-Container">
                  <div className="FileName">
                    {state.File !== null ? state.File.name : ''}
                  </div>
                  <div className="UploadButton">
                    <ReactFileReader
                      handleFiles={this.handleFiles}
                      fileTypes={'.xlsx, .csv'}
                      className="Upload"
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                      >
                        Submit
                      </Button>
                    </ReactFileReader>
                  </div>
                </div>
              </div>
              <div className="flex-button">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={this.handleClick}
                >
                  Upload
                </Button>
              </div>
            </div>
          </div>
          <div className="Box2">
            <div className="data-flex" style={{color:"red"}}>
              <div className="UserId" >UserId</div>
              <div className="UserName">UserName</div>
              <div className="EmailID">EmailID</div>
              <div className="MobileNumber">MobileNo.</div>
              <div className="Salary">Salary</div>
              <div className="Gender">Gender</div>
              <div className="Age">Age</div>
              <div className="Delete"></div>
            </div>
            {Array.isArray(this.state.DataRecord) &&
            this.state.DataRecord.length > 0
              ? this.state.DataRecord.map(function (data, index) {
                  return (
                    <div key={index} className="data-flex">
                      <div className="UserId">{data.userId}</div>
                      <div className="UserName">{data.userName}</div>
                      <div className="EmailID">{data.emailID}</div>
                      <div className="MobileNumber">{data.mobileNumber}</div>
                      <div className="Salary">{data.salary}</div>
                      <div className="Gender">{data.gender}</div>
                      <div className="Age">{data.age}</div>
                      <div className="Delete">
                        <Button
                          variant="outlined"
                          // color="primary"
                          onClick={() => {
                            Self.handleDelete(data)
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                      </div>
                    </div>
                  )
                })
              : null}
          </div>
        </div>
        <Pagination
          count={state.totalPages}
          page={this.state.PageNumber}
          onChange={this.handlePaging}
          variant="outlined"
          shape="rounded"
          color="secondary"
        />
      </div>
    )
  }
}
