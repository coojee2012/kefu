# Session Description Handler 会话描述处理程序

SessionDescriptionHandler是SIP.js与底层RTP连接交互的通用接口。

SIP.js中包含的默认会话描述处理程序与WebRTC交互以提供语音，视频和数据流。

在Node.js，移动应用程序或其他平台中使用SIP.js时，您可以使用UA的sessionDescriptionHandlerFactory配置参数定义自定义会话描述处理程序。

自定义会话描述处理程序只需要实现工厂和6种方法，如下所述。所有方法都是必需的。建议任何自定义会话描述处理程序也使用修饰符，但这不是必需的。


## 默认选项
下面列出的选项是默认WebRTC会话描述处理程序支持的选项。 SIP.js在内部并不以任何方式依赖这些选项。

该选项可以从UA上的参数sessionDescriptionHandlerFactoryOptions传入，或者作为invite或accept的SessionDescriptionHandlerOptions参数传入

### constraints 约束

WebRTC getUserMedia调用函数时使用。默认值为audio true，video true
```js
constraints: {
  audio: true,
  video: true
}
```

### iceCheckingTimeout

在设置会话时，允许浏览器在继续之前收集ICE候选者的时间（以毫秒为单位）。降低此超时将加速信令，但可能无法在某些网络拓扑中建立连接。默认值为5秒，可以设置为0.5秒。
`iceCheckingTimeout: 5000`

### alwaysAcquireMediaFirst 

Version 0.11.2+
Will call GetUserMedia and add the streams to the PeerConnection before doing any other actions such as `setRemoteDescription`. This is a workaround for some unexpected behavior in Firefox 61+. Default value is false.

### modifiers
A set of default modifiers to use every time a description is requested or set by the Session Description Handler. These modifiers will occur before modifiers passed by a specific call to the Session Description Handler.

每次在会话描述处理程序请求或设置描述时使用的一组默认修饰符.这些修饰符将在修饰符通过对会话描述处理程序的特定调用传递之前发生。

### rtcConfiguration

要传递给WebRTC [PeerConnection](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection)构造函数的参数。

### RTCOfferOptions

要传递给WebRTC Peer Connection 调用 
[createOffer](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer) 或 [createAnswer](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createAnswer)的参数。


## Default Events
下面列出的事件是默认WebRTC会话描述处理程序发出的事件。
SIP.js内部不依赖于这些事件。

### userMediaRequest

在调用getUserMedia（）并且应用程序正在等待响应时触发。

`on('userMediaRequest', function (constraints) {})`
Name	Type	Description
constraints	Object	The constraints that were used with getUserMedia().

### userMedia
Fired when getUserMedia() returned local media.

on('userMedia', function (stream) {})
Name	Type	Description
stream	MediaStream	The local media stream that was returned from getUserMedia().

### userMediaFailed

Fired when getUserMedia() has returned unsuccessfully from getting user media. Typically this might mean that the user has denied access to local media.

on('userMediaFailed', function (error) {})
Name	Type	Description
error	String	The message returned from the getUserMedia failure.

### iceGathering

Fired when the WebRTC layer has started gathering ICE candidates.

on('iceGathering', function () {})
iceCandidate
Fired each time the WebRTC layer finds an ICE candidate.

on('iceCandidate', function (candidate) {})

### iceGatheringComplete

Fired when the WebRTC layer has finished gathering ICE candidates.

on('iceGatheringComplete', function () {})
iceConnection
Fired when the ICE connection state is new.

### iceConnectionChecking

Fired when the ICE connection state is checking.

### iceConnectionConnected

Fired when the ICE connection state is connected.

### iceConnectionCompleted

Fired when the ICE connection state is completed.

### iceConnectionFailed

Fired when the ICE connection state is failed.

### iceConnectionDisconnected

Fired when the ICE connection state is disconnected.

### iceConnectionClosed

Fired when the ICE connection state is closed.

### getDescription

Fired when the browser completes the WebRTC getDescription function.

on('getDescription', function (sdpWrapper) {})
Name	Type	Description
sdpWrapper	Object	The sdpWrapper used by getDescription.
sdpWrapper.type	String	Can be either ‘offer’ or ‘answer’ depending on which type of SDP was gotten from the browser.
sdpWrapper.sdp	String	The SDP that was gotten from the browser.

### setDescription

Fired when the browser completes the WebRTC setDescription function.

on('setDescription', function (sdpWrapper) {})
Name	Type	Description
sdpWrapper	Object	The sdpWrapper used by setDescription.
sdpWrapper.type	String	Can be either ‘offer’ or ‘answer’ depending on which type of SDP was received.
sdpWrapper.sdp	String	The SDP that was received.

### addStream

Fired when a new stream is added to the PeerConnection.

Deprecated. Note: This has been deprecated in the WebRTC api for the new addTrack event instead. Neither api is currently fully supported in all browser enviornments.
on('addStream', function (stream) {})
Name	Type	Description
stream	Object	The stream that was added to the PeerConnection.

### addTrack

Fired when a new track is added to the PeerConnection.

on('addTrack', function (track) {})
Name	Type	Description
track	Object	The track that was added to the PeerConnection.
