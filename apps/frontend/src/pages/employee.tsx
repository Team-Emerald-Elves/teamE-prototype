import '../app.css'
import EmployeeForm from "@/components/employeeForm.tsx";

function EmployeeManagement() {
    return (
        <>
            <div>
                <h1 className="font-mono">Employee Management</h1>
            </div>
            <div>
                <div>
                    <EmployeeForm />
                </div>
            </div>



        </>)
}

export default EmployeeManagement;