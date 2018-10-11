# Bypass Media Overview

好处可以提升服务器处理并发的性能
缺点：不可以录音，不可以绕过NAT（除非端点自己能指定RTP地址和端口）

## About

No media mode is an SDP Passthrough feature that permits two endpoints that can see each other (no funky N.A.T.) to connect their media sessions directly while FreeSWITCH maintains control of the SIP signaling. This is useful if you have two end-points that need to use a codec that is currently not supported in FreeSWITCH (video) or if you are using FreeSWITCH in a high performance walled garden network and want to minimize the RTP handling FreeSWITCH is doing to maximize call traffic.

When set, the media (RTP) from the originating endpoint is sent directly to the destination endpoint and vice versa. The signaling (SIP) for both endpoints still goes through FreeSWITCH, but the media is point-to-point.

See also bypass_media_after_bridge

## Diagram

```conf
               +------------+
               |            |
           ____| FreeSWITCH |___
          /    |            |   \
     SIP /     +------------+    \ SIP
        /      192.168.1.105      \
       /                           \
+----------+                    +----------+
|          |                    |          |
| endpoint |   <---- RTP ---->  | endpoint |
|    A     |        Audio       |    B     |
+----------+                    +----------+
192.168.1.100                   192.168.1.110
```

## How to enable it

Before executing the bridge action you must set the "bypass_media" flag to true.
`<action application="set" data="bypass_media=true"/>`

## How to verify that it is working

If the endpoints are on a different IP than freeswitch, it is very easy. Just run wireshark on the machine running freeswitch and make sure you either see no traffic, or the RTP traffic is only going between the endpoints and not through freeswitch.

Related Features
See also: Proxy Media Mode

## Advanced Features

Broadcast command puts freeswitch back in media path
Doing a broadcast command on a channel that is in "bypass media" mode will cause freeswitch to put itself back in the media path of both legs of the call, and then take itself out again once the playback has finished.

## FAQ

### Can I use it if any of my endpoints are behind NAT

Probably not. If the endpoints send external IP/port of the RTP media streams it will increase the chances of this working.

### Can it be set globally so that all channels use bypass_media

Yes. There is a global variable that can be set (TODO: doc this) and "inbound no media" can be set on the SIP profile:

`<param name="inbound-bypass-media" value="true"/>`
(see example in conf/sip_profiles/internal.xml)

## How to disable/enable it on the fly

There is a media api command

`uuid_media <uuid>`
will put freeswitch back in the media path and disable bypass media mode.

Likewise:

`uuid_media off <uuid>`
will take freeswitch out of the path and activate bypass media mode.

## Can I record sessions in bypass media mode

session_record will fail if the call is in bypass media or proxy media mode, you need to manually move the call into media.

## Can I use bypass media when executing the bridge application from a javascript

Of course you can, all it takes is setting the bypass_media session variable to true before the bridge:

`session.setVariable('bypass_media', 'true');`

## Can I set bypass_media=true in vars.xml or as a global variable

no, there are cases where this variable is unset, if you set it as a global it can never unset, and will result in unexpected behaviors.
