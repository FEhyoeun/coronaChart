import React from 'react';
import { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import axios from 'axios';

const Contents = () => {

    const [confirmedData, setConfirmedData] = useState({})
    const [quarantinedData, setQuarantinedData] = useState({})
    const [comparedData, setComparedData] = useState({})


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

            const labels = arr.map(a => `${a.month + 1}월`);

            // label에 들어갈 문자 변수로 만듦.
            const confirmedText = '국내 누적 확진자';
            const quarantinedText = '월별 격리자 현황';
            const comparedText = '확진자, 격리 해제, 사망';

            // state를 업데이트. OBJ 형태로 업데이트를 시킴
            setConfirmedData({
                // 이것도 key와 value가 같으니까 생략 가능.
                labels: labels,
                datasets: [
                    {
                        label: confirmedText,
                        backgroundColor: "salmon",
                        fill: true,
                        data: arr.map(a => a.confirmed) // 이것도 arrow function처럼 {}랑 return 생략한 거!
                    },
                ]
            });

            setQuarantinedData({
                // 이것도 key와 value가 같으니까 생략 가능. 이건 생략한 버전
                labels,
                datasets: [
                    {
                        label: quarantinedText,
                        borderColor: "salmon",
                        fill: false,
                        data: arr.map(a => a.active) // 이것도 arrow function처럼 {}랑 return 생략한 거!
                    },
                ]
            });

            const last = arr[arr.length - 1]
            setComparedData({
                // 이것도 key와 value가 같으니까 생략 가능. 이건 생략한 버전
                labels: ["확진자", "격리 해제", "사망"],
                datasets: [
                    {
                        label: comparedText,
                        backgroundColor: ["#ff3d67", "#059bff", "#ffc233"],
                        borderColor: ["#ff3d67", "#059bff", "#ffc233"],
                        fill: false,
                        data: [last.confirmed, last.recovered, last.death]
                    },
                ]
            });

        }

        fetchEvents();
    }, []) // 두 번째에 배열을 선언해야 계속적으로 요청하는 걸 방지함.

    return (
        <div>
            <section>
                <h2 className="main_title">국내 코로나 현황</h2>
                <div className="contents">
                    <Bar data={confirmedData} options={
                        { title: { display: true, text: "누적 확진자 추이", fontSize: 16 } },
                        { legend: { display: true, positon: "bottom" } }
                    } />

                    <Line data={quarantinedData} options={
                        { title: { display: true, text: "월별 격리자 현황", fontSize: 16 } },
                        { legend: { display: true, positon: "bottom" } }
                    } />

                    <Doughnut data={comparedData} options={
                        { title: { display: true, text: `누적 확진, 해제, 사망 (${new Date().getMonth() + 1}월)`, fontSize: 16 } },
                        { legend: { display: true, positon: "bottom" } }
                    } />
                </div>
            </section>
        </div >
    );
};

export default Contents;