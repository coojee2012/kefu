import { Injectable, Injector } from '@angular/core';
import { LoggerService } from './LogService';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { MyReplaySubject } from '../utils/MyRelaySubject';


const C = {
    STATUS_NULL: 0,
    STATUS_NEW: 1,
    STATUS_CONNECTING: 2,
    STATUS_CONNECTED: 3,
    STATUS_COMPLETED: 4
};

@Injectable()
export class SIPService {
    public client: any;
    private session: any;
    private chatMessageSource: MyReplaySubject<any>;
    private chatMessage$: Observable<any>;
    private audio: boolean;
    private video: boolean;
    private options: any;
    private anonymous: boolean;
    private state: number;
    private C: any;
    eventSource = new Subject<any>();
    event$: Observable<any>;
    constructor(private logger: LoggerService) {
        this.client = null;
        this.session = null;
        this.anonymous = false;
        this.chatMessageSource = new MyReplaySubject<any>();
        this.chatMessage$ = this.chatMessageSource.asObservable();
        this.event$ = this.eventSource.asObservable();
    }

    async init(options: any) {
        try {
            if (options.media.remote.video) {
                this.video = true;
            } else {
                this.video = false;
            }

            if (options.media.remote.audio) {
                this.audio = true;
            } else {
                this.audio = false;
            }

            if (!this.audio && !this.video) {
                // Need to do at least audio or video
                // Error
                throw new Error('At least one remote audio or video element is required for Simple.');
            }
            this.options = options;

            // https://stackoverflow.com/questions/7944460/detect-safari-browser
            const browserUa = window.navigator.userAgent.toLowerCase();
            let isSafari = false;
            let isFirefox = false;
            if (browserUa.indexOf('safari') > -1 && browserUa.indexOf('chrome') < 0) {
                isSafari = true;
            } else if (browserUa.indexOf('firefox') > -1 && browserUa.indexOf('chrome') < 0) {
                isFirefox = true;
            }
            const sessionDescriptionHandlerFactoryOptions: any = {
                peerConnectionOptions: {
                    iceCheckingTimeout: 3000,
                    rtcConfiguration: {
                        iceServers: [
                            { urls: 'stun:stun.voiparound.com' },
                            { urls: 'stun:stun.voipbuster.com' },
                            { urls: 'stun:stun.l.google.com:19302' }
                        ]
                    }
                }
            };
            if (isSafari) {
                sessionDescriptionHandlerFactoryOptions.modifiers = [SIP.Web.Modifiers.stripG722];
            }

            if (isFirefox) {
                sessionDescriptionHandlerFactoryOptions.alwaysAcquireMediaFirst = true;
            }

            if (!this.options.ua.uri) {
                this.anonymous = true;
            }

            await new Promise((resolve, reject) => {
                this.client = new SIP.UA({
                    // Replace this IP address with your FreeSWITCH IP address
                    uri: `${options.exten}@${options.domain}`,
                    // Replace this IP address with your FreeSWITCH IP address
                    // and replace the port with your FreeSWITCH ws port
                    transportOptions: {
                        traceSip: true,
                        wsServers: 'ws://192.168.2.230:5066',
                        connectionTimeout: 5, // seconds default 5
                        maxReconnectionAttempts: 3,
                        reconnectionTimeout: 4,
                        keepAliveInterval: 0,
                        keepAliveDebounce: 10
                    },
                    // FreeSWITCH Default Username
                    authorizationUser: options.exten,
                    // Username (String) to use when generating authentication credentials.
                    // If not defined the value in uri parameter is used.
                    password: options.password, // FreeSWITCH Default Password
                    register: true, // Indicate if a SIP User Agent should register automatically when starting.
                    registerExpires: 300, // Registration expiry time (in seconds) (Number). Default value is 600.
                    // registrarServer: '', // Set the SIP registrar URI.
                    // Valid value is a SIP URI without username.
                    // Default value is null which means that the registrar URI is taken from the uri parameter (by removing the username).
                    // sessionDescriptionHandlerFactory: (session, options) => {
                    //     return new SessionDescriptionHandler(session, options);
                    // },
                    dtmfType: SIP.C.dtmfType.INFO, // Valid values are SIP.C.dtmfType.INFO and SIP.C.dtmfType.RTP
                    log: {
                        builtinEnabled: true,
                        level: 'debug', // "debug", "log", "warn", "error"
                        // connector:(level, category, label, content)=>{}
                    },
                    noAnswerTimeout: 60,
                    sessionDescriptionHandlerFactoryOptions: sessionDescriptionHandlerFactoryOptions,
                    userAgentString: 'AI-SIP'
                });
                let registered = false;
                this.state = C.STATUS_NULL;
                const onRegistionFailed = (response, cause) => {
                    this.logger.error('registrationFailed:', response, cause);
                    // this.client.removeListener();
                    reject(cause);
                };
                const onRegistered = () => {
                    this.logger.info('registered');
                    registered = true;
                    resolve();
                };
                this.client.setMaxListeners(1000);
                this.client.transport.setMaxListeners(1000);
                this.client.on('registered', onRegistered);
                this.client.on('registrationFailed', onRegistionFailed);
                this.client.on('invite', this.onInvite.bind(this));
                this.client.on('message', this.handleChatMsg.bind(this));
                this.client.on('transportCreated', function (transport) {
                    console.log('======transportCreated====');
                    // transport.setMaxListeners(0);
                    // transport.on('transportError', this.onTransportError.bind(this));
                }.bind(this));
                this.client.start();
            });

            this.C = C;
        } catch (ex) {
            this.logger.error('SIP INIT ERROR:', ex);
        }
    }

    async start(options?: any) {
        try {
            if (this.client) {
                this.client.start();
                this.client.on('invite', this.onInvite.bind(this));
                this.client.on('message', this.handleChatMsg.bind(this));
            } else {
                await this.init(options);
            }

        } catch (error) {
            this.logger.error('SIP START ERROR:', error);
            return Promise.reject(error);
        }
    }

    async stop() {
        try {
            const result = await new Promise((resolve, reject) => {
                this.client.once('unregistered', (response, cause) => {
                    this.logger.debug('stop sipclient:', response, cause);
                    if (cause) {
                        reject(cause);
                    } else {
                        this.client = null;
                        resolve();
                    }
                });
                this.client.stop();

            });
            return result;
        } catch (ex) {
            this.logger.error('SIP STOP ERROR:', ex);
            return Promise.reject(ex);
        }
    }

    async unregister() {
        try {
            const result = await new Promise((resolve, reject) => {
                this.client.once('unregistered', (response, cause) => {
                    this.logger.debug('unregistered sip client:', response, cause);
                    if (cause) {
                        reject(cause);
                    } else {
                        resolve();
                    }
                });
                const options = {
                    'all': true,
                    'extraHeaders': ['X-Foo: foo', 'X-Bar: bar']
                };
                this.client.unregister(options);
            });
            return result;
        } catch (ex) {
            this.logger.error('SIP UNREG ERROR:', ex);
            return Promise.reject(ex);
        }
    }

    checkRegistration() {
        return (this.anonymous || (this.client && this.client.isRegistered()));
    }

    async makeACall(number) {
        try {
            if (!this.client || !this.checkRegistration()) {
                this.logger.warn('A registered UA is required for calling');
                return;
            }
            if (this.state !== C.STATUS_NULL && this.state !== C.STATUS_COMPLETED) {
                this.logger.warn('Cannot make more than a single call with Simple');
                return;
            }

            // Safari hack, because you cannot call .play() from a non user action
            if (this.options.media.remote.audio) {
                this.options.media.remote.audio.autoplay = true;
            }
            if (this.options.media.remote.video) {
                this.options.media.remote.video.autoplay = true;
            }
            if (this.options.media.local && this.options.media.local.video) {
                this.options.media.local.video.autoplay = true;
                this.options.media.local.video.volume = 0;
            }

            this.session = this.client.invite(`${number}`, {
                sessionDescriptionHandlerOptions: {
                    constraints: {
                        audio: this.audio,
                        video: this.video
                    },
                    // peerConnectionOptions: {
                    //     iceCheckingTimeout: 5000,
                    //     rtcConfiguration: {
                    //         iceServers: [
                    //             {urls: 'stun:stun.voiparound.com'},
                    //             {urls: 'stun:stun.voipbuster.com'},
                    //             {urls: 'stun:stun.l.google.com:19302'}
                    //         ]
                    //     }
                    // }
                }
            });
            this.setupSession();
        } catch (ex) {
            this.logger.error('Make a Call Error:', ex);
        }
    }


    answer() {
        if (this.state !== C.STATUS_NEW && this.state !== C.STATUS_CONNECTING) {
            this.logger.warn('No call to answer');
            return;
        }
        // Safari hack, because you cannot call .play() from a non user action
        if (this.options.media.remote.audio) {
            this.options.media.remote.audio.autoplay = true;
        }
        if (this.options.media.remote.video) {
            this.options.media.remote.video.autoplay = true;
        }
        return this.session.accept({
            sessionDescriptionHandlerOptions: {
                constraints: {
                    audio: this.audio,
                    video: this.video
                }
            }
        });
        // emit call is active
    }

    reject() {
        if (this.state !== C.STATUS_NEW && this.state !== C.STATUS_CONNECTING) {
            this.logger.warn('Call is already answered');
            return;
        }
        return this.session.reject();
    }

    hangup() {
        if (this.state !== C.STATUS_CONNECTED && this.state !== C.STATUS_CONNECTING && this.state !== C.STATUS_NEW) {
            this.logger.warn('No active call to hang up on');
            return;
        }
        if (this.state !== C.STATUS_CONNECTED) {
            return this.session.cancel();
        } else {
            return this.session.bye();
        }
    }
    hold() {
        if (this.state !== C.STATUS_CONNECTED || this.session.local_hold) {
            this.logger.warn('Cannot put call on hold');
            return;
        }
        this.mute();
        this.logger.log('Placing session on hold');
        return this.session.hold();
    }
    unhold() {
        if (this.state !== C.STATUS_CONNECTED || !this.session.local_hold) {
            this.logger.warn('Cannot unhold a call that is not on hold');
            return;
        }
        this.unmute();
        this.logger.log('Placing call off hold');
        return this.session.unhold();
    }

    mute() {
        if (this.state !== C.STATUS_CONNECTED) {
            this.logger.warn('An acitve call is required to mute audio');
            return;
        }
        this.logger.log('Muting Audio');
        this.toggleMute(true);
        this.emit('mute', this);
    }

    unmute() {
        if (this.state !== C.STATUS_CONNECTED) {
            this.logger.warn('An active call is required to unmute audio');
            return;
        }
        this.logger.log('Unmuting Audio');
        this.toggleMute(false);
        this.emit('unmute', this);
    }

    sendDTMF(tone) {
        if (this.state !== C.STATUS_CONNECTED) {
            this.logger.warn('An active call is required to send a DTMF tone');
            return;
        }
        this.logger.log('Sending DTMF tone: ' + tone);
        this.session.dtmf(tone);
    }

    message(destination, message) {
        if (!this.client || !this.checkRegistration()) {
            this.logger.warn('A registered UA is required to send a message');
            return;
        }
        if (!destination || !message) {
            this.logger.warn('A destination and message are required to send a message');
            return;
        }
        this.client.message(destination, message);
    }

    toggleMute(mute) {
        const pc = this.session.sessionDescriptionHandler.peerConnection;
        if (pc.getSenders) {
            pc.getSenders().forEach(function (sender) {
                if (sender.track) {
                    sender.track.enabled = !mute;
                }
            });
        } else {
            pc.getLocalStreams().forEach(function (stream) {
                stream.getAudioTracks().forEach(function (track) {
                    track.enabled = !mute;
                });
                stream.getVideoTracks().forEach(function (track) {
                    track.enabled = !mute;
                });
            });
        }
    }



    async onInvite(session) {
        try {
            if (this.state !== C.STATUS_NULL && this.state !== C.STATUS_COMPLETED) {
                this.logger.warn('Rejecting incoming call. Simple only supports 1 call at a time');
                session.reject();
                return;
            }
            this.session = session;
            this.setupSession();
            this.emit('ringing', this.session);
            // this.logger.debug('Accept a Aclling');
            // const remoteVideo: HTMLVideoElement = <HTMLVideoElement>document.getElementById('remoteVideo');
            // const localVideo: HTMLVideoElement = <HTMLVideoElement>document.getElementById('localVideo');

            // this.session.once('trackAdded', () => {
            //     // We need to check the peer connection to determine which track was added

            //     // this.session.sessionDescriptionHandler.setDescription('Liny', {
            //     //     constraints: {
            //     //         audio: true,
            //     //         video: false
            //     //     }
            //     // });

            //     const pc = this.session.sessionDescriptionHandler.peerConnection;

            //     // Gets remote tracks
            //     const remoteStream = new MediaStream();
            //     pc.getReceivers().forEach(function (receiver) {
            //         remoteStream.addTrack(receiver.track);
            //     });
            //     remoteVideo.srcObject = remoteStream;
            //     const playPromise = remoteVideo.play();
            //     if (playPromise !== undefined) {
            //         playPromise.then(_ => {
            //             // Automatic playback started!
            //             // Show playing UI.
            //             // We can now safely pause video...
            //             // remoteVideo.pause();
            //         })
            //             .catch(error => {
            //                 // Auto-play was prevented
            //                 // Show paused UI.
            //             });
            //     }
            //     // Gets local tracks
            //     const localStream = new MediaStream();
            //     pc.getSenders().forEach(function (sender) {
            //         localStream.addTrack(sender.track);
            //     });
            //     localVideo.srcObject = localStream;
            //     const localeplayPromise = localVideo.play();
            //     if (localeplayPromise !== undefined) {
            //         localeplayPromise.then(_ => {
            //             // Automatic playback started!
            //             // Show playing UI.
            //             // We can now safely pause video...
            //             // localeplayPromise.pause();
            //         })
            //             .catch(error => {
            //                 // Auto-play was prevented
            //                 // Show paused UI.
            //             });
            //     }
            // });
            // this.session.accept();
        } catch (ex) {
            this.logger.error('Accept A Call Error:', ex);
        }
    }

    setupSession() {
        this.state = C.STATUS_NEW;
        this.emit('new', this.session);
        this.session.on('progress', this.onProgress.bind(this));
        this.session.on('accepted', this.onAccepted.bind(this));
        this.session.on('rejected', this.onEnded.bind(this));
        this.session.on('failed', this.onFailed.bind(this));
        this.session.on('terminated', this.onEnded.bind(this));
    }

    onProgress() {
        this.state = C.STATUS_CONNECTING;
        this.emit('connecting', this.session);
    }

    onAccepted() {
        this.state = C.STATUS_CONNECTED;
        this.emit('connected', this.session);

        this.setupLocalMedia();
        this.setupRemoteMedia();
        this.session.sessionDescriptionHandler.on('addTrack', function () {
            this.logger.log('A track has been added, triggering new remoteMedia setup');
            this.setupRemoteMedia();
        }.bind(this));

        this.session.sessionDescriptionHandler.on('addStream', function () {
            this.logger.log('A stream has been added, trigger new remoteMedia setup');
            this.setupRemoteMedia();
        }.bind(this));

        this.session.on('hold', function () {
            this.emit('hold', this.session);
        }.bind(this));
        this.session.on('unhold', function () {
            this.emit('unhold', this.session);
        }.bind(this));
        this.session.on('dtmf', function (tone) {
            this.emit('dtmf', tone);
        }.bind(this));
        this.session.on('bye', this.onEnded.bind(this));
    }

    onFailed() {
        this.onEnded();
    }

    onEnded() {
        this.state = C.STATUS_COMPLETED;
        this.emit('ended', this.session);
        this.cleanupMedia();
    }

    emit(t: string, session: any) {
        this.eventSource.next({ t, session });
    }

    setupLocalMedia() {
        if (this.video && this.options.media.local && this.options.media.local.video) {
            const pc = this.session.sessionDescriptionHandler.peerConnection;
            let localStream;
            if (pc.getSenders) {
                localStream = new MediaStream();
                pc.getSenders().forEach(function (sender) {
                    const track = sender.track;
                    if (track && track.kind === 'video') {
                        localStream.addTrack(track);
                    }
                });
            } else {
                localStream = pc.getLocalStreams()[0];
            }
            this.options.media.local.video.srcObject = localStream;
            this.options.media.local.video.volume = 0;
            this.options.media.local.video.play();
        }
    }

    setupRemoteMedia() {
        // If there is a video track, it will attach the video and audio to the same element
        const pc = this.session.sessionDescriptionHandler.peerConnection;
        let remoteStream;

        if (pc.getReceivers) {
            remoteStream = new MediaStream();
            pc.getReceivers().forEach(function (receiver) {
                const track = receiver.track;
                if (track) {
                    remoteStream.addTrack(track);
                }
            });
        } else {
            remoteStream = pc.getRemoteStreams()[0];
        }
        if (this.video) {
            this.options.media.remote.video.srcObject = remoteStream;
            this.options.media.remote.video.play().catch(function () {
                this.logger.log('play was rejected');
            }.bind(this));
        } else if (this.audio) {
            this.options.media.remote.audio.srcObject = remoteStream;
            this.options.media.remote.audio.play().catch(function () {
                this.logger.log('play was rejected');
            }.bind(this));
        }
    }

    cleanupMedia() {
        if (this.video) {
            this.options.media.remote.video.srcObject = null;
            this.options.media.remote.video.pause();
            if (this.options.media.local && this.options.media.local.video) {
                this.options.media.local.video.srcObject = null;
                this.options.media.local.video.pause();
            }
        }
        if (this.audio) {
            this.options.media.remote.audio.srcObject = null;
            this.options.media.remote.audio.pause();
        }
    }


    async sendMsg(livechatSessionId: string, sendTo: string, msg: string): Promise<string> {
        try {
            const remsg = await new Promise<string>((resolve, reject) => {
                msg = msg.replace(/(^\s+)|(\s+$)/g, '');
                if (!msg) {
                    msg = '无言以对(^_^)';
                }
                const session = this.client.message('relivechat', msg,
                    {
                        contentType: 'text/plain', extraHeaders: [`X-Livechat-Visitor:${sendTo}`,
                        `X-Session-Id:${livechatSessionId}`]
                    });
                session.once('progress', (response, cause) => {
                    this.logger.debug('send msg progress', cause);
                });
                session.once('accepted', (response, cause) => {
                    this.logger.debug('send msg accepted', cause);
                    resolve(msg);
                });
                session.once('rejected', (response, cause) => {
                    this.logger.debug('send msg rejected', cause);
                });
                session.once('failed', (response, cause) => {
                    this.logger.debug('send msg failed', cause);
                    reject(cause);
                });
            });
            return remsg;

        } catch (ex) {
            this.logger.error('Send A Message Error:', ex);
        }
    }


    handleChatMsg(msg: any) {
        this.logger.debug('新消息来了:', msg);
        this.chatMessageSource.next(msg);
    }

    getChatMessage(): Observable<any> {
        return this.chatMessage$;
    }
}
