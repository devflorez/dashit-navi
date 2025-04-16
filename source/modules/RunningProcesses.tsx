import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { Select } from '@inkjs/ui';
import { getRunningScripts, killScript } from '../helpers/processRegistry.js';

interface ScriptProcess {
	id: string;
	script: string;
	status: 'running' | 'completed' | 'killed';
	pid?: number;
	startedAt: Date;
}

const RunningScripts = () => {
	const [scripts, setScripts] = useState<ScriptProcess[]>(getRunningScripts());
	const [selectedScriptId, setSelectedScriptId] = useState<string | null>(null);

	useEffect(() => {
		const interval = setInterval(() => {
			setScripts(getRunningScripts());
		}, 2000);
		return () => clearInterval(interval);
	}, []);

	if (!scripts.length) {
		return <Text color="gray">✅ No hay procesos activos.</Text>;
	}

	const scriptOptions = scripts.map((proc) => ({
		label: `${proc.script} — ${proc.startedAt.toLocaleTimeString()}`,
		value: proc.id,
	}));

	const handleScriptSelect = (id: string) => {
		setSelectedScriptId(id);
	};

	const handleActionSelect = (action: string) => {
		if (!selectedScriptId) return;
		const selected = scripts.find(s => s.id === selectedScriptId);
		if (!selected) return;

		if (action === 'terminate') {
			killScript(selected.id);
			setScripts(getRunningScripts());
		} else if (action === 'back') {
			setSelectedScriptId(null);
		}
	};

	return (
		<Box flexDirection="column">
			<Text color="cyan">⚙️ Procesos activos:</Text>
			{!selectedScriptId ? (
				<Select options={scriptOptions} onChange={handleScriptSelect} />
			) : (
				<Box flexDirection="column">
					<Text>Selecciona una acción para el script:</Text>
					<Select
						onChange={handleActionSelect}
						options={[
							{ label: '🛑 Finalizar proceso', value: 'terminate' },
							{ label: '↩️ Volver', value: 'back' }
						]}
					/>
				</Box>
			)}
		</Box>
	);
};

export default RunningScripts;
