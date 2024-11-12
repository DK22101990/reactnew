import React, { useState, useEffect } from "react";
import MainNavbar from "../../components/UI/MainNavbar";
import CustomHeader from "../../components/UI/Header";
import axiosCalls from "../../axiosCalls";
import arraySort from "array-sort";
import { Button, Form, Icon, Modal, Table, Dropdown } from "semantic-ui-react";
import { SpinnerCircular } from "spinners-react";
import { ErrorToast, SuccessToast, WarningToast } from "../../components/customHooks/Toast";
import { ToastContainer } from "react-toastify";
import { getFormattedDate, getFormattedDate2 } from "../../Assests/CommonFunctions";
import SOWResponseComp from "./SOWResponseComp";

//Headings for table
const allocationHeadings = ["S No", "Employee Name", 'Designation', 'Type', 'SkillSet', "OnBoarding Date", "OffBoarding Date",
    "Allocated Billability", 'Allocated Utilization', 'Agreed Hours Per Day', 'SOW Hourly Rate', 'Utlization Status', "Comment", "Edit/Delete"];

const proAllocatCommonKeys = ["employeeName", "designation", "employeeType", "skillName", "projectOnBoardingDate", "projectOffBoardingDate",
    "allocatedBillability", "allocatedUtilization", "agreedDailyWorkingHours", "sowHourlyRate", "utilizationStatus", "comments"]

const allocatedTableHeadings = ["No", "Project Name", "Allocated Billability", 'Allocated Utilization', 'Project OnBoarding Date', 'Project OffBoarding Date'];



const ProjectAllocationNew = () => {

    const [billAndUtiData, setBillAndUtiData] = useState([]);

    const datesInitial = {
        minDate: "",
        maxDate: "",
        sowStartDate: "",
        sowEndDate: "",
        calStartDate: "",
        calEndDate: ""
    }
    const [dates, setDates] = useState(datesInitial);
    const { minDate, maxDate, sowStartDate, sowEndDate, calStartDate, calEndDate } = dates;

    const validationInitial = {
        allocatedBillabilityVal: false,
        allocatedUtilizationVal: false,
        utilizationStatusVal: false,
        sowHourlyRateVal: false
    }
    const [validations, setValidations] = useState(validationInitial);

    const modalInitial = {
        open: false,
        allDisable: false,
        allocatedMessage: "",
    }
    const [modalDetail, setModalDetail] = useState(modalInitial);
    const { open, allDisable, allocatedMessage } = modalDetail;
    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState({});

    const addNewResource = () => {
        setValidations(validationInitial);
        setModalDetail({ ...modalDetail, open: true });
    }

    const editResource = (mapData) => {
        setModalDetail({ ...modalInitial, open: true });
        setEditData(mapData)
        setIsEdit(true)
        getEmployeeDetails(mapData.employeeId, 1, mapData, mapData.projectOnBoardingDate, mapData.projectOffBoardingDate);
    }

    const clickCancel = () => {
        setIsEdit(false)
        setEditData({})
        setValidations(validationInitial);
        setBillAndUtiData([]);
        setFormData({ ...formDataInitial, projectOnBoardingDate: sowStartDate, projectOffBoardingDate: sowEndDate });
        setModalDetail(modalInitial);
    }

    const defaultDataInitial = {
        employeeList: [],
        filteredEmployee: [],
    }
    const [defaultData, setDefaultData] = useState(defaultDataInitial);
    const { employeeList, filteredEmployee } = defaultData;

    const managerInitial = {
        managerName: "",
        managerId: '',
        managerList: [],
        managerLoading: false
    }
    const [managerDetail, setManagerDetail] = useState(managerInitial);
    let { managerName, managerId, managerList, managerLoading } = managerDetail;

    const accountInitial = {
        accountName: "",
        accountId: '',
        accountList: [],
        accountLoading: false
    }
    const [accountDetail, setAccountDetail] = useState(accountInitial);
    let { accountName, accountId, accountList, accountLoading } = accountDetail;

    const projectInitial = {
        projectName: "",
        projectId: '',
        projectList: [],
        projectLoading: false
    }
    const [projectDetail, setProjectDetail] = useState(projectInitial);
    let { projectName, projectId, projectList, projectLoading } = projectDetail;

    const sowInitial = {
        sowName: "",
        sowId: '',
        sowList: [],
        sowLoading: false
    }
    const [sowDetail, setSOWDetail] = useState(sowInitial);
    let { sowName, sowId, sowList, sowLoading } = sowDetail;

    const sowResInitial = {
        sowResData: {},
        sowResIsActive: 1,
        sowResLoading: false
    }
    const [sowResponse, setSowResponse] = useState(sowResInitial);
    let { sowResData, sowResIsActive, sowResLoading } = sowResponse;

    const projectAllocationInitial = {
        projectAllocationList: [],
        proAlloLoading: false
    }
    const [projectAllocationResponse, setProjectAllocationResponse] = useState(projectAllocationInitial);
    let { projectAllocationList, proAlloLoading } = projectAllocationResponse;


    const setStateValues = (values, setFunction, restValues) => {
        setFunction({ ...restValues, ...values })
    }

    const getManagerData = async () => {
        try {
            setManagerDetail({ ...managerDetail, managerLoading: true });
            setAccountDetail(accountInitial)
            setProjectDetail(projectInitial)
            setSOWDetail(sowInitial)
            const { data } = await axiosCalls.get(`Account/SelectList?Entity=ReportingManager`);
            const modifiedManager = data.map(d => { return { key: d.label, text: d.label, value: d.value } });
            setManagerDetail({ ...managerDetail, managerList: modifiedManager, managerLoading: false });
        } catch (err) {
            setManagerDetail({ ...managerDetail, managerLoading: false });
            ErrorToast(err.message)
        }
    };

    const getAccountData = async () => {
        try {
            setAccountDetail({ ...accountDetail, accountLoading: true });
            setProjectDetail(projectInitial)
            setSOWDetail(sowInitial)
            const { data } = await axiosCalls.get(`ProjectAllocation/GetAccountListOnProjectManager?managerId=${managerId}`);
            const modifiedAccount = data.map(d => { return { key: d.accountName, text: d.accountName, value: d.accountId } });
            setAccountDetail({ ...accountDetail, accountList: modifiedAccount, accountLoading: false });
        } catch (err) {
            setAccountDetail({ ...accountDetail, accountLoading: false });
            ErrorToast(err.message)
        }
    };

    const getProjectData = async () => {
        try {
            setProjectDetail({ ...projectDetail, projectLoading: true });
            setSOWDetail(sowInitial)
            const { data } = await axiosCalls.get(`Account/GetAllProjectResponse?AccountId=${accountId}`);
            const modifiedProject = data.map(d => { return { key: d.projectName, text: d.projectName, value: d.projectId } });
            setProjectDetail({ ...projectDetail, projectList: modifiedProject, projectLoading: false });
        } catch (err) {
            setProjectDetail({ ...projectDetail, projectLoading: false });
            ErrorToast(err.message)
        }
    };

    const getSowData = async () => {
        try {
            setSOWDetail({ sowInitial, sowLoading: true });
            const { data } = await axiosCalls.get(`Account/SowResponse?AccountId=${accountId}&ProjectId=${projectId}`);
            const modifiedSOW = data.map(d => { return { key: d.sowName, text: d.sowName, value: d.sowId } });
            setSOWDetail({ ...sowDetail, sowList: modifiedSOW, sowLoading: false });
        } catch (err) {
            setSOWDetail({ ...sowDetail, sowLoading: false });
            ErrorToast(err.message)
        }
    };

    const getSowResponse = async () => {
        try {
            setSowResponse({ ...sowResData, sowResLoading: true });
            const { data } = await axiosCalls.get(`Account/GetSowById?sowId=${sowId}`);
            const { sowStartDate, sowEndDate } = data;
            setDates({ ...dates, minDate: sowStartDate, maxDate: sowEndDate, calStartDate: sowStartDate, calEndDate: sowEndDate, sowStartDate, sowEndDate });
            setFormData({ ...formData, projectOnBoardingDate: sowStartDate, projectOffBoardingDate: sowEndDate });
            setSowResponse({ ...sowResData, sowResData: data, sowResIsActive: data.isActive, sowResLoading: false });
        } catch (err) {
            setSowResponse({ ...sowResData, sowResLoading: false });
            ErrorToast(err.message)
        }
    };

    const getProjectAllocationData = async () => {
        try {
            setProjectAllocationResponse({ ...projectAllocationResponse, proAlloLoading: true });
            const { data } = await axiosCalls.get(`ProjectAllocation/GetProjectAllocation?managerId=${managerId}&projectId=${projectId}&sowId=${sowId}&accountId=${accountId}`)
            setProjectAllocationResponse({ ...projectAllocationResponse, projectAllocationList: data, proAlloLoading: false });
        } catch (err) {
            setProjectAllocationResponse({ ...projectAllocationResponse, proAlloLoading: false });
            ErrorToast(err.message)
        }
    };

    const getDefaultData = async () => {

        const emps = await axiosCalls.get(`Account/SelectList?Entity=Employee`);
        const contractEmps = await axiosCalls.get(`Account/SelectList?Entity=Contractors`);

        const modifiedEmps = emps.data.map((d) => { return { key: d.value, text: d.label, value: d.value } })
        const modifiedContractEmps = contractEmps.data.map((d) => { return { key: d.value, text: d.label, value: d.value } })

        // Merge both Employee & Contractor And remove Already Allocated Employee from Dropdown
        const bothEmpContractor = arraySort([...modifiedEmps, ...modifiedContractEmps], "text");

        setDefaultData({ ...defaultData, employeeList: bothEmpContractor, filteredEmployee: bothEmpContractor });
    }

    useEffect(() => {
        getManagerData();
    }, []);

    useEffect(() => {
        if (managerId) getAccountData();
    }, [managerId]);

    useEffect(() => {
        if (accountId) getProjectData();
    }, [accountId]);

    useEffect(() => {
        if (projectId) getSowData();
    }, [projectId]);

    useEffect(() => {
        if (sowId) {
            getSowResponse();
            getProjectAllocationData();
        }
    }, [sowId]);

    useEffect(() => {
        if (sowId) getDefaultData();
    }, [projectAllocationList]);

    const deleteProjectAllocation = async ({ projectAllocationsId }) => {
        try {
            const conf = window.confirm("Are You Sure ? You Want To Delete This Resource !");
            if (conf) {
                setProjectAllocationResponse({ ...projectAllocationResponse, proAlloLoading: true });
                await axiosCalls.delete(`ProjectAllocation/DeleteProjectAllocation?ProjectAllocationsId=${projectAllocationsId}`);
                WarningToast('Resource Deleted Successfully !');
                getProjectAllocationData();
            }
        }
        catch (err) {
            getProjectAllocationData();
            ErrorToast(err.message)
        }
    }


    const formDataInitial = {
        formLoading: false,
        employeeName: "",
        employeeId: "",
        designation: "",
        employeeType: "",
        primarySkill: "",
        projectOnBoardingDate: "",
        projectOffBoardingDate: "",
        allocatedBillabilityData: [],
        allocatedUtilizationData: [],
        utilizationStatusData: [],
        allocatedBillability: "",
        allocatedUtilization: "",
        utilizationStatus: "",
        allocatedUtilizationDataCopy: [],
        utilizationStatusDataCopy: [],
        utiDisable: false,
        utiStatusDisable: false,
        sowHourlyRate: "",
        comments: "",
        agreedDailyWorkingHours: ""
    }
    const [formData, setFormData] = useState(formDataInitial);

    const { formLoading, employeeId, projectOnBoardingDate, projectOffBoardingDate,
        allocatedBillabilityData, allocatedUtilizationData, utilizationStatusData, agreedDailyWorkingHours,
        allocatedUtilizationDataCopy, utilizationStatusDataCopy, allocatedBillability, allocatedUtilization,
        utilizationStatus, utiDisable, utiStatusDisable, sowHourlyRate, comments, primarySkill } = formData;

    const checkValidations = () => {
        const checking = Object.assign({}, validationInitial);
        if (allocatedBillability === "") checking.allocatedBillabilityVal = true
        if (allocatedUtilization === "") checking.allocatedUtilizationVal = true
        if (utilizationStatus === "") checking.utilizationStatusVal = true
        if (sowHourlyRate === "") checking.sowHourlyRateVal = true
        setValidations(checking);
        return Object.values(checking).every(a => a === false);
    }

    useEffect(() => {
        checkValidations();
    }, [allocatedBillability, allocatedUtilization, utilizationStatus, sowHourlyRate]);

    const onSubmit = async () => {
        try {
            if (new Date(projectOnBoardingDate) > new Date(projectOffBoardingDate)) {
                return alert("Onboard Date should be less than Offboard Date !");
            }
            const noValidations = checkValidations();
            if (noValidations) {
                if (allocatedBillability > allocatedUtilization) return alert("Allocated Billability Should be Less or Equal To Allocated Utilization");
                if (projectOffBoardingDate < projectOnBoardingDate) return alert("Project OnBoardingDate Should be Less or Equal To Project OffBoardingDate");
                const dataToInsert = {
                    employeeId, projectId, sowId, accountId, managerId,
                    projectOnBoardingDate,
                    projectOffBoardingDate,
                    utilizationStatus,
                    allocatedBillability: String(allocatedBillability),
                    allocatedUtilization: String(allocatedUtilization),
                    sowHourlyRate,
                    comments,
                    billability: 1,
                    isActive: 1,
                    allocationType: null
                }
                let addEditMsg = "Resource Added Successfully."
                let data;
                setFormData({ ...formData, formLoading: true });
                if (isEdit) {
                    dataToInsert.projectAllocationId = editData.projectAllocationsId
                    data = await axiosCalls.post(`ProjectAllocation/UpdateProjectAllocation`, dataToInsert);
                    addEditMsg = "Resource Updated Successfully."
                } else {
                    data = await axiosCalls.post(`ProjectAllocation/InsertProjectAllocation`, dataToInsert);
                }
                setFormData({ ...formData, formLoading: false });
                getProjectAllocationData();
                clickCancel();
                SuccessToast(addEditMsg);
            }
        }
        catch (err) {
            console.log("Error", err)
            ErrorToast(err.message);
        }
    }

    const billabilityChange = (val) => {
        if (val === 0) {
            const a = Array.from(utilizationStatusData).filter(us => us.text !== "Billable");
            setFormData({
                ...formData, allocatedBillabilityData, allocatedUtilizationDataCopy: allocatedUtilizationData, allocatedBillability: 0,
                allocatedUtilization: Math.max(...allocatedUtilizationData.map(g => g.value)),
                utilizationStatusDataCopy: a, utiDisable: false, utiStatusDisable: false, utilizationStatus: ''
            });
        } else {
            if (val === 100) {
                setFormData({
                    ...formData, allocatedUtilization: 100, utilizationStatusDataCopy: utilizationStatusData, allocatedBillability: 100,
                    utilizationStatus: 'Billable', utiDisable: true, utiStatusDisable: true
                });
            } else {
                const greaterValues = Array.from(allocatedUtilizationData).filter(a => a.value >= val);
                setFormData({
                    ...formData, allocatedUtilizationDataCopy: greaterValues, utiDisable: false, allocatedBillability: val,
                    allocatedUtilization: Math.max(...greaterValues.map(g => g.value)),
                    utilizationStatus: 'Billable', utiStatusDisable: true, utilizationStatusDataCopy: utilizationStatusData
                });
            }
        }
    }

    const changeFormData = async (obj) => {
        setFormData({ ...formData, ...obj });
    }

    const reset = () => {
        setBillAndUtiData([]);
        setModalDetail({ ...modalDetail, open: true, allDisable: false, allocatedMessage: "" });
    }

    const getEmployeeDetails = async (empId, edit, dataForEdit, ONBD, OFBD) => {
        try {
            if (new Date(projectOnBoardingDate) > new Date(projectOffBoardingDate)) {
                return alert("Onboard Date should be less than Offboard Date !");
            }
            reset();
            setValidations(validationInitial)
            let sDateToGo = projectOnBoardingDate
            let eDateToGo = projectOffBoardingDate
            if (edit) {
                sDateToGo = ONBD
                eDateToGo = OFBD
            }
            setFormData({
                ...formDataInitial, formLoading: true, employeeId: empId,
                projectOnBoardingDate: sDateToGo,
                projectOffBoardingDate: eDateToGo
            });

            const utilizations = await axiosCalls.get(`Account/SelectList?Entity=utilizationStatus`);
            const modifiedUtilizations = await utilizations.data.map((d) => { return { key: d.value, text: d.label, value: d.label } });

            const { data } = await axiosCalls.get(`ProjectAllocation/GetEmployeeDetail/${empId}`);

            const billAndUtiDataToSend = {
                projectId,
                sowId,
                isEditable: edit,
                employeeId: empId,
                startDate: sDateToGo,
                endDate: eDateToGo,
                allocatedBillability: edit ? dataForEdit.allocatedBillability : 0,
                allocatedUtilization: edit ? dataForEdit.allocatedUtilization : 0,
                projectAllocationsId: edit ? dataForEdit.projectAllocationsId : 0,
            }

            const BillabilityAndUtilization = await axiosCalls.post(`ProjectAllocation/GetBillabilityandUtilization`, billAndUtiDataToSend);
            // const BillabilityAndUtilization = await axiosCalls.get(`ProjectAllocation/GetBillabilityandUtilization?employeeId=${empId}
            // &IsEditable=${edit}&ProjectId=${projectId}&SowId=${sowId}&StartDate=${sDateToGo}&EndDate=${eDateToGo}`);

            const { availableBillability, availableUtilization, invalid } = BillabilityAndUtilization.data[0];

            const avalBill = availableBillability.split(",").map(b => {
                const num = Number(b);
                return { key: num, text: num, value: num }
            });

            const avalUti = availableUtilization.split(",").map(b => {
                const num = Number(b);
                return { key: num, text: num, value: num }
            });

            const filteredData = BillabilityAndUtilization.data.filter(item => {
                const itemStartDate = getFormattedDate2(item.projectOnBoardingDate);
                const itemEndDate = getFormattedDate2(item.projectOffBoardingDate);
                return ((itemStartDate >= sDateToGo && itemEndDate <= eDateToGo) ||
                    (itemStartDate <= eDateToGo && itemEndDate >= sDateToGo))
            });
            setBillAndUtiData(filteredData)

            if (availableUtilization === "0" || invalid) {
                setModalDetail({
                    ...modalDetail,
                    open: true,
                    allDisable: true,
                    allocatedMessage:
                        invalid ? `Resource Is Not Available On Selected Dates !` :
                            `Resource Is Fully Allocated (Please Look Into Below Table For More Info) !`
                })
            }

            setValidations(validationInitial);
            if (edit) {
                setFormData({
                    ...formData,
                    employeeId: empId,
                    projectOnBoardingDate: sDateToGo,
                    projectOffBoardingDate: eDateToGo,
                    formLoading: false,
                    allocatedBillability: +dataForEdit.allocatedBillability,
                    allocatedUtilization: +dataForEdit.allocatedUtilization,
                    utilizationStatus: dataForEdit.utilizationStatus,
                    utiStatusDisable: +dataForEdit.allocatedBillability === 0 ? false : true,
                    comments: dataForEdit.comments,
                    sowHourlyRate: dataForEdit.sowHourlyRate,
                    allocatedBillabilityData: avalBill,
                    allocatedUtilizationData: avalUti,
                    allocatedUtilizationDataCopy: avalUti,
                    utilizationStatusData: +dataForEdit.allocatedBillability === 0 ?
                        modifiedUtilizations.filter(a => a.text !== "Billable") : modifiedUtilizations,
                    utilizationStatusDataCopy: +dataForEdit.allocatedBillability === 0 ?
                        modifiedUtilizations.filter(a => a.text !== "Billable") : modifiedUtilizations,
                    designation: data[0].designation,
                    employeeType: data[0].employeeType,
                    primarySkill: data[0].primarySkill,
                    agreedDailyWorkingHours: data[0].agreedDailyWorkingHours,
                })
            } else {
                setFormData({
                    ...formData,
                    ...data[0],
                    formLoading: false,
                    allocatedBillability: "",
                    allocatedUtilization: "",
                    utilizationStatus: "",
                    allocatedBillabilityData: avalBill,
                    allocatedUtilizationData: avalUti,
                    allocatedUtilizationDataCopy: avalUti,
                    utilizationStatusData: modifiedUtilizations,
                    utilizationStatusDataCopy: modifiedUtilizations
                });
            }
        }
        catch (err) {
            reset();
            setFormData({ ...formDataInitial, formLoading: false, projectOnBoardingDate, projectOffBoardingDate });
            console.log("err", err)
            ErrorToast(err.message)
        }
    }

    useEffect(() => {
        if (employeeId) {
            getEmployeeDetails(employeeId, isEdit ? 1 : 0, editData, calStartDate, projectOffBoardingDate);
        }
    }, [calStartDate])

    useEffect(() => {
        if (employeeId) {
            getEmployeeDetails(employeeId, isEdit ? 1 : 0, editData, projectOnBoardingDate, calEndDate);
        }
    }, [calEndDate])

    const AddEditProjectAllocation = () => {
        return (
            <Modal
                closeIcon
                open={open}
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
                    <Form loading={formLoading} onSubmit={onSubmit}>
                        <Modal.Description>
                            <Form.Group widths={"equal"}>
                                <Form.Field required>
                                    <label>Employee Name</label>
                                    <Dropdown
                                        selectOnBlur={false}
                                        selection
                                        search
                                        name="employeeName"
                                        options={filteredEmployee}
                                        defaultValue={employeeId}
                                        placeholder="Choose Employee"
                                        onChange={(e, { value }) => {
                                            changeFormData({ employeeName: e.target.innerText, employeeId: value });
                                            getEmployeeDetails(value, 0, {});
                                        }}
                                        disabled={isEdit}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Designation</label>
                                    <input
                                        placeholder='Designation'
                                        type="text"
                                        value={formData.designation}
                                        disabled={true}
                                    />
                                </Form.Field>

                                <Form.Field>
                                    <label>Type</label>
                                    <input
                                        placeholder='Type'
                                        type="text"
                                        value={formData.employeeType}
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
                                        value={primarySkill}
                                        disabled={true}
                                    />
                                </Form.Field>

                                <Form.Field required>
                                    <label>Project Onboarding Date</label>
                                    <input
                                        placeholder='Onboarding Date'
                                        type="date"
                                        defaultValue={getFormattedDate2(projectOnBoardingDate)}
                                        onChange={(e) => {
                                            changeFormData({ projectOnBoardingDate: e.target.value })
                                            setDates({ ...dates, calStartDate: e.target.value })
                                        }}
                                        min={getFormattedDate2(minDate)}
                                        max={getFormattedDate2(maxDate)}
                                    />
                                </Form.Field>

                                <Form.Field required>
                                    <label>Project Offboarding Date</label>
                                    <input
                                        placeholder='Offboarding Date'
                                        type="date"
                                        defaultValue={getFormattedDate2(projectOffBoardingDate)}
                                        onChange={(e) => {
                                            changeFormData({ projectOffBoardingDate: e.target.value })
                                            setDates({ ...dates, calEndDate: e.target.value })
                                        }}
                                        min={getFormattedDate2(minDate)}
                                        max={getFormattedDate2(maxDate)}
                                    />
                                </Form.Field>

                            </Form.Group>

                            <Form.Group widths={"equal"}>
                                <Form.Field required>
                                    <label>Allocated Billability</label>
                                    <Dropdown
                                        selectOnBlur={false}
                                        selection
                                        search
                                        name="allocatedBillability"
                                        options={allocatedBillabilityData}
                                        defaultValue={allocatedBillability}
                                        onChange={(e, { value }) => {
                                            billabilityChange(value);
                                        }}
                                        key={allocatedBillability}
                                    />
                                    {validations.allocatedBillabilityVal && <p>Billability is Required !</p>}
                                </Form.Field>

                                <Form.Field required>
                                    <label>Allocated Utilization</label>
                                    <Dropdown
                                        selectOnBlur={false}
                                        selection
                                        search
                                        name="allocatedUtilization"
                                        options={allocatedUtilizationDataCopy}
                                        disabled={utiDisable}
                                        defaultValue={allocatedUtilization}
                                        onChange={(e, { value }) => {
                                            changeFormData({ allocatedUtilization: value })
                                        }}
                                        key={allocatedUtilization}
                                    />
                                    {validations.allocatedUtilizationVal && <p>Utilization is Required !</p>}
                                </Form.Field>

                                <Form.Field required>
                                    <label>Utilization Status</label>
                                    <Dropdown
                                        selectOnBlur={false}
                                        selection
                                        search
                                        name="utilizationStatus"
                                        options={utilizationStatusDataCopy}
                                        disabled={utiStatusDisable}
                                        value={utilizationStatus}
                                        key={utilizationStatus}
                                        onChange={(e, { value }) => {
                                            changeFormData({ utilizationStatus: value })
                                        }}
                                    />
                                    {validations.utilizationStatusVal && <p>Utilization is Required !</p>}
                                </Form.Field>
                            </Form.Group>

                            <Form.Group widths={"equal"}>
                                <Form.Field required>
                                    <label>{`SOW Hourly Rate (USD)`}</label>
                                    <input
                                        name="sowHourlyRate"
                                        placeholder='SOW Hourly Rate'
                                        type="number"
                                        value={sowHourlyRate}
                                        onChange={(e) => {
                                            changeFormData({ sowHourlyRate: e.target.value })
                                        }}
                                        autoComplete={"off"}
                                        disabled={!employeeId}
                                    />
                                    {validations.sowHourlyRateVal && <p>Hourly Rate is Required !</p>}
                                </Form.Field>
                                <Form.Field>
                                    <label>Agreed Hours Per Day</label>
                                    <input
                                        placeholder='Agreed Daily Working Hours'
                                        type="text"
                                        value={agreedDailyWorkingHours}
                                        disabled={true}
                                    />
                                </Form.Field>

                                <Form.Field>
                                    <label>Comments</label>
                                    <input
                                        placeholder='Comment'
                                        type="text"
                                        onChange={(e) => changeFormData({ comments: e.target.value })}
                                        value={comments}
                                        autoComplete={"off"}
                                        maxLength={100}
                                        disabled={!employeeId}
                                    />
                                </Form.Field>

                            </Form.Group>

                        </Modal.Description>

                        <Modal.Actions>
                            <Button onClick={clickCancel}>Cancel</Button>
                            <Button
                                type="submit"
                                content={isEdit ? "Update" : "ADD"}
                                disabled={allDisable || !employeeId}
                                positive
                            />

                            {/* Allocation Table to Show Account, Project, Billability and Utilization */}
                            {
                                billAndUtiData.length > 0 && billAndUtiData[0].allocatedUtilization > 0 &&
                                <div>
                                    <h4 className="mx-10 my-2" style={{ textAlign: 'center' }}>Current Allocation</h4>
                                    <Table celled color="red" size='small'>
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

    const HeadDropdown = (title, loading, options, nameToSet, idToSet, funToSet, restDataToSet) => {
        return (
            <>
                <div className='ui inline m-2' style={{ fontWeight: 500 }}>{title}</div>
                <Dropdown
                    loading={loading}
                    selectOnBlur={false}
                    placeholder={`Choose ${title}`}
                    search
                    selection
                    options={options}
                    onChange={(e, { value }) =>
                        setStateValues({ [nameToSet]: e.target.innerText, [idToSet]: value }, funToSet, restDataToSet)}
                />
            </>
        )
    }

    return (
        <div>

            <MainNavbar />
            <CustomHeader role={"Project Allocation"} />
            <ToastContainer />

            <div className="inline-flex m-2">
                {HeadDropdown("Manager", managerLoading, arraySort(managerList, "text"), "managerName", "managerId", setManagerDetail, managerDetail)}
                {HeadDropdown("Account", accountLoading, arraySort(accountList, "text"), "accountName", "accountId", setAccountDetail, accountDetail)}
                {HeadDropdown("Project", projectLoading, arraySort(projectList, "text"), "projectName", "projectId", setProjectDetail, projectDetail)}
                {HeadDropdown("SOW", sowLoading, sowList, "sowName", "sowId", setSOWDetail, sowDetail)}
            </div>
            <>
                {
                    sowId &&
                    <>
                        <div className="px-10">
                            <SOWResponseComp
                                sowResData={sowResData}
                                loading={sowResLoading}
                                addNewResource={addNewResource}
                            />
                            <Table celled selectable color={"grey"} collapsing>
                                <Table.Header>
                                    <Table.Row>
                                        {allocationHeadings.map((heading, i) => {
                                            return (
                                                <Table.HeaderCell key={i}>{heading}</Table.HeaderCell>
                                            )
                                        })}
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {
                                        proAlloLoading ?
                                            <Table.Cell colSpan={allocationHeadings.length} textAlign='center'>
                                                <div className='mt-10 allCenter'><SpinnerCircular enabled={true} /></div>
                                            </Table.Cell>
                                            :
                                            projectAllocationList.length <= 0 ?
                                                <Table.Cell colSpan={allocationHeadings.length} textAlign='center'>
                                                    <span>No Record Found !</span>
                                                </Table.Cell>
                                                :
                                                projectAllocationList
                                                    // .filter((data) => { return sowResData?.isActive === data?.isActive })
                                                    .sort((b, a) => a.isActive - b.isActive)
                                                    .map((mapData, i) => {
                                                        const { projectOnBoardingDate, projectOffBoardingDate } = mapData;
                                                        mapData.projectOnBoardingDate = getFormattedDate2(projectOnBoardingDate);
                                                        mapData.projectOffBoardingDate = getFormattedDate2(projectOffBoardingDate);
                                                        const dis = !sowResIsActive || !mapData.isActive
                                                        return (
                                                            <Table.Row key={i} negative={dis}>
                                                                <Table.Cell>{i + 1}</Table.Cell>
                                                                {proAllocatCommonKeys.map((k, j) => <Table.Cell key={j}>{mapData[k]}</Table.Cell>)}
                                                                <Table.Cell>
                                                                    <button
                                                                        className="pl-1"
                                                                        onClick={() => {
                                                                            editResource(mapData)
                                                                        }}
                                                                        disabled={dis}
                                                                    >
                                                                        <Icon
                                                                            color='teal'
                                                                            size='large'
                                                                            name='pencil'
                                                                            disabled={dis}
                                                                        />
                                                                    </button>
                                                                    <button
                                                                        className="pl-1"
                                                                        onClick={() => deleteProjectAllocation(mapData)}
                                                                        disabled={dis}
                                                                    >
                                                                        <Icon
                                                                            color='red'
                                                                            size='large'
                                                                            name='remove circle'
                                                                            disabled={dis}
                                                                        />
                                                                    </button>
                                                                </Table.Cell>
                                                            </Table.Row>
                                                        )
                                                    })
                                    }
                                </Table.Body>
                            </Table>
                            {AddEditProjectAllocation()}
                        </div>
                    </>
                }
            </>
        </div>
    )
}

export default ProjectAllocationNew;