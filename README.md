### Installation

## Step 1: Install the necessary software first:

```sh
$ sudo apt-get update - update distribution to latest (optional)
$ sudo apt-get upgrade - upgrade distribution to latest (optional)
$ sudo apt-get install arp-scan - install arp-scan package
$ sudo apt-get install mysql-server - install mysql server
$ sudo apt-get install -y nodejs
```

## Step 2: Clone repository locally

```sh
$ git clone https://github.com/Lilit/presence-bot
(You may need to install git first "sudo apt-get install git")
```

## Step 3: Install node dependences

```sh
$ cd /path/to/project
$ npm install
```


## Step 4: Configuration

Open config.js file and edit

| Config | Value |
| ------ | ------ |
| HOST | database host |
| DB_NAME | database name |
| DB_USERNAME | database user |
| DB_PASSWORD | database password |
| SLACK_TOKEN | YOUR_TOKEN_HERE |
| SLACK_BOT_NAME | YOUR_BOT_NAME |

## Step 5: Cron Task Setup

Set up a minutely cron task under root that runs php presence scan.

```sh
$ sudo crontab -e
```

Then add in this line at the end.

```sh
*/1 * * * * node /full/path/to/project/presence scan
```
## Step 6: Starting the database and presence bot

The command "node presence bot" will start up the bot, it needs root permission to do the arp scan, so either sudo or use root.
Make sure you're in the presence-bot directory and run the following commands

```sh

sudo node presence database #This will start the database
sudo node presence bot #This will start the bot

```

# Bot commands

the bot is triggered via presence

 - `register xx:xx:xx:xx:xx:xx` to associate yourself with a mac address
 - `remove xx:xx:xx:xx:xx:xx` to undo previous association
 - `blacklist xx:xx:xx:xx:xx:xx` to blacklist a mac address
 - `who is here`, `whoishere`, `who's here` I'll let you know who is in the house
 - `top x` listing of the most active users 1-10
 - `whoami` tells you what devices are registered to you.


