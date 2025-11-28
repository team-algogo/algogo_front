import StaticsTableItem from "./StatisticsTableItem"

const StaticsTable = () => {
    return (
        <table>
            <thead className="border-b-2 border-b-primary-400">
                <tr >
                    <th className="px-6 py-3">순위</th>
                    <th className="px-6 py-3">사용자</th>
                    <th className="px-6 py-3">결과</th>
                    <th className="px-6 py-3">메모리</th>
                    <th className="px-6 py-3">시간</th>
                    <th className="px-6 py-3">언어</th>
                    <th className="px-6 py-3">제출일</th>
                    <th className="px-6 py-3">문제풀기</th>
                    <th className="px-6 py-3">리뷰</th>
                </tr>
            </thead>
            <tbody>
                <StaticsTableItem />
            </tbody>
        </table>
    )
}

export default StaticsTable;