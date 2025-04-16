import { spawn } from 'child_process';
import { registerScript } from './processRegistry.js';

export function runScriptInNewTerminal(scriptName: string) {
	let terminalCmd: string;

	if (process.platform === 'darwin') {
		terminalCmd = `osascript -e 'tell application "Terminal" to do script "npm run ${scriptName}"'`;
		spawn('sh', ['-c', terminalCmd]);
		registerScript(scriptName);
	} else if (process.platform === 'win32') {
		const child = spawn('cmd', ['/c', `start npm run ${scriptName}`]);
		registerScript(scriptName, child.pid);
	} else {
		const child = spawn('x-terminal-emulator', ['-e', `npm run ${scriptName}`]);
		registerScript(scriptName, child.pid);
	}
}
