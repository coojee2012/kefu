# NAT

## About

About text.

## Introduction

NAT, or Network Address Translation, is a necessary evil in the world of network computing. FreeSWITCH tries very hard to make your life easier when dealing with NAT scenarios. One problem, however, is that there are differing devices with unpredictable behavior that can make it seem like your FreeSWITCH server is misbehaving. If you're stuck in a NAT situation then be aware that you may face challenges in getting everything on your network all working.
NAT,或网络地址转换,在网络计算的世界是一个邪恶的存在。FreeSWITCH努力的尝试使你更容易处理NAT场景。然而,一个问题是,不同的设备有不可预知的行为,让它看起来像是FreeSWITCH服务器的行为不端。如果你的现状被困在一个NAT请注意,然后你可能面临挑战,一切都在你的网络工作。

## Further Reading

First off, here is a discussion of NAT at Wikipedia for those inclined to dig deeper.
首先,这是一个讨论的NAT维基百科对于那些倾向于深入。

## BKW's Audio Presentation

2010-08-18
On August 18, 2010 Brian K West (bkw) gave a brief overview of NAT and FreeSWITCH. You may download the audio here:

MPEG
Ogg
The wiki needs to be fixed to allow upload of ogg/mpg files. Here's a link to the talk on archive.org
bkw on archive.org
2014-01-22
On Jan 22, 2014 Brian K West (bkw) gave another more indepth overview of NAT and FreeSWITCH. You may download the audio here:

## TORRENT

You can also view a partial transcript here
Steve Ayre's Excellent Writeup
Steven Ayre wrote up a really nice answer on the mailing list. It is copied verbatim here:

One problem with SIP ALG(Application-Level Gateway)(apart from the varying implementations which mean
some work much better than others) is that it absolutely cannot work with
SIP TLS - for obvious reasons, it can't see inside or rewrite the encrypted
data.
SIP ALG(应用层网关)的一个问题(除了所实现的不同意味着一些工作比其他人更好)是绝对不能使用SIP TLS——原因很明显,里面看不见或重写加密的数据。

Fair enough if that's the only way you found that worked for you, and if
isn't broken don't fix it. :o)
好了如果你发现这是唯一的方式为你工作,如果不破不修复它。:o)

Still, I do suggest people at least try to get their SIP clients handling
NAT traversal correctly first.
不过,我建议人们至少试着让他们SIP客户端处理NAT首先遍历正确。

Unfortunately there's no one true answer to getting NAT traversal working.
The reason is that different SIP clients, NAT, firewall settings and
implementations mean what works somewhere might not work elsewhere. That of
course makes it harder to manage clients at multiple sites, roaming
clients, etc.
不幸的是,没有一个真正的答案让NAT遍历工作。原因是不同的SIP客户、NAT和防火墙设置实现意味着什么地方工作可能无法在其他地方工作。这当然很难管理客户在多个站点,漫游客户等。

The first thing to try would be to disable SIP ALG (if your phone is
handling NAT correctly some might then rewrite the correct packet breaking
it) and enable STUN on your SIP client.

首先要尽量将禁用SIP ALG(如果你的手机是正确处理NAT一些可能会修改正确的数据包打破它)或在SIP客户端使用STUN。

STUN is a useful mechanism where you can talk to the STUN server from your
internal address (IP+port) and it will tell you what your external address
(IP+port) is. You can then use a trick called UDP hole punching whereby any
server online can send to that external address and the NAT mapping will
deliver it to your internal address. So your SIP client can learn its
external SIP and RTP addresses and fill in the correct Contact header and
SDP values. (Assuming SIP ALG is either disabled or intelligent enough not
to then rewrite the correct values and break it). FreeSWITCH then has valid
addresses it can send SIP responses and RTP media to.

STUN是一种有用的机制,你可以跟STUN服务器从你内部地址(IP +端口),它会告诉你你的外部地址(IP +端口)。
然后您可以使用一个叫做UDP孔冲孔,任何技巧服务器在线可以发送到外部地址和NAT映射把它交给你的内部地址。所以你的SIP客户端可以学习它外部SIP和RTP标题和地址,填写正确的联系SDP的价值观。(假设SIP ALG禁用或足够智能然后修改正确的价值观和打破)。FreeSWITCH那么有效地址可以发送SIP和RTP媒体的反应。

That makes some assumptions though:这使得一些假设:
1) Your SIP client supports STUN (not all do)
2) Your NAT implementation maps your internal address to the same external
port talking to any server. Some don't, mapping to a different port for
each server.
3) Your firewall will allow packets to that external port from servers it
hasn't spoken to. Personally I have to reduce the security level of my home
router's firewall (O2 Broadband) from '' to 'Standard'. I suspect this is
why.
防火墙允许数据包从服务器,外部端口没有跟。就我个人而言,我必须减少家里的安全级别宽带路由器的防火墙(O2)”,“标准”。我怀疑这是为什么。
This all applies to a number of protocols the same approach to traverse
NAT. P2P clients, VoIP, VPNs (tinc), online gaming (eg Call of Duty) etc.
If you can get CoD to tell you your NAT type is 'Open' you're probably ok.
;o)

If you can't get the correct IPs in Contact & SDP, you have a few fallback
options in FreeSWITCH.
1) NDLB-connectile-dysfunction will change the Contact to the address the
INVITE came from. Probably correct in 99% of cases.
NDLB-connectile-dysfunction将改变Contact的地址来自INVITE from。可能在99%的情况下是这样的。
2) FreeSWITCH can auto-adjust its RTP address. It tells the client where to
send RTP to, and when it receives it it changes the SDP address to send
audio back to there. Again probably correct in 99% of cases, but with an
unfortunate but unavoidable sideaffect that the caller will hear absolutely
no audio until shortly after they send RTP. That probably won't be until
the call is actually answered, so they will never hear ringback and the
first second of the call might get lost.
FreeSWITCH能适合它的RTP地址。它讲述了客户在哪里发送RTP,当它接收到它改变了SDP地址发送音频回到那里。在99%的情况下,又可能正确,但一个不幸但不可避免的sideaffect调用者绝对会听到没有音频,直到后不久他们把RTP。这可能不会到调用实际上是回答,所以他们永远不会听到回弹第一第二个调用可能会迷路的。
NAT devices have a limited number of ports and memory. As such old/unused
mappings get removed from the table. You therefore need to make sure you
keep the port mapping active. During a call you'll want to enable SIP
keepalives to send a SIP request periodically to keep the port open, so
that you can receive call state updates. When registering you'll
periodically send REGISTER to keep your registration active, so that'll do
it for you. In any case though you want to make sure they're sent
frequently enough that your particular NAT router doesn't timeout the
mapping. Every 30s should be fine.
NAT设备数量有限的港口和记忆。这样旧的/未使用的映射得到从表中删除。
因此,你需要确保你端口映射保持活跃。要使SIP在打电话给你keepalives定期发送SIP请求的端口开放,你可以接收呼叫状态更新。
注册时你会定期发送注册登记保持活跃,所以要做的它为你。在任何情况下你想确保他们发送经常到您的特定NAT路由器不超时映射。每30s应该没事的。
If absolutely all else fails, your other option is to use a VPN to bypass
the NAT entirely. I find OpenVPN over UDP works very well for that, and is
very easy to set up. If you want to save load/bandwidth on the VPN server
you could also use bypass_media and tinc which is a P2P VPN - sites join
any public node and using UDP hole punching can try to talk directly to one
another even behind NAT, but if that fails can still route packets via the
public nodes.
如果绝对一切失败,你的另一个选择是使用VPN绕过NAT。我发现OpenVPN / UDP效果很好,和很容易设置。如果你想节省VPN服务器上加载/带宽您还可以使用bypass_media廷克,说这是一个P2P VPN -网站加入任何公共节点和使用UDP孔冲孔可以尝试直接对话甚至另一个NAT的后面,但是如果失败仍然可以通过路由数据包公共节点。

## NAT in FreeSWITCH

In June 2009 the FreeSWITCH developers added code that makes it possible for FreeSWITCH to leverage the utility of UPnP and NAT-PMP devices. A number of home routers support UPnP or NAT-PMP, in some cases both. This includes the ubiquitous WRTG54G. If your NAT device does not support UPnP or NAT-PMP then you will be forced to use some of the less elegant solutions like STUN.

2009年6月FreeSWITCH开发人员添加代码使“FreeSWITCH利用UPnP和NAT-PMP设备。许多家庭路由器支持UPnP或NAT-PMP,在某些情况下。这包括无处不在的WRTG54G。如果你的NAT设备不支持UPnP或NAT-PMP那么你将被迫使用一些更优雅的解决方案,如STUN。

Many people suffer from NAT issues which come from a misunderstanding of how SIP, RTP and FreeSWITCH work. The topic comes up frequently in the IRC chat room. Please see the following links to aid you in your endeavors.
许多人遭受NAT的问题来自SIP,RTP和FreeSWITCH的误解。这个话题经常出现在IRC聊天室。请参见下面的链接来帮助你在你的努力。

## NAT Info

Auto NAT - This page discusses how to take advantage of FreeSWITCH and the new NAT-busting features.
External profile - this covers the topic of what makes the external profile so NAT traversal friendly in regards to SIP and RTP protocols. Also, this roughly covers the concept of copying from the external profile and creating a new profile that will enable you to cleanly traverse your NAT/firewall situation.
NAT Traversal - General information regarding NAT and devices.
NAT just works!

For sip you can set your SIP IP to a STUN server like "stun:stun.fwdnet.net" or to your external non-NAT IP. If you have a dynamic public IP address and use a Dynamic DNS service, you can set your SIP IP to host:your.dns-host.name, and FS will do a DNS lookup to determine your public IP address. For RTP you set the value to "auto".

sip可以设置你的sip IP 为一个STUN服务器，像“stun:stun.fwdnet.net” 或 您的外部non-NAT IP。如果你有一个动态的公共IP地址和使用动态DNS服务,您可以设置您的SIP IP主机:your.dns-host.name,FS将DNS查询来确定你的公共IP地址。RTP你将值设置为“auto”。

`<param name="sip-ip" value="1.2.3.4"/>`
`<param name="rtp-ip" value="auto"/>`

If FreeSWITCH discovers that the registered endpoint is behind NAT, it will send SIP OPTIONS packets every 30 seconds to the endpoint to keep NAT alive. It is recommended though, that every endpoint be configured to send NAT keepalives itself.
如果FreeSWITCH发现注册端点NAT的后面,它将发送SIP选项包每30秒到端点NAT活着。不过,建议每个端点配置发送NAT keepalives本身。

See Also
For user NAT traversal, see NAT Traversal

Related information, ACL (Modifying NAT behavior when matching a certain access list))
相关信息,ACL(修改NAT行为当匹配一定访问列表))