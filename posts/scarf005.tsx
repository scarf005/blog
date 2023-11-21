import { md } from "../components/md.tsx"

const avatar = (
	<img
		width={200}
		height={200}
		loading="lazy"
		alt="계정 프로필 이미지"
		src="https://avatars.githubusercontent.com/u/54838975"
	/>
)

const introduction = md`
## 프로젝트

- <https://github.com/cataclysmbnteam/Cataclysm-BN>
- <https://github.com/scarf005/Marisa>
- <https://github.com/jiphyeonjeon-42>
- <https://github.com/jajaperson/iterable-utilities>
`

const contact = md`
### 연락처

- <https://https://github.com/scarf005>
- <mailto:greenscarf005@gmail.com>
`

export const title = "소개"

export default () => (
	<>
		<section>
			{introduction}
		</section>
		{contact}
	</>
)
