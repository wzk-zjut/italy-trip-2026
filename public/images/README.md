# 景点图片放这里

把图片文件放进这个文件夹（`public/images/`），页面就会自动显示对应景点的图。
**没放的图不会报错、不影响使用**；放进去后刷新即可看到。

- 路径规则：`public/images/xxx.jpg` 对应页面里写的 `/images/xxx.jpg`。
- 一个景点可放多张：在后台该景点的「图片路径」里每行写一个路径即可。
- 格式随意（jpg / png / webp 均可），文件名保持和路径一致。

## 种子数据里已经为每个景点预留了下面这些文件名

只要把照片按这些名字丢进 `public/images/`，对应景点就会出现配图。想改名字/加图，去 `/admin` 后台对应那天的「景点 / 图片」里编辑即可。

**罗马**
- `piazza-venezia.jpg`（威尼斯广场）、`pantheon.jpg`（万神殿）、`piazza-navona.jpg`（纳沃纳广场）、`trevi.jpg`（特莱维喷泉）、`spanish-steps.jpg`（西班牙广场）
- `vatican-museums.jpg`（梵蒂冈博物馆）、`sistine-chapel.jpg`（西斯廷礼拜堂）、`piazza-san-pietro.jpg`（圣彼得广场）、`st-peters.jpg`（圣彼得大教堂）、`castel-santangelo.jpg`（圣天使堡）
- `colosseo.jpg`（斗兽场）、`arch-constantine.jpg`（君士坦丁凯旋门）、`roman-forum.jpg`（古罗马广场）、`palatine.jpg`（帕拉蒂尼山）

**佛罗伦萨**
- `florence-duomo.jpg`（圣母百花大教堂）、`piazza-signoria.jpg`（领主广场）、`ponte-vecchio.jpg`（老桥）、`piazzale-michelangelo.jpg`（米开朗琪罗广场）
- `florence-baptistery.jpg`（洗礼堂）、`piazza-repubblica.jpg`（共和广场）、`arno-river.jpg`（阿诺河沿岸）、`pitti-palace.jpg`（皮蒂宫）

**米兰**
- `milano-duomo.jpg`（米兰大教堂）、`galleria-milano.jpg`（长廊）
- `castello-sforzesco.jpg`（斯福尔扎城堡）、`parco-sempione.jpg`（森皮奥内公园）、`arco-della-pace.jpg`（和平门）、`brera.jpg`（布雷拉美术馆）

**威尼斯**
- `rialto.jpg`（里亚托桥）、`piazza-san-marco.jpg`（圣马可广场）、`basilica-san-marco.jpg`（圣马可大教堂）、`grand-canal.jpg`（大运河夜景）、`accademia-bridge.jpg`（学院桥）
