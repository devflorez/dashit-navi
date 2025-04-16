import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import ProjectSummary from './modules/ProjectSummary.js';
import Scripts from './modules/Scripts.js';
import Dependencies from './modules/Dependencies.js';
import Maintenance from './modules/Maintenance.js';
import SystemInfo from './modules/SystemInfo.js';
import PackageManagerSwitcher from './modules/PackageManagerSwitcher.js';
import GitStatus from './modules/GitStatus.js';
import RunningScripts from './modules/RunningProcesses.js';

const App = () => {
	const [tab, setTab] = useState(0);
	const [waiting, setWaiting] = useState(false);

	useInput((input) => {
		if (waiting) return;

		if (input === 'q') process.exit(0);
		if (input === '1') setTab(0);
		if (input === '2') setTab(1);
		if (input === '3') setTab(2);
		if (input === '4') setTab(3);
		if (input === '5') setTab(4);
		if (input === '6') setTab(5);
		if (input === '7') setTab(6);
		if (input === '8') setTab(7);
	});

	return (
		<Box flexDirection="column" padding={1}>
			<Text color="cyan" bold>
				┌────────────────────────────── DASHIT-NAVI ──────────────────────────────┐
			</Text>
			<Text>
				│ [1] 📦 Resumen        │ [2] 📜 Scripts        │ [3] 📊 Dependencias     │
			</Text>
			<Text>
				│ [4] 🧹 Mantenimiento  │ [5] 🖥️  Sistema        │ [6] 🔁 Paquetes         │
			</Text>
			<Text>
				│ [7] 🌿 Git            │ [8] ⚙️  Procesos       │                         │
			</Text>
			<Text color="cyan" bold>
				└─────────────────────────────────────────────────────────────────────────┘
			</Text>

			<Box marginTop={1}>
				{tab === 0 && <ProjectSummary />}
				{tab === 1 && <Scripts onSetWaiting={setWaiting} />}
				{tab === 2 && <Dependencies onSetWaiting={setWaiting} />}
				{tab === 3 && <Maintenance />}
				{tab === 4 && <SystemInfo />}
				{tab === 5 && <PackageManagerSwitcher />}
				{tab === 6 && <GitStatus />}
				{tab === 7 && <RunningScripts />}
			</Box>

			<Text color="gray">(Presiona 1–8 para cambiar sección, q para salir)</Text>
		</Box>
	);
};

export default App;
