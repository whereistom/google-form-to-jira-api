//
// This script takes the user inputs from the Google Form, and will create a JIRA issue when the form is submitted via the REST API
// Takes user input info, and passes it into an event parameter "e"
//
function createIssue(e){  
//
// Assign variables to the form data submitted by the requestor from the spreadsheet associated with the Google form.
// NOTE: Update the [n] to the cell value in your spreadsheet.
// Timestamp	Email Address	RFE Title	Due Date	Link to hubspot


var email = e.values[1];
var title = e.values[2];
var description = e.values[3];
var hubspotUrl = JSON.stringify(e.values[4])
var dueDate = e.values[5];
var formattedDate = Utilities.formatDate(new Date(dueDate), "GMT", "yyyy-MM-dd");
var extraUrl = e.values[6];



//
// The dueDate variable requires a formatting update in order that JIRA accepts it
// Date format becomes YYYY-MM-DD, and is called later in the data posted to the API
// 


//
// Contact names
//
//
// Assign variable to your instance JIRA API URL
//
  var url = "https://<your instance here>.atlassian.net/rest/api/3/issue";
//
// The POST data for the JIRA API call
// Timestamp	Email Address	RFE Title	Due Date	Link to hubspot
//
// Timestamp	
// Email Address	
// Title for you request	
// Due Date  (wishful desired date for outcome)	
// Link to Hubspot	
// Description of your request for enhancement. Be as detailed as you can.	
// Add extra Hubspot links or other resources you feel necessary to qualify the RFE.	
// Attach a file that was not possible to include in the Hubspot documents section							
//
//       "reporter": { "name": email },
//      I

// The following custom fields are for the various strings and are simple text fields in JIRA
// You can find all the custom fields by looking here: https://<YOUR_JIRA_INSTANCE>.atlassian.net/rest/api/latest/field/
//    


  var data = 
{
    "fields": {
       "project":{ 
          "key": "RFE"
       },
       "priority": {
          "name": "Low"
       },
      "description": {
            "type": "doc",
            "version": 1,
            "content": [
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": description + "\n"
                        }
                   ]
                }
            ]
        },
      "customfield_10307": extraUrl,
      "duedate": formattedDate,
      "customfield_10308": hubspotUrl,
      "summary": title,
      "issuetype":{
          "name": "Story"
       }
   }
};


//
// Turn all the post data into a JSON string to be sent to the API
//

  var payload = JSON.stringify(data);

//
// POST header information, including authorization information.  
// This API call is linked to an account in JIRA, and follows the Basic Authentication method ("username:password" are Base64 encoded)
//
  var headers = 
      { 
        "Content-Type": "application/json",
        "Accept": "application/json",
        "authorization":"Basic <Insert here the base64 ecoded string of email:atlassian-user-api-token>"
      };

//
// A final few options to complete the JSON string
//
  var options = 
      { 
        "Content-Type": "application/json",
        "method": "POST",
        "headers": headers,
        "muteHttpExceptions": false,
        "payload": payload
      };  

//
// Make the HTTP call to the JIRA API
//
  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getContentText());
//
// Parse the JSON response to use the Issue Key returned by the API in the email
//
  var dataAll = JSON.parse(response.getContentText());
  var issueKey = dataAll.key
  Logger.log(dataAll)
//append request id
//var sheet = SpreadsheetApp.getActiveSheet();
//  sheet.appendRow(['Jira Issue ID', issueKey ]);
//var lrow   = sheet.getLastRow();
//var lrange = sheet.getRange(lrow,startCol,1,data.length)
//lrange.setValues([issueKey]);
}
