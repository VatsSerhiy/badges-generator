
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('/badges-generator/'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});


app.get('/findBadge', (req, res) => {
    let isFinded = true;
    const number = req.query.numberOfBadge;
    if (number == undefined) {
        res.render('findBadge2.ejs', { item: false })
    } else {
        findBadgeByNumber(number, function (element) {
            res.render('findBadge2.ejs', { item: element })
        });
    }
});

app.post('/save', (req, res) => {
    const data = req.body;          
    const number = data.number;
    const fullname = data.fullname;
    const course = data.course;
    const date = data.date;
    const end_date = data.end_date;
    saveInfoToDB(number, fullname, course, date, end_date);
});

app.get('/save', (req, res) => {
    res.redirect('/findBadge')
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});


function saveInfoToDB(number, fullname, course, date, end_date) {

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '2298',
        database: 'badges_db'
    });

    connection.query(
        'INSERT INTO badges (number, course, fullname, first_date, last_date) VALUES (?, ?, ?, ?, ?)', //у цьому запиті просимо вставити у бд значення номеру, курса, піб, та дат
        [number, course, fullname, date, end_date],
        (error, results) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Info has been saved to the database.');
            }
        }
    );
    connection.end();
}

async function findBadgeByNumber(number, callback) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '2298',
        database: 'badges_db'
    });

    const query = 'SELECT * FROM badges WHERE number = ?'; 
    connection.execute(query, [number], function (err, results, fields) {
        if (err) throw err;
        if (results.length > 0) {
            callback(results[0])
        } else {
            callback(null)
        }

        connection.end();
    });
}