import '../app.css'
import EmployeeForm from "@/components/employeeForm.tsx";

function EmployeeManagement() {
    return (
        <>
            <div>
                <h1 className="font-mono text-primary text-center font-bold">Employee Management</h1>
            </div>
            <br></br>
            <div>
                <div>
                    <EmployeeForm />
                </div>
            </div>



        </>)
}

export default EmployeeManagement;