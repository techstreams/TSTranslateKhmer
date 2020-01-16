#  TSTranslateKhmer

> Demonstration [Google Apps Script](https://www.google.com/script/start/) which translates *Cambodian Khmer* to *English* through a [Google Form](https://support.google.com/docs/topic/6063584) using [Google Translate](https://translate.google.com/).  An email containing both the *Khmer* text and *English* translation is automatically sent to the form owner each time a user submits to the form.   


## Install

Follow these instructions to install the **TSTranslateKhmer** script and host form into your Google Drive:

* Login to your [Google Drive](https://drive.google.com/).

* Access the [TSTranslateKhmer form](https://techstreams.page.link/TSTranslateKhmer).

* Click the ***Use Template*** button. *This will copy the form to your Google Drive.*


---


## Usage

See the [TSTranslateKhmer documentation](https://techstreams.github.io/TSTranslateKhmer)

**Important Usage Notes:**

* The Khmer text portion of the email may only be viewable in certain browsers such as **[Chrome](https://www.google.com/intl/en-US/chrome/browser/)**.  ***Other desktop or mobile browsers may not display the Khmer text.***

* Google Apps Scripts are subject to daily quota limits including the number of emails sent.   See the *Quota Limits* tab of the [Google Apps Script Dashboard](https://docs.google.com/macros/dashboard) for more information.

* TSTranslateKhmer may not be appropriate for high traffic forms, especially in cases where the form owner consistently receives quota limit exceeded notifications.  


---


## Contributing to this project

Contributions are welcome. Please take a moment to review the [guidelines for contributing](CONTRIBUTING.md) and check the [Change log](CHANGELOG.md) for any existing updates.

* [Bug reports](CONTRIBUTING.md#bug-reports)
* [Feature requests](CONTRIBUTING.md#feature-requests)
* [Pull requests](CONTRIBUTING.md#pull-requests)  


---


## Developer Notes

Edit [src/tstranslatekhmer.coffee](src/tstranslatekhmer.coffee) for all changes to [dist/code.gs](dist/code.gs) and use [Gulp](http://gulpjs.com/) to build.  *See the [Using CoffeeScript and Gulp](#using-coffeescript-and-gulp) section below for more information.*

Edit `.html` files directly in the [dist/ directory](./dist).


#### Using CoffeeScript and Gulp

Ensure that [Node.js](http://nodejs.org/) and [npm](https://github.com/npm/npm) are installed on your system.  *NOTE: Most Node.js installers include npm.*

To install dependencies, run the following command from the project's root directory *(you may need to run `sudo npm install` depending upon your environment)*:

```sh
$ npm install
```

Install [Gulp](http://gulpjs.com/) globally. *(You may need to run `sudo npm install --global gulp` depending upon your environment)*:

```sh
$ npm install --global gulp
```

**Code:**


To build code, edit the [source](src/tstranslatekhmer.coffee) and run the following command from the project's root directory:

```sh
$ gulp
```

*While developing, the `gulp dev` task may be useful.  Run the following command from the project's root directory:*

```sh
$ gulp dev
```

You can find gulp tasks in the [gulpfile](gulpfile.coffee).  


---


## License

Copyright 2014 [Laura Taylor](https://github.com/techstreams)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use the files except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
