import { Injectable, Injector } from '@angular/core';
import { LoggerService } from './LogService';
import { environment } from './../../environments/environment';

@Injectable()
export class SIPService {
    public client: any;
    private session: any;
    constructor(private logger: LoggerService) {
        this.client = null;
        this.session = null;
    }

    async init() {
        try {
            await new Promise((resolve, reject) => {
                this.client = new SIP.UA({
                    // Replace this IP address with your FreeSWITCH IP address
                    uri: '1002@192.168.2.230',
                    // Replace this IP address with your FreeSWITCH IP address
                    // and replace the port with your FreeSWITCH ws port
                    transportOptions: {
                        wsServers: 'ws://192.168.2.230:5066',
                    },
                    // FreeSWITCH Default Username
                    authorizationUser: '1002',
                    // FreeSWITCH Default Password
                    password: '123456',
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
                this.client.on('message', (message) => {
                    this.logger.info('接收消息:', message.body);
                });
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
            const remoteVideo = document.getElementById('remoteVideo');
            const localVideo = document.getElementById('localVideo');

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
}
