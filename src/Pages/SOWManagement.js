import { useState, useEffect } from "react";
import arraySort from "array-sort";
import Header from "../components/UI/Header";
import MainNavbar from "../components/UI/MainNavbar";
import axiosCalls from "../axiosCalls";
import Dropdown3 from "../components/UI/Dropdown3";
import { Button, Checkbox, Form, Icon, Modal, Table } from "semantic-ui-react";
import { SpinnerCircular } from "spinners-react";
import { useForm } from "react-hook-form";
import { ErrorToast, SuccessToast, WarningToast } from "../components/customHooks/Toast";
import { ToastContainer } from "react-toastify";
import { getFormattedDate2 } from "../Assests/CommonFunctions";

const headings = ["SOW Name", "Opportunity", "Contract Type", "SOW Start Date", "SOW End Date",
    "Project Duration", "SOW Value", "Is Active", "SOW Path", "Edit/Delete"];

const SOWManagement = () => {
    const { handleSubmit, register, formState: { errors }, reset, setValue, watch, getValues } = useForm({
        mode: "onSubmit"
    });
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState({});
    const [sDate, setSDate] = useState("");
    const [eDate, setEDate] = useState("");
    const [showInactiveRow, setShowInactiveRow] = useState(false);

    const initialData = {
        formLoading: false,
        opportunityData: [],
        contractTypeData: [],
        isActiveData: [],
        sowData: [],
    }
    const [stateData, setStateData] = useState(initialData);
    const { opportunityData, contractTypeData, isActiveData, sowData } = stateData;

    const [accountName, setAccountName] = useState("Choose Account");
    const [accountId, setAccountId] = useState("");
    const [accountData, setAccountData] = useState([]);

    const [projectName, setProjectName] = useState("Choose Project");
    const [projectId, setProjectId] = useState("");
    const [projectData, setProjectData] = useState([]);


    const getDefaultData = async () => {
        try {
            const opportunities = await axiosCalls.get('Account/SelectList?Entity=opportunity');
            const contractTypes = await axiosCalls.get('Account/SelectList?Entity=contractType');
            const isActives = await axiosCalls.get(`Account/SelectList?Entity=IsActive`);

            const modifiedOpportunities = await opportunities.data.map((d) => { return { key: d.value, text: d.label, value: d.value } });
            const modifiedContractTypes = await contractTypes.data.map((d) => { return { key: d.value, text: d.label, value: d.value } });
            const modifiedIsActives = await isActives.data.map((d) => { return { key: d.value, text: d.label, value: d.value } });

            setStateData({
                ...stateData, opportunityData: modifiedOpportunities, contractTypeData: modifiedContractTypes, isActiveData: modifiedIsActives
            });
        } catch (err) {
            ErrorToast(err.message)
        }
    }

    const getAccountData = async () => {
        setLoading(true)
        const { data } = await axiosCalls.get('Account/GetAllAccounts');
        const modifiedData = data.map((d) => { return { option: d.accountName, value: d.accountId } });
        setAccountData(modifiedData)
        setLoading(false)
    }

    const getProjectData = async () => {
        setProjectName('Choose Project')
        setProjectId('')
        setStateData({ ...stateData, sowData: [] });
        setLoading(true)
        setDataLoading(true)
        const { data } = await axiosCalls.get(`Account/GetAllProjectResponse?AccountId=${accountId}`);
        const modifiedData = data.map((d) => { return { option: d.projectName, value: d.projectId, isActive: d.isActive } })
        setProjectData(modifiedData)
        setLoading(false)
        setDataLoading(false)
    }

    // const projectIsActiveID = () => {
    // for (let i = 0; i < projectIsActive.length; i++) {
    //         const project = projectIsActive[i];

    //   if (project.projectId === projectId) {
    //     if (project.isActive === 1) {
    //         setProjectIsActiveByID(1)

    //     } else if (project.isActive === 0) {
    //         setProjectIsActiveByID(0)
    //     } else {
    //         setProjectIsActiveByID('')

    //     }
    //     break; // exit the loop once the project is found
    //   }
    // }
    // }

    const getSOWData = async () => {
        setDataLoading(true)
        const { data } = await axiosCalls.get(`Account/SowResponse?AccountId=${accountId}&ProjectId=${projectId}`);
        setStateData({ ...stateData, sowData: data });
        setDataLoading(false)
    }


    useEffect(() => {
        getAccountData();
        getDefaultData();
    }, []);

    useEffect(() => {
        if (accountId) getProjectData();
    }, [accountId]);

    useEffect(() => {
        if (projectId) getSOWData();
    }, [projectId]);

    const getDuration = () => {
        if (sDate && eDate) {
            const d1 = new Date(sDate);
            const d2 = new Date(eDate);
            const diff = d2.getTime() - d1.getTime();
            const daydiff = diff / (1000 * 60 * 60 * 24) + 1;
            const month = parseInt(daydiff / 30)
            const days = daydiff % 30
            const durationToShow = `${month} Months ${days} Days`
            setValue("projectDuration", durationToShow)
        }
    }

    useEffect(() => {
        getDuration();
    }, [sDate, eDate]);

    const addNew = () => {
        reset({})
        setIsEdit(false)
        setOpen(true)
    }

    const onSubmit = async (formData) => {
        try {
            if (Date.parse(formData.sowEndDate) <= Date.parse(formData.sowStartDate)) {
                return alert("SOW End Date Should Be Greater Than SOW Start Date !!");
            }
            let insertUpdate, message;
            const dataToInsert = {
                engagementWeeks: "5", currencyId: 1206, sowValue: formData.sowAmount,
                accountId, projectId, ...formData
            }
            if (isEdit) {
                insertUpdate = await axiosCalls.put(`Account/SowResponse`, dataToInsert);
                if (insertUpdate.status === 200) message = "Data Updated Successfully."
            } else {
                insertUpdate = await axiosCalls.post(`Account/SowResponse`, dataToInsert);
                if (insertUpdate.status === 200) message = "Data Added Successfully."
            }
            reset({})
            setOpen(false)
            getSOWData()
            SuccessToast(message)
        }
        catch (err) {
            ErrorToast(err.message)
        }
    }

    const editSow = async (sow) => {
        reset(sow)
        setValue('sowStartDate', getFormattedDate2(sow.startDate));
        setValue('sowEndDate', getFormattedDate2(sow.endDate));
        setEditData(sow)
        setIsEdit(true)
        setOpen(true)
    }

    const deleteSOW = async (sow) => {
        const conf = await window.confirm("Are You Sure ? You Want To Delete This SOW !");
        if (conf) {
            await axiosCalls.delete(`Account/SowResponse?sowId=${sow.sowId}`);
            await WarningToast('Data Deleted Successfully !');
            getSOWData();
        }
    }

    const retIsActive = (isVal, tData) => {
        const a = tData.filter(isA => isA.value === isVal)
        return a[0].text;
    }

    const disabledButtonAdd = () => {
        const filtered = projectData.filter(a => a.value === projectId)
        return !filtered[0].isActive;
    }

    const addEditSOW = () => {
        return (
            <Modal
                closeIcon={true}
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                size={"large"}
                centered={false}
                closeOnEscape={false}
                closeOnDimmerClick={false}
            >
                <Modal.Header>
                    <span>Add New SOW</span>
                    <Button content="x" floated="right" size="small" onClick={() => setOpen(false)} />

                </Modal.Header>
                <Modal.Content>
                    <Form onSubmit={handleSubmit(onSubmit)} >
                        <Modal.Description>
                            <Form.Group widths={"equal"}>

                                <Form.Field required>
                                    <label>SOW Name</label>
                                    <input
                                        placeholder='SOW Name'
                                        type="text"
                                        {...register("sowName", { required: true })}
                                        autocomplete={"off"}
                                    />
                                    {errors.sowName && <p>SOW Name is Required !</p>}
                                </Form.Field>

                                <Form.Field required>
                                    <label>Opportunity</label>
                                    <Form.Dropdown
                                        selection
                                        search
                                        name="opportunityId"
                                        options={opportunityData}
                                        {...register("opportunityId", { required: true })}
                                        placeholder={isEdit ?
                                            <span style={{ color: "black" }}>{editData.opportunityText}</span> : 'Opportunity'}
                                        onChange={async (e, { name, value }) => {
                                            setValue(name, value);
                                        }}
                                    />
                                    {(errors.opportunityId && !watch().opportunityId) && <p>Opportunity is Required !</p>}
                                </Form.Field>

                                <Form.Field required>
                                    <label>Contract Type</label>
                                    <Form.Dropdown
                                        selection
                                        search
                                        name="contractTypeId"
                                        options={contractTypeData}
                                        {...register("contractTypeId", { required: true })}
                                        placeholder={isEdit ?
                                            <span style={{ color: "black" }}>{editData.contractTypeText}</span> : 'Contract Type'}
                                        onChange={async (e, { name, value }) => {
                                            setValue(name, value);
                                        }}
                                    />
                                    {errors.contractTypeId && <p>Contract Type is Required !</p>}
                                </Form.Field>
                            </Form.Group>

                            <Form.Group widths={"equal"}>

                                <Form.Field required>
                                    <label>SOW Start Date</label>
                                    <input
                                        name="sowStartDate"
                                        {...register("sowStartDate", { required: true })}
                                        control='input'
                                        type="date"
                                        onChange={(e) => setSDate(e.target.value)}
                                    />
                                    {errors.sowStartDate && <p>SOW Start Date is Required !</p>}
                                </Form.Field>

                                <Form.Field required>
                                    <label>SOW End Date</label>
                                    <input
                                        name="sowEndDate"
                                        {...register("sowEndDate", { required: true })}
                                        control='input'
                                        type="date"
                                        onChange={(e) => setEDate(e.target.value)}
                                        min={sDate}
                                    />
                                    {errors.sowEndDate && <p>SOW End Date is Required !</p>}
                                </Form.Field>

                                <Form.Field>
                                    <label>Project Duration</label>
                                    <input
                                        placeholder="Choose SOW Start and End Date"
                                        name="projectDuration"
                                        {...register("projectDuration", { required: false })}
                                        control='input'
                                        type="text"
                                        disabled
                                    />
                                </Form.Field>

                            </Form.Group>

                            <Form.Group widths={"equal"}>

                                <Form.Field >
                                    <label>{`SOW Value (USD)`}</label>
                                    <input
                                        placeholder='SOW Value'
                                        type="text"
                                        {...register("sowAmount", { required: false })}
                                        autocomplete={"off"}
                                    />
                                    {errors.sowAmount && <p>SOW Value is Required !</p>}
                                </Form.Field>

                                <Form.Field>
                                    <label>isActive</label>
                                    <Form.Dropdown
                                        selection
                                        search
                                        name="isActive"
                                        options={isActiveData}
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
                                </Form.Field>

                                <Form.Field required>
                                    <label>SOW Path</label>
                                    <input
                                        placeholder='SOW Path'
                                        type="text"
                                        {...register("sowPath", { required: true })}
                                        autocomplete={"off"}
                                    />
                                    {errors.sowPath && <p>SOW Path is Required !</p>}
                                </Form.Field>

                            </Form.Group>
                        </Modal.Description>
                        <Modal.Actions>
                            <Button onClick={() => setOpen(false)}>Cancel</Button>
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
            <Header role={"Manage SOW"} />
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
                <Dropdown3
                    title={"Project"}
                    data={arraySort(projectData, "option")}
                    option={projectName}
                    value={projectId}
                    setOption={setProjectName}
                    setValue={setProjectId}
                    loading={loading}
                />

                {
                    (accountId && projectId) &&
                    <>
                        <Button
                            className="m-1"
                            color="green"
                            size={"mini"}
                            onClick={addNew}
                            disabled={disabledButtonAdd()}
                        >
                            Add New SOW
                        </Button>
                        <Checkbox
                            label='Include Inactive SOW'
                            className="m-2"
                            onChange={(e, d) => setShowInactiveRow(d.checked)}
                            defaultChecked={showInactiveRow}
                        />
                    </>
                }
            </div>
            {addEditSOW()}

            <div>
                <Table celled selectable color={"grey"}>
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
                                sowData.length <= 0 ?
                                    <Table.Cell colSpan={headings.length} textAlign='center'>
                                        <span>No Record Found !</span>
                                    </Table.Cell>
                                    :
                                    sowData.map((sow, i) => {
                                        const { sowName, opportunityId, contractTypeId, startDate, endDate, projectDuration,
                                            sowAmount, isActive, sowPath } = sow;

                                        const isActiveText = retIsActive(isActive, isActiveData)
                                        const opportunityText = retIsActive(opportunityId, opportunityData)
                                        const contractTypeText = retIsActive(contractTypeId, contractTypeData)
                                        sow.opportunityText = opportunityText
                                        sow.contractTypeText = contractTypeText
                                        sow.isActiveText = isActiveText

                                        return (
                                            <Table.Row
                                                key={i}
                                                style={{ display: (isActive === 0 && !showInactiveRow) && "none" }}
                                            >
                                                <Table.Cell>{sowName}</Table.Cell>
                                                <Table.Cell>{opportunityText}</Table.Cell>
                                                <Table.Cell>{contractTypeText}</Table.Cell>
                                                <Table.Cell>{new Date(startDate).toLocaleDateString('en-CA')}</Table.Cell>
                                                <Table.Cell>{new Date(endDate).toLocaleDateString('en-CA')}</Table.Cell>
                                                <Table.Cell>{projectDuration}</Table.Cell>
                                                <Table.Cell>{sowAmount}</Table.Cell>
                                                <Table.Cell>{isActiveText}</Table.Cell>
                                                <Table.Cell>{sowPath}</Table.Cell>
                                                <Table.Cell>
                                                    <button className="pl-1" onClick={() => editSow(sow)} disabled={isActive === 0}>
                                                        <Icon
                                                            color='teal'
                                                            size='large'
                                                            name='pencil'
                                                            disabled={isActive === 0}
                                                        />
                                                    </button>
                                                    <button className="pl-1" onClick={() => deleteSOW(sow)} disabled={isActive === 0}>
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

export default SOWManagement;