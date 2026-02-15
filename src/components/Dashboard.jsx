import Navbar from "./Navbar";

function Dashboard() {
    const studentName = localStorage.getItem("studentName");
    return (
        <>
            <Navbar />
            <div className="main">
                <h1>Dashboard</h1>
                <h1>Welcome {studentName}</h1>
            </div>
        </>
    )
}

export default Dashboard;