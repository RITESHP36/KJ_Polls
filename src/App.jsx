import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import VotingCountdown from "./components/VotingCountdown";
import FormPage from "./components/FormPage.jsx";

import { Toaster } from "react-hot-toast";

function App() {
	return (
		<>
			<Toaster />
			{/* <Navbar /> */}
			<Router>
				<Routes>
					{/* <Route path="/" element={<FormPage />} /> */}
					<Route path="/" element={<HomePage />} />
					<Route path="/admin" element={<AdminDashboard />} />
					{/* <Route path="/vote" element={<VotingCountdown />} /> */}
				</Routes>
			</Router>
			{/* <Footer /> */}
		</>
	);
}

export default App;