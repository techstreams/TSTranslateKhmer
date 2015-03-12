
/*
* Copyright 2014 Laura Taylor
* (https://github.com/techstreams/TSTranslateKhmer)
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
 */

/*
* Adds a custom menu to the active document
 */
function onOpen() {
  FormApp.getUi()
      .createMenu('TSTranslateKhmer')
      .addItem('Create Form', 'createForm')
      .addItem('Enable Submit Trigger', 'enableSubmitTrigger')
      .addSubMenu(FormApp.getUi().createMenu('Utilities')
           .addItem('Translate Form Text to Khmer', 'translateToKhmer')
           .addItem('Translate Form Text to English', 'translateToEnglish'))
      .addSeparator()
      .addItem('About', 'about')
      .addToUi();
};

/*
 * Setup form submit trigger
 */
function enableSubmitTrigger() {
  var tstk;
  tstk = new TSTranslateKhmer(FormApp.getActiveForm()).setFormTrigger('checkResponses');
  FormApp.getUi().alert('Form Submit Trigger has been enabled.');
};

/*
 * Create the form
 */
function createForm() {
  var tstk;
  tstk = new TSTranslateKhmer(FormApp.getActiveForm()).createForm();
  FormApp.getUi().alert('Form has been created.');
};

/*
 * Convert form text to Khmer
 */
function translateToKhmer() {
  var tstk;
  tstk = new TSTranslateKhmer(FormApp.getActiveForm()).translateText('en', 'km');
  FormApp.getUi().alert('Form text has been translated to Khmer.');
};

/*
 * Convert form text to English
 */
function translateToEnglish() {
  var tstk;
  tstk = new TSTranslateKhmer(FormApp.getActiveForm()).translateText('km', 'en');
  FormApp.getUi().alert('Form text has been translated to English.');
};

/*
 * Show About Information
 */
function about() {
  FormApp.getUi().showModelessDialog(HtmlService.createHtmlOutputFromFile('about').setSandboxMode(HtmlService.SandboxMode.IFRAME), ' ');
};

/*
 * Process form response
 * @param {object} form submit trigger event
 */
function checkResponses(e) {
  var tstk;
  try {
    tstk = new TSTranslateKhmer(FormApp.getActiveForm(), e.response).sendEmail();
  } catch(error) {
    // Send errors to owner
    MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'TSTranslateKhmer: Error processing form submission', error.message);
  }
};

/*
* Define TSTranslateKhmer Class
 */
(function() {

  /*
  * TSTranslateKhmer
  * @class
   */
  return this.TSTranslateKhmer = (function() {

    /*
    * @constructor
    * @param {object} form object
    * @param {object} form response object
    * @param {string} email template name
    * @param {string} email subject line
    * @return {TSTranslateKhmer} this object for chaining
     */
    function TSTranslateKhmer(form, formResponse, email, subjectline) {
      this.form = form;
      this.formResponse = formResponse != null ? formResponse : null;
      this.email = email != null ? email : 'email';
      this.subjectline = subjectline != null ? subjectline : 'Form Submission';
      this.lang = {
        to: 'en',
        from: 'km'
      };
      this.meta = null;
      this;
    }


    /*
    * Create Form
    * @return {TSTranslateKhmer} this object for chaining
     */

    TSTranslateKhmer.prototype.createForm = function() {
      this.clearForm_();
      this.form.setTitle('Khmer to English Translator').setDescription('Complete the following form.  Click the button to submit.').setConfirmationMessage('Your response has been submitted.');
      this.form.addParagraphTextItem().setTitle('Message').setHelpText('Enter your message in the Khmer language.').setRequired(true);
      return this;
    };


    /*
    * Generate form meta and send email
    * @return {TSTranslateKhmer} this object for chaining
     */

    TSTranslateKhmer.prototype.sendEmail = function() {
      this.generateFormResponseMeta_();
      if (this.meta) {
        this.sendEmail_();
      }
      return this;
    };


    /*
    * Set a form trigger for processing form responses
    * @param {string} function name to be run on trigger
    * @return {TSTranslateKhmer} this object for chaining
     */

    TSTranslateKhmer.prototype.setFormTrigger = function(functionName) {
      var triggers;
      triggers = ScriptApp.getProjectTriggers();
      triggers.forEach(function(trigger) {
        return ScriptApp.deleteTrigger(trigger);
      });
      ScriptApp.newTrigger(functionName).forForm(this.form).onFormSubmit().create();
      return this;
    };


    /*
    * Translate form text
    * @return {TSTranslateKhmer} this object for chaining
     */

    TSTranslateKhmer.prototype.translateText = function(from, to) {
      var children;
      this.form.setTitle(LanguageApp.translate(this.form.getTitle(), from, to));
      if (this.form.getDescription() && this.form.getDescription() !== '') {
        this.form.setDescription(LanguageApp.translate(this.form.getDescription(), from, to));
      }
      if (this.form.getConfirmationMessage() && this.form.getConfirmationMessage() !== '') {
        this.form.setConfirmationMessage(LanguageApp.translate(this.form.getConfirmationMessage(), from, to));
      }
      children = this.form.getItems();
      children.forEach(function(item) {
        if (item.getTitle() && item.getTitle() !== '') {
          item.setTitle(LanguageApp.translate(item.getTitle(), from, to));
        }
        if (item.getHelpText() && item.getHelpText() !== '') {
          item.setHelpText(LanguageApp.translate(item.getHelpText(), from, to));
        }
        return null;
      });
      return this;
    };


    /*
    * Remove form items
    * @return {TSTranslateKhmer} this object for chaining
    * @private
     */

    TSTranslateKhmer.prototype.clearForm_ = function() {
      var children;
      children = this.form.getItems();
      return children.forEach((function(_this) {
        return function(item) {
          return _this.form.deleteItem(item);
        };
      })(this));
    };

    TSTranslateKhmer;


    /*
    * Generate form response meta
    * @return {TSTranslateKhmer} this object for chaining
    * @private
     */

    TSTranslateKhmer.prototype.generateFormResponseMeta_ = function() {
      var meta, msgItems;
      if (this.formResponse) {
        meta = new Object();
        meta.url = this.form.getPublishedUrl();
        meta.title = this.form.getTitle();
        if (this.form.collectsEmail()) {
          meta.submitter = this.formResponse.getRespondentEmail();
        }
        msgItems = this.getFormResponseItemsByType_(this.formResponse, FormApp.ItemType.PARAGRAPH_TEXT);
        if (msgItems.length > 0) {
          meta.msg = msgItems[0].response;
          meta.msgtranslated = LanguageApp.translate(msgItems[0].response, this.lang.from, this.lang.to);
          this.meta = meta;
        } else {
          throw new Error('Message form item missing in form submission!');
        }
      }
      return this;
    };


    /*
    * Get response items by type
    * @param {object} form response object
    * @param {object} form response item type
    * @return {array} array of form objects by type
    * @private
     */

    TSTranslateKhmer.prototype.getFormResponseItemsByType_ = function(response, type) {
      var items;
      items = [];
      response.getItemResponses().forEach(function(ir) {
        var item, itemObj, submitType;
        item = ir.getItem();
        if (item.getType() === type) {
          itemObj = new Object();
          switch (item.getType()) {
            case FormApp.ItemType.CHECKBOX:
              submitType = true;
              itemObj.type = 'checkbox';
              break;
            case FormApp.ItemType.DATE:
              submitType = true;
              itemObj.type = 'date';
              break;
            case FormApp.ItemType.DATETIME:
              submitType = true;
              itemObj.type = 'datetime';
              break;
            case FormApp.ItemType.DURATION:
              submitType = true;
              itemObj.type = 'duration';
              break;
            case FormApp.ItemType.GRID:
              submitType = true;
              itemObj.type = 'grid';
              break;
            case FormApp.ItemType.LIST:
              submitType = true;
              itemObj.type = 'list';
              break;
            case FormApp.ItemType.MULTIPLE_CHOICE:
              submitType = true;
              itemObj.type = 'multiplechoice';
              break;
            case FormApp.ItemType.PARAGRAPH_TEXT:
              submitType = true;
              itemObj.type = 'paragraph';
              break;
            case FormApp.ItemType.SCALE:
              submitType = true;
              itemObj.type = 'scale';
              break;
            case FormApp.ItemType.TEXT:
              submitType = true;
              itemObj.type = 'text';
              break;
            case FormApp.ItemType.TIME:
              submitType = true;
              itemObj.type = 'time';
              break;
            default:
              submitType = false;
          }
          if (submitType) {
            itemObj.helptext = item.getHelpText();
            itemObj.index = item.getIndex();
            itemObj.id = item.getId();
            itemObj.response = ir.getResponse();
            itemObj.title = item.getTitle();
            items.push(itemObj);
          }
        }
        return null;
      });
      return items;
    };


    /*
    * Send email
    * @return {TSTranslateKhmer} this object for chaining
    * @private
     */

    TSTranslateKhmer.prototype.sendEmail_ = function() {
      var email, params;
      email = HtmlService.createTemplateFromFile(this.email);
      email.meta = this.meta;
      params = {
        htmlBody: email.evaluate().getContent()
      };
      MailApp.sendEmail(Session.getEffectiveUser().getEmail(), this.subjectline, "", params);
      return this;
    };

    return TSTranslateKhmer;

  })();
})();
