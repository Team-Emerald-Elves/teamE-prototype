import '../app.css'

function EmployeeManagement() {
    return (
        <>
            <h1>Employee Management</h1>
            <form>
                <div className="form">
                    <label className={"label"} htmlFor="employee-name"> Name: </label>
                    <p><input type="text" id="employee-name" placeholder="This will be the name"/></p>
                </div>
                <div className="form">
                    <label className={"label"} htmlFor="employee-id"> ID: </label>
                    <p><input type="text" id="employee-id" placeholder="This will be employee id"/></p>
                </div>
                <div className="form">
                    <label className={"label"} htmlFor="employee-roles"> Roles: </label>
                    <p><input type="text" id="employee-roles" placeholder="This will be employee roles"/></p>
                </div>
                <p><button className="label" type="button">Save</button></p>
            </form>
        </>
    )
}

export default EmployeeManagement;