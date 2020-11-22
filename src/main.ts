import * as core from '@actions/core';
import * as exec from '@actions/exec';

async function run(): Promise<void> {
  try {
    const source: string = core.getInput('src');

    // destination should be multiline . So multiple destinations can be specified
    const destination: string = core.getInput('dst');

    /* 
    if source is empty {
    	core.setFailed('Source image not set');
	return;
    }
    if destination is empty {
    	core.setFailed('Destination image not set');
	return;
    }
    */

    await exec.exec('docker', ['run', '--rm', '-i', '-v', '/home/runner/.docker/config.json:/root/.docker/config.json', 'tonistiigi/repo-copy:latest', source, destination]);

  } catch (error) {
    core.setFailed(error.message)
  }
}

run();
