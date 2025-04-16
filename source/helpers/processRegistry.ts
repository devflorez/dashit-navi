type ScriptStatus = 'running' | 'completed' | 'killed';

interface ScriptProcess {
	id: string;
	script: string;
	status: ScriptStatus;
	pid?: number;
	startedAt: Date;
}

const processRegistry: ScriptProcess[] = [];

export function registerScript(script: string, pid?: number) {
	const id = Date.now().toString();
	processRegistry.push({
		id,
		script,
		status: 'running',
		pid,
		startedAt: new Date()
	});
	return id;
}

export function updateScriptStatus(id: string, status: ScriptStatus) {
	const proc = processRegistry.find(p => p.id === id);
	if (proc) proc.status = status;
}

export function getRunningScripts(): ScriptProcess[] {
	return processRegistry.filter(p => p.status === 'running');
}

export function killScript(id: string) {
	const proc = processRegistry.find(p => p.id === id);
	if (proc?.pid) {
		try {
			process.kill(proc.pid, 'SIGTERM');
			updateScriptStatus(id, 'killed');
		} catch (err) {
			console.error('No se pudo terminar el proceso:', err);
		}
	}
}
