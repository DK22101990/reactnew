import React from "react";
import MainNavbar from "../UI/MainNavbar";
import Header from "../UI/Header";

const AgileComplianceDashboard = () => {

    return (
        <>
            <MainNavbar />
            <Header role={"Agile Compliance Dashboard"} />
            <iframe
                className="iframe"
                title="(Agile compliance DB )project performance"
                width="1024"
                height="1060"
                src="https://app.powerbi.com/reportEmbed?reportId=1a8b4640-bd24-4e25-92d8-d6be75321c4a&autoAuth=true&ctid=cebfb7e7-c2b9-4fbf-ac29-061b9e868fcf"
                frameborder="0"
                allowFullScreen="true"
            >
            </iframe>
        </>
    )
}

export default AgileComplianceDashboard;