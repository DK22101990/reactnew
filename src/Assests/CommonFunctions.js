import axiosCalls from "../axiosCalls";

export const checkFileType = (fileName) => {
    const fileExtension = fileName.split(".")[1].toLowerCase();
    const result = ["doc", "docx", "ppt", "xls", "xlsx", "pdf"].includes(fileExtension);
    if (!result) {
        alert("Invalid File Format ! Only DOC,DOCX,PPT,XLS,XLSX and PDF Allowed.")
        return false;
    } else {
        return true;
    }
}

export const checkFileSize = (fileSize) => {
    if (fileSize > 5000000) {  // 5000000 Bytes = 5MB 
        alert("Invalid File Is Too Large ! File Size Should Be 5MB or Less !");
        return false;
    } else {
        return true;
    }
}

export const FileToBase64 = (filename, filepath) => {
    return new Promise(resolve => {
        var file = new File([filename], filepath);
        var reader = new FileReader();
        reader.onload = function (event) {
            resolve(event.target.result.split(',')[1]);
        };
        reader.readAsDataURL(file);
    });
};

export const fetchComplianceStatusData = async (setComplianceStatusData) => {
    const { data } = await axiosCalls.get(`Account/SelectList?Entity=complianceStatus`);
    const changeIt = data.map(d => {
        return {
            option: d.label,
            value: d.value
        }
    })
    setComplianceStatusData(changeIt)
};

export const fetchCommentTypeData = async (setCommentTypeData) => {
    const { data } = await axiosCalls.get(`Account/SelectList?Entity=commentType`);
    const changeIt = data.map(d => {
        return {
            option: d.label,
            value: d.value
        }
    })
    setCommentTypeData(changeIt)
}

export const shortName = (name) => {
    if (name.length > 20) {
        return name.slice(0, 10) + "..." + name.slice(-10);
    } else {
        return name;
    }
}

export const getFormattedDate = (date)=>{
    if(date){
        return new Date(date).toLocaleDateString('en-CA');
    }
}

export const getFormattedDate2 = (date)=>{
    if(date){
        const d = date.slice(0,10);
        return d;
    }
}