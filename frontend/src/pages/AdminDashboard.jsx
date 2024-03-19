// AdminDashboard.jsx
import React from "react";
import AdminArtistsPage from "../components/AdminArtistsPage";
import AdminVotesPage from "../components/AdminVotesPage";
import LeaderboardChart from "../components/LeaderboardChart";
import VotingControls from "../components/VotingControls";

const AdminDashboard = () => {
	return (
		<div>
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
		</div>
	);
};

export default AdminDashboard;
