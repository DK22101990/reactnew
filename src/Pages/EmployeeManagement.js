import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Icon, Button, Dropdown } from "semantic-ui-react";
import { ToastContainer } from "react-toastify";
import arraySort from "array-sort";

import axiosCalls from "../axiosCalls";
import MainNavbar from "../components/UI/MainNavbar";
import CustomHeader from "../components/UI/Header";
import { ErrorToast, WarningToast } from "../components/customHooks/Toast";
import { getFormattedDate } from "../Assests/CommonFunctions";
import { SpinnerCircular } from "spinners-react";

const EmployeeManagement = () => {
    const headings = [
        "ID", "Name", "Direct Reporting Manager", "Indirect Reporting Manager", "Primary Skill",
        "Secondary Skill", "Department Name", "Agreed Daily Working Hours",
        "Employee Type", "Email", "Phone", "Hire Date", "Exit Date", "Edit/Delete"
    ]

    const initialData = {
        empId: "",
        employeesData: [],
        empDetail: {},
        empDataLoading: false,
        empDetailLoading: false
    }

    const [allData, setAllData] = useState(initialData);
    const { empId, employeesData, empDetail, empDataLoading, empDetailLoading } = allData;

    const getAllEmployees = async () => {
        try {
            setAllData({ ...allData, empDataLoading: true });
            const { data } = await axiosCalls.get(`Account/SelectList?Entity=Employee`);
            const modifiedData = data.map((d) => {
                return { text: d.label, value: d.value, key: d.value }
            })
            setAllData({ ...allData, employeesData: arraySort(modifiedData, "text"), empDataLoading: false });
        } catch (e) {
            setAllData({ ...allData, empDataLoading: false });
            ErrorToast(e.message)
        }
    }

    const getEmployeeDetail = async () => {
        try {
            setAllData({ ...allData, empDetailLoading: true });
            const { status, data } = await axiosCalls.get(`ProjectAllocation/GetEmployeeDetail/${empId}`);
            if (status === 200 && data.length > 0) {
                setAllData({ ...allData, empDetail: data[0], empDetailLoading: false });
            } else {
                setAllData({ ...allData, empDetail: {}, empDetailLoading: false });
                ErrorToast('No Data Found !!');
            }
        } catch (e) {
            console.log("Error",e)
            setAllData({ ...allData, empDetail: {}, empDetailLoading: false });
            ErrorToast(e.message)
        }
    }

    const deleteEmployee = async (employeeId) => {
        const confirm = window.confirm('Sure ! You Want To Delete Employee !!');
        if (confirm) {
            try {
                setAllData({ ...allData, empDetailLoading: true });
                const { status } = await axiosCalls.delete(`ProjectAllocation/DeleteEmployeeDetail?employeeId=${employeeId}`);
                if (status === 204) {
                    setAllData({ ...allData, empDetail: {}, empDetailLoading: false });
                    WarningToast('Employee Deleted Successfully.');
                }
            } catch (e) {
                setAllData({ ...allData, empDetailLoading: false });
                ErrorToast(e.message || "Something Wrong in Delete Employee !!")
            }
        }
    }

    const setEmployeeDetails = (e) => {
        const empName = e.target.textContent;
        const [emp] = employeesData.filter(d => d.text === empName);
        setAllData({ ...allData, empId: emp.value })
    }

    useEffect(() => {
        getAllEmployees();
    }, []);

    useEffect(() => {
        if (empId) {
            getEmployeeDetail();
        }
    }, [empId]);

    return (
        <>
            <MainNavbar />
            <CustomHeader role={"Employee Management"} />
            <ToastContainer />

            <Dropdown
                loading={empDataLoading}
                selection
                search
                options={employeesData}
                placeholder="Choose Employee"
                onChange={setEmployeeDetails}
                className="m-2"
            />

            <Link to="/AddEditEmployee" target="_blank" >
                <Button content="Add New Employee" color="orange" className="m-2" />
            </Link>

            <div className="m-5">
                <Table celled selectable size='small' color={"grey"} >
                    <Table.Header>
                        <Table.Row>
                            {headings.map((heading, i) => <Table.HeaderCell key={i}>{heading}</Table.HeaderCell>)}
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            empDetailLoading ?
                                <Table.Cell colSpan={headings.length} textAlign='center'>
                                    <div className='mt-10 allCenter'> <SpinnerCircular enabled={true} /> </div>
                                </Table.Cell>
                                :
                                Object.keys(empDetail).length > 0 &&
                                <Table.Row>
                                    <Table.Cell>{empDetail.employeeId}</Table.Cell>
                                    <Table.Cell>{empDetail.employeeName}</Table.Cell>
                                    <Table.Cell>{empDetail.directReportingManagerName}</Table.Cell>
                                    <Table.Cell>{empDetail.indirectReportingManagerName}</Table.Cell>
                                    <Table.Cell>{empDetail.primarySkill}</Table.Cell>
                                    <Table.Cell>{empDetail.secondarySkill}</Table.Cell>
                                    {/* <Table.Cell>{empDetail.projectName}</Table.Cell> */}
                                    {/* <Table.Cell>{empDetail.projectUtilizationPercentage}</Table.Cell> */}
                                    <Table.Cell>{empDetail.departmentName}</Table.Cell>
                                    <Table.Cell>{empDetail.agreedDailyWorkingHours}</Table.Cell>
                                    <Table.Cell>{empDetail.employeeType}</Table.Cell>
                                    <Table.Cell>{empDetail.email}</Table.Cell>
                                    <Table.Cell>{empDetail.phoneNumber}</Table.Cell>
                                    <Table.Cell>{getFormattedDate(empDetail.hireDate) || "NA"}</Table.Cell>
                                    <Table.Cell>
                                        {(getFormattedDate(empDetail.exitDate) && getFormattedDate(empDetail.exitDate) != "1900-01-01")
                                         ?  getFormattedDate(empDetail.exitDate) : "NA" }
                                    </Table.Cell>
                                    <Table.Cell>
                                        <button className="pl-1" >
                                            <Link
                                                target="_blank"
                                                to={`/AddEditEmployee/${empDetail.employeeId}`}
                                            >
                                                <Icon
                                                    color='teal'
                                                    size='large'
                                                    name='pencil circle'
                                                />
                                            </Link>
                                        </button>
                                        <button className="pl-1" onClick={() => deleteEmployee(empDetail.employeeId)}>
                                            <Icon
                                                color='red'
                                                size='large'
                                                name='remove circle'
                                            />
                                        </button>
                                    </Table.Cell>
                                </Table.Row>
                        }
                    </Table.Body>
                </Table>
            </div>
        </>
    )
}

export default EmployeeManagement;