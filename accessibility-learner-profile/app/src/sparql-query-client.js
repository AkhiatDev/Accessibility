import axios from "axios";
import querystring from "query-string";

exports.doQuery = function (endpoint, query, successCallback){
        axios.post(endpoint, query.startsWith("INSERT")
        ? querystring.stringify({
            update: query
        })
        : querystring.stringify({
            query: query
        }), {
            headers:{
                'Content-Type':"application/x-www-form-urlencoded"
                // ,'Accept': 'application/ld+json, application/json'
                // ,'Content-Type':"application/x-www-form-urlencoded"
            }
        }).then(res => { 
            successCallback(res.data, parseSparqlResult(res.data))
            });
    }

function parseSparqlResult (strData) {
    var lines = strData.split("\r\n");
    var columns = lines[1].split("|");
    columns = columns.slice(1, columns.length - 1).map(column => {return column.trim();});
    var rows = lines.slice(3, lines.length - 2).map(row => {
        var rowValues = row.split("|");
        return rowValues.slice(1, rowValues.length - 1).map(rowValue => {return rowValue.trim();});
    });
    var result = [];
    rows.forEach(row => {
        var resultSetRow = {};
        for (var i =0; i< columns.length; i++) {
            resultSetRow[columns[i]] = row[i];
        }
        result.push(resultSetRow); 
    })
    return result;
}