import React from 'react';
import { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import axios from 'axios';

const Contents = () => {

    const [confirmedData, setConfirmedData] = useState({
        labels: ["1월", "2월", "3월"],
        datasets: [
            {
                label: "국내 누적 확진자",
                backgroundColor: "salmon",
                fill: true,
                data: [10, 5, 3]
            },
        ]
    })


    // async랑 await를 쓰지 않으면 다 불러와지기 전에 변수에 담겨서 consol에 찍힘. 그래서 이 두 개를 써주는 것.
    useEffect(() => {
        const fetchEvents = async () => {
            const res = await axios.get("https://api.covid19api.com/total/dayone/country/kr");
            // makeData를 return
            makeData(res.data)
        }

        // 위에서 넘어온 makeData를 items라는 프로퍼티에 넣음.
        const makeData = (items) => {
            const arr = items.reduce((acc, cur) => {
                const currentDate = new Date(cur.Date);
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const date = currentDate.getDate();
                const confirmed = cur.Confirmed;
                const active = cur.Active;
                const death = cur.Deaths;
                const recovered = cur.Recovered;

                const findItem = acc.find(a => a.year === year && a.month === month);

                if (!findItem) {
                    acc.push({
                        // key와 value가 같으면 생략 가능! year, month 이런 식으로
                        year: year,
                        month: month,
                        date: date,
                        confirmed: confirmed,
                        active: active,
                        death: death,
                        recovered: recovered
                    })
                    if (findItem && findItem.date < date) {
                        findItem.active = active;
                        findItem.death = death;
                        findItem.date = date;
                        findItem.year = year;
                        findItem.month = month;
                        findItem.recovered = recovered;
                        findItem.confirmed = confirmed;
                    }
                }

                return acc;
            }, [])

        }

        fetchEvents()
    })

    return (
        <div>
            <section>
                <h2>국내 코로나 현황</h2>
                <div className="contents">
                    <div>
                        <Bar data={confirmedData} options={
                            { title: { display: true, text: "누적 확진자 추이", fontSize: 16 } },
                            { legend: { display: true, positon: "bottom" } }
                        } />

                    </div>
                </div>
            </section>
        </div >
    );
};

export default Contents;