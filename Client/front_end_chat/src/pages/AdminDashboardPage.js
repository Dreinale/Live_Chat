import "../css/pages/AdminDashboardPage.css";
import UserManagerAdmin from "../components/Admin/UserManagerAdmin";
import RoomManagerAdmin from "../components/Admin/RoomManagerAdmin";


function AdminDashboardPage() {

    return (
        <div className="admin-dashboard-container">
            <UserManagerAdmin/>
            <RoomManagerAdmin/>
        </div>
    );
}

export default AdminDashboardPage;
