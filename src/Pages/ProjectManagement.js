import { useEffect, useState } from "react";
import arraySort from 'array-sort';
import { Button, Checkbox, Form, Icon, Modal, Table } from "semantic-ui-react";
import { ToastContainer } from "react-toastify";
import { SpinnerCircular } from "spinners-react";
import { useForm } from "react-hook-form";

import axiosCalls from "../axiosCalls";
import Header from "../components/UI/Header";
import MainNavbar from "../components/UI/MainNavbar";
import Dropdown3 from "../components/UI/Dropdown3";
import { ErrorToast, SuccessToast, WarningToast } from "../components/customHooks/Toast";

const headings = ["Project Name", "Project Type", "Project Description", "Project Domain",
    "Project Manager", "Is Active", "Client Contact Person", "Client Email", "Client Contact", "Edit/Delete"];

const ProjectManagement = () => {
    const { handleSubmit, register, formState: { errors }, reset, setValue, watch } = useForm({
        mode: "onSubmit"
    });
    const initialData = {
        formLoading: false,
        projectTypeData: [],
        projectDomainData: [],
        directReportingManagerList: [],
        isActiveData: [],
        key: 1
    }
    const [stateData, setStateData] = useState(initialData);

    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState({});

    const { projectTypeData, projectDomainData, directReportingManagerList, isActiveData } = stateData;

    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [projectData, setProjectData] = useState([]);

    const [accountName, setAccountName] = useState("Choose Account");
    const [accountId, setAccountId] = useState("");
    const [accountData, setAccountData] = useState([]);

    const [showInactiveRow, setShowInactiveRow] = useState(false);

    const getDefaultData = async () => {
        try {
            const projectTypes = await axiosCalls.get('Account/SelectList?Entity=ProjectType');
            const projectDomains = await axiosCalls.get('Account/SelectList?Entity=ProjectDomain');
            const reportingmanagers = await axiosCalls.get(`Account/SelectList?Entity=reportingmanager`);
            const isActives = await axiosCalls.get(`Account/SelectList?Entity=IsActive`);

            const modifiedprojectTypes = await projectTypes.data.map((d) => { return { key: d.value, text: d.label, value: d.value } });
            const modifiedprojectDomains = await projectDomains.data.map((d) => { return { key: d.value, text: d.label, value: d.value } });
            const modifiedreportingmanagers = await reportingmanagers.data.map((d) => { return { key: d.value, text: d.label, value: d.value } });
            const modifiedIsActives = await isActives.data.map((d) => { return { key: d.value, text: d.label, value: d.value } });

            setStateData({
                ...stateData, projectTypeData: modifiedprojectTypes, projectDomainData: modifiedprojectDomains,
                directReportingManagerList: modifiedreportingmanagers, isActiveData: modifiedIsActives
            });
        } catch (err) {
            ErrorToast(err.message)
        }
    }

    const getAccountData = async () => {
        try {
            setLoading(true)
            const { data } = await axiosCalls.get('Account/GetAllAccounts');
            const modifiedData = data.map((d) => { return { option: d.accountName, value: d.accountId, isActive: d.isActive } });
            setAccountData(modifiedData)
            setLoading(false)
        } catch (err) {
            setLoading(false)
            ErrorToast(err.message)
        }
    }

    const getProjectsData = async () => {
        try {
            setDataLoading(true)
            const { data } = await axiosCalls.get(`Account/GetAllProjectResponse?AccountId=${accountId}`);
            setProjectData(data)
            setDataLoading(false)
        } catch (err) {
            setDataLoading(false)
            ErrorToast(err.message)
        }
    }


    useEffect(() => {
        getAccountData();
        getDefaultData();
    }, []);

    useEffect(() => {
        if (accountId) getProjectsData()
    }, [accountId]);

    const editProject = (project) => {
        reset(project)
        setEditData(project)
        setIsEdit(true)
        setOpen(true)
    }

    const deleteProject = async (project) => {
        const conf = await window.confirm("Are You Sure ? You Want To Delete This Project !");
        if (conf) {
            const delProject = await axiosCalls.delete(`Account/DeleteProjectResponse?projectId=${project.projectId}`);
            getProjectsData();
            WarningToast('Data Deleted Successfully !');
        }
    }

    const addNew = () => {
        reset({})
        setIsEdit(false)
        setOpen(true)
    }

    const retIsActive = (isVal, tData) => {
        let t;
        tData.map(isA => { if (isA.value === isVal) return t = isA.text })
        return t;
    }

    const disabledButtonAdd = () => {
        const filtered = accountData.filter(a => a.value === accountId)
        return !filtered[0].isActive;
    }

    const onSubmit = async (formData) => {
        try {
            let insertUpdate;
            const dataToInsert = {
                "projectName": formData.projectName,
                "projectDescription": formData.projectDescription,
                "startDate": "2023-03-10T05:35:15.108Z",
                "endDate": "2023-03-10T05:35:15.108Z",
                "accountId": accountId,
                "clientContactPerson": formData.contactPersonName,
                "clientEmailId": formData.email,
                "clientContactNumber": String(formData.phoneNumber || ""),
                "projectTypeId": formData.projectTypeId,
                "projectDomainId": formData.projectDomainId,
                "projectManagerId": formData.projectManagerId,
                "projectAccountManagerId": formData.projectManagerId,
                "sowId": 367, //367
                "isActive": formData.isActive,
                "lastModifiedOn": "2023-03-10T05:35:15.108Z",
                "modifiedById": 1045 //1045 
            }

            if (isEdit) {
                dataToInsert.projectId = await formData.projectId
                insertUpdate = await axiosCalls.post(`Account/UpdateProjectResponse`, dataToInsert);
            } else {
                dataToInsert.isActive = 1
                insertUpdate = await axiosCalls.post(`Account/InsertProjectResponse`, dataToInsert);
            }
            reset({})
            setOpen(false)
            getProjectsData()
            SuccessToast(insertUpdate.data.message)
        } catch (err) {
            ErrorToast(err.message)
        }
    }

    const clickCancel = () => {
        getProjectsData()
        setOpen(false)
    }

    const addEditProject = () => {
        return (
            <Modal
                closeIcon
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                size={"large"}
                centered={false}
                closeOnEscape={false}
                closeOnDimmerClick={false}
            >
                <Modal.Header>
                    <span>Add New Project</span>
                    <Button content="x" floated="right" size="small" onClick={() => setOpen(false)} />
                </Modal.Header>
                <Modal.Content>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Modal.Description>
                            <Form.Group widths={"equal"}>

                                <Form.Field required>
                                    <label>Project Name</label>
                                    <input
                                        placeholder='Project Name'
                                        type="text"
                                        {...register("projectName", { required: true })}
                                        autoComplete={"off"}
                                    />
                                    {errors.projectName && <p>Project Name is Required !</p>}
                                </Form.Field>

                                <Form.Field required>
                                    <label>Project Type</label>
                                    <Form.Dropdown
                                        selection
                                        search
                                        {...register("projectTypeId", { required: true })}
                                        name="projectTypeId"
                                        options={projectTypeData}
                                        placeholder={isEdit ?
                                            <span style={{ color: "black" }}>{editData.projectType}</span> : 'Project Type'}
                                        onChange={async (e, { name, value, ...d }) => {
                                            setValue(name, value);
                                        }}
                                    />
                                    {(errors.projectTypeId && !watch().projectTypeId) && <p>Project Type is Required !</p>}
                                </Form.Field>

                                <Form.Field required>
                                    <label>Project Description</label>
                                    <input
                                        placeholder='Project Description'
                                        type="text"
                                        {...register("projectDescription", { required: true })}
                                        autoComplete={"off"}
                                    />
                                    {errors.projectDescription && <p>Project Description is Required !</p>}
                                </Form.Field>
                            </Form.Group>

                            <Form.Group widths={"equal"}>

                                <Form.Field required>
                                    <label>Project Domain</label>
                                    <Form.Dropdown
                                        selection
                                        search
                                        name="projectDomainId"
                                        options={projectDomainData}
                                        {...register("projectDomainId", { required: true })}
                                        placeholder={isEdit ?
                                            <span style={{ color: "black" }}>{editData.projectDomain}</span>
                                            : "Project Domain"}
                                        onChange={async (e, { name, value, ...d }) => {
                                            setValue(name, value);
                                        }}
                                    />
                                    {(errors.projectDomainId && !watch().projectDomainId) && <p>Project Domain is Required !</p>}
                                </Form.Field>

                                <Form.Field required>
                                    <label>Project Manager</label>
                                    <Form.Dropdown
                                        selection
                                        search
                                        name="projectManagerId"
                                        options={directReportingManagerList}
                                        {...register("projectManagerId", { required: true })}
                                        placeholder={isEdit ?
                                            <span style={{ color: "black" }}>{editData.managerName}</span> : "Project Manager"}
                                        onChange={async (e, { name, value, ...d }) => {
                                            setValue(name, value);
                                        }}
                                    />
                                    {(errors.projectManagerId && !watch().projectManagerId) && <p>Project Manager is Required !</p>}
                                </Form.Field>


                                <Form.Field required>
                                    <label>isActive</label>
                                    <Form.Dropdown
                                        selection
                                        search
                                        name="isActive"
                                        options={stateData.isActiveData}
                                        {...register("isActive", { required: false })}
                                        placeholder={
                                            <span style={{ color: "black", fontWeight: "bold" }}>
                                                {isEdit ? editData.isActiveText : "Yes"}
                                            </span>
                                        }
                                        onChange={async (e, { name, value, ...d }) => {
                                            setValue(name, value);
                                        }}
                                        disabled={!isEdit}
                                    />
                                    {/* {(errors.isActive && !watch().isActive) && <p>Is Active is Required !</p>} */}
                                </Form.Field>
                            </Form.Group>

                            <Form.Group widths={"equal"}>

                                <Form.Field>
                                    <label>Client Contact Person</label>
                                    <input
                                        placeholder='Client Contact Person'
                                        type="text"
                                        {...register("contactPersonName", { required: true })}
                                        autoComplete={"off"}
                                    />
                                </Form.Field>

                                <Form.Field>
                                    <label>Client Email Id</label>
                                    <input
                                        placeholder='Client Email Id'
                                        type="email"
                                        {...register("email",
                                            {
                                                required: true,
                                                pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

                                            })}
                                        autoComplete={"off"}
                                    />
                                    {errors.email && <p>Please enter valid Client Email Id !</p>}
                                </Form.Field>

                                <Form.Field>
                                    <label>Client Contact Number</label>
                                    <input
                                        placeholder='Client Contact Number'
                                        type="tel"
                                        {...register("phoneNumber", { required: true })}
                                        onInput={(e) => {
                                            if (/^[0-9 ()+-]+$/.test(e.target.value)) e.target.value = e.target.value
                                            else e.target.value = e.target.value.replace(/\D/g, '');
                                        }}
                                        maxLength={15}
                                        autoComplete={"off"}
                                    />
                                    {errors.phoneNumber && <p>Client Contact Number is Required !</p>}
                                </Form.Field>
                            </Form.Group>
                        </Modal.Description>
                        <Modal.Actions>
                            <Button onClick={clickCancel}>Cancel</Button>
                            <Button type="submit" content={isEdit ? "Update" : "ADD"} positive />
                        </Modal.Actions>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }

    return (
        <>
            <MainNavbar />
            <Header role={"Manage Project"} />
            <ToastContainer />

            <div className="inline-flex">
                <Dropdown3
                    title={"Account"}
                    data={arraySort(accountData, "option")}
                    option={accountName}
                    value={accountId}
                    setOption={setAccountName}
                    setValue={setAccountId}
                    loading={loading}
                />
                {
                    accountId &&
                    <>
                        <Button
                            className="m-1"
                            color="green"
                            size={"mini"}
                            onClick={addNew}
                            disabled={disabledButtonAdd()}
                        >
                            Add New
                        </Button>
                        <Checkbox
                            label='Include Inactive Projects'
                            className="m-2"
                            onChange={(e, d) => setShowInactiveRow(d.checked)}
                            defaultChecked={showInactiveRow}
                        />
                    </>
                }
            </div>
            {addEditProject()}

            <div>
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
                                <Table.Cell colSpan={headings.length} textAlign='center'>
                                    <div className='mt-10 allCenter'> <SpinnerCircular enabled={true} /> </div>
                                </Table.Cell>
                                :
                                projectData.length <= 0 ?
                                    <Table.Cell colSpan={headings.length} textAlign='center'>
                                        <span>No Record Found !</span>
                                    </Table.Cell>
                                    :
                                    projectData.map((project, i) => {
                                        const { projectName, projectType, projectDescription, managerName,
                                            isActive, contactPersonName, email, phoneNumber, projectDomain } = project;

                                        const isActiveText = retIsActive(isActive, isActiveData)
                                        project.isActiveText = isActiveText


                                        return (
                                            <Table.Row
                                                key={i}
                                                style={{ display: (isActive === 0 && !showInactiveRow) && "none" }}
                                            >
                                                <Table.Cell>{projectName}</Table.Cell>
                                                <Table.Cell>{projectType}</Table.Cell>
                                                <Table.Cell>{projectDescription}</Table.Cell>
                                                <Table.Cell>{projectDomain}</Table.Cell>
                                                <Table.Cell>{managerName}</Table.Cell>
                                                <Table.Cell>{isActiveText}</Table.Cell>
                                                <Table.Cell>{contactPersonName}</Table.Cell>
                                                <Table.Cell>{email}</Table.Cell>
                                                <Table.Cell>{phoneNumber}</Table.Cell>
                                                <Table.Cell>
                                                    <button className="pl-1" onClick={() => editProject(project)} disabled={isActive === 0}>
                                                        <Icon
                                                            color='teal'
                                                            size='large'
                                                            name='pencil'
                                                            disabled={isActive === 0}
                                                        />
                                                    </button>
                                                    <button className="pl-1" onClick={() => deleteProject(project)} disabled={isActive === 0}>
                                                        <Icon
                                                            color='red'
                                                            size='large'
                                                            name='remove circle'
                                                            disabled={isActive === 0}
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
    )
}

export default ProjectManagement;