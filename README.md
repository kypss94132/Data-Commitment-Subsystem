# Project Overview
This project introduces a new feature to the existing DISEL Editor, extending its capabilities to support domain adequacy through the implementation of a Data Commitment Subsystem. For a comprehensive overview of the background and motivation behind this work, please refer to the accompanying project report. This repository is focused on the technical implementation and usage instructions.

The project is built upon a version of the DISEL Editor originally provided by [Yijie Wang](https://github.com/YbJerry) [^sh]. It includes both the original source code and portions of the README content authored by [Yijie Wang](https://github.com/YbJerry) [^sh]. 

## Install DISEL Editor

Clone the repo and install dependencies:

```bash
git clone https://github.com/YbJerry/DIS_platform 
cd DIS_platform
npm install
```

## Running DISEL Editor

Start the app in the `dev` environment:

```bash
npm start
```

## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

## Running the API
This project includes API functionality for data extraction, storage, and database connectivity, primarily supporting data commitment subsystem. To run the API, you must have [Node.js](https://nodejs.org/en) installed on your system.  
**Important:** The following command is required to start when running the subsystem. Failing to run this may result in runtime errors.

```bash
node serve.js
```

## Download MySQL Workbench(optional)
When you click the ''Save Data to Database'' button in the DISEL Editor frontend, the saved data can be viewed and verified using [MySQL Workbench](https://www.mysql.com/products/workbench/).  MySQL Workbench provides a graphical interface to visualize, query, and manage the stored data in the database.  
**Note:** This tool is optional. If you're proficient with MySQL, you can also use the command line or terminal to run SQL queries directly without relying on a graphical interface.

<!-- ## Docs

See our [docs and guides here](https://electron-react-boilerplate.js.org/docs/installation) -->


## Maintainers

- [Yijie Wang](https://github.com/YbJerry) [^sh]
- Deemah Alomair [^mc]
- Yanyan Wang [^sh]
- Ridha Khedri [^mc]
- Yihai Chen [^sh]
- Yi-Leng Chen [^mc] (For data commitment subsystem part)

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
