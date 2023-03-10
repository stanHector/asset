import React, { Component } from "react";
import '../App.css'
import AssetService from "../services/AssetService";
import { Link } from 'react-router-dom';
import { Visibility, Delete, Edit, CloudUploadOutlined, CloudDownloadOutlined, AddCircleOutlineSharp, AccountBalanceOutlined, SearchOutlined } from '@material-ui/icons'
import { CSVLink } from "react-csv";
import axios from 'axios'
import { BaseURL } from "../services";
import ModalComponent from "./Modal/Modal";
import emailjs from "@emailjs/browser"

const headers = [
  // { label: "Id", key: "id" },
  { label: "Description", key: "description" },
  { label: "AssetId", key: "assetId" },
  { label: "Manufacturer", key: "manufacturer" },
  { label: "OtherBrand/Make", key: "otherBrand" },
  { label: "Model Number", key: "modelNumber" },
  { label: "Serial Number", key: "serialNumber" },
  { label: "Date Received", key: "dateReceived" },
  { label: "Purchase Price(N)", key: "purchasePrice" },
  { label: "FundedBy", key: "funder" },
  { label: "Project", key: "project" },
  { label: "Condition", key: "condition" },
  { label: "State", key: "states" },
  { label: "Facility", key: "facility" },
  { label: "Location", key: "location" },
  { label: "Assignee", key: "assignee" },
  { label: "Email", key: "email" },
  { label: "Status", key: "status" },
];

const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, .5)',
    transition: 'opacity .2s ease',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};


class InventoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem('user')).password,
      states: JSON.parse(localStorage.getItem('user')).states,
      userType: JSON.parse(localStorage.getItem('user')).userType,
      inventories: [],
      currentPage: 1,
      recordPerPage: 100,
      search: '',
      open: false,
      deleteReason: "",
      assetId: "",
      loading: false
    };

    this.csvLinkEl = React.createRef();
    this.form = React.createRef();

    // this.createAsset = this.createAsset.bind(this);
    this.editInventory = this.editInventory.bind(this);
    // this.deleteAsset = this.deleteAsset.bind(this);
    this.viewInventory = this.viewInventory.bind(this);
  }

  componentDidMount() {
    this.getInventoriesByStatesPagination(this.state.currentPage);

  }


  getInventoriesByStatesPagination(currentPage) {
    currentPage = currentPage - 1;
    axios.get(`${BaseURL}/inventories/${this.state.userType === 'User' ? this.state.states : ''}?page=${currentPage}&size=${this.state.recordPerPage}`)
      .then(response => response.data).then((data) => {
        this.setState({
          inventories: data.content,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
          currentPage: data.number + 1
        });
      });
  }


  //Writing All the pagination functions
  //Show Next page
  showNextPage = () => {
    if (this.state.currentPage < Math.ceil(this.state.totalElements / this.state.recordPerPage)) {
      if (!this.state.search) {
        this.getInventoriesByStatesPagination(this.state.currentPage + 1);
      } else {
        this.searchInventory(this.state.currentPage + 1)
      }
    }
  };

  //Show Last Page
  showLastPage = () => {
    if (this.state.currentPage < Math.ceil(this.state.totalElements / this.state.recordPerPage)) {
      if (!this.state.search) {
        this.getInventoriesByStatesPagination(Math.ceil(this.state.totalElements / this.state.recordPerPage));
      }
      else {
        this.searchInventory(Math.ceil(this.state.totalElements / this.state.recordPerPage));
      }
    }
  };

  //Show First page
  showFirstPage = () => {
    let firstPage = 1;
    if (this.state.currentPage > firstPage) {
      if (!this.state.search) {
        this.getInventoriesByStatesPagination(firstPage);
      } else {
        this.searchInventory(firstPage)
      }
    }
  };

  //Show previous page
  showPrevPage = () => {
    let prevPage = 1
    if (this.state.currentPage > prevPage) {
      if (!this.state.search) {
        this.getInventoriesByStatesPagination(this.state.currentPage - prevPage);
      } else {
        this.searchInventory(this.state.currentPage - prevPage);
      }
    }
  };

  //Search Box Method
  searchBox = (e) => {
    this.setState({
      //assigning value to event target
      [e.target.name]: e.target.value,
    });
  };

//Search Method Logic
searchInventory= (currentPage) => {
  currentPage = currentPage - 1;
  axios.get(`${BaseURL}/inventories/` + this.state.search + "?page=" + currentPage + "&size=" + this.state.recordPerPage)
    .then(response => response.data).then((data) => {
      this.setState({
        inventories: data.content,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        currentPage: data.number + 1
      });
    });
};
  //Reset Search Box
  resetInventory = (currentPage) => {
    this.setState({ "search": '' });
    this.getInventoriesByStatesPagination(currentPage);
  };

  // deleteAsset(id) {
  //   this.setState({ open: true, assetId: id })
  // }

  // deleteAsset(id) {
  //   const text = 'Are you sure you want to delete?'
  //   if (window.confirm(text) === true) {
  //     AssetService.deleteAsset(id).then((res) => {
  //       this.setState({
  //         assets: this.state.assets.filter((asset) => asset.id !== id),
  //       });
  //     });
  //   }
  // }

  // sendEmail = () => {
  //   // e.preventDefault();

  //   // console.log(this.form)

  //   emailjs.sendForm('service_ibct5m8', 'template_dxgc61f', this.form.current, 'rNTUeFdnI4ZGZysWC')
  //     .then((result) => {
  //       // console.log(result.text);
  //     }, (error) => {
  //       console.log(error.text);
  //     });
  // }

  // callDeleteAsset(e, id) {
  //   e.preventDefault();
  //   this.setState({ loading: true })
  //   AssetService.deleteAsset(id).then((res) => {
  //     if (res.data.deleted) {
  //       this.sendEmail()
  //       this.setState({
  //         assets: this.state.assets.filter((asset) => asset.id !== id),
  //         open: true,
  //         loading: false
  //       });
  //     }
  //   });
  // }


  // CRS-Bvnr-bSj9-rVGrW
  editInventory(id) {
    this.props.history.push(`/update-inventory/${id}`);
  }

  viewInventory(id) {
    this.props.history.push(`/view-inventory/${id}`);
  }

  // createAsset() {
  //   this.props.history.push("/create-asset");
  // }

  cancel() {
    this.props.history.push("/dashboard");
  }

  upload() {
    this.props.history.push("/upload-inventory");
  }

  render() {
    const { inventories, currentPage, totalPages, recordPerPage, search } = this.state;
    const user = JSON.parse(localStorage.getItem('user'));
    const users = JSON.parse(localStorage.getItem('user'))?.userType;
    const userType = user?.userType;
    const userLocation = user?.result?.states
    const userInventories = this.state?.inventories?.map((x) => x).filter((x) => x.states === userLocation)
    // const data = userType !== 'User' ? this.state.assets : userAssets;
    const data = userType !== 'User' ? this.state.inventories : userInventories;

    // console.log("data :: " + data)


    const downloadReport = async () => {
      this.setState({ data: data }, () => {
        setTimeout(() => {
          this.csvLinkEl._result.link.click();

        });
      });
    }


    const handleCloseModal = () => {
      this.setState({ open: !this.state.open })
    }

    const handleMessage = (e) => {
      const { value } = e.target

      this.setState({ deleteReason: value })
    }

    return (
      <React.Fragment>
        <ModalComponent open={this.state.open} close={handleCloseModal} customStyles={customStyles}>
          <div>
            <form ref={this.form} onSubmit={(e) => this.callDeleteAsset(e, this.state.assetId)} >
              <label>Reason for deleting</label>
              <textarea rows="4" cols="50" name="deleteReason" onChange={handleMessage}></textarea>
              <div>
                <button onClick={handleCloseModal}>Cancel</button>
                <button>Delete</button>
              </div>
            </form>
          </div>
        </ModalComponent>
        <div className="asset-list">
          {/* <Topbar /> */}
          {/* <div className="row"> */}
          <div className="top" style={{ backgroundColor: "#CE5300" }}>
            <div style={{ marginTop: "20px" }} >
              <span className="logs">Inventories</span>
            </div>
            <div className="d-flex flex-row bd-highlight mb-3">
              <input style={{ borderRadius: "12px", marginTop: "20px", marginRight: "15px", marginLeft: "40px" }} type="text" className="form-control" name="search" size="100" placeholder="Search by PO Number/Batch No/Name of article" value={search} onChange={this.searchBox} />
              <button style={{ borderRadius: "12px", marginTop: "15px", backgroundColor: "antiquewhite", borderColor: "antiquewhite", color: "chocolate" }} type="button" name="search" className=" btn btn-outline-primary" onClick={this.searchInventory}><SearchOutlined /></button>
            </div>
            <div className="topRight">


              {/* <button style={{ marginRight: "8px", margin: "10px" , backgroundColor:"#82E0AA", borderColor:"#82E0AA", color:"#D5F5E3"}} className="btn btn-primary float-lg-end" onClick={this.createAsset.bind(this)} >
                  <AddCircleOutlineSharp />
                </button> */}

              {
                users !== 'User' &&
                <button style={{ marginRight: "8px", backgroundColor: "antiquewhite", borderColor: "antiquewhite", color: "chocolate" }} className="btn btn-primary float-lg-end" onClick={this.upload.bind(this)}>
                  <CloudUploadOutlined />
                </button>}

              <button style={{ marginRight: "8px", backgroundColor: "antiquewhite", borderColor: "antiquewhite", color: "chocolate"}} className="btn btn-primary float-lg-end" onClick={this.cancel.bind(this)}>
                <AccountBalanceOutlined />
              </button>
              {
                users !== 'User' &&
                <button style={{ marginRight: "8px", backgroundColor: "antiquewhite", borderColor: "antiquewhite", color: "chocolate" }} className="btn btn-primary float-lg-end" onClick={downloadReport}>
                  <CloudDownloadOutlined />
                </button>
              }
            </div>
          </div>
          <table className="table table-striped table-bordered">
            <thead style={{ textAlign: "center", fontSize: "12px" }}>
              <tr>
                <th>No.</th>
                <th>Name Of Article</th>
                <th>Date Received</th>
                <th>Source</th>
                <th>AssetID</th>
                <th>Manufacturer</th>
                <th>Model Number</th>
                <th>Serial Number</th>
                <th>PO Number</th>
                <th>Batch No</th>
                <th>Received Quantity</th>
                {/* <th>Balance</th> */}
                {/* <th>Dispatched Location</th> */}
                <th colSpan="3">Actions</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: "center", fontSize: "11px" }}>
              {inventories.length === 0 ?
                <tr align="center"><td colSpan="20">No Record Found</td></tr> :
                data?.map((inventory, index) => (
                  <tr key={inventory?.id}>
                    <td>
                      {(recordPerPage * (currentPage - 1)) + index + 1}</td>
                    <td>{inventory.nameOfArticle}</td>
                    <td>{inventory.dateOfPurchase}</td>
                    <td>{inventory.source}</td>
                    <td>{inventory.assetId}</td>
                    <td>{inventory.manufacturer}</td>
                    <td>{inventory.modelNumber}</td>
                    <td>{inventory.serialNumber}</td>
                    <td>{inventory.purchaseOrderNumber}</td>
                    <td>{inventory.batchNo}</td>
                    <td>{inventory.receivedQuantity}</td>
                    {/* <td>{inventory.balance}</td> */}
                    {/* <td>{inventory.dispatchedLocation}</td> */}

                    <td className="text-center"><Link to={`/update-inventory/${inventory.id}`} className="edit"><Edit /></Link></td>
                    {/* {
                      users !== 'User' &&
                      <td className="text-center" style={{ paddingLeft: "20px" }}><i onClick={() => this.deleteInventory(inventory.id)} className="fa fa-trash" style={{ color: "red" }} ><Delete /> </i></td>
                    } */}
                    <td className="text-center" style={{ paddingLeft: "20px" }}><Link to={`/view-inventory/${inventory.id} `} className="view" style={{ alignItem: "center", color: "green" }}> <Visibility /></Link> </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <table className="table">
            <div style={{ float: 'left', fontFamily: 'monospace', color: '#0275d8' }}>
              Page {currentPage} of {totalPages}
            </div>
            <div style={{ float: 'right' }}>
              <div className="clearfix"></div>
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className="page-item"><a type="button" className="page-link" disabled={currentPage === 1 ? true : false} onClick={this.showPrevPage}>Previous</a></li>
                  <li className="page-item"><a type="button" className="page-link" disabled={currentPage === 1 ? true : false} onClick={this.showFirstPage}>First</a></li>
                  <li className="page-item"><a type="button" className="page-link" disabled={currentPage === totalPages ? true : false} onClick={this.showNextPage}>Next</a></li>
                  <li className="page-item"><a type="button" className="page-link" disabled={currentPage === totalPages ? true : false} onClick={this.showLastPage}>Last</a></li>
                </ul>
              </nav>
            </div>
          </table>
          <CSVLink
            headers={headers}
            data={data}
            totalPages={totalPages}
            filename="inventory.csv"
            target="_blank"
            ref={this.csvLinkEl} />
        </div>
      </React.Fragment>
    )
  }
}
export default InventoryList;