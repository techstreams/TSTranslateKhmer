###
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
###

###
* Adds a custom menu to the active document
###
`function onOpen() {
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
}`

###
 * Setup form submit trigger
###
`function enableSubmitTrigger() {
  var tstk;
  tstk = new TSTranslateKhmer(FormApp.getActiveForm()).setFormTrigger('checkResponses');
  FormApp.getUi().alert('Form Submit Trigger has been enabled.');
}`

###
 * Create the form
###
`function createForm() {
  var tstk;
  tstk = new TSTranslateKhmer(FormApp.getActiveForm()).createForm();
  FormApp.getUi().alert('Form has been created.');
}`

###
 * Convert form text to Khmer
###
`function translateToKhmer() {
  var tstk;
  tstk = new TSTranslateKhmer(FormApp.getActiveForm()).translateText('en', 'km');
  FormApp.getUi().alert('Form text has been translated to Khmer.');
}`

###
 * Convert form text to English
###
`function translateToEnglish() {
  var tstk;
  tstk = new TSTranslateKhmer(FormApp.getActiveForm()).translateText('km', 'en');
  FormApp.getUi().alert('Form text has been translated to English.');
}`


###
 * Process form response
 * @param {object} form submit trigger event
###
`function checkResponses(e) {
  var tstk;
  try {
    tstk = new TSTranslateKhmer(FormApp.getActiveForm(), e.response).sendEmail(); 
  } catch(error) {
    // Send errors to owner
    MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'TSTranslateKhmer: Error processing form submission', error.message);
  }
}`

###
* Define TSTranslateKhmer Class
###

do ->

  ###
  * TSTranslateKhmer
  * @class
  ###
  class @TSTranslateKhmer
    ###
    * @constructor
    * @param {object} form object
    * @param {object} form response object
    * @param {string} email template name
    * @param {string} email subject line
    * @return {TSTranslateKhmer} this object for chaining
    ###
    constructor: (@form, @formResponse = null, @email = 'email', @subjectline = 'Form Submission') ->
      @lang =
        to: 'en'
        from: 'km'
      @meta = null
      @

    # PUBLIC FUNCTIONS

    ###
    * Create Form
    * @return {TSTranslateKhmer} this object for chaining
    ###
    createForm: ->
      @clearForm_()
      @form.setTitle('Khmer to English Translator').setDescription('Complete the following form.  Click the button to submit.').setConfirmationMessage('Your response has been submitted.')
      @form.addParagraphTextItem()
        .setTitle('Message')
        .setHelpText('Enter your message in the Khmer language.')
        .setRequired(true)
      @

    ###
    * Generate form meta and send email
    * @return {TSTranslateKhmer} this object for chaining
    ###
    sendEmail: ->
      # Generate an object with form submission data
      @generateFormResponseMeta_()

      # Send email
      if @meta
        @sendEmail_()
      @

    ###
    * Translate text
    * @return {TSTranslateKhmer} this object for chaining
    ###
    sendEmail: ->
      # Generate an object with form submission data
      @generateFormResponseMeta_()

      # Send email
      if @meta
        @sendEmail_()
      @

    ###
    * Set a form trigger for processing form responses
    * @param {string} function name to be run on trigger
    * @return {TSTranslateKhmer} this object for chaining
    ###
    setFormTrigger: (functionName) ->
      # Set form submit trigger - call when generating form
      triggers = ScriptApp.getProjectTriggers()
      triggers.forEach (trigger) ->
        ScriptApp.deleteTrigger(trigger)
      ScriptApp.newTrigger(functionName)
        .forForm(@form)
        .onFormSubmit()
        .create()
      @

    ###
    * Translate form text
    * @return {TSTranslateKhmer} this object for chaining
    ###
    translateText: (from, to) ->
      @form.setTitle(LanguageApp.translate(@form.getTitle(), from, to))
      if @form.getDescription() and @form.getDescription() isnt ''
        @form.setDescription(LanguageApp.translate(@form.getDescription(), from, to))
      if @form.getConfirmationMessage() and @form.getConfirmationMessage() isnt ''
        @form.setConfirmationMessage(LanguageApp.translate(@form.getConfirmationMessage(), from, to))
      children = @form.getItems()
      children.forEach (item) =>
        if item.getTitle() and item.getTitle() isnt ''
          item.setTitle(LanguageApp.translate(item.getTitle(), from, to))
        if item.getHelpText() and item.getHelpText() isnt ''
          item.setHelpText(LanguageApp.translate(item.getHelpText(), from, to))
      @

    # PRIVATE FUNCTIONS

    ###
    * Remove form items
    * @return {TSTranslateKhmer} this object for chaining
    * @private
    ###
    clearForm_: ->
      children = @form.getItems()
      children.forEach (item) =>
        @form.deleteItem(item)
    @

    ###
    * Generate form response meta
    * @return {TSTranslateKhmer} this object for chaining
    * @private
    ###
    generateFormResponseMeta_: ->
      if @formResponse
        meta = new Object()
        meta.url = @form.getPublishedUrl()
        meta.title = @form.getTitle()
        if @form.collectsEmail()
          meta.submitter = @formResponse.getRespondentEmail()
        msgItems = @getFormResponseItemsByType_(@formResponse, FormApp.ItemType.PARAGRAPH_TEXT)
        if msgItems.length > 0
          meta.msg = msgItems[0].response
          meta.msgtranslated = LanguageApp.translate(msgItems[0].response, @lang.from, @lang.to)
          @meta = meta
        else
          throw new Error('Message form item missing in form submission!')
      @

    ###
    * Get response items by type
    * @param {object} form response object
    * @param {object} form response item type
    * @return {array} array of form objects by type
    * @private
    ###
    getFormResponseItemsByType_: (response, type) ->
      items = []
      response.getItemResponses().forEach (ir) ->
        item = ir.getItem()
        if item.getType() is type
          itemObj = new Object()
          switch item.getType()
            when FormApp.ItemType.CHECKBOX
              submitType = true
              itemObj.type = 'checkbox'
            when FormApp.ItemType.DATE
              submitType = true
              itemObj.type = 'date'
            when FormApp.ItemType.DATETIME
              submitType = true
              itemObj.type = 'datetime'
            when FormApp.ItemType.DURATION
              submitType = true
              itemObj.type = 'duration'
            when FormApp.ItemType.GRID
              submitType = true
              itemObj.type = 'grid'
            when FormApp.ItemType.LIST
              submitType = true
              itemObj.type = 'list'
            when FormApp.ItemType.MULTIPLE_CHOICE
              submitType = true
              itemObj.type = 'multiplechoice'
            when FormApp.ItemType.PARAGRAPH_TEXT
              submitType = true
              itemObj.type = 'paragraph'
            when FormApp.ItemType.SCALE
              submitType = true
              itemObj.type = 'scale'
            when FormApp.ItemType.TEXT
              submitType = true
              itemObj.type = 'text'
            when FormApp.ItemType.TIME
              submitType = true
              itemObj.type = 'time'
            else
              submitType = false
          if submitType
            itemObj.helptext = item.getHelpText()
            itemObj.index = item.getIndex()
            itemObj.id = item.getId()
            itemObj.response = ir.getResponse()
            itemObj.title = item.getTitle()
            items.push itemObj
        null
      items

    ###
    * Send email
    * @return {TSTranslateKhmer} this object for chaining
    * @private
    ###
    sendEmail_: () ->
      email = HtmlService.createTemplateFromFile(@email)
      email.meta = @meta
      params =
        htmlBody: email.evaluate().getContent()
      MailApp.sendEmail(Session.getEffectiveUser().getEmail(), @subjectline, "", params)
      @







