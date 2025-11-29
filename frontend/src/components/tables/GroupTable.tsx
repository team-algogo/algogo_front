import GroupTableItem from "./GroupTableItem";

const GroupTable = () => {
  return (
    <table>
      <thead className="border-b-2 border-b-primary-400">
        <tr>
          <th className="px-6 py-3">Day</th>
          <th className="px-6 py-3">문제 제목</th>
          <th className="px-6 py-3">난이도</th>
          <th className="px-6 py-3">해결</th>
          <th className="px-6 py-3">제출 수</th>
          <th className="px-6 py-3">조회수</th>
          <th className="px-6 py-3">참여자 수</th>
          <th className="px-6 py-3">정답</th>
          <th className="px-6 py-3">정답률</th>
          <th className="px-6 py-3">풀기버튼</th>
        </tr>
      </thead>
      <tbody>
        <GroupTableItem />
      </tbody>
    </table>
  );
};

export default GroupTable;
