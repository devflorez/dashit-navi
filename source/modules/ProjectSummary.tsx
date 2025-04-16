import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import fs from 'fs';
import path from 'path';

const ProjectSummary = () => {
	const [summary, setSummary] = useState<null | {
		name: string;
		manager: string;
		nodeVersion: string;
		depCount: number;
		devDepCount: number;
	}> (null);

	useEffect(() => {
		try {
			const cwd = process.cwd();
			const pkgPath = path.join(cwd, 'package.json');
			const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

			const hasYarn = fs.existsSync(path.join(cwd, 'yarn.lock'));
			const hasPnpm = fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'));
			const hasNpm = fs.existsSync(path.join(cwd, 'package-lock.json'));

			const manager = hasPnpm
				? 'pnpm'
				: hasYarn
				? 'yarn'
				: hasNpm
				? 'npm'
				: 'desconocido';

			setSummary({
				name: pkg.name ?? 'Sin nombre',
				manager,
				nodeVersion: process.version,
				depCount: Object.keys(pkg.dependencies ?? {}).length,
				devDepCount: Object.keys(pkg.devDependencies ?? {}).length
			});
		} catch {
			setSummary(null);
		}
	}, []);

	if (!summary) {
		return <Text color="red">⚠️ No se pudo cargar el resumen del proyecto.</Text>;
	}

	return (
		<Box flexDirection="column">
			<Text>📦 Proyecto: <Text color="cyan">{summary.name}</Text></Text>
			<Text>📂 Ruta: <Text color="gray">{process.cwd()}</Text></Text>
			<Text>🧠 Gestor: <Text color="green">{summary.manager}</Text></Text>
			<Text>🧱 Node: <Text color="yellow">{summary.nodeVersion}</Text></Text>
			<Text>📦 Deps: {summary.depCount} | DevDeps: {summary.devDepCount}</Text>
		</Box>
	);
};

export default ProjectSummary;
