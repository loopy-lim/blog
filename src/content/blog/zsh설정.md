---
title: 'loopy의 zsh설정'
description: 'loopy의 zsh 설정'
pubDate: '2024/06/20'
---

# zsh를 쓰는 이유

사실 맥을 사용하기 시작하면서 zsh를 처음 사용해보았다. bash보다 더 깔끔한 설정, 더 이쁘게 만들 수 있는 것 처럼 보였고 이는 마음을 사로잡기에 충분했다.

shell을 사용하면서, "더욱 화려하게 사용하고 싶다", "더욱 효율적으로 사용하고 싶다"와 같은 생각이 들었다. 그래서 다른 사람들의 세팅을 찾아보았고, 이렇게 현재 최종적인 형태로 결정이 되어 있다.

여기에 작성하는 기준은 mac, ubuntu로 하겠다.

## 설치하기

###  Oh-My-Zsh

github는 (여기)[https://github.com/ohmyzsh/ohmyzsh]에서 확인할 수 있다.

oh-my-zsh설치는 모두 한번에 가능하게 되어 있다.

위와 같이 curl이 미리 설치 되어 있으면 oh-my-zsh를 설치할 수 있다.

```sh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

oh-my-zsh를 설치하면 다양한 plugin들을 적용할 수 있는데, 여기서는 git, sudo, colored-man-pages, zsh-syntax-highlighting, zsh-autosuggestions을 설치하겠다. 또한 다양한 테마 중 power10k를 설치하겠다.

#### zsh-syntax-highlighting

oh-my-zsh를 설치하면 git, sudo, colored-man-pages는 이미 설치되어 있다. 그래서 여기 밑에서는 2개에 관해 설치 과정을 쓰려고 한다.

설치에 관해 자세한 내용은 (여기)[https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md]에서 확인할 수 있다.

mac, ubuntu를 각각 설치할 수 있으나, 우리는 zsh라는 plugin manager를 사용하므로 쉽게 git을 clone하여 설치할 수 있다.
```sh
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

이 이후 `.zshrc` 파일의 plugins에 zsh-syntax-highlighting을 추가한다.

#### zsh-autosuggestions

위와 비슷하게 설치에 관해 자세한 내용은 (여기)[git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting]에서 확인할 수 있다.

```sh
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

마찬가지로 `.zshrc`파일의 plugins에 zsh-autosuggestions를 추가한다.

#### powerlevel10k

github는 (여기)[https://github.com/romkatv/powerlevel10k]에서 확인할 수 있다.

```sh
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

여기에서 설치를 하고 나서 zsh를 다시 실행하여 관련된 설정되로 따라가가면 된다. recommand를 따라가면 일반적으로 `p10k.zsh`라는 파일로 저장이 된다.

### Javascript

현재 필자는 web frontend developer로서 javascript를 주로 사용한다. 그래서 bun, fnm, pnpm을 미리 설치하려고 한다.

#### fnm

먼저 node를 버전에 맞추어 다운받기 위해서 간단하게 node manager를 설치하려고 한다. nvm도 충분히 좋지만, 이보다 더 빠른 fnm이라는 것이 등장하여 이를 주로 사용하고 있다.

githu는 (여기)[https://github.com/Schniz/fnm]에서 확인할 수 있다.

이를 설치하기 위해서는 curl이 필요하며, mac, ubuntu모두 동일하다.

```sh
curl -fsSL https://fnm.vercel.app/install | bash
```

fnm으로 fnm install 20와 같이 타겟하는 node version을 설치하면 node가 자동적으로 저장된다.

#### bun

자세한 설치 내용은 (여기)[https://bun.sh/docs/installation]에 있다.

```sh
curl -fsSL https://bun.sh/install | bash
```

#### pnpm

자세한 설치 내용은 (여기)[https://pnpm.io/installation]에 있다.

```sh
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### shell를 더 파워풀하게

shell을 사용하면서 불편한 것은 파일 찾는 것이다. (이 사이트)[https://github.com/josean-dev/dev-environment-files]에서 설정을 따라가다보면 정말 깔끔한 FZF와 같은 설치가 될 것이다.

## 마무리

모든 세팅을 하고 나면 다음과 같은 (zshrc)[https://gist.github.com/loopy-lim/77da579643fbcf6044eef8693916d7f8]을 얻을 수 있을 것이다.

다음에 세팅할때도 이를 참고하고 만들어보자

