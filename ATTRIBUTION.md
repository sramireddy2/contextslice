# Attribution

## Simple Design System (Figma community file)

`snapshots/` contains an unmodified REST API export (gzip-compressed JSON) of a duplicate of
**Simple Design System** by Figma, published on Figma Community:
https://www.figma.com/community/file/1380235722331273046/simple-design-system

Licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
The export is redistributed here so that every result in this repository can be reproduced
offline, without a Figma account. No changes were made to the design; derived artifacts produced
by ContextSlice (compiled context bundles, statistics) are computed from it.

## figma/sds (React implementation)

`vendor/sds` is a git submodule pinned to a specific commit of https://github.com/figma/sds,
licensed under the MIT License (see `vendor/sds/LICENSE`). ContextSlice reads its design-token
dump (`scripts/tokens/tokens.json`) and Code Connect files (`figma.config.json`, `src/figma/**`).
