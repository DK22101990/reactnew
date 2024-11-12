import React, { useEffect, useState } from "react";
import arraySort from "array-sort";
import { Button, Form, Header, Icon, Loader, Modal, Table } from 'semantic-ui-react';
import { ToastContainer } from "react-toastify";

import axiosCalls from "../axiosCalls";
import MainNavbar from "../components/UI/MainNavbar";
import CustomHeader from "../components/UI/Header";
import Dropdown3 from "../components/UI/Dropdown3";
import { ErrorToast, SuccessToast, WarningToast } from "../components/customHooks/Toast";

const Sprint = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const headings = [
    "Name", "Start Date", "End Date", "User Story Planned At Start", "User Story Planned At Completion", "Task Planned At Start",
    "Task Planned At Completion", "Total Estimation Size At Start", "Total Estimation Size At Completion", "Action"
  ]

  const [sprintData, setSprintData] = useState([]);
  const [sprintDataLoading, setSprintDataLoading] = useState(false);

  const [accountName, setAccountName] = useState("Choose Account ");
  const [accountId, setAccountId] = useState("");
  const [accountData, setAccountData] = useState([]);
  const [accountDataLoading, setAccountDataLoading] = useState(false);

  const [projectName, setProjectName] = useState("Choose Project ");
  const [projectId, setProjectId] = useState("");
  const [projectData, setProjectData] = useState([]);
  const [projectDataLoading, setProjectDataLoading] = useState(false);

  const [SOWName, setSOWName] = useState("Choose SOW ");
  const [sowId, setSOWId] = useState("");
  const [SOWData, setSOWData] = useState([]);
  const [sowDataLoading, setSowDataLoading] = useState(false);

  const initialSprintData = {
    sprintId: 0,
    sprintName: "",
    startDate: "",
    endDate: "",
    uS_PlannedAtStart: 0,
    uS_PlannedAtCompletion: 0,
    taskPlannedAtStart: 0,
    taskPlannedAtCompletion: 0,
    totalEstimationSizeAtStart: 0,
    totalEstimationSizeAtCompletion: 0
  }
  const [sprintInitialData, setSprintInitialData] = useState(initialSprintData);
  const [dataToEditSprint, setDataToEditSprint] = useState([]);

  const getAccountData = async () => {
    setSprintData([]);
    setAccountDataLoading(true)
    setAccountData([])
    setAccountName("Choose Account")
    setAccountId("")
    setProjectId("");
    setSOWId("")
    const { data } = await axiosCalls.get('Account/GetAllAccounts');
    const modifiedData = data.map((d) => { return { option: d.accountName, value: d.accountId } });
    setAccountData(modifiedData)
    setAccountDataLoading(false)
  }

  const getProjectData = async () => {
    setSprintData([]);
    setProjectDataLoading(true)
    const { data } = await axiosCalls.get(`Account/GetAllProjectResponse?AccountId=${accountId}`);
    const modifiedData = data.map((d) => { return { option: d.projectName, value: d.projectId } });
    setProjectData(modifiedData)
    setProjectDataLoading(false)
  }

  const getSOWData = async () => {
    setSprintData([]);
    setSowDataLoading(true)
    const { data } = await axiosCalls.get(`Account/SOWResponse?AccountId=${accountId}&ProjectId=${projectId}`);
    const modifiedData = data.map((d) => { return { option: d.sowName, value: d.sowId } });
    setSOWData(modifiedData)
    setSowDataLoading(false)
  }

  const getSprintData = async () => {
    setSprintDataLoading(true)
    const { data } = await axiosCalls.get(`Account/GetSprintInformation?sowId=${sowId}&projectId=${projectId}`);
    setSprintData(data)
    setSprintDataLoading(false)
  }

  const inserSprint = async () => {
    const { sprintName, startDate, endDate } = sprintInitialData
    if (!sprintName || !startDate || !endDate) {
      return alert("Please Fill Required Fields !")
    } else {
      if (Date.parse(endDate) <= Date.parse(startDate)) {
        return alert("End Date Should Be Greater Than Start Date !!")
      }
      try {
        setLoading(true)
        const dataToSend = { accountId, projectId, sowId, ...sprintInitialData }
        let APIName;
        if (editMode) {
          APIName = 'Account/UpdateSprintDetails'
        } else {
          APIName = 'Account/InsertSprintDetails'
        }
        const { data } = await axiosCalls.post(APIName, dataToSend);
        if (data.status) {
          setSprintInitialData(initialSprintData)
          SuccessToast(data.message)
          setOpen(false)
          setLoading(false)
          getSprintData()
          setEditMode(false);
        }
      } catch (e) {
        ErrorToast(e.message);
        setLoading(false)
        console.log('Error', e)
      }
    }
  }

  const editSprint = async (sprintData) => {
    setEditMode(true)
    setSprintInitialData(sprintData)
    setDataToEditSprint(sprintData)
    setOpen(true)
  }

  const deleteSprint = async (sprintId) => {
    const result = await window.confirm("Are You Sure ? You Want To Delete Sprint !");
    if (result) {
      try {
        const data = await axiosCalls.delete(`Account/DeleteSprintInformation?sprintId=${sprintId}`);
        if (data.status === 200) {
          setSprintDataLoading(true)
          WarningToast(data.data.message);
          getSprintData();
        }
      } catch (e) {
        setSprintDataLoading(false)
        ErrorToast(e.message);
        console.log('Error', e)
      }
    } else {
      return 0;
    }
  }
  
  const setValues = (value, name) => {
    setSprintInitialData((prev) => {
      prev[name] = value
      return { ...prev }
    })
  }

  useEffect(() => {
    setSOWName("Choose SOW ");
    setSOWId("");
    setSOWData([]);
    if (projectId) getSOWData();
  }, [projectId, accountId]);


  useEffect(() => {
    setProjectName("Choose Project ");
    setProjectId("");
    setProjectData([]);
    setSOWName("Choose SOW");
    setSOWId("")
    setSOWData([]);
    if (accountId) getProjectData();
  }, [accountId]);

  useEffect(() => {
    if (accountId && sowId && accountId) getSprintData();
  }, [sowId]);

  useEffect(() => {
    getAccountData();
  }, []);

  const getMinDateForEndDate = () => {
    // Add One More Day to Start Date
    const current = new Date(sprintInitialData.startDate); //'Mar 11 2015' current.getTime() = 1426060964567
    const followingDay = new Date(current.getTime() + 86400000); // + 1 day in ms
    return followingDay.toLocaleDateString('en-CA');
  }

  return (
    <>
      <MainNavbar />
      <CustomHeader role="Sprint Creation" />
      <ToastContainer />

      <div className="inline-flex">
        <Dropdown3
          title={"Account"}
          data={arraySort(accountData, "option")}
          option={accountName}
          value={accountId}
          setOption={setAccountName}
          setValue={setAccountId}
          loading={accountDataLoading}
        />

        <Dropdown3
          title={"Project"}
          data={arraySort(projectData, "option")}
          option={projectName}
          value={projectId}
          setOption={setProjectName}
          setValue={setProjectId}
          loading={projectDataLoading}
        />

        <Dropdown3
          title={"SOW"}
          data={arraySort(SOWData, "option")}
          option={SOWName}
          value={sowId}
          setOption={setSOWName}
          setValue={setSOWId}
          loading={sowDataLoading}
        />

      </div>

      <Table compact celled>
        <Table.Header>
          <Table.Row singleLine>
            <Table.HeaderCell colSpan='10'>
              <span>Existing Sprints</span>
              <Modal
                closeOnEscape={false}
                closeOnDimmerClick={false}
                closeIcon
                open={open}
                size="small"
                trigger={
                  <Button
                    floated="right"
                    color="olive"
                    disabled={!accountId || !projectId || !sowId}
                    onClick={() => {
                      setDataToEditSprint([])
                      setEditMode(false)
                    }}
                  >
                    Add Sprint
                  </Button>
                }
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
              >
                <Header icon='add' content={editMode ? 'Edit Sprint' : 'Add New Sprint'} />
                <Modal.Content>
                  <Form loading={loading}>
                    <Form.Group widths='equal'>
                      <Form.Field required>
                        <label>Sprint Name</label>
                        <input
                          type="text"
                          defaultValue={dataToEditSprint ? dataToEditSprint.sprintName : sprintInitialData.sprintName}
                          onChange={(e) => setValues(e.target.value, "sprintName")}
                        />
                      </Form.Field>

                      <Form.Field
                        label='Start Date'
                        control='input'
                        type="date"
                        onChange={(e) => setValues(e.target.value, "startDate")}
                        required
                        defaultValue={dataToEditSprint ? new Date(dataToEditSprint.startDate).toLocaleDateString('en-CA') : sprintInitialData.startDate}
                      // min="1997-01-01" 
                      // max="2020-12-31"
                      />
                      <Form.Field
                        label='End Date'
                        control='input'
                        type="date"
                        onChange={(e) => setValues(e.target.value, "endDate")}
                        required
                        defaultValue={dataToEditSprint ? new Date(dataToEditSprint.endDate).toLocaleDateString('en-CA') : sprintInitialData.endDate}
                        disabled={sprintInitialData.startDate ? false : true}
                        min={getMinDateForEndDate()}
                      />

                    </Form.Group>

                    <Form.Group widths='equal'>
                      <Form.Field
                        label='User Story Planned At Start'
                        control='input'
                        onChange={(e) => setValues(Number(e.target.value), "uS_PlannedAtStart")}
                        defaultValue={dataToEditSprint ? dataToEditSprint.uS_PlannedAtStart : sprintInitialData.uS_PlannedAtStart}
                      />

                      <Form.Field
                        label='User Story Planned At Completion'
                        control='input'
                        onChange={(e) => setValues(Number(e.target.value), "uS_PlannedAtCompletion")}
                        defaultValue={dataToEditSprint ? dataToEditSprint.uS_PlannedAtCompletion : sprintInitialData.uS_PlannedAtCompletion}
                      />
                    </Form.Group>

                    <Form.Group widths='equal'>
                      <Form.Field
                        label='Task Planned At Start'
                        control='input'
                        onChange={(e) => setValues(Number(e.target.value), "taskPlannedAtStart")}
                        defaultValue={dataToEditSprint ? dataToEditSprint.taskPlannedAtStart : sprintInitialData.taskPlannedAtStart}
                      />
                      <Form.Field
                        label='Task Planned At Completion'
                        control='input'
                        onChange={(e) => setValues(Number(e.target.value), "taskPlannedAtCompletion")}
                        defaultValue={dataToEditSprint ? dataToEditSprint.taskPlannedAtCompletion : sprintInitialData.taskPlannedAtCompletion}
                      />
                    </Form.Group>

                    <Form.Group widths='equal'>
                      <Form.Field
                        label='Total Estimation Size At Start'
                        control='input'
                        onChange={(e) => setValues(Number(e.target.value), "totalEstimationSizeAtStart")}
                        defaultValue={dataToEditSprint ? dataToEditSprint.totalEstimationSizeAtStart : sprintInitialData.totalEstimationSizeAtStart}
                      />
                      <Form.Field
                        label='Total Estimation Size At Completion'
                        control='input'
                        onChange={(e) => setValues(Number(e.target.value), "totalEstimationSizeAtCompletion")}
                        defaultValue={dataToEditSprint ? dataToEditSprint.totalEstimationSizeAtCompletion : sprintInitialData.totalEstimationSizeAtCompletion}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    color='red'
                    onClick={() => {
                      setOpen(false)
                      setEditMode(false)
                      setSprintInitialData(initialSprintData)
                    }
                    }>
                    <Icon name='remove' /> Cancel
                  </Button>
                  <Button color='green' onClick={inserSprint} disabled={loading}>
                    <Icon name='checkmark' /> Save
                  </Button>
                </Modal.Actions>
              </Modal>
            </Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            {
              headings.map((heading, i) => {
                return (
                  <Table.HeaderCell key={i} colSpan={heading === "Action" ? 3 : 0}>{heading}</Table.HeaderCell>
                )
              })
            }
          </Table.Row>
        </Table.Header>
        {
          sprintDataLoading ?
            <Table.Body>
              <Table.Row textAlign="center">
                <Table.Cell colSpan='10'>
                  <Loader active inline />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
            :
            <Table.Body>
              {
                sprintData.map((sprint, i) => {
                  return (
                    <Table.Row key={i}>
                      <Table.Cell width={1}>{sprint.sprintName}</Table.Cell>
                      <Table.Cell width={2}>{new Date(sprint.startDate).toLocaleDateString('en-CA')}</Table.Cell>
                      <Table.Cell width={2}>{new Date(sprint.endDate).toLocaleDateString('en-CA')}</Table.Cell>
                      <Table.Cell>{sprint.uS_PlannedAtStart}</Table.Cell>
                      <Table.Cell>{sprint.uS_PlannedAtCompletion}</Table.Cell>
                      <Table.Cell>{sprint.taskPlannedAtStart}</Table.Cell>
                      <Table.Cell>{sprint.taskPlannedAtCompletion}</Table.Cell>
                      <Table.Cell>{sprint.totalEstimationSizeAtStart}</Table.Cell>
                      <Table.Cell>{sprint.totalEstimationSizeAtCompletion}</Table.Cell>
                      <Table.Cell >
                        <span style={{ display: "inline-flex" }}>
                          <button className="pl-1" onClick={() => editSprint(sprint)}>
                            <Icon
                              color='teal'
                              size='large'
                              name='pencil circle'
                            />
                          </button>

                          <button className="pl-1" onClick={() => deleteSprint(sprint.sprintId)}>
                            <Icon
                              color='red'
                              size='large'
                              name='remove circle'
                            />
                          </button>
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  )
                })
              }
            </Table.Body>
        }
      </Table>
    </>
  )
}

export default Sprint;