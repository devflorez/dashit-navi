import React, { useEffect, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import fs from 'fs';
import path from 'path';
import { Select } from '@inkjs/ui';
import { runScriptInNewTerminal } from '../helpers/terminal.js';

interface Props {
	onSetWaiting: (value: boolean) => void;
}

const Scripts = ({ onSetWaiting }: Props) => {
	const [scripts, setScripts] = useState<Record<string, string>>({});
	const [waiting, setWaiting] = useState(false);
	const [currentScript, setCurrentScript] = useState<string | null>(null);

	useEffect(() => {
		const pkgPath = path.join(process.cwd(), 'package.json');
		if (!fs.existsSync(pkgPath)) return;
		const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
		setScripts(pkg.scripts ?? {});
	}, []);

	useInput(() => {
		if (waiting) {
			setWaiting(false);
			setCurrentScript(null);
			onSetWaiting(false);
		}
	});

	const handleRun = (script: string) => {
		runScriptInNewTerminal(script);
		setCurrentScript(script);
		setWaiting(true);
		onSetWaiting(true);
	};

	const options = Object.entries(scripts).map(([key, value]) => ({
		label: `${key} → ${value}`,
		value: key,
	}));

	if (!Object.keys(scripts).length) {
		return <Text color="gray">📜 No se encontraron scripts.</Text>;
	}

	return (
		<Box flexDirection="column">
			<Text>📜 Scripts disponibles:</Text>
			{!waiting && (
				<Select options={options} onChange={handleRun} />
			)}

			{waiting && (
				<>
					<Text color="cyan">🚀 Ejecutado: {currentScript}</Text>
					<Text color="gray">Presiona cualquier tecla para volver</Text>
				</>
			)}
		</Box>
	);
};

export default Scripts;
