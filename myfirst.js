//127.0.0.1:3040
const http = require('http');
const url = require('url');
const fs = require('fs');
const mysql = require('mysql');
const { connect } = require('http2');

//로그인 정보
const login = {
    host : "127.0.0.1",
    //port : 3040,
    user : "root",
    password : "mysql",
    database : "bookstore"
};

//서버 생성
http.createServer((req, res)=>{
    //url 파서 & 페스 네임
    let url_parse = url.parse(req.url, true);
    let pathname = url_parse.pathname

    res.writeHead(200, {'Content-Type': 'text/html'});

    //인덱스 화면 불러오기
    if(pathname === '/bookstore_index'){
        fs.readFile("bookstore_index.html", (e, index)=>{
            res.end(index);
        })
    }
    //READ 동작
    else if(pathname === '/bookshelf/read.do'){
        const conn = mysql.createConnection(login);
        conn.query("SELECT * FROM BOOKSHELF", (e, result_book)=>{
            res.end( JSON.stringify(result_book)   );
            conn.end();
        })
    }
    //DELETE 동작
    else if(pathname === '/bookshelf/delete.do'){
        const conn = mysql.createConnection(login);
        conn.connect((e)=>{
            conn.query(
                "DELETE FROM BOOKSHELF WHERE ID=?", [url_parse.query["id"]], (e, result)=>{
                    // res.setHeader("Content-Type","application/json;charset=UTF-8");
                    res.end();
                    conn.end((e)=>{});
                }
            )
        })
    }
    //CREATE 동작
    else if(pathname === '/bookshelf/create.do'){
        let form_data_txt="";
        
        req.on("data", 
            (data1)=>{
                form_data_txt = form_data_txt + data1;
        });

        req.on("end", ()=>{
            const form = JSON.parse(form_data_txt);
            const conn = mysql.createConnection(login);
            conn.connect(
                (e)=>{
                    conn.query("INSERT INTO BOOKSHELF VALUES (?, ?, ?)", [form.id, form.name, form.genre], 
                    (e, result)=>{
                        res.end();
                        conn.end((e)=>{});
                    })
                }
            )

        })
    }
    //UPDATE 동작
    else if(pathname === '/bookshelf/update.do'){

        let form_data_txt="";
        
        req.on("data", 
            (data1)=>{
                form_data_txt = form_data_txt + data1;
        });

        req.on("end", ()=>{
            const form = JSON.parse(form_data_txt);
            const conn = mysql.createConnection(login);
            conn.connect(
                (e)=>{
                    conn.query("UPDATE BOOKSHELF SET NAME = ?, GENRE=? WHERE ID = ?", [ form.name, form.genre, form.id], 
                    (e, result)=>{
                        res.end();
                        conn.end((e)=>{});
                    })
                }
            )

        })

    }

}).listen(3040, ()=>{console.log("http://127.0.0.1:3040 or 127.0.0.1:3040/index.html");});