import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MyReplaySubject } from '../utils/MyRelaySubject';
import { HOST } from '../config/config';
import { MyHttp } from './my-http';
import { UserService } from '../services/user';
import { MsgService } from '../services/msg';

declare var require;

// var io = require('../assets/js/socket.io-1.4.5');
var SIP = require('../assets/js/sip.js');
@Injectable()
export class BackEnd {
    private socket: any;

    private token;
    private ownId;

    //连接完触发
    // private onStatusChangedSubject = new ReplaySubject(1);
    // public onStatusChanged = this.onStatusChangedSubject.asObservable();

    private onForceQuitSubject = new Subject();
    public onForceQuit = this.onForceQuitSubject.asObservable();

    private stateSubject = new BehaviorSubject<number>(0);          //0-未连接  1-正在连接  //2-已连接
    public state$ = this.stateSubject.asObservable();

    private pushMsgSubject = new MyReplaySubject();
    public pushMsg$ = this.pushMsgSubject.asObservable();

    private pushUserModedSubject = new MyReplaySubject();
    public pushUserModed$ = this.pushUserModedSubject.asObservable();

    public client: any;
    private session: any;
    constructor(
        private myhttp: MyHttp,
        // private userService: UserService,
        // private msgService: MsgService,
    ) {
        this.client = null;
        this.session = null;
    }


    //连接
    connect(token, ownId) {
        this.token = token;
        this.ownId = ownId;
        this.myhttp.setToken(token);
        this.connectSocket(token);
    }

    //断开连接
    disconnect() {
        this.token = null;
        this.ownId = null;
        this.myhttp.removeToken();
        this.disconnectSocket();
    }

    // getSource(){
    //     this.userService.getSource();
    //     this.msgService.getSource();
    // }

    clearSource() {
        //清除上一个用户的数据
        this.pushMsgSubject.clearBuffer();
        this.pushUserModedSubject.clearBuffer();
    }

    getToken() {
        return this.token;
    }

    getOwnId() {
        return this.ownId;
    }

    private connectSocket(token): Promise<any> {
        // return new Promise((resolve, reject) => {
        //     this.socket = io.connect(HOST, {
        //         query: {
        //             token: this.token
        //         }
        //     });

        //     let init = () => {

        //         this.socket.on('connect', msg => {
        //             this.stateSubject.next(2);
        //             console.log('connect:连接成功');
        //         });

        //         this.socket.on('connect_error', msg => {
        //             this.stateSubject.next(0);
        //             console.log('connect_error:连接失败');
        //         });

        //         this.socket.on('connect_timeout', msg => {
        //             this.stateSubject.next(0);
        //             console.log('connect_timeout:连接超时');
        //         });

        //         this.socket.on('disconnect', msg => {
        //             this.stateSubject.next(0);
        //             console.log('disconnect:断开连接');
        //         });

        //         this.socket.on('reconnect_attempt', msg => {
        //             this.stateSubject.next(1);
        //             console.log('reconnect_attempt:尝试重连');
        //         });

        //         this.socket.on('reconnecting', msg => {
        //             this.stateSubject.next(1);
        //             console.log('reconnecting:重连中');
        //         });

        //         this.socket.on('reconnect', msg => {
        //             this.stateSubject.next(2);
        //             console.log('reconnect:重连成功');
        //         });

        //         this.socket.on('reconnect_error', msg => {
        //             this.stateSubject.next(0);
        //             console.log('reconnect_error:重连失败');
        //         });

        //         //推送消息
        //         this.socket.on('pushMsg', (msgs, ask) => {
        //             //如果是多条消息
        //             msgs.forEach(msg => {
        //                 this.pushMsgSubject.next(msg);
        //             });

        //             //传回服务器，删除存储记录
        //             var msgIds = msgs.map(msg => {
        //                 return msg._id;
        //             });
        //             ask(msgIds);

        //         });

        //         //推送修改过的user
        //         this.socket.on('pushUserModed', user => {
        //             this.pushUserModedSubject.next(user);
        //         });


        //         //强迫下线
        //         this.socket.on('forceQuit', msg => {
        //             this.onForceQuitSubject.next();
        //             this.socket.close();
        //         });

        //     }
        //     init();
        //     // this.socket.open();


        //     //登录
        //     this.socket.emit('login', token, (isOK) => {
        //         this.stateSubject.next(2);
        //         resolve();
        //     });

        // });

        return this.init({exten:'1002',domain:'163.com',password:'123123'});

    }

    private disconnectSocket() {
        if (this.socket) {
            this.socket.close();
            this.socket.off();
        }
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
                    console.error('registrationFailed:', response, cause);
                    // this.client.removeListener();
                    this.stateSubject.next(0);
                    reject(cause);
                };
                const onRegistered = () => {
                    console.info('registered');
                    registered = true;
                    this.stateSubject.next(2);
                    resolve();
                };
                this.client.setMaxListeners(1000);
                this.client.on('registered', onRegistered);
                this.client.on('registrationFailed', onRegistionFailed);
                this.client.on('invite', this.acceptACall.bind(this));
                this.client.on('message', this.handleChatMsg.bind(this));
                this.client.start();
            });
            return Promise.resolve();
        } catch (ex) {
            console.error('SIP INIT ERROR:', ex);
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
            console.error('Make a Call Error:', ex);
        }
    }

    async acceptACall(session) {
        try {
            this.session = session;
            console.debug('Accept a Aclling');
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
            console.error('Accept A Call Error:', ex);
        }
    }


    async sendMsg(msg: string) {
        try {

            this.session = this.client.message('1001', msg);
            this.session.on('progress', (response, cause) => {
                console.debug('send msg progress', cause);
            });
            this.session.on('accepted', (response, cause) => {
                console.debug('send msg accepted', cause);
            });
            this.session.on('rejected', (response, cause) => {
                console.debug('send msg rejected', cause);
            });
            this.session.on('failed', (response, cause) => {
                console.debug('send msg failed', cause);
            });

        } catch (ex) {
            console.error('Send A Message Error:', ex);
        }
    }


    handleChatMsg(msg: any) {
        this.pushMsgSubject.next(msg);
    }

    getChatMessage(): Observable<any> {
        return this.pushMsg$;
    }

}