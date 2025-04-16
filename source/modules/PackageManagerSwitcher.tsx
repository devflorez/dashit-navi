import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import fs from 'fs';
import path from 'path';
import { execSync, spawn } from 'child_process';
import { Select } from '@inkjs/ui';

const PackageManagerSwitcher = () => {
	const [current, setCurrent] = useState<string>('npm');
	const [installedVersions, setInstalledVersions] = useState<Record<string, string>>({});
	const [expectedManager, setExpectedManager] = useState<string | null>(null);
	const [output, setOutput] = useState<string[]>([]);
	const [changing, setChanging] = useState(false);

	useEffect(() => {
		if (fs.existsSync('pnpm-lock.yaml')) setCurrent('pnpm');
		else if (fs.existsSync('yarn.lock')) setCurrent('yarn');
		else setCurrent('npm');

		const pkgPath = path.join(process.cwd(), 'package.json');
		if (fs.existsSync(pkgPath)) {
			const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
			setExpectedManager(pkg.packageManager ?? null);
		}

		const versions: Record<string, string> = {};
		try {
			versions['npm'] = execSync('npm -v').toString().trim();
		} catch {}
		try {
			versions['yarn'] = execSync('yarn -v').toString().trim();
		} catch {}
		try {
			versions['pnpm'] = execSync('pnpm -v').toString().trim();
		} catch {}
		setInstalledVersions(versions);
	}, []);

	const updateManager = (manager: string) => {
		const version = installedVersions[manager];
		if (!version) return;

		setChanging(true);
		setOutput([`🔄 Cambiando gestor a ${manager}@${version}...`]);

		const pkgPath = path.join(process.cwd(), 'package.json');
		if (!fs.existsSync(pkgPath)) return;

		const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
		pkg.packageManager = `${manager}@${version}`;
		fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
		setExpectedManager(`${manager}@${version}`);
		setCurrent(manager);

		try {
			fs.rmSync('node_modules', { recursive: true, force: true });
			fs.rmSync('package-lock.json', { force: true });
			fs.rmSync('yarn.lock', { force: true });
			fs.rmSync('pnpm-lock.yaml', { force: true });
			setOutput(prev => [...prev, '🧹 Archivos eliminados']);
		} catch (err) {
			setOutput(prev => [...prev, `❌ Error limpiando archivos: ${err}`]);
		}

		const installCmd = manager === 'yarn' ? 'yarn' : `${manager} install`;
		const proc = spawn(installCmd, { shell: true });

		proc.stdout.on('data', data => {
			setOutput(prev => [...prev, `🟢 ${data.toString().trim()}`]);
		});
		proc.stderr.on('data', data => {
			setOutput(prev => [...prev, `🔴 ${data.toString().trim()}`]);
		});
		proc.on('close', code => {
			if (code === 0) {
				setOutput(prev => [...prev, `✅ Dependencias instaladas con ${manager}`]);
			} else {
				setOutput(prev => [...prev, `❌ Error en instalación. Código: ${code}`]);
			}
			setChanging(false);
		});
	};

	const options = Object.entries(installedVersions)
		.filter(([m]) => m !== current)
		.map(([m, v]) => ({
			label: `Cambiar a ${m} (${v})`,
			value: m
		}));

	const mismatchWarning = (() => {
		if (!expectedManager) return null;
		const [name, expectedVersion] = expectedManager.split('@');
		if (name && expectedVersion) {
			const actual = installedVersions[name];
			if (actual && expectedVersion !== actual) {
				return `⚠️ Esperado ${expectedManager}, pero tienes ${actual}`;
			}
		}
		return null;
	})();

	return (
		<Box flexDirection="column">
			<Text>📦 Gestor actual: <Text color="cyan">{current}</Text></Text>
			{expectedManager && (
				<Text>📜 Definido en package.json: <Text color="yellow">{expectedManager}</Text></Text>
			)}
			{mismatchWarning && <Text color="red">{mismatchWarning}</Text>}

			{changing ? (
				<>
					<Text>⏳ Ejecutando instalación...</Text>
					{output.map((line) => (
						<Text key={line}>{line}</Text>
					))}
				</>
			) : (
				<Select
					options={options}
					onChange={(value) => updateManager(value)}
				/>
			)}
		</Box>
	);
};

export default PackageManagerSwitcher;
