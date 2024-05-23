# DIS Platform

## Introduction

This software is the new and rebuilt version of DISEL Editor from our research team. Because we found that C++ and Qt is not easy to deploy on the different platforms. Our researchers always trouble with how to link the dynamic linking library and facing many unexpected problems when compiling software. Such as Antlr4 only provides binary version of MSVC and the authors of RCpp and RInside refused to supply the compatible code in MSVC.

The new version is built within Electron and React. We also supply new DIS Ontology API in JavaScript/TypeScript.

<!-- <br> -->

<!-- <div align="center">

[![Build Status][github-actions-status]][github-actions-url]
[![Github Tag][github-tag-image]][github-tag-url]

</div> -->

## Install

Clone the repo and install dependencies:

```bash
git clone https://github.com/YbJerry/DIS_platform 
cd DIS_platform
npm install
```

## Starting Development

Start the app in the `dev` environment:

```bash
npm start
```

## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

<!-- ## Docs

See our [docs and guides here](https://electron-react-boilerplate.js.org/docs/installation) -->


## Maintainers

- [Yijie Wang](https://github.com/YbJerry) [^sh]
- Deemah Alomair [^mc]
- Yanyan Wang [^sh]
- Ridha Khedri [^mc]
- Yihai Chen [^sh]

[^sh]: Shanghai University
[^mc]: McMaster University
  
<!-- 
## License

MIT © [Electron React Boilerplate](https://github.com/electron-react-boilerplate) -->

<!-- [github-actions-status]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/workflows/Test/badge.svg
[github-actions-url]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/actions
[github-tag-image]: https://img.shields.io/github/tag/electron-react-boilerplate/electron-react-boilerplate.svg?label=version
[github-tag-url]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/releases/latest
[stackoverflow-img]: https://img.shields.io/badge/stackoverflow-electron_react_boilerplate-blue.svg
[stackoverflow-url]: https://stackoverflow.com/questions/tagged/electron-react-boilerplate -->
