# Setting Up MongoDB Replica Set

MongoDB replication enables high availability and redundancy by maintaining multiple copies of data across different instances. This guide explains how to configure a replica set on your local machine using MongoDB.

## Prerequisites
- Ensure MongoDB is installed on your system.
- Have administrative (sudo) access.
- Basic knowledge of terminal commands.

## Step 1: Locate MongoDB Configuration
The first step is to find where MongoDB is installed and identify the database path.

```sh
nano /opt/homebrew/etc/mongod.conf
```

This command opens the MongoDB configuration file, which contains essential information such as system logs and database storage paths.

**Example Output:**
```yaml
systemLog:
  destination: file
  path: /opt/homebrew/var/log/mongodb/mongo.log
  logAppend: true
storage:
  dbPath: /opt/homebrew/var/mongodb
net:
  bindIp: 127.0.0.1, ::1
  ipv6: true
```

The `dbPath` specifies the location where MongoDB stores its data. Copy this path and navigate to the directory:

```sh
cd /opt/homebrew/var/mongodb
```

## Step 2: Create Database Directories

MongoDB requires separate directories for each replica set member. Create three directories:

```sh
mkdir db1 db2 db3
```

Now, start three MongoDB instances in separate terminal tabs. Each instance should run on a different port and use a unique database directory while belonging to the same replica set (`rs0`).

Run the following commands in three separate terminal tabs and keep them running:

```sh
sudo mongod --port 27018 --dbpath /opt/homebrew/var/mongodb/db1 --replSet rs0
```

```sh
sudo mongod --port 27019 --dbpath /opt/homebrew/var/mongodb/db2 --replSet rs0
```

```sh
sudo mongod --port 27020 --dbpath /opt/homebrew/var/mongodb/db3 --replSet rs0
```

## Step 3: Initialize the Replica Set
Once all three instances are running, connect to one of them using the MongoDB shell:

```sh
mongo --port 27018
```

Then, initiate the replica set using the following command:

```js
rs.initiate({
    _id: "rs0",
    members: [
        {_id: 0, host: "localhost:27018"},
        {_id: 1, host: "localhost:27019"},
        {_id: 2, host: "localhost:27020"}
    ]
});
```

### Verify the Replica Set
To check the status of the replica set, run:

```js
rs.status()
```

If everything is set up correctly, you should see details about the primary and secondary nodes.

## Result
You have successfully set up a MongoDB replica set on your local machine. This setup allows MongoDB to replicate data across multiple instances, providing redundancy and high availability.

