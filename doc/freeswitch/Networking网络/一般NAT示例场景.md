# General NAT example scenarios

## Scenario 1

FS (192.168.0.4) -> NAT (Public IP 1.2.3.4) -> INTERNET -> NAT (Public IP 5.6.7.8) -> FS (192.168.0.5)

In this scenario you have to do two things.

Setup a profile with ext-sip-ip and ext-rtp-ip set.
If you setup ext-sip-ip and ext-rtp-ip on a profile then that profile CAN NOT BE USED BY ANYTHING BEHIND THE SAME NAT PERIOD.
Port forward the ports for that profile.

## Scenario 2

FS (192.168.0.4) -> NAT (Public IP 1.2.3.4) -> INTERNET -> NAT (Public IP 5.6.7.8) -> PHONE (192.168.1.100)

Prior to setting up your plan you must decide which domain you are going to use for your phone registration and which port the profile will listen to. The general SIP structure being.

Phone {port} -> NAT 1 -> INTERNET -> NAT 2 -> {port}FS sip_profile {sip_profile domain} -> REGISTER {sip_profile domain} or Dialplan {sip_profile domain}

The easiest would be to use the default domain. Keeping in mind you still have to create a new sip_profile (for example, we'll call it doublenat.xml) to handle the double NAT. The steps look like this.
copy the external.xml and rename it doublenat.xml
in doublenat.xml, change the profile name: `<profile name="doublenat">`
add the `<param name="ext-rtp-ip" value="$${external_rtp_ip}"/>`
add the `<param name="ext-sip-ip" value="$${external_sip_ip}"/>`
add the `<param name="force-register-domain" value="$${domain}"/>`
add the `<param name="auth-calls" value="true"/>`
change port to 5090 ( make sure to change it on the phone as well )
add the `<param name="aggressive-nat-detection" value="true"/>`
add the `<param name="apply-nat-acl" value="rfc1918"/>`
register the phone
check to see if your phone is registered with the doublenat profile.
`sofia status profile doublenat`

If your phone is not registered to doublenat then add :5090 to the domain/proxy on the phone configuration.

Example External IP:

216.109.112.135:5090

Example Domain:

example.com:5090
Keep in mind this profile will only be suitable for the double NAT scenario. Also keep in mind that this is the toughest scenario to conquer so you still may have adjustments on your phone or router.
记住这个概要文件将只适用于双NAT的场景。还请记住,这是征服最艰难的场景,所以你仍然可能会调整你的phone或路由器。

## Scenario 3

FS (192.168.0.4) -> NAT (Public IP 1.2.3.4) -> INTERNET -> Softphone Registering to FS

In this scenario you also need a dedicated profile. Getting devices to register to your FS instance sitting behind NAT.
在这种情况下你还需要一个专门的概要文件。让设备注册您的FS实例坐在NAT。

dedicated profile with ext-sip-ip and ext-rtp-ip set. Again NOTHING BEHIND THE SAME NAT WILL BE ABLE TO USE THIS PROFILE PERIOD.
专用的概要文件，设置好ext-sip-ip ext-rtp-ip。同一个NAT背后再没有什么能够使用这个配置文件。

## Scenario 4

PHONE -> FS -> NAT -> Public Internet

In this case you setup a profile for the phones to register without the ext-sip-ip and ext-rtp-ip options set. This profile would be used for all devices registering to the

FS instance that are behind the same NAT.

Then your outbound call would traverse another profile setup to bust through the NAT with the proper ext-sip-ip and ext-rtp-ip options set.

## Scenario 5

FS (1.2.3.4) -> INTERNET -> NAT (Public IP 5.6.7.8) -> Client (192.168.0.5)

More in depth article at Natted Softphone ATA