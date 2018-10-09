# var.xml

## About

. outbound_caller_name - Name shown in phones when you make outbound calls
. outbound_caller_number - Number shown in phones when you make outbound calls
. domain - Domain that users register to (domain is specified in phone configs).域用户注册(域电话配置中指定)。
. external_rtp_ip and external_sip_ip - Safest to use an IP address rather than DNS, in case a device can't resolve the domain.安全的使用IP地址而不是DNS,以防设备不能解决域

NOTE: The example below may not be the most up-to-date default version that you will find in your installation.

## Related info from the FreeSwitch FAQ:

Q: What is the difference between using a ${var} and $${var} in the configuration files?

A: The ${var} is expanded as its encountered in the dialplan. The $${var} variation is used as a preprocessor variable and is expanded at load or reloadxml. See vars.xml in the conf folder for more information.

## Predefined variables

The following variables are set dynamically - claculated if possible by freeswitch - and are available to the config as $${variable}. You can see their calculated value via fs_cli by entering eval $${variable}:

```conf
hostname
local_ip_v4
local_mask_v4
local_ip_v6
switch_serial
base_dir
recordings_dir
sound_prefix
sounds_dir
core_uuid
zrtp_enabled
nat_public_addr
nat_private_addr
nat_type
```