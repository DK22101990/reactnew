import React from "react";
import MainNavbar from "../../components/UI/MainNavbar";
import CustomHeader from "../../components/UI/Header";
import { useState, useEffect } from "react";
import axiosCalls from "../../axiosCalls";
import arraySort from "array-sort";
import Dropdown3 from "../../components/UI/Dropdown3";
import { Button, Form, Icon, Label, Modal, Table, Grid } from "semantic-ui-react";
import { SpinnerCircular } from "spinners-react";
import { useForm } from "react-hook-form";
import { ErrorToast, SuccessToast, WarningToast } from "../../components/customHooks/Toast";
import { ToastContainer } from "react-toastify";
import { getFormattedDate2 } from "../../Assests/CommonFunctions";


//Headings for table
const headings = ["S No", "Employee Name", 'Designation', 'Type', 'SkillSet', "OnBoarding Date", "OffBoarding Date",
    "Allocated Billability", 'Allocated Utilization', 'Agreed Hours Per Day', 'SOW Hourly Rate', 'Utlization Status', "Comment", "Edit/Delete"];

const allocatedTableHeadings = ["No", "Project Name", "Allocated Billability", 'Allocated Utilization', 'Project OnBoarding Date', 'Project OffBoarding Date']


const ProjectAllocation2 = () => {

    const defaultDataStorage = {
        allocatedBillDisable: false,
        allocatedBillShow: "",
        allocatedUtiDisable: false,
        allocatedUtiShow: "",
        utiStatusDisable: false,
        utiStatusShow: "",
        sowStartDate: "",
        sowEndDate: "",
        allocatedBillabilityData: [],
        allocatedUtilizationData: [],
        copyAllocatedUtilizationData: [],
    }
    const [defaultData, setDefaultData] = useState(defaultDataStorage);
    const { sowStartDate, sowEndDate, allocatedBillabilityData, allocatedUtilizationData, copyAllocatedUtilizationData,
        allocatedBillDisable, allocatedUtiDisable, allocatedBillShow, allocatedUtiShow, utiStatusShow, utiStatusDisable }
        = defaultData;

    const [changeKey, setChangeKey] = useState(1);

    const initialData = {
        employeeData: [],
        utilizationData: []
    }
    const [stateData, setStateData] = useState(initialData);
    const { employeeData, utilizationData } = stateData;

    const [formLoading, setFormLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState({});
    const [allDisable, setAllDisable] = useState(false);
    const [allocatedMessage, setAllocatedMessage] = useState("");

    //useForm states
    const { control, handleSubmit, register, formState: { errors }, reset, setValue, watch } = useForm({
        mode: "onSubmit"
    });

    //To load data
    const [dataLoading, setDataLoading] = useState(false);

    //Manager dropdown states
    const [managerData, setManagerData] = useState([]);
    const [managerName, setManagerName] = useState("Choose Manager ");
    const [managerId, setManagerId] = useState("");

    //Account dropdown states
    const [accountData, setAccountData] = useState([]);
    const [accountName, setAccountName] = useState("Choose Account ");
    const [accountId, setAccountId] = useState("");

    //Project dropdown states
    const [projectData, setProjectData] = useState([]);
    const [projectName, setProjectName] = useState("Choose Project ");
    const [projectId, setProjectId] = useState("");

    //Sow dropdown states
    const [sowData, setSowData] = useState([]);
    const [sowName, setSowName] = useState("Choose SOW ");
    const [sowId, setSowId] = useState("");

    //Sow response
    const [sowResponse, setSowResponse] = useState([])

    //To open and close modal i.e add and update modal 
    const [open, setOpen] = useState(false);

    const [empId, setEmpId] = useState('')
    //Dummy data
    const [projectAllocationData, setProjectAllocationData] = useState([]);
    const [billAndUtiData, setBillAndUtiData] = useState([]);

    const [sDate, setSDate] = useState('')
    const [eDate, setEDate] = useState('')

    const getDefaultData = async () => {
        const emps = await axiosCalls.get(`Account/SelectList?Entity=Employee`);
        const contractEmps = await axiosCalls.get(`Account/SelectList?Entity=Contractors`);
        const utilizations = await axiosCalls.get(`Account/SelectList?Entity=utilizationStatus`);

        const modifiedEmps = emps.data.map((d) => { return { key: d.value, text: d.label, value: d.value } })
        const modifiedContractEmps = contractEmps.data.map((d) => { return { key: d.value, text: d.label, value: d.value } })
        const modifiedUtilizations = await utilizations.data.map((d) => { return { key: d.value, text: d.label, value: d.label } })
            .filter(a => a.text !== "Billable")

        // Merge both Employee & Contractor And remove Already Allocated Employee from Dropdown
        const bothEmpContractor = arraySort([...modifiedEmps, ...modifiedContractEmps], "text")
            .filter(({ value: id1 }) => !projectAllocationData.filter(({ isActive }) => isActive === 1)
                .some(({ employeeId: id2 }) => id2 === id1));

        setStateData({ ...stateData, employeeData: bothEmpContractor, utilizationData: modifiedUtilizations });
    }

    //To get data for manager dropdown
    const getManagerData = async () => {
        try {
            const { data } = await axiosCalls.get(`Account/SelectList?Entity=ReportingManager`);
            const modifiedData = data.map((d) => { return { option: d.label, value: d.value } });
            setManagerData(modifiedData);
        } catch (err) {
            ErrorToast(err.message)
        }
    };

    //To get data for Account dropdown
    const getAccountData = async () => {
        try {
            setAccountName("Choose Account")
            setProjectName("Choose Project ")
            setSowName("Choose Sow")
            setSowId("")
            const { data } = await axiosCalls.get(`ProjectAllocation/GetAccountListOnProjectManager?managerId=${managerId}`);
            const modifiedData = data.map((d) => {
                return { option: d.accountName, value: d.accountId };
            });
            setAccountData(modifiedData);
        } catch (err) {
            ErrorToast(err.message)
        }
    };

    //To get data for Project dropdown
    const getProjectData = async () => {
        try {
            setProjectName("Choose Project ") //to set default value when accountID is changed
            setSowName("Choose Sow")
            setSowId("")
            const { data } = await axiosCalls.get(`Account/GetAllProjectResponse?AccountId=${accountId}`);
            const modifiedData = data.map((d) => {
                return { option: d.projectName, value: d.projectId };
            });
            setProjectData(modifiedData);
        } catch (err) {
            ErrorToast(err.message)
        }
    };

    //To get data for Sow dropdown
    const getSowData = async () => {
        try {
            setSowName("Choose Sow ") //to set default value when accountID is changed
            setSowId("")
            const { data } = await axiosCalls.get(`Account/SowResponse?AccountId=${accountId}&ProjectId=${projectId}`);
            const modifiedData = data.map((d) => {
                return { option: d.sowName, value: d.sowId };
            });
            setSowData(modifiedData);
        } catch (err) {
            ErrorToast(err.message)
        }
    };

    const setDateData = (d1, d2) => {
        setSDate(d1);
        setEDate(d2);
        setValue("projectOnBoardingDate", d1);
        setValue("projectOffBoardingDate", d2);
    }

    //to get sow response data in grid
    const getSowResponse = async () => {
        try {
            // const { data } = await axiosCalls.get(`Account/SowResponse?AccountId=${accountId}&ProjectId=${projectId}`);
            const { data } = await axiosCalls.get(`Account/GetSowById?sowId=${sowId}`);

            // const d = data.filter(a => a.sowId === sowId);
            // const mSdate = getFormattedDate2(d[0].startDate)
            // const mEdate = getFormattedDate2(d[0].endDate)
            const mSdate = getFormattedDate2(data.sowStartDate)
            const mEdate = getFormattedDate2(data.sowEndDate)
            setDateData(mSdate, mEdate);
            setDefaultData({ ...defaultData, sowStartDate: mSdate, sowEndDate: mEdate });
            setSowResponse(data);
        } catch (err) {
            ErrorToast(err.message)
        }
    };

    const getProjectAllocationData = async () => {
        try {
            setDataLoading(true);
            const { data } = await axiosCalls.get(`ProjectAllocation/GetProjectAllocation?managerId=${managerId}&projectId=${projectId}&sowId=${sowId}&accountId=${accountId}`)
            setProjectAllocationData(data);
            setDataLoading(false);
        } catch (err) {
            setDataLoading(false);
            ErrorToast(err.message)
        }
    };

    //to get data for manager dropdown
    useEffect(() => {
        getManagerData();
    }, []);

    //to get account data with respect to managerID
    useEffect(() => {
        if (managerId) getAccountData();
    }, [managerId])

    //to get project data with respect to accountID
    useEffect(() => {
        if (accountId) getProjectData();
    }, [accountId])

    //To get sow data with respect to projectID
    useEffect(() => {
        if (projectId) getSowData();
    }, [projectId])

    //To get sow response data with respect to sowID
    useEffect(() => {
        if (sowId) getSowResponse();
    }, [sowId])

    useEffect(() => {
        if (managerId && accountId && projectId && sowId) getProjectAllocationData();
    }, [managerId, accountId, projectId, sowId])

    const clickCancel = () => {
        reset({})
        setOpen(false);
        setBillAndUtiData([]);
        defaultDataStorage.sowStartDate = sowStartDate
        defaultDataStorage.sowEndDate = sowEndDate
        setDefaultData(defaultDataStorage);
        setEmpId('')

        //new
    }

    //To open Modal
    const addNew = () => {
        {/*New*/ }
        setEmpId('')
        getDefaultData()
        reset({})
        setAllDisable(false)
        setIsEdit(false);
        setDateData(sowStartDate, sowEndDate)
        setOpen(true)
    }

    //Edit Operation
    const editProjectAllocation = async (eData) => {
        setOpen(true);
        setIsEdit(true);
        setEmpId(eData.employeeId)
        // setSDate(eData.projectOnBoardingDate)
        // setEDate(eData.projectOffBoardingDate)
        setDateData(getFormattedDate2(eData.projectOnBoardingDate), getFormattedDate2(eData.projectOffBoardingDate));
        setEditData(eData);
        setDisValues(eData.employeeId, eData, true);

    }

    const deleteProjectAllocation = async (rowData) => {
        try {
            const conf = await window.confirm("Are You Sure ? You Want To Delete This Resource !");
            if (conf) {
                await axiosCalls.delete(`ProjectAllocation/DeleteProjectAllocation?ProjectAllocationsId=${rowData.projectAllocationsId}`);
                WarningToast('Data Deleted Successfully !');
                getProjectAllocationData();
            }
        }
        catch (err) {
            getProjectAllocationData();
            ErrorToast(err.message)
        }
    }

    const onSubmit = async (formData) => {
        try {
            const { employeeId, projectOnBoardingDate, projectOffBoardingDate, sowHourlyRate, utilizationStatus,
                allocatedUtilization, allocatedBillability, comments, projectAllocationsId
            } = formData;
            if (allocatedBillability > allocatedUtilization) return alert("Allocated Billability Should be Less or Equal To Allocated Utilization");
            if (projectOffBoardingDate < projectOnBoardingDate) return alert("Project OnBoardingDate Should be Less or Equal To Project OffBoardingDate");
            const dataToInsert = {
                employeeId, projectId, sowId, accountId, managerId,
                projectOnBoardingDate,
                projectOffBoardingDate,
                sowHourlyRate,
                utilizationStatus,
                allocatedUtilization,
                allocatedBillability,
                comments,
                billability: 1,
                isActive: 1,
                allocationType: null
            }
            let addEditMsg = "Resource Added Successfully."
            let data;
            if (isEdit) {
                dataToInsert.projectAllocationId = projectAllocationsId
                setFormLoading(true)
                data = await axiosCalls.post(`ProjectAllocation/UpdateProjectAllocation`, dataToInsert);
                addEditMsg = "Resource Updated Successfully."
                setFormLoading(false)
            } else {
                setFormLoading(true)
                data = await axiosCalls.post(`ProjectAllocation/InsertProjectAllocation`, dataToInsert);
                setFormLoading(false)
            }
            getProjectAllocationData();
            clickCancel();
            SuccessToast(addEditMsg);
            // new reset({});
        }
        catch (err) {
            ErrorToast(err.message);
        }
    }

    const getFormattedDate = (date) => {
        return new Date(date).toLocaleDateString('en-CA');
    }


    const setDisValues = async (eId, updateData = {}, ed) => {
        try {
            let edit = ed ? 1 : 0;
            // setDateData(getFormattedDate2(updateData.projectOnBoardingDate), getFormattedDate2(updateData.projectOffBoardingDate));
            setFormLoading(true);
            setAllDisable(false);
            const emp = await axiosCalls.get(`ProjectAllocation/GetEmployeeDetail/${eId}`);
            const BillabilityAndUtilization = await axiosCalls.get(`ProjectAllocation/GetBillabilityandUtilization?employeeId=${eId}&IsEditable=${edit}&ProjectId=${projectId}&StartDate=${sDate}&EndDate=${eDate}`);
            const filteredData = BillabilityAndUtilization.data.filter(item => {
                const itemStartDate = getFormattedDate(item.projectOnBoardingDate);
                const itemEndDate = getFormattedDate(item.projectOffBoardingDate);

                return ((itemStartDate >= sDate && itemEndDate <= eDate) ||
                    (itemStartDate <= eDate && itemEndDate >= sDate))
            });
            setBillAndUtiData(filteredData)

            const BillabilityAndUtilizationData = BillabilityAndUtilization.data[0]
            const avalBill = BillabilityAndUtilizationData.availableBillability.split(",").map(b => {
                const num = Number(b);
                return { key: num, text: num, value: num }
            });
            const avalUti = BillabilityAndUtilizationData.availableUtilization.split(",").map(b => {
                const num = Number(b);
                return { key: num, text: num, value: num }
            });
            const { availableBillability, availableUtilization, accountNames, projectNames } = BillabilityAndUtilizationData
            if (availableUtilization === "0") {
                setAllDisable(true)
                setAllocatedMessage(`Resource Is Fully Allocated (Please Look Into Below Table For More Info) !`)
            }

            setDefaultData(a => {
                return {
                    ...a, allocatedBillabilityData: avalBill,
                    allocatedUtilizationData: avalUti, copyAllocatedUtilizationData: avalUti
                }
            });

            let emData;
            if (edit) {
                // setDateData(getFormattedDate2(updateData.projectOnBoardingDate), getFormattedDate2(updateData.projectOffBoardingDate));
                emData = { ...emData, ...updateData }
                emData["skillSet"] = `${emp.data[0].primarySkill},${emp.data[0].secondarySkill}` || "";
                delete emData['projectOnBoardingDate']
                delete emData['projectOffBoardingDate']
                setDefaultData(a => {
                    return {
                        ...a, allocatedBillShow: emData.allocatedBillability,
                        allocatedUtiShow: emData.allocatedUtilization,
                        utiStatusShow: emData.utilizationStatus,
                        allocatedBillabilityData: avalBill,
                        allocatedUtilizationData: avalUti,
                        copyAllocatedUtilizationData: avalUti
                    }
                })
                setValue("allocatedBillability", Number(emData.availableBillability));
                setValue("allocatedUtilization", Number(emData.availableUtilization));
                Object.keys(emData).map((k) => { setValue(k, emData[k]) });
                setFormLoading(false)
            } else {
                emData = emp.data[0]
                emData["skillSet"] = `${emp.data[0].primarySkill},${emp.data[0].secondarySkill}`
                Object.keys(emData).map((k) => { setValue(k, emData[k]) });
                setFormLoading(false)
            }
        }
        catch (err) {
            setFormLoading(false);
            console.log("err", err)
            ErrorToast("Something Went Wrong !");
        }
    }

    const addAllocationValidations = (value) => {
        if (value === 0) {
            setDefaultData({
                ...defaultData,
                utiStatusDisable: false,
                allocatedUtiDisable: false,
                utiStatusShow: "Choose Status",
                copyAllocatedUtilizationData: allocatedUtilizationData
            });
        } else {
            if (value === 100) {
                const maxValue = Math.max(...allocatedUtilizationData.map(o => o.key))
                setValue("allocatedUtilization", maxValue);
                setValue("utilizationStatus", "Billable");
                setChangeKey(changeKey + 1);
                setDefaultData({
                    ...defaultData,
                    allocatedUtiDisable: true,
                    allocatedUtiShow: "" + maxValue,
                    utiStatusDisable: true,
                    utiStatusShow: "Billable"
                });
            } else {
                const filteredAllUti = Array.from(allocatedUtilizationData).filter(a => a.value >= value);
                // setValue("allocatedUtilization", value);
                setDefaultData({
                    ...defaultData,
                    allocatedUtiDisable: false,
                    allocatedUtiShow: "",
                    copyAllocatedUtilizationData: filteredAllUti,
                    utiStatusShow: "Billable",
                    utiStatusDisable: true,
                });
                setValue("utilizationStatus", "Billable");
            }
        }
    }

    useEffect(() => {
        if (empId) {
            setDisValues(empId, editData, isEdit);
        }
    }, [sDate, eDate]);

    const addEditProjectAllocation = () => {
        return (
            <Modal
                closeIcon
                open={open}
                onClose={() => {
                    setOpen(false)
                    reset({})

                }}
                onOpen={() => {
                    reset({})
                    setOpen(true)
                }}
                size={"large"}
                centered={false}
                closeOnEscape={false}
                closeOnDimmerClick={false}
                style={{ overflowY: "auto" }}
            >

                <Modal.Header>
                    {isEdit ? 'Update Resource' : 'Add New Resource'}
                    <Button content="x" floated="right" size="small" onClick={clickCancel} />
                </Modal.Header>
                <Modal.Content >
                    {allDisable && <p style={{ color: "red", alignItems: "center" }}>{allocatedMessage}</p>}
                    <Form onSubmit={handleSubmit(onSubmit)} loading={formLoading}>
                        <Modal.Description>
                            <Form.Group widths={"equal"}>
                                <Form.Field required>
                                    <label>Employee Name</label>
                                    <Form.Dropdown
                                        selection
                                        search
                                        name="employeeName"
                                        options={employeeData}
                                        {...register("employeeName", { required: true })}
                                        placeholder={isEdit ?
                                            <span style={{ color: "black" }}>{editData.employeeName}</span> : 'Select Employee'}
                                        onChange={async (e, { name, value, ...d }) => {
                                            setEmpId(value)
                                            setDisValues(value, {}, false);
                                            setValue(name, value);
                                            setValue('projectOnBoardingDate', sowStartDate)
                                            setValue('projectOffBoardingDate', sowEndDate)
                                            // setValue('allocatedBillability',0)
                                        }}
                                        disabled={isEdit}
                                    />
                                    {(errors.employeeName && !watch().employeeName) && <p>Employee Name is Required !</p>}
                                </Form.Field>

                                <Form.Field>
                                    <label>Designation</label>
                                    <input
                                        placeholder='Designation'
                                        type="text"
                                        {...register("designation", { required: false })}
                                        disabled={true}
                                    />
                                </Form.Field>

                                <Form.Field>
                                    <label>Type</label>
                                    <input
                                        placeholder='Type'
                                        type="text"
                                        {...register("employeeType", { required: false })}
                                        disabled={true}
                                    />
                                </Form.Field>
                            </Form.Group>

                            <Form.Group widths={"equal"}>
                                <Form.Field>
                                    <label>Skill Set</label>
                                    <input
                                        placeholder='Skills'
                                        type="text"
                                        {...register("skillSet", { required: false })}
                                        disabled={true}
                                    />
                                </Form.Field>

                                <Form.Field required>
                                    <label>Project Onboarding Date</label>
                                    <input
                                        placeholder='Onboarding Date'
                                        type="date"
                                        // key={sowStartDate}
                                        {...register("projectOnBoardingDate", { required: true })}
                                        onChange={(e) => {
                                            setSDate(e.target.value);
                                            // setValue('allocatedBillability','')
                                        }}
                                        min={sowStartDate}
                                        max={sowEndDate}
                                    />
                                    {errors.projectOnBoardingDate && <p>On Boarding Date is Required !</p>}
                                </Form.Field>

                                <Form.Field required>
                                    <label>Project Offboarding Date</label>
                                    <input
                                        placeholder='Offboarding Date'
                                        type="date"
                                        // key={sowEndDate}
                                        {...register("projectOffBoardingDate", { required: true })}
                                        onChange={(e) => {
                                            setEDate(e.target.value);
                                        }}
                                        min={sowStartDate}
                                        max={sowEndDate}
                                    />
                                    {errors.projectOffBoardingDate && <p>Off Boarding Date is Required !</p>}
                                </Form.Field>
                            </Form.Group>

                            <Form.Group widths={"equal"}>
                                <Form.Field required>
                                    <label>Allocated Billability</label>
                                    <Form.Dropdown
                                        selection
                                        search
                                        name="allocatedBillability"
                                        options={allocatedBillabilityData}
                                        {...register("allocatedBillability", { required: true })}
                                        disabled={allocatedBillDisable}
                                        key={allocatedBillShow}
                                        placeholder={<span style={{ color: "black" }}>{allocatedBillShow}</span>}
                                        onChange={async (e, { name, value, ...d }) => {
                                            addAllocationValidations(value)
                                            setValue(name, value);
                                        }}
                                    />
                                    {(errors.allocatedBillability && !watch().allocatedBillability) && <p>Billability is Required !</p>}
                                </Form.Field>

                                <Form.Field required>
                                    <label>Allocated Utilization</label>
                                    <Form.Dropdown
                                        selection
                                        search
                                        name="allocatedUtilization"
                                        options={copyAllocatedUtilizationData}
                                        {...register("allocatedUtilization", { required: true })}
                                        disabled={allocatedUtiDisable}
                                        key={changeKey}
                                        placeholder={<span style={{ color: "black" }}>{allocatedUtiShow}</span>}
                                        onChange={async (e, { name, value, ...d }) => {
                                            setValue(name, value);
                                        }}
                                    />
                                    {(errors.allocatedUtilization && !watch().allocatedUtilization) && <p>Utilization is Required !</p>}
                                </Form.Field>
                                <Form.Field required>
                                    <label>Utilization Status</label>
                                    <Form.Dropdown
                                        selection
                                        search
                                        name="utilizationStatus"
                                        options={utilizationData}
                                        {...register("utilizationStatus", { required: true })}
                                        key={utiStatusShow}
                                        disabled={utiStatusDisable}
                                        placeholder={
                                            <span style={{ color: "black" }}>{utiStatusShow}</span>
                                        }
                                        onChange={async (e, { name, value, ...d }) => {
                                            setValue(name, value);
                                        }}
                                    />
                                    {(errors.utilizationStatus && !watch().utilizationStatus) && <p>Utilization Status is Required !</p>}
                                </Form.Field>

                            </Form.Group>

                            <Form.Group widths={"equal"}>
                                <Form.Field required>
                                    <label>{`SOW Hourly Rate (USD)`}</label>
                                    <input
                                        placeholder='SOW Hourly Rate'
                                        type="number"
                                        {...register("sowHourlyRate", { required: true })}
                                        autoComplete={"off"}
                                    />
                                    {errors.sowHourlyRate && <p>Hourly Rate is Required !</p>}
                                </Form.Field>
                                <Form.Field>
                                    <label>Agreed Hours Per Day</label>
                                    <input
                                        placeholder='Agreed Daily Working Hours'
                                        type="text"
                                        {...register("agreedDailyWorkingHours", { required: false })}
                                        disabled={true}
                                    />
                                </Form.Field>

                                <Form.Field>
                                    <label>Comments</label>
                                    <input
                                        placeholder='Add Comment'
                                        type="text"
                                        {...register("comments", { required: false })}
                                        autoComplete={"off"}
                                        maxLength={100}
                                    />
                                </Form.Field>

                            </Form.Group>


                        </Modal.Description>
                        <Modal.Actions>
                            <Button onClick={clickCancel}>Cancel</Button>
                            <Button type="submit" content={isEdit ? "Update" : "ADD"} positive disabled={allDisable} />

                            {/* Allocation Table to Show Account, Project, Billability and Utilization */}
                            {
                                billAndUtiData.length > 0 && billAndUtiData[0].allocatedUtilization > 0 &&
                                <div>
                                    <h4 className="mx-10 my-2" style={{ textAlign: 'center' }}>Current Allocation</h4>
                                    <Table celled color="green" size='small'>
                                        <Table.Header>
                                            <Table.Row>
                                                {allocatedTableHeadings.map((heading, i) => {
                                                    return (
                                                        <Table.HeaderCell key={i}>{heading}</Table.HeaderCell>
                                                    )
                                                })}
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {
                                                billAndUtiData.map((bAndU, i) => {
                                                    return (
                                                        <Table.Row key={i}>
                                                            <Table.Cell>{i + 1}</Table.Cell>
                                                            <Table.Cell>{bAndU.projectName}</Table.Cell>
                                                            <Table.Cell>{bAndU.allocatedBillability}</Table.Cell>
                                                            <Table.Cell>{bAndU.allocatedUtilization}</Table.Cell>
                                                            {/*New*/}
                                                            <Table.Cell>{getFormattedDate2(bAndU.projectOnBoardingDate)}</Table.Cell>
                                                            <Table.Cell>{getFormattedDate2(bAndU.projectOffBoardingDate)}</Table.Cell>
                                                        </Table.Row>
                                                    )
                                                })
                                            }
                                        </Table.Body>
                                    </Table>
                                </div>
                            }
                        </Modal.Actions>
                    </Form>

                </Modal.Content>

            </Modal>
        )
    }

    return (
        <div>
            <MainNavbar />
            <CustomHeader />
            <ToastContainer />

            <div className="inline-flex">
                <Dropdown3
                    title={"Manager"}
                    data={arraySort(managerData, "option")} //sorts data in alphabetical order and next " " value is for setting it accordingly
                    option={managerName}
                    value={managerId}
                    setOption={setManagerName}
                    setValue={setManagerId}
                // loading={sowDataLoading}
                />

                <Dropdown3
                    title={"Account"}
                    data={accountData} //sorts data in alphabetical order and next " " value is for setting it accordingly
                    option={accountName}
                    value={accountId}
                    setOption={setAccountName}
                    setValue={setAccountId}
                // loading={sowDataLoading}
                />

                <Dropdown3
                    title={"Project"}
                    data={projectData} //sorts data in alphabetical order and next " " value is for setting it accordingly
                    option={projectName}
                    value={projectId}
                    setOption={setProjectName}
                    setValue={setProjectId}
                // loading={sowDataLoading}
                />

                <Dropdown3
                    title={"SOW"}
                    data={sowData} //sorts data in alphabetical order and next " " value is for setting it accordingly
                    option={sowName}
                    value={sowId}
                    setOption={setSowName}
                    setValue={setSowId}
                // loading={sowDataLoading}
                />

            </div>
            {/*This sowId is written because we want to show data if only */}
            {
                sowId &&
                <div className="my-2" style={{ textAlign: "center" }}>
                    <h2 className="ui block header">
                        <span>Sow Details</span>
                        <Button
                            className="m-1"
                            color="green"
                            size={"mini"}
                            onClick={addNew}
                            floated='right'
                            disabled={sowResponse.isActive === 0}
                        >
                            Add New Resource
                        </Button>
                    </h2>
                    <div className="pl-4 pt-2" style={{ display: "flex" }}>

                        <Grid columns={5}>
                            <Grid.Row>
                                <Grid.Column>
                                    <Label>
                                        Project Type
                                        <Label.Detail>{sowResponse.projectType}</Label.Detail>
                                    </Label>
                                </Grid.Column>
                                <Grid.Column>
                                    <Label>
                                        SOW Start Date
                                        <Label.Detail>{new Date(sowResponse.sowStartDate).toLocaleDateString('en-CA')}</Label.Detail>
                                    </Label>
                                </Grid.Column>
                                <Grid.Column>
                                    <Label >
                                        SOW End Date
                                        <Label.Detail>{new Date(sowResponse.sowEndDate).toLocaleDateString('en-CA')}</Label.Detail>
                                    </Label>
                                </Grid.Column>
                                <Grid.Column>
                                    <Label>
                                        Project Duration
                                        <Label.Detail>{sowResponse.projectDuration}</Label.Detail>
                                    </Label>
                                </Grid.Column>
                                <Grid.Column>
                                    <Label>
                                        SOW Value
                                        <Label.Detail>{sowResponse.sowValue}</Label.Detail>
                                    </Label>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row>
                                <Grid.Column>
                                    <Label>
                                        Contract Type
                                        <Label.Detail>{sowResponse.contractType}</Label.Detail>
                                    </Label>
                                </Grid.Column>

                                <Grid.Column>
                                    <Label>
                                        Is Active
                                        <Label.Detail style={{ color: !sowResponse.isActive && "red" }}>{sowResponse.isActive ? 'Yes' : 'No'} </Label.Detail>
                                    </Label>
                                </Grid.Column>

                                <Grid.Column>
                                    <Label>
                                        Client Contact Person
                                        <Label.Detail>{sowResponse.clientContactPerson}</Label.Detail>
                                    </Label>
                                </Grid.Column>

                                <Grid.Column>
                                    <Label>
                                        Client Email Id
                                        <Label.Detail>{sowResponse.clientEmailId}</Label.Detail>
                                    </Label>
                                </Grid.Column>

                                <Grid.Column>
                                    <Label>
                                        SOW Path
                                        <Label.Detail>{sowResponse.sowPath}</Label.Detail>
                                    </Label>
                                </Grid.Column>
                            </Grid.Row>

                        </Grid>

                    </div>
                </div>
            }
            {addEditProjectAllocation()}
            {
                sowId &&
                <div className="px-10">
                    <Table celled selectable color={"grey"} collapsing>
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
                                        <div className='mt-10 allCenter'>
                                            <SpinnerCircular enabled={true} />
                                        </div>
                                    </Table.Cell>
                                    :
                                    projectAllocationData.length <= 0 ?
                                        <Table.Cell colSpan={headings.length} textAlign='center'>
                                            <span>No Record Found !</span>
                                        </Table.Cell>
                                        :
                                        projectAllocationData.filter((data) => { return sowResponse.isActive === data.isActive })
                                            .map((mapData, i) => {
                                                const { employeeName, designation, employeeType, skillName, projectOnBoardingDate, projectOffBoardingDate,
                                                    allocatedBillability, allocatedUtilization, agreedDailyWorkingHours,
                                                    sowHourlyRate, utilizationStatus, comments } = mapData;
                                                return (
                                                    <Table.Row key={i}>
                                                        <Table.Cell>{i + 1}</Table.Cell>
                                                        <Table.Cell>{employeeName}</Table.Cell>
                                                        <Table.Cell>{designation}</Table.Cell>
                                                        <Table.Cell>{employeeType}</Table.Cell>
                                                        <Table.Cell>{skillName}</Table.Cell>
                                                        <Table.Cell>{new Date(projectOnBoardingDate).toLocaleDateString('en-CA')}</Table.Cell>
                                                        <Table.Cell>{new Date(projectOffBoardingDate).toLocaleDateString('en-CA')}</Table.Cell>
                                                        <Table.Cell>{allocatedBillability}</Table.Cell>
                                                        <Table.Cell>{allocatedUtilization}</Table.Cell>
                                                        <Table.Cell>{agreedDailyWorkingHours}</Table.Cell>
                                                        <Table.Cell>{sowHourlyRate}</Table.Cell>
                                                        <Table.Cell>{utilizationStatus}</Table.Cell>
                                                        <Table.Cell>{comments}</Table.Cell>
                                                        <Table.Cell>
                                                            <button
                                                                className="pl-1"
                                                                onClick={() => {
                                                                    editProjectAllocation(mapData)
                                                                }}
                                                                disabled={sowResponse.isActive === 0}
                                                            >
                                                                <Icon
                                                                    color='teal'
                                                                    size='large'
                                                                    name='pencil'
                                                                    disabled={sowResponse.isActive === 0}
                                                                />
                                                            </button>
                                                            <button className="pl-1" onClick={() => deleteProjectAllocation(mapData)} disabled={sowResponse.isActive === 0}>
                                                                <Icon
                                                                    color='red'
                                                                    size='large'
                                                                    name='remove circle'
                                                                    disabled={sowResponse.isActive === 0}
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
            }
        </div>
    );
};

export default ProjectAllocation2;