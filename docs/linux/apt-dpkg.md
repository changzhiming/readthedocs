# Ubuntu APT 命令详解


## 1. `apt` 和 `apt-get` 的区别

- `apt` 是 `apt-get` 和 `apt-cache` 的功能整合版，旨在为用户提供更友好的命令行界面
- 自 Ubuntu 16.04 起，`apt` 就推荐作为主要的包管理工具
- `apt` 更关注终端用户的使用体验（更易读的输出、更友好的提示等）
- `apt-get` 更适合脚本中的使用

## 2. 基本操作命令

| 命令 | 功能 | 示例 |
|------|------|------|
| `sudo apt update` | 更新软件包列表 | `sudo apt update` |
| `sudo apt upgrade` | 升级已安装的软件包 | `sudo apt upgrade` |
| `sudo apt full-upgrade` | 完整升级（可能删除旧依赖） | `sudo apt full-upgrade` |
| `sudo apt dist-upgrade` | 发行版升级 | `sudo apt dist-upgrade` |


## 3. 软件包管理

| 命令 | 功能 | 示例 |
|------|------|------|
| `sudo apt install <包名>` | 安装软件包 | `sudo apt install vim` |
| `sudo apt install -y <包名>` | 自动确认安装 | `sudo apt install -y nginx` |
| `sudo apt remove <包名>` | 删除软件包（保留配置） | `sudo apt remove firefox` |
| `sudo apt purge <包名>` | 完全删除软件包（含配置） | `sudo apt purge apache2` |
| `sudo apt autoremove` | 删除不需要的依赖包 | `sudo apt autoremove` |
| `sudo apt autoclean` | 清理过期的安装包缓存 | `sudo apt autoclean` |
| `sudo apt clean` | 清理所有安装包缓存 | `sudo apt clean` |

## 4. 查询和搜索

| 命令 | 功能 | 示例 |
|------|------|------|
| `apt search <关键词>` | 搜索软件包 | `apt search python` |
| `apt show <包名>` | 显示软件包详细信息 | `apt show git` |
| `apt list` | 列出所有可用软件包 | `apt list` |
| `apt list --installed` | 列出已安装软件包 | `apt list --installed` |
| `apt list --upgradable` | 列出可升级软件包 | `apt list --upgradable` |
| `dpkg -l` | 查看已安装软件包 | `dpkg -l` |
| `dpkg -l | grep <包名>` | 查找特定已安装包 | `dpkg -l | grep vim` |

## 5. 依赖关系

| 命令 | 功能 | 示例 |
|------|------|------|
| `apt depends <包名>` | 查看软件包依赖 | `apt depends firefox` |
| `apt rdepends <包名>` | 查看反向依赖 | `apt rdepends libssl1.1` |
| `sudo apt install -f` | 修复依赖关系 | `sudo apt install -f` |

## 6. 版本管理

| 命令 | 功能 | 示例 |
|------|------|------|
| `sudo apt-mark hold <包名>` | 锁定软件包版本 | `sudo apt-mark hold kernel` |
| `sudo apt-mark unhold <包名>` | 解锁软件包版本 | `sudo apt-mark unhold kernel` |
| `apt policy <包名>` | 查看软件包版本策略 | `apt policy docker.io` |
| `sudo apt install <包名>=<版本>` | 安装指定版本 | `sudo apt install vim=2:8.0.1453-1ubuntu1` |

## 7. 下载操作

| 命令 | 功能 | 示例 |
|------|------|------|
| `apt download <包名>` | 下载软件包到当前目录 | `apt download wget` |
| `sudo apt install --download-only <包名>` | 仅下载不安装 | `sudo apt install --download-only git` |

## 8. 仓库管理

| 命令 | 功能 | 示例 |
|------|------|------|
| `sudo add-apt-repository <仓库>` | 添加软件仓库 | `sudo add-apt-repository ppa:ubuntu-toolchain-r/test` |
| `sudo add-apt-repository --remove <仓库>` | 移除软件仓库 | `sudo add-apt-repository --remove ppa:ubuntu-toolchain-r/test` |
| `apt-cache policy` | 查看仓库优先级 | `apt-cache policy` |

## 9. 常用组合命令

| 命令组合 | 功能 | 示例 |
|----------|------|------|
| `sudo apt update && sudo apt upgrade` | 更新列表并升级 | `sudo apt update && sudo apt upgrade` |
| `sudo apt update && sudo apt full-upgrade` | 更新列表并完整升级 | `sudo apt update && sudo apt full-upgrade` |
| `sudo apt autoremove && sudo apt autoclean` | 清理系统 | `sudo apt autoremove && sudo apt autoclean` |

## 10. 故障排除

| 命令 | 功能 | 示例 |
|------|------|------|
| `sudo dpkg --configure -a` | 配置未完成的软件包 | `sudo dpkg --configure -a` |
| `sudo apt --fix-broken install` | 修复损坏的安装 | `sudo apt --fix-broken install` |
| `sudo dpkg --remove --force-remove-reinstreq <包名>` | 强制删除问题包 | `sudo dpkg --remove --force-remove-reinstreq bad-package` |

## 11. 日志查看

| 文件路径 | 功能 | 查看命令 |
|----------|------|----------|
| `/var/log/apt/history.log` | 安装历史日志 | `cat /var/log/apt/history.log` |
| `/var/log/apt/term.log` | 终端操作日志 | `cat /var/log/apt/term.log` |
| `/var/log/dpkg.log` | dpkg 操作日志 | `cat /var/log/dpkg.log` |

# dpkg 命令表格详解 (Ubuntu / Debian)


## 1. 安装 / 卸载 / 配置

| 命令 / 选项 | 功能说明 | 示例 | 备注 |
|-------------|----------|------|------|
| `dpkg -i <包.deb>` | 安装或升级本地 `.deb` 包 | `sudo dpkg -i nginx_*.deb` | 缺依赖后用 `sudo apt -f install` |
| `dpkg --install <包.deb>` | 同 `-i` | `sudo dpkg --install ./vim.deb` | 支持多个参数 |
| `dpkg -r <包名>` | 卸载但保留配置 | `sudo dpkg -r nginx` | ≈ `--remove` |
| `dpkg -P <包名>` | 完全卸载（含配置） | `sudo dpkg -P nginx` | ≈ `--purge` |
| `dpkg --configure <包名>` | 配置已解包未配置的包 | `sudo dpkg --configure nginx` | 处理中断安装 |
| `dpkg --configure -a` | 配置所有待配置包 | `sudo dpkg --configure -a` | 最常见救援 |
| `dpkg-reconfigure <包名>` | 重新运行 debconf 配置 | `sudo dpkg-reconfigure tzdata` | 依赖包支持 debconf |
| `dpkg --force-all -i <包.deb>` | 强制安装 | — | 极不推荐 |
| `dpkg --force-depends -r <包>` | 强制忽略依赖卸载 | — | 可能破坏系统 |

---

## 2. 查询 / 状态信息

| 命令 | 功能说明 | 示例 | 备注 |
|------|----------|------|------|
| `dpkg -l` | 列出所有“已知”包 | `dpkg -l | head` | 状态列 2~3 字符 |
| `dpkg -l <pattern>` | 模糊匹配 | `dpkg -l "vim*"` | shell 通配 |
| `dpkg -s <包名>` | 查看安装状态 & 元数据 | `dpkg -s bash` | Status 行关键 |
| `dpkg -L <包名>` | 列出包安装的文件 | `dpkg -L coreutils` | 已卸载的不适用 |
| `dpkg -S <文件路径或片段>` | 反查文件属于哪个包 | `dpkg -S /bin/ls` | 未安装文件不可 |
| `dpkg -I <包.deb>` | 查看 `.deb` 控制元数据 | `dpkg -I ./htop.deb` | 控制字段 |
| `dpkg -c <包.deb>` | 列出 `.deb` 内部文件 | `dpkg -c ./htop.deb` | 不解压 |
| `dpkg --print-architecture` | 主体系结构 | `dpkg --print-architecture` | 如 `amd64` |
| `dpkg --print-foreign-architectures` | 已启用外部架构 | 同左 | 多架构支持 |
| `dpkg-query -W -f='${Package} ${Version}\n'` | 自定义输出 | — | 脚本化 |
| `dpkg-query -L <包名>` | 同 `dpkg -L` | — | dpkg-query 子命令 |

---

## 3. 状态标志解释（`dpkg -l` 前两列）

| 标志 | 含义（简化） | 说明 |
|------|--------------|------|
| `ii` | 已安装 | install ok installed |
| `rc` | 已卸载残留配置 | remove ok config-files |
| `un` | 未安装 / 未记录 | unknown |
| `iF` | 已安装但不完整 | 文件缺失/损坏 |
| `hi` | hold + 已安装 | 被保持不升级 |
| `pn` | 从未安装 | purge/not-present |
| `rH` | 正在 remove + hold | 罕见 |
| `rv` | 已移除但配置损坏 | seldom |

（真实内部更复杂，此处列常见）

---

## 4. 版本 / 架构 / 多架构

| 命令 | 功能 | 示例 | 备注 |
|------|------|------|------|
| `dpkg --compare-versions v1 op v2` | 比较版本 | `dpkg --compare-versions 1:2.0 gt 2.0` | 退出码 0 为真 |
| `dpkg --add-architecture <arch>` | 添加外部架构 | `sudo dpkg --add-architecture i386` | 再 `apt update` |
| `dpkg --remove-architecture <arch>` | 移除外部架构 | `sudo dpkg --remove-architecture i386` | 需无依赖 |
| `dpkg --print-architecture` | 主架构 | — | |
| `dpkg --print-foreign-architectures` | 列出外部架构 | — | |

版本比较操作符见附录。

---

## 5. 文件与内容操作 / 解包

| 命令 | 功能 | 示例 | 备注 |
|------|------|------|------|
| `dpkg -x <包.deb> <目录>` | 解压数据文件 | `dpkg -x a.deb extract/` | 不含控制脚本 |
| `dpkg -X <包.deb> <目录>` | 解压+控制文件 | `dpkg -X a.deb full/` | 有 `DEBIAN/` |
| `dpkg-deb -R <包.deb> <目录>` | 重组模式（可修改） | `dpkg-deb -R a.deb workdir` | 修改后重打包 |
| `dpkg-deb -b <目录> <包.deb>` | 打包目录 | `dpkg-deb -b workdir new.deb` | 需 `DEBIAN/control` |
| `dpkg-deb --info <包.deb>` | 查看信息 | `dpkg-deb --info a.deb` | 类 `dpkg -I` |
| `dpkg-deb --contents <包.deb>` | 列出内容 | `dpkg-deb --contents a.deb` | 类 `dpkg -c` |

---

## 6. 数据库 / 选择集 / Diversion / StatOverride

| 命令 | 功能 | 示例 | 备注 |
|------|------|------|------|
| `dpkg --get-selections` | 导出包选择状态 | `dpkg --get-selections > list` | 迁移环境 |
| `dpkg --set-selections` | 导入包选择 | `sudo dpkg --set-selections < list` | 后接 `apt-get dselect-upgrade` |
| `dpkg-divert --list` | 查看所有 diversion | `dpkg-divert --list` | 文件替换机制 |
| `dpkg-divert --add --rename --divert /usr/bin/ls.real /usr/bin/ls` | 添加 diversion | — | 原文件重命名 |
| `dpkg-divert --remove /usr/bin/ls` | 移除 diversion | — | 恢复默认 |
| `dpkg-statoverride --list` | 列出权限覆盖 | `dpkg-statoverride --list` | 覆盖属主/权限 |
| `dpkg-statoverride --add root root 4755 /usr/bin/app` | 添加权限覆盖 | — | 升级保持 |
| `dpkg-statoverride --remove /usr/bin/app` | 移除覆盖 | — | 恢复包内默认 |

---

## 7. 校验 / 审计 / 修复

| 命令 | 功能 | 示例 | 备注 |
|------|------|------|------|
| `dpkg -V <包>` | 校验文件完整性 | `sudo dpkg -V coreutils` | 比对 MD5/属性 |
| `dpkg -V` | 校验全部 | 慎用 | 慢 |
| `dpkg --audit` / `dpkg -C` | 列出异常包 | `sudo dpkg --audit` | 未完成/损坏 |
| `dpkg --force-*` | 强制行为集合 | — | 慎用 |
| `dpkg --listfiles <包>` | = `dpkg -L` | — | 语义化 |
| `dpkg --verify` | 某些发行同义 | — | 兼容 |

---

## 8. 构建相关（打包流程）

| 命令 | 功能 | 示例 | 备注 |
|------|------|------|------|
| `dpkg-buildpackage -us -uc` | 构建二进制/源包 | 源目录中 | 不签名 |
| `dpkg-source -x <pkg.dsc>` | 解出源包 | `dpkg-source -x a.dsc` | |
| `fakeroot dpkg-deb -b <dir> <deb>` | 非 root 打包 | — | 保持权限视图 |
| `dpkg-shlibdeps` | 生成库依赖 | 构建脚本 | 填充 `${shlibs:Depends}` |
| `dpkg-gencontrol` | 生成 control 文件 | 内部使用 | |
| `lintian <deb>` | 质量检查 | `lintian new.deb` | 需安装 lintian |

---

## 9. 典型工作流示例

| 需求 | 命令序列 | 说明 |
|------|----------|------|
| 安装本地包并补依赖 | `sudo dpkg -i a.deb && sudo apt -f install` | 标准流程 |
| 修复中断安装 | `sudo dpkg --configure -a` | 先配置再补依赖 |
| 导出 → 迁移包集合 | `dpkg --get-selections > list` → 新机：`dpkg --set-selections < list && sudo apt-get dselect-upgrade` | 需相同仓库 |
| 查文件归属 | `dpkg -S /usr/bin/python3` | 未安装包可用 `apt-file` |
| 重打包修改 | `dpkg-deb -R a.deb work/` → 修改 → `dpkg-deb -b work/ new.deb` | 不重新签名 |
| 启用 32 位库 | `sudo dpkg --add-architecture i386 && sudo apt update` | 之后安装 `xxx:i386` |

---

## 10. `dpkg -s` / 控制文件字段说明

| 字段 | 含义 | 示例 |
|------|------|------|
| Package | 包名 | bash |
| Status | 安装状态 | install ok installed |
| Priority | 优先级 (required/optional) | required |
| Section | 分类 | shells |
| Installed-Size | 安装后占用 (KB) | 1993 |
| Maintainer | 维护者 | Debian XYZ Team |
| Architecture | 架构 | amd64 |
| Version | 包版本 | 5.1-2ubuntu5 |
| Depends | 硬依赖 | libc6 (>= 2.34) |
| Recommends/Suggests | 推荐/建议 | bash-doc |
| Description | 描述 | （多行） |
| Multi-Arch | 多架构策略 | foreign / same / allowed |
| Conffiles | 配置文件列表及哈希 | 自动合并策略使用 |

---

## 11. 与 apt 的关系与使用建议

| 场景 | 推荐工具 | 原因 |
|------|----------|------|
| 正常安装在线软件 | `apt install` | 自动处理依赖/推荐包 |
| 安装本地 `.deb` | `apt install ./file.deb` | 自动补依赖（优于 `dpkg -i`） |
| 分析损坏安装 | `dpkg --audit` + `dpkg --configure -a` | 直接访问低层数据库 |
| 查询归属文件 | `dpkg -S` | 本地已安装即可 |
| 安装列表迁移 | `dpkg --get/--set-selections` | 与 `apt-get dselect-upgrade` 协作 |
| 精准强制操作 | `dpkg --force-*` | 仅紧急情况 |
| 批量升级 | `apt upgrade` | 解决依赖、标记状态 |

最佳实践：常规用 `apt`，诊断/定制/打包再用 `dpkg`。

---

## 12. 常见错误与解决

| 错误/片段 | 含义 | 解决 |
|-----------|------|------|
| `dependency problems - leaving unconfigured` | 依赖未满足 | `sudo apt -f install` |
| `is not ready for configuration` | 前置包未配置 | `sudo dpkg --configure -a` |
| `trying to overwrite ...` | 文件冲突 | 找冲突包 → 卸载/升级；慎用 `--force-overwrite` |
| `package is in a very bad inconsistent state` | 包严重损坏 | `sudo dpkg --remove --force-remove-reinstreq <包>` |
| `dpkg: error: dpkg frontend is locked` | 被占用 | 等待，或查 `lsof /var/lib/dpkg/lock` |
| `Sub-process installed post-installation script returned error exit status 1` | 安装脚本失败 | 查看 `/var/log/dpkg.log`，手动修脚本或环境 |
| `hash sum mismatch` | 缓存损坏（apt阶段） | `sudo apt clean && sudo apt update` |

---

## 13. 安全与审计建议

| 目标 | 方法 | 补充 |
|------|------|------|
| 校验核心包未被篡改 | `sudo dpkg -V coreutils` | 输出行需要人工分析 |
| 清除残留配置 | `dpkg -l | awk '/^rc/{print $2}' | xargs sudo dpkg -P` | 先审查 |
| 统计包数量 | `dpkg -l | grep '^ii' | wc -l` | 仅已安装 |
| 列出手动安装（非依赖） | `grep " manual" /var/lib/apt/extended_states` | 配合 apt 标记 |
| 导出变更历史 | 查看 `/var/log/dpkg.log*` | gzip 压缩旧日志 |
| 对比快照 | 事前 `dpkg -l > snapshot.txt` | 之后 diff |

---

## 14. 速查小抄（Cheat Sheet）

| 目的 | 命令 |
|------|------|
| 安装本地包 | `sudo apt install ./file.deb` (首选) 或 `sudo dpkg -i file.deb` |
| 修复缺依赖 | `sudo apt -f install` |
| 查看包状态 | `dpkg -s pkg` |
| 列出包安装文件 | `dpkg -L pkg` |
| 反查文件归属 | `dpkg -S /path/file` |
| 查看 deb 元数据 | `dpkg -I file.deb` |
| 查看 deb 内部文件 | `dpkg -c file.deb` |
| 解包不安装 | `dpkg -x file.deb dir/` |
| 配置未完成包 | `sudo dpkg --configure -a` |
| 审计损坏包 | `sudo dpkg --audit` |
| 校验完整性 | `sudo dpkg -V pkg` |
| 导出安装选择 | `dpkg --get-selections > list` |
| 导入安装选择 | `dpkg --set-selections < list` |
| 添加 32位 支持 | `sudo dpkg --add-architecture i386 && sudo apt update` |

---

## 15. 实用脚本片段

列出已卸载但残留配置：
```bash
dpkg -l | awk '/^rc/{print $2}'
```

批量清理残留配置：
```bash
dpkg -l | awk '/^rc/{print $2}' | xargs -r sudo dpkg -P
```

筛出本地修改过的可执行文件（配合 `-V`）：
```bash
sudo dpkg -V | grep '^..5'   # MD5 改变
```

导出当前包+版本清单：
```bash
dpkg-query -W -f='${Package}\t${Version}\n' > packages.tsv
```

比对两台机器差异：
```bash
diff -u <(sort hostA.tsv) <(sort hostB.tsv)
```

快速查重名文件冲突（预判）：
```bash
dpkg-deb -c a.deb | awk '{print $6}' | sort > a.lst
dpkg-deb -c b.deb | awk '{print $6}' | sort > b.lst
comm -12 a.lst b.lst
```

---

## 16. 附录：版本比较操作符

`dpkg --compare-versions <v1> <op> <v2>` 支持：

| 操作符 | 同义 | 语义 |
|--------|------|------|
| `lt` | `<<` | 小于 |
| `le` | `<=` | 小于等于 |
| `eq` | `=`  | 等于 |
| `ne` | `!=` | 不等 |
| `ge` | `>=` | 大于等于 |
| `gt` | `>>` | 大于 |

示例（脚本中）：
```bash
if dpkg --compare-versions "2:1.0-3" gt "1:9.9"; then
  echo "Version is newer"
fi
```

