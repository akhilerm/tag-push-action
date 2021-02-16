import csvparse from 'csv-parse/lib/sync';
import * as core from '@actions/core';
import * as exec from '@actions/exec';

async function run(): Promise<void> {
  try {
    const source: string = core.getInput('src');

    let destination: string[];
    destination = await getDestinationTags();

    if (source == '') {
      core.setFailed('Source image not set');
      return;
    }

    if (destination.length == 0) {
      core.setFailed('Destination image not set');
      return;
    }

	  
    let dst: string = destination.join(' ');
    
    await exec.exec('docker', ['run', '--rm', '-i', '-v', '/home/runner/.docker/config.json:/root/.docker/config.json', 'tonistiigi/repo-copy:latest', source, dst]);

  } catch (error) {
    core.setFailed(error.message)
  }
}

// This function is a modified version from the script used in docker buildx actions
// Ref https://github.com/docker/build-push-action/blob/master/src/context.ts#L163
async function getDestinationTags(): Promise<string[]> {
  let res: Array<string> = [];

  const items = core.getInput('dst');
  if (items == '') {
    return res;
  }

  for (let output of (await csvparse(items, {
    columns: false,
    relaxColumnCount: true,
    skipLinesWithEmptyValues: true
  })) as Array<string[]>) {
    if (output.length == 1) {
      res.push(output[0]);
    } else {
      res.push(...output);
    }
  }

  return res.filter(item => item).map(pat => pat.trim());
}

run();
