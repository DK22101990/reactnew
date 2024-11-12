import './App.css';
import "bulma/css/bulma.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './Pages/Home';
import AgileCompliance from './Pages/AgileCompliance';
import DeliveryCompliance from './Pages/DeliveryCompliance';
import AgileComplianceDashboard from './components/Dashboards/AgileComplianceDashboard';
import DeliveryComplianceDashboard from './components/Dashboards/DeliveryComplianceDashboard';
import Sprint from './Pages/Sprint';
import AccountManagerMap from './Pages/AccountManagerMap';
import EmployeeManagement from './Pages/EmployeeManagement';
import AddEmployee from './Pages/AddEmployee';
import AddEmployee2 from './Pages/AddEmployee2';
import ProjectManagement from './Pages/ProjectManagement';
import SOWManagement from './Pages/SOWManagement';
import AccountManagement from './Pages/AccountManagement';
import ProjectAllocation3 from './Pages/ProjectAllocation/ProjectAllocation3';
import ProjectAllocation from './Pages/ProjectAllocation/ProjectAllocation';
import ProjectAllocationNew from './Pages/ProjectAllocation/ProjectAllocationNew';
import BenchReportDashboard from './components/Dashboards/BenchReportDashboard';
import BillableReportDashboard from './components/Dashboards/BillableReportDashboard';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' render={(props) => <Home {...props} key={Date.now()} />} />
        <Route exact path='/DeliveryCompliance' render={(props) => <DeliveryCompliance {...props} key={Date.now()} />} />
        <Route exact path='/AgileCompliance' render={(props) => <AgileCompliance {...props} key={Date.now()} />} />
        <Route exact path='/Sprint' render={(props) => <Sprint {...props} key={Date.now()} />} />
        <Route exact path='/AccountManagerMap' render={(props) => <AccountManagerMap {...props} key={Date.now()} />} />

        <Route exact path='/ProjectInitiationComplianceDashboard' render={(props) => <DeliveryComplianceDashboard {...props} key={Date.now()} />} />
        <Route exact path='/agileComplianceDashboard' render={(props) => <AgileComplianceDashboard {...props} key={Date.now()} />} />
        <Route exact path='/BenchReportDashboard' render={(props) => <BenchReportDashboard {...props} key={Date.now()} />} />
        <Route exact path='/BillableReportDashboard' render={(props) => <BillableReportDashboard {...props} key={Date.now()} />} />

        <Route exact path='/EmployeeManagement' render={(props) => <EmployeeManagement {...props} key={Date.now()} />} />
        <Route exact path='/AddEditEmployee/:empId?' render={(props) => <AddEmployee2 {...props} key={Date.now()} />} />

        <Route exact path='/projectManagement' render={(props) => <ProjectManagement {...props} key={Date.now()} />} />
        <Route exact path='/projectAllocation' render={(props) => <ProjectAllocationNew {...props} key={Date.now()} />} />

        <Route exact path='/sowManagement' render={(props) => <SOWManagement {...props} key={Date.now()} />} />

        <Route exact path='/accountManagement' render={(props) => <AccountManagement {...props} key={Date.now()} />} />
        
        <Route exact path='/testprojectAllocation' render={(props) => <ProjectAllocation {...props} key={Date.now()} />} />
      </Switch>
    </Router>
  )
}

export default App;
