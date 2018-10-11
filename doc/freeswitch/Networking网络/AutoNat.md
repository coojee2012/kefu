# Auto Nat

## About

The FreeSWITCH "auto-nat" feature allows FreeSWITCH to use NAT-PMP or UPnP to discover the external IP address. No STUN lookup is needed. The device performing the NAT must support UPnP or NAT-PMP for the auto-nat feature to work. When the auto-nat feature is fully functioning, only a single SIP profile is needed.

FreeSWITCH“auto-nat”功能允许FreeSWITCH使用NAT-PMP或UPnP去发现外部IP地址而不需要使用STUN搜索。执行NAT的设备必须支持UPnP或NAT-PMP使auto-nat特性能工作。当auto-nat特性是完全功能,只有一个SIP概要文件是必要的。

NOTE: It is still recommended that you use a second profile for your SIP providers. The default conf/sip_profiles/external.xml is set up specifically for use with providers.
注意:还是建议您使用另一个概要文件为您的SIP提供者。默认的conf/sip_profiles/external.xml是专为服务提供商使用的设置。

The auto-nat feature will only perform NAT-PMP and UPnP requests and will NOT fall back in mechanisms like STUN. If you want to use STUN keep the option external rtp, external sip.

auto-nat特性只会执行NAT-PMP和UPnP请求和机制(如STUN不会回落）如果你想使用STUN保持external rtp,external sip选项。

This is useful for those routers whose NAT-PMP or UPnP are not working reliably.
这是对于那些NAT-PMP或UPnP的路由器不可靠工作。

## Warning Before You Get Started

One "feature" of UPnP is that it opens a hole in the firewall/NAT device that can (and often does) allow outside hosts to access your FreeSWITCH server. Do not use UPnP unless you absolutely have to. If you do use it, be sure to take protective measures like changing default passwords. You do not need UPnP if you have 1-to-1 NAT or if you have a static public IP address and can put it in your ext-sip-ip and ext-rtp-ip profile parameters.
UPnP的一个“特性”是在firewall/NAT设备打开了一个洞,可以(并经常)FreeSWITCH服务器允许外部主机访问。不要使用UPnP,除非你绝对必须的。如果你使用它,一定要采取防护措施如更改默认密码。你不需要UPnP，如果你有一对一的NAT或者如果你有一个静态公共IP地址,可以把它放到ext-sip-ip和ext-rtp-ip剖面参数。

## Setup

Starting with a fresh default configuration:
开始一个新的默认配置:
Edit lines in your SIP conf files and change them as follows:

`<param name="ext-rtp-ip" value="auto-nat"/>`
`<param name="ext-sip-ip" value="auto-nat"/>`

Start (or restart) FreeSWITCH. Issue the command sofia status and receive output like this:
API CALL [`sofia(status)`] output:

```conf

                     Name          Type                               Data      State
=================================================================================================
                 internal       profile   sip:mod_sofia@192.168.1.103:5060      RUNNING (1)
            192.168.1.103         alias                           internal      ALIASED
                  default         alias                           internal      ALIASED
            internal-ipv6       profile           sip:mod_sofia@[::1]:5060      RUNNING (0)
=================================================================================================
2 profiles 2 aliases
```

Issue the command sofia status profile internal and receive output like this:

API CALL [`sofia(status profile internal)`] output:

```conf
=================================================================================================
Name                    internal
Domain Name             N/A
DBName                  sofia_reg_internal
Pres Hosts
Dialplan                XML
Context                 public
Challenge Realm         auto_from
RTP-IP                  192.168.1.103
Ext-RTP-IP              67.182.63.90
SIP-IP                  192.168.1.103
Ext-SIP-IP              67.182.63.90
URL                     sip:mod_sofia@192.168.1.103:5060
BIND-URL                sip:mod_sofia@192.168.1.103:5060
HOLD-MUSIC              local_stream://moh
OUTBOUND-PROXY          N/A
CODECS                  G7221@32000h,G7221@16000h,G722,PCMU,PCMA,GSM
TEL-EVENT               101
DTMF-MODE               rfc2833
CNG                     13
SESSION-TO              0
MAX-DIALOG              0
NOMEDIA                 false
LATE-NEG                false
PROXY-MEDIA             false
AGGRESSIVENAT           false
STUN-ENABLED            true
STUN-AUTO-DISABLE       false
CALLS-IN                0
FAILED-CALLS-IN         0
CALLS-OUT               1
FAILED-CALLS-OUT        0

Note the two lines with Ext-RTP-IP and Ext-SIP-IP:

Ext-RTP-IP              67.182.63.90
Ext-SIP-IP              67.182.63.90
```

If these have public IP addresses then the auto-nat feature is working. You may wish to check the NAT device to confirm that the public IP address supplied via UPnP/NAT-PMP is the actual IP address that the Internet-facing side of the device is using.
You can also verify nat_map is working by issuing `nat_map status` which will give you output like:

```conf
Nat Type: UPNP, ExtIP: 76.237.11.11
NAT port mapping enabled.
port,proto,proto_num,sticky
5060,udp,0,0
5060,tcp,1,0
5080,udp,0,0
5080,tcp,1,0

4 total.
```

During startup process you can look for a debug line to see what external IP is detected
在启动过程中你可以寻找一个调试线看看外部IP检测
`2009-09-11 09:42:55.962276 [INFO] switch_nat.c:406 NAT detected type: upnp, ExtIP: '83.59.46.46'`

NOTE : NAT detection happens irrespective of the above settings. To turn it off use "-nonat" to start freeswitch. If you still prefer to have NAT detection, but avoiding the port mapping using UPnP/NAT-PMP you can use "-nonatmap".
注意:NAT检测发生不管上面的设置。要关闭它，使用“-nonat”参数启动freeswitch。如果你仍然喜欢NAT检测,但避免使用UPnP/NAT-PMP进行端口映射可以使用“-nonatmap”参数。

## Making A Test Call

For this test I will use portaudio, but you can also register a SIP phone to make a test call - see below. We'll use the public FreeSWITCH conference echo test so that we can verify audio in both directions. If you make a call and can hear your voice echoed back to you then everything is working properly. Here's a sample console session:
这个测试我将使用portaudio,但你也可以注册一个SIP电话打一个测试,见下文。我们将使用公共FreeSWITCH回波测试,这样我们才能验证音频会议在两个方向。如果你打电话,听到你的声音回荡回到你身边然后一切正常工作。下面是一个示例控制台会话:
`freeswitch> pa call sip:9196@conference.freeswitch.org`

2009-06-04 13:24:57 [NOTICE] switch_channel.c:602 switch_channel_set_name() New Channel portaudio/sip:9196@conference.freeswitch.org [77d54b4c-d395-af49-8950-2fe99635a0be]
Pa_StartStream: waveInStart returned = 0x0.

2009-06-04 13:24:58 [NOTICE] mod_PortAudio.c:1773 place_call() Channel [portaudio/sip:9196@conference.freeswitch.org] has been answered
API CALL [pa(call sip:9196@conference.freeswitch.org)] output:
SUCCESS:4:77d54b4c-d395-af49-8950-2fe99635a0be

2009-06-04 13:24:58 [INFO] mod_dialplan_xml.c:252 dialplan_hunt() Processing FreeSWITCH->sip:9196@conference.freeswitch.org in context default

2009-06-04 13:24:58 [NOTICE] switch_channel.c:602 switch_channel_set_name() New Channel sofia/internal/9196@conference.freeswitch.org [b34bd3c1-11ba-c54c-a518-4ca11f756726]

2009-06-04 13:24:58 [NOTICE] sofia.c:3605 sofia_handle_sip_i_state() Channel [sofia/internal/9196@conference.freeswitch.org] has been answered

At this point you should be able to hear yourself echo. If not then you'll need to start doing network troubleshooting. See Reporting_Bugs for guidelines on collecting information and interacting with the mailing list and IRC channel.

Now hang up the call:

`freeswitch> pa hangup`

2009-06-04 13:25:07 [NOTICE] mod_PortAudio.c:1549 hangup_call() Hangup portaudio/sip:9196@conference.freeswitch.org [CS_EXECUTE] [NORMAL_CLEARING]
API CALL [pa(hangup)] output:
OK

2009-06-04 13:25:07 [NOTICE] switch_ivr_bridge.c:505 audio_bridge_on_exchange_media() Hangup sofia/internal/9196@conference.freeswitch.org [CS_EXCHANGE_MEDIA] [NORMAL_CLEARING]

2009-06-04 13:25:07 [NOTICE] switch_core_session.c:1085 switch_core_session_thread() Session 7 (sofia/internal/9196@conference.freeswitch.org) Ended

2009-06-04 13:25:07 [NOTICE] switch_core_session.c:1087 switch_core_session_thread() Close Channel sofia/internal/9196@conference.freeswitch.org [CS_DESTROY]

WinMME StopStream: waiting for background thread.
2009-06-04 13:25:08 [NOTICE] switch_core_session.c:1085 switch_core_session_thread() Session 6 (portaudio/sip:9196@conference.freeswitch.org) Ended

2009-06-04 13:25:08 [NOTICE] switch_core_session.c:1087 switch_core_session_thread() Close Channel portaudio/sip:9196@conference.freeswitch.org [CS_DESTROY]

Congratulations! If you've gotten this far then you have been spared the brunt of the NAT horrors that others have endured.

## Making A Test Call and bridging to a SIP phone

This will call the conference and ring the sip phone for user 105 in the default domain.

`originate sofia/internal/9996@conference.freeswitch.org &bridge(user/105@default)`

## autonat and external ip

If you know your external ip, you can set it on your sofia profile and also instruct  FreeSWITCH™ to set it when building the SDP:

`<param name="ext-sip-ip" value="autonat:$${external_sip_ip}"/>`

If you want to use the same profile to talk with things inside and outside your network you need to instruct  FreeSWITCH™ when it should use the local IP and the external IP. The autonat: prefix toggles on the usage of the local-network-acl, if you prefix the IP like that it will activate the dynamic ability to tell when it should use ext-rtp-ip vs rtp-ip based on the acl match.

## Double NAT

Double NAT is a scenario where two endpoints are each behind their own respective NAT devices. In the case where two FreeSWITCH servers each are behind UPnP/NAT-PMP like this:

FS1 <> NAT <> Internet <> NAT <> FS2
... then FreeSWITCH's auto-nat can help. Set up each FreeSWITCH server like described above, then have one FreeSWITCH server register to the other.

SAMPLE SETUP FILES COMING SOON!!!

Doublenat with eyebeam/snom :

Eyebeam/snom1 <> NAT <> Internet <> NAT <> FS
Also

Eyebeam/snom2 <> Internet <> NAT <> FS
Both "work" with audio both ways. snom1 could call snom2 and vice versa and also other phones on the LAN. Found that call is hung up with a "BYE" from FS stating reason is "ACK timeout" although "ACK" was being received at FS (and there was still audio, so shouldn't be due to RTP timeouts). Not sure if this is due to some wrong setup etc. Will update once it is clear. Eyebeam had stun enabled. FS had stun disabled and autonat enabled. Router was netgear FVS318 wireless. Same issue with snom 320 as well.

Disabling NAT detection
To turn it off use "-nonat" to start FreeSWITCH. If you still prefer to have NAT detection, but want to avoid the port mapping using UPnP/NAT-PMP you can use "-nonatmap".

## Troubleshooting

## Upnp part

FS with autonat opens SIP ports at startup and RTP ports dynamically
Router must support upnp. Some routers like netgear FVS318 wireless, shows a table of upnp port mappings whey they are created by upnp devices like FS. Use this to check if ports are being opened properly.
On FS side, you can do "nat_map add 1234 udp" on the console and check if the ports are getting opened in the router. If router has a feature of showing a table of mappings, use it. Otherwise perhaps you can use "nat_map add 1234 tcp", and then try to telnet from wan side of the router (if you can) and check if the port is open.
(You have to delete this mapping manually after issuing above command. To remove the mapping, use "delete" instead of "add").

On FS logs, you can check in the console log (DEBUG) if when a call is placed and in progress it shows switch_nat_add_mapping_upnp() for adding, and switch_nat_del_mapping_upnp() for deleting ports.
miniupnpc comes with a test program. cd into libs/miniupnpc and type "make". This will produce a file "upnpc-static". Use the "-l" option to list existing maps. You can also create/delete maps and get other information from the gateway device.
Get the tool call "UPnP port works" (from download.com) Using this you can check the list of ports and even add/remove them. You can use this to test if the UPnP on the router works. (I have found this to not work sometimes, but if I run BaUPnP (download.com) first and then this it always worked.) Even if you forward the SIP ports, note that ultimately you want FS to be able to add / remove ports or it can't do this for RTP ports and you may not have audio.
You can capture the UPnP or NAT-PMP traffic using tcpdump or wireshark. For UPnP, capture using a filter of 'host 239.255.255.250' and for NAT-PMP use a filter of 'host 224.0.0.1'.
Overall :

Always try echo test first before trying phone to phone. If echo test fails, then try to fix that first.

Issues with FS UPnP

I have found that "UPnP port works" s/w was able to add / remove ports to the FS ip, but the nat_map command in the console did not. Please post similar experiences here and report to have them fixed.

## Devices known to work with FS UPNP

Linksys WRTxxx with dd-wrt or tomato firmware. dd-wrt version v24sp1 works functionally, but the UPNP UI page is always empty.
Linksys WRT54GL with dd-wrt v24-sp2 10/10/09 std -or- v24 preSP2[Beta] Build 13064 (recommended) drops 5060 and 5080 tcp/upd mappings. The connections will be up for a minute or so, and then gone. (10/7/2010)
above is also true for DD-WRT v24-sp2 (08/07/10) std. Tried adjusting timeouts in Administration->Management->IP Filter Settings (adjust these for P2P) with no joy.
Tomato Version 1.28 on a wrt54gl works well (working for several weeks so far...).
Linksys WRT54g2 with linksys firmware works with FS, but unreliable. FS can't open the ports sometimes. Please add your own experience.
AT&T Uverse Residential gateway (by 2Wire) supports NAT-PMP. I am unable to find a status page that shows current mappings.
Netgear FVS318 wireless supports upnp and shows a table of portmappings. Worked with FS autonat.
Dlink DIR 655 wireless supports upnp, its "status"->"Internet sessions" shows "Local-NAT-Internet" port mappings. Please disable its "SIP ALG" feature under "Advanced"->"Firewall Settings"->"Application Level Gateway (ALG) Configuration", otherwise the SIP gateway registrations are not stable.
Note firmware 1.2.1 has UPNP bug, its UPNP function working for a while until after a couple of hours stopping work properly. new firmware 1.3.2NA seems to have corrected the UPNP bug per its claim, still keeping watching it on my DIR655.

DLINK DIR 655's UPNP is not stable even with firmware 1.3.2NA, not recommended for production use.

Blanc Wireless G router BW54R11 Firmware 1.4.1 UPNP feature worked with FS auto-nat.
Netgear wgt624 is a really bad router. Please stay away from it !
Mikrotik routers: PC-based and RouterBoards with RouterOS v.3.25. Previous versions not tested (maybe working all 3.xx branch)
Digicom wave 64 with firmware version: 2.11.62.2(RE0.C2D)3.10.16.0
Asus WL-520GU with dd-wrt firmware v24sp2
NAT-PMP Devices known to work with auto-nat
Apple Airport Extreme with Firmware 7.4.2
Please update this wiki with list of routers as you test them

Related Links:
NAT