eval(UrlFetchApp.fetch('https://tartarus.org/martin/PorterStemmer/js.txt').getContentText());

var str = ""
function isRejection(text) {
  var apiKey = "\AIzaSyCU-0vdVGw5v6WaI-lG3hHDQ0Wyr6mDX1k";
  var apiEndpoint = 'https://language.googleapis.com/v1beta2/documents:analyzeSentiment?key=' + apiKey;
  // Create our json request, w/ text, language, type & encoding
  var nlData = {
    document: {
      language: 'en-us',
      type: 'PLAIN_TEXT',
      content: text
    },
    encodingType: 'UTF8'
  };

  var nlOptions = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(nlData)
  };

  var response = UrlFetchApp.fetch(apiEndpoint, nlOptions);

  for (i = 0; i < JSON.parse(response).sentences.length; i++) {

    if (JSON.parse(response).sentences[i].sentiment.score < -0.5) {
      return true
    }
  }
  return false
};

function isWorkRelated(text) {
  var apiKey = "";
  var apiEndpoint = 'https://language.googleapis.com/v1/documents:classifyText?key=' + apiKey;
  // Create our json request, w/ text, language, type & encoding
  var nlData = {
    document: {
      language: 'en-us',
      type: 'PLAIN_TEXT',
      content: text
    }
  };

  var nlOptions = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(nlData)
  };

  var response = UrlFetchApp.fetch(apiEndpoint, nlOptions);

  for (i = 0; i < JSON.parse(response).categories.length; i++) {
    if (JSON.parse(response).categories[i].name.includes("Job")) {
      return true
    }
  }
  return false

};

var keywords = [];
function getData() {
  var values = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
  for (i = 0; i < 8; i++) {
    keywords[i] = values[i][0];
  }
  //Logger.log(keywords);
};

function isRelevent(text) {
  for (i = 0; i < keywords.length; i++) {
    if (text.includes(keywords[i])) {
      return true
    }
  }
  return false
};

var currentThread = 0;
function run() {
  getData();

  var threads = GmailApp.search('in:inbox'); //random // label:inbox-rejection.mbox  label:inbox-apply.mbox 
  var text = threads[currentThread].getMessages()[0].getPlainBody();
  text = removeExtraTrailingStuff(text);
  console.log(text);
 var label = GmailApp.getUserLabelByName("applications");
  rejection = isRejection(text);
  // catagories = retrieveCatagory(text);
  //Logger.log(entities);

  if (isRelevent(text) || isWorkRelated(text)) {
    Logger.log("some work related email");
    // decide if its a rejection or not
    if (rejection) {
    Logger.log("A rejection email");
    label  = GmailApp.getUserLabelByName("rejections");
    threads[currentThread].addLabel(label);
    threads[currentThread].moveToArchive();
    } else {
    Logger.log("An application email");
    label  = GmailApp.getUserLabelByName("applications");
    threads[currentThread].addLabel(label);
    threads[currentThread].moveToArchive();
    

    }


  } else {
    label  = GmailApp.getUserLabelByName("random");
    threads[currentThread].addLabel(label);
    threads[currentThread].moveToArchive();
    Logger.log("some random email");
  }


};

function runProgram() {
  var threads = GmailApp.search('label:inbox-interview.mbox ');
  for (i = 0; i < 1; i++) {
    var text = threads[i].getMessages()[0].getPlainBody();
    isRejection(text);
    //console.log("Done email #" + i);
    // str += "NEW EMAIL\n";
  }
  //console.log(str);
};

function removeExtraTrailingStuff(str) {
  str = str.toLowerCase();
  str = str.replace('taha', '');
  str = str.replace('memon', '');
  str = str.replace('dear', '');
  str = str.replace(/\s+/g, " ");
  str = str.replace(/[0-9]/g, ''); //removes digits 
  var foundTrailingWord = false;
  words = ['please do not', 'sincerely', 'best,', 'regards', 'respectfully,', 'thanks again', 'warmly,', 'cheers,', 'warmest,', 'reply', 'replies']

  var i = 0;
  while (!foundTrailingWord && i < words.length) {
    if (str.indexOf(words[i]) >= 0) {
      foundTrailingWord = true;
      str = str.substring(0, str.indexOf(words[i]));
    }
    i++;
  }

  var result = "";
  words = str.split(' ');
  for (var i = 0; i < words.length; i++) {
    if (words[i].length < 15) { //removes too long or short chars
      result += words[i] + ' ';
    }
  }

  return result;
}

function ibm() {

  text = "In the rugged Colorado Desert of California, there lies buried a treasure ship sailed there hundreds of years ago by either Viking or Spanish explorers. Some say this is legend; others insist it is fact";
  var apiKey = "";
  var apiEndpoint = 'https://cloud.ibm.com/apidocs/natural-language-understanding?code=dotnet-standard#service-endpoint/v1/analyze?version=2020-08-01';
  // Create our json request, w/ text, language, type & encoding
  var nlData = {
    document: {
      language: 'en-us',
      type: 'PLAIN_TEXT',
      content: text
    }
  };

  var nlOptions = {
    method: 'post',
    contentType: 'application/json',
    apikey: apiKey,
    payload: JSON.stringify(nlData)
  };

  var response = UrlFetchApp.fetch(apiEndpoint, nlOptions);
  for (i = 0; i < JSON.parse(response).categories.length; i++) {
    if (JSON.parse(response).categories[i].name.includes("Job")) {
      return true
    }
  }
  return false

};


var CLIENT_ID = '244337095539-fub54q1eirdv6db7pnff3ta3qmibfu25.apps.googleusercontent.com';
var CLIENT_SECRET = 'wRmwytAB2kWGDqx-xvzDdOpd'; 
var BASE_AUTH_URL = '';
var TOKEN_URL = 'https://oauth2.googleapis.com/token';
var API_SCOPE = 'com.intuit.quickbooks.accounting';
var REDIRECT_URI = 'http://www.google.com'; // Generate using the logRedirectUri() function mentioned at the end of this script
var RESPONSE_TYPE = 'code';





function getML() {
  var payload = {
 
    "textSnippet": {
      "content": "In the rugged Colorado Desert of California, there lies buried a treasure ship sailed there hundreds of years ago by either Viking or Spanish explorers. Some say this is legend; others insist it is fact",
      "mime_type": "text/plain"
    }

  };
  var apiKey = {};

  var url = "https://automl.googleapis.com/v1/projects/244337095539/locations/us-central1/models/TCN912306579007602688:predict";
  var service = getService();
  //if (service.hasAccess()) {
 var response = UrlFetchApp.fetch(url, {
    "method": "POST",
    "contentType": "application/json",
    //"//Authorization": apiKey,
    "payload": JSON.stringify(payload),
    "headers": {
      "Authorization" : 'Bearer ' + service.getAccessToken()
    }

  });

  //} else {
//console.log("no")

//  }
  var entities = response;
  console.log(response);

};




function reset() {
  getService().reset();
}

/**
 * Configures the service.
 */
function getService() {
  return OAuth2.createService('LazyDay')
      .setAuthorizationBaseUrl(BASE_AUTH_URL)
      .setTokenUrl(TOKEN_URL)
      .setClientId(CLIENT_ID)
      .setClientSecret(CLIENT_SECRET)
      .setScope(API_SCOPE)
      .setCallbackFunction('authCallback')
      .setParam('response_type', RESPONSE_TYPE)
      .setParam('state', getStateToken('authCallback')) // function to generate the state token on the fly
      .setPropertyStore(PropertiesService.getUserProperties());
}

/**
 * Handles the OAuth callback
 */
function authCallback(request) {
  var service = getService();
  var authorized = service.handleCallback(request);
  if (authorized) {
    Logger.log("Success!");
    return HtmlService.createHtmlOutput('Success!');
  } else {
    Logger.log("Denied!");
    return HtmlService.createHtmlOutput('Denied.');
  }
}

/** 
 * Generate a State Token
 */
function getStateToken(callbackFunction){
 var stateToken = ScriptApp.newStateToken()
     .withMethod(callbackFunction)
     .withTimeout(120)
     .createToken();
 return stateToken;
}

/**
 * Logs the redirect URI. Run this function to get the REDIRECT_URI to be mentioned at the top of this script. 
 */
function logRedirectUri() {
  Logger.log(getService().getRedirectUri());
}




function ibmfunction(){

  var payload = {
 
  "text": "IBM is an American multinational technology company headquartered in Armonk, New York, United States, with operations in over 170 countries.",
  "features": {
    "entities": {
      "emotion": false,
      "sentiment": true,
      "limit": 2
    },
    "keywords": {
      "emotion": false,
      "sentiment": false,
      "limit": 2
    }
  }

  };
  var apiKey = '';
  var url = "https://api.us-east.natural-language-understanding.watson.cloud.ibm.com/instances/33c5bcb8-fe87-45f6-89aa-9cbddb5e35a7/v1/analyze?version=2021-01-14";
  
 var response = UrlFetchApp.fetch(url, {
    "method": "POST",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "headers": {
      "Authorization" : "Basic " + Utilities.base64Encode("apikey" + ":" + apiKey)
    }
  });

  //https://api.us-east.natural-language-understanding.watson.cloud.ibm.com/instances/33c5bcb8-fe87-45f6-89aa-9cbddb5e35a7
  var entities = JSON.parse(response).entities;
  console.log(entities);
};

