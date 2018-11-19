# Switch.conf.xml

## About

The FreeSWITCH core configuration is contained in autoload_configs/switch.conf.xml

## Default key bindings

Function keys can be mapped to API commands using the following configuration:

```xml
<cli-keybindings>
<key name="[1-12]" value="[api command]"/>
</cli-keybindings>
```

### The default keybindings are

```conf
F1 = help
F2 = status
F3 = show channels
F4 = show calls
F5 = sofia status
F6 = reloadxml
F7 = console loglevel 0
F8 = console loglevel 7
F9 = sofia status profile internal
F10 = sofia profile internal siptrace on
F11 = sofia profile internal siptrace off
F12 = version
```

Beware that the option loglevel is actually setting the minimum hard_log_Level in the application. What this means is if you set this to something other than DEBUG no matter what log level you set the console to one you start up you will not be able to get any log messages below the level you set. Also be careful of mis-typing a log level, if the log level is not correct it will default to a hard_log_level of 0. This means that virtually no log messages will show up anywhere.

注意,选择loglevel实际上是在应用程序中设置最低hard_log_Level。这意味着如果您设置这个之外的东西无论如何调试日志级别设置控制台你启动你将无法得到任何日志消息设置以下水平。也小心mis-typing日志级别,如果日志级别是不正确的,它会默认的hard_log_level 0。这意味着几乎没有日志消息会出现在任何地方。

## Core parameters

> core-db-dsn
Allows to use ODBC database instead of sqlite3 for freeswitch core.

### Syntax

dsn:user:pass

> max-db-handles
Maximum number of simultaneous DB handles open
> db-handle-timeout
Maximum number of seconds to wait for a new DB handle before failing
>disable-monotonic-timing
(bool) disables monotonic timer/clock support if it is broken on your system.
>enable-use-system-time
Enables FreeSWITCH to use system time.

After discussion withe the engineers, I've come to understand that the "enable-use-system-time" parameter is a work around for older machines with broken clock api's.
经过工程师讨论之后,我开始明白“enable-use-system-time”参数是旧机器的工作与破碎的时钟的api。
It's not recommended to use this setting in modern machines, as it's likely to break timing and other things... more notably when it comes to CDR's...
不推荐使用此设置在现代机器,因为它可能打破时间和其他的事情……特别是在CDR的……
It's preferred to use monotonic timing like as NTP/UTC...

I hear it can be useful to use non-monotonic timing for debugging weird issues occasionally, but I dont have specifics how/when that may be used.
Using montonic timing is exactly how you address clock shift issues.
我听说它可以使用non-monotonic时间调试有用奇怪的问题有时候,但是我没有具体如何/何时可以使用。使用montonic时机就是你解决时钟的转变问题。
>enable-use-system-time is something that may get removed from source code at some point, we've just not taken the time to remove it yet...
enable-use-system-time 是可以从源代码在某种程度上,我们已经没有花时间删除它……
> initial-event-threads
Number of event dispatch threads to allocate in the core. Default is 1.
事件调度线程的数量分配的核心。默认值为1。
If you see the WARNING "Create additional event dispatch thread" on a heavily loaded server, you could increase the number of threads to prevent the system from falling behind.
如果你看到这个警告“Create additional event dispatch thread”服务器负载很高,你可以增加线程的数量,以防止系统落后。
>loglevel
amount of detail to show in log
>max-sessions
limits the total number of concurrent channels on your FreeSWITCH™ system.
限制了并发通道总数在你FreeSWITCH™系统。
>sessions-per-second
throttling mechanism, the switch will only create this many channels at most, per second.
节流机制,每秒最多只能创建这么多通道。
>rtp-start-port
RTP port range begin
>rtp-end-port
RTP port range end
>dialplan-timestamps
Adds timestamps to dialplan log lines (useful for log correlation and other stats).
添加时间戳dialplan日志行(用于日志关联和其他统计数据)。

```xml
<param name="dialplan-timestamps" value="true"/>
```

>min-idle-cpu reserves the specified percentage of CPU idle time for other processes. This setting avoids exhausting CPU time for processes other than FreeSWITCH. If min-idle-cpu is set to 25 and FreeSWITCH processing causes the CPU idle time to drop below 25%, then FreeSWITCH will refuse to process additional calls in order to allow other processes to have sufficient CPU time available.
保留指定的其他进程的CPU空闲时间百分比。这个设置可以避免除了FreeSWITCH耗尽CPU时间进程。如果min-idle-cpu设置为25和FreeSWITCH处理导致CPU空闲时间低于25%,那么FreeSWITCH将拒绝处理额外的调用,以允许其他进程有足够可用的CPU时间。

Example of info added:

UUID 2016-11-18 11:05:53.309812 [DEBUG] mod_dialplan_xml.c:690 Dialplan: LOGDATA
Variables
Variables are default channel variables set on each channel automatically.

## Example config

```xml
<configuration name="switch.conf" description="Modules">
  <settings>
    <!--Most channels to allow at once -->
    <param name="max-sessions" value="1000"/>
    <param name="sessions-per-second" value="30"/>
    <param name="loglevel" value="debug"/>
    <!-- Maximum number of simultaneous DB handles open -->
    <param name="max-db-handles" value="50"/>
    <!-- Maximum number of seconds to wait for a new DB handle before failing -->
    <param name="db-handle-timeout" value="10"/>
  </settings>
  <!--Any variables defined here will be available in every channel, in the dialplan etc -->
  <variables>
    <variable name="uk-ring" value="%(400,200,400,450);%(400,2200,400,450)"/>
    <variable name="us-ring" value="%(2000, 4000, 440.0, 480.0)"/>
    <variable name="bong-ring" value="v=4000;>=0;+=2;#(60,0);v=2000;%(940,0,350,440)"/>
  </variables>
</configuration>
```