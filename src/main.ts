import * as core from '@actions/core';
import * as exec from '@actions/exec';
//import csvparse from 'csv-parse/lib/sync';

async function run(): Promise<void> {
  try {
    const source: string = core.getInput('src');

    // TODO: users should be able to specify multiple destination. use getDestination()
    // and use that
    const destination: string = core.getInput('dst');

    await exec.exec('docker', ['run', '--rm', '-i', '-v', '/home/runner/.docker/config.json:/root/.docker/config.json', 'tonistiigi/repo-copy:latest', source, destination]);

  } catch (error) {
    core.setFailed(error.message)
  }
}

/* get all the destination tags
async function getDestination(): Promise<void> {
  const dstList = core.getInput('dst');

  for 
}
*/
run();
