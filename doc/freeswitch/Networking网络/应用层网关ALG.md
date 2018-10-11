# ALG

## About

An ALG (Application Layer Gateway) is a security component, commonly found in a router or firewall device, that is supposed to enhance the ability for certain protocols to traverse NAT. A more complete discussion can be found here and here.
ALG(应用层网关)是一个安全组件,通常存在于一个路由器或防火墙设备,应该增强对某些协议穿越NAT的能力。一个更完整的讨论可以发现[这里](http://en.wikipedia.org/wiki/Application-level_gateway)和[这里](http://www.voip-info.org/wiki/view/Routers+SIP+ALG)。

## Discussion

While ostensibly a SIP ALG is designed to enhance SIP and make the notoriously problematic NAT traversal issues easier to deal with, the simple fact of the matter is that most SIP ALG's are horribly broken. Brian K West has described them as "evil" - which is not really an understatement if you've ever been burned by one. Most routers that have SIP ALG's come with them enabled by default, which means that it's up to the user or admin to dig into the configuration to disable them. The following sections contain instructions and links to more information about various devices that have SIP ALG's and how to disable them. Also, be mindful of the fact that some manufacturers have created devices whose SIP ALG's cannot be disabled. AVOID THEM LIKE THE PLAGUE. (I'm talking to you, Netgear.)
虽然表面上一口ALG旨在提高SIP和让臭名昭著的困难NAT遍历问题更容易处理,简单的事实是,大多数SIP ALG是可怕的坏了。布莱恩·K西方将他们描述为“邪恶的”——这不是一个轻描淡写的如果你曾经被烧毁。大多数路由器SIP ALG附带的默认启用,这意味着由用户或管理员深入配置禁用它们。下面的章节包含指令和各种设备的更多信息的链接,SIP ALG和如何禁用它们。同时,注意一些制造商创造了设备的SIP ALG的不能被禁用。像躲避瘟疫一样避开他们。(我和你谈话,美国网件公司)。

The simple solution to this is to use encrypted communications. Since TLS packets cannot be read nor modified by the router, SIP ALGs will never be able to mangle encrypted calls. yet another reason go encrypted.
这个简单的解决方案是使用加密通信。自从TLS数据包不能读取和修改路由器,SIP alg将永远无法损坏加密的电话。另一个原因去加密。

## TLS

For encrypted calls you will always need to support NAT traversal on the SIP client itself.
为了加密通话你总会需要SIP客户端本身支持NAT遍历。

Even if you're only making unencrypted calls using SIP ALG it is far better to get your phone or edge router correctly to handle that NAT on its own for all calls from the very start. That way you won't experience problems if you switch to TLS encrypted calls; or need to make configuration changes when switching between unencrypted and encrypted calls.

## Disabling ALG

Following are some specific instructions on how to disable SIP ALG on various consumer– and business–grade routers. Please add any devices that you know of in the comment section at the bottom of the page. Also, if you know of some devices that cannot disable their built-in SIP ALG please list or link to them there.
以下是一些具体说明如何禁用SIP ALG不同消费者和企业级路由器。请添加任何设备,你知道在评论栏在页面的底部。同样,如果你知道一些设备不能禁用内置SIP ALG请列出或链接到他们那里。

### Linux netfilter iptables

iptables has two loadable modules (nf_conntrack_sip and nf_nat_sip) for processing SIP packets. nf_nat_sip contains all the SIP ALG functionality. To unload the ALG use the following command:

`modprobe -r nf_nat_sip`

The nf_conntrack_sip module tracks open connections, e.g. for automatically opening RTP ports; it does not perform ALG and does not modify the packets, and so can safely be left loaded.

This may also work on Linux-based routers without an option if you gain command line access (e.g. Netgear), although it may not persist on reboot.

If you use a firewall product that acts as a front-end to iptables, you may need to reconfigure that product to prevent it loading nf_nat_sip.

### 2Wire 3800

I have UVerse from AT&T and my VoIP calls were horrible until I realized that I had this device. I found the instructions found at the Verizon on-line support site to be quite simple and accurate. The Verizon site has actual screen shots. For those of you who don't need a picture, these are the steps:

Open browser, type the router's IP address followed by /mdc
e.g. [](http://192.168.1.254/mdc)
Enter the password and click submit or press Enter.
On the left navigation bar under "Advanced", click on "Configure Services" link
Clear the "Enable" checkbox under SIP Application Layer Gateway
Click submit
Enjoy unfettered VoIP calls!
Thompson/Alcatel Speedtouch 510/530
This router can cause Authentication to fail with UDP. There is no web option to disable ALG, so you have to do the following:

telnet to the router (normally 10.0.0.138)
Unbind the SIP protocol and reboot the modem by entering the following commands:
nat unbind application=SIP port=5060
config save
system reboot
Dlink DIR 625/628/655
Disable SIP ALG as follows:

under "Advanced"->"Firewall Settings"->"Application Level Gateway (ALG) Configuration", clear the "SIP" checkbox.

### D-Link EBR-2310

Navigate to the routers web interface, usually at [](http://192.168.0.1)
The Default Login Credentials are `username=admin password=<blank>`
Select "Advanced"
Select "Firewall Settings" from the left navigation pane.
Clear the "Enable SPI" checkbox so that SPI is disabled
Clear the "SIP" checkbox in the Application Level Gateway Section so that SIP ALG is disabled
SonicWall with SonicOS Enhanced
These routers will function as expected for a period of time, then for no apparent reason cause certain SIP endpoints to fail to authenticate. Using TCP over SIP has resolved the issue in my cases. To disable SIP ALG from the web interface:

Open web administration interface
Select VoIP from the left menu
Clear the "Enable SIP Transformations" checkbox
Click Accept
Netgear DG834G
Navigate to the routers web interface. Usually at http://192.168.0.1
The Default Login Credentials are username=admin password=password
Select "WAN Setup" from the left navigation menu.
Check the "Disable Port Scan and DOS Protection" checkbox
Check the "Disable SIP ALG" checkbox
Netgear WNDR3300
Navigate to the router's web interface, usually at http://192.168.1.1
The Default Login Credentials are username=admin password=password
Select "WAN Setup"
Check the "Disable SPI" checkbox so that SPI is disabled
Check the "Disable SIP ALG" checkbox so that SIP ALG is disabled
Other Options
Some have reported that using SIP over TCP can avoid SIP ALG issues. FS user Moc reports that SIP over TCP has helped him deal with multiple issues with SonicWall routers. Give it a try before you throw money down on a new piece of hardware.

Keep in mind, though, that this will only work as long as vendor products are only inspecting for SIP over UDP. Sooner or later they may extend that to TCP as well. After all, there's nothing stopping them.

The only "sure fire" and universal way to defeat SIP ALGs is to use TLS. Not only does it usually run over a different port (5061) it appears just like another TLS data stream and because it's encrypted the router has no chance of modifying the payload of the packets. When in doubt, use TLS. If you're planning on doing a large SIP deployment and your devices support it, use TLS. You'll save yourself a lot of time and hassle.