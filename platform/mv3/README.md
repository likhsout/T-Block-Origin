# How to build T-Block Origin (MV3)

Instructions for reviewers.

T-Block Origin is an MV3-compliant content blocker derived from
[uBlock Origin Lite](https://github.com/uBlockOrigin/uBOL-home) (GPLv3).
The following assumes a linux environment.

1. Open Bash console
2. `git clone  https://github.com/gorhill/uBlock.git`
3. `cd uBlock`
4. `git submodule init`
5. `git submodule update`
6. `make mv3-[platform]`, where `[platform]` is either `chromium`, `edge`, `firefox`, or `safari`
7. This will fully build T-Block Origin, and during the process filter lists will be downloaded from their respective remote servers

Upon completion of the script, the resulting extension package will be present in:

- Chromium: `dist/build/TBlockOrigin.chromium`
- Edge: `dist/build/TBlockOrigin.edge`
- Firefox: `dist/build/TBlockOrigin.firefox`
- Safari: `dist/build/TBlockOrigin.safari`

The folder `dist/build/mv3-data` will cache data fetched from remote servers, so as to avoid fetching repeatedly from remote servers with repeated build commands. Use `make cleanassets` to remove all locally cached filter lists if you want to build with latest versions of filter lists.

The file `dist/build/TBlockOrigin.[platform]/log.txt` will contain information about what happened during the build process.

The entry in the `Makefile` which implements the build process is `tools/make-mv3.sh [platform]`.[1] This Bash script copies various files from the uBlock Origin branch and MV3-specific branch into a single folder which will be the final extension package.

Notably, `tools/make-mv3.sh [platform]` calls a Nodejs script whose purpose is to convert the filter lists into various rulesets to be used in a declarative way. The Nodejs version required is 17.5.0 or above.

All the final rulesets are present in the `dist/build/TBlockOrigin.[platform]/rulesets` folder in the final extension package.

---

[1] https://github.com/gorhill/uBlock/blob/c4d324362fdb95ff8ef20f0b18f42f0eec955433/tools/make-mv3.sh<br>
