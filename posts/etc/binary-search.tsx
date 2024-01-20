import { OLogN, Video } from "../../_components/mod.ts"

export const date = new Date("2023-11-12")
export const title = "생활에 도움이 되는 이진 탐색"

const preface = (
	<section>
		<p>
			쓰던 도구에 오류가 나면 해결하느라 하루를 꼬박 낭비하게 된다. 그런데 원인은 놀랄 만큼
			간단한 경우가 많다. 수학의 힘을 써서 시간을 아낄 방법이 없을까? 이진 탐색을 쓰면 된다.
			{" "}
			{<OLogN />} 시간 안에 원인을 찾을 수 있다.
		</p>
	</section>
)

const git = (
	<section>
		<h2>
			<a href="https://git-scm.com/docs/git-bisect">Git Bisect</a>
		</h2>
		<p>
			git으로 작업할 때{" "}
			<a href="https://en.wikipedia.org/wiki/Atomic_commit">
				최소 단위별로 커밋
			</a>하면 좋다. <code>git bisect</code>
			를 쓸 수 있기 때문이다.{" "}
		</p>
		<p>
			<img
				height="400px"
				src="https://user-images.githubusercontent.com/54838975/238132943-97b2b10a-0397-4991-b57c-d445fb2ac099.png"
			/>
			<a href="https://github.com/cataclysmbnteam/Cataclysm-BN/pull/2823">
				메뉴 순서가 제멋대로 섞이는 문제
			</a>를 해결한 적이 있다. 이진 탐색으로 문제 커밋을 30분 만에 발견했다.{" "}
			<a href="https://en.cppreference.com/w/cpp/container/vector">
				<code>vector</code>
			</a>를{" "}
			<a href="https://en.cppreference.com/w/cpp/container/set">
				<code>set</code>
			</a>으로 바꾼 것이 원인이었다. 커밋 내역이 많아 GPT에게 물어보느라 시간이 걸렸다. 개별
			커밋 크기를 줄였다면 좋았을 것이다.
		</p>
	</section>
)

const vscode = (
	<section>
		<h2>
			<a href="https://code.visualstudio.com/blogs/2021/02/16/extension-bisect">
				VSCode Extension Bisect
			</a>
		</h2>
		<Video src="https://user-images.githubusercontent.com/54838975/282286276-a90d208a-2cfa-4819-8f9e-ece12f6354c9.mp4" />
		<p>
			하루 전부터 한글 입력때마다 입력창이 겹쳐 재부팅도 해 보고, 입력기도 바꾸어 보았으나
			해결되지 않아 고민하던 차에 VSCode에서 확장 프로그램을 이진 탐색할수 있다는 것이
			떠올랐다.
		</p>
		<img src="https://user-images.githubusercontent.com/54838975/282285995-4736db8a-e40c-4989-aab9-a0619ad55111.png" />
		<p>
			원인은 마지막에 설치한 확장 프로그램이 입력기와 충돌을 일으켜서였다. 지우고 나니
			멀쩡해졌다.
		</p>
	</section>
)

export default () => (
	<>
		{preface}
		{git}
		{vscode}
		{
			/* <section>
			<h3>VSCode</h3>
			<Video src="https://user-images.githubusercontent.com/54838975/282286276-a90d208a-2cfa-4819-8f9e-ece12f6354c9.mp4" />

		</section> */
		}
	</>
)
