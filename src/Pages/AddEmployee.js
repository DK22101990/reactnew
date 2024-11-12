import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Input, Form, Button, Select, Dropdown } from "semantic-ui-react";
import { useForm, Controller } from "react-hook-form";

import MainNavbar from "../components/UI/MainNavbar";
import CustomHeader from "../components/UI/Header";
import { useParams } from "react-router-dom";
import axiosCalls from "../axiosCalls";
import { ErrorToast } from "../components/customHooks/Toast";
import { getFormattedDate } from "../Assests/CommonFunctions";

const options = [
    { key: 'angular', text: 'Angular', value: 'angular' },
    { key: 'css', text: 'CSS', value: 'css' },
    { key: 'design', text: 'Graphic Design', value: 'design' },
    { key: 'ember', text: 'Ember', value: 'ember' },
    { key: 'html', text: 'HTML', value: 'html' },
    { key: 'ia', text: 'Information Architecture', value: 'ia' },
]

function AddEmployee() {
    const { empId } = useParams();
    // const defaultValues = {}
    
    const initialData = {
        formLoading: false,
        empDetail: {}
    }
    const [stateData, setStateData] = useState(initialData);
    const { formLoading, empDetail } = stateData;
    const getDefaultValues = ()=>{
        return empDetail;
    }
    const { register, handleSubmit, formState: { errors }, watch, control, setValue, trigger } = useForm({
        defaultValues: {
            employeeName: "DKM",
            iceCreamType: "lllll"
          }
    });

    const setFieldValues = async () => {
        setStateData({ ...stateData, formLoading: true });
        const { status, data } = await axiosCalls.get(`ProjectAllocation/GetEmployeeDetail/${empId}`);
        console.log(data)
        if (status === 200) {
            setStateData({ ...stateData, empDetail: data[0], formLoading: false });
        } else {
            ErrorToast('Something Went Wrong !')
        }
    }

    const onSubmit = (data) => {
        console.log(data);
        // alert(JSON.stringify({ empDetail, data}));
    }

    useEffect(() => {
        if (empId) {
            setFieldValues();
        }
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
                                placeholder='First Name'
                                type="text"
                                {...register("employeeName", { required: false })}
                                // defaultValue={empDetail && empDetail.employeeName}
                            />
                            {errors.employeeName && <p>First Name is Required !</p>}
                        </Form.Field>
                        <Form.Field required>
                            <label>Last Name</label>
                            <input
                                placeholder='Last Name'
                                type="text"
                                {...register("lastName", { required: false })}
                                // value={empDetail && empDetail.employeeName}
                            />
                            {errors.lastName && <p>Last Name is Required !</p>}
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
                                // value={empDetail && empDetail.email}
                            />
                            {errors.email && <p>Email is Required !</p>}
                        </Form.Field>
                        <Form.Field required>
                            <label>Phone</label>
                            <input
                                placeholder='Phone'
                                type="number"
                                {...register("phoneNumber", { required: false })}
                                // value={empDetail && empDetail.phoneNumber}
                            />
                            {errors.phoneNumber && <p>Phone Number is Required !</p>}
                        </Form.Field>
                    </Form.Group>
                    <Form.Group widths={"equal"}>
                        <Form.Field >
                            <label>Direct Reporting Manager</label>
                            <Controller
                                control={control}
                                name="directReportingManagerName"
                                render={({ field }) => <Form.Select
                                    {...field}
                                    {...register("directReportingManagerName", { required: false })}
                                    options={options}
                                    placeholder="Direct Reporting Manager"
                                    onChange={async (e, { name, value }) => {
                                        setValue(name, value);
                                        await trigger({ name });
                                    }}
                                />}
                            />
                            {(errors.directReportingManagerName && !watch().directReportingManagerName) && <p>Direct Reporting Manager is Required !</p>}
                        </Form.Field>
                        <Form.Field >
                            <label>Indirect Reporting Manager</label>
                            <Controller
                                control={control}
                                name="indirectReportingManager"
                                render={({ field }) => <Form.Select
                                    {...field}
                                    options={options}
                                    {...register("indirectReportingManager", { required: false })}
                                    placeholder="Indirect Reporting Manager"
                                    onChange={async (e, { name, value }) => {
                                        setValue(name, value);
                                        await trigger({ name });
                                    }}
                                />}
                            />
                            {(errors.indirectReportingManager && !watch().indirectReportingManager) && <p>Indirect Reporting Manager is Required !</p>}
                        </Form.Field>
                        <Form.Field>
                            <label>Start Date</label>
                            <input
                                name="startDate"
                                {...register("startDate")}
                                control='input'
                                type="date"
                                // value={empDetail && getFormattedDate(empDetail.startDate) }
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>End Date</label>
                            <input
                                {...register("endDate")}
                                control='input'
                                type="date"
                                name="endDate"
                                // value={empDetail && getFormattedDate(empDetail.endDate) }
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Group widths={"equal"}>
                        <Form.Field >
                            <label>Primary Skill</label>
                            <input
                                placeholder='Primary Skill'
                                type="text"
                                {...register("primarySkill")}
                                // value={empDetail && empDetail.primarySkill}
                            />
                        </Form.Field>
                        <Form.Field >
                            <label>Secondary Skill</label>
                            <input
                                placeholder='Secondary Skill'
                                type="text"
                                {...register("secondarySkill")}
                                // value={empDetail && empDetail.secondarySkill}
                            />
                        </Form.Field>
                        <Form.Field >
                            <label>Project Name</label>
                            <input
                                placeholder='Project Name'
                                type="text"
                                {...register("projectName")}
                                // value={empDetail && empDetail.projectName}
                            />
                        </Form.Field>
                        <Form.Field >
                            <label>Project Utilization Percentage</label>
                            <input
                                placeholder='Project Utilization Percentage'
                                type="text"
                                {...register("projectUtilizationPercentage")}
                                // value={empDetail && empDetail.projectUtilizationPercentage}
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Group widths={"equal"}>
                        <Form.Field >
                            <label>Billability</label>
                            <input
                                placeholder='Billability'
                                type="text"
                                {...register("billability")}
                                // value={empDetail && empDetail.billability}
                            />
                        </Form.Field>
                        <Form.Field >
                            <label>Agreed Daily Working Hours</label>
                            <input
                                placeholder='Agreed Daily Working Hour'
                                type="text"
                                {...register("agreedDailyWorkingHours")}
                                // value={empDetail && empDetail.agreedDailyWorkingHours}
                            />
                        </Form.Field>
                        <Form.Field >
                            <label>Employee Type</label>
                            <Controller
                                control={control}
                                name="employeeType"
                                render={({ field }) => <Form.Select
                                    {...field}
                                    {...register("employeeType", { required: false })}
                                    options={options}
                                    placeholder="Indirect Reporting Manager"
                                    onChange={async (e, { name, value }) => {
                                        setValue(name, value);
                                        await trigger({ name });
                                    }}
                                />}
                            />
                            {(errors.employeeType && !watch().employeeType) && <p>Employee Type is Required !</p>}
                        </Form.Field>
                    </Form.Group>
                    <Form.Group widths={16}>
                        <Form.Field >
                            <Button type="submit" content="Submit" />
                        </Form.Field>
                    </Form.Group>
                </Form>
            </div>
        </>
    );
}

export default AddEmployee;
