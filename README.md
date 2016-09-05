# Bandolier Journal

Bandolier is a cross-platform journaling application where users can aggregate tasks, daily notes, and big picture planning all in one flexible, minimalist interface. Based on the popular Bullet Journal methodology, Bandolier adds convenient digital enhancements such as search and one-click migration. With Bandolier, you can sync your journal in the cloud and have access on all of your devices. The desktop version is built with Electron, AngularJS, and PouchDB.

## Demo

[![Bandolier Journal Demo](http://img.youtube.com/vi/9F-e8ZAoack/0.jpg)](http://www.fullstackacademy.com/final-projects/bandolier "Bandolier Journal Demo")

\(Click the above image to see a video demo.)

## Download

[Download Bandolier Journal and learn more](https://bandolierjournal.github.io/)

## Setup
### Step 1
Clone the repository.

### Step 2
```
$ cd Bandolier && npm install
```

### Step 3
```
$ cd app && npm install && bower install
```

### Step 4
Open the below in your favorite editor: 
```
Bandolier/app/node_modules/relational-pouch/dist/pouchdb.relational-pouch.js
```
Replace line 540 with the below:
```
  Promise = require('pouchdb-promise');
```

### Step 5
```
$ cd .. && npm start
```

### Step 6
To enable syncing you must create a secrets.json file in the root directory
```
{
  "dbURL":"URL_OF_VALID_COUCHDB_SERVER"
}
```
<!--[![Throughput Graph](https://graphs.waffle.io/BulletJournal/Bullet/throughput.svg)](https://waffle.io/BulletJournal/Bullet/metrics/throughput)-->
