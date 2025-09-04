import React, { useState } from 'react';
import Header from './Header';
import Leftsidebar from './Leftsidebar';
import { 
  Modal, Box, Button, TextField, Typography, Select, MenuItem, 
  FormControl, InputLabel, Accordion, AccordionSummary, AccordionDetails 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import tableicon__0 from '../images/csfs.svg';
import { useTable, usePagination } from 'react-table';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';

export default function Gantt_chart_universal() {
  // Modal state
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    projectNumber: '',
    projectName: '',
    managingCompany: 'OSB',
    ownerRepresentative: '',
    dueDate: '',
    task: '',
    status: 'Pending',
    projectStatus: '',
    category: '',
    description: '',
    startdate: '',
    enddate: '',
    assignManager: '',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = () => {
    console.log(newProject);
    // Add new project logic here
    handleClose();
  };

  // Define sample data
  const data = React.useMemo(
    () => [
      {
        created: '14 Jan 2022',
        managingCompany: 'ABC Builders',
        ownerName: 'John Marks',
        clientName: 'John Marks',
        manager: 'Betty Copper',
        status: <span className='s__09iuy0011'>In Progress</span>,
        setWorkweek: <Button variant="contained" color="primary">Set Workweek</Button>,
      },
    ],
    []
  );

  // Define columns
  const columns = React.useMemo(
    () => [
      {
        Header: 'Created',
        accessor: 'created',
      },
      {
        Header: 'Managing Company',
        accessor: 'managingCompany',
      },
      {
        Header: 'Owner Name',
        accessor: 'ownerName',
      },
      {
        Header: 'Client Name',
        accessor: 'clientName',
      },
      {
        Header: 'Manager',
        accessor: 'manager',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: '',
        accessor: 'setWorkweek',
      },
    ],
    []
  );

  // Use the useTable and usePagination hooks to create the table instance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex },
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
    },
    usePagination
  );

  return (
    <>
      <Header />
      <div className='mainpage'>
        <div className='row'>
          <div className='col-md-1'>
            <Leftsidebar />
          </div>
          <div className='col-md-11'>
            <div className='final__bg__09 s__0989000112'>
              <div className="seaech__box___00">
                <div className="row">
                  <div className='col-md-8'>
                    <div className='s_09ssd'>
                      <h3><span className='s__999099'><HomeIcon /></span>Universal Construction</h3>
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <ul className='button__action'>
                      <li><button className='edit__099'><EditIcon /></button></li>
                      <li><button className='edit__099'><DeleteOutlineIcon /></button></li>
                      <li><button className='edit__099'><MoreVertIcon /></button></li>
                    </ul>
                  </div>

                  <div className='createtabel s____tablle__showing__this'>
                    <table {...getTableProps()} className="table">
                      <thead>
                        {headerGroups.map(headerGroup => (
                          <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody {...getTableBodyProps()}>
                        {page.map(row => {
                          prepareRow(row);
                          return (
                            <tr {...row.getRowProps()}>
                              {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className='taskmanages'>
                <div className='row'>
                  <div className='col-md-4'>
                    <div className='totaltasks__sd'>
                      <div className='left__total__09'>
                        <span className='task__iconss'>
                          <AssignmentIcon />
                        </span>
                        <h3>Total Tasks</h3>
                      </div>
                      <div className='c__b447'>
                        <h2>14</h2>
                      </div>
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className='totaltasks__sd'>
                      <div className='left__total__09'>
                        <span className='task__iconss'>
                          <CalendarMonthIcon />
                        </span>
                        <h3>Duration</h3>
                      </div>
                      <div className='c__b447'>
                        <h2>03 Month</h2>
                      </div>
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className='totaltasks__sd d__0987'>
                      <div className='left__total__09'>
                        <span className='task__iconss'>
                          <ScheduleIcon />
                        </span>
                        <h3>Daily Hour</h3>
                      </div>
                      <div className='c__b447'>
                        <h2>08 Hrs</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='add__ganttchart'>
              {/* Add Accordion here */}
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Gantt Chart Activities</Typography>
                </AccordionSummary>



                
                <AccordionDetails>
                  <table>
                    <thead>
                      <tr>
                        <th className='s_oiuy'><img src={tableicon__0} alt="" /></th>
                        <th>ID</th>
                        <th>Activities</th>
                        <th>Original Duration</th>
                        <th>Status</th>
                        <th>Start</th>
                        <th>Finish</th>
                        <th>Actual Start</th>
                        <th>Actual Finish</th>
                        <th>Schedule % completed</th>
                        <th>Total Float</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="header">
                      <td className='col__bgg'></td>
                        <td>2024.1</td>
                        <td>DIV-03 - Concrete</td>
                        <td>23</td>
                        <td>Inprogress</td>
                        <td>12, May 2024</td>
                        <td>12, May 2024</td>
                        <td>-</td>
                        <td>-</td>
                        <td>25%</td>
                        <td>100</td>
                      </tr>
                      <tr>
                      <td className='col__bgg'></td>
                        <td>ID1</td>
                        <td>(3'-0" X 3'-0" X 1'-0")</td>
                        <td>23</td>
                        <td className="completed">Completed</td>
                        <td>12, May 2024</td>
                        <td>12, May 2024</td>
                        <td>-</td>
                        <td>-</td>
                        <td>25%</td>
                        <td>100</td>
                      </tr>
                      <tr>
                      <td className='col__bgg'></td>
                        <td>ID1</td>
                        <td>(3'-0" X 3'-0" X 1'-0")</td>
                        <td>23</td>
                        <td className="inprogress">Inprogress</td>
                        <td>12, May 2024</td>
                        <td>12, May 2024</td>
                        <td>-</td>
                        <td>-</td>
                        <td>25%</td>
                        <td>100</td>
                      </tr>
                      <tr>
                      <td className='col__bgg'></td>
                        <td>ID1</td>
                        <td>(3'-0" X 3'-0" X 1'-0")</td>
                        <td>23</td>
                        <td className="completed">Completed</td>
                        <td>12, May 2024</td>
                        <td>12, May 2024</td>
                        <td>-</td>
                        <td>-</td>
                        <td>25%</td>
                        <td>100</td>
                      </tr>
                      <tr>
                      <td className='col__bgg'></td>
                        <td>ID1</td>
                        <td>(3'-0" X 3'-0" X 1'-0")</td>
                        <td>23</td>
                        <td className="inprogress">Inprogress</td>
                        <td>12, May 2024</td>
                        <td>12, May 2024</td>
                        <td>-</td>
                        <td>-</td>
                        <td>25%</td>
                        <td>100</td>
                      </tr>
                      <tr className="sub-header">
                      <td className='col__bgg'><span className='s_098yggs'><img src={tableicon__0} alt="" /></span></td>
                        <td>2024.2</td>
                        <td>DIV-04 - Milestone</td>
                        <td>23</td>
                        <td>Inprogress</td>
                        <td>12, May 2024</td>
                        <td>12, May 2024</td>
                        <td>-</td>
                        <td>-</td>
                        <td>25%</td>
                        <td>100</td>
                      </tr>
                      <tr>
                      <td className='col__bgg'></td>
                        <td>ID1</td>
                        <td>(3'-0" X 3'-0" X 1'-0")</td>
                        <td>23</td>
                        <td className="completed">Completed</td>
                        <td>12, May 2024</td>
                        <td>12, May 2024</td>
                        <td>-</td>
                        <td>-</td>
                        <td>25%</td>
                        <td>100</td>
                      </tr>
                      <tr>
                      <td className='col__bgg'></td>
                        <td>ID1</td>
                        <td>(3'-0" X 3'-0" X 1'-0")</td>
                        <td>23</td>
                        <td className="inprogress">Inprogress</td>
                        <td>12, May 2024</td>
                        <td>12, May 2024</td>
                        <td>-</td>
                        <td>-</td>
                        <td>25%</td>
                        <td>100</td>
                      </tr>
                      <tr>
                      <td className='col__bgg'></td>
                        <td>ID1</td>
                        <td>(3'-0" X 3'-0" X 1'-0")</td>
                        <td>23</td>
                        <td className="completed">Completed</td>
                        <td>12, May 2024</td>
                        <td>12, May 2024</td>
                        <td>-</td>
                        <td>-</td>
                        <td>25%</td>
                        <td>100</td>
                      </tr>
                      <tr>
                      <td className='col__bgg'></td>
                        <td>ID1</td>
                        <td>(3'-0" X 3'-0" X 1'-0")</td>
                        <td>23</td>
                        <td className="inprogress">Inprogress</td>
                        <td>12, May 2024</td>
                        <td>12, May 2024</td>
                        <td>-</td>
                        <td>-</td>
                        <td>25%</td>
                        <td>100</td>
                      </tr>
                    </tbody>
                  </table>
                </AccordionDetails>
              </Accordion>

              
            </div>
          </div>
        </div>
      </div>

      {/* Modal for creating a new project */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style, width: 700 }}>
          <Typography variant="h6" component="h2">
            <h1 className='s__09iii'>Create OBS Structure</h1>
          </Typography>

          <div className='s__set__09w'>
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                name="category"
                value={newProject.category}
                onChange={handleChange}
                displayEmpty
              >
                <MenuItem value="">Current OBS Projects</MenuItem>
                <MenuItem value="currentObsProjects">Universal Construction</MenuItem>
                <MenuItem value="currentObsProjects2">Current OBS Projects2</MenuItem>
              </Select>
            </FormControl>

            <h3 className='createnewobs'>Create New OBS</h3>
            <TextField
              label="Project Number"
              name="projectNumber"
              value={newProject.projectNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={newProject.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />

            <div className='button__00999'>
              <Button className='wclose' onClick={handleClose} variant="contained" color="secondary">
                Close
              </Button>
              <Button onClick={handleCreate} variant="contained" color="primary">
                Save
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};
