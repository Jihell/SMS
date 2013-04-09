SMS - Secret Message Service
==============================

Licence : MIT

1/ Install
----------

Run npm install to setup dependencies
```sh
npm install
```

2/ Run
------

Run node app.js
```sh
node app.js
```

Then the app will be available on port 10000.
You can modify it in the app.js file.

3/ Create a daemon (linux only)
-------------------------------

You can start SMS with a daemon, ou simply use the command:
```sh
nohup node app.js > output.log &
```
It will run SMS in background and send all output into the output.log file

To stop it, get the PID of the process with
```sh
ps aux | grep "node"
```
Get the PID (here is 12345) and kill it
```sh
kill -9 12345
```

4/ Note
-------

This program is a node.js learning project, not a full featured release.
Feel free to improve or modify it.
