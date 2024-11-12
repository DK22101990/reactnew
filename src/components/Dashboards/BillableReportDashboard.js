import React from "react";
import MainNavbar from "../UI/MainNavbar";
import Header from "../UI/Header";

const BillableReportDashboard = () => {

    return (
        <>
            <MainNavbar />
            <Header role={"Billable Report Dashboard"} />
            <iframe
                className="iframe"
                title="BillableReportx"
                // width="600" 
                // height="373.5" 
                src="https://app.powerbi.com/view?r=eyJrIjoiYWM2YWUyNzktNWIzMi00YTRkLTgwZDAtZTEwOWRiYmYwYzY4IiwidCI6ImNlYmZiN2U3LWMyYjktNGZiZi1hYzI5LTA2MWI5ZTg2OGZjZiIsImMiOjN9&pageName=ReportSectione8ff54df2e15383b72ff"
                frameborder="0"
                allowFullScreen="true"
            >
            </iframe>
            {/* <iframe
                className="iframe"
                title="Billable Report"
                width="1140"
                height="541.25"
                src={'https://app.powerbi.com/reportEmbed?reportId=9cf36f0a-e5c0-4b46-a24a-9c170741bc6d&autoAuth=true&ctid=cebfb7e7-c2b9-4fbf-ac29-061b9e868fcf'}
                frameBorder={0}
                allowFullScreen={true}
            >
            </iframe> */}
        </>
    )
}

export default BillableReportDashboard;