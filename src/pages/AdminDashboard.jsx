// AdminDashboard.jsx
import React, { useState } from "react";
import AdminArtistsPage from "../components/AdminArtistsPage";
import AdminVotesPage from "../components/AdminVotesPage";
import LeaderboardChart from "../components/LeaderboardChart";
import VotingControls from "../components/VotingControls";

const AdminDashboard = () => {
	const [isAdmin, setIsAdmin] = useState(false);
	const [adminPassword, setAdminPassword] = useState("");

	const checkAdminPassword = () => {
		const adminPass = "kjadmin007";
		if (adminPassword === adminPass) {
			setIsAdmin(true);
		} else {
			toast.error("Incorrect admin password");
		}
	};

	return (
		<div>
			{!isAdmin ? (
				<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
					<p className="text-lg text-center text-gray-700 mb-2">
						You are not allowed to access this page
					</p>
					<p className="text-md text-center text-gray-600 mb-6">
						Login as an admin to continue
					</p>
					<input
						type="password"
						className="w-64 px-3 py-2 border-2 border-gray-300 rounded-md outline-none focus:border-indigo-500"
						placeholder="Enter admin password"
						onChange={(e) => setAdminPassword(e.target.value)}
					/>
					<button
						onClick={checkAdminPassword}
						className="mt-4 px-4 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-600 focus:outline-none"
					>
						Submit
					</button>
				</div>
			) : (
				<>
					<div className="">
						<p className=" text-xl font-bold text-center text-blue-500  p-4">
							Admin Dashboard
						</p>
					</div>
					<div className="bg-gray-100">
						<AdminArtistsPage />
						<VotingControls />
						<AdminVotesPage />
						<LeaderboardChart />
					</div>
				</>
			)}
		</div>
	);
};

export default AdminDashboard;
