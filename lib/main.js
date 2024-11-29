const cp = require('child_process');
const { AutoLanguageClient } = require('@savetheclocktower/atom-languageclient')

const PACKAGE_NAME = require('../package.json').name ?? 'pulsar-ide-d';

function openConfig () {
  atom.workspace.open(`atom://config/packages/${PACKAGE_NAME}`);
}

class DLanguageClient extends AutoLanguageClient {

  constructor () {
    // enable debug output
    // atom.config.set('core.debugLSP', true);
    super();
  }
  getGrammarScopes () { return ['source.d']; }
  getLanguageName () { return 'D'; }
  getServerName () { return 'serve-d'; }
  getPackageName() { return PACKAGE_NAME; }
  getConnectionType() { return 'stdio'; }

  startServerProcess (projectPath) {
    let args = (atom.config.get(`${PACKAGE_NAME}.commandArguments`) ?? '').split(/,\s*/)
    const path = atom.config.get(`${PACKAGE_NAME}.serverBin`)
    const childProcess = cp.spawn(path, args, { cwd: projectPath });

    childProcess.on("error", err => {
      console.error(err);
      atom.notifications.addError(
        "Unable to start the serve-d language server.",
        {
          dismissable: true,
          buttons: [
            {
              text: "Open package settings",
              onDidClick: openConfig
            }
          ],
          description:
          "This can occur if you do not have `serve-d` installed or if it is not in your path.\n\nViewing the README is strongly recommended."
        }
      )
    });

    return childProcess;
  }

  async postInitialization ({ connection }) {
    // Calling this on initial launch seems to suppress the “DCD is outdated”
    // complaint.
    if (atom.config.get(`${PACKAGE_NAME}.advanced.shouldUpdateDcd`)) {
      await connection._rpc.sendNotification('served/updateDCD')
      atom.config.set(`${PACKAGE_NAME}.advanced.shouldUpdateDcd`, false)
    }
  }
}

module.exports = new DLanguageClient();

module.exports.config = {
  serverBin: {
    type: 'string',
    title: 'Path to serve-d',
    description: 'Specify the location of `serve-d` if it is not in your `PATH`. Must be the full path to the `serve-d` binary. If it is in your path, you can leave `serve-d` as the default value. Reload or restart to take effect.',
    default: 'serve-d',
    order: 1
  },
  commandArguments: {
    type: 'string',
    title: 'Command-line arguments',
    description: 'Specify arguments passed to `serve-d` at launch, separated by commas (`,`). Reload or restart to take effect.',
    default: '',
    order: 2
  },
  advanced: {
    type: 'object',
    collapsed: true,
    properties: {
      shouldUpdateDcd: {
        type: 'boolean',
        default: true,
        title: 'Update DCD',
        description: 'Whether to force an update of DCD. This is automatically done the first time the server launches; check this box and reload your window to force a re-download.'
      }
    }
  }
};
