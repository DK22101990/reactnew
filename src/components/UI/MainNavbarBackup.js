import React from "react";
import { Link } from "react-router-dom";
import logo from '../../Assests/images/logo1.png';

function MainNavbarBackup() {
    const saveNameInLocal = (e, name) => {
        localStorage.setItem(name, e.target.innerText)
    }
    const saveNameInLocalHover = (text, name) => {
        localStorage.setItem(name, text)
    }
    return (
        <div>
            <nav className="navbar" role="navigation" aria-label="main navigation">

                <div className="navbar-brand">
                    <a className="navbar-item">
                        <img
                            src={logo}
                            width="auto"
                            height="110"
                        />
                    </a>
                    <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div id="navbarBasicExample" className="navbar-menu">
                    <div className="navbar-start">
                        {/* Modules Start*/}
                        <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link">
                                Modules
                            </a>

                            <div className="navbar-dropdown">
                                {/* {Project Kickstart Start} */}
                                <div className="nested navbar-item dropdown" onMouseOver={(e) => saveNameInLocalHover('Project Kickstart', 'stage')}>
                                    <div className="dropdown-trigger">
                                        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                            <span>Project Kickstart</span>
                                            <span className="icon is-small">
                                                <i className="fas fa-angle-right" aria-hidden="true"></i>
                                            </span>
                                        </button>
                                    </div>
                                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                                        <div className="dropdown-content">
                                            <Link to="DeliveryCompliance" className="dropdown-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                                Sales To Delivery Handover Compliance
                                            </Link>
                                            <hr className="dropdown-divider" />
                                            <Link to="DeliveryCompliance" className="dropdown-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                                Management Compliance
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <hr className="dropdown-divider" />
                                {/* {Project Kickstart End} */}

                                {/* {Design Start} */}
                                <div className="nested navbar-item dropdown" onMouseOver={(e) => saveNameInLocalHover('Design', 'stage')}>
                                    <div className="dropdown-trigger">
                                        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                            <span>Design</span>
                                            <span className="icon is-small">
                                                <i className="fas fa-angle-right" aria-hidden="true"></i>
                                            </span>
                                        </button>
                                    </div>
                                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                                        <div className="dropdown-content">
                                            <Link to="DeliveryCompliance" className="dropdown-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                                Architect Compliance
                                            </Link>
                                            <hr className="dropdown-divider" />
                                            <Link to="DeliveryCompliance" className="dropdown-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                                Quality Design Compliance
                                            </Link>
                                            <hr className="dropdown-divider" />
                                            <Link to="DeliveryCompliance" className="dropdown-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                                BA Compliance
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <hr className="dropdown-divider" />
                                {/* {Design End} */}

                                {/* {Agile Start} */}
                                <div className="nested navbar-item dropdown">
                                    <div className="dropdown-trigger">
                                        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu" onMouseOver={(e) => saveNameInLocalHover('Agile', 'stage')}>
                                            <span>Agile</span>
                                            <span className="icon is-small">
                                                <i className="fas fa-angle-right" aria-hidden="true"></i>
                                            </span>
                                        </button>
                                    </div>
                                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                                        <div className="dropdown-content">
                                            <Link to="AgileCompliance" className="dropdown-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                                PM Compliance
                                            </Link>
                                            <hr className="dropdown-divider" />
                                            <Link to="AgileCompliance" className="dropdown-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                                QA Compliance
                                            </Link>
                                            <hr className="dropdown-divider" />
                                            <Link to="AgileCompliance" className="dropdown-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                                BA Compliance
                                            </Link>
                                            <hr className="dropdown-divider" />
                                            <Link to="AgileCompliance" className="dropdown-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                                Lead Compliance
                                            </Link>
                                            <hr className="dropdown-divider" />
                                            <Link to="AgileCompliance" className="dropdown-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                                Architect Compliance
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <hr className="dropdown-divider" />
                                {/* {Agile End} */}

                                {/* {Closure Start} */}
                                <div className="nested navbar-item dropdown" onMouseOver={(e) => saveNameInLocalHover('Closure', 'stage')}>
                                    <div className="dropdown-trigger">
                                        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                            <span>Closure</span>
                                            <span className="icon is-small">
                                                <i className="fas fa-angle-right" aria-hidden="true"></i>
                                            </span>
                                        </button>
                                    </div>
                                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                                        <div className="dropdown-content">
                                            <Link to="DeliveryCompliance" className="dropdown-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                                Project Closure Compliance
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <hr className="dropdown-divider" />
                                {/* {Closure End} */}

                                {/* {Sprint Start} */}
                                <div className="nested navbar-item dropdown">
                                    <div className="dropdown-trigger">
                                        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                            <span>Sprint</span>
                                            <span className="icon is-small">
                                                <i className="fas fa-angle-right" aria-hidden="true"></i>
                                            </span>
                                        </button>
                                    </div>
                                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                                        <div className="dropdown-content">
                                            <Link to="Sprint" className="dropdown-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                                Sprint Creation
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <hr className="dropdown-divider" />
                                {/* {Sprint End} */}


                                {/* {Account Manager Start} */}
                                <div className="nested navbar-item dropdown">
                                    <div className="dropdown-trigger">
                                        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                            <span>Account Manager</span>
                                            <span className="icon is-small">
                                                <i className="fas fa-angle-right" aria-hidden="true"></i>
                                            </span>
                                        </button>
                                    </div>
                                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                                        <div className="dropdown-content">
                                            <Link to="AccountManagerMap" className="dropdown-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                                Create Map
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <hr className="dropdown-divider" />
                                {/* {Account Manager End} */}

                                {/* {Project Allocation Start} */}
                                {/* <div className="nested navbar-item dropdown">
                                    <div className="dropdown-trigger">
                                        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                            <span>Project Allocation</span>
                                            <span className="icon is-small">
                                                <i className="fas fa-angle-right" aria-hidden="true"></i>
                                            </span>
                                        </button>
                                    </div>
                                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                                        <div className="dropdown-content">
                                            <Link to="ProjectAllocation" className="dropdown-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                                Add Project Allocation
                                            </Link>
                                        </div>
                                    </div>
                                </div> */}
                                {/* {Project Allocation End} */}

                            </div>
                        </div>
                        {/* Modules End */}

                        {/* Dashboard Start */}
                        <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link">Dashboard</a>
                            <div className="navbar-dropdown">
                                <Link to="/ProjectInitiationComplianceDashboard" className="navbar-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                    Project Initiation Compliance Dashboard
                                </Link>
                                <hr className="dropdown-divider" />
                                <Link to="/agileComplianceDashboard" className="navbar-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                    Agile Compliance Dashboard
                                </Link>
                                <hr className="dropdown-divider" />
                                <Link to="/BenchReportDashboard" className="navbar-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                    Bench Report
                                </Link>
                                <hr className="dropdown-divider" />
                                <Link to="/BillableReportDashboard" className="navbar-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                    Billable Report
                                </Link>
                            </div>
                        </div>
                        {/* Dashboard End */}

                         {/* Employee Start */}
                         <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link">Employee</a>
                            <div className="navbar-dropdown">
                                <Link to="/EmployeeManagement" className="navbar-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                    Employee Management
                                </Link>
                                {/* <hr className="dropdown-divider" />
                                <Link to="/agileComplianceDashboard" className="navbar-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                    Agile Compliance Dashboard
                                </Link> */}
                            </div>
                        </div>
                        {/* Employee End */}

                         {/* Project Start */}
                         <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link">Project</a>
                            <div className="navbar-dropdown">
                                <Link to="/projectManagement" className="navbar-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                    Manage Project
                                </Link>
                                <hr className="dropdown-divider" />
                                <Link to="/projectAllocation" className="navbar-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                    Project Allocation
                                </Link>
                            </div>
                        </div>
                        {/* Project End */}

                        {/* SOW Start */}
                        <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link">SOW</a>
                            <div className="navbar-dropdown">
                                <Link to="/sowManagement" className="navbar-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                    Manage SOW
                                </Link>
                            </div>
                        </div>
                        {/* SOW End */}

                        {/* Account Start */}
                        <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link">Account</a>
                            <div className="navbar-dropdown">
                                <Link to="/accountManagement" className="navbar-item" onClick={(e) => saveNameInLocal(e, 'complianceType')}>
                                    Manage Account
                                </Link>
                            </div>
                        </div>
                        {/* Account End */}

                    </div>
                </div>
            </nav>
        </div>
    );
}

export default MainNavbarBackup;
