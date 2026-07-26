import { useNavigate } from "react-router-dom";
function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100">

      <header className="bg-blue-700 text-white p-5 shadow">
        <h1 className="text-3xl font-bold">
          ForenX AI LearnOSINT
        </h1>

        <p className="mt-2">
          Welcome, {user?.fullName}
        </p>

        <p>
          Role: {user?.role}
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-6 p-8">

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold">
            Learn OSINT
          </h2>

          <p className="mt-3 text-gray-600">
            Learn Open Source Intelligence concepts.
          </p>
        </div>

        <div
          onClick={() => navigate("/recon")}
          className="bg-white rounded-xl shadow p-6 cursor-pointer hover:bg-slate-50 transition"
        >
          <h2 className="text-xl font-bold">
            Recon Engine
          </h2>

          <p className="mt-3 text-gray-600">
            Scan domains and gather intelligence.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold">
            Practice Labs
          </h2>

          <p className="mt-3 text-gray-600">
            Solve guided OSINT challenges.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold">
            Investigation Workspace
          </h2>

          <p className="mt-3 text-gray-600">
            Save and manage investigations.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold">
            Reports
          </h2>

          <p className="mt-3 text-gray-600">
            Generate investigation reports.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold">
            Profile
          </h2>

          <p className="mt-3 text-gray-600">
            View your profile and achievements.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;