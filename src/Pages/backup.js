import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import { Button, Dropdown, Form, Input } from "semantic-ui-react";

import MainNavbar from "../components/UI/MainNavbar";
import CustomHeader from "../components/UI/Header";
import axiosCalls from "../axiosCalls";
import { ErrorToast, SuccessToast } from "../components/customHooks/Toast";

const AddEmployee2 = () => {
    const { empId } = useParams();
    const initialData = {
        empDetail: {},
        formLoading: false,
        employeeTypeList: [],
        departmentList: [],
        directReportingManagerList: [],
        indirectReportingManagerList: []
    }
    const [stateData, setStateData] = useState(initialData);
    const { empDetail, formLoading, employeeTypeList, departmentList,
        directReportingManagerList, indirectReportingManagerList } = stateData;

    const setFieldValues = () => {
        return stateData;
    }

    const { control, handleSubmit, register, formState: { errors }, reset, setValue } = useForm({
        // defaultValues: useMemo(setFieldValues, [stateData])
    });

    const onSubmit = async (data) => {
        const employeeName = `${data.firstname} ${data.lastname}`
        const [empType] = employeeTypeList.filter(d => d.text === data.employeeType);
        const [dept] = departmentList.filter(d => d.text === data.departmentName);
        const [drctReportingManager] = directReportingManagerList.filter(d => d.text === data.directReportingManagerName);
        const [indrctReportingManager] = indirectReportingManagerList.filter(d => d.text === data.indirectReportingManagerName);

        const dataToSend = {
            employeeId: 0,
            employeeName,
            employeeTypeId: empType?.key,
            departmentId: dept?.key,
            directReportingManagerId: drctReportingManager?.key,
            indirectReportingManagerId: indrctReportingManager?.key,
            ...data
        }
        try {
            setStateData({ ...stateData, formLoading: true });
            const { data, status } = await axiosCalls.post(`ProjectAllocation/InsertEmployeeDetail`, dataToSend);
            if (status === 200) {
                SuccessToast(data.message || "Employee Added Successfully..");
                setStateData({ ...stateData, formLoading: false });
                reset();
            }
        } catch (e) {
            setStateData({ ...stateData, formLoading: false });
            ErrorToast(e.message)
        }
    };

    const getDropdownListValue = async () => {
        setStateData({ ...stateData, formLoading: true });
        try {
            const employeetype = await axiosCalls.get(`Account/SelectList?Entity=employeetype`);
            const departments = await axiosCalls.get(`Account/SelectList?Entity=departments`);
            const directMngr = await axiosCalls.get(`Account/SelectList?Entity=reportingmanager`);
            // const indirectMngr = await axiosCalls.get(`Account/SelectList?Entity=reportingmanager`);

            if ((employeetype.status && departments.status && directMngr.status) === 200) {
                const mdata1 = await employeetype.data.map((d) => ({ key: d.value, text: d.label, value: d.label }))
                const mdata2 = await departments.data.map((d) => ({ key: d.value, text: d.label, value: d.label }))
                const mdata3 = await directMngr.data.map((d) => ({ key: d.value, text: d.label, value: d.label }))
                // const mdata4 = await indirectMngr.data.map((d) => ({ key: d.value, text: d.label, value: d.label }))
                setStateData({
                    ...stateData, employeeTypeList: mdata1, formLoading: false,
                    departmentList: mdata2, directReportingManagerList: mdata3, indirectReportingManagerList: mdata3
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


    const getEmployeeDetail = async () => {
        setStateData({ ...stateData, formLoading: true });
        const { status, data } = await axiosCalls.get(`ProjectAllocation/GetEmployeeDetail/${empId}`);
        if (status === 200) {
            setStateData({ ...stateData, empDetail: data[0], formLoading: false });
        } else {
            ErrorToast('Something Went Wrong !')
        }
    }

    useEffect(() => {
        getDropdownListValue();
        if (empId) {
            getEmployeeDetail();
        }
    }, []);
   
    // useEffect(() => {
    //     reset(stateData);
    // }, [stateData]);



    return (
        <>
            <MainNavbar />
            <CustomHeader />
            <ToastContainer />
            <div className="m-10">
                <Form onSubmit={handleSubmit(onSubmit)} loading={formLoading}>
                    <Form.Group widths={"equal"}>

                        <Form.Field required>
                            <label>First Name</label>
                            <input
                                placeholder='firstname'
                                type="text"
                                {...register("firstname", { required: false })}
                                defaultValue=""
                            />
                        </Form.Field>

                        <Form.Field required>
                            <label>Last Name</label>
                            <input
                                placeholder='lastname'
                                type="text"
                                {...register("lastname", { required: false })}
                            />
                        </Form.Field>

                        <Form.Field required>
                            <label>Email</label>
                            <input
                                placeholder='Email'
                                type="email"
                                {...register("email",
                                    {
                                        required: false,
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
                                {...register("phoneNumber", { required: false })}
                            />
                        </Form.Field>
                    </Form.Group>

                    <Form.Group widths={"equal"}>

                        <Form.Field>
                            <label>Direct Reporting Manager</label>
                            <Form.Dropdown
                                selection
                                search
                                {...register("directReportingManagerName", { required: false })}
                                name="directReportingManagerName"
                                options={directReportingManagerList}
                                placeholder="Direct Reporting Manager"
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
                                {...register("indirectReportingManagerName", { required: false })}
                                name="indirectReportingManagerName"
                                options={indirectReportingManagerList}
                                placeholder="Indirect Reporting Manager"
                                onChange={async (e, { name, value, ...d }) => {
                                    setValue(name, value);
                                }}
                            />
                        </Form.Field>

                        <Form.Field>
                            <label>Employee Type</label>
                            <Form.Dropdown
                                selection
                                search
                                {...register("employeeType", { required: false })}
                                name="employeeType"
                                options={employeeTypeList}
                                placeholder="Employee Type"
                                onChange={async (e, { name, value, ...d }) => {
                                    setValue(name, value);
                                    // await triggerValidation({ name });
                                }}
                                error={errors.employeeType ? true : false}
                            />
                        </Form.Field>

                        <Form.Field>
                            <label>Department</label>
                            <Form.Dropdown
                                selection
                                search
                                {...register("departmentName", { required: false })}
                                name="departmentName"
                                options={departmentList}
                                placeholder="Department"
                                onChange={async (e, { name, value, ...d }) => {
                                    setValue(name, value);
                                }}
                            />
                        </Form.Field>
                    </Form.Group>


                    <Form.Group widths={"equal"}>

                        <Form.Field required>
                            <label>Agreed Daily Working Hours</label>
                            <input
                                placeholder='agreedDailyWorkingHours'
                                type="text"
                                {...register("agreedDailyWorkingHours", { required: false })}
                                defaultValue=""
                            />
                        </Form.Field>

                        <Form.Field >
                            <label>Primary Skills</label>
                            <input
                                placeholder='Primary Skills'
                                type="text"
                                {...register("primarySkill", { required: false })}
                            />
                        </Form.Field>

                        <Form.Field >
                            <label>Secondary Skills</label>
                            <input
                                placeholder='Secondary Skills'
                                type="text"
                                {...register("secondarySkill", { required: false })}
                            />
                        </Form.Field>
                    </Form.Group>


                    <Form.Group widths={"equal"}>
                        <Form.Field>
                            <label>Start Date</label>
                            <input
                                name="startDate"
                                {...register("startDate")}
                                control='input'
                                type="date"
                            />
                        </Form.Field>

                        <Form.Field>
                            <label>End Date</label>
                            <input
                                name="endDate"
                                {...register("endDate")}
                                control='input'
                                type="date"
                            />
                        </Form.Field>

                        <Form.Field>
                            <label>Hire Date</label>
                            <input
                                name="hireDate"
                                {...register("hireDate")}
                                control='input'
                                type="date"
                            />
                        </Form.Field>
                    </Form.Group>


                    <Form.Group className="allCenter">
                        <Form.Field>
                            <Button type="submit" content="Submit" positive ></Button>
                        </Form.Field>
                    </Form.Group>
                </Form>
            </div>
        </>
    );
};


export default backup;