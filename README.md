通过 WebRTC DataChannel 跑内容传输

https://developers.cloudflare.com/realtime/sfu/datachannels/

目前进度： 

Cloudflare worker 不支持 UDP。通过 TCP连接到 CF SFU 太麻烦。需要DTLS协议栈

CF SFU 只能  peer 到 peer 中转。

放弃
