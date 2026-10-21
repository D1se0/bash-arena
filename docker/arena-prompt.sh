#!/bin/bash
# bash-arena — genera /home/agent/.bashrc con el prompt del nivel
set -euo pipefail
[ "$#" -eq 2 ] || { echo "uso: arena-prompt LEVEL TRACK" >&2; exit 2; }
LEVEL="$1"; TRACK="$2"
tmp=$(mktemp)
cat > "$tmp" <<ASA
# .bashrc generado por bash-arena — nivel: $LEVEL · $TRACK
export PATH="$HOME/.local/bin:/usr/games:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
export TERM="\${TERM:-xterm-256color}"
export LANG="\${LANG:-C.UTF-8}"
alias ls='ls --color=auto'
alias ll='ls -laF --color=auto'
alias grep='grep --color=auto'
PROMPT_COMMAND='printf "\\033]133;A\\a"'
PS1='\[\e[38;5;140m\][$LEVEL · $TRACK]\[\e[0m\]\n\[\e[38;5;110m\]agent@dojo\[\e[0m\]:\w\$ '
ASA
install -m 644 -o agent -g agent "$tmp" /home/agent/.bashrc
rm -f "$tmp"
