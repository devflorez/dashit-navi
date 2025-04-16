import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import ProjectSummary from './modules/ProjectSummary.js';
import Scripts from './modules/Scripts.js';

const App = () => {
	const [tab, setTab] = useState(0);
	const [waiting, setWaiting] = useState(false);

	useInput((input) => {
		if (waiting) {
			setWaiting(false);
			return;
		}

		if (input === 'q') process.exit(0);
		if (input === '1') setTab(0);
		if (input === '2') setTab(1);
	});

	return (
		<Box flexDirection="column" padding={1}>
			<Text>╔════════════════════ DASHIT-NAVI ═══════════════════╗</Text>
			<Text>║ [1] Resumen  [2] Scripts                           ║</Text>
			<Text>╚════════════════════════════════════════════════════╝</Text>
			<Box marginTop={1}>
				{tab === 0 && <ProjectSummary />}
				{tab === 1 && <Scripts onSetWaiting={setWaiting} />}
			</Box>
			<Text color="gray">(Presiona 1-2 para cambiar sección, q para salir)</Text>
		</Box>
	);
};

export default App;
