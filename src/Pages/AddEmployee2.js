import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import { Button, Dropdown, Form, Input } from "semantic-ui-react";

import MainNavbar from "../components/UI/MainNavbar";
import CustomHeader from "../components/UI/Header";
import axiosCalls from "../axiosCalls";
import { ErrorToast, SuccessToast } from "../components/customHooks/Toast";
import { getFormattedDate, getFormattedDate2 } from "../Assests/CommonFunctions";

const AddEmployee2 = () => {
    const { empId } = useParams();
    const initialData = {
        empDetail: {},
        formLoading: false,
        employeeTypeList: [],
        departmentList: [],
        directReportingManagerList: [],
        indirectReportingManagerList: [],
        skills: [],
        key: 1
    }
    const [stateData, setStateData] = useState(initialData);
    const { empDetail, formLoading, employeeTypeList, departmentList,
        directReportingManagerList, indirectReportingManagerList, skills, key } = stateData;

    const { control, handleSubmit, register, formState: { errors }, reset, setValue, watch } = useForm({
        mode: "onSubmit"
    });

    const getDropdownListValue = async () => {
        setStateData({ ...stateData, formLoading: true });
        try {
            const employeetype = await axiosCalls.get(`Account/SelectList?Entity=employeetype`);
            const departments = await axiosCalls.get(`Account/SelectList?Entity=departments`);
            const managers = await axiosCalls.get(`Account/SelectList?Entity=reportingmanager`);
            const skills = await axiosCalls.get(`Account/SelectList?Entity=skills`);

            if ((employeetype.status && departments.status && managers.status) === 200) {
                const mdata1 = await employeetype.data.map((d) => ({ key: d.value, text: d.label, value: d.label }))
                const mdata2 = await departments.data.map((d) => ({ key: d.value, text: d.label, value: d.label }))
                const mdata3 = await managers.data.map((d) => ({ key: d.value, text: d.label, value: d.label }))
                const mdata4 = await skills.data.map((d) => ({ key: d.value, text: d.label, value: d.label }))

                let emp = {}
                if (empId) {
                    const { status, data } = await axiosCalls.get(`ProjectAllocation/GetEmployeeDetail/${empId}`);
                    emp = data[0]
                    reset(emp)
                    setValue('hireDate', getFormattedDate2(emp.hireDate));
                    const exitDate = getFormattedDate(emp.exitDate);
                    if(exitDate === "1900-01-01") setValue('exitDate', null);
                    else setValue('exitDate', exitDate);
                }
                setStateData({
                    ...stateData, employeeTypeList: mdata1, formLoading: false,
                    departmentList: mdata2, directReportingManagerList: mdata3, indirectReportingManagerList: mdata3,
                    empDetail: emp, skills: mdata4, key: key + 1
                });
            } else {
                setStateData({ ...stateData, formLoading: false });
                ErrorToast('Something Went Wrong in Employee List !')
            }
        } catch (e) {
            setStateData({ ...stateData, formLoading: false });
            ErrorToast(e.message)
        }
    }

    const getSkillIds = async (data) => {
        if (typeof (data) === "string") data = data.split(",");
        let a = []
        skills?.map((s) => { data?.map((p) => { if (p === s.text) a.push(s.key) }) })
        return a.join(",");
    }

    const onSubmit = async (formData) => {
        formData.primarySkill = await getSkillIds(formData?.primarySkill)
        formData.secondarySkill = await getSkillIds(formData?.secondarySkill)
        const employeeName = `${formData.firstname} ${formData.lastname}`
        const [empType] = employeeTypeList.filter(d => d.text === formData.employeeType);
        const [dept] = departmentList.filter(d => d.text === formData.departmentName);
        const [drctReportingManager] = directReportingManagerList.filter(d => d.text === formData.directReportingManagerName);
        const [indrctReportingManager] = indirectReportingManagerList.filter(d => d.text === formData.indirectReportingManagerName);
        if(formData.exitDate === ""){
            formData.exitDate = null 
        }
        const dataToSend = {
            employeeId: empId || 0,
            employeeName,
            employeeTypeId: empType?.key,
            departmentId: dept?.key,
            directReportingManagerId: drctReportingManager?.key,
            indirectReportingManagerId: indrctReportingManager?.key,
        }

        try {
            setStateData({ ...stateData, formLoading: true });
            let data;
            if (empId) {
                data = await axiosCalls.post(`ProjectAllocation/UpdateEmployeeDetail`, { ...formData, ...dataToSend });
                if (data.status === 200) {
                    SuccessToast(data.message || "Employee Updated Successfully..");
                    setStateData({ ...stateData, formLoading: false });
                    getDropdownListValue();
                }
            } else {
                data = await axiosCalls.post(`ProjectAllocation/InsertEmployeeDetail`, { ...formData, ...dataToSend });
                if (data.status === 200) {
                    SuccessToast(data.message || "Employee Added Successfully..");
                    setStateData({ ...stateData, formLoading: false });
                    reset();
                }
            }
        } catch (e) {
            setStateData({ ...stateData, formLoading: false });
            ErrorToast(e.message)
        }
    };


    useEffect(() => {
        getDropdownListValue();
    }, []);

    return (
        <>
            <MainNavbar />
            <CustomHeader role={"Employee Management"} />
            <ToastContainer />

            <div className="m-10">
                <Form onSubmit={handleSubmit(onSubmit)} loading={formLoading}>
                    <Form.Group widths={"equal"}>

                        <Form.Field required>
                            <label>First Name</label>
                            <input
                                placeholder='firstname'
                                type="text"
                                {...register("firstname", { required: true })}
                            />
                            {errors.firstname && <p>First Name is Required !</p>}
                        </Form.Field>

                        <Form.Field required>
                            <label>Last Name</label>
                            <input
                                placeholder='lastname'
                                type="text"
                                {...register("lastname", { required: true })}
                            />
                            {errors.lastname && <p>Last Name is Required !</p>}
                        </Form.Field>

                        <Form.Field required>
                            <label>Email</label>
                            <input
                                placeholder='Email'
                                type="email"
                                {...register("email",
                                    {
                                        required: true,
                                        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                    })}
                            />
                            {errors.email && <p>Email is Required !</p>}
                        </Form.Field>

                        <Form.Field required>
                            <label>Phone Number</label>
                            <input
                                placeholder='phoneNumber'
                                type="text"
                                {...register("phoneNumber", { required: true })}
                            />
                            {errors.phoneNumber && <p>Phone is Required !</p>}
                        </Form.Field>
                    </Form.Group>

                    <Form.Group widths={"equal"}>

                        <Form.Field>
                            <label>Direct Reporting Manager</label>
                            <Form.Dropdown
                                selection
                                search
                                key={key}
                                {...register("directReportingManagerName", { required: false })}
                                defaultValue={empDetail.directReportingManagerName}
                                name="directReportingManagerName"
                                options={directReportingManagerList}
                                placeholder={"Direct Reporting Manager."}
                                // placeholder={empDetail ?
                                //     <span style={{ color: "black" }}>{empDetail.directReportingManagerName}</span>
                                //     : "Direct Reporting Manager"}
                                onChange={async (e, { name, value, ...d }) => {
                                    setValue(name, value);
                                }}
                            />
                        </Form.Field>

                        <Form.Field>
                            <label>Indirect Reporting Manager</label>
                            <Form.Dropdown
                                selection
                                search
                                key={key}
                                {...register("indirectReportingManagerName", { required: false })}
                                defaultValue={empDetail.indirectReportingManagerName}
                                name="indirectReportingManagerName"
                                options={indirectReportingManagerList}
                                // placeholder={empDetail ? <span style={{ color: "black" }}> {empDetail.indirectReportingManagerName}</span>
                                //     : "Indirect Reporting Manager"}
                                onChange={async (e, { name, value, ...d }) => {
                                    setValue(name, value);
                                }}
                            />
                        </Form.Field>

                        <Form.Field required>
                            <label>Employee Type</label>
                            <Form.Dropdown
                                selection
                                search
                                {...register("employeeType", { required: true })}
                                name="employeeType"
                                options={employeeTypeList}
                                placeholder={empDetail ? <span style={{ color: "black" }}>{empDetail.employeeType}</span> : "Employee Type"}
                                onChange={async (e, { name, value, ...d }) => {
                                    setValue(name, value);
                                    // await triggerValidation({ name });
                                }}
                            // error={errors.employeeType ? true : false}
                            />
                            {(errors.employeeType && !watch().employeeType) && <p>Employee Type is Required !</p>}
                        </Form.Field>

                        <Form.Field required>
                            <label>Department</label>
                            <Form.Dropdown
                                selection
                                search
                                {...register("departmentName", { required: true })}
                                name="departmentName"
                                options={departmentList}
                                placeholder={empDetail ? <span style={{ color: "black" }}>{empDetail.departmentName} </span> : "Department"}
                                onChange={async (e, { name, value, ...d }) => {
                                    setValue(name, value);
                                }}
                            />
                            {(errors.departmentName && !watch().departmentName) && <p>Department Name is Required !</p>}
                        </Form.Field>
                    </Form.Group>


                    <Form.Group widths={"equal"}>

                        <Form.Field >
                            <label>Agreed Daily Working Hours</label>
                            <input
                                placeholder='agreedDailyWorkingHours'
                                type="text"
                                {...register("agreedDailyWorkingHours", { required: false })}
                            />
                        </Form.Field>

                        <Form.Field required>
                            <label>Primary Skills</label>
                            <Form.Dropdown
                                key={key}
                                selection
                                search
                                multiple
                                {...register("primarySkill", { required: true })}
                                placeholder='Primary Skills'
                                options={skills}
                                onChange={async (e, { name, value, ...d }) => { setValue(name, value) }}
                                defaultValue={empDetail?.primarySkill?.split(",")}
                            />
                            {(errors.primarySkill && !watch().primarySkill) && <p>Primary Skill is Required !</p>}
                        </Form.Field>

                        <Form.Field required>
                            <label>Secondary Skills</label>
                            <Form.Dropdown
                                key={key}
                                selection
                                search
                                multiple
                                {...register("secondarySkill", { required: true })}
                                placeholder='Secondary Skills'
                                options={skills}
                                onChange={async (e, { name, value, ...d }) => { setValue(name, value) }}
                                defaultValue={empDetail?.secondarySkill?.split(",")}
                            />
                            {(errors.secondarySkill && !watch().secondarySkill) && <p>Secondary Skill is Required !</p>}
                        </Form.Field>
                    </Form.Group>

                    <Form.Group widths={"equal"}>
                        <Form.Field>
                            <label>Hire Date</label>
                            <input
                                name="hireDate"
                                {...register("hireDate", { required: true })}
                                control='input'
                                type="date"
                            />
                            {errors.hireDate && <p>Hire Date is Required !</p>}
                        </Form.Field>
                        <Form.Field>
                            <label>Exit Date</label>
                            <input
                                name="exitDate"
                                {...register("exitDate")}
                                control='input'
                                type="date"
                            />
                        </Form.Field>

                    </Form.Group>
                    <Form.Group className="allCenter">
                        <Form.Field>
                            <Button type="submit" content={empId ? "Update Employee" : "Add Employee"} positive />
                        </Form.Field>
                    </Form.Group>
                </Form>
            </div>
        </>
    );
};


export default AddEmployee2;