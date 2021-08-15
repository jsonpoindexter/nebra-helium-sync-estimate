# Nebra Helium Sync Estimate

Monitor progress and estimate time until blockchain sync for Helium Nebra Hotspot Miner

---
## Requirements

### Hotspot IP Address
 - Note the IP address of your hotspot on your network. Example: 192.168.1.200

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

---

## Install

    $ git clone https://github.com/jsonpoindexter/nebra-helium-sync-estimate
    $ cd nebra-helium-sync-estimate
    $ npm install

## Run app
In order to run the app you must pass in your Nebra Hotspot's IP address:

  ```bash
  $ npm run start *ipaddress*
  ```
  
  or
  
  ```bash
  $ node app.js *ipaddress*
  ```

## Results
```bash
==================== Nebra Helium Miner Sync Estimate ====================
[2021-08-15T12:08:10-07:00]  Host: 192.168.1.200
[2021-08-15T12:08:10-07:00]  Reading from existing saved data...
[2021-08-15T12:08:10-07:00]  Mined Height: 966753 Block Height: 966753
[2021-08-15T12:08:10-07:00]  Average Mined Blocks: 3.78 /min
[2021-08-15T12:08:10-07:00]  Average Added Blocks: 1.16 /min
==================== UPDATE ====================
[2021-08-15T12:10:30-07:00]  Mined 4 and 6 blocks added to block height  197 in 197 seconds
[2021-08-15T12:10:30-07:00]  Average Mined Blocks: 3.53 /min
[2021-08-15T12:10:30-07:00]  Average Added Blocks: 1.23 /min
[2021-08-15T12:10:30-07:00]  Current Blocks Left to Mine: 2 [ 966757 / 966759 ] 1.22 b/mpm 1.83 b/apm 0.61 Δ
[2021-08-15T12:10:30-07:00]  Estimated Time Remaining:  days: 0, hours: 0, minutes: 0, seconds: 52
```


