import ProblemTableItem from "./ProblemTableItem";

const ProblemTable = () => {
    return (
        <table>
            <thead className="border-b-2 border-b-primary-400">
                <tr >
                    <th className="px-6 py-3">순위</th>
                    <th className="px-6 py-3">문제 제목</th>
                    <th className="px-6 py-3">난이도</th>
                    <th className="px-6 py-3">제출 수</th>
                    <th className="px-6 py-3">조회 수</th>
                    <th className="px-6 py-3">참여자 수</th>
                    <th className="px-6 py-3">정답률</th>
                    <th className="px-6 py-3">문제 풀기</th>
                </tr>
            </thead>
            <tbody>
                <ProblemTableItem />
                <ProblemTableItem />
            </tbody>
        </table>
    )
}

export default ProblemTable;