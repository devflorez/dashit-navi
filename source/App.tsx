import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';

import ProjectSummary from './modules/ProjectSummary.js';


const tabs = ['Resumen'];
const components = [
	<ProjectSummary key='ProjectSummary' />,
];

const App = () => {
	const [tab, setTab] = useState(0);

	useEffect(() => {
		const handler = (data: Buffer) => {
			const key = data.toString();
			if (key === 'q') process.exit(0);
			const num = parseInt(key);
			if (!isNaN(num) && num >= 1 && num <= 6) {
				setTab(num - 1);
			}
		};

		process.stdin.setRawMode?.(true);
		process.stdin.resume();
		process.stdin.on('data', handler);

		return () => {
			process.stdin.off('data', handler);
		};
	}, []);

	return (
		<Box flexDirection="column" padding={1}>
			<Text>╔════════════════════ DASHIT-NAVI ═══════════════════╗</Text>
			<Text>║ {tabs.map((t, i) => `[${i + 1}] ${t} `).join('')}║</Text>
			<Text>╚════════════════════════════════════════════════════╝</Text>
			<Box marginTop={1}>{components[tab]}</Box>
			<Text color="gray">(Presiona 1-6 para cambiar sección, q para salir)</Text>
		</Box>
	);
};

export default App;
