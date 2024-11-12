import React, { useEffect, useState } from "react";
import { Button, Icon, Popup, Table } from 'semantic-ui-react';
import { ToastContainer } from "react-toastify";
import { SpinnerCircular } from "spinners-react";

import axiosCalls from "../../axiosCalls";
import Dropdown from "./Dropdown";
import useUnsavedChangesWarning from "../customHooks/useUnsavedChangesWarning";
import { ErrorToast, SuccessToast } from "../customHooks/Toast";
import {
    checkFileSize, checkFileType, fetchCommentTypeData,
    fetchComplianceStatusData, FileToBase64, shortName
} from "../../Assests/CommonFunctions";

const DeliveryTable = (props) => {
    const [loading, setLoading] = useState(false);
    const [QuesLoading, setQuesLoading] = useState(false);
    const [routerPrompt, onDirty, onPristine] = useUnsavedChangesWarning();
    const { headings, dataToSendAPI } = props;
    const { complianceId, projectId, accountId, sowId, stageId } = dataToSendAPI;
    const [originalData, setOriginalData] = useState([]);
    const [modifiedData, setModifiedData] = useState([]);
    const [complianceStatusData, setComplianceStatusData] = useState([]);
    const [commentTypeData, setCommentTypeData] = useState([]);

    const getQuestions = async () => {
        setModifiedData([]);
        setQuesLoading(true)
        const { data } = await axiosCalls.get(`Account/GetProjectKickStartQuestions?ComplianceTypeId=${complianceId}&ProjectId=${projectId}&AccountId=${accountId}&SowId=${sowId}&StageId=${stageId}`);
        data.map((d, i) => {
            d["queNo"] = i + 1;
            d["uniqueKey"] = i;
            return d
        })
        setOriginalData(data);
        setModifiedData(data);
        setQuesLoading(false);
    }

    const setValuesToKeys = async (e, index, key) => {
        // onDirty()
        onPristine();
        let temp_state = [...modifiedData];
        let temp_element = { ...temp_state[index] };
        let value;

        if (key === "file" && e.target.files[0]) {
            const checking1 = await checkFileType(e.target.files[0].name);
            const checking2 = await checkFileSize(e.target.files[0].size);
            if (checking1 && checking2) {
                const { name, size, webkitRelativePath } = e.target.files[0];
                temp_element[key] = await FileToBase64(e.target.files[0]);
                temp_element["fileName"] = name;
                temp_element["fileSize"] = size;
                temp_element["filePath"] = webkitRelativePath;
                temp_element["displayName"] = name;
                temp_element["isUploaded"] = true;
                temp_element["changed"] = true;
            }
        }

        if (key === "comments") {
            value = e.target.value
            temp_element.file ? temp_element["isUploaded"] = true : temp_element["isUploaded"] = false
            temp_element[key] = await value;
            temp_element["changed"] = originalData[index].comments != value;
        }

        if (key === "complianceStatus") {
            let temp_value;
            complianceStatusData.filter(d => {
                if (d.option == e.target.innerText) {
                    return temp_value = d.value
                }
            });
            if (temp_value === 2802 || temp_value === 2804) { // 2802 - "Not Applicable" & 2804 - "No"
                temp_element["comments"] = "";
                temp_element["commentsTypeId"] = 3006; // 3006 Not Applicable
                temp_element["file"] = "";
                temp_element["fileName"] = "";
                temp_element["fileSize"] = "";
                temp_element["filePath"] = "";
                temp_element["isUploaded"] = false;
                temp_element["uniqueKey"] = Math.random();
            } else {
                temp_element["commentsTypeId"] = originalData[index].commentsTypeId || 3006;
            }
            temp_element["complianceStatusId"] = temp_value;
            temp_element["changed"] = originalData[index].complianceStatusId != temp_value;
        }

        if (key === "commentType") {
            let temp_value;
            commentTypeData.filter(d => {
                if (d.option == e.target.innerText) {
                    return temp_value = d.value
                }
            });
            if (temp_value === 3005 || temp_value === 3006 || temp_value === 3007) {
                // 3005 - "Added to PMS Tool" & 3006 - "Not Applicable" & 3007 - "Shared The Drive Link"
                temp_element["comments"] = temp_value === 3007 ? temp_element.comments : "";
                temp_element["commentsTypeId"] = 3006; //Not Applicable
                temp_element["file"] = "";
                temp_element["fileName"] = "";
                temp_element["fileSize"] = "";
                temp_element["filePath"] = "";
                temp_element["isUploaded"] = false;
                temp_element["uniqueKey"] = Math.random();
            }
            if (temp_value === 3008) { // 3008 - "Provided an attachment"
                temp_element["comments"] = "";
            }
            temp_element["commentsTypeId"] = temp_value;
            temp_element["changed"] = originalData[index].commentsTypeId != temp_value;
        }
        temp_state[index] = await temp_element;
        if (temp_state.some(d => d.changed === true)) onDirty();
        setModifiedData(temp_state);
    }

    const checkDataValidations = (onlyChangedData) => {
        let message = "Please Add URL or File for Question - ";
        let alertArray = [];
        onlyChangedData.forEach((d, i) => {
            if (d.commentsTypeId === 3007 && !d.comments) {
                alertArray.push(d.queNo)
            }
            if (d.commentsTypeId === 3008 && !d.file) {
                alertArray.push(d.queNo)
            }
        })
        if (alertArray.length > 0) {
            alert(`${message} ${alertArray.join()}`)
            return false;
        } else {
            return true;
        }
    }

    const submitData = async () => {
        const onlyChangedData = modifiedData.filter(a => a.changed === true);
        const valid = await checkDataValidations(onlyChangedData);
        if (valid) {
            onlyChangedData.forEach(async (changedData, i) => {
                setLoading(true);
                const mergedData = { ...dataToSendAPI, ...changedData };
                const sendThisData = {
                    "accountId": mergedData.accountId,
                    "projectId": mergedData.projectId,
                    "sowId": mergedData.sowId,
                    "stageId": mergedData.stageId,
                    "complianceTypeId": mergedData.complianceId,
                    "questionId": mergedData.questionId,
                    "complianceStatusId": mergedData.complianceStatusId,
                    "comments": mergedData.comments,
                    "commentsTypeId": mergedData.commentsTypeId,
                    "file": mergedData.file,
                    "fileName": mergedData.fileName,
                    "filePath": mergedData.filePath,
                    "fileSize": mergedData.fileSize && mergedData.fileSize.toString(),
                    "displayName": mergedData.displayName,
                    "isUploaded": mergedData.file ? true : false,
                    "artefactId": mergedData.artefactId ? mergedData.artefactId : 0
                }

                try {
                    const { data } = await axiosCalls.post('Account/SaveSowQuestionResponse', sendThisData);
                    if (data.status) {
                        SuccessToast(data.message)
                        if (onlyChangedData.length === i + 1) {
                            getQuestions();
                            setLoading(false);
                            onPristine();
                        }
                    } else {
                        alert("Failed !!! " + data.message);
                        getQuestions();
                    }
                } catch (e) {
                    ErrorToast(`Something Wrong ! ${e.message}`)
                    getQuestions();
                    setLoading(false);
                    onPristine();
                }
            })
        }
    }

    const deleteFile = async (artefactIdToDelete) => {
        const result = await window.confirm("Are You Sure ? You Want To Delete File !");
        if (result) {
            setLoading(true)
            const data = await axiosCalls.delete(`Account/DeleteSowQuestionResponse?ArtefactId=${artefactIdToDelete}`);
            if (data.status === 204) {
                ErrorToast("File Deleted Successfully")
                getQuestions();
                setLoading(false);
            }
        }
    }

    const downloadFile = async (artefactIdToDownload) => {
        setLoading(true)
        const { data } = await axiosCalls.get(`Account/DownloadArtefact?ArtefactId=${artefactIdToDownload}`);
        const fileName = data.displayName;
        const fileExtension = fileName.split(".");
        const linkSource = `data:application/${fileExtension[1]};base64,${data.file}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
        setLoading(false)
    }

    const getComplianceStatusOption = (complianceStatusId) =>
        complianceStatusData.map((dd) => {
            if (complianceStatusId === dd.value) {
                return dd.option
            }
        });

    const getComplianceStatusValue = (complianceStatusId) =>
        complianceStatusData.map((dd) => {
            if (complianceStatusId === dd.value) {
                return dd.value
            }
        });

    const getCommentTypeOption = (commentsTypeId) =>
        commentTypeData.map((dd) => {
            if (commentsTypeId === dd.value) {
                return dd.option
            }
        });

    const getCommentTypeValue = (commentsTypeId) =>
        commentTypeData.map((dd) => {
            if (commentsTypeId === dd.value) {
                return dd.value
            }
        });

    useEffect(() => {
        if (complianceId && projectId && accountId && sowId && stageId) {
            fetchComplianceStatusData(setComplianceStatusData)
            fetchCommentTypeData(setCommentTypeData)
            getQuestions();
        }
    }, [complianceId, projectId, accountId, sowId, stageId]);

    return (
        <>
            {routerPrompt}
            <ToastContainer />
            {
                loading
                    ?
                    <div className='mt-10 allCenter'>
                        <SpinnerCircular
                            enabled={true}
                        />
                    </div>
                    :
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                {
                                    headings.map((heading, i) => {
                                        return (
                                            <Table.HeaderCell key={i}>{heading}</Table.HeaderCell>
                                        )
                                    })
                                }
                            </Table.Row>
                            <Table.Row>
                                {
                                    QuesLoading ?
                                        <Table.HeaderCell colSpan="6" textAlign='center'>
                                            <div className='mt-10 allCenter'>
                                                <SpinnerCircular
                                                    enabled={true}
                                                />
                                            </div>
                                        </Table.HeaderCell>
                                        :

                                        <Table.HeaderCell colSpan="6" textAlign='right'>
                                            <Button
                                                positive
                                                size='tiny'
                                                disabled={!modifiedData.some(d => d.changed === true)}
                                                onClick={() => submitData()}
                                            >
                                                SAVE
                                            </Button>
                                        </Table.HeaderCell>
                                }
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {
                                modifiedData.map((d, i) => {
                                    return (
                                        <Table.Row key={i} collapsing={+true}>
                                            <Table.Cell>{i + 1}</Table.Cell>
                                            <Table.Cell>{d.questions}</Table.Cell>
                                            <Table.Cell onClick={(e) => setValuesToKeys(e, i, "complianceStatus")}>
                                                <Dropdown
                                                    data={complianceStatusData}
                                                    option={getComplianceStatusOption(d.complianceStatusId)}
                                                    value={getComplianceStatusValue(d.complianceStatusId)}
                                                />
                                            </Table.Cell>
                                            <Table.Cell
                                                onClick={(e) => setValuesToKeys(e, i, "commentType")}
                                                disabled={d.complianceStatusId === 2801 ? false : true} //2801 is Status 'Yes'
                                            >
                                                <Dropdown
                                                    data={commentTypeData}
                                                    option={getCommentTypeOption(d.commentsTypeId ? d.commentsTypeId : 3006)}
                                                    // 3006 for Not Applicable
                                                    value={getCommentTypeValue(d.commentsTypeId ? d.commentsTypeId : 3006)}
                                                />
                                            </Table.Cell>

                                            <Table.Cell onChange={(e) => { setValuesToKeys(e, i, "comments") }} >
                                                <input
                                                    style={{ paddingLeft: "50px", paddingRight: "50px" }}
                                                    defaultValue={d.comments}
                                                    className="input is-primary is-normal changePlaceholder"
                                                    type="text"
                                                    placeholder="Add URL"
                                                    disabled={d.commentsTypeId === 3007 && d.complianceStatusId === 2801 ? false : true}
                                                // 3007 "for Shared the Drive Link"
                                                />
                                            </Table.Cell>

                                            <Table.Cell>
                                                <span style={{ display: "inline-flex" }} className="mt-2">
                                                    {
                                                        !d.artefactId
                                                            ?
                                                            <button>
                                                                <input
                                                                    key={d.uniqueKey}
                                                                    type="file"
                                                                    id="inputFile"
                                                                    style={{ display: "hidden" }}
                                                                    onChange={(e) => setValuesToKeys(e, i, "file", d.questionId)}
                                                                    disabled={d.commentsTypeId === 3008 ? false : true}
                                                                // 3008 for "Provided an attachment"
                                                                />
                                                            </button>
                                                            :
                                                            <>
                                                                <Popup
                                                                    content={d.displayName}
                                                                    trigger={<h6>{shortName(d.displayName)}</h6>}
                                                                    position='top left'
                                                                    size='mini'
                                                                />

                                                                <button className="pl-1">
                                                                    <Icon
                                                                        color='red'
                                                                        size='large'
                                                                        name='remove circle'
                                                                        onClick={() => deleteFile(d.artefactId)}
                                                                    />
                                                                </button>

                                                                <button className="pl-1">
                                                                    <Icon
                                                                        color='teal'
                                                                        size='large'
                                                                        name='arrow alternate circle down'
                                                                        onClick={() => downloadFile(d.artefactId)}
                                                                    />
                                                                </button>
                                                            </>
                                                    }
                                                </span>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                })
                            }
                        </Table.Body>
                    </Table>
            }
        </>
    )
}
export default DeliveryTable;