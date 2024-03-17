import React, { useEffect, useState } from "react";

const List = () => {
    const [data, setData] = useState([]);
    const [myBooks, setmyBooks] = useState([]);
    const [totalFine, setTotalFine] = useState(0)
    async function getList() {
        let result = await fetch('http://127.0.0.1:8080/getAllBooks')
        result = await result.json();
        console.log(result);
        setData(result)

        result = await fetch('http://127.0.0.1:8080/getBooksOfMembers/65f55fa132d3993717ce727c')
        result = await result.json()
        setTotalFine(result.totalFine)
        setmyBooks(result.books)
    }

    async function checkout(BookId,operation) {
        let url ;
        if(operation==='checkout'){
            url = "http://127.0.0.1:8080/assignBook"
        }else{
            url = "http://127.0.0.1:8080/returnBook"
        }
        const MemberId = "65f55fa132d3993717ce727c"
        let body = {
            "MemberId" : MemberId,"BookId" : BookId,"returnAfter":7
           }
        console.log(BookId,{
            MemberId,BookId,returnAfter:7
           });
        let result = await fetch(url, {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(body),
           });
           console.log(result);
        if(result.status ==200){
            setmyBooks(myBooks.filter((x)=> x._id !== BookId))
        }
    }

    useEffect(() => {
        getList()
    }, [])
    return (
        <div>
            <h1>Available Books</h1>
            {data.map(ele => {
                return <ul key={ele._id}>
                    <h4 color="#000">{`Name : ${ele.BookName} :: Available : ${ele.NumberOfCopies}`}</h4>
                    <button onClick={() => { checkout(ele._id, "checkout") }}>Checkout</button>
                </ul>
            })}

            <h1>My Books</h1>
            {myBooks.map(ele => {
                return <ul key={ele._id}>
                    <h4 color="#000">{`Name : ${ele.BookName} :: Available : ${ele.NumberOfCopies} ${ele.overdue ? ` :: Overdure by ${ele.overdue} days` : ""}`}</h4>
                    <button onClick={() => { checkout(ele._id, "return") }}>return</button>
                </ul>
            })}
            <h1>{`TotalFine :: ${totalFine}`}</h1>
        </div>
    )
}

export default List