var currentThread = 0;
var offset = 16;
function main() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var threads = GmailApp.search('label:applications');
  var cell = sheet.getRange(1, 1);
  cell.setValue("Total Jobs Applied To:");
  cell = sheet.getRange(1, 4);
  cell.setValue(threads.length);

  threads = GmailApp.search('label:rejections');
  cell = sheet.getRange(1, 10);
  cell.setValue(threads.length);
  cell = sheet.getRange(5, 8);
  cell.setValue("Total Jobs Rejected From:");

  threads = GmailApp.search('label:applications', 0, 15); //random // label:inbox-rejection.mbox  label:inbox-apply.mbox 


  for (i = 0; i < threads.length; i++) {
    var organization = "";
    var jobTitle = "";
    var org = ibmfunction(threads[i].getMessages()[0].getPlainBody());
    for (j = 0; j < org.length; j++) {
      if (org[j].type == "Organization") {
        organization = org[j].text;
      }

      if (org[j].type == "JobTitle") {
        jobTitle = org[j].text;
      }
    }
    cell = sheet.getRange(i + offset, 1);
    cell.setValue(organization);
    cell = sheet.getRange(i + offset, 2);
    cell.setValue(jobTitle);
    cell = sheet.getRange(i + offset, 3);
    cell.setValue(threads[i].getMessages()[0].getDate());
    cell = sheet.getRange(i + offset, 4);
    cell.setValue(threads[i].getMessages()[0].getFrom());

    console.log(org);
  }




  threads = GmailApp.search('label:rejections', 0, 15); //random // label:inbox-rejection.mbox  label:inbox-apply.mbox 
  cell = sheet.getRange(1, 8);
  cell.setValue(threads.length);

  for (i = 0; i < threads.length; i++) {
    var organization = " ";
    var jobTitle = " ";
    var org = ibmfunction(threads[i].getMessages()[0].getPlainBody());
    for (j = 0; j < org.length; j++) {
      if (org[j].type == "Organization") {
        organization = org[j].text;
      }

      if (org[j].type == "JobTitle") {
        jobTitle = org[j].text;
      }
    }
    cell = sheet.getRange(i + offset, 7);
    cell.setValue(organization);
    cell = sheet.getRange(i + offset, 8);
    cell.setValue(jobTitle);
    cell = sheet.getRange(i + offset, 9);
    cell.setValue(threads[i].getMessages()[0].getDate());
    cell = sheet.getRange(i + offset, 10);
    cell.setValue(threads[i].getMessages()[0].getFrom());

    console.log(org);
  }


}


function ibmfunction(text) {

  var payload = {

    "text": text,
    "features": {
      "entities": {
        "emotion": false,
        "sentiment": true,
        "limit": 4
      },
      "keywords": {
        "emotion": false,
        "sentiment": false,
        "limit": 4
      }
    }

  };
  var apiKey = '2_oavZUrF6MPMN49XNh09N8ECkjZwb200VWRrvXV4u7R';
  var url = "https://api.us-east.natural-language-understanding.watson.cloud.ibm.com/instances/33c5bcb8-fe87-45f6-89aa-9cbddb5e35a7/v1/analyze?version=2021-01-14";

  var response = UrlFetchApp.fetch(url, {
    "method": "POST",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "headers": {
      "Authorization": "Basic " + Utilities.base64Encode("apikey" + ":" + apiKey)
    }
  });
  // api:2_oavZUrF6MPMN49XNh09N8ECkjZwb200VWRrvXV4u7R
  //https://api.us-east.natural-language-understanding.watson.cloud.ibm.com/instances/33c5bcb8-fe87-45f6-89aa-9cbddb5e35a7
  var entities = JSON.parse(response).entities;
  return entities
  //console.log(entities);
};
