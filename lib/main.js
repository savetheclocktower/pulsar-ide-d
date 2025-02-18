const cp = require('child_process');
const { AutoLanguageClient } = require('@savetheclocktower/atom-languageclient')

const PACKAGE_NAME = require('../package.json').name ?? 'pulsar-ide-d';

function openConfig () {
  atom.workspace.open(`atom://config/packages/${PACKAGE_NAME}`);
}

class DLanguageClient extends AutoLanguageClient {

  constructor () {
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

  async postInitialization (server) {
    let { connection } = server;

    // Notify upon successful installation of DCD.
    connection._onNotification({ method: 'coded/logInstall' }, (message) => {
      if (!message.includes('Successfully installed')) return
      atom.notifications.addSuccess(
        `${this.getPackageName()}: ${this.getServerName()} installed DCD`
      );
    });

    // Calling this on initial launch seems to suppress the “DCD is outdated”
    // complaint.
    if (atom.config.get(`${PACKAGE_NAME}.advanced.shouldUpdateDcd`)) {
      await this.updateDcd(connection);
      atom.config.set(`${PACKAGE_NAME}.advanced.shouldUpdateDcd`, false)
    }

    this._server = server;

    // TODO: Send a configuration upon connection. The configuration schema
    // (such as it is) can be found at
    // https://github.com/Pure-D/serve-d/blob/bd968dc2ab7bc6591b885c0ef5a6892a46ff1a91/views/en.txt#L39-L65.
    //
    // Currently, we don't have any need to override the default configuration
    // that `serve-d` will use when it doesn't hear from us, but we might want
    // to allow the user to customize some of these options.
    //
    // TODO: It would also be nice if a user could opt out of autocompletion
    // and thereby eliminate the need to install DCD, but I have not yet found
    // the setting that will produce that effect. `serve-d` still wants to
    // install DCD even if I send `enableAutoComplete: false` in the
    // configuration.

    // connection.didChangeConfiguration({
    //   settings: {
    //     d: {
    //       // et cetera
    //     }
    //   }
    // });
  }

  async updateDcd (connection) {
    await connection._rpc.sendNotification('served/updateDCD')
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
        default: false,
        title: 'Update DCD',
        description: 'Whether to force an update of DCD. This is automatically done the first time the server launches; check this box and reload your window to force a re-download.'
      }
    }
  }
};
