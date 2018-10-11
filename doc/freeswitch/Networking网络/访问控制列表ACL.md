# ACL

## About

A.C.L. stands for Access Control List and is a list of permissions associated with an object. The list defines what network entities are allowed to access the object.
A.C.L.代表访问控制列表,是与对象关联的权限列表。列表定义了网络实体允许访问对象。

## Definitions定义

Access Control Lists are named and defined in autoload_configs/acl.conf.xml
访问控制列表命名和定义在autoload_configs / acl.conf.xml

## Rules

Import from domain users
If your domain's users (in directory/default/*.xml) have cidr attributes, you can import them into any ACL list

`<node type="allow" domain="$${domain}"/>`

## Overlapping重叠覆盖

In the case of overlapping lists, the more specific of the nodes will take precedence.
重叠的列表,更具体的节点将优先考虑。

`<node type="allow" cidr="192.168.42.42/32"/>`
will win over

`<node type="deny" cidr="192.168.42.0/24"/>`

in the same list

## Allow or Deny

The highest priority rules are the most specific, the lowest priority are the least specific. A node rule will override a list default.
最高优先级规则是最具体、最具体的最低优先级。一个节点规则将会覆盖默认的列表。

## Example Lists

Sample allow
allows access from anyone on 1.2.3.*

```xml
<configuration name="acl.conf" description="Network Lists">
  <network-lists>
    <list name="test1" default="deny">
      <node type="allow" cidr="1.2.3.0/24"/>
    </list>
  </network-lists>
</configuration>
```

Sample deny
allows access from anyone except 4.3.2.*

```xml
<configuration name="acl.conf" description="Network Lists">
  <network-lists>
    <list name="test2" default="allow">
      <node type="deny" host="4.3.2.0" mask="255.255.255.0"/>
    </list>
  </network-lists>
</configuration>
```

## Overview

Access control lists may be applied in the sip_profile, via the Event Socket Layer from a script, or in a dialplan application.

sip_profile settings
These Access Control Lists are named in autoload_configs/acl.conf.xml and applied in sip_profiles/internal.xml and sip_profiles/external.xml

apply-inbound-acl
Allow users to make calls from a particular cidr without authenticating

Usage: `<param name="apply-inbound-acl" value="<list name>"/>`
`<list name>` is set in acl.conf.xml and defines the subnet that will be processed by the ACL bearing this name. The default name is "domains".

apply-register-acl
Allow users to register from a particular cidr without authenticating.

apply-proxy-acl
Use the IP specified in X-AUTH-IP header sent from proxy for apply-inbound-acl Note: You'll need to configure your proxy to add this header.

apply-candidate-acl
ICE candidates for RTP transport are checked against this list. It defaults to wan.auto if unset, which excludes the LAN.

auth-calls
Can be set to true/false forcing users to authenticate or no on the profile. Only allow users from a specific cidr to register/make calls. Note: Currently auth-calls does not work with registrations/invites through a proxy. You'll need to do this inside your xml_curl directory scripts or on your proxy.

Directory settings:

`<user id="1000" number-alias="1000" cidr="12.34.56.78/32,20.0.0.0/8">`
Used with in conjunction with apply-inbound-acl and apply-register-acl.结合apply-inbound-acl and apply-register-acl

`<param name="auth-acl" value="1.2.3.0/8"/>`
Used in conjunction with auth-calls. 结合auth-calls使用

Notes
FreeSWITCH automatically makes a few ACLs, namely:

rfc1918.auto - RFC 1918 Space.
nat.auto - RFC 1918 Excluding your local lan.
localnet.auto - ACL for your local lan.
loopback.auto - ACL for your local lan.
Note that you can use these auto generated ACLs by first activating them in sip_profiles:
请注意,您可以使用这些自动生成的acl在sip_profiles首先激活:

```xml
<param name="local-network-acl" value="localnet.auto"/>
<param name="apply-inbound-acl" value="localnet.auto"/>
```

& then using them. For example in acl.conf.xml:

```xml
<list name="localnet.auto" default="allow">
  <node type="allow" cidr="41.XXX.XXX.XXX/29"/>
</list>
```

IPv6 ACL definitions are only supported in FreeSWITCH vesion 1.0.7 and later.

local-network-acl doesn't interfere or authenticate any calls by default like any of the other apply ACL, it just defines the local network. If you use the internal profile on a public IP which accepts calls from other servers then it doesn't hurt leaving it at localnet.auto. The best way to prevent unauthorized calls is using a firewall.

local-network-acl干预或验证任何调用默认情况下不像其他应用ACL,只是定义了本地网络。如果你使用公共IP的内部资料,接受来自其他服务器的调用然后在localnet.auto不会伤害离开它。以防止未经授权的电话最好的方法是使用一个防火墙。

## Users

It is possible to automatically add users with a CIDR attribute to an ACL list. This is particularly useful for authenticating people by static IP address instead of using challenge authentication.
可以自动添加用户CIDR属性ACL列表。这是特别有用的验证人的静态IP地址而不是使用身份验证的挑战。
First of all, make sure you have the following in acl.conf.xml (the Vanilla config does)

```xml
<list name="domains" default="deny">
  <node type="allow" domain="$${domain}"/>
</list>
```

The node element with the 'domain' attribute tells the ACL module to look into that FS domain to insert ACL entries. If you have a multi-domain (multiple tenant) machine, make sure you add node elements for all your domains.

The next step is creating a user with the CIDR attribute. You can separate multiple CIDRs with a comma.
下一步是创建一个用户与CIDR属性。可以独立的多个cidr用逗号分开。
User directory entry with CIDR

```xml
<include>
  <user id="1000" cidr="12.34.56.78/32,20.0.0.0/8">
    <params>
      <param name="password" value="1234"/>
      <param name="vm-password" value="1000"/>
    </params>
    <variables>
      <variable name="accountcode" value="1000"/>
      <variable name="user_context" value="default"/>
      <variable name="effective_caller_id_name" value="Extension 1000"/>
      <variable name="effective_caller_id_number" value="1000"/>
    </variables>
  </user>
</include>
 ```

The last step is to verify that your channel driver has been instructed to use this ACL. For Sofia, you should see the following line in your sip_profile (as noted above):
最后一步是验证您的线路被要求使用这个ACL。Sofia,你应该看到以下行sip_profile(如上所述):
 `<param name="apply-inbound-acl" value="domains"/>`

Additionally, you can restrict a user to a predefined CIDR without allowing the whole CIDR block.
此外,您可以限制一个用户一个预定义的CIDR不允许整个CIDR块。

Users in the directory can have "auth-acl" parameters applied to them so as to restrict that user's access to a predefined ACL or a CIDR.
在目录中的用户可以有“auth-acl”参数应用于他们,用户在一个限制的预定义的ACL或CIDR访问。
  `<param name="auth-acl" value="1.2.3.0/8"/>`
Note: this will require "auth-calls" to be set to true in your sip (sofia) profile.
注意:这将需要“auth-calls”设置为true，在你的sip(sofia)概要文件。
Example:

```xml
<include>
  <user id="1000" number-alias="1000">
    <params>
      <param name="password" value="1234"/>
      <param name="vm-password" value="1000"/>
      <param name="auth-acl" value="1.2.3.0/8"/>
    </params>
    <variables>
      <variable name="accountcode" value="1000"/>
      <variable name="user_context" value="default"/>
      <variable name="effective_caller_id_name" value="Extension 1000"/>
      <variable name="effective_caller_id_number" value="1000"/>
    </variables>
  </user>
</include>
 ```

## Services

### Event Socket

See [Event Socket](https://freeswitch.org/confluence/display/FREESWITCH/Event+Socket+Library)

### Sofia

See [Sofia](https://freeswitch.org/confluence/display/FREESWITCH/Sofia+SIP+Stack)

### Sofia SIP profiles

In your SIP (Sofia) profiles, you can use the following lines to apply the ACL setting to incoming request for either REGISTERs or INVITEs (or both).

  `<param name="apply-inbound-acl" value="<acl_list|cidr>"/>`
 `<param name="apply-register-acl" value="<acl_list|cidr>"/>`

More than one ACL can be defined, in that case all the ACLs will be tested and the message will be rejected if any of the ACLs fail (within an acl_list the test is an OR, with multiple params the test is an AND of all the ACLs)
可以定义多个ACL,在这种情况下所有的ACL将测试和消息将被拒绝如果任何ACL失败(在一个acl_list测试是一个,或者多个参数的测试是一个和ACL)
Phones having IPs within these ACLs will be able to perform calls (apply-inbound-acl) or register (apply-register-acl) without having to provide a password (i.e. without getting a "401 Unauthorized" challenge message).
电话在IPs在这些acl将能够执行调用(apply-inbound-acl)或注册(apply-register-acl)无需提供密码(即没有得到“401未授权”挑战消息)。

Those ACLs do not block any traffic. Should you want to protect your FreeSWITCH installation from being contacted by some IP addresses, you will need to setup some firewall rules. To protect your installation, you can look at QoS
这些acl不阻止任何流量。应该你想保护你的FreeSWITCH安装联系了一些IP地址,您将需要设置一些防火墙规则。为了保护您的安装,您可以看看QoS
Should you want to allow everyone to call your FreeSWITCH installation but restrict outgoing calls, this should be done in the dialplan see mod_dptools: respond.
你想让每个人都能呼入FreeSWITCH安装但限制呼出,这应该是dialplan做的事。 参考 mod_dptools: respond.

The ACL behavior is modified by auth-calls, accept-blind-reg, and accept-blind-auth.

You can also specify a C-style ternary test `<list name>:<pass context>:<fail context>` for apply-inbound-acl.

## Dialplan Apps

check_acl
See mod_dptools: check_acl

API Commands

`reloadacl`
`reloadacl [<reloadxml>]`

`freeswitch@internal> reloadacl reloadxml`
If you've made a change in acl.conf.xml, you can run 'reloadacl reloadxml' in order to avoid restarting FreeSWITCH and your new change will be effective.

Commands reloadxml and reloadacl do not load new lists. You must restart FreeSWITCH to recognize the newly added ACL name.
命令reloadxml和reloadacl不加载新的列表。你必须重启FreeSWITCH识别新添加的ACL的名字。

`acl`
`acl <ip> <list|net>`

This command will allow you to test an IP address against one of your ACLs. Will return true or false. Use it to validate that your ACL behaves as expected. This test can also be a part of a dialplan `<condition>` test.

  `freeswitch@mybox> acl 192.168.42.42 192.168.42.0/24`
  `freeswitch@mybox> acl 192.168.42.42 list_foo`

For the second line, 'list_foo' refers to the `<list name=>` that you specified in acl.conf.xml. When you change acl.conf.xml you must restart the FreeSWITCH process. Commands reloadxml and reloadacl do not load new lists.

Routing using ACL can be accomplished using the acl command. For example, if you want to pass calls for hosts in list_foo ACL:

Dialplan condition using ACL

```xml
<extension name="foo-hosts-calls">
  <condition field="${acl(${network_addr} list_foo)}" expression="true"/>
  <condition field="destination_number" expression="(.*)">
    <action application="bridge" data="sofia/switchbox/$1@x.x.x.x:5060"/>
  </condition>
</extension>
```