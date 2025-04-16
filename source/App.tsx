import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import ProjectSummary from './modules/ProjectSummary.js';
import Scripts from './modules/Scripts.js';
import Dependencies from './modules/Dependencies.js';
import Maintenance from './modules/Maintenance.js';
import SystemInfo from './modules/SystemInfo.js';
import PackageManagerSwitcher from './modules/PackageManagerSwitcher.js';
import GitStatus from './modules/GitStatus.js';

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
	});

	return (
		<Box flexDirection="column" padding={1}>
			<Text>╔══════════════════════════ DASHIT-NAVI ════════════════════════╗</Text>
			<Text>║ [1] Resumen  [2] Scripts  [3] Dependencias  [4] Mantenimiento ║</Text>
			<Text>║ [5] Sistema  [6] Gestor de paquetes         [7] Git           ║</Text>
			<Text>╚═══════════════════════════════════════════════════════════════╝</Text>
			<Box marginTop={1}>
				{tab === 0 && <ProjectSummary />}
				{tab === 1 && <Scripts onSetWaiting={setWaiting} />}
				{tab === 2 && <Dependencies onSetWaiting={setWaiting} />}
				{tab === 3 && <Maintenance />}
				{tab === 4 && <SystemInfo />}
				{tab === 5 && <PackageManagerSwitcher />}
				{tab === 6 && <GitStatus />}
			</Box>
			<Text color="gray">(Presiona 1-7 para cambiar sección, q para salir)</Text>
		</Box>
	);
};

export default App;
