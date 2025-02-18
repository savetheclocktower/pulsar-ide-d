# pulsar-ide-d package

Barebones language support for D via `serve-d`.

## Installation

### Prerequisites

`pulsar-ide-d` expects `serve-d` to be in your `PATH`, or else to be told exactly where it is via the package settings. Download a [stable release of `serve-d`](https://github.com/Pure-D/serve-d/releases) and extract it to a known location, preferably on your `PATH`.

`serve-d` itself expects to find `dmd` in your `PATH` to be able to deliver autocompletion; you can install it as part of the main D language download [on the official website](https://dlang.org/).

### DCD

[DCD](https://github.com/dlang-community/DCD) is in charge of providing autocompletion and is not bundled with `serve-d`. `serve-d` will show you a notification if it fails to detect an installation of DCD or considers it to be outdated. You may click on <kbd>Download DCD</kbd> to trigger an automatic download and installation of DCD to one of these locations:

* On Linux, it will install into `~/.local/share/code-d/bin` or `~/.code-d/bin`.
* On macOS, it will install into `~/.code-d/bin`.
* On Windows, it will install into `%APPDATA%\code-d\bin`.

If you prefer to manage DCD yourself, you must ensure `dcd-client` and `dcd-server` are present in your `PATH`. A future enhancement will allow you to specify the paths to these executables if they are not in your `PATH`.

In rare cases, you may want to force an update of DCD; you can do so via the package settings (Advanced → Update DCD). Reload the window after changing this setting.

### Steps

1. Install `pulsar-ide-d` from the [Pulsar package repository](https://web.pulsar-edit.dev/packages/pulsar-ide-d).
2. Either ensure the `serve-d` binary is in your `PATH` or specify the full path to the `serve-d` executable in the package settings.
3. Reload the window (via the **Window: Reload** command) or relaunch Pulsar.

## What does it do?

After you’ve installed this package, install any of the following packages to get special features.

### Preferred

Start with these packages; they’re all builtin, actively maintained, and/or built exclusively for Pulsar:

* `autocomplete-plus` _(builtin; no installation needed)_
  * See autocompletion options as you type
* `symbols-view` _(builtin; no installation needed)_
  * View and filter a list of symbols in the current file
  * View and filter a list of symbols across all files in the project
  * Jump to the definition of the symbol under the cursor
* [linter](https://web.pulsar-edit.dev/packages/linter) and [linter-ui-default](https://web.pulsar-edit.dev/packages/linter-ui-default)
  * View diagnostic messages as you type
* [intentions](https://web.pulsar-edit.dev/packages/intentions)
  * Open a menu to view possible code actions for a diagnostic message
  * Open a menu to view possible code actions for the file at large
* [pulsar-outline-view](https://web.pulsar-edit.dev/packages/pulsar-outline-view)
  * View a hierarchical list of the file’s symbols
* [pulsar-refactor](https://web.pulsar-edit.dev/packages/pulsar-refactor)
  * Perform project-wide renaming of variables, methods, classes and types
* [pulsar-find-references](https://web.pulsar-edit.dev/packages/pulsar-find-references)
  * Place the cursor inside of a token to highlight other usages of that token
  * Place the cursor inside of a token, then view a `find-and-replace`-style “results” panel containing all usages of that token across your project

### Other

For other features that don’t have equivalents above, the legacy `atom-ide` packages should also work:

* [atom-ide-definitions](https://web.pulsar-edit.dev/packages/atom-ide-definitions)
  * Jump to the definition of the symbol under the cursor
* [atom-ide-outline](https://web.pulsar-edit.dev/packages/atom-ide-outline)
  * View a hierarchical list of the file’s symbols
  * View the call hierarchy for a given file
* [atom-ide-datatip](https://web.pulsar-edit.dev/packages/atom-ide-datatip)
  * Hover over a symbol to see any related documentation, including method signatures
* [atom-ide-signature-help](https://web.pulsar-edit.dev/packages/atom-ide-signature-help)
  * View a function’s parameter signature as you type its arguments
* [atom-ide-code-format](https://web.pulsar-edit.dev/packages/atom-ide-code-format)
  * Invoke on a buffer (or a subset of your buffer) to reformat your code according to the language server’s settings
