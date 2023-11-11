import { defPost } from "../../load_post.ts"

const title = "간단한 게 최고"
const summary = "왜 프레임워크 없이 블로그를 만들려는 걸까?"
const post = /*md*/ `
## 안녕안녕

ㅁㄴㅇㄻㄹㄴㅇㅁㄹㄴㅇ

![](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png)
`

export default defPost({
	ko: { title, summary, post },
})
