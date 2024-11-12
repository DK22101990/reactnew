import React from "react";
import MainNavbar from "../UI/MainNavbar";
import Header from "../UI/Header";

const BenchReportDashboard = () => {

    return (
        <>
            <MainNavbar />
            <Header role={"Bench Report Dashboard"} />
            <iframe
                className="iframe"
                title="BenchReportx"
                // width="600" 
                // height="373.5"
                src="https://app.powerbi.com/view?r=eyJrIjoiYzI4M2IzM2EtNzhhYS00NzI0LWFmYjUtM2MyZjc5ZjNjNDVjIiwidCI6ImNlYmZiN2U3LWMyYjktNGZiZi1hYzI5LTA2MWI5ZTg2OGZjZiIsImMiOjN9&pageName=ReportSectione8ff54df2e15383b72ff"
                frameborder="0"
                allowFullScreen="true"
            >
            </iframe>
            {/* <iframe
                className="iframe"
                title="Bench Report"
                width="1140"
                height="541.25"
                src={'https://app.powerbi.com/reportEmbed?reportId=b0fcf438-5c77-49f3-97a4-d0a597d9a46d&autoAuth=true&ctid=cebfb7e7-c2b9-4fbf-ac29-061b9e868fcf'}
                frameBorder={0}
                allowFullScreen={true}
            >
            </iframe> */}
        </>
    )
}

export default BenchReportDashboard;