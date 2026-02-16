import Navbar from "./Navbar";

function Dashboard() {
    const studentName = localStorage.getItem("studentName");
    return (
        <>
            <Navbar />
            <div className="main">
                <h1>Dashboard</h1>
                <p>Welcome {studentName}</p>
            </div>
        </>
    )
}

export default Dashboard;