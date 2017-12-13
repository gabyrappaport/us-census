let ResponseFormat = require('../utils/responseFormat');
let sqlite3 = require('sqlite3').verbose();
let config = require('../config/config.json');

// open the database
let db = new sqlite3.Database(config.dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the us-census database.');
});

let getVariables = async (req, res) =>{
    let dbTable = config.dbTable;
    let sqlVariable = 'PRAGMA table_info('+ dbTable +')';
    var variables = {variable: []};
    try{
        db.all(sqlVariable, function(err, rows){
            rows.forEach(function(row){
                variables.variable.push(`${row.name}`);
            })
            return new ResponseFormat(res).success(variables).send();
        });
    }catch(err){
        console.log(err);
        return new ResponseFormat(res).error(err).send();
    }
};


let getDemoData = async (req, res) => {
    let dbTable = config.dbTable;
    let limit = config.limit;
    let variable  = req.query.variable;

    if(!variable){
        return new ResponseFormat(res).error('titre de colonne nécessaire').send();
    }
    let sqlColumn = 'SELECT "' + variable + '" variable, COUNT( "' + variable + '" ) count, ROUND(AVG(age),2) averageAge FROM census_learn_sql WHERE age IS NOT null GROUP BY "' + variable + '" ORDER BY count DESC LIMIT ' + limit;

    try{
        var demoData = [];
        db.all(sqlColumn, function(err, rows) {
            rows.forEach(function (row){
                demoData.push({value: `${row.variable}`, count: `${row.count}`, averageAge: `${row.averageAge}`});    
            })
            return new ResponseFormat(res).success(demoData).send();
        });
    }catch (err){
        console.log(err);
        return new ResponseFormat(res).error(err).send();
    }
};

let getUnvailableStats = async (req, res) => {
    let dbTable = config.dbTable;
    let limit = config.limit;
    let variable  = req.query.variable;

    if(!variable){
        return new ResponseFormat(res).error('titre de colonne nécessaire').send();
    }

    let sqlUndisplayedValues = 'SELECT COUNT( DISTINCT "' + variable + '" ) - ' + limit + ' count FROM census_learn_sql ';
    let sqlTotalCount = 'SELECT COUNT ("' + variable + '") totalCount FROM census_learn_sql WHERE age IS NOT null';
    let sqlCountDisplayesLines = 'SELECT SUM(count) somme FROM ( SELECT COUNT( "' + variable + '" ) count FROM census_learn_sql WHERE age IS NOT null GROUP BY "' + variable + '"  ORDER BY count DESC LIMIT ' + limit + ')';

    try{
        var demoData = [];
        var totalCount = 0;
        var undisplayedValues = 0;
        var undisplayedLines = 0;

        db.get(sqlUndisplayedValues, function(err, row) {
            if ( `${row.count}` > 0){
                undisplayedValues = parseInt(`${row.count}`);
            }
        });
        db.get(sqlTotalCount, [], function(err, row) {
            totalCount = `${row.totalCount}`;
        });
        db.get(sqlCountDisplayesLines, [], function(err, row) {
            let countDisplayedLines = `${row.somme}`;
            undisplayedLines = totalCount - countDisplayedLines;
            demoData.push({undisplayedValues: undisplayedValues, undisplayedLines: undisplayedLines});
            console.log(undisplayedLines);
            console.log(undisplayedValues);
            return new ResponseFormat(res).success(demoData).send();
            });

    }catch (err){
        console.log(err);
        return new ResponseFormat(res).error(err).send();
    }
};
module.exports = { getVariables, getDemoData, getUnvailableStats};
