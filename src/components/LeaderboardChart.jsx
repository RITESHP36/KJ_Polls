import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import Chart from "react-apexcharts";
import { Card, CardBody, CardHeader } from "@material-tailwind/react";

const LeaderboardChart = () => {
	const [artists, setArtists] = useState([]);

	useEffect(() => {
		const artistsRef = ref(db, "artists");
		const unsubscribe = onValue(artistsRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				setArtists(Object.values(data));
			}
		});

		return () => unsubscribe();
	}, []);

	const chartConfig = {
		type: "bar",
		height: 350,
		series: [
			{
				name: "Votes",
				data: artists.map((artist) => artist.votes),
			},
		],
		options: {
			chart: {
				toolbar: {
					show: false,
				},
			},
			title: {
				show: false,
			},
			dataLabels: {
				enabled: false,
			},
			colors: ["#020617"],
			plotOptions: {
				bar: {
					columnWidth: "40%",
					borderRadius: 2,
				},
			},
			xaxis: {
				axisTicks: {
					show: false,
				},
				axisBorder: {
					show: false,
				},
				labels: {
					style: {
						colors: "#616161",
						fontSize: "12px",
						fontFamily: "inherit",
						fontWeight: 400,
					},
				},
				categories: artists.map((artist) => artist.name),
			},
			yaxis: {
				labels: {
					style: {
						colors: "#616161",
						fontSize: "12px",
						fontFamily: "inherit",
						fontWeight: 400,
					},
				},
			},
			grid: {
				show: true,
				borderColor: "#dddddd",
				strokeDashArray: 5,
				xaxis: {
					lines: {
						show: true,
					},
				},
				padding: {
					top: 5,
					right: 10,
				},
			},
			fill: {
				opacity: 0.8,
			},
			tooltip: {
				theme: "dark",
			},
		},
	};

	return (
		<Card className="px-10 bg-gray-100">
			<CardHeader
				floated={false}
				shadow={false}
				color="transparent"
				className="flex flex-col gap-4 rounded-none md:flex-row md:items-center "
			>
				<p
					variant="h6"
					className="text-blue-500 font-bold text-center text-2xl"
				>
					Leaderboard
				</p>
			</CardHeader>
			<CardBody className="px-2 pb-0 md:w-3/4 mx-auto">
				<Chart {...chartConfig} />
			</CardBody>
		</Card>
	);
};

export default LeaderboardChart;
