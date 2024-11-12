import React, { useEffect, useState } from "react";
import { Button, Form, Header, Icon, Label, Modal, Table, Dropdown } from "semantic-ui-react";
import arraySort from "array-sort";

import MainNavbar from "../components/UI/MainNavbar";
import CustomHeader from "../components/UI/Header";
import axiosCalls from "../axiosCalls";
import Dropdown3 from "../components/UI/Dropdown3";
import { ErrorToast, SuccessToast, WarningToast } from "../components/customHooks/Toast";
import { ToastContainer } from "react-toastify";
import { SpinnerCircular } from "spinners-react";

const AccountManagerMap = () => {
    const headings = ["S No", "Manager Name", "Start Date", "End Date", "Edit/Delete"];
    const [dataLoading, setDataLoading] = useState(false);

    const [managerName, setManagerName] = useState("");
    const [managerId, setManagerId] = useState("");
    const [managerData, setManagerData] = useState([]);

    const [accountManagerMapData, setAccountManagerMapData] = useState([]);

    const [editMode, setEditMode] = useState(false);
    const [dataForEdit, setDataForEdit] = useState({});

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const initialData = {
        startDate: '',
        endDate: ''
    }
    const [dataToSend, setDataToSend] = useState(initialData);

    function handleInputChange(e) {
        setDataToSend({
            ...dataToSend,
            [e.target.name]: e.target.value
        })
    }

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
    const [SOWSelectedData, setSOWSelectedData] = useState({});

    const getMinDateForEndDate = () => {
        // Add One More Day to Start Date
        const current = new Date(dataToSend.startDate); //'Mar 11 2015' current.getTime() = 1426060964567
        const followingDay = new Date(current.getTime() + 86400000); // + 1 day in ms
        return followingDay.toLocaleDateString('en-CA');
    }

    const getManagerData = async () => {
        const { data } = await axiosCalls.get(`Account/SelectList?Entity=Employee`);
        const modifiedData = data.map((d) => {
            return { text: d.label, value: d.value, key: d.value }
        })
        setManagerData(arraySort(modifiedData, "text"));
    }

    const getAccountData = async () => {
        setProjectName("Choose Project")
        setProjectId("")
        setProjectData([])
        setSOWName("Choose SOW")
        setSOWId("")
        setSOWData([])
        setSOWSelectedData([])
        setAccountDataLoading(true)
        const { data } = await axiosCalls.get('Account/GetAllAccounts');
        const modifiedData = data.map((d) => { return { option: d.accountName, value: d.accountId } });
        setAccountData(modifiedData)
        setAccountDataLoading(false)
    }

    const getProjectData = async () => {
        setSOWSelectedData([])
        setProjectName("Choose Project")
        setProjectId("")
        setProjectData([])
        setProjectDataLoading(true)
        setSOWName("Choose SOW")
        setSOWId("")
        setSOWData([])
        const { data } = await axiosCalls.get(`Account/GetAllProjectResponse?AccountId=${accountId}`);
        const modifiedData = data.map((d) => { return { option: d.projectName, value: d.projectId } });
        setProjectData(modifiedData)
        setProjectDataLoading(false)
    }

    const getSOWData = async () => {
        setSOWSelectedData([])
        setSOWName("Choose SOW")
        setSOWId("")
        setSOWData([])
        setSowDataLoading(true)
        const { data } = await axiosCalls.get(`Account/SowResponse?accountId=${accountId}&projectId=${projectId}`);
        const modifiedData = data.map((d) => { return { option: d.sowName, value: d.sowId, ...d } });
        setSOWData(modifiedData)
        setSowDataLoading(false)
    }

    const getAccountManagerMap = async () => {
        setDataLoading(true)
        const data = await axiosCalls.get(`ProjectAllocation/GetAccountManagerMap?projectId=${projectId}&sowId=${sowId}&accountId=${accountId}`);
        if (data.status === 200) {
            setDataLoading(false)
            setAccountManagerMapData(data.data);
        } else {
            setDataLoading(false)
            ErrorToast('Something Wrong !')
        }
    }

    const inserAccountData = async () => {
        const { startDate, endDate } = dataToSend;
        if (!managerId || !startDate || !endDate) {
            return alert("Please Enter Required Fields !")
        }
        if (Date.parse(endDate) <= Date.parse(startDate)) {
            return alert("End Date Should Be Greater Than Start Date !!")
        }
        setLoading(true)
        try {
            const sendThisData = { ...dataToSend, accountId, projectId, sowId, accountManagerId: managerId }
            let api;
            if (editMode) {
                api = "UpdateAccountManagerMap"
            } else {
                api = "InsertAccountManagerMap"
            }
            const data = await axiosCalls.post(`ProjectAllocation/${api}`, sendThisData);
            if (data.status === 200) {
                setLoading(false)
                setOpen(false)
                SuccessToast(data.data.message || "Data Added Successfully.");
                setEditMode(false)
                setDataForEdit({})
                setDataToSend(initialData)
                setManagerId("")
                getAccountManagerMap();
            }
        } catch (e) {
            setLoading(false)
            ErrorToast(e.message);
            console.log('Error', e)
        }
    }


    const editAccountManager = (editData) => {
        setManagerId(editData.accountManagerId)
        setDataToSend({
            startDate: editData.startDate,
            endDate: editData.endDate,
            accountManagerMapId: editData.accountManagerMapId
        })
        setEditMode(true)
        setDataForEdit(editData)
        setOpen(true)
    }

    const deleteAccountManager = async (mapData) => {
        const result = await window.confirm("Are You Sure ? You Want To Delete !");
        if (result) {
            try {
                const { accountManagerMapId } = mapData;
                const data = await axiosCalls.delete(`http://172.18.6.117/api/v1/ProjectAllocation/DeleteAccountManagerMap?accountManagerMapId=${accountManagerMapId}`)
                if (data.status === 204) {
                    WarningToast('Data Deleted Successfully !')
                    getAccountManagerMap();
                }
            } catch (e) {
                ErrorToast('Something Went Wrong !' + e.message);
                console.log('Error', e)
            }
        } else {
            return 0;
        }
    }

    useEffect(() => {
        getAccountData();
        getManagerData()
    }, [])

    useEffect(() => {
        if (accountId) getProjectData();
    }, [accountId])

    useEffect(() => {
        if (projectId) getSOWData();
    }, [projectId])

    useEffect(() => {
        if (sowId) {
            const dd = SOWData.filter(d => d.sowId === sowId)
            setSOWSelectedData(dd[0])
            getAccountManagerMap();
        }
    }, [sowId])

    const setManagerDetails = (e) => {
        const mngrName = e.target.textContent;
        const [mngrId] = managerData.filter(d => d.text === mngrName);
        setManagerName(mngrName)
        setManagerId(mngrId.value)
    }
    const getFormattedDate = (date) => {
        return new Date(date).toLocaleDateString('en-CA');
    }
    
    return (
        <>
            <MainNavbar />
            <CustomHeader role={"Account Manager Map"} />
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
            {
                sowId &&
                <>
                    <div className="pl-4 pt-2" style={{ display: "flex" }}>
                        <Label>
                            SOW Start Date
                            <Label.Detail>{getFormattedDate(SOWSelectedData.startDate)}</Label.Detail>
                        </Label>
                        <Label >
                            SOW End Date
                            <Label.Detail>{getFormattedDate(SOWSelectedData.endDate)}</Label.Detail>
                        </Label>

                        <Modal
                            closeIcon
                            open={open}
                            trigger={
                                <div style={{ paddingLeft: "20px" }}>
                                    <Button color="green" size={"mini"}
                                        onClick={() => setDataToSend({
                                            startDate: SOWSelectedData.startDate,
                                            endDate: SOWSelectedData.endDate
                                        })}
                                    >
                                        Add New
                                    </Button>
                                </div>
                            }
                            onClose={() => setOpen(false)}
                            onOpen={() => setOpen(true)}
                            size={"small"}
                            centered={false}
                            closeOnEscape={false}
                            closeOnDimmerClick={false}
                        >
                            <Header icon='add' content={editMode ? "Edit" : "Add New"} />
                            <Modal.Content>
                                <Form loading={loading}>
                                    <Form.Group widths='equal'>
                                        <Form.Field required>
                                            <label>Manager Name</label>
                                            <Dropdown
                                                selection
                                                search
                                                options={managerData}
                                                placeholder={editMode ?
                                                    <span style={{ color: "black" }}>{dataForEdit.firstName + " " + dataForEdit.lastName}</span>
                                                    : 'Choose Manager'}
                                                onChange={setManagerDetails}
                                            />
                                        </Form.Field>
                                        <Form.Field
                                            label='Start Date'
                                            control='input'
                                            type="date"
                                            name="startDate"
                                            onChange={handleInputChange}
                                            required
                                            min={getFormattedDate(SOWSelectedData.startDate)}
                                            // defaultValue={editMode && getFormattedDate(dataForEdit.startDate)}
                                            defaultValue={editMode ? getFormattedDate(dataForEdit.startDate) : getFormattedDate(SOWSelectedData.startDate)}
                                        />
                                        <Form.Field
                                            label='End Date'
                                            control='input'
                                            type="date"
                                            name="endDate"
                                            onChange={handleInputChange}
                                            required
                                            disabled={dataToSend.startDate || dataForEdit.startDate ? false : true}
                                            min={getMinDateForEndDate()}
                                            max={getFormattedDate(SOWSelectedData.endDate)}
                                            // defaultValue={editMode && getFormattedDate(dataForEdit.endDate)}
                                            defaultValue={editMode ? getFormattedDate(dataForEdit.endDate) : getFormattedDate(SOWSelectedData.endDate)}
                                        />
                                    </Form.Group>
                                </Form>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color='red'
                                    onClick={() => {
                                        setOpen(false)
                                        setDataToSend(initialData)
                                        setLoading(false)
                                        setEditMode(false)
                                        setDataForEdit({})
                                    }}
                                >
                                    <Icon name='remove' /> Cancel
                                </Button>
                                <Button color='green' onClick={inserAccountData} disabled={loading}>
                                    <Icon name='checkmark' /> Submit
                                </Button>
                            </Modal.Actions>
                        </Modal>
                    </div>
                    <div className="px-10">
                        <Table celled selectable color={"grey"} >
                            <Table.Header>
                                <Table.Row>
                                    {headings.map((heading, i) => {
                                        return (
                                            <Table.HeaderCell key={i}>{heading}</Table.HeaderCell>
                                        )
                                    })}
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>

                                {
                                    dataLoading ?
                                        <Table.Cell colSpan="5" textAlign='center'>
                                            <div className='mt-10 allCenter'> <SpinnerCircular enabled={true} /> </div>
                                        </Table.Cell>
                                        :
                                        accountManagerMapData.length <= 0 ?
                                            <Table.Cell colSpan="5" textAlign='center'>
                                                <span>No Record Found !</span>
                                            </Table.Cell>
                                            :
                                            accountManagerMapData.map((mapData, i) => {
                                                const { firstName, lastName, startDate, endDate } = mapData;
                                                return (
                                                    <Table.Row key={i}>
                                                        <Table.Cell>{i + 1}</Table.Cell>
                                                        <Table.Cell>{`${firstName} ${lastName}`}</Table.Cell>
                                                        <Table.Cell>{getFormattedDate(startDate)}</Table.Cell>
                                                        <Table.Cell>{getFormattedDate(endDate)}</Table.Cell>
                                                        <Table.Cell>
                                                            <button className="pl-1" onClick={() => editAccountManager(mapData)}>
                                                                <Icon
                                                                    color='teal'
                                                                    size='large'
                                                                    name='pencil circle'
                                                                />
                                                            </button>
                                                            <button className="pl-1" onClick={() => deleteAccountManager(mapData)}>
                                                                <Icon
                                                                    color='red'
                                                                    size='large'
                                                                    name='remove circle'
                                                                />
                                                            </button>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                )
                                            })
                                }
                            </Table.Body>
                        </Table>
                    </div>
                </>
            }

        </>
    )
}

export default AccountManagerMap;