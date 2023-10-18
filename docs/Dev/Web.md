---
draft: true
---
# Web

## Data flow

```mermaid
web <--> 	XMLHttpRequest	- http
			fetch			- http
			WebSocket		- websocket	RFC 6455
			Web Storage
			Indexed Database API
			サービスワーカー API	-	Cache API
			Web Notifications API
			Web Push API
chrome extension <- Native messaging -> App
```