# Multiple FreeSWITCH Instances in One Box

## Different Base Directories

### Follow the Installation Guide twice

Instance A
./configure --prefix=/usr/local/instance_a/
Instance B
./configure --prefix=/usr/local/instance_b/

## Same Base Directories

Follow the Installation Guide without doing anything special, and then

Instance A
Start instance A with

/usr/local/freeswitch/bin/freeswitch -conf /a/conf -log /a/log -db /a/db

Instance B
Start instance B with

/usr/local/freeswitch/bin/freeswitch -conf /b/conf -log /b/log -db /b/db

## FIFO on a clustered FreeSWITCH environment

FreeSWITCH does not share the state of FIFO across multiple instances, therefore, the PARK function should be used instead of FIFO within a FreeSWITCH clustered. One way to implement it is this: When an agent is ready to take call, use PARK to park the channel in one or more dedicated "agent"-instance of FreeSWITCH. Then, using the event socket, you can capture where the agent is parked on, and possibily store it in a persistence storage. When a caller arrives, you can determine which agent should serve this caller and forward the caller to the specific "agent"-instance where the agent is parked on.