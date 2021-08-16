# Nebra Helium Sync Estimate

Monitor progress and estimate time until blockchain sync for Helium Nebra Hotspot Miner. Checks every 2 minutes for updates!

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
$ npm run start 192.168.1.200

> nebra-helium-sync-estimate@1.0.0 start
> node app.js "192.168.1.200"

==================== Nebra Helium Miner Sync Estimate ====================
[2021-08-16T08:11:56-07:00]  Host: 192.168.1.200
[2021-08-16T08:11:56-07:00]  Mined Height: 967707 Block Height: 967977
==================== UPDATE ====================
[2021-08-16T08:13:56-07:00]  5 block(s) mined and  2 block(s)s were added to block height in 120 seconds
[2021-08-16T08:13:56-07:00]  Average Mined Blocks: 2.50 /min
[2021-08-16T08:13:56-07:00]  Average Added Blocks: 1.00 /min
[2021-08-16T08:13:56-07:00]  Current Blocks Left to Mine: 267 [ 967712 / 967979 ] 2.50 b/mpm 1.00 b/apm 1.50 Δ
[2021-08-16T08:13:56-07:00]  Estimated Time Remaining:  days: 0, hours: 2, minutes: 58, seconds: 7
==================== UPDATE ====================
[2021-08-16T08:15:56-07:00]  8 block(s) mined and  4 block(s)s were added to block height in 120 seconds
[2021-08-16T08:15:56-07:00]  Average Mined Blocks: 2.65 /min
[2021-08-16T08:15:56-07:00]  Average Added Blocks: 1.10 /min
[2021-08-16T08:15:56-07:00]  Current Blocks Left to Mine: 263 [ 967720 / 967983 ] 4.00 b/mpm 2.00 b/apm 2.00 Δ
[2021-08-16T08:15:56-07:00]  Estimated Time Remaining:  days: 0, hours: 2, minutes: 49, seconds: 47
