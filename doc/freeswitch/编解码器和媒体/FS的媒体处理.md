# FreeSWITCH媒体处理 

## 一、基本概念

采样频率

音频编码最基本的两个技术参数就是采样频率和打包周期，采样频率越高，声音就越清晰，保留的细节也越多，当然它会占用更大的带宽。对于普通“人声”通话来讲，8000HZ就够了，但对于高品质的音乐来讲，就需要更高的采样率才能保证“悦耳”，比如我们通常说的CD音质的声音使用的就是44.1KHz采样率

打包周期

打包周期跟传输有关，打包周期越短，延迟越小，相对而言传输开销就会越多，因而需要更大的带宽；打包周期越长，带来的延迟就越大，如果传输过程中有丢包，对语音质量的影响也就越大。大部分编码都支持多种打包周期，最常见的是20ms，iLBC、G.723等默认使用30ms，更长的打包周期如60~120ms，通常用于卫星链路等高延迟、低带宽的场合

 

## 二、常用命令

查看编码，每一行表示一个编码，编码的名称和参数以逗号隔开，如下可以看到G.711编码都是核心模块CORE_PCM_MODULE实现的

freeswitch@internal> show codec 
type,name,ikey
codec,ADPCM (IMA),mod_spandsp
codec,AMR,mod_amr
codec,B64 (STANDARD),mod_b64
codec,G.711 alaw,CORE_PCM_MODULE
codec,G.711 ulaw,CORE_PCM_MODULE
codec,G.722,mod_spandsp
codec,G.723.1 6.3k,mod_g723_1
codec,G.726 16k,mod_spandsp

在实践中，当你不清楚某种编码所提供的各种参数时，可以尝试重新加载所属模块，如G729编码属于mod_g729模块
freeswitch@internal> reload mod_g729
freeswitch@internal> 2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:944 Deleting Codec G729 18 G.729 8000hz 10ms
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:944 Deleting Codec G729 18 G.729 8000hz 20ms
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:944 Deleting Codec G729 18 G.729 8000hz 30ms
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:944 Deleting Codec G729 18 G.729 8000hz 40ms
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:944 Deleting Codec G729 18 G.729 8000hz 50ms
2017-09-11 02:04:43.068757 [INFO] mod_enum.c:880 ENUM Reloaded
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:944 Deleting Codec G729 18 G.729 8000hz 60ms
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:944 Deleting Codec G729 18 G.729 8000hz 70ms
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:944 Deleting Codec G729 18 G.729 8000hz 80ms
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:944 Deleting Codec G729 18 G.729 8000hz 90ms
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:944 Deleting Codec G729 18 G.729 8000hz 100ms
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:944 Deleting Codec G729 18 G.729 8000hz 110ms
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:944 Deleting Codec G729 18 G.729 8000hz 120ms
2017-09-11 02:04:43.068757 [CONSOLE] switch_loadable_module.c:1938 mod_g729 has no shutdown routine
2017-09-11 02:04:43.068757 [CONSOLE] switch_loadable_module.c:1955 mod_g729 unloaded.
2017-09-11 02:04:43.068757 [CONSOLE] switch_loadable_module.c:1465 Successfully Loaded [mod_g729]
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:192 Adding Codec G729 18 G.729 8000hz 10ms 8000bps
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:192 Adding Codec G729 18 G.729 8000hz 20ms 8000bps
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:192 Adding Codec G729 18 G.729 8000hz 30ms 8000bps
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:192 Adding Codec G729 18 G.729 8000hz 40ms 8000bps
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:192 Adding Codec G729 18 G.729 8000hz 50ms 8000bps
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:192 Adding Codec G729 18 G.729 8000hz 60ms 8000bps
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:192 Adding Codec G729 18 G.729 8000hz 70ms 8000bps
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:192 Adding Codec G729 18 G.729 8000hz 80ms 8000bps
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:192 Adding Codec G729 18 G.729 8000hz 90ms 8000bps
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:192 Adding Codec G729 18 G.729 8000hz 100ms 8000bps
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:192 Adding Codec G729 18 G.729 8000hz 110ms 8000bps
2017-09-11 02:04:43.068757 [NOTICE] switch_loadable_module.c:192 Adding Codec G729 18 G.729 8000hz 120ms 8000bps

列出当前Profile的配置情况，如下（有删节），其中CODES IN、CODES OUT显示了呼入、呼出的编码设置
freeswitch@internal> sofia status profile internal
=================================================================================================
Name                    internal
Domain Name             N/A
Auto-NAT                false
DBName                  sofia_reg_internal
Pres Hosts              10.211.55.13,10.211.55.13
Dialplan                XML
Context                 public
Challenge Realm         auto_from
RTP-IP                  10.211.55.13
SIP-IP                  10.211.55.13
URL                     sip:mod_sofia@10.211.55.13:5060
BIND-URL                sip:mod_sofia@10.211.55.13:5060;transport=udp,tcp
HOLD-MUSIC              local_stream://moh
OUTBOUND-PROXY          N/A
CODECS IN               OPUS,G722,PCMU,PCMA,GSM
CODECS OUT              OPUS,G722,PCMU,PCMA,GSM

 

## 三、安装语音编码

在FreeSWITCH中，有些编码不是默认安装的，如果要使用这些编码，需要自己编译

在源码目录下执行以下命令来安装相应的编码
make mod_celt-install #安装CELT编码
make mod_silk-install #安装SILK编码
make mod_isac-install #安装iSAC编码
make mod_opus-install #安装OPUS编码
make mod_codec2-install #安装CODEC2编码
 

## 四、相关配置

在默认配置中，SIP Profile支持的媒体列表是在vars.xml文件中配置的，如下
<X-PRE-PROCESS cmd="set" data="global_codec_prefs=OPUS,G722,PCMU,PCMA,GSM"/>
<X-PRE-PROCESS cmd="set" data="outbound_codec_prefs=PCMU,PCMA,GSM"/>

如果需要增加其他编码支持（如G729），可以将上述配置项改为
<X-PRE-PROCESS cmd="set" data="global_codec_prefs=OPUS,G722,PCMU,PCMA,GSM,G729"/>
<X-PRE-PROCESS cmd="set" data="outbound_codec_prefs=PCMU,PCMA,GSM,G729"/>
 