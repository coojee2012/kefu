import { Injectable, Injector } from '@angular/core';
import { LoggerService } from './LogService';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { MyReplaySubject } from '../utils/MyRelaySubject';
@Injectable()
export class SIPService {
    public client: any;
    private session: any;
    private chatMessageSource: MyReplaySubject<any>;
    private chatMessage$: Observable<any>;
    constructor(private logger: LoggerService) {
        this.client = null;
        this.session = null;
        this.chatMessageSource = new MyReplaySubject<any>();
        this.chatMessage$ = this.chatMessageSource.asObservable();
    }

    async init(options: any) {
        try {
            await new Promise((resolve, reject) => {
                this.client = new SIP.UA({
                    // Replace this IP address with your FreeSWITCH IP address
                    uri: `${options.exten}@${options.domain}`,
                    // Replace this IP address with your FreeSWITCH IP address
                    // and replace the port with your FreeSWITCH ws port
                    transportOptions: {
                        wsServers: 'ws://192.168.2.230:5066',
                    },
                    // FreeSWITCH Default Username
                    authorizationUser: options.exten,
                    // FreeSWITCH Default Password
                    password: options.password,
                    register: true,
                    // sessionDescriptionHandlerFactory: (session, options) => {
                    //     return new SessionDescriptionHandler(session, options);
                    // },
                    sessionDescriptionHandlerFactoryOptions: {
                        constraints: {
                            audio: true,
                            video: false
                        }
                    }
                });
                let registered = false;
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
                this.client.on('registered', onRegistered);
                this.client.on('registrationFailed', onRegistionFailed);
                this.client.on('invite', this.acceptACall.bind(this));
                this.client.on('message', this.handleChatMsg.bind(this));
                this.client.start();
            });
        } catch (ex) {
            this.logger.error('SIP INIT ERROR:', ex);
        }
    }

    async makeACall() {
        try {
            this.session = this.client.invite('1001', {
                sessionDescriptionHandlerOptions: {
                    constraints: {
                        audio: true,
                        video: false
                    }
                },
            });
        } catch (ex) {
            this.logger.error('Make a Call Error:', ex);
        }
    }

    async acceptACall(session) {
        try {
            this.session = session;
            this.logger.debug('Accept a Aclling');
            const remoteVideo: HTMLVideoElement = <HTMLVideoElement>document.getElementById('remoteVideo');
            const localVideo: HTMLVideoElement = <HTMLVideoElement>document.getElementById('localVideo');

            this.session.once('trackAdded', () => {
                // We need to check the peer connection to determine which track was added

                // this.session.sessionDescriptionHandler.setDescription('Liny', {
                //     constraints: {
                //         audio: true,
                //         video: false
                //     }
                // });

                const pc = this.session.sessionDescriptionHandler.peerConnection;

                // Gets remote tracks
                const remoteStream = new MediaStream();
                pc.getReceivers().forEach(function (receiver) {
                    remoteStream.addTrack(receiver.track);
                });
                remoteVideo.srcObject = remoteStream;
                const playPromise = remoteVideo.play();
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        // Automatic playback started!
                        // Show playing UI.
                        // We can now safely pause video...
                        // remoteVideo.pause();
                    })
                        .catch(error => {
                            // Auto-play was prevented
                            // Show paused UI.
                        });
                }
                // Gets local tracks
                const localStream = new MediaStream();
                pc.getSenders().forEach(function (sender) {
                    localStream.addTrack(sender.track);
                });
                localVideo.srcObject = localStream;
                const localeplayPromise = localVideo.play();
                if (localeplayPromise !== undefined) {
                    localeplayPromise.then(_ => {
                        // Automatic playback started!
                        // Show playing UI.
                        // We can now safely pause video...
                        // localeplayPromise.pause();
                    })
                        .catch(error => {
                            // Auto-play was prevented
                            // Show paused UI.
                        });
                }
            });
            this.session.accept();
        } catch (ex) {
            this.logger.error('Accept A Call Error:', ex);
        }
    }


    async sendMsg(livechatSessionId: string, sendTo: string, msg: string): Promise<string> {
        try {
            const remsg = await new Promise<string>((resolve, reject) => {
                msg = msg.replace(/(^\s+)|(\s+$)/g, '');
                if (!msg) {
                    msg = '无言以对(^_^)';
                }
                this.session = this.client.message('relivechat', msg,
                    {
                        contentType: 'text/plain', extraHeaders: [`X-Livechat-Visitor:${sendTo}`,
                        `X-Session-Id:${livechatSessionId}`]
                    });
                this.session.once('progress', (response, cause) => {
                    this.logger.debug('send msg progress', cause);
                });
                this.session.once('accepted', (response, cause) => {
                    this.logger.debug('send msg accepted', cause);
                    resolve(msg);
                });
                this.session.once('rejected', (response, cause) => {
                    this.logger.debug('send msg rejected', cause);
                });
                this.session.once('failed', (response, cause) => {
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
