import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { Button, Checkbox, Dropdown, Form, Icon, Item, Modal, Pagination, Table } from 'semantic-ui-react'
import axiosCalls from '../axiosCalls'
import Header from '../components/UI/Header'
import MainNavbar from '../components/UI/MainNavbar'
import { ErrorToast, SuccessToast, WarningToast } from "../components/customHooks/Toast";
import arraySort from "array-sort";


//Headings for accounts
const headings = ["No", "Account Name", "Account Description", "Account Manager",
    "Geography", "HeadQuater", "Ceo Name", "Employee Strength", " Yearly Revenue", "Lead Channel", "Is Active", "Edit/Delete"];

const AccountManagement = () => {

    const [accountData, setAccountData] = useState([]);//To store account details from apis
    const [isActiveData, setIsActiveData] = useState([]);//to store data of is Active and converting it to text
    const [managersData, setManagersData] = useState([])//to store data of reporting Managers
    const [leadChannelData, setLeadChannelData] = useState([]) //to store data of Lead Channel
    const [open, setOpen] = useState(false);//to open and close the model
    const [isEdit, setIsEdit] = useState(false);//to edit and add the model
    const [accountDropdown, setaccountDropdown] = useState([])//to store account names for dropdown
    const [showInactiveRow, setShowInactiveRow] = useState(false);
    const [error, setError] = useState(false)
    const [search, setSearch] = useState('');

    // {Pagination Code Start}
    const [tablePagination, setTablePagination] = useState({
        activePage: 0,
        totalPages: 0,
        paginationData: [],
        dataPerPage: 10
    })
    const { activePage, totalPages, paginationData, dataPerPage } = tablePagination;

    const tablePageChange = () => {
        const aa = accountData.slice((activePage - 1) * dataPerPage, activePage * dataPerPage);
        setTablePagination({ ...tablePagination, paginationData: aa });
    }

    useEffect(() => {
        tablePageChange();
    }, [activePage]);

    const paginationFun = () => {
        return (
            <Table.Cell colSpan={headings.length} positive>
                <Pagination
                    activePage={activePage}
                    totalPages={totalPages}
                    onPageChange={(e, { activePage }) => setTablePagination({ ...tablePagination, activePage })}
                />
            </Table.Cell>)
    }
    // {Pagination Code End}

    //initial data of form
    const form = {
        accountName: "",
        accountDescription: "",
        accountManagerId: "",
        accountManager: "",
        geography: "",
        headQuater: "",
        ceoName: "",
        employeeStrength: "",
        yearlyRevenue: "",
        leadChannelTypeId: "",
        leadChannel: "",
        isActiveId: "",
        isActive: "",
        isActiveText: ""

    }
    const [formD, setFormD] = useState(form);
    const { accountName, accountDescription, accountManagerId, accountManager, geography, headQuater, ceoName, employeeStrength,
        yearlyRevenue, leadChannelTypeId, leadChannel, isActiveId, isActive, isActiveText } = formD
    const onChangeData = (name, value) => {
        setFormD({
            ...formD,
            [name]: value
        });
    }

    //Get data of is Active
    const getDefaultData = async () => {
        try {
            const isActives = await axiosCalls.get(`Account/SelectList?Entity=IsActive`);
            const reportingmanagers = await axiosCalls.get(`Account/SelectList?Entity=reportingmanager`);
            const leadChannel1 = await axiosCalls.get(`Account/SelectList?Entity=ChannelType`);

            const modifiedIsActives = await isActives.data.map((d) => { return { key: d.value, text: d.label, value: d.value } });
            const modifiedreportingmanagers = await reportingmanagers.data.map((d) => { return { key: d.value, text: d.label, value: d.value } });
            const modifiedLeadChannel = await leadChannel1.data.map((d) => { return { key: d.value, text: d.label, value: d.value } });

            setIsActiveData(modifiedIsActives)
            setManagersData(modifiedreportingmanagers)
            setLeadChannelData(modifiedLeadChannel)

        } catch (err) {
            ErrorToast(err.message)
        }
    }

    //Function to get account resposne data
    const getAccountsData = async () => {
        try {
            // setDataLoading(true)
            const { data } = await axiosCalls.get(`Account/GetAllAccountResponse`);
            setAccountData(data)
            const modifiedData = data.map((d) => {
                return { text: d.accountName, value: d.accountId, key: d.accountId }
            })
            setaccountDropdown(arraySort(modifiedData, "text"))
            // setDataLoading(false)
        } catch (err) {
            // setDataLoading(false)
            ErrorToast(err.message)
        }
    }


    useEffect(() => {
        getAccountsData()
        getDefaultData()
    }, [])

    // to add new account
    const addNew = () => {
        setIsEdit(false)
        setOpen(true)
        setFormD(form)
        setError(false)
    }

    //Used for cancel button
    const clickCancel = () => {
        getAccountsData()
        setOpen(false)
    }

    const getFilterIds = (fData, text) => {
        const ret = fData.filter(a => a.text === text)
        return ret[0].key
    }

    const editAccount = (acc) => {
        setFormD(acc)
        setOpen(true)
        setIsEdit(true)
    }

    const deleteAccount = async (account) => {
        const conf = await window.confirm("Are You Sure ? You Want To Delete This Account !");
        if (conf) {
            const delProject = await axiosCalls.delete(`Account/DeleteAccountResponse?AccountId=${account.accountId}`);
            getAccountsData()
            WarningToast('Data Deleted Successfully !');
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        if (accountName === "" || accountDescription === "" || accountManager === "" || geography === "" || headQuater === ""
            || ceoName === "" || employeeStrength === "" || yearlyRevenue === "" || leadChannel === "") {
            setError(true)
            return 0
        }
        try {
            const dataToInsert = {
                "accountName": accountName,
                "accountDescription": accountDescription,
                "accountManagerId": getFilterIds(managersData, accountManager),
                "headQuater": headQuater,
                "state": "string",
                "country": "string",
                "phoneNumber": "string",
                "msa": "string",
                "geography": geography,
                "ceoName": ceoName,
                "leadChannelTypeId": getFilterIds(leadChannelData, leadChannel),
                "employeeStrength": employeeStrength,
                "yearlyRevenue": yearlyRevenue,
                "isActive": isActiveText === "Yes" ? 1 : 0,
                "modifiedById": 1045 //1045 
            }
            // console.log("dataToInsert", dataToInsert)
            let message;
            if (isEdit) {
                dataToInsert.accountId = formD.accountId
                const insertUpdateData = await axiosCalls.post(`Account/UpdateAccountResponse`, dataToInsert)
                if (insertUpdateData.status === 200) message = "Data Updated Successfully."
            }
            else {
                const insertUpdateData = await axiosCalls.post(`Account/InsertAccountResponse`, dataToInsert)
                if (insertUpdateData.status === 200) message = "Data Added Successfully."
            }
            setOpen(false)
            SuccessToast(message)
            getAccountsData()

        }
        catch (err) {
            console.log(err.message)
            ErrorToast(err.message)

        }
    }
    //to add and edit Accounts
    const addEditAccounts = () => {
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
                    <span>Add New Account</span>
                    <Button content="x" floated="right" size="small" onClick={() => setOpen(false)} />
                </Modal.Header>
                <Modal.Content>
                    <Form onSubmit={onSubmit}>
                        <Modal.Description>
                            <Form.Group widths={"equal"}>

                                <Form.Field required>
                                    <label>Account Name</label>
                                    <input
                                        placeholder='Account Name'
                                        type="text"
                                        name="accountName"
                                        onChange={(e) => onChangeData(e.target.name, e.target.value)}
                                        autoComplete={"off"}
                                        maxLength={20}
                                        minLength={3}
                                        value={accountName}

                                    />
                                    {error && accountName.length <= 0 ?
                                        <div>
                                            <p>Account Name is Required</p>
                                        </div> : ""
                                    }
                                </Form.Field>

                                <Form.Field required>
                                    <label>Account Description</label>
                                    <input
                                        placeholder='Account Description'
                                        type="text"
                                        name="accountDescription"
                                        onChange={(e) => onChangeData(e.target.name, e.target.value)}
                                        autoComplete={"off"}
                                        value={accountDescription}
                                    />
                                    {error && accountDescription.length <= 0 ?
                                        <div>
                                            <p>Account Description is Required</p>
                                        </div> : ""
                                    }
                                </Form.Field>

                                <Form.Field required>
                                    <label>Account Manager</label>
                                    <Form.Dropdown
                                        selection
                                        search
                                        placeholder='Account Manager'
                                        name="accountManagerId"
                                        options={managersData}
                                        onChange={(e) => {
                                            onChangeData("accountManager", e.target.innerText)
                                        }}
                                        defaultValue={accountManagerId}
                                    />
                                    {error && accountManager.length <= 0 ?
                                        <div>
                                            <p>Account Manager is Required</p>
                                        </div> : ""
                                    }
                                </Form.Field>
                            </Form.Group>

                            <Form.Group widths={"equal"}>
                                <Form.Field required>
                                    <label>Geography</label>
                                    <input
                                        placeholder='Geography'
                                        type="text"
                                        name="geography"
                                        onChange={(e) => onChangeData(e.target.name, e.target.value)}
                                        autoComplete={"off"}
                                        value={geography}
                                    />
                                    {error && geography.length <= 0 ?
                                        <div>
                                            <p>Geography Field is Required</p>
                                        </div> : ""
                                    }
                                </Form.Field>

                                <Form.Field required>
                                    <label>HeadQuater</label>
                                    <input
                                        placeholder='HeadQuater'
                                        type="text"
                                        name="headQuater"
                                        onChange={(e) => onChangeData(e.target.name, e.target.value)}
                                        autoComplete={"off"}
                                        value={headQuater}
                                    />
                                    {error && headQuater.length <= 0 ?
                                        <div>
                                            <p>HeadQuater Field is Required</p>
                                        </div> : ""
                                    }
                                </Form.Field>

                                <Form.Field required>
                                    <label>Ceo Name</label>
                                    <input
                                        placeholder='Ceo Name'
                                        type="text"
                                        name="ceoName"
                                        onChange={(e) => onChangeData(e.target.name, e.target.value)}
                                        autoComplete={"off"}
                                        value={ceoName}
                                    />
                                    {error && ceoName.length <= 0 ?
                                        <div>
                                            <p>Ceo Name Field is Required</p>
                                        </div> : ""
                                    }
                                </Form.Field>
                            </Form.Group>

                            <Form.Group widths={"equal"}>
                                <Form.Field required>
                                    <label>Employee Strength</label>
                                    <input
                                        placeholder='Employee Strength'
                                        type="number"
                                        name="employeeStrength"
                                        onChange={(e) => onChangeData(e.target.name, e.target.value)}
                                        autoComplete={"off"}
                                        value={employeeStrength}
                                    />
                                    {error && employeeStrength.length <= 0 ?
                                        <div>
                                            <p>Employee Strength Field is Required</p>
                                        </div> : ""
                                    }
                                </Form.Field>

                                <Form.Field required>
                                    <label>Yearly Revenue</label>
                                    <input
                                        placeholder='Yearly Revenue'
                                        type="number"
                                        name='yearlyRevenue'
                                        onChange={(e) => onChangeData(e.target.name, e.target.value)}
                                        autoComplete={"off"}
                                        value={yearlyRevenue}
                                    />
                                    {error && yearlyRevenue.length <= 0 ?
                                        <div>
                                            <p>Yearly Revenue Field is Required</p>
                                        </div> : ""
                                    }
                                </Form.Field>
                            </Form.Group>

                            <Form.Group widths={"equal"}>

                                <Form.Field required>
                                    <label>Lead Channel</label>
                                    <Form.Dropdown
                                        selection
                                        search
                                        placeholder='Lead Channel'
                                        name="leadChannelTypeId"
                                        options={leadChannelData}
                                        onChange={(e) => {
                                            onChangeData("leadChannel", e.target.innerText)
                                        }}
                                        defaultValue={leadChannelTypeId}
                                    />
                                    {error && leadChannel.length <= 0 ?
                                        <div>
                                            <p>Lead Channel Field is Required</p>
                                        </div> : ""
                                    }
                                </Form.Field>

                                <Form.Field required>
                                    <label>isActive</label>
                                    <Form.Dropdown
                                        selection
                                        search
                                        name="isActiveText"
                                        options={isActiveData}
                                        disabled={!isEdit}
                                        placeholder={isEdit ? isActiveData : <div style={{ color: 'black' }}>Yes</div>}
                                        onChange={(e) => {
                                            onChangeData("isActiveText", e.target.innerText)
                                        }}
                                        defaultValue={isActive}
                                    />

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
            <Header role={"Manage Account"} />
            <ToastContainer />

            <Button
                className="m-2"
                color="green"
                onClick={addNew}
            >
                Add New Account
            </Button>
            <Checkbox
                label='Show InActive Accounts'
                className="m-2"
                onChange={(e, d) => setShowInactiveRow(d.checked)}
                defaultChecked={showInactiveRow}
            />
            <input
                placeholder='Search Accounts'
                className='mx-2'
                size="50"
                style={{ height: "38px", border: "2px solid black" }}
                onChange={(e) => setSearch(e.target.value)}
            />
            {addEditAccounts()}
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
                            accountData.length <= 0 ?
                                <Table.Cell colSpan={headings.length} textAlign='center'>
                                    <span>No Record Found !</span>
                                </Table.Cell>
                                :
                                <>
                                    {
                                        accountData.filter((account) => {
                                            const formattedAccountName = account.accountName.charAt(0).toUpperCase() + account.accountName.slice(1).toLowerCase();
                                            const formattedSearchQuery = search.charAt(0).toUpperCase() + search.slice(1).toLowerCase();
                                            
                                            return formattedAccountName.includes(formattedSearchQuery);
                                          }).map((account, i) => {
                                            const { accountName, accountDescription, accountManager, geography, headQuater, ceoName,
                                                employeeStrength, yearlyRevenue, leadChannel, isActive, } = account;

                                            //passing the data to return Is Active function
                                            const isActiveText = isActive ? "Yes" : "No"
                                            account.isActiveText = isActiveText

                                            return (
                                                <Table.Row key={i}
                                                    style={{ display: (isActive === 0 && !showInactiveRow) && "none" }}
                                                >
                                                    <Table.Cell>{i+1}</Table.Cell>
                                                    <Table.Cell>{accountName}</Table.Cell>
                                                    <Table.Cell>{accountDescription}</Table.Cell>
                                                    <Table.Cell>{accountManager}</Table.Cell>
                                                    <Table.Cell>{geography}</Table.Cell>
                                                    <Table.Cell>{headQuater}</Table.Cell>
                                                    <Table.Cell>{ceoName}</Table.Cell>
                                                    <Table.Cell>{employeeStrength}</Table.Cell>
                                                    <Table.Cell>{yearlyRevenue}</Table.Cell>
                                                    <Table.Cell>{leadChannel}</Table.Cell>
                                                    <Table.Cell>{isActiveText}</Table.Cell>
                                                    <Table.Cell>
                                                        <button className="pl-1" onClick={() => editAccount(account)} disabled={isActive === 0}>
                                                            <Icon
                                                                color='teal'
                                                                size='large'
                                                                name='pencil'
                                                                disabled={isActive === 0}
                                                            />
                                                        </button>
                                                        <button className="pl-1" onClick={() => deleteAccount(account)} disabled={isActive === 0}>
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
                                </>
                        }
                    </Table.Body>
                </Table>
            </div>

        </>
    )
}

export default AccountManagement
