import React from "react";
import MainNavbar from "../UI/MainNavbar";
import Header from "../UI/Header";

const DeliveryComplianceDashboard = () => {
    return (
        <>
            <MainNavbar />
            <Header role={"Project Initiation Compliance Dashboard"} />
            {/* { <iframe 
            className="iframe"
            title="Project Initiation Compliance Dashboard" 
            // width="600" 
            // height="373.5" 
            src="https://app.powerbi.com/view?r=eyJrIjoiMDNkNmI5OTItNWIxMi00YmQyLTk4MjEtOGIyZTI5ZGM0NTFiIiwidCI6ImNlYmZiN2U3LWMyYjktNGZiZi1hYzI5LTA2MWI5ZTg2OGZjZiIsImMiOjN9" 
            frameborder="0" 
            allowFullScreen="true"
            >
            </iframe> } */}
            { <iframe
                className="iframe"
                title="Project Initiation Compliance Dashboard"
                width="1140"
                height="541.25"
                src={`https://app.powerbi.com/reportEmbed?reportId=540ecde6-5006-4291-bc40-c0629824c040&autoAuth=true&ctid=cebfb7e7-c2b9-4fbf-ac29-061b9e868fcf`}
                frameBorder={0}
                allowFullScreen={true}
            >
            </iframe>  }




            
            {/* <iframe title="Project Initiation Compliance Dashboard" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=a7f2efc2-6e0e-44ef-ae94-f4209718f194&autoAuth=true&ctid=cebfb7e7-c2b9-4fbf-ac29-061b9e868fcf" frameborder="0" allowFullScreen="true"></iframe> */}
        
        
        </>
    )
}

export default DeliveryComplianceDashboard;