import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import ProjectSummary from './modules/ProjectSummary.js';
import Scripts from './modules/Scripts.js';
import Dependencies from './modules/Dependencies.js';
import Maintenance from './modules/Maintenance.js';

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
	});

	return (
		<Box flexDirection="column" padding={1}>
			<Text>╔══════════════════════════ DASHIT-NAVI ════════════════════════╗</Text>
			<Text>║ [1] Resumen  [2] Scripts  [3] Dependencias  [4] Mantenimiento ║</Text>
			<Text>╚═══════════════════════════════════════════════════════════════╝</Text>
			<Box marginTop={1}>
				{tab === 0 && <ProjectSummary />}
				{tab === 1 && <Scripts onSetWaiting={setWaiting} />}
				{tab === 2 && <Dependencies onSetWaiting={setWaiting} />}
				{tab === 3 && <Maintenance />}
			</Box>
			<Text color="gray">(Presiona 1-4 para cambiar sección, q para salir)</Text>
		</Box>
	);
};

export default App;