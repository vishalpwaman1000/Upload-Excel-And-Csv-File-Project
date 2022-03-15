import Configuration from './../Configuration/Configuration'
import Axios from './AxiosServices'

const axios = new Axios()
//const Config = new Configuration()

export default class CrudServices {
  InsertExcelRecord(data) {
    console.log('data : ', data, ' Url : ', Configuration.InsertExcelRecord)
    return axios.post(Configuration.InsertExcelRecord, data, false)
  }

  InsertCsvRecord(data) {
    console.log('data : ', data, ' Url : ', Configuration.InsertCsvRecord)
    return axios.post(Configuration.InsertCsvRecord, data, false)
  }

  ReadRecord(data) {
    console.log('Url : ', Configuration.GetRecord, 'Data : ', data)
    return axios.post(Configuration.GetRecord, data, false)
  }

  DeleteRecord(userId) {
    console.log('Url : ', Configuration.DeleteRecord)
    return axios.delete(
      Configuration.DeleteRecord,
      { data: { userID: userId } },
      false,
    )
  }
}
