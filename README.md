# Verus Explorer UI
This is a new Verus Coin Web Explorer.
UI is originally based from `insight-ui-komodo` redesigned to work on the new VerusExplorer API.
# Prerequisite:
1. `nodejs` - `v20.4`
2. `npm` - `v9.7`
3. `grunt-cli` - `v1.4.3`
3. `bower` - `v1.8.14`
> Lower version of `grunt-cli` and `bower` might also work but not 100% guaranteed.
# Development
```bash
npm install
```

Install Grunt CLI globally
```bash
npm install -g grunt-cli
```

Install Bower globally
```bash
npm install -g bower
```

Install necessary dependencies via Bower:
```bash
bower install
```

Compile the project
```bash
grunt compile
```

Run to enable hotreload.
Leave it running while making your changes.
```bash
grunt
```

# Extras
## Optional
Execute the script if you want to see the UI running independently.
<br>This is an optional setup used only during the development.
<br>Feel free to use other alternatives.

<b>Requirement</b>
- [`php`](https://www.php.net/manual/en/features.commandline.webserver.php) - `v5.4+`

<br><i>Check `verus-explorer-setup` repo to run the necessary setup.</i>

```bash
./start_server.sh
```
