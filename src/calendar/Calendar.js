import React, { Component } from "react";
import "./CalendarStyles.css";
import { AgGridReact } from "@ag-grid-community/react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { SetFilterModule } from "@ag-grid-enterprise/set-filter";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { removeClass } from "@syncfusion/ej2-base";
import Toast from 'light-toast';
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import "@ag-grid-community/core/dist/styles/ag-grid.css";
import "@ag-grid-community/core/dist/styles/ag-theme-alpine.css";
import "@ag-grid-community/core/dist/styles/ag-theme-balham.css";
import "./calendar.css";
import {
  ScheduleComponent,
  Week,
  Inject,
} from "@syncfusion/ej2-react-schedule";

var data = [];

const styles = {
  wrap: {
    display: "flex",
  },
  left: {
    width: "500px",
  },
  main: {
    flex: "1",
  },
};

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      delId: 0,
      courseId: "",
      subject: "",
      code: "",
      title: "",
      section: "",
      startTime: "",
      endTime: "",
      instructor: "",
      start: "",
      end: "",
      viewType: "Week",
      classPattern: "",
      durationBarVisible: false,
      modules: [
        ClientSideRowModelModule,
        SetFilterModule,
        MenuModule,
        ColumnsToolPanelModule,
      ],
      columnDefs: [
        {
          headerName: "Course ID",
          field: "CourseID",
          filter: true,
          filterParams: {
            defaultToNothingSelected: true,
            suppressSelectAll: true,
          },
        },
        {
          headerName: "Subject",
          field: "Subject",
          filter: "agSetColumnFilter",
          valueGetter: abValueGetter,
          filterParams: {
            defaultToNothingSelected: true,
            suppressSelectAll: true,
          },
        },
        {
          headerName: "Course Title",
          field: "CourseTitle",
          colId: "courseTitle",
          filter: "agSetColumnFilter",
          filterParams: {
            defaultToNothingSelected: true,
            suppressSelectAll: true,
          },
        },
        {
          headerName: "Section",
          field: "Section",
          filter: "agSetColumnFilter",
          filterParams: {
            defaultToNothingSelected: true,
            suppressSelectAll: true,
          },
        },
        {
          headerName: "Days",
          field: "ClassPattern",
          filter: "agSetColumnFilter",
          filterParams: {
            defaultToNothingSelected: true,
            suppressSelectAll: true,
          },
        },
        {
          headerName: "StartTime",
          field: "MtgStart",
          filter: "agSetColumnFilter",
          filterParams: {
            defaultToNothingSelected: true,
            suppressSelectAll: true,
          },
        },
        {
          headerName: "End Time",
          field: "EndTime",
          filter: "agSetColumnFilter",
          filterParams: {
            defaultToNothingSelected: true,
            suppressSelectAll: true,
          },
        },
        {
          headerName: "Instructor ID",
          field: "InstructorID",
          filter: "agSetColumnFilter",
          filterParams: {
            defaultToNothingSelected: true,
            suppressSelectAll: true,
          },
        },
        {
          headerName: "Instructor",
          field: "DisplayName",
          filter: "agSetColumnFilter",
          filterParams: {
            defaultToNothingSelected: true,
            suppressSelectAll: true,
          },
        },
        {
          headerName: "Degree",
          field: "Career",
          filter: "agSetColumnFilter",
          filterParams: {
            defaultToNothingSelected: true,
            suppressSelectAll: true,
          },
        },
      ],
      defaultColDef: {
        flex: 1,
        minWidth: 130,
        wrap: true,
        resizable: false,
        floatingFilter: true,
      },
      headerName: "Name",
      rowSelection: "single",
      rowData: null,
    };
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const updateData = (data) => {
      this.setState({ rowData: data });
    };

    fetch("http://myjson.dit.upm.es/api/bins/1ij0")
      .then((resp) => resp.json())
      .then((data) => updateData(data));
  };

  onSelectionChanged = () => {
    var selectedRows = this.gridApi.getSelectedRows();
    this.setState({
      subject: selectedRows[0].Subject + " " + selectedRows[0].Catalog,
      courseId: selectedRows[0].CourseID,
      instructor: selectedRows[0].DisplayName,
      code: selectedRows[0].Catalog,
      title: selectedRows[0].CourseTitle,
      section: selectedRows[0].Section,
      startTime: selectedRows[0].MtgStart,
      endTime: selectedRows[0].EndTime,
      classPattern: selectedRows[0].ClassPattern,
    });
  };

  headerHeightSetter() {
    var padding = 20;
    var height = padding;
    this.api.setHeaderHeight(height);
    this.api.resetRowHeights();
  }

  componentDidMount() {
    this.setState({
      startDate: "2021-10-11",
    });
  }

  onActionComplete() {
    this.appendElement("Schedule <b>Action Complete</b> event called<hr>");
  }

  onRenderCell(args) {
    if (
      args.elementType === "dateHeader" ||
      args.elementType === "monthCells"
    ) {
      removeClass(args.element.childNodes, "e-navigate");
    }
  }

  onPopupOpen(args) {
    args.cancel = true;
  }

  onEventClick(args) {
    var dataId = args.element.attributes[1].value;
    var id = dataId.substring(dataId.indexOf("_") + 1);
    this.setState({ delId: id });
  }

  render() {
    return (
      <div>
        <div style={styles.wrap}>
          <div
            style={styles.left}
            id="myGrid"
            style={{
              height: "630px",
              width: "400000px",
            }}
            className="ag-theme-balham grid"
            >
            <AgGridReact
              modules={this.state.modules}
              columnDefs={this.state.columnDefs}
              defaultColDef={this.state.defaultColDef}
              rowSelection={this.state.rowSelection}
              onGridReady={this.onGridReady}
              rowData={this.state.rowData}
              onSelectionChanged={this.onSelectionChanged.bind(this)}
              onFirstDataRendered={this.headerHeightSetter}
            />
            <button onClick={() => this.getDate()}>Add Course</button>
            <button
              onClick={() => {
                this.onDeleteClick();
              }}
            >
              Delete Course
            </button>
            <button
              onClick={() => {
                this.onClearAllClick();
              }}
            >
              Clear Timetable
            </button>
          </div>
          <div className="calendar">
            <div className="calendarContainer">
              <div className="main_calendar" style={(styles.main, {})}>
                <ScheduleComponent
                  ref={(t) => (this.scheduleObj = t)}
                  height="675px"
                  selectedDate={new Date(2018, 1, 15)}
                  showHeaderBar={false}
                  showTimeIndicator={false}
                  eventClick={this.onEventClick.bind(this)}
                  renderCell={this.onRenderCell.bind(this)}
                  // actionBegin={this.onActionBegin.bind(this)}
                  eventSettings={{
                    dataSource: data,
                    fields: {
                      id: "Id",
                      subject: { name: "Subject" },
                      isAllDay: { name: "IsAllDay" },
                      startTime: { name: "StartTime" },
                      endTime: { name: "EndTime" },
                    },
                  }}
                  popupOpen={this.onPopupOpen.bind(this)}
                >
                  <Inject services={[Week]} />
                </ScheduleComponent>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  onDeleteClick() {
    var id=this.state.delId;
    this.scheduleObj.deleteEvent(this.state.delId);
    this.gridApi.forEachNode(function (rowNode) {
      if (rowNode.data.CourseID === id) {
        rowNode.setRowHeight(28);
      }
    });
    this.gridApi.onRowHeightChanged();
  }
  
  onClearAllClick() {
    this.scheduleObj.deleteEvent(1);
    data = [];
    this.setState({delId:""})
    this.onActionComplete.bind(this);
    this.gridApi.resetRowHeights();
    this.gridApi.onRowHeightChanged();
  }

  getDate() {
    const dp = this.calendar;
    var Time = this.state.startTime.substring(
      this.state.startTime.length - 2,
      this.state.startTime.length
    );
    var startHour = 1;
    var startMin = 1;
    var startTime = this.state.startTime.substring(
      0,
      this.state.startTime.indexOf(":")
    );
    if (Time === "AM") {
      startHour = parseInt(startTime);
      startMin = parseInt(
        this.state.startTime.substring(
          this.state.startTime.indexOf(":") + 1,
          this.state.startTime.indexOf(":") + 3
        )
      );
    } else {
      if (startTime === "12") {
        startHour = parseInt(startTime);
        startMin = parseInt(
          this.state.startTime.substring(
            this.state.startTime.indexOf(":") + 1,
            this.state.startTime.indexOf(":") + 3
          )
        );
      } else {
        startHour = (parseInt(startTime) + 12).toString();
        startMin = parseInt(
          this.state.startTime.substring(
            this.state.startTime.indexOf(":") + 1,
            this.state.startTime.indexOf(":") + 3
          )
        );
      }
    }
    Time = this.state.endTime.substring(
      this.state.endTime.length - 2,
      this.state.endTime.length
    );
    var endHour = 1;
    var endMin = 1;
    var endTime = this.state.endTime.substring(
      0,
      this.state.endTime.indexOf(":")
    );
    if (Time === "AM") {
      endHour = parseInt(endTime);
      endMin = parseInt(
        this.state.endTime.substring(
          this.state.endTime.indexOf(":") + 1,
          this.state.endTime.indexOf(":") + 3
        )
      );
    } else {
      if (endTime === "12") {
        endHour = parseInt(endTime);
        endMin = parseInt(
          this.state.endTime.substring(
            this.state.endTime.indexOf(":") + 1,
            this.state.endTime.indexOf(":") + 3
          )
        );
      } else {
        endHour = parseInt(endTime) + 12;
        endMin = parseInt(
          this.state.endTime.substring(
            this.state.endTime.indexOf(":") + 1,
            this.state.endTime.indexOf(":") + 3
          )
        );
      }
    }
    var day = 1;
    for (var i = 0; i < this.state.classPattern.length; i++) {
      if (this.state.classPattern.substring(i, i + 1) === "M") {
        day = 12;
      }
      if (
        this.state.classPattern.substring(i, i + 1) === "T" &&
        this.state.classPattern.substring(i, i + 2) !== "TH"
      ) {
        day = 13;
      }
      if (this.state.classPattern.substring(i, i + 1) === "W") {
        day = 14;
      }
      if (this.state.classPattern.substring(i, i + 1) === "F") {
        day = 16;
      }
      if (this.state.classPattern.substring(i, i + 1) === "S") {
        day = 17;
      }
      if (this.state.classPattern.substring(i, i + 2) === "TH") {
        day = 15;
        i += 1;
      }
      this.setState({
        sTime: new Date(2018, 1, day, startHour, endMin),
        eTime: new Date(2018, 1, day, endHour, endMin),
      });
      var startDate = new Date(2018, 1, day, startHour, startMin);
      var endDate = new Date(2018, 1, day, endHour, endMin);
      if(!this.scheduleObj.isSlotAvailable(startDate,endDate)){
        Toast.info('Time slot is filled, please select a different course timing.', 2000, () => {
          Toast.hide();
        });
        this.setState({delId:this.state.courseId});
        this.onDeleteClick();
        break;
      }
      var Data = [
        {
          Id: this.state.courseId,
          Subject: this.state.subject + " " + this.state.section,
          IsAllDay: false,
          StartTime: startDate,
          EndTime: endDate,
        },
      ];
      this.scheduleObj.addEvent(Data);
      this.onActionComplete.bind(data);
      this.gridApi.forEachNode(function (rowNode) {
        if (rowNode.data.CourseID === Data[0].Id) {
          rowNode.setRowHeight(0);
        }
      });
      this.gridApi.onRowHeightChanged();
    }
  }
}

function abValueGetter(params) {
  return params.data.Subject + " " + params.data.Catalog;
}

export default Calendar;
