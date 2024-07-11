# Verus Explorer UI
This is a new Verus Coin Web Explorer.
UI is originally based from `insight-ui-komodo` redesigned to work for the new VerusExplorer API.

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

## UI and Config Customization
- There are 4 main files to update if there are customization needed relative to chain.
1. `app_conf.js` - configuration
2. `common.css` - styling
2. `theme2.scss` - styling for dark or light theme
3. `index.html` - (use only for including specific font style from external source)

- You only need these 4 files when you update to UIs and pbaas configs.
- These files are located in `custom` folder.
- Currently there are 2 cofigurations supported, `VRSC` and `vARRR`.
- New chain can create their own folder and add the necessary changes and raise a PR
- Once created, you can run the following
```bash
# ./customize.sh [folder name]
# i.e.
./customize.sh vrsc
# or 
./customize.sh pbaas/varrr
```

# Docker
## Prerequisite:
- [Docker](https://docs.docker.com/engine/install/) - `v27.0.3+`

## Creating your own docker image
- Creating the image requires the development installation(see `Development Prerequisites`).
- The script will create a release build first then create the image.
### Setup
- Go to `docker` folder.
- Run the following.
```bash
./docker_build.sh <version>
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
