# bash-arena — imagen base de práctica para los contenedores de sesión
# Incluye todas las herramientas del temario. El motor crea un contenedor
# efímero por sesión a partir de esta imagen y le aplica hardening en runtime
# (--network none, --cap-drop ALL + subconjunto, pids/mem/cpu limit).

FROM ubuntu:24.04 AS base

ENV DEBIAN_FRONTEND=noninteractive \
    TZ=UTC \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

RUN apt-get update && apt-get install -y --no-install-recommends \
      coreutils bash-completion man-db manpages manpages-dev \
      less vim nano tmux tree file \
      grep sed gawk findutils diffutils patch \
      tar gzip bzip2 xz-utils zip unzip p7zip-full \
      curl wget netcat-openbsd iproute2 telnet bind9-host dnsutils \
      procps psmisc lsof sysstat binutils \
      dnsmasq-base libxml2-utils \
      jq gawk bc time colordiff \
      sudo locales iputils-ping \
      python3 xxd ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# render de man pages sin pager bloqueante de PATH raro
RUN echo "man() { /usr/bin/man \"\$@\" < /dev/null | /usr/bin/col -b; }" >> /etc/bash.bashrc

# generador del prompt de arena: escribe /home/agent/.bashrc con PS1 del nivel
COPY docker/arena-prompt.sh /usr/local/bin/arena-prompt
RUN chmod 0755 /usr/local/bin/arena-prompt

# usuario de trabajo (no root en runtime normal); ubuntu:24.04 trae un usuario
# 'ubuntu' por defecto con UID 1000, lo eliminamos para dejar el UID libre.
ENV HOME=/home/agent
RUN userdel -r ubuntu 2>/dev/null || true
RUN useradd -m -u 1000 -s /bin/bash agent \
    && echo 'agent ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/999-agent \
    && chmod 0440 /etc/sudoers.d/999-agent \
    && mkdir -p /home/agent /tmp \
    && chown -R agent:agent /home/agent

USER agent
WORKDIR /home/agent

# contenedor vivo indefinido; el backend lo termina (idle timeout / sesión max)
CMD ["tail", "-f", "/dev/null"]
