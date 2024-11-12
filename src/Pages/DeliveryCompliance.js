import React, { useEffect, useState } from 'react';
import { SpinnerDotted } from 'spinners-react';
import arraySort from 'array-sort';
import axios from "../axiosCalls";
import Header from '../components/UI/Header';
import MainNavbar from '../components/UI/MainNavbar';
import DeliveryTable from '../components/UI/DeliveryTable';
import Dropdown3 from '../components/UI/Dropdown3';

function DeliveryCompliance() {
  const headings = ["", "Question", "Status", "Comment Type", "Add URL", "Upload File"];
  const [loading, setLoading] = useState(false)
  const [dataToSendAPI, setDataToSendAPI] = useState({});
  const [saveBtnDisable, setSaveBtnDisable] = useState(true);

  const [stageName, setStageName] = useState("Choose Stage");
  const [stageId, setStageId] = useState("");
  const [stageData, setStageData] = useState([]);

  const [complianceName, setComplianceName] = useState("Choose Compliance");
  const [complianceId, setComplianceId] = useState("");
  const [complianceData, setComplianceData] = useState([]);

  const [accountName, setAccountName] = useState("Choose Account");
  const [accountId, setAccountId] = useState("");
  const [accountData, setAccountData] = useState([]);

  const [projectName, setProjectName] = useState("Choose Project");
  const [projectId, setProjectId] = useState("");
  const [projectData, setProjectData] = useState([]);

  const [sowName, setSOWName] = useState("Choose SOW");
  const [sowId, setSOWId] = useState("");
  const [sowData, setSOWData] = useState([]);


  const getStageData = async () => {
    setLoading(true)
    const { data } = await axios.get('Account/GetAllStageList');
    const modifiedData = data.map((d) => { return { option: d.stageName, value: d.stageId } });
    const exceptAgile = modifiedData.filter(d => d.value !== 2603) // 2603 is Agile stageId

    const selectedData = await exceptAgile.filter((d) => {
      return d.option.toUpperCase().trim() === localStorage.getItem('stage')?.toUpperCase()
    });
    if (selectedData.length > 0) {
      setStageId(selectedData[0].value)
      setStageName(selectedData[0].option);
      setStageData(selectedData)
    } else {
      setStageData(exceptAgile)
    }
    setLoading(false)
  }

  const getComplianceData = async () => {
    setLoading(true)
    const { data } = await axios.get(`Account/GetAllComplianceTypes?StageId=${stageId}`);
    const modifiedData = data.map((d) => { return { option: d.complianceTypeName, value: d.complianceTypeId } });

    const selectedData = await modifiedData.filter((d) => {
      return d.option.toUpperCase() === localStorage.getItem('complianceType')?.toUpperCase()
    });

    if (selectedData.length > 0) {
      setComplianceId(selectedData[0].value)
      setComplianceName(selectedData[0].option);
      setComplianceData(selectedData)
    } else {
      localStorage.setItem('complianceType', modifiedData[0].option)
      setComplianceId(modifiedData[0].value)
      setComplianceName(modifiedData[0].option);
      setComplianceData(modifiedData)
    }

    setLoading(false)
  }

  const getAccountData = async () => {
    setLoading(true)
    const { data } = await axios.get('Account/GetAllAccounts');
    const modifiedData = data.map((d) => { return { option: d.accountName, value: d.accountId } });
    setAccountData(modifiedData)
    setLoading(false)
  }

  const getProjectData = async () => {
    setLoading(true)
    const { data } = await axios.get(`Account/GetAllProjectResponse?AccountId=${accountId}`);
    const modifiedData = data.map((d) => { return { option: d.projectName, value: d.projectId } })
    setProjectData(modifiedData)
    setLoading(false)
  }

  const getSOWData = async () => {
    setLoading(true)
    const { data } = await axios.get(`Account/SowResponse?accountId=${accountId}&projectId=${projectId}`);
    const modifiedData = data.map((d) => { return { option: d.sowName, value: d.sowId } })
    setSOWData(modifiedData)
    setLoading(false)
  }


  useEffect(() => {
    setSOWName("Choose SOW")
    if (projectId) getSOWData();
  }, [projectId]);

  useEffect(() => {
    setProjectName("Choose Project")
    setSOWName("Choose SOW")
    setProjectId("")
    setSOWId("")
    if (accountId) getProjectData();
  }, [accountId]);

  useEffect(() => {
    getAccountData();
  }, [])

  useEffect(() => {
    setComplianceName("Choose Compliance")
    getStageData();
    if (stageId) {
      getComplianceData();
    }
  }, [stageId]);

  useEffect(() => {
    if (stageId && complianceId) {
      setSaveBtnDisable(false)
    }
    setDataToSendAPI({
      accountId: accountId,
      projectId: projectId,
      sowId: sowId,
      stageId: stageId,
      complianceId: complianceId,
    })
  }, [accountId, projectId, sowId, stageId, complianceId]);

  return (
    <>
      <MainNavbar />
      <Header role={complianceName} />
      <div className='inline-flex'>
        <Dropdown3
          title={"Stages"}
          data={stageData}
          option={stageName}
          value={stageId}
          setOption={setStageName}
          setValue={setStageId}
          disabled={true}
        />

        <Dropdown3
          title={"Compliance Type"}
          data={complianceData}
          option={complianceName}
          value={complianceId}
          setOption={setComplianceName}
          setValue={setComplianceId}
          disabled={true}
        />

        <Dropdown3
          title={"Account"}
          data={arraySort(accountData, "option")}
          option={accountName}
          value={accountId}
          setOption={setAccountName}
          setValue={setAccountId}
        />
        <Dropdown3
          title={"Project"}
          data={arraySort(projectData, "option")}
          option={projectName}
          value={projectId}
          setOption={setProjectName}
          setValue={setProjectId}
        />
        <Dropdown3
          title={"SOW"}
          data={arraySort(sowData, "option")}
          option={sowName}
          value={sowId}
          setOption={setSOWName}
          setValue={setSOWId}
        />
      </div>

      {
        loading
          ?
          <div className='mt-6 allCenter'>
            <SpinnerDotted
              enabled={true}
            />
          </div>
          :
          <DeliveryTable
            headings={headings}
            dataToSendAPI={dataToSendAPI}
            saveBtnVisible={saveBtnDisable}
            setLoading={setLoading}
          />
      }
    </>
  )
}

export default DeliveryCompliance;