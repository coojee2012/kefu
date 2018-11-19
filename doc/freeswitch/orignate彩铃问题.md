#originate后bridge无法听到拒接铃声
使用originate 外呼的时候设置ignore_early_media为true再bridge，这个时候a-leg接通后，如果b-leg拒接，a-leg这端无法听到拒接的提示音，仍然是正常的回铃音，想请教下，是否有参数可以配置实现b-leg的拒接提示音播放至a-leg

< action application="set" data="hangup_after_bridge=true"/>?


```
Freeswitch bgapi originate command with ignore_early_media=true

I'm trying the following scenario on freeswitch:

Create a call (a-leg)
Create another call (b-leg)
Bridge then together
The b-leg phone is a dial plan in other freeswitch is the following:

<extension name="EarlyMedia">
    <condition field="destination_number" expression="^[+]?[1]?<MY_NUMBER>">
        <action application="pre_answer"/>
        <action application="playback" data="/home/ubuntu/EARLY_MEDIA.wav"/>
        <action application="sleep" data="1000"/>
        <action application="answer"/>
        <action application="playback" data="/home/ubuntu/CALL_MEDIA.wav"/>
        <action application="sleep" data="1000"/>
    </condition>
</extension>
The sequence of commands that i sent to freeswitch is the following:

a-leg
bgapi originate {ignore_early_media=true,bridge_early_media=false,origination_caller_id_number=sofia/external/<MY_FROM_NUMBER>@<MY_IP>,origination_channel_name=<MY_CHANNEL>,ringback=\'%(2000,4000,440,480)\'}sofia/external/<A-LEG NUMBER>@<MY_IP> &park()

b-leg
bgapi originate {ignore_early_media=true,bridge_early_media=false,origination_caller_id_number=sofia/external/<MY_FROM_NUMBER>@<MY_IP>,origination_channel_name=<MY_CHANNEL>,ringback=\'%(2000,4000,440,480)\'}sofia/external/<B-LEG NUMBER>@<MY_IP> &park()

uuid_bridge
bgapi uuid_bridge <A-LEG UUID> <B-LEG UUID>

The problem is that even with ignore_early_media=true,bridge_early_media=false i hear the early media on A-LEG
```